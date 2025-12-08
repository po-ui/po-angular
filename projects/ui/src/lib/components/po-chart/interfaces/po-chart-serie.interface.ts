import { PoChartType } from '../enums/po-chart-type.enum';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface das series dinâmicas do `po-chart` que possibilita desenhar gráficos dos tipos `area`, `bar`, `column`, `line`, `donut`, `pie` e `radar`
 */
export interface PoChartSerie {
  /**
   * @description
   *
   * Determina a cor da série. As maneiras de customizar o *preset* padrão de cores são:
   * * Hexadecimal, por exemplo `#c64840`;
   * * RGB, por exemplo `rgb(0, 0, 165)`
   * * O nome da cor, por exemplo `blue`;
   * * Variáveis CSS, por exemplo `var(--color-01)`;
   * * Usando uma das cores do tema do PO:
   *   Valores válidos:
   *     - <span class="dot po-color-01"></span> `color-01`
   *     - <span class="dot po-color-02"></span> `color-02`
   *     - <span class="dot po-color-03"></span> `color-03`
   *     - <span class="dot po-color-04"></span> `color-04`
   *     - <span class="dot po-color-05"></span> `color-05`
   *     - <span class="dot po-color-06"></span> `color-06`
   *     - <span class="dot po-color-07"></span> `color-07`
   *     - <span class="dot po-color-08"></span> `color-08`
   *     - <span class="dot po-color-09"></span> `color-09`
   *     - <span class="dot po-color-10"></span> `color-10`
   *     - <span class="dot po-color-11"></span> `color-11`
   *     - <span class="dot po-color-12"></span> `color-12`
   * - A partir da 13° série o valor da cor será preta caso não seja enviada uma cor customizada.
   */
  color?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a lista de valores para a série. Os tipos esperados são de acordo com o tipo de gráfico:
   * - Para gráficos dos tipos `donut` e `pie`, espera-se *number*;
   * - Para gráficos dos tipos `area`, `bar`, `column`, `line` e `radar`, espera-se um *array* de `data`.
   *
   * > Se passado valor `null` em determinado item da lista, a iteração irá ignorá-lo.
   */
  data?: number | Array<number>;

  /**
   * @optional
   *
   * @description
   *
   * Define se a série terá sua área preenchida.
   *
   * > Propriedade válida para gráficos do tipo `Radar`, `fillpoints` não funciona quando `areaStyle` está definido como `true`.
   */
  areaStyle?: boolean;

  /** Rótulo referência da série. */
  label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido na tooltip ao passar o mouse por cima das séries do *chart*.
   *
   * Formatos aceitos:
   *
   * - **string**: pode conter marcadores dinâmicos e HTML simples.
   *  - Marcadores disponíveis:
   *   - `{name}` → Nome do item/categoria.
   *   - `{seriesName}` → Nome da série.
   *   - `{value}` → Valor correspondente.
   *
   * - **function**: função que recebe o objeto `params` e deve retornar uma *string* com o conteúdo da tooltip.
   *
   * > É possível utilizar marcação HTML simples (`<b>`, `<i>`, `<br>`, `<hr>`, etc.) que será interpretada via `innerHTML`.
   *
   * > Formatação customizada (será convertido internamente para HTML):
   * - `\n` → quebra de linha (`<br>`).
   * - `**texto**` → negrito (`<b>`).
   * - `__texto__` → itálico (`<i>`).
   *
   * > Caso não seja informado um valor para o *tooltip*, será exibido da seguinte forma:
   * - `donut`, `label`: valor proporcional ao total em porcentagem.
   * - `radar`: nome da série, o nome do indicator e os valores correspondentes.
   * - `area`, `bar`, `column`, `line` e `pie`: `label`: `data`.
   *
   * ### Exemplos:
   *
   * **Usando string com placeholders:**
   * ```ts
   * tooltip: 'Ano: {name}<br>Série: {seriesName}<br>Valor: <b>{value}</b>'
   * ```
   *
   * **Usando função de callback:**
   * ```ts
   * tooltip = (params) => {
   *   return `Ano: ${params.name}<br><i>Valor:</i> ${params.value}`;
   * }
   * ```
   */
  tooltip?: string | ((params: any) => string);

  /**
   * @optional
   *
   * @description
   *
   * Define em qual tipo de gráfico que será exibida a série. É possível combinar séries dos tipos `column` e `line` no mesmo gráfico. Para isso, basta criar as séries com as configurações:
   * - Serie A: `{ type: ChartType.Column, data: ... }`;
   * - Série B: `{ type: ChartType.Line, data: ... }`.
   *
   * Se tanto `p-type` quanto `{ type }` forem ignorados, o padrão gerado pelo componente será:
   * - `column`: se `data` receber `Array<number>`;
   * - `pie`: se `data` for *number*.
   *
   * > Se utilizada a propriedade `p-type`, dispensa-se a definição desta propriedade. Porém, se houver declaração para ambas, o valor `{type}` da primeira série sobrescreverá o valor definido em `p-type`.
   *
   * > O componente só exibirá as séries que tiverem o mesmo `type` definido, exceto para mesclagem para tipos `column` e `line`.
   */
  type?: PoChartType;

  /**
   * Alcance inicial da cor.
   *
   * > Propriedade válida para gráfico do tipo `Gauge`.
   */
  from?: number;

  /**
   * Alcance final da cor.
   *
   * > Propriedade válida para gráfico do tipo `Gauge`.
   */
  to?: number;

  /**
   * @optional
   *
   * @description
   *
   * Agrupa as séries em barras ou colunas que receberem o mesmo `stackGroupName`. Exemplo:
   * - Serie A: `{ data: 500, stackGroupName: 'group1' ... }`;
   * - Série B: `{ data: 200, stackGroupName: 'group1' ... }`.
   * - Série C: `{ data: 100, stackGroupName: 'group2' ... }`.
   * - Série D: `{ data: 400, stackGroupName: 'group2' ... }`.
   *
   * Nesse caso será criado duas barras ou colunas com duas series agrupadas em cada uma por categoria.
   * > Válido para gráfico do tipo `Column` e `Bar`. Essa propriedade é ignorada caso a propriedade `stacked` da interface `PoChartOptions` esteja como `true`.
   *
   * > Essa propriedade habilita a propriedade `p-data-label` por padrão, podendo ser desabilitada passando `[p-data-label]={ fixed: false }`.
   */
  stackGroupName?: string;
}
