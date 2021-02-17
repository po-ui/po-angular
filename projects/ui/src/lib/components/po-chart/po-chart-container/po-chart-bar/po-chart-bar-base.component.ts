import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartBarCoordinates } from '../../interfaces/po-chart-bar-coordinates.interface';
import { PoChartSerie } from '../../interfaces/po-chart-serie.interface';

@Directive()
export abstract class PoChartBarBaseComponent {
  seriesPathsCoordinates: Array<Array<PoChartBarCoordinates>>;

  protected seriesGreaterLength: number;

  private _containerSize: PoChartContainerSize = {};
  private _range: PoChartMinMaxValues = {};
  private _series: Array<PoChartSerie> = [];

  @Input('p-categories') categories: Array<string>;

  @Input('p-range') set range(value: PoChartMinMaxValues) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._range = value;

      this.calculateSeriesPathsCoordinates(this.containerSize, this._series, this._range);
    }
  }

  get range() {
    return this._range;
  }

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.calculateSeriesPathsCoordinates(this._containerSize, this.series, this.range);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-series') set series(seriesList: Array<PoChartSerie>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;
      this.seriesGreaterLength = this.mathsService.seriesGreaterLength(this.series);
      this.calculateSeriesPathsCoordinates(this.containerSize, seriesDataArrayFilter, this.range);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Output('p-bar-click') barClick = new EventEmitter<any>();

  @Output('p-bar-hover') barHover = new EventEmitter<any>();

  constructor(protected mathsService: PoChartMathsService) {}

  onSerieBarClick(selectedItem: any) {
    this.barClick.emit(selectedItem);
  }

  onSerieBarHover(selectedItem: any) {
    this.barHover.emit(selectedItem);
  }

  trackBy(index) {
    return index;
  }

  private calculateSeriesPathsCoordinates(
    containerSize: PoChartContainerSize,
    series: Array<PoChartSerie>,
    range: PoChartMinMaxValues
  ) {
    this.seriesPathsCoordinates = series.map((serie: PoChartSerie, seriesIndex) => {
      if (Array.isArray(serie.data)) {
        let pathCoordinates: Array<PoChartBarCoordinates> = [];

        serie.data.forEach((data, serieDataIndex) => {
          if (this.mathsService.verifyIfFloatOrInteger(data)) {
            const coordinates = this.barCoordinates(seriesIndex, serieDataIndex, containerSize, range, data);

            const category = this.serieCategory(serieDataIndex, this.categories);
            const label = serie['label'];
            const color = serie['color'];
            const tooltip = serie['tooltip'];
            const tooltipLabel = this.getTooltipLabel(data, label, tooltip);

            pathCoordinates = [...pathCoordinates, { category, color, label, tooltipLabel, data, coordinates }];
          }
        });

        return pathCoordinates;
      }
    });
  }

  private getTooltipLabel(data: number, label: string, tooltipLabel: string) {
    const dataLabel = label ? `${label}: ` : '';
    const dataValue = data.toString();

    return tooltipLabel || `${dataLabel}${dataValue}`;
  }

  private serieCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  protected abstract barCoordinates(
    seriesIndex: number,
    serieDataIndex: number,
    containerSize: PoChartContainerSize,
    range: PoChartMinMaxValues,
    serieValue: number
  );
}
