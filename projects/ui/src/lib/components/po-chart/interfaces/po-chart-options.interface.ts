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

  /** Define a exibição da legenda do gráfico. Valor padrão é `true` */
  legend?: boolean;
}
