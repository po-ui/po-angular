const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

console.log(`Node.js version: ${process.version}`);

const app = express();
const PORT = process.env.PORT || 3333;

// Carrega .env se existir (lê GEMINI_API_KEY do arquivo para evitar problemas com bash)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log(`[AI Server] Carregando .env de ${envPath}`);
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// Detecta qual provedor de IA usar: Groq (preferido) ou Gemini (fallback)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_PROVIDER = GROQ_API_KEY ? 'groq' : GEMINI_API_KEY ? 'gemini' : null;

// Suporte a proxy corporativo
const PROXY_URL = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;

if (!AI_PROVIDER) {
  console.error('\n===========================================');
  console.error('  Nenhuma API key configurada!');
  console.error('');
  console.error('  Crie o arquivo .env nesta pasta com UMA das opcoes:');
  console.error('');
  console.error('  Opcao 1 - Groq (recomendado, gratis sem billing):');
  console.error('    GROQ_API_KEY=sua-chave-groq');
  console.error('    (Gere em: https://console.groq.com/keys)');
  console.error('');
  console.error('  Opcao 2 - Gemini:');
  console.error('    GEMINI_API_KEY=sua-chave-gemini');
  console.error('    (Gere em: https://aistudio.google.com/apikey)');
  console.error('===========================================\n');
  process.exit(1);
}

const apiKey = GROQ_API_KEY || GEMINI_API_KEY;
console.log(`[AI Server] Provedor: ${AI_PROVIDER.toUpperCase()}`);
console.log(`[AI Server] API Key: ${apiKey.slice(0, 5)}...${apiKey.slice(-5)} (${apiKey.length} chars)`);

if (PROXY_URL) {
  console.log(`[AI Server] Proxy corporativo detectado: ${PROXY_URL}`);
}

app.use(cors());
app.use(express.json());

function buildPrompt(query, columns) {
  const columnsDescription = columns
    .map(col => `- ${col.property} (${col.type || 'string'}): ${col.label}`)
    .join('\n');

  return `Você é um assistente especializado em converter consultas em linguagem natural para filtros OData v4.
Sua tarefa é analisar a consulta do usuário e gerar um filtro OData válido baseado nas colunas disponíveis.

Colunas disponíveis na tabela:
${columnsDescription}

Regras para gerar o filtro OData:
1. Use apenas as colunas listadas acima
2. Para strings, use: eq, ne, contains(), startswith(), endswith()
3. Para números, use: eq, ne, gt, ge, lt, le
4. Para datas, use: eq, ne, gt, ge, lt, le (formato: yyyy-MM-dd)
5. Para combinar filtros, use: and, or
6. Strings devem estar entre aspas simples: 'valor'
7. Funções como contains() são case-insensitive por padrão no OData
8. Se o usuário mencionar "maior que", use gt. "menor que" use lt. "igual a" use eq.
9. Se o usuário mencionar "entre X e Y", use: campo ge X and campo le Y
10. Se o usuário mencionar "contém", use: contains(campo, 'valor')

Consulta do usuário: "${query}"

Responda APENAS com um JSON válido no formato abaixo, sem markdown, sem explicações adicionais:
{
  "filter": "filtro OData aqui",
  "description": "descrição curta do que o filtro faz em português",
  "confidence": 0.0 a 1.0
}

Se não conseguir gerar um filtro válido, retorne confidence 0 e filter vazio.`;
}

// ============================================================
// Chamada a API do Groq (formato OpenAI-compatible)
// ============================================================
function callGroqAPISingle(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const targetHost = 'api.groq.com';
    const targetPath = '/openai/v1/chat/completions';
    const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

    const commonHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${GROQ_API_KEY}`
    };

    function handleResponse(res) {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log(`[AI Search] Status HTTP: ${res.statusCode}`);
        if (res.statusCode !== 200) {
          console.error(`[AI Search] Erro Groq (HTTP ${res.statusCode}): ${data}`);
          const error = new Error(`Groq API retornou status ${res.statusCode}`);
          error.statusCode = res.statusCode;
          error.responseBody = data;
          reject(error);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.message?.content;
          if (!text) {
            reject(new Error('Resposta do Groq sem conteudo de texto'));
            return;
          }
          resolve(text);
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta do Groq: ${e.message}`));
        }
      });
    }

    function handleError(e) {
      console.error(`[AI Search] Erro de conexao Groq: ${e.message}`);
      reject(new Error(`Erro de conexao com Groq API: ${e.message}`));
    }

    console.log(`[AI Search] Chamando Groq API...`);

    if (PROXY_URL) {
      const proxy = url.parse(PROXY_URL);
      console.log(`[AI Search] Usando proxy: ${proxy.hostname}:${proxy.port}`);

      const connectReq = http.request({
        hostname: proxy.hostname,
        port: proxy.port || 80,
        method: 'CONNECT',
        path: `${targetHost}:443`,
        headers: { 'Host': `${targetHost}:443` }
      });

      connectReq.on('connect', (res, socket) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Proxy CONNECT falhou com status ${res.statusCode}`));
          return;
        }

        const req = https.request({
          socket,
          hostname: targetHost,
          path: targetPath,
          method: 'POST',
          rejectUnauthorized,
          headers: { ...commonHeaders, 'Host': targetHost }
        }, handleResponse);

        req.on('error', handleError);
        req.setTimeout(30000, () => {
          req.destroy();
          reject(new Error('Timeout na chamada ao Groq API (30s)'));
        });
        req.write(postData);
        req.end();
      });

      connectReq.on('error', (e) => {
        reject(new Error(`Erro ao conectar no proxy corporativo: ${e.message}`));
      });
      connectReq.setTimeout(15000, () => {
        connectReq.destroy();
        reject(new Error('Timeout ao conectar no proxy corporativo (15s)'));
      });
      connectReq.end();
    } else {
      const req = https.request({
        hostname: targetHost,
        path: targetPath,
        method: 'POST',
        rejectUnauthorized,
        headers: commonHeaders
      }, handleResponse);

      req.on('error', handleError);
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Timeout na chamada ao Groq API (30s)'));
      });
      req.write(postData);
      req.end();
    }
  });
}

// ============================================================
// Chamada a API do Gemini (https nativo)
// ============================================================
function callGeminiAPISingle(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });

    const targetHost = 'generativelanguage.googleapis.com';
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const targetPath = `/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    // Em redes corporativas com inspeção SSL, o firewall re-assina certificados
    // causando "self-signed certificate in certificate chain"
    const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

    const commonHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'x-goog-api-key': GEMINI_API_KEY
    };

    function handleResponse(res) {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log(`[AI Search] Status HTTP: ${res.statusCode}`);
        if (res.statusCode !== 200) {
          console.error(`[AI Search] Erro Gemini (HTTP ${res.statusCode})`);
          const error = new Error(`Gemini API retornou status ${res.statusCode}`);
          error.statusCode = res.statusCode;
          error.responseBody = data;
          reject(error);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            reject(new Error('Resposta do Gemini sem conteúdo de texto'));
            return;
          }
          resolve(text);
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta do Gemini: ${e.message}`));
        }
      });
    }

    function handleError(e) {
      console.error(`[AI Search] Erro de conexão: ${e.message}`);
      if (e.cause) {
        console.error(`[AI Search] Causa: ${e.cause.message || e.cause}`);
      }
      reject(new Error(`Erro de conexão com Gemini API: ${e.message}`));
    }

    console.log(`[AI Search] Chamando Gemini API (https nativo)...`);

    let req;

    if (PROXY_URL) {
      // Usa HTTP CONNECT tunnel via proxy corporativo
      const proxy = url.parse(PROXY_URL);
      console.log(`[AI Search] Usando proxy: ${proxy.hostname}:${proxy.port}`);

      const connectReq = http.request({
        hostname: proxy.hostname,
        port: proxy.port || 80,
        method: 'CONNECT',
        path: `${targetHost}:443`,
        headers: { 'Host': `${targetHost}:443` }
      });

      connectReq.on('connect', (res, socket) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Proxy CONNECT falhou com status ${res.statusCode}`));
          return;
        }

        req = https.request({
          socket,
          hostname: targetHost,
          path: targetPath,
          method: 'POST',
          rejectUnauthorized,
          headers: { ...commonHeaders, 'Host': targetHost }
        }, handleResponse);

        req.on('error', handleError);
        req.setTimeout(30000, () => {
          req.destroy();
          reject(new Error('Timeout na chamada ao Gemini API (30s)'));
        });
        req.write(postData);
        req.end();
      });

      connectReq.on('error', (e) => {
        console.error(`[AI Search] Erro ao conectar no proxy: ${e.message}`);
        reject(new Error(`Erro ao conectar no proxy corporativo: ${e.message}`));
      });

      connectReq.setTimeout(15000, () => {
        connectReq.destroy();
        reject(new Error('Timeout ao conectar no proxy corporativo (15s)'));
      });

      connectReq.end();
    } else {
      // Conexão direta sem proxy
      const options = {
        hostname: targetHost,
        path: targetPath,
        method: 'POST',
        rejectUnauthorized,
        headers: commonHeaders
      };

      req = https.request(options, handleResponse);
      req.on('error', handleError);
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Timeout na chamada ao Gemini API (30s)'));
      });
      req.write(postData);
      req.end();
    }
  });
}

// Wrapper com retry automatico para erros 429 (rate limit)
async function callAI(prompt, maxRetries = 3) {
  const callSingle = AI_PROVIDER === 'groq' ? callGroqAPISingle : callGeminiAPISingle;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callSingle(prompt);
    } catch (error) {
      if (error.statusCode === 429 && attempt < maxRetries) {
        // Extrai o tempo de espera sugerido pelo Gemini, ou usa backoff exponencial
        let waitTime = attempt * 20;
        const retryMatch = error.responseBody?.match(/retry in ([\d.]+)s/i);
        if (retryMatch) {
          waitTime = Math.ceil(parseFloat(retryMatch[1])) + 2;
        }
        console.log(`[AI Search] Rate limit (429). Aguardando ${waitTime}s antes do retry ${attempt}/${maxRetries - 1}...`);
        await new Promise(r => setTimeout(r, waitTime * 1000));
        continue;
      }
      throw error;
    }
  }
}

// Endpoint de health check
app.get('/api/ai/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    provider: AI_PROVIDER,
    proxy: PROXY_URL || 'nenhum',
    apiKeyConfigured: !!apiKey,
    nodeVersion: process.version
  });
});

app.post('/api/ai/filter', async (req, res) => {
  try {
    const { query, columns } = req.body;

    if (!query || !columns) {
      return res.status(400).json({
        filter: '',
        description: 'Query e columns são obrigatórios',
        confidence: 0
      });
    }

    console.log(`\n[AI Search] Query: "${query}"`);
    console.log(`[AI Search] Columns: ${columns.map(c => c.property).join(', ')}`);
    console.log(`[AI Search] Provedor: ${AI_PROVIDER}`);

    const prompt = buildPrompt(query, columns);
    const text = await callAI(prompt);

    console.log(`[AI Search] Resposta: ${text}`);

    // Limpar possíveis marcações de markdown do response
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7);
    }
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsed = JSON.parse(cleanText);

    console.log(`[AI Search] Filter: ${parsed.filter}`);
    console.log(`[AI Search] Confidence: ${parsed.confidence}`);

    res.json({
      filter: parsed.filter || '',
      description: parsed.description || '',
      confidence: parsed.confidence || 0
    });
  } catch (error) {
    console.error('[AI Search] Erro:', error.message);
    res.status(500).json({
      filter: '',
      description: `Erro ao processar: ${error.message}`,
      confidence: 0
    });
  }
});

app.listen(PORT, () => {
  const providerInfo = AI_PROVIDER === 'groq'
    ? `Provedor: Groq (${process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'})`
    : `Provedor: Gemini (${process.env.GEMINI_MODEL || 'gemini-2.0-flash'})`;

  console.log(`\n===========================================`);
  console.log(`  AI Server rodando em http://localhost:${PORT}`);
  console.log(`  Endpoint: POST http://localhost:${PORT}/api/ai/filter`);
  console.log(`  Health:   GET  http://localhost:${PORT}/api/ai/health`);
  console.log(`  ${providerInfo}`);
  console.log(`  TLS verify: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0' ? 'sim' : 'NAO (NODE_TLS_REJECT_UNAUTHORIZED=0)'}`);
  if (PROXY_URL) console.log(`  Proxy: ${PROXY_URL}`);
  console.log(`===========================================\n`);
});
