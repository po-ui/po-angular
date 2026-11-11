import { SearchExcerptPart } from './search.model';

/**
 * Normaliza para busca: minúsculas e sem acento, mantendo o MESMO tamanho do texto original
 * (assim as posições achadas no texto normalizado valem no original para o destaque).
 */
export function normalizeText(text: string): string {
  let result = '';

  for (const char of text) {
    const stripped = char
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const lower = char.toLowerCase();

    result += stripped.length === char.length ? stripped : lower.length === char.length ? lower : char;
  }

  return result;
}

/**
 * Tokenizador do índice e da consulta: divide por pontuação e também separa `po-button`, `p-kind` e `PoButton`,
 * mantendo o nome inteiro como termo extra (`po-button`). Sempre devolve termos normalizados.
 */
export function tokenize(text: string): Array<string> {
  const tokens: Array<string> = [];

  text.split(/[\s,;:()<>[\]{}"'`!?/\\|=+*&%$#@~^\u203a]+/).forEach(word => {
    if (!word) return;

    const pieces = word
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(/[\s\-_.]+/)
      .filter(Boolean);

    if (pieces.length > 1) {
      tokens.push(normalizeText(word));
    }
    pieces.forEach(piece => tokens.push(normalizeText(piece)));
  });

  return tokens;
}

/** Termos da consulta (sem repetição, ≥ 1 caractere), usados no destaque. */
export function queryTerms(query: string): Array<string> {
  const unique = Array.from(new Set(tokenize(query))).filter(term => term.length >= 2);

  // `po-button` já cobre `po` e `button`: marcar os pedaços só poluiria o trecho.
  return unique
    .filter(term => !unique.some(other => other !== term && other.includes(term)))
    .sort((a, b) => b.length - a.length);
}

function markRanges(normalized: string, terms: Array<string>): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];

  terms.forEach(term => {
    let from = normalized.indexOf(term);

    while (term && from !== -1) {
      // só no começo de palavra (como a busca por prefixo): "po" não marca o meio de "possível"
      if (from === 0 || !/[a-z0-9]/.test(normalized[from - 1])) {
        ranges.push([from, from + term.length]);
      }
      from = normalized.indexOf(term, from + 1);
    }
  });

  ranges.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

  return ranges.reduce<Array<[number, number]>>((merged, range) => {
    const last = merged[merged.length - 1];

    if (last && range[0] <= last[1]) {
      last[1] = Math.max(last[1], range[1]);
    } else {
      merged.push([range[0], range[1]]);
    }

    return merged;
  }, []);
}

/** Quebra o texto em partes marcadas / não marcadas. Seguro contra XSS: o template usa interpolação, não `innerHTML`. */
export function highlight(text: string, terms: Array<string>): Array<SearchExcerptPart> {
  if (!text) return [];

  const parts: Array<SearchExcerptPart> = [];
  let cursor = 0;

  markRanges(normalizeText(text), terms).forEach(([start, end]) => {
    if (start > cursor) parts.push({ text: text.slice(cursor, start), mark: false });
    parts.push({ text: text.slice(start, end), mark: true });
    cursor = end;
  });
  if (cursor < text.length) parts.push({ text: text.slice(cursor), mark: false });

  return parts;
}

/**
 * Trecho do texto em volta da primeira ocorrência de um termo (±`radius` caracteres, cortado em palavra),
 * com os termos marcados. Sem ocorrência no texto, devolve o começo.
 */
export function buildExcerpt(text: string, terms: Array<string>, radius = 60): Array<SearchExcerptPart> {
  if (!text) return [];

  const normalized = normalizeText(text);
  const first = terms
    .filter(Boolean)
    .map(term => normalized.indexOf(term))
    .filter(index => index !== -1)
    .sort((a, b) => a - b)[0];

  if (first === undefined) {
    return text.length > radius * 2
      ? [{ text: `${text.slice(0, radius * 2).trimEnd()}…`, mark: false }]
      : [{ text, mark: false }];
  }

  let start = Math.max(0, first - radius);
  let end = Math.min(text.length, first + radius * 2);

  if (start > 0) {
    const space = text.indexOf(' ', start);
    start = space !== -1 && space < first ? space + 1 : start;
  }
  if (end < text.length) {
    const space = text.lastIndexOf(' ', end);
    end = space > first ? space : end;
  }

  const parts = highlight(text.slice(start, end), terms);

  if (start > 0) parts.unshift({ text: '…', mark: false });
  if (end < text.length) parts.push({ text: '…', mark: false });

  return parts;
}
