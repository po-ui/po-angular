const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const url = require('url');

console.log(`Node.js version: ${process.version}`);

const app = express();
const PORT = process.env.PORT || 3333;

// API Key do Gemini - passar via variável de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Suporte a proxy corporativo via variável de ambiente
const PROXY_URL = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;

if (!GEMINI_API_KEY) {
  console.error('\n===========================================');
  console.error('  GEMINI_API_KEY não configurada!');
  console.error('  Execute com: GEMINI_API_KEY=sua-chave node server.js');
  console.error('===========================================\n');
  process.exit(1);
}

// Diagnóstico da API key (mostra apenas início/fim para não expor a chave completa)
console.log(`[AI Server] API Key: ${GEMINI_API_KEY.slice(0, 5)}...${GEMINI_API_KEY.slice(-5)} (${GEMINI_API_KEY.length} chars)`);

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

// Chamada direta à API REST do Gemini usando módulo https nativo do Node.js
// Suporta proxy corporativo via HTTPS_PROXY
// Aceita certificados auto-assinados (inspeção SSL corporativa) via NODE_TLS_REJECT_UNAUTHORIZED=0
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });

    const targetHost = 'generativelanguage.googleapis.com';
    const targetPath = `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Em redes corporativas com inspeção SSL, o firewall re-assina certificados
    // causando "self-signed certificate in certificate chain"
    const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

    function handleResponse(res) {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log(`[AI Search] Status HTTP: ${res.statusCode}`);
        if (res.statusCode !== 200) {
          console.error(`[AI Search] Erro Gemini: ${data}`);
          reject(new Error(`Gemini API retornou status ${res.statusCode}: ${data}`));
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
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Host': targetHost
          }
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
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
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

// Endpoint de health check para diagnóstico
app.get('/api/ai/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    proxy: PROXY_URL || 'nenhum',
    model: 'gemini-2.0-flash',
    apiKeyConfigured: !!GEMINI_API_KEY,
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

    const prompt = buildPrompt(query, columns);
    const text = await callGeminiAPI(prompt);

    console.log(`[AI Search] Gemini response: ${text}`);

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
  console.log(`\n===========================================`);
  console.log(`  AI Server rodando em http://localhost:${PORT}`);
  console.log(`  Endpoint: POST http://localhost:${PORT}/api/ai/filter`);
  console.log(`  Health:   GET  http://localhost:${PORT}/api/ai/health`);
  console.log(`  Modelo: gemini-2.0-flash`);
  console.log(`  Usando: HTTPS nativo (sem SDK/fetch)`);
  console.log(`  TLS verify: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0' ? 'sim' : 'NÃO (NODE_TLS_REJECT_UNAUTHORIZED=0)'}`);
  if (PROXY_URL) console.log(`  Proxy: ${PROXY_URL}`);
  console.log(`===========================================\n`);
});
