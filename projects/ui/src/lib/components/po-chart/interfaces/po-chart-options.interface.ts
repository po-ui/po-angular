import { PoChartAxisOptions } from './po-chart-axis-options.interface';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* para configurações dos elementos do gráfico.
 */
export interface PoChartOptions {
  /** Define um objeto do tipo `PoChartAxisOptions` para configuração dos eixos. */
  axis?: PoChartAxisOptions;
}
