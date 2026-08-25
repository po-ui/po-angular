import * as https from 'node:https';
import * as http from 'node:http';

const BASE_URL = 'https://po-ui.io';
const GITHUB_RAW = 'https://raw.githubusercontent.com/po-ui/po-angular/master';
const GITHUB_REPOSITORY = 'https://github.com/po-ui/po-angular';
const GITHUB_API = 'https://api.github.com/repos/po-ui/po-angular';
const FETCH_TIMEOUT_MS = 10_000;

const COMPONENT_SOURCE_ROOTS = [
  'projects/ui/src/lib/components',
  'projects/templates/src/lib/components',
  'projects/code-editor/src/lib/components'
];

const COMPONENT_EXAMPLE_PARENTS: Record<string, string> = {
  'po-accordion-item': 'po-accordion',
  'po-button-base': 'po-button',
  'po-button-group-base': 'po-button-group',
  'po-checkbox-base': 'po-checkbox',
  'po-helper-base': 'po-helper',
  'po-modal-footer': 'po-modal',
  'po-page-slide-footer': 'po-page-slide',
  'po-popover-base': 'po-popover',
  'po-step': 'po-stepper',
  'po-tab': 'po-tabs'
};

export const BEST_PRACTICE_TOPICS = ['contributing', 'development-flow', 'getting-started', 'theme-service'] as const;

export type BestPracticeTopic = (typeof BEST_PRACTICE_TOPICS)[number];

export interface OfficialDocument {
  content: string;
  title: string;
  url: string;
}

export interface ComponentExampleFile {
  content: string;
  language: string;
  name: string;
  url: string;
}

export interface ComponentExample {
  files: Array<ComponentExampleFile>;
  name: string;
  url: string;
}

export interface ComponentExamplesResult {
  examples: Array<ComponentExample>;
  sourceSlug: string;
  status: 'available' | 'no_match' | 'not_available';
}

interface GitHubTreeEntry {
  path: string;
  type: 'blob' | 'tree';
}

interface GitHubTreeResponse {
  tree: Array<GitHubTreeEntry>;
  truncated?: boolean;
}

interface SamplesLocation {
  files: Array<GitHubTreeEntry>;
  rootPath: string;
}

let repositoryTreePromise: Promise<Array<GitHubTreeEntry>> | undefined;

const BEST_PRACTICE_SOURCES: Record<BestPracticeTopic, Omit<OfficialDocument, 'content'> & { rawUrl: string }> = {
  contributing: {
    title: 'Contribuindo com o PO UI',
    url: `${GITHUB_REPOSITORY}/blob/master/CONTRIBUTING.md`,
    rawUrl: `${GITHUB_RAW}/CONTRIBUTING.md`
  },
  'development-flow': {
    title: 'Fluxo de desenvolvimento',
    url: `${GITHUB_REPOSITORY}/blob/master/docs/guides/development-flow.md`,
    rawUrl: `${GITHUB_RAW}/docs/guides/development-flow.md`
  },
  'getting-started': {
    title: 'Primeiros passos',
    url: `${GITHUB_REPOSITORY}/blob/master/docs/guides/getting-started.md`,
    rawUrl: `${GITHUB_RAW}/docs/guides/getting-started.md`
  },
  'theme-service': {
    title: 'Customização de temas com PoThemeService',
    url: `${GITHUB_REPOSITORY}/blob/master/docs/guides/theme-service.md`,
    rawUrl: `${GITHUB_RAW}/docs/guides/theme-service.md`
  }
};

interface FetchResult {
  ok: boolean;
  text: string;
  statusCode?: number;
}

function buildRequestHeaders(url: string): Record<string, string> {
  const headers: Record<string, string> = { 'User-Agent': 'po-ui-mcp' };

  if (url.startsWith(`${GITHUB_API}/`) || url === GITHUB_API) {
    headers.Accept = 'application/vnd.github+json';
  }

  return headers;
}

function fetchUrl(url: string): Promise<FetchResult> {
  return new Promise(resolve => {
    const client = url.startsWith('https') ? https : http;

    const req = (client as typeof https).get(
      url,
      {
        headers: buildRequestHeaders(url),
        timeout: FETCH_TIMEOUT_MS
      },
      res => {
        // Follow redirects (301/302)
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(fetchUrl(res.headers.location));
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf-8');
          resolve({
            ok: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            text
          });
        });
        res.on('error', () => resolve({ ok: false, text: '' }));
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, text: 'Request timed out' });
    });

    req.on('error', (err: Error) => resolve({ ok: false, text: err.message }));
  });
}

function parseJson<T>(result: FetchResult, url: string): T {
  try {
    return JSON.parse(result.text) as T;
  } catch {
    throw new Error(`Resposta JSON inválida recebida de ${url}`);
  }
}

function getLanguage(fileName: string): string {
  const extension = fileName.split('.').pop();
  const languages: Record<string, string> = {
    css: 'css',
    html: 'html',
    json: 'json',
    scss: 'scss',
    ts: 'typescript'
  };

  return languages[extension ?? ''] ?? 'text';
}

function isWithinComponentSource(path: string): boolean {
  return COMPONENT_SOURCE_ROOTS.some(root => path.startsWith(`${root}/`));
}

function findSamplesLocation(tree: Array<GitHubTreeEntry>, slug: string): SamplesLocation | undefined {
  const samplesMarker = `/${slug}/samples/`;
  const locations = new Map<string, Array<GitHubTreeEntry>>();

  for (const entry of tree) {
    if (entry.type !== 'blob' || !isWithinComponentSource(entry.path)) continue;

    const markerIndex = entry.path.indexOf(samplesMarker);
    if (markerIndex === -1 || !/\.(?:css|html|json|scss|ts)$/.test(entry.path)) continue;

    const rootPath = entry.path.slice(0, markerIndex + samplesMarker.length - 1);
    const files = locations.get(rootPath) ?? [];
    files.push(entry);
    locations.set(rootPath, files);
  }

  const [rootPath, files] = [...locations.entries()].sort(([pathA], [pathB]) => pathA.length - pathB.length)[0] ?? [];
  return rootPath && files ? { files, rootPath } : undefined;
}

function componentExists(tree: Array<GitHubTreeEntry>, slug: string): boolean {
  const componentMarker = `/${slug}/`;
  return tree.some(entry => isWithinComponentSource(entry.path) && `/${entry.path}/`.includes(componentMarker));
}

async function loadRepositoryTree(): Promise<Array<GitHubTreeEntry>> {
  const url = `${GITHUB_API}/git/trees/master?recursive=1`;
  const result = await fetchUrl(url);

  if (!result.ok) {
    throw new Error(`Falha ao carregar o índice de exemplos (HTTP ${result.statusCode ?? 'desconhecido'}).`);
  }

  const response = parseJson<GitHubTreeResponse>(result, url);
  if (!Array.isArray(response.tree)) {
    throw new TypeError(`Resposta inválida recebida de ${url}: campo "tree" ausente.`);
  }
  if (response.truncated) {
    throw new Error('O índice de exemplos retornado pelo GitHub está incompleto. Tente novamente mais tarde.');
  }

  return response.tree;
}

async function getRepositoryTree(): Promise<Array<GitHubTreeEntry>> {
  if (!repositoryTreePromise) {
    repositoryTreePromise = loadRepositoryTree().catch(error => {
      repositoryTreePromise = undefined;
      throw error;
    });
  }

  return repositoryTreePromise;
}

/** Clear the session cache. Intended for tests that mock the GitHub tree. */
export function clearRepositoryTreeCache(): void {
  repositoryTreePromise = undefined;
}

export async function fetchComponentExamples(
  slug: string,
  maxExamples: number,
  exampleFilter?: string
): Promise<ComponentExamplesResult> {
  const repositoryTree = await getRepositoryTree();
  const directLocation = findSamplesLocation(repositoryTree, slug);
  const sourceSlug = directLocation ? slug : (COMPONENT_EXAMPLE_PARENTS[slug] ?? slug);
  const location = directLocation ?? findSamplesLocation(repositoryTree, sourceSlug);

  if (!location) {
    if (componentExists(repositoryTree, slug)) {
      return { examples: [], sourceSlug: slug, status: 'not_available' };
    }
    throw new Error(`Componente "${slug}" não encontrado no repositório oficial.`);
  }

  const sampleNames = [
    ...new Set(location.files.map(entry => entry.path.slice(location.rootPath.length + 1).split('/')[0]))
  ]
    .filter(name => !exampleFilter || name.toLowerCase().includes(exampleFilter.toLowerCase()))
    .sort()
    .slice(0, maxExamples);

  const examples = await Promise.all(
    sampleNames.map(async name => {
      const entries = location.files.filter(entry => entry.path.startsWith(`${location.rootPath}/${name}/`));
      const files = await Promise.all(
        entries.map(async entry => {
          const path = entry.path;
          const rawUrl = `${GITHUB_RAW}/${path}`;
          const result = await fetchUrl(rawUrl);

          if (!result.ok) {
            throw new Error(
              `Falha ao buscar o arquivo de exemplo "${path}" (HTTP ${result.statusCode ?? 'desconhecido'}).`
            );
          }

          return {
            content: result.text,
            language: getLanguage(entry.path),
            name: entry.path.split('/').pop() ?? entry.path,
            url: `${GITHUB_REPOSITORY}/blob/master/${path}`
          };
        })
      );

      return {
        files,
        name,
        url: `${GITHUB_REPOSITORY}/tree/master/${location.rootPath}/${name}`
      };
    })
  );

  return {
    examples,
    sourceSlug,
    status: examples.length > 0 ? 'available' : 'no_match'
  };
}

export async function fetchBestPractices(topic: BestPracticeTopic): Promise<OfficialDocument> {
  const source = BEST_PRACTICE_SOURCES[topic];
  const result = await fetchUrl(source.rawUrl);

  if (!result.ok) {
    throw new Error(`Falha ao buscar boas práticas de "${topic}" (HTTP ${result.statusCode ?? 'desconhecido'}).`);
  }

  return { content: result.text, title: source.title, url: source.url };
}

export async function fetchLlmsTxt(): Promise<string> {
  const result = await fetchUrl(`${BASE_URL}/llms.txt`);
  if (result.ok) return result.text;
  throw new Error(`Falha ao buscar llms.txt (HTTP ${result.statusCode ?? 'desconhecido'})`);
}

export async function fetchLlmsFullTxt(): Promise<string> {
  const result = await fetchUrl(`${BASE_URL}/llms-full.txt`);
  if (result.ok) return result.text;
  throw new Error(`Falha ao buscar llms-full.txt (HTTP ${result.statusCode ?? 'desconhecido'})`);
}

export async function fetchComponentDoc(slug: string): Promise<string> {
  const primaryUrl = `${BASE_URL}/llms-generated/${slug}.md`;
  const primary = await fetchUrl(primaryUrl);
  if (primary.ok) return primary.text;

  const fallbackUrl = `${GITHUB_RAW}/projects/portal/src/llms-generated/${slug}.md`;
  const fallback = await fetchUrl(fallbackUrl);
  if (fallback.ok) return fallback.text;

  throw new Error(
    `Documentação não encontrada para o slug "${slug}".\n` +
      `Tentativas:\n` +
      `  - ${primaryUrl} (HTTP ${primary.statusCode ?? 'erro'})\n` +
      `  - ${fallbackUrl} (HTTP ${fallback.statusCode ?? 'erro'})`
  );
}

export async function fetchGuide(name: string): Promise<string> {
  const guideName = name.endsWith('.md') ? name.slice(0, -3) : name;
  const url = `${GITHUB_RAW}/docs/guides/${guideName}.md`;
  const result = await fetchUrl(url);
  if (result.ok) return result.text;

  throw new Error(
    `Guia "${guideName}" não encontrado (HTTP ${result.statusCode ?? 'desconhecido'}).\n` + `URL tentada: ${url}`
  );
}
