import { PoChartIndicatorOptions } from './po-chart-indicator-options.interface';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* para configurações do gráfico `radar`.
 */
export interface PoChartRadarOptions {
  /**
   * @optional
   *
   * @description
   *
   * Define as configurações dos indicadores do gráfico, como nome, cor, valor mínimo e valor máximo.
   */
  indicator?: Array<PoChartIndicatorOptions>;

  /**
   * @optional
   *
   * @description
   *
   * Define o formato da grid, podendo ser exibida como polígono ou círculo.
   *
   * @default `polygon`
   */
  shape?: 'polygon' | 'circle';

  /**
   * @optional
   *
   * @description
   *
   * Define o efeito zebrado na grid.
   *
   * @default 'false'
   */
  splitArea?: boolean;
}
