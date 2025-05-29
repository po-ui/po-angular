import { PoChartAxisOptions } from './po-chart-axis-options.interface';
import { PoChartHeaderOptions } from './po-chart-header-options.interface';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* para configurações dos elementos do gráfico.
 */
export interface PoChartOptions {
  /**
   * @optional
   *
   * @description
   *
   * Define um objeto do tipo `PoChartAxisOptions` para configuração dos eixos.
   */
  axis?: PoChartAxisOptions;

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
   * Permite aplicar zoom ao gráfico com o scroll do mouse;
   *
   * @default `false`
   */
  dataZoom?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define se os pontos do gráfico serão preenchidos.
   * Quando true, os pontos são totalmente coloridos. Quando false, apenas a borda dos pontos será exibida, mantendo o interior transparente.
   *
   * > Esta propriedade é utilizável para os gráficos dos tipos `Area` e `Line`.
   *
   * @default `false`
   */
  fillPoints?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Valor que permite customizar o nome da `TH` da primeira coluna da tabela descritiva.
   *
   * @default `Série`
   */
  firstColumnName?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o diâmetro, em valor percentual entre `0` e `100`, da área central para gráficos do tipo `donut`.
   * Se passado um percentual que torne a espessura do gráfico menor do que `40px`,
   * os textos internos do gráficos serão ocultados para que não haja quebra de layout.
   */
  innerRadius?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define borda entre os itens do gráfico. Válido para os gráficos `Donut`, `Pie`.
   * > Valores válidos entre 0 e 100,
   *
   * @default `0`
   */
  borderRadius?: number;

  /**
   * @optional
   *
   * @description
   *
   * Aplica texto centralizado customizado nos gráficos de `Donut`.
   */
  textCenterGraph?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a exibição da legenda do gráfico. Valor padrão é `true`
   */
  legend?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define o alinhamento horizontal da legenda.
   *
   * > Propriedade inválida para o gráfico do tipo `Gauge`.
   *
   * @default `center`
   */
  legendPosition?: 'left' | 'center' | 'right';

  /**
   * @optional
   *
   * @description
   *
   * Define a posição vertical da legenda no gráfico.
   * > Quando utilizada com o valor `top`, recomenda-se configurar também a propriedade `bottomDataZoom` caso o `dataZoom` esteja habilitado, para evitar sobreposição entre os elementos.
   * > Propriedade inválida para o gráfico do tipo `Gauge`.
   *
   * @default `bottom`
   */
  legendVerticalPosition?: 'top' | 'bottom';

  /**
   * @optional
   *
   * @description
   *
   * Define a distância inferior do componente DataZoom.
   *
   * Esta propriedade aceita os seguintes valores:
   *
   * - `false` (padrão): não aplica ajustes.
   *
   * - `true`: aplica um valor automático com base no posicionamento da legenda:
   *   - `8` pixels quando o DataZoom estiver habilitado e não houver legenda, ou quando a legenda estiver posicionada no topo.
   *   - `32` pixels quando o DataZoom estiver habilitado e a legenda estiver posicionada na parte inferior.
   *
   * - `number`: aplica o valor numérico informado como distância inferior. Este valor tem prioridade sobre a configuração booleana.
   *
   * > Esta configuração é considerada apenas quando o DataZoom estiver habilitado (`dataZoom: true`).
   *
   * @default `false`
   */
  bottomDataZoom?: boolean | number;

  /**
   * @optional
   *
   * @description
   *
   * Define como o gráfico será renderizado.
   *
   * > Recomenda-se não modificar o valor da propriedade `rendererOption` após a inicialização da aplicação, uma vez que tal alteração pode ocasionar comportamentos inconsistentes na renderização do gráfico.
   *
   * @default `canvas`
   */
  rendererOption?: 'canvas' | 'svg';

  /**
   * @optional
   *
   * @description
   *
   * Transforma os gráficos do tipo `Donut` ou `Pie` num gráfico de área polar.
   *
   * > Válido para os gráficos `Donut` e `Pie`.
   *
   * @default `false`
   */
  roseType?: boolean;

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
   * Define a exibição do ponteiro.
   *
   * > Válido para gráfico do tipo `Gauge`.
   *
   * @default `true`
   */
  pointer?: boolean;

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
   * Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão.
   *
   * > Válido para gráfico do tipo `Gauge`.
   *
   */
  subtitleGauge?: string;

  /**
   * @optional
   *
   * @description
   *
   * Esconde a estilização do container em volta do gráfico.
   *
   * > Válido para gráfico do tipo `Gauge`.
   *
   * @default `false`
   */
  showContainerGauge?: boolean;
}
