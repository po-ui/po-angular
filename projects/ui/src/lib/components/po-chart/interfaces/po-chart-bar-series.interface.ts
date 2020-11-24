/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto das séries para gráficos do tipo `Bar`.
 */
export interface PoBarChartSeries {
  /** Define o texto da série. */
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
