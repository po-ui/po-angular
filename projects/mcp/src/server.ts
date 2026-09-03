import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  BEST_PRACTICE_TOPICS,
  BestPracticeTopic,
  ComponentExample,
  fetchBestPractices,
  fetchComponentDoc,
  fetchComponentExamples,
  fetchGuide,
  fetchLlmsFullTxt,
  fetchLlmsTxt
} from './docs-client';
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
export function normaliseSlug(input: string): string {
  let s = input.trim();

  // Strip angle brackets: <po-button> → po-button
  if (s.startsWith('<') && s.endsWith('>')) {
    s = s.slice(1, -1);
  }

  // Convert CamelCase class names to kebab-case
  if (/^[A-Z]/.test(s)) {
    s = s
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/(?<=[A-Z])(?=[A-Z][a-z])/g, '-')
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

type ComponentSection = 'components' | 'services' | 'interfaces' | 'enums' | 'guides' | 'all';

interface ToolRegistration {
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  outputSchema?: Record<string, z.ZodTypeAny>;
}

type RegisterToolWithoutSdkInference = (name: string, registration: ToolRegistration, handler: unknown) => void;

const PO_UI_URL = 'https://po-ui.io';

function getComponentDocumentationUrl(slug: string): string {
  return `${PO_UI_URL}/documentation/${slug}`;
}

function getComponentSourceUrl(slug: string): string {
  return `${PO_UI_URL}/llms-generated/${slug}.md`;
}

function getGuideUrl(guide: string): string {
  return `https://github.com/po-ui/po-angular/blob/master/docs/guides/${guide}.md`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro desconhecido.';
  }
}

function createToolError(message: string): { content: Array<{ type: 'text'; text: string }>; isError: true } {
  return { content: [{ type: 'text', text: message }], isError: true };
}

function formatExamples(examples: Array<ComponentExample>): string {
  return examples
    .map(example => {
      const files = example.files
        .map(file => `#### [${file.name}](${file.url})\n\n\`\`\`${file.language}\n${file.content}\n\`\`\``)
        .join('\n\n');

      return `### [${example.name}](${example.url})\n\n${files}`;
    })
    .join('\n\n');
}

/** Extract the heading text from the first `# ...` line, or fallback. */
export function extractHeading(lines: string[]): string {
  return (
    lines
      .find(l => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? 'Desconhecido'
  );
}

/** Return indexes of lines that contain the query (case-insensitive). */
export function findMatchingLineIndexes(lines: string[], lowerQuery: string): number[] {
  const indexes: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(lowerQuery)) {
      indexes.push(i);
    }
  }
  return indexes;
}

/** Build a context snippet with ±2 lines around each of the first 3 matches. */
export function buildContextSnippet(lines: string[], matchingIndexes: number[]): string {
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

  return contextParts.join('\n').trim();
}

/**
 * Split llms-full.txt into sections by "---" separator,
 * then find sections matching the query and extract context snippets.
 */
export function searchFullText(fullText: string, query: string, maxResults: number): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const sections = fullText.split(/\n\n---\n\n/);
  const results: SearchResult[] = [];

  for (const section of sections) {
    if (!section.toLowerCase().includes(lowerQuery)) continue;

    const lines = section.split('\n');
    const matchingIndexes = findMatchingLineIndexes(lines, lowerQuery);

    if (matchingIndexes.length === 0) continue;

    results.push({
      componentName: extractHeading(lines),
      context: buildContextSnippet(lines, matchingIndexes)
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
  const registerTool = server.registerTool.bind(server) as unknown as RegisterToolWithoutSdkInference;

  // ── list_components ─────────────────────────────────────────────────────────
  registerTool(
    'list_components',
    {
      description:
        'Lista todos os componentes, diretivas, serviços, interfaces e enums do PO UI com descrições resumidas. ' +
        'Use para descobrir quais APIs existem antes de buscar detalhes.',
      inputSchema: {
        section: z
          .enum(['components', 'services', 'interfaces', 'enums', 'guides', 'all'])
          .optional()
          .describe('Filtrar por seção: "components", "services", "interfaces", "enums", "guides" ou "all" (padrão).'),
        filter: z.string().optional().describe('Filtro de texto livre no nome ou descrição (case-insensitive).')
      },
      outputSchema: {
        count: z.number().int(),
        items: z.array(
          z.object({
            description: z.string(),
            name: z.string(),
            section: z.string(),
            slug: z.string(),
            url: z.string()
          })
        ),
        section: z.string()
      }
    },
    async ({ section, filter }: { section?: ComponentSection; filter?: string }) => {
      const resolvedSection = section ?? 'all';
      let entries: LlmsEntry[];
      try {
        entries = await getLlmsEntries();
      } catch (err) {
        return createToolError(`Erro ao carregar índice: ${getErrorMessage(err)}`);
      }

      let results = resolvedSection === 'all' ? entries : entries.filter(e => e.section === resolvedSection);

      if (filter) {
        const q = filter.toLowerCase();
        results = results.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
      }

      if (results.length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'Nenhum resultado encontrado.' }],
          structuredContent: { count: 0, items: [], section: resolvedSection }
        };
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

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
        structuredContent: {
          count: results.length,
          items: results.map(item => ({
            description: item.description,
            name: item.name,
            section: item.section,
            slug: item.slug,
            url: item.url
          })),
          section: resolvedSection
        }
      };
    }
  );

  // ── get_component_docs ───────────────────────────────────────────────────────
  registerTool(
    'get_component_docs',
    {
      description:
        'Retorna a documentação completa em Markdown para um componente, serviço, interface ou enum do PO UI. ' +
        'Inclui descrição, tabelas de inputs/outputs/propriedades, tipos e exemplos de uso.',
      inputSchema: {
        slug: z
          .string()
          .describe(
            'Slug do componente. Exemplos: "po-button", "po-table", "po-dialog-service", "po-table-column". ' +
              'Aceita também nomes de classe ("PoButtonComponent") e seletores HTML ("<po-button>"). ' +
              'Use list_components para descobrir slugs disponíveis.'
          )
      },
      outputSchema: {
        content: z.string(),
        documentationUrl: z.string(),
        slug: z.string(),
        sourceUrl: z.string()
      }
    },
    async ({ slug }: { slug: string }) => {
      const normalised = normaliseSlug(slug);

      try {
        const markdown = await fetchComponentDoc(normalised);
        return {
          content: [{ type: 'text' as const, text: markdown }],
          structuredContent: {
            content: markdown,
            documentationUrl: getComponentDocumentationUrl(normalised),
            slug: normalised,
            sourceUrl: getComponentSourceUrl(normalised)
          }
        };
      } catch {
        // If normalised slug failed, try the original input as-is
        if (normalised !== slug) {
          try {
            const markdown = await fetchComponentDoc(slug);
            return {
              content: [{ type: 'text' as const, text: markdown }],
              structuredContent: {
                content: markdown,
                documentationUrl: getComponentDocumentationUrl(slug),
                slug,
                sourceUrl: getComponentSourceUrl(slug)
              }
            };
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

          return createToolError(
            `Componente "${slug}" não encontrado.\n\n` +
              (suggestions
                ? `Sugestões:\n${suggestions}\n\nUse list_components para ver todos.`
                : 'Use list_components para ver todos os slugs disponíveis.')
          );
        } catch {
          return createToolError(
            `Componente "${slug}" não encontrado. Use list_components para ver os slugs disponíveis.`
          );
        }
      }
    }
  );

  // ── get_component_examples ──────────────────────────────────────────────────
  registerTool(
    'get_component_examples',
    {
      description:
        'Retorna exemplos oficiais de um componente PO UI diretamente do repositório. ' +
        'Inclui os arquivos TypeScript, HTML e estilos necessários para compreender cada exemplo.',
      inputSchema: {
        slug: z.string().describe('Slug do componente. Exemplos: "po-button", "po-table" ou "PoButtonComponent".'),
        example: z
          .string()
          .optional()
          .describe('Filtro opcional pelo nome do exemplo. Exemplos: "basic", "labs" ou "airfare".'),
        max_examples: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe('Quantidade máxima de exemplos. Padrão: 3. Máximo: 5.')
      },
      outputSchema: {
        documentationUrl: z.string(),
        examples: z.array(
          z.object({
            files: z.array(z.object({ content: z.string(), language: z.string(), name: z.string(), url: z.string() })),
            name: z.string(),
            url: z.string()
          })
        ),
        slug: z.string(),
        sourceSlug: z.string(),
        status: z.enum(['available', 'no_match', 'not_available'])
      }
    },
    async ({ slug, example, max_examples }: { slug: string; example?: string; max_examples?: number }) => {
      const normalised = normaliseSlug(slug);

      try {
        const result = await fetchComponentExamples(normalised, max_examples ?? 3, example);
        const structuredContent = {
          documentationUrl: getComponentDocumentationUrl(normalised),
          examples: result.examples,
          slug: normalised,
          sourceSlug: result.sourceSlug,
          status: result.status
        };

        if (result.status === 'not_available') {
          return {
            content: [
              {
                type: 'text' as const,
                text: `O componente "${normalised}" não possui exemplos oficiais próprios. Consulte ${structuredContent.documentationUrl}.`
              }
            ],
            structuredContent
          };
        }

        if (result.status === 'no_match') {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Nenhum exemplo de "${result.sourceSlug}" corresponde ao filtro "${example}".`
              }
            ],
            structuredContent
          };
        }

        const parentNotice =
          result.sourceSlug === normalised
            ? ''
            : `Os exemplos abaixo pertencem ao componente pai "${result.sourceSlug}".\n\n`;

        return {
          content: [{ type: 'text' as const, text: `${parentNotice}${formatExamples(result.examples)}` }],
          structuredContent
        };
      } catch (err) {
        return createToolError(`Erro ao carregar exemplos de "${slug}": ${getErrorMessage(err)}`);
      }
    }
  );

  // ── get_best_practices ──────────────────────────────────────────────────────
  registerTool(
    'get_best_practices',
    {
      description:
        'Retorna recomendações oficiais do PO UI para contribuição, fluxo de desenvolvimento, ' +
        'configuração inicial ou customização de temas.',
      inputSchema: {
        topic: z
          .enum(BEST_PRACTICE_TOPICS)
          .describe('Tema das recomendações: contributing, development-flow, getting-started ou theme-service.')
      },
      outputSchema: {
        content: z.string(),
        source: z.object({ title: z.string(), url: z.string() }),
        topic: z.string()
      }
    },
    async ({ topic }: { topic: BestPracticeTopic }) => {
      try {
        const document = await fetchBestPractices(topic);
        const text = `Fonte oficial: ${document.url}\n\n${document.content}`;

        return {
          content: [{ type: 'text' as const, text }],
          structuredContent: {
            content: document.content,
            source: { title: document.title, url: document.url },
            topic
          }
        };
      } catch (err) {
        return createToolError(`Erro ao carregar boas práticas de "${topic}": ${getErrorMessage(err)}`);
      }
    }
  );

  // ── search_docs ──────────────────────────────────────────────────────────────
  registerTool(
    'search_docs',
    {
      description:
        'Busca texto em toda a documentação do PO UI. Útil para encontrar componentes que suportem ' +
        'uma propriedade específica, um comportamento ou um padrão de uso.',
      inputSchema: {
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
      outputSchema: {
        count: z.number().int(),
        query: z.string(),
        results: z.array(
          z.object({
            componentName: z.string(),
            context: z.string(),
            slug: z.string(),
            url: z.string()
          })
        )
      }
    },
    async ({ query, max_results }: { query: string; max_results?: number }) => {
      const limit = max_results ?? 10;
      let fullText: string;
      try {
        fullText = await fetchLlmsFullTxt();
      } catch (err) {
        return createToolError(`Erro ao carregar documentação completa: ${getErrorMessage(err)}`);
      }

      const results = searchFullText(fullText, query, limit);
      const structuredResults = results.map(result => {
        const slug = normaliseSlug(result.componentName);
        return {
          componentName: result.componentName,
          context: result.context,
          slug,
          url: getComponentDocumentationUrl(slug)
        };
      });

      if (results.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Nenhum resultado encontrado para "${query}".` }],
          structuredContent: { count: 0, query, results: [] }
        };
      }

      const output = [
        `Encontrados ${results.length} resultado(s) para "${query}":\n`,
        ...results.map((r, i) => `### Resultado ${i + 1}: ${r.componentName}\n\`\`\`\n${r.context}\n\`\`\``)
      ].join('\n\n');

      return {
        content: [{ type: 'text' as const, text: output }],
        structuredContent: { count: structuredResults.length, query, results: structuredResults }
      };
    }
  );

  // ── get_guide ────────────────────────────────────────────────────────────────
  registerTool(
    'get_guide',
    {
      description:
        'Retorna o conteúdo completo de um guia de documentação do PO UI (ex: getting-started, schematics, theme-service). ' +
        'Use list_components com section="guides" para ver os guias disponíveis.',
      inputSchema: {
        guide: z
          .string()
          .describe(
            'Nome do guia sem extensão. Exemplos: "getting-started", "schematics", "browser-support", "llms". ' +
              'Aceita também com extensão: "getting-started.md".'
          )
      },
      outputSchema: {
        content: z.string(),
        guide: z.string(),
        url: z.string()
      }
    },
    async ({ guide }: { guide: string }) => {
      const guideName = guide.endsWith('.md') ? guide.slice(0, -3) : guide;
      try {
        const content = await fetchGuide(guide);
        return {
          content: [{ type: 'text' as const, text: content }],
          structuredContent: { content, guide: guideName, url: getGuideUrl(guideName) }
        };
      } catch (err) {
        const msg = getErrorMessage(err);

        // Build helpful error with guide list from the index
        try {
          const entries = await getLlmsEntries();
          const guideList = entries
            .filter(e => e.section === 'guides')
            .map(e => `- ${e.name} (\`${e.slug}\`)`)
            .join('\n');

          return createToolError(`Erro: ${msg}\n\nGuias disponíveis:\n${guideList || 'Nenhum guia no índice.'}`);
        } catch {
          return createToolError(`Erro: ${msg}`);
        }
      }
    }
  );

  return server;
}
