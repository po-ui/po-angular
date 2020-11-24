import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoBarChartSeries } from '../../interfaces/po-chart-bar-series.interface';
import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoColumnChartSeries } from '../../interfaces/po-chart-column-series.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartBarCoordinates } from '../../interfaces/po-chart-bar-coordinates.interface';

@Directive()
export abstract class PoChartBarBaseComponent {
  colors: Array<string>;
  seriesPathsCoordinates: Array<Array<PoChartBarCoordinates>>;

  protected seriesGreaterLength: number;

  private minMaxSeriesValues: PoChartMinMaxValues;

  private _containerSize: PoChartContainerSize = {};
  private _options: PoChartAxisOptions;
  private _series: Array<PoBarChartSeries | PoColumnChartSeries> = [];

  @Input('p-categories') categories: Array<string>;

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.getDomainValues(this.options);
    this.calculateSeriesPathsCoordinates(this._containerSize, this.series, this.minMaxSeriesValues);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-series') set series(seriesList: Array<PoBarChartSeries | PoColumnChartSeries>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;
      this.seriesGreaterLength = this.mathsService.seriesGreaterLength(this.series);
      this.colors = this.colorService.getSeriesColor(this._series, PoChartType.Column);
      this.getDomainValues(this.options);
      this.calculateSeriesPathsCoordinates(this.containerSize, seriesDataArrayFilter, this.minMaxSeriesValues);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Input('p-options') set options(value: PoChartAxisOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;

      this.getDomainValues(this.options);
      this.calculateSeriesPathsCoordinates(this.containerSize, this._series, this.minMaxSeriesValues);
    }
  }

  get options() {
    return this._options;
  }

  @Output('p-bar-click') barClick = new EventEmitter<any>();

  @Output('p-bar-hover') barHover = new EventEmitter<any>();

  constructor(protected colorService: PoChartColorService, protected mathsService: PoChartMathsService) {}

  onSerieBarClick(selectedItem: any) {
    this.barClick.emit(selectedItem);
  }

  onSerieBarHover(selectedItem: any) {
    this.barHover.emit(selectedItem);
  }

  trackBy(index) {
    return index;
  }

  private getDomainValues(options: PoChartAxisOptions = {}): void {
    const acceptNegativeValues = false;
    this.minMaxSeriesValues = this.mathsService.calculateMinAndMaxValues(this._series, acceptNegativeValues);

    const minValue =
      !acceptNegativeValues && !options.minRange
        ? 0
        : options.minRange < this.minMaxSeriesValues.minValue
        ? options.minRange
        : this.minMaxSeriesValues.minValue;
    const maxValue =
      options.maxRange > this.minMaxSeriesValues.maxValue ? options.maxRange : this.minMaxSeriesValues.maxValue;
    const minMaxUpdatedValues = { minValue: !acceptNegativeValues && minValue < 0 ? 0 : minValue, maxValue };

    this.minMaxSeriesValues = {
      ...this.minMaxSeriesValues,
      ...minMaxUpdatedValues
    };
  }

  private calculateSeriesPathsCoordinates(
    containerSize: PoChartContainerSize,
    series: Array<PoBarChartSeries | PoColumnChartSeries>,
    minMaxSeriesValues: PoChartMinMaxValues
  ) {
    this.seriesPathsCoordinates = series.map((serie: PoBarChartSeries | PoColumnChartSeries, seriesIndex) => {
      if (Array.isArray(serie.data)) {
        let pathCoordinates: Array<PoChartBarCoordinates> = [];

        serie.data.forEach((serieValue, serieDataIndex) => {
          if (this.mathsService.verifyIfFloatOrInteger(serieValue)) {
            const coordinates = this.barCoordinates(
              seriesIndex,
              serieDataIndex,
              containerSize,
              minMaxSeriesValues,
              serieValue
            );

            const category = this.serieCategory(serieDataIndex, this.categories);
            const label = serie['label'];
            const tooltipLabel = this.serieLabel(serieValue, label);

            pathCoordinates = [...pathCoordinates, { category, label, tooltipLabel, data: serieValue, coordinates }];
          }
        });

        return pathCoordinates;
      }
    });
  }

  private serieCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  private serieLabel(serieValue: number, label: string) {
    const hasLabel = label !== null && label !== undefined && label !== '';

    return hasLabel ? `${label}: ${serieValue}` : serieValue.toString();
  }

  protected abstract barCoordinates(
    seriesIndex: number,
    serieDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  );
}
