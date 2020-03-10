import { PoCircularChartSeries } from '../po-chart-circular/po-chart-circular-series.interface';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto da série `PoChartType.Donut`.
 *
 * @docsExtends PoCircularChartSeries
 */
export interface PoDonutChartSeries extends PoCircularChartSeries {
  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido ao passar o mouse por cima das séries do *chart*.
   *
   * > Caso não seja informado um valor para o *tooltip*, será exibido: `categoria: valor proporcional ao total em porcentagem`.
   */
  tooltip?: string;
}
