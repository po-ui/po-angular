import { PoChartHeaderOptions } from '../../po-chart';

/**
 * @usedBy PoGaugeComponent
 *
 * @description
 *
 * *Interface* para configurações dos elementos do gráfico.
 */
export interface PoGaugeOptions {
  /**
   * @optional
   *
   * @description
   *
   * Define a descrição do gráfico exibido acima do gráfico.
   *
   */
  descriptionChart?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define um objeto do tipo `PoChartHeaderOptions` para configurar a exibição de botões no cabeçalho do gráfico.
   */
  header?: PoChartHeaderOptions;

  /**
   * @optional
   *
   * @description
   *
   * Esconde a estilização do container em volta do gráfico.
   *
   * @default `true`
   */
  showContainerGauge?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe os valores das propriedades `from` e `to` no gráfico do  no texto da legenda entre parênteses.
   *
   * > Válido para gráfico do tipo `Gauge`.
   *
   */
  showFromToLegend?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão.
   *
   */
  subtitleGauge?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a exibição do ponteiro.
   *
   * > Válido para gráfico do tipo `Gauge`.
   *
   * @default `true`
   */
  pointer?: boolean;
}
