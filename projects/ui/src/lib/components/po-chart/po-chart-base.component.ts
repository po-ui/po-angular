import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToInt, isTypeof } from '../../utils/util';

import { PoBarChartSeries } from './interfaces/po-chart-bar-series.interface';
import { PoChartGaugeSerie } from './po-chart-types/po-chart-gauge/po-chart-gauge-series.interface';
import { PoChartType } from './enums/po-chart-type.enum';
import { PoColumnChartSeries } from './interfaces/po-chart-column-series.interface';
import { PoDonutChartSeries } from './po-chart-types/po-chart-donut/po-chart-donut-series.interface';
import { PoPieChartSeries } from './po-chart-types/po-chart-pie/po-chart-pie-series.interface';
import { PoLineChartSeries } from './interfaces/po-chart-line-series.interface';
import { PoChartOptions } from './interfaces/po-chart-options.interface';

const poChartDefaultHeight = 400;
const poChartMinHeight = 200;
const poChartTypeDefault = PoChartType.Pie;

export type PoChartSeries = Array<
  PoDonutChartSeries | PoPieChartSeries | PoChartGaugeSerie | PoLineChartSeries | PoBarChartSeries | PoColumnChartSeries
>;

/**
 * @description
 *
 * O `po-chart` é um componente para renderização de dados através de gráficos, com isso facilitando a compreensão e tornando a
 * visualização destes dados mais agradável.
 *
 * Através de suas principais propriedades é possível definir atributos, tais como tipo de gráfico, altura, título, opções para os eixos, entre outros.
 *
 * Além disso, também é possível definir uma ação que será executada ao clicar em determinado elemento do gráfico
 * e outra que será executada ao passar o *mouse* sobre o elemento.
 *
 * #### Boas práticas
 *
 * - Para que o gráfico não fique ilegível e incompreensível, evite uma quantia excessiva de séries.
 * - Para exibir a intensidade de um único dado dê preferência ao tipo `gauge`.
 */
@Directive()
export abstract class PoChartBaseComponent {
  private _options: PoChartOptions;
  private _categories: Array<string>;
  private _height: number;
  private _series:
    | Array<PoDonutChartSeries | PoPieChartSeries | PoLineChartSeries | PoBarChartSeries | PoColumnChartSeries>
    | PoChartGaugeSerie;
  private _type: PoChartType = poChartTypeDefault;

  // manipulação das séries tratadas internamente para preservar 'p-series';
  chartSeries: PoChartSeries;

  public readonly poChartType = PoChartType;

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do gráfico.
   *
   * O valor padrão dos gráficos são:
   * - para o tipo *gauge*: `200px`;
   * - para os demais tipos: `400px`.
   *
   * > O valor mínimo aceito nesta propriedade é 200.
   *
   * @default `400px`
   */
  @Input('p-height') set height(value: number) {
    const intValue = convertToInt(value);
    let height: number;

    if (isTypeof(value, 'number')) {
      height = intValue <= poChartMinHeight ? poChartMinHeight : intValue;
    } else {
      height = this.setDefaultHeight();
    }

    this._height = height;

    this.getSvgContainerSize();
    this.rebuildComponentRef();
  }

  get height(): number {
    return this._height || this.setDefaultHeight();
  }

  /**
   * @description
   *
   * Define os elementos do gráfico que serão criados dinamicamente.
   */
  @Input('p-series') set series(
    value:
      | Array<PoDonutChartSeries | PoPieChartSeries | PoLineChartSeries | PoBarChartSeries | PoColumnChartSeries>
      | PoChartGaugeSerie
  ) {
    this._series = value || [];

    this.chartSeries = Array.isArray(this._series)
      ? [...this._series]
      : this.transformObjectToArrayObject(this._series);

    this.rebuildComponentRef();
  }

  get series() {
    return this._series;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define os nomes das categorias que serão plotadas nos eixos Y do grid do gráfico.
   *
   * > Caso não seja especificado um valor para a categoria, será plotado um hífen na categoria referente a cada valor de série.
   */
  @Input('p-categories') set categories(value: Array<string>) {
    if (Array.isArray(value)) {
      this._categories = value;
    }
  }

  get categories() {
    return this._categories;
  }

  /** Define o título do gráfico. */
  @Input('p-title') title?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de gráfico.
   *
   * > Veja os valores válidos no *enum* `PoChartType`.
   *
   * @default `PoChartType.Pie`
   */
  @Input('p-type') set type(value: PoChartType) {
    this._type = (<any>Object).values(PoChartType).includes(value) ? value : poChartTypeDefault;

    this.rebuildComponentRef();
  }

  get type(): PoChartType {
    return this._type;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as configurações usadas no `po-chart`.
   *
   * É possível definir as configurações dos eixos(*axis*) para os gráfico do tipo `Line`, `Column` e `Bar` da seguinte forma:
   *
   * ```
   *  chartOptions: PoChartOptions = {
   *    axis: {
   *      minRange: 0,
   *      maxRange: 100,
   *      axisXGridLines: 5,
   *    },
   *  };
   * ```
   * > Para gráficos dos tipos `Column` e `Bar`, não será aceito valor negativo para a cofiguração `axis.minRange`.
   */
  @Input('p-options') set options(value: PoChartOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;
    }
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento executado quando o usuário clicar sobre um elemento do gráfico.
   *
   * O evento emitirá o seguinte parâmetro:
   * - *gauge*, *donut* e *pie*: um objeto contendo a categoria e valor da série.
   * - *line*, *column* e *bar*: um objeto contendo o nome da série, valor e categoria do eixo do gráfico.
   */
  @Output('p-series-click')
  seriesClick = new EventEmitter<PoDonutChartSeries | PoPieChartSeries | PoChartGaugeSerie>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado quando o usuário passar o *mouse* sobre um elemento do gráfico.
   *
   * O evento emitirá o seguinte parâmetro de acordo com o tipo de gráfico:
   * - *gauge*, *donut* e *pie*: um objeto contendo a categoria e valor da série.
   * - *line*, *column* e *bar*: um objeto contendo a categoria, valor da série e categoria do eixo do gráfico.
   */
  @Output('p-series-hover')
  seriesHover = new EventEmitter<PoDonutChartSeries | PoPieChartSeries | PoChartGaugeSerie>();

  onSeriesClick(event: any): void {
    this.seriesClick.emit(event);
  }

  onSeriesHover(event: any): void {
    this.seriesHover.emit(event);
  }

  private setDefaultHeight() {
    return this.type === PoChartType.Gauge ? poChartMinHeight : poChartDefaultHeight;
  }

  private transformObjectToArrayObject(serie: PoChartGaugeSerie) {
    return typeof serie === 'object' && Object.keys(serie).length ? [{ ...serie }] : [];
  }

  // válido para gráficos do tipo circular e que será refatorado.
  protected abstract getSvgContainerSize(): void;
  abstract rebuildComponentRef(): void;
}
