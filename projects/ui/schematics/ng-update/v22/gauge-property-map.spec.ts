import * as fc from 'fast-check';

import { GaugeAttribute, mapGaugeProperties } from './gauge-property-map';

/**
 * Gera fragmentos de expressão "atômicos" e plausíveis de aparecer em um
 * binding `[p-value]="..."` de template Angular: literais numéricos,
 * identificadores, acessos a propriedades, chamadas de método e literais de
 * string. As expressões são combinadas para exercitar o mapeamento sem
 * introduzir espaços nas bordas (a implementação preserva a expressão via
 * `trim()`).
 */
const identifierArb = fc
  .tuple(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'.split('')),
    fc.stringMatching(/^[a-zA-Z0-9_$]*$/)
  )
  .map(([head, tail]) => `${head}${tail}`);

const numberArb = fc.oneof(
  fc.integer({ min: 0, max: 1_000_000 }).map(String),
  fc.float({ min: 0, max: 1000, noNaN: true }).map(value => String(value))
);

const memberAccessArb = fc.array(identifierArb, { minLength: 2, maxLength: 4 }).map(parts => parts.join('.'));

const methodCallArb = fc.tuple(identifierArb, identifierArb).map(([obj, method]) => `${obj}.${method}()`);

const ternaryArb = fc.tuple(identifierArb, numberArb, numberArb).map(([cond, a, b]) => `${cond} ? ${a} : ${b}`);

/** Expressão de binding arbitrária, sem espaços nas bordas. */
const valueExpressionArb = fc.oneof(numberArb, identifierArb, memberAccessArb, methodCallArb, ternaryArb);

describe('v22 gauge-property-map (property-based):', () => {
  /**
   * Propriedade 5 — Mapeamento de `p-value` (sem `p-ranges`).
   *
   * Para qualquer expressão de valor, `mapGaugeProperties` com um atributo
   * `p-value` (binding) deve produzir um `pSeries` na forma
   * `[{ data: <expressão> }]`, preservando a expressão original textualmente.
   */
  it('should map a `p-value` binding to `[{ data: <expr> }]` preserving the original expression (Prop 5)', () => {
    fc.assert(
      fc.property(valueExpressionArb, expression => {
        const attr: GaugeAttribute = {
          name: 'p-value',
          binding: true,
          rawExpression: expression
        };

        const result = mapGaugeProperties([attr]);

        // A expressão original é preservada dentro da estrutura { data: ... }.
        expect(result.pSeries).toBe(`[{ data: ${expression.trim()} }]`);
        // Reforço: a expressão original aparece textualmente no resultado.
        expect(result.pSeries).toContain(expression.trim());
        // p-value sozinho não deve gerar pValueGaugeMultiple.
        expect(result.pValueGaugeMultiple).toBeUndefined();
        // p-value não deve gerar casos não migráveis.
        expect(result.unmapped).toEqual([]);
        expect(result.conflicts).toEqual([]);
      }),
      { numRuns: 500 }
    );
  });

  it('should preserve the expression even when the binding has surrounding whitespace (Prop 5)', () => {
    fc.assert(
      fc.property(
        valueExpressionArb,
        fc.stringMatching(/^ *$/),
        fc.stringMatching(/^ *$/),
        (expression, pad1, pad2) => {
          const attr: GaugeAttribute = {
            name: 'p-value',
            binding: true,
            rawExpression: `${pad1}${expression}${pad2}`
          };

          const result = mapGaugeProperties([attr]);

          expect(result.pSeries).toBe(`[{ data: ${expression.trim()} }]`);
        }
      ),
      { numRuns: 300 }
    );
  });
});

/**
 * Gera um objeto de faixa (`range`) plausível de aparecer em `p-ranges`, como
 * `{ from: 0, to: 50, color: 'green' }`. Os objetos possuem vírgulas internas,
 * o que torna a contagem de faixas de nível superior um teste real de
 * preservação da quantidade.
 */
const rangeObjectArb = fc
  .record(
    {
      from: numberArb,
      to: numberArb,
      color: identifierArb.map(id => `'${id}'`),
      label: identifierArb.map(id => `'${id}'`)
    },
    { requiredKeys: ['from', 'to'] }
  )
  .map(
    range =>
      `{ ${Object.entries(range)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')} }`
  );

/** Lista de 1..6 objetos de faixa (a quantidade N que deve ser preservada). */
const rangesListArb = fc.array(rangeObjectArb, { minLength: 1, maxLength: 6 });

/**
 * Conta os elementos de nível superior de um array literal preservado
 * textualmente, respeitando aninhamento de `{}`/`[]`/`()` e literais de string.
 * Usado para verificar que a quantidade de faixas foi mantida no resultado.
 */
function countTopLevelElements(arrayLiteral: string): number {
  const trimmed = arrayLiteral.trim();
  const inner = trimmed.slice(1, -1);
  if (inner.trim().length === 0) {
    return 0;
  }

  let depth = 0;
  let count = 1;
  let quote = '';

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];

    if (quote) {
      if (char === quote && inner[i - 1] !== '\\') {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{' || char === '[' || char === '(') {
      depth++;
    } else if (char === '}' || char === ']' || char === ')') {
      depth--;
    } else if (char === ',' && depth === 0) {
      count++;
    }
  }

  return count;
}

describe('v22 gauge-property-map ranges preservation (property-based):', () => {
  /**
   * Propriedade 6 — Preservação da quantidade de faixas.
   *
   * Para qualquer binding `p-ranges` cuja expressão seja um array literal com N
   * objetos de faixa, após `mapGaugeProperties` o `pSeries` resultante deve
   * preservar a mesma quantidade de faixas (N) e a expressão original das
   * faixas textualmente.
   */
  it('should preserve the number of ranges and the original expression when only `p-ranges` is present (Prop 6)', () => {
    fc.assert(
      fc.property(rangesListArb, ranges => {
        const arrayLiteral = `[${ranges.join(', ')}]`;
        const attr: GaugeAttribute = {
          name: 'p-ranges',
          binding: true,
          rawExpression: arrayLiteral
        };

        const result = mapGaugeProperties([attr]);

        // Apenas p-ranges: a expressão é preservada verbatim em p-series.
        expect(result.pSeries).toBe(arrayLiteral);
        // A quantidade de faixas (N) é mantida.
        expect(countTopLevelElements(result.pSeries!)).toBe(ranges.length);
        // Cada faixa original aparece textualmente no resultado.
        ranges.forEach(range => expect(result.pSeries).toContain(range));
        // Sem p-value, pValueGaugeMultiple não é gerado.
        expect(result.pValueGaugeMultiple).toBeUndefined();
        // Somente faixas não geram casos não migráveis.
        expect(result.unmapped).toEqual([]);
        expect(result.conflicts).toEqual([]);
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Propriedade 6 (combinada com `p-value`) — quando ambos estão presentes,
   * p-ranges vai direto para p-series e p-value vai para pValueGaugeMultiple
   * (como no ngOnChanges do po-gauge original).
   */
  it('should put ranges in p-series and value in p-value-gauge-multiple when both present (Prop 6)', () => {
    fc.assert(
      fc.property(valueExpressionArb, rangesListArb, (value, ranges) => {
        const arrayLiteral = `[${ranges.join(', ')}]`;
        const attrs: Array<GaugeAttribute> = [
          { name: 'p-value', binding: true, rawExpression: value },
          { name: 'p-ranges', binding: true, rawExpression: arrayLiteral }
        ];

        const result = mapGaugeProperties(attrs);

        // p-series recebe ranges diretamente (como this.series = [...this.ranges]).
        expect(result.pSeries).toBe(arrayLiteral);
        // p-value vai para pValueGaugeMultiple (como this.valuesMultiple = this.value).
        expect(result.pValueGaugeMultiple).toBe(value.trim());
        // A quantidade de faixas (N) é mantida.
        expect(countTopLevelElements(result.pSeries!)).toBe(ranges.length);
        // Cada faixa original aparece textualmente no resultado.
        ranges.forEach(range => expect(result.pSeries).toContain(range));
      }),
      { numRuns: 500 }
    );
  });
});

/**
 * Definições das propriedades individuais do `po-gauge` que são mapeadas para
 * chaves de `p-options` do `po-chart` (conforme o comportamento real do
 * po-gauge). `p-title` e `p-height` agora são passthrough direto.
 */
const optionPropDefs: ReadonlyArray<{ gaugeProp: string; optionsKey: string }> = [
  { gaugeProp: 'p-description', optionsKey: 'descriptionChart' },
  { gaugeProp: 'p-show-from-to-legend', optionsKey: 'showFromToLegend' },
  { gaugeProp: 'p-show-pointer', optionsKey: 'pointer' }
];

/** Todas as `optionsKey` mapeáveis para `p-options`. */
const allOptionKeys = optionPropDefs.map(def => def.optionsKey);

/** Subconjunto não vazio (preservando ordem) das propriedades de `p-options`. */
const nonEmptyOptionSubsetArb = fc.subarray([...optionPropDefs], { minLength: 1 });

describe('v22 gauge-property-map option-keys omission (property-based):', () => {
  /**
   * Propriedade 7 — Omissão de chaves não definidas.
   *
   * Para qualquer subconjunto de propriedades do `po-gauge` fornecido,
   * `mapGaugeProperties` deve gerar em `p-options` apenas as chaves das
   * propriedades presentes (mais `showContainerGauge: true` como default),
   * omitindo (sem valor padrão) as chaves das propriedades ausentes.
   */
  it('should only emit keys for provided properties (plus showContainerGauge default) and omit the missing ones (Prop 7)', () => {
    fc.assert(
      fc.property(nonEmptyOptionSubsetArb, subset => {
        const attrs: Array<GaugeAttribute> = subset.map(def => ({
          name: def.gaugeProp,
          binding: true,
          // Valor identificador único e distinto por chave, sem `:` embutido.
          rawExpression: `val_${def.optionsKey}`
        }));

        const result = mapGaugeProperties(attrs);

        const providedKeys = subset.map(def => def.optionsKey);
        const missingKeys = allOptionKeys.filter(key => !providedKeys.includes(key));

        // p-options deve existir (showContainerGauge é sempre injetado).
        expect(result.pOptions).toBeDefined();

        // showContainerGauge: true é sempre presente.
        expect(result.pOptions).toContain('showContainerGauge: true');

        // Cada chave fornecida aparece com sua expressão original preservada.
        providedKeys.forEach(key => {
          expect(result.pOptions).toContain(`${key}: val_${key}`);
        });

        // Nenhuma chave ausente é injetada (sem valor padrão).
        missingKeys.forEach(key => {
          expect(result.pOptions).not.toContain(`${key}:`);
        });

        // Sem propriedades de série, pSeries é [] (default do po-gauge); sem conflitos/unmapped.
        expect(result.pSeries).toBe('[]');
        expect(result.conflicts).toEqual([]);
        expect(result.unmapped).toEqual([]);
      }),
      { numRuns: 500 }
    );
  });
});

describe('v22 gauge-property-map p-options conflict priority (property-based):', () => {
  /**
   * Gera um cenário de conflito: um subconjunto não vazio de propriedades
   * individuais (`individual`) e um subconjunto não vazio dessas
   * (`conflicting`) que também são definidas dentro do objeto literal
   * `p-options`. Os valores individuais e os de `p-options` são distintos, o que
   * permite verificar qual valor prevalece.
   */
  const conflictScenarioArb = nonEmptyOptionSubsetArb.chain(individual =>
    fc.subarray([...individual], { minLength: 1 }).map(conflicting => ({ individual, conflicting }))
  );

  /**
   * Propriedade 8 — Prioridade em conflito de `p-options`.
   *
   * Quando uma mesma chave de destino em `p-options` é definida tanto por uma
   * propriedade individual do `po-gauge` quanto por uma chave dentro do objeto
   * `p-options`, o valor de `p-options` deve prevalecer e a chave em conflito
   * deve ser registrada em `result.conflicts`.
   */
  it('should let the `p-options` value win on conflict and record the conflicting key (Prop 8)', () => {
    fc.assert(
      fc.property(conflictScenarioArb, ({ individual, conflicting }) => {
        const conflictKeys = conflicting.map(def => def.optionsKey);

        // Bindings das propriedades individuais (valor prefixado `indiv_`).
        const individualAttrs: Array<GaugeAttribute> = individual.map(def => ({
          name: def.gaugeProp,
          binding: true,
          rawExpression: `indiv_${def.optionsKey}`
        }));

        // Objeto literal p-options com as chaves conflitantes (valor `po_`) +
        // showContainerGauge para absorver o default sem gerar conflito extra.
        const optionsLiteral = `{ ${conflictKeys.map(key => `${key}: po_${key}`).join(', ')}, showContainerGauge: true }`;
        const optionsAttr: GaugeAttribute = {
          name: 'p-options',
          binding: true,
          rawExpression: optionsLiteral
        };

        const result = mapGaugeProperties([...individualAttrs, optionsAttr]);

        // Todas (e somente) as chaves em conflito são registradas.
        expect([...result.conflicts].sort()).toEqual([...conflictKeys].sort());

        // p-options deve existir e o valor prevalecente depende da chave.
        expect(result.pOptions).toBeDefined();
        conflictKeys.forEach(key => {
          if (key === 'descriptionChart') {
            // descriptionChart de p-description PREVALECE sobre p-options
            // (this.description || options.descriptionChart no po-gauge original).
            expect(result.pOptions).toContain(`descriptionChart: indiv_descriptionChart`);
            expect(result.pOptions).not.toContain('po_descriptionChart');
          } else {
            // Demais chaves: o valor de p-options prevalece; o individual é descartado.
            expect(result.pOptions).toContain(`${key}: po_${key}`);
            expect(result.pOptions).not.toContain(`indiv_${key}`);
          }
        });

        // Propriedades individuais SEM conflito são preservadas com seu valor.
        individual
          .filter(def => !conflictKeys.includes(def.optionsKey))
          .forEach(def => {
            expect(result.pOptions).toContain(`${def.optionsKey}: indiv_${def.optionsKey}`);
          });

        // Conflito de p-options não afeta série nem gera propriedades não mapeadas.
        expect(result.pSeries).toBe('[]');
        expect(result.unmapped).toEqual([]);
      }),
      { numRuns: 500 }
    );
  });
});

describe('v22 gauge-property-map (unit):', () => {
  /**
   * Propriedade `p-*` sem equivalente na Tabela de Mapeamento deve ser coletada
   * em `result.unmapped` (Caso_Nao_Migravel), preservada verbatim, e não deve
   * contaminar `pSeries`/`pOptions`.
   */
  it('should collect a `p-*` attribute without equivalent in `unmapped`', () => {
    const fooBinding: GaugeAttribute = { name: '[p-foo]', binding: true, rawExpression: 'someExpr' };
    const barStatic: GaugeAttribute = { name: 'p-bar', binding: false, rawExpression: 'baz' };

    const result = mapGaugeProperties([fooBinding, barStatic]);

    // Ambas as propriedades `p-*` desconhecidas vão para `unmapped`, preservadas.
    expect(result.unmapped).toEqual([fooBinding, barStatic]);
    // Não devem aparecer em passthrough nem série.
    expect(result.passthrough).toEqual([]);
    expect(result.pSeries).toBe('[]');
    // showContainerGauge default é sempre injetado em p-options.
    expect(result.pOptions).toBe('{ showContainerGauge: true }');
    expect(result.conflicts).toEqual([]);
  });

  /**
   * Atributos que não começam com `p-` (ex.: `class`, eventos `(click)`,
   * bindings estruturais) são atributos genéricos do elemento e devem ser
   * preservados em `result.passthrough`, jamais mapeados.
   */
  it('should collect non `p-*` attributes (class, events) in `passthrough`', () => {
    const classAttr: GaugeAttribute = { name: 'class', binding: false, rawExpression: 'x' };
    const clickAttr: GaugeAttribute = { name: '(click)', binding: false, rawExpression: 'f()' };
    const idBinding: GaugeAttribute = { name: '[id]', binding: true, rawExpression: 'gaugeId' };

    const result = mapGaugeProperties([classAttr, clickAttr, idBinding]);

    // Todos os atributos genéricos são preservados, na ordem original.
    expect(result.passthrough).toEqual([classAttr, clickAttr, idBinding]);
    // Nada é mapeado nem sinalizado como sem equivalente.
    expect(result.unmapped).toEqual([]);
    expect(result.pSeries).toBe('[]');
    // showContainerGauge default é injetado em p-options.
    expect(result.pOptions).toBe('{ showContainerGauge: true }');
    expect(result.conflicts).toEqual([]);
  });

  /**
   * Caso canônico: `[p-value]="72"`, `p-description="Faturamento"` e
   * `[p-show-from-to-legend]="true"` produzem:
   * - `pSeries = [{ data: 72 }]`
   * - `pOptions = { showContainerGauge: true, descriptionChart: 'Faturamento', showFromToLegend: true }`
   */
  it('should map the canonical `p-value` + `p-description` + `p-show-from-to-legend` case', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-value', binding: true, rawExpression: '72' },
      { name: 'p-description', binding: false, rawExpression: 'Faturamento' },
      { name: 'p-show-from-to-legend', binding: true, rawExpression: 'true' }
    ];

    const result = mapGaugeProperties(attrs);

    expect(result.pSeries).toBe('[{ data: 72 }]');
    expect(result.pOptions).toBe(
      "{ showContainerGauge: true, descriptionChart: 'Faturamento', showFromToLegend: true }"
    );
    expect(result.passthrough).toEqual([]);
    expect(result.unmapped).toEqual([]);
    expect(result.conflicts).toEqual([]);
  });

  /**
   * `p-title` e `p-height` devem ir para passthrough (como no template real do
   * po-gauge que passa `[p-title]` e `[p-height]` diretamente para o po-chart).
   */
  it('should treat `p-title` and `p-height` as passthrough attributes', () => {
    const titleAttr: GaugeAttribute = { name: 'p-title', binding: false, rawExpression: 'Velocidade' };
    const heightAttr: GaugeAttribute = { name: '[p-height]', binding: true, rawExpression: '300' };

    const result = mapGaugeProperties([titleAttr, heightAttr]);

    expect(result.passthrough).toEqual([titleAttr, heightAttr]);
    expect(result.pSeries).toBe('[]');
    // p-options ainda tem showContainerGauge default.
    expect(result.pOptions).toBe('{ showContainerGauge: true }');
    expect(result.unmapped).toEqual([]);
  });

  /**
   * `p-show-pointer` deve ir para `p-options.pointer`.
   */
  it('should map `p-show-pointer` to `p-options.pointer`', () => {
    const pointerAttr: GaugeAttribute = { name: '[p-show-pointer]', binding: true, rawExpression: 'true' };

    const result = mapGaugeProperties([pointerAttr]);

    expect(result.pOptions).toBe('{ showContainerGauge: true, pointer: true }');
    expect(result.pSeries).toBe('[]');
    expect(result.unmapped).toEqual([]);
  });

  /**
   * Formatação de atributo estático vs. binding: um atributo estático é
   * convertido em literal de string (`'Faturamento'`), enquanto um binding
   * preserva a expressão original textualmente (`descVar`).
   */
  it('should format a static attribute as a string literal in `p-options`', () => {
    const result = mapGaugeProperties([{ name: 'p-description', binding: false, rawExpression: 'Faturamento' }]);

    expect(result.pOptions).toBe("{ showContainerGauge: true, descriptionChart: 'Faturamento' }");
    expect(result.pSeries).toBe('[]');
  });

  it('should preserve the original expression for a `p-description` binding in `p-options`', () => {
    const result = mapGaugeProperties([{ name: '[p-description]', binding: true, rawExpression: 'descVar' }]);

    expect(result.pOptions).toBe('{ showContainerGauge: true, descriptionChart: descVar }');
    expect(result.pSeries).toBe('[]');
  });

  /**
   * Formatação de atributo estático: aspas simples dentro do valor são
   * escapadas ao gerar o literal de string.
   */
  it('should escape single quotes when formatting a static attribute value', () => {
    const result = mapGaugeProperties([{ name: 'p-description', binding: false, rawExpression: "Vendas d'agosto" }]);

    expect(result.pOptions).toBe("{ showContainerGauge: true, descriptionChart: 'Vendas d\\'agosto' }");
  });

  /**
   * showContainerGauge: true é injetado por padrão mesmo sem nenhuma propriedade
   * de options fornecida.
   */
  it('should always inject showContainerGauge: true in p-options', () => {
    const result = mapGaugeProperties([{ name: 'p-value', binding: true, rawExpression: '50' }]);

    expect(result.pOptions).toBe('{ showContainerGauge: true }');
    expect(result.pSeries).toBe('[{ data: 50 }]');
  });

  /**
   * Quando p-options já tem showContainerGauge definido, não há conflito
   * registrado (é apenas um default).
   */
  it('should not register conflict for showContainerGauge when already in p-options', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-options', binding: true, rawExpression: '{ showContainerGauge: false }' }
    ];

    const result = mapGaugeProperties(attrs);

    // O valor de p-options prevalece, sem conflito registrado.
    expect(result.pOptions).toContain('showContainerGauge: false');
    expect(result.conflicts).toEqual([]);
  });

  /**
   * Fallback condicional para ranges dinâmico: quando p-value + p-ranges (variável)
   * estão presentes, p-series deve usar expressão ternária `expr && expr.length ? expr : [{ data: value }]`.
   */
  it('should generate conditional fallback for dynamic ranges with p-value (cases 9b, 28, 28b)', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-value', binding: true, rawExpression: 'item.value' },
      { name: 'p-ranges', binding: true, rawExpression: 'item.ranges' }
    ];

    const result = mapGaugeProperties(attrs);

    expect(result.pSeries).toBe('item.ranges && item.ranges.length ? item.ranges : [{ data: item.value }]');
    expect(result.pValueGaugeMultiple).toBe('item.ranges && item.ranges.length ? item.value : undefined');
  });

  /**
   * Ranges como array literal não vazio: não gera fallback condicional, usa direto.
   */
  it('should use direct series (no fallback) when p-ranges is a non-empty array literal (case 36)', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-value', binding: true, rawExpression: '60' },
      { name: 'p-ranges', binding: true, rawExpression: '[{ from: 0, to: 50 }, { from: 50, to: 100 }]' }
    ];

    const result = mapGaugeProperties(attrs);

    expect(result.pSeries).toBe('[{ from: 0, to: 50 }, { from: 50, to: 100 }]');
    expect(result.pValueGaugeMultiple).toBe('60');
  });

  /**
   * p-description prevalece sobre descriptionChart em p-options literal (case 16b).
   */
  it('should let p-description win over descriptionChart in p-options literal (case 16b)', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-description', binding: false, rawExpression: 'Desc pela propriedade' },
      { name: 'p-options', binding: true, rawExpression: "{ descriptionChart: 'Desc pelo options' }" }
    ];

    const result = mapGaugeProperties(attrs);

    expect(result.pOptions).toContain("descriptionChart: 'Desc pela propriedade'");
    expect(result.pOptions).not.toContain('Desc pelo options');
    expect(result.conflicts).toContain('descriptionChart');
  });

  /**
   * p-description prevalece sobre p-options opaco via spread (case 40).
   * descriptionChart deve vir DEPOIS do spread para prevalecer.
   */
  it('should let p-description win over p-options opaque variable via spread (case 40)', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: '[p-description]', binding: true, rawExpression: 'descricao' },
      { name: 'p-options', binding: true, rawExpression: 'fullOptions' }
    ];

    const result = mapGaugeProperties(attrs);

    // descriptionChart vem após o spread para garantir prioridade
    expect(result.pOptions).toContain('...fullOptions, descriptionChart: descricao');
  });

  /**
   * Gauge sem nenhuma propriedade (case 21): gera series vazio e options default.
   */
  it('should handle gauge with no properties at all (case 21)', () => {
    const result = mapGaugeProperties([]);

    expect(result.pSeries).toBe('[]');
    expect(result.pOptions).toBe('{ showContainerGauge: true }');
    expect(result.pValueGaugeMultiple).toBeUndefined();
    expect(result.passthrough).toEqual([]);
    expect(result.unmapped).toEqual([]);
    expect(result.conflicts).toEqual([]);
  });

  /**
   * p-options opaco (variável) sem p-description: spread no final, sem descriptionChart extra.
   */
  it('should spread opaque p-options at the end without extra descriptionChart when no p-description (case 4)', () => {
    const attrs: Array<GaugeAttribute> = [
      { name: 'p-value', binding: true, rawExpression: 'valor' },
      { name: 'p-options', binding: true, rawExpression: 'gaugeOptions' }
    ];

    const result = mapGaugeProperties(attrs);

    expect(result.pOptions).toBe('{ showContainerGauge: true, ...gaugeOptions }');
    expect(result.pOptions).not.toContain('descriptionChart');
  });
});
