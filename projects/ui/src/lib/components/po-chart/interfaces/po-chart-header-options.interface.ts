/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* que define os eixos do grid.
 */
export interface PoChartHeaderOptions {
  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo X
   *
   * @default `false`
   */
  disabledExpand?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo Y
   *
   * @default `false`
   */
  disabledTableDetails?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo Y
   *
   * @default `false`
   */
  disabledExportCsv?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo Y
   *
   * @default `false`
   */
  disabledExportImage?: boolean;
}
