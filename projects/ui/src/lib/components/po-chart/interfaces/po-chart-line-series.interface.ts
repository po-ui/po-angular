/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto da série `PoChartType.Line`.
 */
export interface PoLineChartSeries {
  /** Define o valor da categoria do objeto. */
  label: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a lista de valores para a série.
   *
   * > Se passado valor `null` em determinado item da lista, a iteração irá ignorá-lo.
   */
  data: Array<number>;
}
