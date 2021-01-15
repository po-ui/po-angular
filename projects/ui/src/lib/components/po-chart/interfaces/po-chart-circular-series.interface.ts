export interface PoCircularChartSeries {
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
   *
   * > Para definir o valor da categoria do objeto utilize a nova propriedade `label`.
   */
  category?: string;

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
   *
   * > Para definir o valor do objeto utilize a nova propriedade `data`.
   */
  value?: number;

  /** Define o texto da série. */
  label?: string;

  /** Define o valor da série. */
  data?: number;

  color?: string;
}
