import { PoChartLabelFormat } from '../enums/po-chart-label-format.enum';

/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* que define os eixos do grid.
 */
export interface PoChartAxisOptions {
  /**
   * Define a quantidade de linhas exibidas no grid.
   * Para os gráficos dos tipos `Area`, `Line` e `Column`, as linhas modificadas serão as horizontais (eixo X).
   * Já para gráficos do tipo `Bar`, tratará as linhas verticais (eixo Y).
   *
   * A propriedade contém as seguintes diretrizes para seu correto funcionamento:
   * - Quantidade padrão de linhas: '5';
   * - Quantidade mínima permitida: '2';
   */
  gridLines?: number;

  /**
   * Define o alcance de valor máximo exibido no eixo Y.
   * Caso não seja definido valor, o valor de alcance máximo exibido será o maior existente entre as séries.
   *
   * > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
   */
  maxRange?: number;

  /**
   * Define o alcance mínimo exibido no eixo Y.
   * Caso não seja definido valor, o valor-base de alcance mínimo será o menor encontrado entre as séries.
   * Se houver valores negativos nas séries, o menor deles será a base mínima.
   *
   * > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
   */
  minRange?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo do label e a formatação exibida no eixo de valor.
   */
  labelType?: PoChartLabelFormat;

  /**
   * @optional
   *
   * @description
   *
   * Permite aumentar ou diminuir o espaço inferior do gráfico.
   *
   */
  paddingBottom?: number;

  /**
   * @optional
   *
   * @description
   *
   * Permite aumentar ou diminuir o espaço esquerdo do gráfico.
   *
   * @default `16`
   */
  paddingLeft?: number;

  /**
   * @optional
   *
   * @description
   *
   * Permite aumentar ou diminuir o espaço direito do gráfico.
   *
   * @default `32`
   */
  paddingRight?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define o ângulo de rotação da legenda do gráfico.
   * Aceita valores entre -90 e 90 graus, onde:
   * - Valores negativos giram a legenda para a esquerda.
   * - Valores positivos giram a legenda para a direita.
   *
   * Se não for definido, a legenda será exibida sem rotação.
   */
  rotateLegend?: number;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo X
   *
   * @default `false`
   */
  showXAxis?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha do eixo Y
   *
   * @default `true`
   */
  showYAxis?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a linha de detalhes que acompanha o mouse
   *
   * @default `false`
   */
  showAxisDetails?: boolean;
}
