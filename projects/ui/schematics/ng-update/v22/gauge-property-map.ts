import { gaugePropertyRules, GaugePropertyRule } from './changes';

/**
 * Representa um único atributo/binding de um elemento `po-gauge` extraído do
 * template. A expressão original é preservada textualmente (`rawExpression`),
 * sem qualquer avaliação, garantindo que a migração seja fiel ao código-fonte.
 */
export interface GaugeAttribute {
  /** Nome da propriedade do po-gauge (ex.: `p-value`, `p-ranges`). */
  name: string;
  /** `true` quando o atributo é um property binding (`[p-value]="..."`). */
  binding: boolean;
  /** Expressão/valor original preservado textualmente. */
  rawExpression: string;
}

/**
 * Resultado do mapeamento das propriedades do `po-gauge` para os atributos do
 * `po-chart`, conforme o comportamento real do componente po-gauge da v21.
 */
export interface MappedChartAttributes {
  /** Expressão gerada para `[p-series]` do po-chart. */
  pSeries?: string;
  /** Expressão gerada para `[p-options]` do po-chart (omitida se não aplicável). */
  pOptions?: string;
  /** Expressão gerada para `[p-value-gauge-multiple]` (quando p-value + p-ranges). */
  pValueGaugeMultiple?: string;
  /** Atributos fora do Mapeamento_Propriedades preservados no elemento (Req. 2.5). */
  passthrough: Array<GaugeAttribute>;
  /** Propriedades `po-gauge` sem equivalente na tabela (Req. 3.10). */
  unmapped: Array<GaugeAttribute>;
  /** Chaves de `p-options` em conflito entre propriedade individual e `p-options` (Req. 3.11). */
  conflicts: Array<string>;
}

/** Índice das regras de mapeamento por nome da propriedade do po-gauge. */
const ruleByProp: Map<string, GaugePropertyRule> = (() => {
  const map = new Map<string, GaugePropertyRule>();
  gaugePropertyRules.forEach(rule => map.set(rule.gaugeProp, rule));
  return map;
})();

/**
 * Mapeia os atributos/bindings de um `po-gauge` para a configuração equivalente
 * do `po-chart`, seguindo o comportamento real do componente po-gauge da v21.
 *
 * Regras aplicadas (baseadas no template e ngOnChanges do po-gauge):
 * - `p-value` sem `p-ranges` → `[p-series]="[{ data: <expr> }]"`
 * - `p-value` com `p-ranges` → `[p-value-gauge-multiple]="<expr>"`
 * - `p-ranges` → `[p-series]="<ranges expr>"` (direto, sem wrap)
 * - `p-title` → `[p-title]` passthrough direto no po-chart
 * - `p-height` → `[p-height]` passthrough direto no po-chart
 * - `p-description` → `p-options.descriptionChart`
 * - `p-show-from-to-legend` → `p-options.showFromToLegend`
 * - `p-show-pointer` → `p-options.pointer`
 * - `p-options` → mescla para `[p-options]` do po-chart
 * - `showContainerGauge: true` é injetado por padrão em `p-options`
 *   (comportamento do ngOnInit do po-gauge)
 * - Propriedade `p-*` sem equivalente: coletada em `unmapped`
 * - Demais atributos (não `po-gauge`): coletados em `passthrough`
 * - Conflito entre propriedade individual e chave de `p-options`: prevalece o
 *   valor de `p-options` e o conflito é registrado
 */
export function mapGaugeProperties(attrs: Array<GaugeAttribute>): MappedChartAttributes {
  const result: MappedChartAttributes = {
    passthrough: [],
    unmapped: [],
    conflicts: []
  };

  let valueAttr: GaugeAttribute | undefined;
  let rangesAttr: GaugeAttribute | undefined;
  let optionsAttr: GaugeAttribute | undefined;

  // Entradas individuais destinadas a p-options, na ordem de ocorrência.
  const optionEntries: Array<{ key: string; value: string }> = [];

  attrs.forEach(attr => {
    const base = normalizeName(attr.name);
    const rule = ruleByProp.get(base);

    if (!rule) {
      // Propriedade `p-*` do po-gauge sem equivalente vs. atributo genérico
      // preservado.
      if (base.toLowerCase().startsWith('p-')) {
        result.unmapped.push(attr);
      } else {
        result.passthrough.push(attr);
      }
      return;
    }

    switch (rule.target) {
      case 'p-series':
        if (base === 'p-value') {
          valueAttr = attr;
        } else if (base === 'p-ranges') {
          rangesAttr = attr;
        }
        break;
      case 'p-options':
        if (base === 'p-options') {
          optionsAttr = attr;
        } else if (rule.optionsKey) {
          optionEntries.push({ key: rule.optionsKey, value: formatValue(attr) });
        }
        break;
      case 'passthrough':
        // p-title e p-height vão direto como inputs do po-chart.
        result.passthrough.push(attr);
        break;
    }
  });

  const pSeries = buildSeries(valueAttr, rangesAttr);
  if (pSeries !== undefined) {
    result.pSeries = pSeries;
  }

  // Quando p-value + p-ranges estão presentes, o valor vai para
  // p-value-gauge-multiple (como no ngOnChanges do po-gauge original).
  if (valueAttr && rangesAttr) {
    const rangesExpr = formatValue(rangesAttr);
    if (isNonEmptyArrayLiteral(rangesExpr)) {
      result.pValueGaugeMultiple = formatValue(valueAttr);
    } else {
      // Ranges dinâmico: quando vazio em runtime, o po-gauge colocava o valor na
      // série (`[{ data: value }]`) e não usava valuesMultiple. Replica esse
      // fallback condicional para preservar o comportamento original.
      // Usa `expr && expr.length` para evitar warning NG8107.
      result.pValueGaugeMultiple = `${rangesExpr} && ${rangesExpr}.length ? ${formatValue(valueAttr)} : undefined`;
    }
  }

  const pOptions = buildOptions(optionEntries, optionsAttr, result.conflicts);
  if (pOptions !== undefined) {
    result.pOptions = pOptions;
  }

  return result;
}

/**
 * Constrói a expressão de `p-series` seguindo o comportamento real do
 * ngOnChanges do po-gauge:
 * - Com ranges: `this.series = [...this.ranges]` → p-series recebe ranges diretamente
 * - Sem ranges, com value: `this.series = [{ data: this.value }]`
 * - Nem value nem ranges: gera `[]` (comportamento padrão do po-gauge que
 *   inicializava `series: Array<PoChartSerie> = []`)
 *
 * Quando ambos existem, o value é tratado separadamente via
 * `p-value-gauge-multiple` (pelo chamador).
 */
function buildSeries(valueAttr: GaugeAttribute | undefined, rangesAttr: GaugeAttribute | undefined): string {
  if (rangesAttr) {
    const rangesExpr = formatValue(rangesAttr);

    // Array literal não vazio: o conteúdo é garantido em tempo de build, então
    // usa os ranges diretamente (equivale a `this.series = [...this.ranges]`).
    if (isNonEmptyArrayLiteral(rangesExpr)) {
      return rangesExpr;
    }

    // Ranges dinâmico (variável/expressão) ou array literal vazio: pode não ter
    // itens em runtime. O po-gauge decidia isso em tempo de execução no
    // ngOnChanges:
    //   this.ranges?.length ? [...this.ranges]
    //                       : (value ? [{ data: value }] : [])
    // Replica esse fallback condicional para preservar o comportamento original.
    // Usa `expr && expr.length` em vez de `expr?.length` para evitar o warning
    // NG8107 do Angular (optional chain desnecessário em tipos não-nullable).
    const fallback = valueAttr ? `[{ data: ${formatValue(valueAttr)} }]` : '[]';
    return `${rangesExpr} && ${rangesExpr}.length ? ${rangesExpr} : ${fallback}`;
  }

  if (valueAttr) {
    // Sem ranges: series é [{ data: value }].
    return `[{ data: ${formatValue(valueAttr)} }]`;
  }

  // Sem value nem ranges: o po-gauge inicializava series como [] por padrão.
  // É necessário passar explicitamente para evitar que o po-chart receba
  // undefined (o que causaria erro em runtime no template).
  return '[]';
}

/**
 * Indica se a expressão é um array literal com pelo menos um elemento (ex.:
 * `[{ from: 0, to: 50 }]`). Nesses casos o conteúdo é garantido em build-time e
 * dispensa o fallback condicional aplicado a ranges dinâmicos.
 */
function isNonEmptyArrayLiteral(expr: string): boolean {
  const trimmed = expr.trim();
  return trimmed.startsWith('[') && trimmed.endsWith(']') && trimmed.slice(1, -1).trim().length > 0;
}

/**
 * Constrói a expressão de `p-options` mesclando as propriedades individuais com
 * o objeto `p-options` de origem, e injetando `showContainerGauge: true` por
 * padrão (comportamento do ngOnInit do po-gauge original).
 *
 * Quando uma mesma chave é definida pela propriedade individual e por
 * `p-options`, prevalece o valor de `p-options` e o conflito é registrado.
 */
function buildOptions(
  individualEntries: Array<{ key: string; value: string }>,
  optionsAttr: GaugeAttribute | undefined,
  conflicts: Array<string>
): string | undefined {
  // showContainerGauge: true é o default do ngOnInit do po-gauge.
  const defaultEntries: Array<{ key: string; value: string }> = [{ key: 'showContainerGauge', value: 'true' }];

  const allIndividualEntries = [...defaultEntries, ...individualEntries];

  if (!optionsAttr) {
    return `{ ${allIndividualEntries.map(entry => `${entry.key}: ${entry.value}`).join(', ')} }`;
  }

  const optionsExpr = optionsAttr.binding ? optionsAttr.rawExpression.trim() : formatValue(optionsAttr);
  const isLiteralObject = optionsAttr.binding && optionsExpr.startsWith('{') && optionsExpr.endsWith('}');

  if (isLiteralObject) {
    const topLevelKeys = parseTopLevelKeys(optionsExpr);
    const keptEntries: Array<{ key: string; value: string }> = [];

    allIndividualEntries.forEach(entry => {
      if (topLevelKeys.includes(entry.key)) {
        if (entry.key === 'descriptionChart') {
          // descriptionChart de p-description PREVALECE sobre p-options
          // (comportamento do po-gauge: this.description || options.descriptionChart).
          keptEntries.push(entry);
          conflicts.push(entry.key);
        } else if (entry.key !== 'showContainerGauge') {
          // Demais chaves: prevalece o valor definido em p-options.
          // Não registra conflito para showContainerGauge (é apenas um default).
          conflicts.push(entry.key);
        }
      } else {
        keptEntries.push(entry);
      }
    });

    // Monta o corpo do p-options literal, removendo a chave descriptionChart
    // quando p-description prevalece (para não duplicar a chave).
    let inner = optionsExpr.slice(1, -1).trim();
    const descriptionOverrides =
      allIndividualEntries.some(entry => entry.key === 'descriptionChart') && topLevelKeys.includes('descriptionChart');

    if (descriptionOverrides) {
      inner = splitTopLevel(inner, ',')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .filter(part => {
          const key = (splitTopLevel(part, ':')[0] ?? '').trim().replace(/^['"`]|['"`]$/g, '');
          return key !== 'descriptionChart';
        })
        .join(', ');
    }

    const parts = keptEntries.map(entry => `${entry.key}: ${entry.value}`);
    if (inner.length > 0) {
      parts.push(inner);
    }

    return parts.length > 0 ? `{ ${parts.join(', ')} }` : '{}';
  }

  // p-options é uma expressão opaca (variável/chamada): mescla via spread.
  // As chaves individuais vêm antes do spread (p-options vence), EXCETO
  // descriptionChart, que vem depois do spread para prevalecer, replicando
  // `this.description || options.descriptionChart` do po-gauge original.
  const descriptionEntry = allIndividualEntries.find(entry => entry.key === 'descriptionChart');
  const otherEntries = allIndividualEntries.filter(entry => entry.key !== 'descriptionChart');

  const otherParts = otherEntries.map(entry => `${entry.key}: ${entry.value}`).join(', ');
  const prefix = otherParts.length > 0 ? `${otherParts}, ` : '';

  if (descriptionEntry) {
    return `{ ${prefix}...${optionsExpr}, ${descriptionEntry.key}: ${descriptionEntry.value} }`;
  }
  return `{ ${prefix}...${optionsExpr} }`;
}

/**
 * Formata o valor de um atributo para uso em uma expressão de binding do
 * po-chart. Bindings preservam a expressão original; atributos estáticos são
 * convertidos em literais de string (Req. 3.1, 3.3).
 */
function formatValue(attr: GaugeAttribute): string {
  if (attr.binding) {
    return attr.rawExpression.trim();
  }
  return `'${attr.rawExpression.replace(/'/g, "\\'")}'`;
}

/** Remove colchetes/parênteses de binding e espaços do nome de um atributo. */
function normalizeName(name: string): string {
  return name
    .replace(/^[[(]/, '')
    .replace(/[\])]$/, '')
    .trim();
}

/**
 * Extrai as chaves de primeiro nível de um objeto literal preservado
 * textualmente, respeitando aninhamento de `{}`/`[]`/`()` e literais de string.
 */
function parseTopLevelKeys(objectLiteral: string): Array<string> {
  const inner = objectLiteral.trim().slice(1, -1);

  return splitTopLevel(inner, ',')
    .map(entry => {
      const key = splitTopLevel(entry, ':')[0]?.trim() ?? '';
      return key.replace(/^['"`]|['"`]$/g, '');
    })
    .filter(key => key.length > 0);
}

/**
 * Divide uma string por um separador considerando apenas o nível superior,
 * ignorando separadores dentro de `{}`/`[]`/`()` ou de literais de string.
 */
function splitTopLevel(source: string, separator: string): Array<string> {
  const parts: Array<string> = [];
  let current = '';
  let depth = 0;
  let quote = '';

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (quote) {
      current += char;
      if (char === quote && source[i - 1] !== '\\') {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '{' || char === '[' || char === '(') {
      depth++;
    } else if (char === '}' || char === ']' || char === ')') {
      depth--;
    }

    if (char === separator && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim().length > 0) {
    parts.push(current);
  }

  return parts;
}
