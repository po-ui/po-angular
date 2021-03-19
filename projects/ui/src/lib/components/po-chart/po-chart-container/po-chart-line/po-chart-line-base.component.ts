import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoChartPlotAreaPaddingTop } from '../../helpers/po-chart-default-values.constant';

import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartPointsCoordinates } from '../../interfaces/po-chart-points-coordinates.interface';
import { PoChartSerie } from '../../interfaces/po-chart-serie.interface';

@Directive()
export abstract class PoChartLineBaseComponent {
  private _containerSize: PoChartContainerSize = {};
  private _range: PoChartMinMaxValues = {};
  private _series: Array<PoChartSerie> = [];

  activeTooltip: boolean;
  animate: boolean = true;
  chartType: PoChartType;
  seriesPathsCoordinates: Array<PoChartPathCoordinates>;
  seriesPointsCoordinates: Array<Array<PoChartPointsCoordinates>> = [];

  protected firstValidItemFromSerieArray: boolean;
  protected seriesLength: number;

  @Input('p-align-by-the-corners') alignByTheCorners: boolean = false;

  @Input('p-categories') categories: Array<string>;

  @Input('p-categories-coordinates') categoriesCoordinates: Array<number>;

  @Input('p-range') set range(value: PoChartMinMaxValues) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._range = value;

      this.seriePathPointsDefinition(this.containerSize, this._series, this._range);
    }
  }

  get range() {
    return this._range;
  }

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.seriePathPointsDefinition(this._containerSize, this.series, this.range);
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
      this.animate = true;
      this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
      this.chartType = this._series[0].type;
      this.seriePathPointsDefinition(this.containerSize, seriesDataArrayFilter, this.range);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Input('p-svg-space') svgSpace;

  @Output('p-point-click') pointClick = new EventEmitter<any>();

  @Output('p-point-hover') pointHover = new EventEmitter<any>();

  @ViewChild('chartLine') chartLine: ElementRef;

  constructor(
    protected mathsService: PoChartMathsService,
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {}

  onSeriePointClick(selectedItem: any) {
    this.pointClick.emit(selectedItem);
  }

  trackBy(index) {
    return index;
  }

  private getTooltipLabel(data: number, label: string, tooltipLabel: string) {
    const dataLabel = label ? `${label}: ` : '';
    const dataValue = data.toString();

    return tooltipLabel || `${dataLabel}${dataValue}`;
  }

  private svgPathCommand() {
    const command = this.firstValidItemFromSerieArray ? 'M' : 'L';
    // firstValidItemFromSerieArray: tratamento para permitir ao usuário definir o primeiro valor como null para que seja ignorado;
    this.firstValidItemFromSerieArray = false;

    return command;
  }

  private xCoordinate(index: number, containerSize: PoChartContainerSize) {
    const halfCategoryWidth = !this.alignByTheCorners
      ? (containerSize.svgWidth - containerSize.axisXLabelWidth) / this.seriesLength / 2
      : 0;

    const divideIndexBySeriesLength = index / (this.alignByTheCorners ? this.seriesLength - 1 : this.seriesLength);
    const xRatio = isNaN(divideIndexBySeriesLength) ? 0 : divideIndexBySeriesLength;

    return Math.floor(
      containerSize.axisXLabelWidth +
        halfCategoryWidth +
        (containerSize.svgWidth - containerSize.axisXLabelWidth) * xRatio
    );
  }

  private serieCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  private seriePathPointsDefinition(
    containerSize: PoChartContainerSize,
    series: Array<PoChartSerie>,
    range: PoChartMinMaxValues
  ) {
    this.seriesPointsCoordinates = [];

    this.seriesPathsCoordinates = series.map((serie: PoChartSerie) => {
      if (Array.isArray(serie.data)) {
        let pathCoordinates: string = '';
        let pointCoordinates: Array<PoChartPointsCoordinates> = [];
        const color = serie.color;
        this.firstValidItemFromSerieArray = true;

        serie.data.forEach((data, index) => {
          if (this.mathsService.verifyIfFloatOrInteger(data)) {
            const svgPathCommand = this.svgPathCommand();
            const xCoordinate = this.xCoordinate(index, containerSize);
            const yCoordinate = this.yCoordinate(range, data, containerSize);
            const category = this.serieCategory(index, this.categories);
            const label = serie.label;
            const tooltip = serie.tooltip;
            const tooltipLabel = this.getTooltipLabel(data, label, tooltip);
            const isActive = this.chartType === PoChartType.Line;
            pointCoordinates = [
              ...pointCoordinates,
              { category, label, tooltipLabel, data: data, xCoordinate, yCoordinate, color, isActive }
            ];
            pathCoordinates += ` ${svgPathCommand}${xCoordinate} ${yCoordinate}`;
          }
        });

        pathCoordinates = this.verifyIfClosePath(pathCoordinates, serie.data.length - 1, range, 0, containerSize);

        this.seriesPointsCoordinates = [...this.seriesPointsCoordinates, pointCoordinates];

        return { coordinates: pathCoordinates, color, isActive: true };
      }
    });
  }

  private verifyIfClosePath(pathCoordinates, lastIndex, range, data, containerSize) {
    const { axisXLabelWidth, svgWidth } = containerSize;

    if (this.chartType === PoChartType.Area) {
      const xLastPosition = this.xCoordinate(lastIndex, containerSize);
      const baseYCoordinate = this.yCoordinate(range, data, containerSize);
      const xInitialPosition = Math.floor(
        this.alignByTheCorners
          ? axisXLabelWidth
          : axisXLabelWidth + (svgWidth - axisXLabelWidth) / this.seriesLength / 2
      );

      return `${pathCoordinates} ${xLastPosition} ${baseYCoordinate} L${xInitialPosition} ${baseYCoordinate} Z`;
    }

    return pathCoordinates;
  }

  private yCoordinate(range: PoChartMinMaxValues, data: number, containerSize: PoChartContainerSize) {
    const yRratio = this.mathsService.getSeriePercentage(range, data);
    const yCoordinate =
      containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRratio + PoChartPlotAreaPaddingTop;

    return Math.floor(yCoordinate);
  }
}
