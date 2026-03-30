import * as https from 'node:https';
import * as http from 'node:http';

const BASE_URL = 'https://po-ui.io';
const GITHUB_RAW = 'https://raw.githubusercontent.com/po-ui/po-angular/master';
const FETCH_TIMEOUT_MS = 10_000;

interface FetchResult {
  ok: boolean;
  text: string;
  statusCode?: number;
}

function fetchUrl(url: string): Promise<FetchResult> {
  return new Promise(resolve => {
    const client = url.startsWith('https') ? https : http;

    const req = (client as typeof https).get(url, { timeout: FETCH_TIMEOUT_MS }, res => {
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
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, text: 'Request timed out' });
    });

    req.on('error', (err: Error) => resolve({ ok: false, text: err.message }));
  });
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

  // Fallback: GitHub raw
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
