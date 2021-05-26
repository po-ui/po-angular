import { PoChartType } from '../enums/po-chart-type.enum';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface das series dinâmicas do `po-chart` que possibilita desenhar gráficos dos tipos `area`, `bar`, `column`, `line`, `donut` e `pie`
 */
export interface PoChartSerie {
  /**
   * @description
   *
   * Determina a cor da série. As maneiras de customizar o *preset* padrão de cores são:
   * - Hexadeximal, por exemplo `#c64840`;
   * - RGB, como `rgb(0, 0, 165)`
   * - O nome da cor, por exemplo `blue`;
   * - Usando uma das cores do tema do PO:
   *    Valores válidos:
   *    - <span class="dot po-color-01"></span> `color-01`
   *    - <span class="dot po-color-02"></span> `color-02`
   *    - <span class="dot po-color-03"></span> `color-03`
   *    - <span class="dot po-color-04"></span> `color-04`
   *    - <span class="dot po-color-05"></span> `color-05`
   *    - <span class="dot po-color-06"></span> `color-06`
   *    - <span class="dot po-color-07"></span> `color-07`
   *    - <span class="dot po-color-08"></span> `color-08`
   *    - <span class="dot po-color-09"></span> `color-09`
   *    - <span class="dot po-color-10"></span> `color-10`
   *    - <span class="dot po-color-11"></span> `color-11`
   *    - <span class="dot po-color-12"></span> `color-12`
   */
  color?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a lista de valores para a série. Os tipos esperados são de acordo com o tipo de gráfico:
   * - Para gráficos dos tipos `donut` e `pie`, espera-se *number*;
   * - Para gráficos dos tipos `area`, `bar`, `column` e `line`, espera-se um *array* de `data`.
   *
   * > Se passado valor `null` em determinado item da lista, a iteração irá ignorá-lo.
   */
  data?: number | Array<number>;

  /** Rótulo referência da série;. */
  label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido ao passar o mouse por cima das séries do *chart*.
   *
   * > Caso não seja informado um valor para o *tooltip*, será exibido da seguinte forma:
   * - `donut`: `label`: valor proporcional ao total em porcentagem.
   * - `area`, `bar`, `column`, `line` e `pie`: `label`: `data`.
   */
  tooltip?: string;

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
   * @deprecated 6.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 6.x.x**.
   *
   * Define o valor do objeto.
   */
  value?: number;

  /**
   * @deprecated 6.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 6.x.x**.
   *
   * Define o valor da categoria do objeto.
   */
  category?: string;
}
