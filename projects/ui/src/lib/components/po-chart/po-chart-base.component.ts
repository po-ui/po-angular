import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { poChartLiteralsDefault } from '../po-chart/interfaces/po-chart-literals-default.interface';
import { PoChartLiterals } from '../po-chart/interfaces/po-chart-literals.interface';
import { PoChartOptions } from '../po-chart/interfaces/po-chart-options.interface';
import { PoChartDataLabel } from '../po-chart/interfaces/po-chart-serie-data-label.interface';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoPopupAction } from '../po-popup';

const poChartMinHeight = 200;
const poChartDefaultHeight = 400;

/**
 * @description
 *
 * O `po-chart` é um componente para renderização de dados através de gráficos, com isso facilitando a compreensão e tornando a
 * visualização destes dados mais agradável.
 *
 * Através de suas principais propriedades é possível definir atributos, tais como tipo de gráfico, altura, título, cores customizadas, opções para os eixos, entre outros.
 *
 * O componente permite utilizar em conjunto séries do tipo linha e coluna.
 *
 * Além disso, também é possível definir uma ação que será executada ao clicar em determinado elemento do gráfico
 * e outra que será executada ao passar o *mouse* sobre o elemento.
 *
 * #### Guia de uso para Gráficos
 *
 * > Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
 * informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                             | Valor Padrão                                      |
 * |------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Header (.po-chart-header )**           |                                                       |                                                   |
 * | `--background-color`                     | Cor de background do cabeçalho                        | `var(--color-neutral-light-00)`                   |
 * | `--color`                                | Cor da fonte do cabeçalho                             | `var(--color-neutral-dark-70)`                    |
 * | `--font-family`                          | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size-title`                      | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--font-size-icons`                      | Tamanho dos ícones                                    | `var(--font-size-md)`                             |
 * | `--font-weight`                          | Peso da fonte                                         | `var(--font-weight-bold)`                         |
 * | **Chart (.po-chart)**                    |                                                       |                                                   |
 * | `--background-color-grid`                | Cor de background                                     | `var(--color-neutral-light-00)`                   |
 * | `--color-grid`                           | Cor da fonte                                          | `var(--color-neutral-light-20)`                   |
 * | `--font-family-grid`                     | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size-grid`                       | Tamanho da fonte                                      | `var(--font-size-xs)`                             |
 * | `--font-weight-grid`                     | Peso da fonte                                         | `var(--font-weight-normal)`                       |
 * | `--color-legend`                         | Cor da fonte da legenda                               | `var(--color-neutral-dark-70)`                    |
 * | `--border-radius-bar`                    | Contém o valor do raio dos cantos do elemento         | `var(--border-radius-none)`                       |
 * | `--color-grid-hover`                     | Cor no estado hover                                   | `var(--color-neutral-mid-60)`                     |
 */
@Directive()
export abstract class PoChartBaseComponent implements OnInit {
  private _literals?: PoChartLiterals;
  private setHeightGauge = false;
  private readonly language: string;

  @Input('t-id') id: string = 'myChart';

  /** Define o título do gráfico. */
  @Input('p-title') title?: string;

  /**
   * @description
   *
   * Define os elementos do gráfico que serão criados dinamicamente.
   */
  @Input('p-series') series: Array<PoChartSerie>;

  /**
   * @description
   *
   * Define o valor do gráfico do tipo `Gauge`.
   */
  @Input('p-value-gauge-multiple') valueGaugeMultiple?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define os nomes das categorias que serão plotadas no eixo X do gráfico caso seja do tipo `bar`, ou então nos eixos Y do grid de gráficos dos tipos `area`, `columnn` e `line`.
   *
   * > Gráficos do tipo `bar` dimensionam a área do gráfico de acordo com a largura do maior texto de categorias. No entanto, é uma boa prática optar por palavras curtas para que a leitura do gráfico não seja prejudicada.
   *
   * > Caso não seja especificado um valor para a categoria, será plotado um hífen na categoria referente a cada série.
   */
  @Input('p-categories') categories?: Array<string>;

  @Input('p-custom-actions') customActions?: Array<PoPopupAction>;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as configurações usadas no `po-chart`.
   *
   * É possível, por exemplo, definir as configurações de exibição das legendas,
   * configurar os eixos(*axis*) para os gráficos dos tipos `area`, `line`, `column` e `bar` da seguinte forma:
   *
   * ```
   *  chartOptions: PoChartOptions = {
   *    legend: true,
   *    axis: {
   *      minRange: 0,
   *      maxRange: 100,
   *      gridLines: 5,
   *    },
   *  };
   * ```
   */
  @Input('p-options') options?: PoChartOptions;

  /**
   * @optional
   *
   * @description
   *
   * Permite configurar as propriedades de exibição dos rótulos das séries no gráfico.
   *
   * Essa configuração possibilita fixar os valores das séries diretamente no gráfico, alterando o comportamento visual:
   * - Os valores das séries permanecem visíveis, sem a necessidade de hover.
   * - O *tooltip* não será exibido.
   * - Os marcadores (*bullets*) terão seu estilo ajustado.
   * - As outras séries ficarão com opacidade reduzida ao passar o mouse sobre a série ativa.
   *
   * > Disponível apenas para gráficos do tipo `line`.
   *
   * #### Exemplo de utilização:
   * ```typescript
   * dataLabel: PoChartDataLabel = {
   *   fixed: true,
   * };
   * ```
   */
  @Input('p-data-label') dataLabel?: PoChartDataLabel;

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do gráfico em px.
   *
   * > No caso do tipo `Gauge`, o valor padrão é `300` e esse é seu valor minimo aceito. Nos outros tipos, o valor mínimo aceito nesta propriedade é 200.
   *
   * @default `400`
   */
  @Input('p-height')
  set height(value: number) {
    let heightGauge = null;
    this.setHeightGauge = true;
    if (this.type === PoChartType.Gauge) {
      heightGauge = 300;
    }
    this._height = Math.max(value ?? heightGauge ?? poChartDefaultHeight, poChartMinHeight);
  }

  get height(): number {
    return this._height;
  }

  private _height: number = poChartDefaultHeight;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de gráfico.
   *
   * É possível também combinar gráficos dos tipos linha e coluna. Para isso, opte pela declaração de `type` conforme a interface `PoChartSerie`.
   *
   * > Note que, se houver declaração de tipo de gráfico tanto em `p-type` quanto em `PochartSerie.type`, o valor `{ type }` da primeira série anulará o valor definido em `p-type`.
   *
   * Se não passado valor, o padrão será relativo à primeira série passada em `p-series`:
   * - Se `p-series = [{ data: [1,2,3] }]`: será `PoChartType.Column`.
   * - Se `p-series = [{ data: 1 }]`: será `PoChartType.Pie`.
   *
   * > Veja os valores válidos no *enum* `PoChartType`.
   */
  @Input('p-type') type: PoChartType;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-chart`.
   *
   * Para utilizar basta passar a literal que deseja customizar:
   *
   * ```
   *  const customLiterals: PoChartLiterals = {
   *    downloadCSV: 'Obter CSV',
   *  };
   * ```
   *
   * E para carregar a literal customizada, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-chart
   *   [p-literals]="customLiterals">
   * </po-chart>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoChartLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poChartLiteralsDefault[poLocaleDefault],
        ...poChartLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poChartLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poChartLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento executado quando o usuário clicar sobre um elemento do gráfico.
   *
   * O evento emitirá o seguinte parâmetro:
   * - *donut* e *pie*: um objeto contendo a categoria e valor da série.
   * - *area*, *line*, *column* e *bar*: um objeto contendo o nome da série, valor e categoria do eixo do gráfico.
   */
  @Output('p-series-click')
  seriesClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado quando o usuário passar o *mouse* sobre um elemento do gráfico.
   *
   * O evento emitirá o seguinte parâmetro de acordo com o tipo de gráfico:
   * - *donut* e *pie*: um objeto contendo a categoria e valor da série.
   * - *area*, *line*, *column* e *bar*: um objeto contendo a categoria, valor da série e categoria do eixo do gráfico.
   */
  @Output('p-series-hover')
  seriesHover: EventEmitter<any> = new EventEmitter<any>();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  ngOnInit(): void {
    if (this.type === PoChartType.Gauge && !this.setHeightGauge) {
      this._height = 300;
    }
  }
}
