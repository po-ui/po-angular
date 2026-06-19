import * as fc from 'fast-check';

import { migrateHtmlContent } from './gauge-html-migration';

/** Marcador estável dos comentários TODO inseridos pela migração (idempotência). */
const TODO_MARKER = 'TODO: migração po-gauge';

/** Conta ocorrências não sobrepostas de um trecho literal em um texto. */
function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) {
    return 0;
  }

  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count++;
    index = haystack.indexOf(needle, index + needle.length);
  }

  return count;
}

/**
 * Expressão de binding simples e determinística (sem espaços nas bordas nem
 * caracteres que quebrem a varredura textual de atributos).
 */
const bindingExpressionArb = fc.oneof(
  fc.integer({ min: 0, max: 1000 }).map(String),
  fc.constantFrom('valor', 'ranges', 'options', 'this.total', 'getValor()', 'true', 'false')
);

/** Texto estático simples para atributos sem binding (ex.: `p-description="..."`). */
const staticTextArb = fc.stringMatching(/^[a-zA-Z0-9 ]{0,12}$/);

/**
 * Gera um atributo mapeado do po-gauge. Cobre os bindings mais relevantes:
 * `[p-value]`, `[p-ranges]`, `[p-show-from-to-legend]`, `[p-show-pointer]`,
 * `[p-options]`, o atributo estático `p-description`, e os passthrough
 * `p-title` e `p-height` (que são reconhecidos pela migração).
 */
const mappedAttrArb: fc.Arbitrary<string> = fc.oneof(
  bindingExpressionArb.map(expr => `[p-value]="${expr}"`),
  bindingExpressionArb.map(expr => `[p-ranges]="${expr}"`),
  fc.constantFrom('true', 'false', 'showLegend').map(expr => `[p-show-from-to-legend]="${expr}"`),
  fc.constantFrom('true', 'false').map(expr => `[p-show-pointer]="${expr}"`),
  staticTextArb.map(text => `p-description="${text}"`),
  staticTextArb.map(text => `p-title="${text}"`),
  bindingExpressionArb.map(expr => `[p-height]="${expr}"`),
  fc.constantFrom('{ showFromToLegend: true }', 'options', '{ pointer: false }').map(expr => `[p-options]="${expr}"`)
);

/**
 * Atributos "passthrough" (fora do Mapeamento_Propriedades) que devem ser
 * preservados: classe, id, eventos e template refs.
 */
const passthroughAttrArb: fc.Arbitrary<string> = fc.oneof(
  staticTextArb.map(cls => `class="${cls}"`),
  fc.stringMatching(/^[a-z][a-z0-9-]{0,8}$/).map(id => `id="${id}"`),
  fc.constantFrom('onClick()', 'handle($event)', 'doThing()').map(handler => `(click)="${handler}"`),
  fc.stringMatching(/^[a-z][a-z0-9]{0,6}$/).map(name => `#${name}`)
);

/**
 * Propriedade `p-*` sem equivalente na Tabela de Mapeamento: dispara o caminho
 * de preservação + comentário TODO (Caso_Nao_Migravel).
 */
const unmappedAttrArb: fc.Arbitrary<string> = fc
  .constantFrom('p-foo', 'p-bar', 'p-unknown', 'p-custom')
  .chain(name => staticTextArb.map(value => `${name}="${value}"`));

/** Um atributo qualquer, com maior peso para os mapeados/passthrough. */
const anyAttrArb: fc.Arbitrary<string> = fc.oneof(
  { weight: 5, arbitrary: mappedAttrArb },
  { weight: 3, arbitrary: passthroughAttrArb },
  { weight: 1, arbitrary: unmappedAttrArb }
);

/** Whitespace de separação entre atributos (espaço, múltiplos espaços ou quebra). */
const separatorArb = fc.constantFrom(' ', '  ', '\n  ', '\n    ', '\t');

/** Gera um elemento `<po-gauge ...>` completo (auto-fechado ou com fechamento). */
const poGaugeElementArb: fc.Arbitrary<string> = fc
  .tuple(fc.array(anyAttrArb, { minLength: 0, maxLength: 5 }), separatorArb, fc.boolean())
  .map(([attrs, sep, selfClosing]) => {
    const attrsText = attrs.map(attr => `${sep}${attr}`).join('');
    return selfClosing ? `<po-gauge${attrsText} />` : `<po-gauge${attrsText}></po-gauge>`;
  });

/** Trecho de marcação arbitrária ao redor dos elementos po-gauge. */
const surroundingMarkupArb: fc.Arbitrary<string> = fc.oneof(
  fc.constant(''),
  fc.constant('\n'),
  fc.constant('<div class="wrapper">'),
  fc.constant('</div>'),
  fc.constant('<p>texto</p>'),
  fc.constant('<!-- comentário existente -->'),
  fc.constant('<po-chart [p-type]="$any(\'gauge\')" [p-series]="s"></po-chart>'),
  staticTextArb.map(text => `<span>${text}</span>`)
);

/**
 * Documento HTML arbitrário contendo de 1 a 4 elementos po-gauge intercalados
 * com marcação arbitrária ao redor.
 */
const htmlWithGaugeArb: fc.Arbitrary<string> = fc
  .array(fc.tuple(surroundingMarkupArb, poGaugeElementArb), { minLength: 1, maxLength: 4 })
  .chain(pairs =>
    surroundingMarkupArb.map(tail => pairs.map(([markup, gauge]) => `${markup}${gauge}`).join('\n') + '\n' + tail)
  );

/** HTML arbitrário SEM qualquer po-gauge (para confirmar idempotência trivial). */
const htmlWithoutGaugeArb: fc.Arbitrary<string> = fc
  .array(surroundingMarkupArb, { minLength: 0, maxLength: 8 })
  .map(parts => parts.join('\n'));

describe('v22 gauge-html-migration (property-based):', () => {
  /**
   * Propriedade 1 — Idempotência (ponto fixo).
   *
   * Para qualquer HTML de origem (incluindo fontes com `<po-gauge>` com combinações
   * variadas de atributos/bindings), aplicar `migrateHtmlContent` duas vezes produz
   * o mesmo conteúdo que aplicá-la uma vez:
   *   `migrateHtmlContent(migrateHtmlContent(x).content).content === migrateHtmlContent(x).content`
   * Além disso, não há duplicação de comentários TODO na segunda execução.
   *
   * **Validates: Requirements 7.2, 7.4**
   * **Valida: Requisitos 7.2, 7.4**
   */
  it('should reach a fixed point on HTML containing po-gauge elements without duplicating TODO markers (Prop 1, Req 7.2, 7.4)', () => {
    fc.assert(
      fc.property(htmlWithGaugeArb, source => {
        const once = migrateHtmlContent(source).content;
        const twice = migrateHtmlContent(once).content;

        // Ponto fixo: a segunda aplicação não altera o conteúdo já migrado.
        expect(twice).toBe(once);

        // Sem duplicação de marcadores TODO entre a primeira e a segunda execução.
        expect(countOccurrences(twice, TODO_MARKER)).toBe(countOccurrences(once, TODO_MARKER));
      }),
      { numRuns: 500 }
    );
  });

  it('should be idempotent on arbitrary HTML without any po-gauge element (Prop 1, Req 7.2, 7.4)', () => {
    fc.assert(
      fc.property(htmlWithoutGaugeArb, source => {
        const once = migrateHtmlContent(source).content;
        const twice = migrateHtmlContent(once).content;

        expect(twice).toBe(once);
        expect(countOccurrences(twice, TODO_MARKER)).toBe(countOccurrences(once, TODO_MARKER));
      }),
      { numRuns: 300 }
    );
  });
});

/** Seletor de abertura exato reconhecido pela migração (case-sensitive, Req. 2.1). */
const OPEN_TAG = '<po-gauge';

/** `true` quando o caractere delimita o fim do seletor (`whitespace`, `/` ou `>`). */
function isTagBoundary(char: string): boolean {
  return (
    char === ' ' ||
    char === '\t' ||
    char === '\n' ||
    char === '\r' ||
    char === '\f' ||
    char === '\v' ||
    char === '/' ||
    char === '>'
  );
}

/**
 * Replica exatamente a detecção de correspondência da implementação: existe uma
 * ocorrência de `<po-gauge` cujo caractere seguinte é indefinido (fim da string)
 * ou um delimitador de tag (`whitespace`, `/`, `>`). Near-misses como
 * `<po-gauge-foo` (seguido de `-`) NÃO são correspondências.
 */
function hasPoGaugeMatch(source: string): boolean {
  let idx = source.indexOf(OPEN_TAG);
  while (idx !== -1) {
    const charAfter = source[idx + OPEN_TAG.length];
    if (charAfter === undefined || isTagBoundary(charAfter)) {
      return true;
    }
    idx = source.indexOf(OPEN_TAG, idx + 1);
  }
  return false;
}

/**
 * Near-miss: uma tag cujo nome apenas começa com `po-gauge` mas continua com
 * caracteres adicionais (ex.: `<po-gauge-foo>`, `<po-gaugewidget>`). O caractere
 * seguinte a `<po-gauge` nunca é um delimitador de tag, portanto a implementação
 * não a trata como po-gauge.
 */
const nearMissTagArb: fc.Arbitrary<string> = fc
  .stringMatching(/^[a-z][a-z0-9-]{0,8}$/)
  .map(suffix => `<po-gauge${suffix}>conteúdo</po-gauge${suffix}>`);

/**
 * `po-gauge` aparecendo apenas como texto/atributo/comentário/nome de outro
 * elemento — nunca como o token de abertura `<po-gauge` seguido de delimitador.
 */
const poGaugeAsTextArb: fc.Arbitrary<string> = fc.constantFrom(
  'o po-gauge foi descontinuado',
  '<!-- po-gauge removido: use po-chart -->',
  '<!-- migração de po-gauge para po-chart concluída -->',
  '<span title="po-gauge">legado</span>',
  '<input value="po-gauge é apenas texto" />',
  '<po-chart [p-type]="$any(\'gauge\')" [p-series]="series"></po-chart>',
  '<po-chart [p-type]="$any(\'gauge\')" [p-series]="s" [p-options]="{ descriptionChart: d }"></po-chart>',
  'class="po-gauge-legacy"'
);

/** Marcação genérica que comprovadamente não contém o token `<po-gauge`. */
const safeMarkupArb: fc.Arbitrary<string> = fc.oneof(
  fc.constant(''),
  fc.constant('\n'),
  fc.constant('  '),
  fc.constant('<div class="wrapper">'),
  fc.constant('</div>'),
  fc.constant('<p>texto</p>'),
  fc.constant('<!-- comentário existente -->'),
  fc.stringMatching(/^[a-zA-Z0-9 .,;:!?_-]{0,24}$/),
  fc.stringMatching(/^<[a-z][a-z0-9]{0,8}>[a-zA-Z0-9 ]{0,10}<\/[a-z][a-z0-9]{0,8}>$/)
);

/**
 * Documento HTML arbitrário que NÃO contém nenhuma ocorrência do seletor de
 * abertura `<po-gauge` seguido de delimitador. Combina marcação genérica,
 * near-misses (`<po-gauge-foo>`) e `po-gauge` como texto puro. Uma pré-condição
 * (`fc.pre`) descarta qualquer combinação acidental que forme uma correspondência,
 * garantindo o espaço de entrada exato de "sem Uso_Template".
 */
const htmlWithoutGaugeOccurrenceArb: fc.Arbitrary<string> = fc
  .array(
    fc.oneof(
      { weight: 4, arbitrary: safeMarkupArb },
      { weight: 2, arbitrary: nearMissTagArb },
      { weight: 2, arbitrary: poGaugeAsTextArb }
    ),
    {
      minLength: 0,
      maxLength: 12
    }
  )
  .map(parts => parts.join(''));

describe('v22 gauge-html-migration — no-op sem ocorrência (property-based):', () => {
  /**
   * Propriedade 2 — No-op sem ocorrência.
   *
   * Para qualquer HTML de origem que NÃO contenha nenhum Uso_Template (`<po-gauge`
   * seguido de delimitador de tag), `migrateHtmlContent(x)` devolve o conteúdo
   * idêntico byte a byte ao original, com `changed === false` e `warnings` vazio.
   * Inclui near-misses (`<po-gauge-foo>`) e `po-gauge` como texto/comentário/atributo.
   *
   * **Validates: Requirements 7.1**
   * **Valida: Requisito 7.1**
   */
  it('should leave HTML byte-for-byte unchanged when there is no po-gauge occurrence (Prop 2, Req 7.1)', () => {
    fc.assert(
      fc.property(htmlWithoutGaugeOccurrenceArb, source => {
        // Garante o espaço de entrada: nenhuma correspondência real de po-gauge.
        fc.pre(!hasPoGaugeMatch(source));

        const result = migrateHtmlContent(source);

        expect(result.content).toBe(source);
        expect(result.changed).toBe(false);
        expect(result.warnings).toEqual([]);
      }),
      { numRuns: 500 }
    );
  });
});

/**
 * Atributo mapeável do po-gauge (garante que o elemento seja migrado para
 * po-chart). Restringe-se a propriedades presentes na Tabela de Mapeamento
 * que efetivamente geram p-series ou p-options, evitando o caminho de `unmapped`.
 */
const mappableAttrArb: fc.Arbitrary<string> = fc.oneof(
  bindingExpressionArb.map(expr => `[p-value]="${expr}"`),
  bindingExpressionArb.map(expr => `[p-ranges]="${expr}"`),
  staticTextArb.map(text => `p-description="${text}"`),
  fc.constantFrom('true', 'false').map(expr => `[p-show-pointer]="${expr}"`)
);

/**
 * Atributos/bindings "passthrough" (fora do Mapeamento_Propriedades) que devem
 * ser preservados verbatim no elemento migrado. Nenhum começa com `p-`, de modo
 * a não colidir com as propriedades mapeadas nem cair no caminho `unmapped`.
 * Cobre `class`, `id`, eventos `(click)`, estruturais `*ngIf`, `[ngClass]` e
 * template refs `#x`.
 */
const passthroughAttrProp4Arb: fc.Arbitrary<string> = fc.oneof(
  fc.stringMatching(/^[a-z][a-z0-9-]{0,8}$/).map(cls => `class="${cls}"`),
  fc.stringMatching(/^[a-z][a-z0-9-]{0,8}$/).map(id => `id="${id}"`),
  fc.constantFrom('onClick()', 'handle($event)', 'doThing()').map(handler => `(click)="${handler}"`),
  fc.constantFrom('cond', 'isActive', 'show && ready').map(cond => `*ngIf="${cond}"`),
  fc.constantFrom('{ active: isActive }', 'classExpr', "{ 'is-open': open }").map(expr => `[ngClass]="${expr}"`),
  fc.stringMatching(/^[a-z][a-z0-9]{0,6}$/).map(name => `#${name}`)
);

/**
 * Gera um `<po-gauge>` com exatamente um atributo mapeável (para garantir a
 * migração) e um conjunto de atributos passthrough, inseridos em ordem
 * arbitrária. Também varia a separação entre atributos e o auto-fechamento.
 * Retorna o elemento e a lista de atributos passthrough esperados na saída.
 */
const gaugeWithPassthroughArb: fc.Arbitrary<{ element: string; passthrough: Array<string> }> = fc
  .tuple(
    mappableAttrArb,
    fc.array(passthroughAttrProp4Arb, { minLength: 1, maxLength: 5 }),
    fc.nat(),
    separatorArb,
    fc.boolean()
  )
  .map(([mappable, passthrough, pos, sep, selfClosing]) => {
    const attrs = [...passthrough];
    const insertAt = pos % (attrs.length + 1);
    attrs.splice(insertAt, 0, mappable);
    const attrsText = attrs.map(attr => `${sep}${attr}`).join('');
    const element = selfClosing ? `<po-gauge${attrsText} />` : `<po-gauge${attrsText}></po-gauge>`;
    return { element, passthrough };
  });

describe('v22 gauge-html-migration — preservação de atributos não mapeados (property-based):', () => {
  /**
   * Propriedade 4 — Preservação de atributos não mapeados (HTML).
   *
   * Para qualquer `<po-gauge>` contendo ao menos uma propriedade mapeável (que o
   * faz migrar para `po-chart`) mais um conjunto de atributos/bindings fora do
   * Mapeamento_Propriedades (`class`, `id`, `(click)`, `*ngIf`, `[ngClass]`,
   * template refs `#x`), após `migrateHtmlContent`:
   *  - o elemento passa a ser `po-chart` com `[p-type]="'gauge'"`;
   *  - cada atributo passthrough (nome e valor) é preservado verbatim na saída;
   *  - não resta nenhum seletor de abertura `<po-gauge`.
   *
   * **Validates: Requirements 2.5**
   * **Valida: Requisito 2.5**
   */
  it('should preserve every non-mapped attribute/binding when migrating po-gauge to po-chart (Prop 4, Req 2.5)', () => {
    fc.assert(
      fc.property(gaugeWithPassthroughArb, ({ element, passthrough }) => {
        const { content } = migrateHtmlContent(element);

        // O elemento foi migrado para po-chart com [p-type]="$any('gauge')".
        expect(content).toContain('<po-chart');
        expect(content).toContain(`[p-type]="$any('gauge')"`);
        expect(content).not.toContain(OPEN_TAG);

        // Cada atributo/binding passthrough é preservado com nome e valor originais.
        passthrough.forEach(attr => {
          expect(content).toContain(attr);
        });
      }),
      { numRuns: 500 }
    );
  });
});

/**
 * Divide o conteúdo em linhas (independente do separador \n) para inspecionar a
 * posição relativa do comentário TODO em relação ao trecho preservado.
 */
function splitLines(content: string): Array<string> {
  return content.split('\n');
}

describe('v22 gauge-html-migration — casos malformados, TODO e exemplo canônico (unit):', () => {
  describe('trecho malformado preservado + advertência (Req 2.7, 6.1, 6.3):', () => {
    it('should preserve a <po-gauge> without a closing tag and record a warning (Req 2.7, 6.1)', () => {
      const source = ['<div>', '  <po-gauge [p-value]="72">', '</div>'].join('\n');

      const result = migrateHtmlContent(source);

      // O trecho original é preservado sem alteração de conteúdo.
      expect(result.content).toContain('<po-gauge [p-value]="72">');

      // Uma advertência é registrada, com arquivo (preenchido pela orquestração),
      // linha e motivo identificando a ausência do fechamento.
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].filePath).toBe('');
      expect(typeof result.warnings[0].line).toBe('number');
      expect(result.warnings[0].line).toBe(2);
      expect(result.warnings[0].reason).toContain('sem tag de fechamento');

      // Um comentário TODO foi inserido (Req 6.3), portanto houve marcação.
      expect(result.changed).toBe(true);
      expect(result.content).toContain(TODO_MARKER);
    });

    it('should preserve a <po-gauge> with a malformed opening tag (unclosed quote) and record a warning (Req 2.7, 6.1)', () => {
      // Aspas não fechadas no valor do atributo: a tag de abertura não pode ser
      // interpretada com segurança.
      const source = ['<section>', '  <po-gauge [p-title]="titulo sem fim', '</section>'].join('\n');

      const result = migrateHtmlContent(source);

      // Conteúdo original preservado byte a byte, exceto pela inserção do TODO.
      expect(result.content).toContain('<po-gauge [p-title]="titulo sem fim');
      expect(result.content).toContain('</section>');

      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].filePath).toBe('');
      expect(result.warnings[0].line).toBe(2);
      expect(result.warnings[0].reason).toContain('malformado');

      expect(result.content).toContain(TODO_MARKER);
    });

    it('should not migrate the malformed element to po-chart (Req 2.7)', () => {
      const source = '<po-gauge [p-value]="1">';

      const result = migrateHtmlContent(source);

      // Nenhuma reescrita para po-chart quando o trecho não é migrável.
      expect(result.content).not.toContain('<po-chart');
      expect(result.content).toContain('<po-gauge [p-value]="1">');
      expect(result.warnings.length).toBe(1);
    });
  });

  describe('inserção de TODO para propriedade sem equivalente (Req 3.10, 6.1, 6.3):', () => {
    it('should preserve the element and insert a TODO on the line immediately before it (Req 6.3)', () => {
      const source = ['<div>', '  <po-gauge [p-value]="10" p-foo="bar"></po-gauge>', '</div>'].join('\n');

      const result = migrateHtmlContent(source);

      // Trecho original preservado sem alteração (Req 3.10).
      expect(result.content).toContain('<po-gauge [p-value]="10" p-foo="bar"></po-gauge>');
      expect(result.content).not.toContain('<po-chart');

      // Advertência registrada identificando a propriedade não mapeada.
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].filePath).toBe('');
      expect(result.warnings[0].line).toBe(2);
      expect(result.warnings[0].reason).toContain('p-foo');
      expect(result.changed).toBe(true);

      // O comentário TODO está na linha imediatamente anterior ao trecho.
      const lines = splitLines(result.content);
      const snippetLine = lines.findIndex(line => line.includes('<po-gauge'));
      expect(snippetLine).toBeGreaterThan(0);
      expect(lines[snippetLine - 1]).toContain(TODO_MARKER);
    });

    it('should insert the TODO comment only once for a single unmapped occurrence (Req 6.3)', () => {
      const source = '  <po-gauge p-unknown="x"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(countOccurrences(result.content, TODO_MARKER)).toBe(1);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].reason).toContain('p-unknown');
    });
  });

  describe('exemplo canônico da transformação (design.md):', () => {
    it(`should transform the canonical <po-gauge> into <po-chart [p-type]="$any('gauge')"> with p-series, p-value-gauge-multiple and p-options`, () => {
      const source = [
        '<po-gauge',
        '  [p-value]="72"',
        '  [p-ranges]="ranges"',
        '  p-description="Faturamento"',
        '  [p-show-from-to-legend]="true">',
        '</po-gauge>'
      ].join('\n');

      const result = migrateHtmlContent(source);

      // Elemento migrado para po-chart com [p-type]="$any('gauge')".
      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain(`[p-type]="$any('gauge')"`);
      expect(result.content).toContain('</po-chart>');
      expect(result.content).not.toContain('<po-gauge');

      // p-ranges dinâmico → [p-series] com fallback condicional, replicando o
      // ngOnChanges do po-gauge (ranges vazio em runtime cai para o valor simples).
      expect(result.content).toContain('[p-series]="ranges && ranges.length ? ranges : [{ data: 72 }]"');

      // p-value com p-ranges dinâmico → [p-value-gauge-multiple] condicional
      // (quando ranges vazio, o valor vai para a série, não para valuesMultiple).
      expect(result.content).toContain('[p-value-gauge-multiple]="ranges && ranges.length ? 72 : undefined"');

      // p-description + p-show-from-to-legend + showContainerGauge default → [p-options].
      expect(result.content).toContain(
        '[p-options]="{ showContainerGauge: true, descriptionChart: \'Faturamento\', showFromToLegend: true }"'
      );

      // Transformação bem-sucedida, sem advertências.
      expect(result.changed).toBe(true);
      expect(result.warnings).toEqual([]);
    });

    it('should transform a simple <po-gauge> with only p-value (no ranges) into [p-series]="[{ data: <expr> }]"', () => {
      const source = '<po-gauge [p-value]="50"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain(`[p-type]="$any('gauge')"`);
      expect(result.content).toContain('[p-series]="[{ data: 50 }]"');
      // Sem ranges, não gera p-value-gauge-multiple.
      expect(result.content).not.toContain('p-value-gauge-multiple');
      // showContainerGauge default é injetado.
      expect(result.content).toContain('[p-options]="{ showContainerGauge: true }"');
      expect(result.changed).toBe(true);
      expect(result.warnings).toEqual([]);
    });

    it('should pass p-title and p-height directly as po-chart inputs (passthrough)', () => {
      const source = '<po-gauge [p-value]="75" p-title="Progresso" [p-height]="300"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain(`[p-type]="$any('gauge')"`);
      // p-title e p-height são passados diretamente como inputs do po-chart.
      expect(result.content).toContain('p-title="Progresso"');
      expect(result.content).toContain('[p-height]="300"');
      // Não devem aparecer dentro de p-options.
      expect(result.content).not.toContain('title:');
      expect(result.content).not.toContain('height:');
      expect(result.changed).toBe(true);
    });

    it('should map p-show-pointer to p-options.pointer', () => {
      const source = '<po-gauge [p-value]="60" [p-show-pointer]="true"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain('[p-options]="{ showContainerGauge: true, pointer: true }"');
      expect(result.changed).toBe(true);
    });
  });

  describe('fallback condicional para ranges dinâmico (cases 9b, 27b, 28, 28b):', () => {
    it('should generate conditional fallback when p-ranges is a variable (case 9b/27b)', () => {
      const source =
        '<po-gauge [p-value]="item.value" [p-ranges]="item.ranges" [p-description]="item.description"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain(
        '[p-series]="item.ranges && item.ranges.length ? item.ranges : [{ data: item.value }]"'
      );
      expect(result.content).toContain(
        '[p-value-gauge-multiple]="item.ranges && item.ranges.length ? item.value : undefined"'
      );
      expect(result.content).toContain('descriptionChart: item.description');
      expect(result.changed).toBe(true);
      expect(result.warnings).toEqual([]);
    });

    it('should generate conditional fallback for empty array variable (case 28)', () => {
      const source = '<po-gauge [p-value]="50" [p-ranges]="emptyRanges" p-title="Empty"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('[p-series]="emptyRanges && emptyRanges.length ? emptyRanges : [{ data: 50 }]"');
      expect(result.content).toContain('[p-value-gauge-multiple]="emptyRanges && emptyRanges.length ? 50 : undefined"');
      expect(result.content).toContain('p-title="Empty"');
    });

    it('should NOT generate conditional fallback for non-empty array literal (case 36)', () => {
      const source = `<po-gauge [p-value]="60" [p-ranges]="[{ from: 0, to: 50 }, { from: 50, to: 100 }]"></po-gauge>`;

      const result = migrateHtmlContent(source);

      // Array literal com conteúdo: direto, sem ternário
      expect(result.content).toContain('[p-series]="[{ from: 0, to: 50 }, { from: 50, to: 100 }]"');
      expect(result.content).toContain('[p-value-gauge-multiple]="60"');
      expect(result.content).not.toContain('&& ');
    });
  });

  describe('prioridade de p-description sobre p-options.descriptionChart (cases 16b, 40):', () => {
    it('should let p-description win over descriptionChart in p-options literal (case 16b)', () => {
      const source = [
        '<po-gauge',
        '  [p-value]="70"',
        '  [p-ranges]="gaugeRanges"',
        '  p-title="Conflito Desc"',
        `  p-description="Desc pela propriedade"`,
        `  [p-options]="{ descriptionChart: 'Desc pelo options' }">`,
        '</po-gauge>'
      ].join('\n');

      const result = migrateHtmlContent(source);

      expect(result.content).toContain("descriptionChart: 'Desc pela propriedade'");
      expect(result.content).not.toContain('Desc pelo options');
      expect(result.changed).toBe(true);
    });

    it('should let p-description win over opaque p-options variable (case 40)', () => {
      const source =
        '<po-gauge [p-value]="val" [p-ranges]="gaugeRanges" [p-description]="descricao" [p-options]="fullOptions"></po-gauge>';

      const result = migrateHtmlContent(source);

      // descriptionChart aparece DEPOIS do spread para prevalecer
      expect(result.content).toContain('...fullOptions, descriptionChart: descricao');
      expect(result.changed).toBe(true);
    });
  });

  describe('gauge sem propriedades (case 21):', () => {
    it('should migrate an empty <po-gauge></po-gauge> with default series and options', () => {
      const source = '<po-gauge></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain(`[p-type]="$any('gauge')"`);
      expect(result.content).toContain('[p-series]="[]"');
      expect(result.content).toContain('[p-options]="{ showContainerGauge: true }"');
      expect(result.content).not.toContain('p-value-gauge-multiple');
      expect(result.changed).toBe(true);
      expect(result.warnings).toEqual([]);
    });
  });

  describe('content projection preservada (case 7):', () => {
    it('should preserve inner content between po-gauge opening and closing tags', () => {
      const source = '<po-gauge [p-value]="progress" p-title="Upload"> </po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain('</po-chart>');
      // Inner whitespace content is preserved
      expect(result.content).toMatch(/>[ ]<\/po-chart>/);
      expect(result.changed).toBe(true);
    });
  });

  describe('pipes em bindings (cases 19, 19b, 20):', () => {
    it('should preserve pipe expressions in p-value bindings (case 19b)', () => {
      const source = '<po-gauge [p-value]="score" [p-description]="descricao | uppercase"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('[p-series]="[{ data: score }]"');
      expect(result.content).toContain('descriptionChart: descricao | uppercase');
      expect(result.changed).toBe(true);
    });

    it('should preserve $any() and async pipe in bindings (case 20)', () => {
      const source =
        '<po-gauge [p-value]="$any(gaugeValue$ | async)" [p-title]="$any(gaugeTitle$ | async)" [p-ranges]="$any(gaugeRanges$ | async)"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      // $any(...) expressions are preserved textually
      expect(result.content).toContain('$any(gaugeTitle$ | async)');
      // p-ranges with $any() is dynamic — generates fallback
      expect(result.content).toContain('$any(gaugeRanges$ | async) && $any(gaugeRanges$ | async).length');
      expect(result.content).toContain('$any(gaugeValue$ | async)');
      expect(result.changed).toBe(true);
    });
  });

  describe('atributos extras preservados (cases 8b, 8c, 37, 38):', () => {
    it('should preserve style, [style.x], data-*, [attr.*], [hidden], tabindex, role, [class.x] attributes', () => {
      const source = [
        '<po-gauge',
        '  [p-value]="val"',
        '  style="margin-top: 16px"',
        '  [style.opacity]="isActive ? 1 : 0.5"',
        '  data-testid="gauge-test"',
        '  data-cy="cypress-gauge"',
        `  [attr.aria-label]="'Gauge value: ' + val"`,
        '  [hidden]="!showGauge"',
        '  tabindex="0"',
        '  role="img"',
        '  class="gauge-wrapper po-mb-3"',
        '  [class.highlighted]="isActive"',
        '  [class.dimmed]="!isActive"',
        '  (mouseenter)="onMouseEnter()"',
        '  (mouseleave)="onMouseLeave()">',
        '</po-gauge>'
      ].join('\n');

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('<po-chart');
      expect(result.content).not.toContain('<po-gauge');

      // All passthrough attributes preserved
      expect(result.content).toContain('style="margin-top: 16px"');
      expect(result.content).toContain('[style.opacity]="isActive ? 1 : 0.5"');
      expect(result.content).toContain('data-testid="gauge-test"');
      expect(result.content).toContain('data-cy="cypress-gauge"');
      expect(result.content).toContain(`[attr.aria-label]="'Gauge value: ' + val"`);
      expect(result.content).toContain('[hidden]="!showGauge"');
      expect(result.content).toContain('tabindex="0"');
      expect(result.content).toContain('role="img"');
      expect(result.content).toContain('class="gauge-wrapper po-mb-3"');
      expect(result.content).toContain('[class.highlighted]="isActive"');
      expect(result.content).toContain('[class.dimmed]="!isActive"');
      expect(result.content).toContain('(mouseenter)="onMouseEnter()"');
      expect(result.content).toContain('(mouseleave)="onMouseLeave()"');
      expect(result.changed).toBe(true);
    });
  });

  describe('Angular 17+ control flow no surrounding markup (case 27):', () => {
    it('should migrate po-gauge inside @if block', () => {
      const source = '@if (showGauge) {\n  <po-gauge [p-value]="val" p-title="Flow"></po-gauge>\n}';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('@if (showGauge)');
      expect(result.content).toContain('<po-chart');
      expect(result.content).not.toContain('<po-gauge');
      expect(result.content).toContain('p-title="Flow"');
    });

    it('should migrate po-gauge inside @for block with dynamic ranges (case 27b)', () => {
      const source = [
        '@for (item of gaugeItems; track item.title) {',
        '  <po-gauge [p-value]="item.value" [p-title]="item.title" [p-ranges]="item.ranges"></po-gauge>',
        '}'
      ].join('\n');

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('@for (item of gaugeItems; track item.title)');
      expect(result.content).toContain('<po-chart');
      expect(result.content).toContain('item.ranges && item.ranges.length ? item.ranges : [{ data: item.value }]');
      expect(result.content).not.toContain('<po-gauge');
    });
  });

  describe('p-options opaco com propriedades individuais (cases 4c-4f, 22, 32, 39):', () => {
    it('should spread opaque p-options with individual showFromToLegend and pointer', () => {
      const source =
        '<po-gauge [p-value]="55" [p-ranges]="ranges" [p-show-from-to-legend]="true" [p-show-pointer]="false" [p-options]="optionsWithHeader"></po-gauge>';

      const result = migrateHtmlContent(source);

      expect(result.content).toContain('showFromToLegend: true');
      expect(result.content).toContain('pointer: false');
      expect(result.content).toContain('...optionsWithHeader');
      expect(result.changed).toBe(true);
    });
  });
});
