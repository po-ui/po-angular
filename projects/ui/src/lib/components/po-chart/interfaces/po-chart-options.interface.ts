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

  /**
   * Define o diâmetro, em valor percentual entre `0` e `100`, da área central para gráficos do tipo `donut`.
   * Se passado um percentual que torne a espessura do gráfico menor do que `40px`,
   * os textos internos do gráficos serão ocultados para que não haja quebra de layout.
   */
  innerRadius?: number;

  /** Define a exibição da legenda do gráfico. Valor padrão é `true` */
  legend?: boolean;
}
