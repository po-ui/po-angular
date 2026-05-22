/**
 * Parser seguro de tags de formatação (`<b>`, `<strong>`, `<i>`, `<em>`, `<u>`).
 * Não utiliza `innerHTML`. Tags fora da whitelist são removidas (proteção XSS).
 */

/** Fragmento de texto com flags de formatação. */
export interface PoTextFragment {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

/** Tags de formatação suportadas. */
export type PoFormattingTag = 'b' | 'i' | 'u' | 'strong' | 'em';

const TAG_NORMALIZE_MAP: Record<string, string> = { strong: 'b', em: 'i' };
const TAG_REGEX = /<(\/?)(\w+)(?:\s[^>]*)?\/?>/gi;

interface TagCounters {
  b: number;
  i: number;
  u: number;
}

function sanitizeContent(input: string, allowedTags: Array<PoFormattingTag>): string {
  return input.replace(TAG_REGEX, (_match, closing, tagName) => {
    const normalized = tagName.toLowerCase();
    if (allowedTags.includes(normalized)) {
      const output = TAG_NORMALIZE_MAP[normalized] || normalized;
      return closing ? `</${output}>` : `<${output}>`;
    }
    return '';
  });
}

/**
 * Faz o parsing seguro de uma string com tags de formatação.
 *
 * O consumidor declara quais tags aceita via `allowedTags` (obrigatório).
 * Tags não listadas são removidas. Tags aninhadas são suportadas.
 *
 * @param content String com possíveis tags de formatação.
 * @param allowedTags Tags permitidas pelo consumidor.
 */
export function parseSafeText(content: string, allowedTags: Array<PoFormattingTag>): Array<PoTextFragment> {
  if (!content) {
    return [];
  }

  const sanitized = sanitizeContent(content, allowedTags);
  const fragments: Array<PoTextFragment> = [];
  const counters: TagCounters = { b: 0, i: 0, u: 0 };
  const parts = sanitized.split(/(<\/?[biu]>)/gi);

  for (const part of parts) {
    if (!part) {
      continue;
    }

    const tagMatch = /^<(\/?)([biu])>$/i.exec(part);

    if (tagMatch) {
      const tag = tagMatch[2].toLowerCase();
      if (tagMatch[1] === '/') {
        counters[tag] = Math.max(0, counters[tag] - 1);
      } else {
        counters[tag]++;
      }
    } else {
      fragments.push({
        text: part,
        bold: counters.b > 0,
        italic: counters.i > 0,
        underline: counters.u > 0
      });
    }
  }

  return fragments;
}
