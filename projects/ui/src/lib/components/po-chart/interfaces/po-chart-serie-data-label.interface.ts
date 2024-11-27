import { PoChartType } from '../enums/po-chart-type.enum';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define as propriedades de exibição dos rótulos das séries no `po-chart`.
 *
 * > Aplicável apenas para gráficos do tipo `line`.
 */
export interface PoChartDataLabel {
  /**
   * @optional
   *
   * @description
   *
   * Indica se o texto associado aos pontos da série deve permanecer fixo na exibição do gráfico.
   *
   * - Quando definido como `true`:
   *   - O *tooltip* não será exibido.
   *   - As outras séries ficarão com opacidade reduzida ao passar o mouse sobre a série ativa.
   *
   * > Disponível apenas para o tipo de gráfico `PoChartType.Line`.
   */
  fixed?: boolean;
}
