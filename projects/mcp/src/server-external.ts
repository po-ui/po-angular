#!/usr/bin/env node

/**
 * MCP Server Externo para PO UI
 *
 * Destinado a desenvolvedores que consomem o PO UI como biblioteca.
 * Fornece documentação de componentes, propriedades, eventos, tokens CSS,
 * exemplos de uso e guias.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseRepo, getRepoRoot } from './parser.js';
import type { ParsedRepo, ComponentDoc } from './types.js';

let cachedRepo: ParsedRepo | null = null;

function getRepo(): ParsedRepo {
  if (!cachedRepo) {
    cachedRepo = parseRepo();
  }
  return cachedRepo;
}

function formatComponentSummary(comp: ComponentDoc): string {
  return `**${comp.name}** (\`<${comp.selector}>\`) - ${comp.category}\n${comp.description.substring(0, 200)}${comp.description.length > 200 ? '...' : ''}`;
}

function formatComponentFull(comp: ComponentDoc): string {
  let output = `# ${comp.name}\n\n`;
  output += `**Selector:** \`<${comp.selector}>\`\n`;
  output += `**Biblioteca:** ${comp.library}\n`;
  output += `**Categoria:** ${comp.category}\n\n`;
  output += `## Descrição\n\n${comp.description}\n\n`;

  if (comp.properties.length > 0) {
    output += `## Propriedades (@Input)\n\n`;
    for (const prop of comp.properties) {
      output += `### \`${prop.alias}\`\n`;
      output += `- **Nome interno:** ${prop.name}\n`;
      output += `- **Tipo:** ${prop.type}\n`;
      if (prop.default) output += `- **Padrão:** \`${prop.default}\`\n`;
      if (prop.required) output += `- **Obrigatório:** Sim\n`;
      if (prop.optional) output += `- **Opcional:** Sim\n`;
      if (prop.deprecated) output += `- **Depreciado:** ${prop.deprecated}\n`;
      output += `- ${prop.description}\n\n`;
    }
  }

  if (comp.events.length > 0) {
    output += `## Eventos (@Output)\n\n`;
    for (const event of comp.events) {
      output += `### \`${event.alias}\`\n`;
      output += `- **Nome interno:** ${event.name}\n`;
      output += `- ${event.description}\n\n`;
    }
  }

  if (comp.methods.length > 0) {
    output += `## Métodos Públicos\n\n`;
    for (const method of comp.methods) {
      output += `### \`${method.name}()\`\n`;
      output += `${method.description}\n\n`;
    }
  }

  if (comp.cssTokens.length > 0) {
    output += `## Tokens CSS Customizáveis\n\n`;
    output += `| Token | Descrição | Valor Padrão | Categoria |\n`;
    output += `|-------|-----------|-------------|----------|\n`;
    for (const token of comp.cssTokens) {
      output += `| \`${token.property}\` | ${token.description} | \`${token.defaultValue}\` | ${token.category} |\n`;
    }
    output += '\n';
  }

  if (comp.samples.length > 0) {
    output += `## Exemplos\n\n`;
    for (const sample of comp.samples) {
      output += `### ${sample.title}\n\n`;
      for (const file of sample.files) {
        const ext = file.name.endsWith('.ts') ? 'typescript' : 'html';
        output += `**${file.name}:**\n\`\`\`${ext}\n${file.content}\`\`\`\n\n`;
      }
    }
  }

  return output;
}

async function main(): Promise<void> {
  const server = new McpServer({
    name: 'po-ui-mcp',
    version: '1.0.0'
  });

  // Tool: list_components
  server.tool(
    'list_components',
    'Lista todos os componentes disponíveis no PO UI com nome, selector e descrição resumida. Útil para descobrir quais componentes existem.',
    {
      category: z.string().optional().describe('Filtrar por categoria: Fields, Layout, Navigation, Data, Feedback, General, Templates'),
      library: z.string().optional().describe('Filtrar por biblioteca: ui, ui/field, templates')
    },
    async ({ category, library }) => {
      const repo = getRepo();
      let components = repo.components;

      if (category) {
        components = components.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }
      if (library) {
        components = components.filter(c => c.library.toLowerCase() === library.toLowerCase());
      }

      const text = components.map(formatComponentSummary).join('\n\n');
      return {
        content: [{ type: 'text' as const, text: text || 'Nenhum componente encontrado.' }]
      };
    }
  );

  // Tool: get_component
  server.tool(
    'get_component',
    'Retorna a documentação completa de um componente PO UI: descrição, propriedades (@Input), eventos (@Output), tokens CSS, métodos públicos e exemplos.',
    {
      name: z.string().describe('Nome do componente (ex: "po-button", "po-table", "po-input"). Aceita com ou sem o prefixo "po-".')
    },
    async ({ name }) => {
      const repo = getRepo();
      const normalizedName = name.startsWith('po-') ? name : `po-${name}`;
      const comp = repo.components.find(
        c => c.name === normalizedName || c.selector === normalizedName || c.name === name
      );

      if (!comp) {
        return {
          content: [{
            type: 'text' as const,
            text: `Componente "${name}" não encontrado. Use list_components para ver os componentes disponíveis.`
          }]
        };
      }

      return {
        content: [{ type: 'text' as const, text: formatComponentFull(comp) }]
      };
    }
  );

  // Tool: search_components
  server.tool(
    'search_components',
    'Busca componentes por palavra-chave na descrição, propriedades ou nome. Útil para encontrar componentes que atendam uma necessidade específica.',
    {
      query: z.string().describe('Palavra-chave para busca (ex: "tabela", "upload", "formulário", "modal")')
    },
    async ({ query }) => {
      const repo = getRepo();
      const lowerQuery = query.toLowerCase();

      const results = repo.components.filter(c => {
        if (c.name.toLowerCase().includes(lowerQuery)) return true;
        if (c.description.toLowerCase().includes(lowerQuery)) return true;
        if (c.properties.some(p => p.description.toLowerCase().includes(lowerQuery))) return true;
        if (c.category.toLowerCase().includes(lowerQuery)) return true;
        return false;
      });

      if (results.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Nenhum componente encontrado para "${query}".` }]
        };
      }

      const text = `Encontrados ${results.length} componente(s):\n\n` +
        results.map(formatComponentSummary).join('\n\n');

      return {
        content: [{ type: 'text' as const, text }]
      };
    }
  );

  // Tool: get_component_properties
  server.tool(
    'get_component_properties',
    'Retorna apenas as propriedades (@Input) de um componente, com tipo, valor padrão e descrição.',
    {
      name: z.string().describe('Nome do componente (ex: "po-button", "po-table")')
    },
    async ({ name }) => {
      const repo = getRepo();
      const normalizedName = name.startsWith('po-') ? name : `po-${name}`;
      const comp = repo.components.find(
        c => c.name === normalizedName || c.selector === normalizedName
      );

      if (!comp) {
        return {
          content: [{
            type: 'text' as const,
            text: `Componente "${name}" não encontrado.`
          }]
        };
      }

      if (comp.properties.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `O componente ${comp.name} não possui propriedades documentadas.` }]
        };
      }

      let text = `# Propriedades de ${comp.name}\n\n`;
      text += `| Propriedade | Tipo | Padrão | Descrição |\n`;
      text += `|-------------|------|--------|----------|\n`;
      for (const prop of comp.properties) {
        const desc = prop.description.substring(0, 100).replace(/\n/g, ' ');
        text += `| \`${prop.alias}\` | ${prop.type} | ${prop.default || '-'} | ${desc} |\n`;
      }

      return {
        content: [{ type: 'text' as const, text }]
      };
    }
  );

  // Tool: get_component_samples
  server.tool(
    'get_component_samples',
    'Retorna os exemplos de código (samples) de um componente específico.',
    {
      name: z.string().describe('Nome do componente (ex: "po-button", "po-table")')
    },
    async ({ name }) => {
      const repo = getRepo();
      const normalizedName = name.startsWith('po-') ? name : `po-${name}`;
      const comp = repo.components.find(
        c => c.name === normalizedName || c.selector === normalizedName
      );

      if (!comp) {
        return {
          content: [{ type: 'text' as const, text: `Componente "${name}" não encontrado.` }]
        };
      }

      if (comp.samples.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `O componente ${comp.name} não possui samples documentados.` }]
        };
      }

      let text = `# Samples de ${comp.name}\n\n`;
      for (const sample of comp.samples) {
        text += `## ${sample.title}\n\n`;
        for (const file of sample.files) {
          const ext = file.name.endsWith('.ts') ? 'typescript' : 'html';
          text += `**${file.name}:**\n\`\`\`${ext}\n${file.content}\`\`\`\n\n`;
        }
      }

      return {
        content: [{ type: 'text' as const, text }]
      };
    }
  );

  // Tool: get_css_tokens
  server.tool(
    'get_css_tokens',
    'Retorna os tokens CSS customizáveis de um componente para personalização de tema.',
    {
      name: z.string().describe('Nome do componente (ex: "po-button", "po-table")')
    },
    async ({ name }) => {
      const repo = getRepo();
      const normalizedName = name.startsWith('po-') ? name : `po-${name}`;
      const comp = repo.components.find(
        c => c.name === normalizedName || c.selector === normalizedName
      );

      if (!comp) {
        return {
          content: [{ type: 'text' as const, text: `Componente "${name}" não encontrado.` }]
        };
      }

      if (comp.cssTokens.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `O componente ${comp.name} não possui tokens CSS documentados.` }]
        };
      }

      let text = `# Tokens CSS de ${comp.name}\n\n`;
      text += `| Token | Descrição | Valor Padrão | Categoria |\n`;
      text += `|-------|-----------|-------------|----------|\n`;
      for (const token of comp.cssTokens) {
        text += `| \`${token.property}\` | ${token.description} | \`${token.defaultValue}\` | ${token.category} |\n`;
      }

      return {
        content: [{ type: 'text' as const, text }]
      };
    }
  );

  // Tool: list_guides
  server.tool(
    'list_guides',
    'Lista todos os guias de documentação disponíveis no PO UI.',
    {},
    async () => {
      const repo = getRepo();
      const text = repo.guides.map(g => `- **${g.label}** (\`${g.fileName}\`)`).join('\n');
      return {
        content: [{ type: 'text' as const, text: text || 'Nenhum guia encontrado.' }]
      };
    }
  );

  // Tool: get_guide
  server.tool(
    'get_guide',
    'Retorna o conteúdo completo de um guia de documentação do PO UI.',
    {
      name: z.string().describe('Nome do guia (ex: "getting-started", "schematics", "sync-fundamentals")')
    },
    async ({ name }) => {
      const repo = getRepo();
      const guide = repo.guides.find(
        g => g.name === name || g.fileName === name || g.fileName === `${name}.md`
      );

      if (!guide) {
        return {
          content: [{
            type: 'text' as const,
            text: `Guia "${name}" não encontrado. Use list_guides para ver os guias disponíveis.`
          }]
        };
      }

      return {
        content: [{ type: 'text' as const, text: guide.content }]
      };
    }
  );

  // ──────────────────────────────────────────────────────
  // Tools de Documentação do Repositório (GitHub)
  // ──────────────────────────────────────────────────────

  server.tool(
    'get_repo_doc',
    'Retorna o conteúdo de um documento do repositório PO UI: README, CONTRIBUTING, STYLEGUIDE, HOW_TO_DOCUMENT, CODE_OF_CONDUCT ou CHANGELOG.',
    {
      doc: z.enum(['README', 'CONTRIBUTING', 'STYLEGUIDE', 'HOW_TO_DOCUMENT', 'CODE_OF_CONDUCT', 'CHANGELOG'])
        .describe('Nome do documento a retornar')
    },
    async ({ doc }) => {
      const root = getRepoRoot();
      const filePath = path.join(root, `${doc}.md`);
      if (!fs.existsSync(filePath)) {
        return { content: [{ type: 'text' as const, text: `Documento "${doc}.md" não encontrado no repositório.` }] };
      }
      let content = fs.readFileSync(filePath, 'utf-8');
      if (doc === 'CHANGELOG') {
        content = content.split('\n').slice(0, 300).join('\n') + '\n\n... (truncado, use o parâmetro lines para ver mais)';
      }
      return { content: [{ type: 'text' as const, text: content }] };
    }
  );

  server.tool(
    'get_project_readme',
    'Retorna o README de um subprojeto específico do monorepo PO UI (ui, templates, sync, storage, schematics, code-editor).',
    {
      project: z.enum(['ui', 'templates', 'sync', 'storage', 'schematics', 'code-editor'])
        .describe('Nome do subprojeto')
    },
    async ({ project }) => {
      const root = getRepoRoot();
      const filePath = path.join(root, 'projects', project, 'README.md');
      if (!fs.existsSync(filePath)) {
        return { content: [{ type: 'text' as const, text: `README do projeto "${project}" não encontrado.` }] };
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      return { content: [{ type: 'text' as const, text: content }] };
    }
  );

  server.tool(
    'get_project_structure',
    'Retorna a estrutura do monorepo PO UI com todos os subprojetos e suas descrições.',
    {},
    async () => {
      const root = getRepoRoot();
      let text = '# Estrutura do Monorepo PO UI\n\n';
      text += 'Repositório: https://github.com/po-ui/po-angular\n\n';
      text += '## Projetos\n\n';
      text += '| Projeto | Pacote npm | Descrição |\n';
      text += '|---------|-----------|-----------|\n';
      text += '| **ui** | `@po-ui/ng-components` | Componentes fundamentais (botões, inputs, tabela, modal, etc.) |\n';
      text += '| **templates** | `@po-ui/ng-templates` | Templates de alto nível (page-login, page-dynamic-table, etc.) |\n';
      text += '| **sync** | `@po-ui/ng-sync` | Motor de sincronização offline-first |\n';
      text += '| **storage** | `@po-ui/ng-storage` | Camada de persistência sobre localforage/lokijs |\n';
      text += '| **schematics** | `@po-ui/ng-schematics` | Automação para Angular CLI (ng add, migrações) |\n';
      text += '| **code-editor** | `@po-ui/ng-code-editor` | Componente de editor de código |\n';
      text += '\n## Documentos\n\n';

      const docs = ['README.md', 'CONTRIBUTING.md', 'STYLEGUIDE.md', 'HOW_TO_DOCUMENT.md', 'CODE_OF_CONDUCT.md', 'CHANGELOG.md'];
      for (const doc of docs) {
        const exists = fs.existsSync(path.join(root, doc));
        text += `- ${exists ? '' : '~~'}**${doc}**${exists ? '' : '~~'}${exists ? '' : ' (não encontrado)'}\n`;
      }

      text += '\n## Guias (`docs/guides/`)\n\n';
      const repo = getRepo();
      for (const g of repo.guides) {
        text += `- **${g.label}** (\`${g.fileName}\`)\n`;
      }

      return { content: [{ type: 'text' as const, text }] };
    }
  );

  // Resources
  server.resource(
    'components-list',
    'poui://components',
    async (uri) => {
      const repo = getRepo();
      const text = repo.components.map(c => `${c.name} (<${c.selector}>) [${c.category}] - ${c.library}`).join('\n');
      return {
        contents: [{
          uri: uri.href,
          text,
          mimeType: 'text/plain'
        }]
      };
    }
  );

  server.resource(
    'guides-list',
    'poui://guides',
    async (uri) => {
      const repo = getRepo();
      const text = repo.guides.map(g => `${g.name}: ${g.label}`).join('\n');
      return {
        contents: [{
          uri: uri.href,
          text,
          mimeType: 'text/plain'
        }]
      };
    }
  );

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
