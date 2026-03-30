import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { fetchLlmsTxt, fetchLlmsFullTxt, fetchComponentDoc, fetchGuide } from './docs-client';
import { parseLlmsTxt, LlmsEntry } from './llms-parser';

// Session-scoped cache for the llms.txt index
let cachedEntries: LlmsEntry[] | null = null;

async function getLlmsEntries(): Promise<LlmsEntry[]> {
  if (!cachedEntries) {
    const text = await fetchLlmsTxt();
    cachedEntries = parseLlmsTxt(text);
  }
  return cachedEntries;
}

const SECTION_LABELS: Record<string, string> = {
  components: 'Componentes e Diretivas',
  services: 'Serviços',
  interfaces: 'Interfaces e Modelos',
  enums: 'Enums',
  guides: 'Guias'
};

/** Convert a user-supplied identifier to a slug.
 *  Handles: "po-button", "<po-button>", "PoButtonComponent", "PoDialogService"
 */
function normaliseSlug(input: string): string {
  let s = input.trim();

  // Strip angle brackets: <po-button> → po-button
  if (s.startsWith('<') && s.endsWith('>')) {
    s = s.slice(1, -1);
  }

  // Convert CamelCase class names to kebab-case
  if (/^[A-Z]/.test(s)) {
    s = s
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
    // Remove trailing "-component" suffix (components use selector as slug, not class name)
    s = s.replace(/-component$/, '');
  }

  return s;
}

interface SearchResult {
  componentName: string;
  context: string;
}

/**
 * Split llms-full.txt into sections by "---" separator,
 * then find sections matching the query and extract context snippets.
 */
function searchFullText(fullText: string, query: string, maxResults: number): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const sections = fullText.split(/\n\n---\n\n/);
  const results: SearchResult[] = [];

  for (const section of sections) {
    if (!section.toLowerCase().includes(lowerQuery)) continue;

    const lines = section.split('\n');
    const heading =
      lines
        .find(l => l.startsWith('# '))
        ?.slice(2)
        .trim() ?? 'Desconhecido';

    const matchingIndexes: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lowerQuery)) {
        matchingIndexes.push(i);
      }
    }

    if (matchingIndexes.length === 0) continue;

    // Build context snippet: ±2 lines around each of the first 3 matches
    const contextParts: string[] = [];
    const seen = new Set<number>();

    for (const idx of matchingIndexes.slice(0, 3)) {
      const start = Math.max(0, idx - 2);
      const end = Math.min(lines.length - 1, idx + 2);
      for (let i = start; i <= end; i++) {
        if (!seen.has(i)) {
          seen.add(i);
          contextParts.push(lines[i]);
        }
      }
      contextParts.push('...');
    }

    results.push({
      componentName: heading,
      context: contextParts.join('\n').trim()
    });

    if (results.length >= maxResults) break;
  }

  return results;
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'po-ui',
    version: '1.0.0'
  });

  // ── list_components ─────────────────────────────────────────────────────────
  // @ts-ignore — TS2589: limitação de inferência genérica do @modelcontextprotocol/sdk com zod
  server.tool(
    'list_components',
    'Lista todos os componentes, diretivas, serviços, interfaces e enums do PO UI com descrições resumidas. ' +
      'Use para descobrir quais APIs existem antes de buscar detalhes.',
    {
      section: z
        .enum(['components', 'services', 'interfaces', 'enums', 'guides', 'all'])
        .optional()
        .describe('Filtrar por seção: "components", "services", "interfaces", "enums", "guides" ou "all" (padrão).'),
      filter: z.string().optional().describe('Filtro de texto livre no nome ou descrição (case-insensitive).')
    },
    async ({ section, filter }) => {
      const resolvedSection = section ?? 'all';
      let entries: LlmsEntry[];
      try {
        entries = await getLlmsEntries();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text', text: `Erro ao carregar índice: ${msg}` }] };
      }

      let results = resolvedSection === 'all' ? entries : entries.filter(e => e.section === resolvedSection);

      if (filter) {
        const q = filter.toLowerCase();
        results = results.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
      }

      if (results.length === 0) {
        return { content: [{ type: 'text', text: 'Nenhum resultado encontrado.' }] };
      }

      // Group by section
      const grouped = new Map<string, LlmsEntry[]>();
      for (const e of results) {
        const arr = grouped.get(e.section) ?? [];
        arr.push(e);
        grouped.set(e.section, arr);
      }

      const lines: string[] = [];
      for (const [sec, items] of grouped) {
        lines.push(`## ${SECTION_LABELS[sec] ?? sec}`);
        lines.push('');
        for (const e of items) {
          lines.push(`- **${e.name}** (\`${e.slug}\`): ${e.description}`);
        }
        lines.push('');
      }

      return { content: [{ type: 'text', text: lines.join('\n') }] };
    }
  );

  // ── get_component_docs ───────────────────────────────────────────────────────
  server.tool(
    'get_component_docs',
    'Retorna a documentação completa em Markdown para um componente, serviço, interface ou enum do PO UI. ' +
      'Inclui descrição, tabelas de inputs/outputs/propriedades, tipos e exemplos de uso.',
    {
      slug: z
        .string()
        .describe(
          'Slug do componente. Exemplos: "po-button", "po-table", "po-dialog-service", "po-table-column". ' +
            'Aceita também nomes de classe ("PoButtonComponent") e seletores HTML ("<po-button>"). ' +
            'Use list_components para descobrir slugs disponíveis.'
        )
    },
    async ({ slug }) => {
      const normalised = normaliseSlug(slug);

      try {
        const markdown = await fetchComponentDoc(normalised);
        return { content: [{ type: 'text', text: markdown }] };
      } catch {
        // If normalised slug failed, try the original input as-is
        if (normalised !== slug) {
          try {
            const markdown = await fetchComponentDoc(slug);
            return { content: [{ type: 'text', text: markdown }] };
          } catch {
            // Fall through to error with suggestions
          }
        }

        // Provide helpful suggestions from the index
        try {
          const entries = await getLlmsEntries();
          const q = normalised.toLowerCase();
          const suggestions = entries
            .filter(e => e.slug.includes(q) || q.includes(e.slug.split('-')[0] ?? ''))
            .slice(0, 5)
            .map(e => `- ${e.name} (\`${e.slug}\`)`)
            .join('\n');

          return {
            content: [
              {
                type: 'text',
                text:
                  `Componente "${slug}" não encontrado.\n\n` +
                  (suggestions
                    ? `Sugestões:\n${suggestions}\n\nUse list_components para ver todos.`
                    : 'Use list_components para ver todos os slugs disponíveis.')
              }
            ]
          };
        } catch {
          return {
            content: [
              {
                type: 'text',
                text: `Componente "${slug}" não encontrado. Use list_components para ver os slugs disponíveis.`
              }
            ]
          };
        }
      }
    }
  );

  // ── search_docs ──────────────────────────────────────────────────────────────
  // @ts-ignore — TS2589: limitação de inferência genérica do @modelcontextprotocol/sdk com zod
  server.tool(
    'search_docs',
    'Busca texto em toda a documentação do PO UI. Útil para encontrar componentes que suportem ' +
      'uma propriedade específica, um comportamento ou um padrão de uso.',
    {
      query: z
        .string()
        .min(2)
        .describe('Texto a buscar (case-insensitive). Ex: "upload de arquivo", "p-loading", "lazy load".'),
      max_results: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe('Número máximo de resultados (padrão: 10, máximo: 50).')
    },
    async ({ query, max_results }) => {
      const limit = max_results ?? 10;
      let fullText: string;
      try {
        fullText = await fetchLlmsFullTxt();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text', text: `Erro ao carregar documentação completa: ${msg}` }] };
      }

      const results = searchFullText(fullText, query, limit);

      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `Nenhum resultado encontrado para "${query}".` }]
        };
      }

      const output = [
        `Encontrados ${results.length} resultado(s) para "${query}":\n`,
        ...results.map((r, i) => `### Resultado ${i + 1}: ${r.componentName}\n\`\`\`\n${r.context}\n\`\`\``)
      ].join('\n\n');

      return { content: [{ type: 'text', text: output }] };
    }
  );

  // ── get_guide ────────────────────────────────────────────────────────────────
  server.tool(
    'get_guide',
    'Retorna o conteúdo completo de um guia de documentação do PO UI (ex: getting-started, schematics, theme-service). ' +
      'Use list_components com section="guides" para ver os guias disponíveis.',
    {
      guide: z
        .string()
        .describe(
          'Nome do guia sem extensão. Exemplos: "getting-started", "schematics", "browser-support", "llms". ' +
            'Aceita também com extensão: "getting-started.md".'
        )
    },
    async ({ guide }) => {
      try {
        const content = await fetchGuide(guide);
        return { content: [{ type: 'text', text: content }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);

        // Build helpful error with guide list from the index
        try {
          const entries = await getLlmsEntries();
          const guideList = entries
            .filter(e => e.section === 'guides')
            .map(e => `- ${e.name} (\`${e.slug}\`)`)
            .join('\n');

          return {
            content: [
              {
                type: 'text',
                text: `Erro: ${msg}\n\nGuias disponíveis:\n${guideList || 'Nenhum guia no índice.'}`
              }
            ]
          };
        } catch {
          return { content: [{ type: 'text', text: `Erro: ${msg}` }] };
        }
      }
    }
  );

  return server;
}
