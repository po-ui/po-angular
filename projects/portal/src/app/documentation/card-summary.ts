/** Tamanho máximo do texto do card (cabe inteiro no po-widget de 320px, sem corte visual). */
export const CARD_SUMMARY_MAX = 160;

/** Palavras que terminam em ponto sem fechar a frase ("ex.", "p.ex.", "e.g."...). */
const ABBREVIATION = /(?:^|[\s(])(?:ex|p\.ex|e\.g|i\.e|etc|obs|sr|sra|dr|vs|aprox|pág|nº)$/i;

/** Tira a marcação inline do markdown: links, código, negrito/itálico e HTML. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])[*_]([^*_]+)[*_](?=[^\w*]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 1º parágrafo de texto do markdown (linhas juntas até a linha em branco), sem blocos de código,
 * títulos, citações, listas, tabelas ou HTML.
 */
function firstParagraph(markdown: string): string {
  const lines: Array<string> = [];
  let inCode = false;

  for (const raw of markdown.split('\n')) {
    const line = raw.trim();

    if (/^(```|~~~)/.test(line)) {
      inCode = !inCode;
      if (lines.length) break;
      continue;
    }
    if (inCode) continue;

    const isText = line && !/^(#{1,6}\s|>|[-*+]\s|\d+[.)]\s|<|\|)/.test(line);

    if (isText) {
      lines.push(line);
    } else if (lines.length) {
      break;
    }
  }

  return lines.join(' ');
}

/** Texto até o 1º ponto final (`.`, `!`, `?` seguido de espaço ou fim), sem parar em abreviações nem em `po-x.y`. */
function firstSentence(text: string): string {
  const end = /[.!?](?=\s|$)/g;
  let match: RegExpExecArray | null;

  while ((match = end.exec(text))) {
    if (match[0] === '.' && ABBREVIATION.test(text.slice(0, match.index))) continue;

    return text.slice(0, match.index + 1);
  }

  return text;
}

/** Corta em limite de palavra e põe "..." quando passa de `max`. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 3);
  const space = cut.lastIndexOf(' ');

  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,;:]+$/, '')}...`;
}

/**
 * Texto dos cards sem preview na listagem: a 1ª frase do 1º parágrafo da descrição (markdown),
 * em texto simples e com no máximo `max` caracteres.
 */
export function cardSummary(markdown?: string, max = CARD_SUMMARY_MAX): string {
  if (!markdown) return '';

  return truncate(firstSentence(plainText(firstParagraph(markdown))), max);
}
