const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Diagnóstico de versão do Node.js
console.log(`Node.js version: ${process.version}`);

const app = express();
const PORT = process.env.PORT || 3333;

// API Key do Gemini - passar via variável de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('\n===========================================');
  console.error('  GEMINI_API_KEY não configurada!');
  console.error('  Execute com: GEMINI_API_KEY=sua-chave node server.js');
  console.error('===========================================\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = buildPrompt(query, columns);
    console.log(`[AI Search] Chamando Gemini API...`);

    let text;
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      text = response.text();
    } catch (apiError) {
      console.error(`[AI Search] Erro na chamada Gemini:`, apiError.message);
      if (apiError.message.includes('fetch failed') || apiError.message.includes('ENOTFOUND')) {
        console.error('[AI Search] Problema de rede. Verifique sua conexão com a internet.');
        console.error('[AI Search] Se estiver atrás de proxy, configure HTTP_PROXY/HTTPS_PROXY.');
      }
      throw apiError;
    }

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
    if (error.cause) {
      console.error('[AI Search] Causa:', error.cause.message || error.cause);
    }
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
  console.log(`  Modelo: gemini-2.0-flash`);
  console.log(`===========================================\n`);
});
