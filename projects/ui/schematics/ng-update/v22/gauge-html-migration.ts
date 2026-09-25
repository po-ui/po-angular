import { GaugeAttribute, mapGaugeProperties, MappedChartAttributes } from './gauge-property-map';
import { MigrationWarning } from './migration-report';

/**
 * Resultado da transformação de um arquivo de template HTML pela
 * Schematic_Migracao.
 *
 * A função `migrateHtmlContent` é pura (string → string): recebe o conteúdo
 * original e devolve o conteúdo transformado, um indicador de alteração e a
 * lista de Casos_Nao_Migravel encontrados. O `filePath` das advertências é
 * preenchido pela camada de orquestração da schematic (que conhece o caminho).
 */
export interface HtmlMigrationResult {
  /** Conteúdo do template após a transformação (idêntico ao original se nada mudou). */
  content: string;
  /** `true` somente quando alguma transformação/marcação foi efetivamente aplicada. */
  changed: boolean;
  /** Casos_Nao_Migravel identificados (trecho malformado ou propriedade sem equivalente). */
  warnings: Array<MigrationWarning>;
}

/** Seletor de abertura do po-gauge (correspondência exata e case-sensitive, Req. 2.1). */
const OPEN_TAG = '<po-gauge';
/** Seletor de fechamento do po-gauge (correspondência exata e case-sensitive, Req. 2.2). */
const CLOSE_TAG = '</po-gauge>';
/** Marcador estável usado para detectar/evitar TODOs duplicados (idempotência, Req. 7.4). */
const TODO_MARKER = 'TODO: migração po-gauge';

/**
 * Atributo/binding bruto extraído da tag de abertura, com a whitespace que o
 * precede preservada para reconstrução fiel do layout original.
 */
interface RawAttr {
  /** Whitespace imediatamente anterior ao atributo (ex.: `'\n  '`). */
  leadingWs: string;
  /** Nome do atributo incluindo eventuais colchetes/parênteses (ex.: `[p-value]`). */
  name: string;
  /** Texto completo original do atributo (`nome="valor"`, `nome` ou `nome=valor`). */
  raw: string;
}

/** `GaugeAttribute` enriquecido com o atributo bruto de origem para reconstrução. */
interface ParsedAttr extends GaugeAttribute {
  source: RawAttr;
}

/** Resultado da varredura da tag de abertura `<po-gauge ...>`. */
interface OpeningTag {
  attrs: Array<RawAttr>;
  /** Whitespace entre o último atributo e o `>`/`/>`. */
  trailingWs: string;
  /** `true` quando a tag é auto-fechada (`/>`). */
  selfClosing: boolean;
  /** Índice do caractere imediatamente após `>` ou `/>`. */
  tagEndIndex: number;
}

/** Descreve um Caso_Nao_Migravel a preservar, com o trecho original e o motivo. */
interface PreservedSnippet {
  snippet: string;
  reason: string;
  line: number;
}

/**
 * Transforma usos de `<po-gauge>` em `<po-chart p-type="gauge">` em um template
 * HTML, mapeando as propriedades públicas conforme a Tabela de Mapeamento.
 *
 * Comportamento (Req. 2.1–2.3, 2.5–2.7, 3.10, 6.1, 6.3):
 * - Localiza cada elemento `po-gauge` (abertura/fechamento exatos e sensíveis a
 *   maiúsculas) e o reescreve para `po-chart`, injetando `p-type="gauge"` e os
 *   atributos gerados (`[p-series]`/`[p-options]`), preservando os atributos não
 *   mapeados e sua ordem original.
 * - Elementos já migrados (`po-chart`) nunca são correspondidos, garantindo
 *   idempotência (Req. 2.6, 7.4).
 * - Trechos malformados ou com propriedade sem equivalente são preservados sem
 *   alteração; um comentário `TODO` é inserido na linha anterior e um
 *   `MigrationWarning` é registrado (Req. 2.7, 3.10, 6.1, 6.3). O `TODO` não é
 *   duplicado quando já existe imediatamente antes do trecho (Req. 7.4).
 */
export function migrateHtmlContent(source: string): HtmlMigrationResult {
  const warnings: Array<MigrationWarning> = [];
  let result = '';
  let index = 0;
  let changed = false;

  while (index <= source.length) {
    const openIdx = source.indexOf(OPEN_TAG, index);
    if (openIdx === -1) {
      result += source.slice(index);
      break;
    }

    const charAfter = source[openIdx + OPEN_TAG.length];
    // Garante correspondência exata do seletor: o caractere seguinte deve ser
    // whitespace, `/` ou `>` (evita casar `<po-gauge-foo`).
    if (charAfter !== undefined && !isTagBoundary(charAfter)) {
      result += source.slice(index, openIdx + OPEN_TAG.length);
      index = openIdx + OPEN_TAG.length;
      continue;
    }

    // Texto entre o último ponto processado e este elemento.
    result += source.slice(index, openIdx);

    const line = lineOf(source, openIdx);
    const openingTag = scanOpeningTag(source, openIdx);

    // Caso 1: tag de abertura malformada (sem `>`, aspas não fechadas, etc.).
    if (!openingTag) {
      const preserved: PreservedSnippet = {
        snippet: OPEN_TAG,
        reason: 'Elemento po-gauge malformado (tag de abertura não pôde ser interpretada).',
        line
      };
      const outcome = appendPreserved(result, preserved, warnings);
      result = outcome.result;
      changed = outcome.changed || changed;
      index = openIdx + OPEN_TAG.length;
      continue;
    }

    // Caso 2: elemento não auto-fechado sem `</po-gauge>` correspondente.
    let innerContent = '';
    let elementEnd = openingTag.tagEndIndex;
    if (!openingTag.selfClosing) {
      const closeIdx = source.indexOf(CLOSE_TAG, openingTag.tagEndIndex);
      if (closeIdx === -1) {
        const preserved: PreservedSnippet = {
          snippet: source.slice(openIdx, openingTag.tagEndIndex),
          reason: 'Elemento po-gauge sem tag de fechamento (</po-gauge>) correspondente.',
          line
        };
        const outcome = appendPreserved(result, preserved, warnings);
        result = outcome.result;
        changed = outcome.changed || changed;
        index = openingTag.tagEndIndex;
        continue;
      }
      innerContent = source.slice(openingTag.tagEndIndex, closeIdx);
      elementEnd = closeIdx + CLOSE_TAG.length;
    }

    const gaugeAttrs = toGaugeAttributes(openingTag.attrs);
    const mapped = mapGaugeProperties(gaugeAttrs);

    // Caso 3: propriedade sem equivalente na Tabela de Mapeamento (Req. 3.10).
    if (mapped.unmapped.length > 0) {
      const props = mapped.unmapped.map(attr => attr.name).join(', ');
      const preserved: PreservedSnippet = {
        snippet: source.slice(openIdx, elementEnd),
        reason: `Propriedade(s) do po-gauge sem equivalente no po-chart: ${props}. Migração manual necessária.`,
        line
      };
      const outcome = appendPreserved(result, preserved, warnings);
      result = outcome.result;
      changed = outcome.changed || changed;
      index = elementEnd;
      continue;
    }

    // Caso de sucesso: reescreve o elemento para po-chart.
    result += buildChartElement(openingTag, mapped, innerContent);
    changed = true;
    index = elementEnd;

    // Conflito de p-options resolvido em favor de p-options (Req. 3.11): migra e
    // apenas registra a advertência, sem preservar/TODO.
    if (mapped.conflicts.length > 0) {
      warnings.push({
        filePath: '',
        line,
        reason:
          `Conflito de configuração em p-options para: ${mapped.conflicts.join(', ')}. ` +
          `Prevaleceu o valor definido em p-options; revise o resultado.`
      });
    }
  }

  return { content: result, changed, warnings };
}

/**
 * Anexa ao `result` acumulado um trecho preservado (Caso_Nao_Migravel),
 * inserindo um comentário `TODO` na linha imediatamente anterior (sem duplicar)
 * e registrando a advertência correspondente.
 */
function appendPreserved(
  result: string,
  preserved: PreservedSnippet,
  warnings: Array<MigrationWarning>
): { result: string; changed: boolean } {
  warnings.push({ filePath: '', line: preserved.line, reason: preserved.reason });

  if (hasTodoImmediatelyBefore(result)) {
    // TODO já presente (execução idempotente): apenas preserva o trecho.
    return { result: result + preserved.snippet, changed: false };
  }

  const lineStart = result.lastIndexOf('\n') + 1;
  const linePrefix = result.slice(lineStart);
  const todo = `<!-- ${TODO_MARKER} → po-chart requer revisão manual: ${preserved.reason} -->`;

  if (/^\s*$/.test(linePrefix)) {
    // O trecho inicia a linha (após a indentação): TODO na linha anterior com a
    // mesma indentação.
    const withTodo = result.slice(0, lineStart) + linePrefix + todo + '\n' + linePrefix;
    return { result: withTodo + preserved.snippet, changed: true };
  }

  // Há conteúdo antes do trecho na mesma linha: insere o TODO imediatamente
  // antes, em nova linha.
  return { result: result + todo + '\n' + preserved.snippet, changed: true };
}

/**
 * Reescreve a tag `po-gauge` para `po-chart`, injetando `p-type="gauge"`, os
 * atributos gerados (`[p-series]`/`[p-options]`/`[p-value-gauge-multiple]`) e
 * preservando os atributos não mapeados na ordem original.
 */
function buildChartElement(openingTag: OpeningTag, mapped: MappedChartAttributes, innerContent: string): string {
  const separator = openingTag.attrs.length > 0 ? openingTag.attrs[0].leadingWs || ' ' : ' ';
  const parts: Array<string> = [`${separator}[p-type]="$any('gauge')"`];

  // Atributos não mapeados preservados na ordem original, com a whitespace
  // original de cada um.
  mapped.passthrough.forEach(attr => {
    const source = (attr as ParsedAttr).source;
    parts.push(`${source.leadingWs || ' '}${source.raw}`);
  });

  if (mapped.pSeries !== undefined) {
    parts.push(`${separator}[p-series]="${mapped.pSeries}"`);
  }
  if (mapped.pValueGaugeMultiple !== undefined) {
    parts.push(`${separator}[p-value-gauge-multiple]="${mapped.pValueGaugeMultiple}"`);
  }
  if (mapped.pOptions !== undefined) {
    parts.push(`${separator}[p-options]="${mapped.pOptions}"`);
  }

  const openTag = `<po-chart${parts.join('')}${openingTag.trailingWs}${openingTag.selfClosing ? '/>' : '>'}`;

  return openingTag.selfClosing ? openTag : `${openTag}${innerContent}</po-chart>`;
}

/**
 * Varre a tag de abertura `<po-gauge ...>` a partir de `openIdx`, extraindo os
 * atributos com a whitespace que os precede e determinando o fim da tag.
 * Retorna `null` quando a tag está malformada (sem `>` ou com aspas não
 * fechadas), sinalizando um Caso_Nao_Migravel.
 */
function scanOpeningTag(source: string, openIdx: number): OpeningTag | null {
  const len = source.length;
  const attrs: Array<RawAttr> = [];
  let i = openIdx + OPEN_TAG.length;

  while (i < len) {
    const wsStart = i;
    while (i < len && isWhitespace(source[i])) {
      i++;
    }
    const leadingWs = source.slice(wsStart, i);

    if (i >= len) {
      return null;
    }

    const ch = source[i];

    if (ch === '>') {
      return { attrs, trailingWs: leadingWs, selfClosing: false, tagEndIndex: i + 1 };
    }
    if (ch === '/' && source[i + 1] === '>') {
      return { attrs, trailingWs: leadingWs, selfClosing: true, tagEndIndex: i + 2 };
    }
    if (ch === '/') {
      // `/` isolado não seguido de `>`: estrutura não reconhecida.
      return null;
    }

    const nameStart = i;
    while (i < len && !isNameTerminator(source[i])) {
      i++;
    }
    const name = source.slice(nameStart, i);
    if (name.length === 0) {
      return null;
    }

    // Whitespace opcional antes de um eventual `=`.
    let j = i;
    while (j < len && isWhitespace(source[j])) {
      j++;
    }

    if (source[j] === '=') {
      j++;
      while (j < len && isWhitespace(source[j])) {
        j++;
      }
      const quote = source[j];
      if (quote === '"' || quote === "'") {
        const valueEnd = source.indexOf(quote, j + 1);
        if (valueEnd === -1) {
          return null;
        }
        attrs.push({ leadingWs, name, raw: source.slice(nameStart, valueEnd + 1) });
        i = valueEnd + 1;
      } else {
        // Valor sem aspas: consome até whitespace ou `>`.
        let k = j;
        while (k < len && !isWhitespace(source[k]) && source[k] !== '>') {
          k++;
        }
        attrs.push({ leadingWs, name, raw: source.slice(nameStart, k) });
        i = k;
      }
    } else {
      // Atributo booleano (sem valor).
      attrs.push({ leadingWs, name, raw: source.slice(nameStart, i) });
    }
  }

  return null;
}

/**
 * Converte os atributos brutos em `GaugeAttribute` (enriquecidos com o atributo
 * de origem) para consumo por `mapGaugeProperties`. A expressão original é
 * preservada textualmente (Req. 3.1–3.7).
 */
function toGaugeAttributes(attrs: Array<RawAttr>): Array<ParsedAttr> {
  return attrs.map(source => {
    const binding = source.name.startsWith('[');
    return {
      name: source.name,
      binding,
      rawExpression: extractRawExpression(source),
      source
    };
  });
}

/** Extrai a expressão/valor original do atributo (conteúdo entre aspas, se houver). */
function extractRawExpression(source: RawAttr): string {
  const eqIndex = source.raw.indexOf('=');
  if (eqIndex === -1) {
    // Atributo booleano sem valor.
    return '';
  }

  const afterEq = source.raw.slice(eqIndex + 1).trim();
  const first = afterEq[0];
  if (first === '"' || first === "'") {
    return afterEq.slice(1, afterEq.lastIndexOf(first));
  }
  return afterEq;
}

/**
 * Indica se já existe um comentário `TODO` da migração imediatamente antes do
 * trecho (última linha não vazia do conteúdo já acumulado), evitando duplicatas
 * em reexecuções (idempotência, Req. 7.4).
 */
function hasTodoImmediatelyBefore(result: string): boolean {
  const trimmed = result.replace(/\s+$/, '');
  if (!trimmed.endsWith('-->')) {
    return false;
  }
  const open = trimmed.lastIndexOf('<!--');
  if (open === -1) {
    return false;
  }
  return trimmed.slice(open).includes(TODO_MARKER);
}

/** Número da linha (1-indexado) correspondente ao índice informado. */
function lineOf(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (source[i] === '\n') {
      line++;
    }
  }
  return line;
}

/** `true` quando o caractere delimita o fim do seletor (`whitespace`, `/` ou `>`). */
function isTagBoundary(char: string): boolean {
  return isWhitespace(char) || char === '/' || char === '>';
}

/** `true` quando o caractere encerra o nome de um atributo. */
function isNameTerminator(char: string): boolean {
  return isWhitespace(char) || char === '=' || char === '>' || char === '/';
}

/** `true` para qualquer caractere de espaçamento (espaço, tab, quebras de linha). */
function isWhitespace(char: string): boolean {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '\f' || char === '\v';
}
