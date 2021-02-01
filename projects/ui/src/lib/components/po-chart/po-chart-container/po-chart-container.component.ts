import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';
import { PoChartOptions } from '../interfaces/po-chart-options.interface';
import { PoChartAxisOptions } from '../interfaces/po-chart-axis-options.interface';
import { PoChartColorService } from '../services/po-chart-color.service';
import { PoChartMathsService } from '../services/po-chart-maths.service';
import { PoChartMinMaxValues } from '../interfaces/po-chart-min-max-values.interface';
import { PoChartSerie } from '../interfaces/po-chart-serie.interface';

// TODO: remover quando PoChartSerie tiver color.
export interface ChartSerieColor extends PoChartSerie {
  color?: string;
}

@Component({
  selector: 'po-chart-container',
  templateUrl: './po-chart-container.component.html'
})
export class PoChartContainerComponent implements OnChanges {
  private _options: PoChartOptions;
  private _series: Array<ChartSerieColor> = [];

  allowNegativeData: boolean;
  axisOptions: PoChartAxisOptions;
  range: PoChartMinMaxValues;
  seriesByType;
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

  @Input('p-series') set series(data: Array<PoChartSerie>) {
    const seriesColors = this.colorService.getSeriesColor(data, PoChartType.Line);
    this._series = data.map((serie, index) => {
      return { ...serie, color: seriesColors[index] };
    });
    this.allowNegativeData = this.seriesTypeLine(this._series);
    this.setSeriesByType(this._series);
    this.setRange(this._series, this.options);
  }

  get series() {
    return this._series;
  }

  get isTypeCircular() {
    return this.type === PoChartType.Pie || this.type === PoChartType.Donut;
  }

  constructor(private colorService: PoChartColorService, private mathsService: PoChartMathsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || changes.containerSize) {
      this.setViewBox();
    }
  }

  onSerieClick(event: any) {
    this.serieClick.emit(event);
  }

  onSerieHover(event: any) {
    this.serieHover.emit(event);
  }

  private getRange(series: Array<PoChartSerie>, options: PoChartOptions = {}): PoChartMinMaxValues {
    const domain = this.mathsService.calculateMinAndMaxValues(series, this.allowNegativeData);
    const minValue =
      !this.allowNegativeData && !options.axis?.minRange
        ? 0
        : options.axis?.minRange < domain.minValue
        ? options.axis.minRange
        : domain.minValue;
    const maxValue = options.axis?.maxRange > domain.maxValue ? options.axis.maxRange : domain.maxValue;
    const updatedDomainValues = { minValue: !this.allowNegativeData && minValue < 0 ? 0 : minValue, maxValue };

    return { ...domain, ...updatedDomainValues };
  }

  private setRange(series: Array<PoChartSerie>, options: PoChartOptions = {}) {
    if (!this.isTypeCircular) {
      this.range = this.getRange(series, options);
    }
  }

  private seriesTypeLine(series: Array<PoChartSerie>): boolean {
    return series.every(serie => serie.type === PoChartType.Line);
  }

  private setSeriesByType(series: Array<PoChartSerie>) {
    this.seriesByType = {
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
