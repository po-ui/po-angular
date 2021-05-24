import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';
import { PoChartOptions } from '../interfaces/po-chart-options.interface';
import { PoChartAxisOptions } from '../interfaces/po-chart-axis-options.interface';
import { PoChartMathsService } from '../services/po-chart-maths.service';
import { PoChartMinMaxValues } from '../interfaces/po-chart-min-max-values.interface';
import { PoChartSerie } from '../interfaces/po-chart-serie.interface';

@Component({
  selector: 'po-chart-container',
  templateUrl: './po-chart-container.component.html'
})
export class PoChartContainerComponent implements OnChanges {
  private _options: PoChartOptions;
  private _series: Array<PoChartSerie> = [];

  alignByTheCorners: boolean;
  axisOptions: PoChartAxisOptions;
  categoriesCoordinates: Array<number>;
  range: PoChartMinMaxValues;
  seriesByType;
  svgSpace;
  viewBox: string;

  @Input('p-categories') categories: Array<string>;

  @Input('p-type') type: PoChartType;

  @Input('p-container-size') containerSize: PoChartContainerSize;

  @Output('p-serie-click') serieClick = new EventEmitter<any>();

  @Output('p-serie-hover') serieHover = new EventEmitter<any>();

  @Input('p-options') set options(value: PoChartOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;

      this.verifyAxisOptions(this._options);
    }
  }

  get options() {
    return this._options;
  }

  @ViewChild('svgELement', { static: true }) svgELement: ElementRef;

  @Input('p-series') set series(data: Array<PoChartSerie>) {
    this._series = data;
    this.setAlignByTheCorners(this._series);
    this.setSeriesByType(this._series);
    this.setRange(this._series, this.options);
  }

  get series() {
    return this._series;
  }

  get isTypeCircular() {
    return this.type === PoChartType.Pie || this.type === PoChartType.Donut;
  }

  constructor(private mathsService: PoChartMathsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || changes.containerSize) {
      this.setViewBox();
      this.setSvgSpace();
    }
  }

  getCategoriesCoordinates(value: Array<number>): void {
    this.categoriesCoordinates = value;
  }

  onSerieClick(event: any) {
    this.serieClick.emit(event);
  }

  onSerieHover(event: any) {
    this.serieHover.emit(event);
  }

  private getRange(series: Array<PoChartSerie>, options: PoChartOptions = {}): PoChartMinMaxValues {
    const domain = this.mathsService.calculateMinAndMaxValues(series);
    const minValue =
      !options.axis?.minRange && domain.minValue > 0
        ? 0
        : options.axis?.minRange < domain.minValue
        ? options.axis.minRange
        : domain.minValue;
    const maxValue = options.axis?.maxRange > domain.maxValue ? options.axis.maxRange : domain.maxValue;
    const updatedDomainValues = { minValue, maxValue };

    return { ...domain, ...updatedDomainValues };
  }

  private setSvgSpace() {
    // Representa um ponto 2D dentro do viewport do SVG. Ele é a representação do cursor do mouse para comparação de coordenadas com cada dado de série.
    const svgPoint = this.svgELement.nativeElement.createSVGPoint();
    // Retorna um DOMMatrix representando as matrizes 2D e 3D transformadas a partir das coordenadas do elemento, em relação ao document, para coordenadas relativas ao viewport do SVG.
    // É utilizado nos gráficos do tipo área para que seja possível equiparar as coordenadas do evento com cada dado de série, para assim ativar o ponto de dado equivalente.
    const svgDomMatrix = this.svgELement.nativeElement.getScreenCTM()?.inverse();

    this.svgSpace = { svgPoint, svgDomMatrix };
  }

  private setAlignByTheCorners(series: Array<PoChartSerie>): void {
    this.alignByTheCorners = series.every(serie => serie.type === PoChartType.Area || serie.type === PoChartType.Bar);
  }

  private setRange(series: Array<PoChartSerie>, options: PoChartOptions = {}) {
    if (!this.isTypeCircular) {
      this.range = this.getRange(series, options);
    }
  }

  private setSeriesByType(series: Array<PoChartSerie>) {
    this.seriesByType = {
      [PoChartType.Area]: series.filter(serie => serie.type === PoChartType.Area),
      [PoChartType.Column]: series.filter(serie => serie.type === PoChartType.Column),
      [PoChartType.Bar]: series.filter(serie => serie.type === PoChartType.Bar),
      [PoChartType.Line]: series.filter(serie => serie.type === PoChartType.Line),
      [PoChartType.Donut]: series.filter(serie => serie.type === PoChartType.Donut),
      [PoChartType.Pie]: series.filter(serie => serie.type === PoChartType.Pie)
    };
  }

  private setViewBox() {
    const { svgWidth, svgHeight } = this.containerSize;
    const viewBoxWidth = this.isTypeCircular ? svgHeight : svgWidth;
    // Tratamento necessário para que não corte o vetor nas extremidades
    const offsetXY = 1;

    this.viewBox = `${offsetXY} -${offsetXY} ${viewBoxWidth} ${this.containerSize.svgHeight}`;
  }

  private verifyAxisOptions(options: PoChartOptions): void {
    if (!this.isTypeCircular && options.hasOwnProperty('axis')) {
      this.range = this.getRange(this.series, this.options);
      this.axisOptions = {
        ...this.axisOptions,
        ...options.axis
      };
    }
  }
}
