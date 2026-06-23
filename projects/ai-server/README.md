# AI Server - Integração Gemini para po-table

Backend Node.js que conecta o AI Search do po-table com o Google Gemini.

## Como usar

1. Instale as dependências:
```bash
cd projects/ai-server
npm install
```

2. Inicie o servidor passando sua API Key do Gemini:
```bash
GEMINI_API_KEY=sua-chave-aqui node server.js
```

3. Em outro terminal, inicie o app Angular:
```bash
npx ng serve app --port 4200
```

4. Acesse http://localhost:4200 e faça buscas em linguagem natural.

## Como obter a API Key do Gemini

1. Acesse https://aistudio.google.com/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada

## Arquitetura

```
Browser (Angular app :4200)
  |
  | POST /api/ai/filter { query, columns }
  |
  v
Angular Proxy (proxy.conf.json)
  |
  | Redireciona /api/ai/* para :3333
  |
  v
AI Server (Express :3333)
  |
  | Monta prompt + chama Gemini API
  |
  v
Google Gemini (gemini-2.0-flash)
  |
  | Retorna { filter, description, confidence }
  |
  v
po-table aplica $filter via applyFilters()
```
