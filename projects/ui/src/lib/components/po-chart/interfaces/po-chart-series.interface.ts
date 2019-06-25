/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define cada objeto do `PoPieChartSeries`.
 */
export interface PoPieChartSeries {

  /** Define o valor da categoria do objeto. */
  category: string;

  /** Define o valor do objeto. */
  value: number;

  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido ao passar o mouse por cima das séries do *chart*.
   *
   * > Caso não seja informado um valor para o *tooltip*, será exibido: `categoria: valor`.
   */
  tooltip?: string;

}
