#!/usr/bin/env node

/**
 * Demo web server with chat UI for PO UI MCP.
 * Shows how the MCP tools work through a simple chat interface.
 */

import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRepo, getRepoRoot } from '../src/parser.js';
import type { ParsedRepo, ComponentDoc } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedRepo: ParsedRepo | null = null;

function getRepo(): ParsedRepo {
  if (!cachedRepo) {
    cachedRepo = parseRepo();
  }
  return cachedRepo;
}

interface ToolResult {
  tool: string;
  params: Record<string, string>;
  result: string;
}

function processQuery(query: string): ToolResult {
  const repo = getRepo();
  const lower = query.toLowerCase();

  // List components
  if (lower.includes('listar componentes') || lower.includes('quais componentes') || lower.includes('list components') || lower.match(/componentes\s+(de|do|da)\s+(campo|formul|field)/)) {
    let category: string | undefined;
    if (lower.includes('campo') || lower.includes('formul') || lower.includes('field') || lower.includes('input')) category = 'Fields';
    else if (lower.includes('layout') || lower.includes('modal') || lower.includes('página')) category = 'Layout';
    else if (lower.includes('naveg') || lower.includes('menu') || lower.includes('navigation')) category = 'Navigation';
    else if (lower.includes('dado') || lower.includes('tabela') || lower.includes('data')) category = 'Data';
    else if (lower.includes('feedback') || lower.includes('notific')) category = 'Feedback';
    else if (lower.includes('template')) category = 'Templates';

    let components = repo.components;
    if (category) components = components.filter(c => c.category === category);

    const text = components.map(c =>
      `**${c.name}** (\`<${c.selector}>\`) [${c.category}]\n${c.description.substring(0, 150)}...`
    ).join('\n\n');

    return {
      tool: 'list_components',
      params: category ? { category } : {},
      result: `Encontrados **${components.length}** componente(s)${category ? ` na categoria ${category}` : ''}:\n\n${text}`
    };
  }

  // Get component documentation
  const compMatch = lower.match(/(?:como\s+(?:usar?|funciona|utilizar)|documentação\s+(?:do|da)|sobre\s+o|detalhe[s]?\s+(?:do|da)|propriedades\s+(?:do|da))\s+(po-[\w-]+)/);
  if (compMatch) {
    const name = compMatch[1];
    const comp = repo.components.find(c => c.name === name || c.selector === name);
    if (comp) {
      return {
        tool: lower.includes('propriedade') ? 'get_component_properties' : 'get_component',
        params: { name },
        result: formatComponentFull(comp)
      };
    }
    return { tool: 'get_component', params: { name }, result: `Componente "${name}" não encontrado.` };
  }

  // Direct component name query (e.g., "po-table", "po-button")
  const directCompMatch = lower.match(/^(po-[\w-]+)$/);
  if (directCompMatch) {
    const name = directCompMatch[1];
    const comp = repo.components.find(c => c.name === name || c.selector === name);
    if (comp) {
      return { tool: 'get_component', params: { name }, result: formatComponentFull(comp) };
    }
  }

  // CSS tokens
  if (lower.includes('token') || lower.includes('customiz') || lower.includes('tema') || lower.includes('css')) {
    const tokenCompMatch = lower.match(/(po-[\w-]+)/);
    if (tokenCompMatch) {
      const name = tokenCompMatch[1];
      const comp = repo.components.find(c => c.name === name || c.selector === name);
      if (comp && comp.cssTokens.length > 0) {
        let text = `# Tokens CSS de ${comp.name}\n\n`;
        text += `| Token | Descrição | Valor Padrão | Categoria |\n`;
        text += `|-------|-----------|-------------|----------|\n`;
        for (const token of comp.cssTokens) {
          text += `| \`${token.property}\` | ${token.description} | \`${token.defaultValue}\` | ${token.category} |\n`;
        }
        return { tool: 'get_css_tokens', params: { name }, result: text };
      }
    }
  }

  // Samples / examples
  if (lower.includes('exemplo') || lower.includes('sample') || lower.includes('código') || lower.includes('code')) {
    const sampleCompMatch = lower.match(/(po-[\w-]+)/);
    if (sampleCompMatch) {
      const name = sampleCompMatch[1];
      const comp = repo.components.find(c => c.name === name || c.selector === name);
      if (comp && comp.samples.length > 0) {
        let text = `# Exemplos de ${comp.name}\n\n`;
        for (const sample of comp.samples) {
          text += `## ${sample.title}\n\n`;
          for (const file of sample.files) {
            const ext = file.name.endsWith('.ts') ? 'typescript' : 'html';
            text += `**${file.name}:**\n\`\`\`${ext}\n${file.content}\`\`\`\n\n`;
          }
        }
        return { tool: 'get_component_samples', params: { name }, result: text };
      }
    }
  }

  // Guides
  if (lower.includes('guia') || lower.includes('guide') || lower.includes('migra') || lower.includes('getting started') || lower.includes('começar') || lower.includes('iniciar')) {
    const guideMatch = lower.match(/guia\s+(?:de\s+)?(\S+)/);
    if (guideMatch) {
      const guideName = guideMatch[1];
      const guide = repo.guides.find(g =>
        g.name.includes(guideName) || g.label.toLowerCase().includes(guideName)
      );
      if (guide) {
        return { tool: 'get_guide', params: { name: guide.name }, result: guide.content };
      }
    }
    // List all guides
    const text = repo.guides.map(g => `- **${g.label}** (\`${g.fileName}\`)`).join('\n');
    return { tool: 'list_guides', params: {}, result: `# Guias Disponíveis\n\n${text}` };
  }

  // Search
  const searchTerms = lower.replace(/(?:buscar?|procurar?|encontrar?|pesquisar?|search)\s+/, '');
  if (lower.startsWith('buscar') || lower.startsWith('procurar') || lower.startsWith('search') || lower.startsWith('encontrar')) {
    const results = repo.components.filter(c => {
      if (c.name.toLowerCase().includes(searchTerms)) return true;
      if (c.description.toLowerCase().includes(searchTerms)) return true;
      return false;
    });
    const text = results.map(c =>
      `**${c.name}** (\`<${c.selector}>\`) [${c.category}] - ${c.description.substring(0, 150)}...`
    ).join('\n\n');
    return {
      tool: 'search_components',
      params: { query: searchTerms },
      result: results.length > 0
        ? `Encontrados ${results.length} resultado(s):\n\n${text}`
        : `Nenhum resultado para "${searchTerms}".`
    };
  }

  // Structure
  if (lower.includes('estrutura') || lower.includes('monorepo') || lower.includes('projeto')) {
    let text = '# Estrutura do Monorepo PO UI\n\n';
    text += 'Repositório: https://github.com/po-ui/po-angular\n\n';
    text += '| Projeto | Pacote npm | Descrição |\n';
    text += '|---------|-----------|----------|\n';
    text += '| **ui** | `@po-ui/ng-components` | Componentes fundamentais |\n';
    text += '| **templates** | `@po-ui/ng-templates` | Templates de alto nível |\n';
    text += '| **sync** | `@po-ui/ng-sync` | Sincronização offline-first |\n';
    text += '| **storage** | `@po-ui/ng-storage` | Persistência local |\n';
    text += '| **schematics** | `@po-ui/ng-schematics` | Automação Angular CLI |\n';
    text += '| **code-editor** | `@po-ui/ng-code-editor` | Editor de código |\n';
    return { tool: 'get_project_structure', params: {}, result: text };
  }

  // Fallback: try to find a component name in the query
  const anyCompMatch = lower.match(/(po-[\w-]+)/);
  if (anyCompMatch) {
    const name = anyCompMatch[1];
    const comp = repo.components.find(c => c.name === name || c.selector === name);
    if (comp) {
      return { tool: 'get_component', params: { name }, result: formatComponentFull(comp) };
    }
  }

  // Default help
  return {
    tool: 'help',
    params: {},
    result: `Experimente perguntar sobre:

- **Listar componentes** — "Quais componentes de formulário existem?"
- **Documentação** — "Como usar o po-table?" ou "Sobre o po-button"
- **Propriedades** — "Propriedades do po-input"
- **Tokens CSS** — "Tokens CSS do po-button"
- **Exemplos** — "Exemplo de código do po-upload"
- **Guias** — "Guias disponíveis" ou "Guia de getting-started"
- **Estrutura** — "Estrutura do monorepo"
- **Buscar** — "Buscar modal"`
  };
}

function formatComponentFull(comp: ComponentDoc): string {
  let output = `# ${comp.name}\n\n`;
  output += `**Selector:** \`<${comp.selector}>\`\n`;
  output += `**Biblioteca:** ${comp.library} | **Categoria:** ${comp.category}\n\n`;
  output += `## Descrição\n\n${comp.description}\n\n`;

  if (comp.properties.length > 0) {
    output += `## Propriedades (${comp.properties.length})\n\n`;
    output += `| Propriedade | Tipo | Padrão | Descrição |\n`;
    output += `|-------------|------|--------|----------|\n`;
    for (const prop of comp.properties) {
      const desc = prop.description.substring(0, 80).replace(/\n/g, ' ');
      output += `| \`${prop.alias}\` | ${prop.type} | ${prop.default || '-'} | ${desc} |\n`;
    }
    output += '\n';
  }

  if (comp.events.length > 0) {
    output += `## Eventos (${comp.events.length})\n\n`;
    for (const event of comp.events) {
      output += `- \`${event.alias}\` — ${event.description.substring(0, 100)}\n`;
    }
    output += '\n';
  }

  if (comp.cssTokens.length > 0) {
    output += `## Tokens CSS (${comp.cssTokens.length})\n\n`;
    output += `| Token | Valor Padrão | Categoria |\n`;
    output += `|-------|-------------|----------|\n`;
    for (const token of comp.cssTokens.slice(0, 10)) {
      output += `| \`${token.property}\` | \`${token.defaultValue}\` | ${token.category} |\n`;
    }
    if (comp.cssTokens.length > 10) output += `\n_... e mais ${comp.cssTokens.length - 10} tokens_\n`;
    output += '\n';
  }

  if (comp.samples.length > 0) {
    output += `## Exemplos (${comp.samples.length})\n\n`;
    // Show first sample with code
    const sample = comp.samples[0];
    output += `### ${sample.title}\n\n`;
    for (const file of sample.files) {
      const ext = file.name.endsWith('.ts') ? 'typescript' : 'html';
      output += `**${file.name}:**\n\`\`\`${ext}\n${file.content}\`\`\`\n\n`;
    }
    if (comp.samples.length > 1) {
      output += `_Outros exemplos: ${comp.samples.slice(1).map(s => s.title).join(', ')}_\n`;
    }
  }

  return output;
}

const server = http.createServer((req, res) => {
  // CORS headers for portal integration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { query } = JSON.parse(body);
        const result = processQuery(query);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal error' }));
      }
    });
  } else {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath, 'utf-8'));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('index.html not found');
    }
  }
});

const PORT = 3333;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`PO UI MCP Demo Chat rodando em http://localhost:${PORT}`);
});
