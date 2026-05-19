/**
 * @description
 *
 * Utilitário de "Safe Parser" para o componente po-helper.
 *
 * Permite o uso de tags de formatação básica (`<b>`, `<strong>`, `<i>`, `<em>`, `<u>`) no conteúdo do helper, sem
 * utilizar `innerHTML`, garantindo proteção contra ataques XSS.
 *
 * Qualquer tag HTML que não esteja na whitelist é sanitizada (removida), preservando apenas o texto interno.
 */

/**
 * Representa um fragmento de texto com suas propriedades de formatação.
 */
export interface PoHelperTextFragment {
  /** Conteúdo textual do fragmento */
  text: string;
  /** Indica se o fragmento deve ser exibido em negrito */
  bold: boolean;
  /** Indica se o fragmento deve ser exibido em itálico */
  italic: boolean;
  /** Indica se o fragmento deve ser exibido com sublinhado */
  underline: boolean;
}

/** Tags permitidas pelo safe parser */
const ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em'];

/** Mapa de normalização: tags semânticas são convertidas para suas equivalentes de formatação */
const TAG_NORMALIZE_MAP: Record<string, string> = {
  strong: 'b',
  em: 'i'
};

/**
 * Regex para capturar tags HTML (abertura e fechamento).
 * Captura: tag name e se é fechamento (/).
 */
const TAG_REGEX = /<(\/?)(\w+)(?:\s[^>]*)?\/?>/gi;

/**
 * Remove todas as tags HTML que não estão na whitelist, preservando o texto interno.
 *
 * @param input String com possíveis tags HTML
 * @returns String com apenas as tags permitidas
 */
function sanitizeContent(input: string): string {
  return input.replace(TAG_REGEX, (_match, closing, tagName) => {
    const normalizedTag = tagName.toLowerCase();
    if (ALLOWED_TAGS.includes(normalizedTag)) {
      const outputTag = TAG_NORMALIZE_MAP[normalizedTag] || normalizedTag;
      return closing ? `</${outputTag}>` : `<${outputTag}>`;
    }
    return '';
  });
}

/** Mapa de contadores por tag */
interface TagCounters {
  b: number;
  i: number;
  u: number;
}

/**
 * Incrementa o contador da tag de abertura.
 */
function incrementTagCounter(counters: TagCounters, tag: string): void {
  counters[tag]++;
}

/**
 * Decrementa o contador da tag de fechamento.
 */
function decrementTagCounter(counters: TagCounters, tag: string): void {
  counters[tag] = Math.max(0, counters[tag] - 1);
}

/**
 * Faz o parsing de uma string com tags de formatação permitidas (`<b>`, `<i>`, `<u>`)
 * e retorna um array de fragmentos com as propriedades de formatação aplicadas.
 *
 * Tags não permitidas são removidas (sanitizadas). Tags aninhadas são suportadas.
 *
 * @param content String de conteúdo com possíveis tags de formatação
 * @returns Array de fragmentos de texto com informações de formatação
 */
export function parseHelperContent(content: string): Array<PoHelperTextFragment> {
  if (!content) {
    return [];
  }

  const sanitized = sanitizeContent(content);
  const fragments: Array<PoHelperTextFragment> = [];
  const counters: TagCounters = { b: 0, i: 0, u: 0 };

  const splitRegex = /(<\/?[biu]>)/gi;
  const parts = sanitized.split(splitRegex);

  for (const part of parts) {
    if (!part) {
      continue;
    }

    const tagMatch = /^<(\/?)([biu])>$/i.exec(part);

    if (tagMatch) {
      const isClosing = tagMatch[1] === '/';
      const tag = tagMatch[2].toLowerCase();
      if (isClosing) {
        decrementTagCounter(counters, tag);
      } else {
        incrementTagCounter(counters, tag);
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
