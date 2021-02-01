import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

import { PoChartAxisXLabelArea, PoChartPlotAreaPaddingTop } from '../../helpers/po-chart-default-values.constant';

import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartPointsCoordinates } from '../../interfaces/po-chart-points-coordinates.interface';
import { ChartSerieColor } from '../po-chart-container.component';

@Component({
  selector: '[po-chart-line]',
  templateUrl: './po-chart-line.component.svg'
})
export class PoChartLineComponent {
  animate: boolean = true;
  seriesPathsCoordinates: Array<PoChartPathCoordinates>;
  seriesPointsCoordinates: Array<Array<PoChartPointsCoordinates>> = [];

  private seriesLength: number;
  private firstValidItemFromSerieArray: boolean;

  private _containerSize: PoChartContainerSize = {};
  private _range: PoChartMinMaxValues = {};
  private _series: Array<ChartSerieColor> = [];

  @Input('p-allow-negative-data') allowNegativeData;

  @Input('p-categories') categories: Array<string>;

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

  @Input('p-series') set series(seriesList: Array<ChartSerieColor>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;
      this.animate = true;
      this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
      this.seriePathPointsDefinition(this.containerSize, seriesDataArrayFilter, this.range);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Output('p-point-click') pointClick = new EventEmitter<any>();

  @Output('p-point-hover') pointHover = new EventEmitter<any>();

  @ViewChild('chartLine') chartLine: ElementRef;

  constructor(private mathsService: PoChartMathsService, private renderer: Renderer2, private elementRef: ElementRef) {}

  onSeriePointClick(selectedItem: any) {
    this.pointClick.emit(selectedItem);
  }

  onSeriePointHover(selectedItem: any) {
    const { relativeTo, ...item } = selectedItem;

    this.reorderSVGGroup(relativeTo);
    this.pointHover.emit(item);
  }

  trackBy(index) {
    return index;
  }

  private seriePathPointsDefinition(
    containerSize: PoChartContainerSize,
    series: Array<ChartSerieColor>,
    range: PoChartMinMaxValues
  ) {
    this.seriesPointsCoordinates = [];

    this.seriesPathsCoordinates = series.map((serie: ChartSerieColor) => {
      if (Array.isArray(serie.data)) {
        let pathCoordinates: string = '';
        let pointCoordinates: Array<PoChartPointsCoordinates> = [];
        this.firstValidItemFromSerieArray = true;

        serie.data.forEach((data, index) => {
          if (this.mathsService.verifyIfFloatOrInteger(data)) {
            const svgPathCommand = this.svgPathCommand();
            // TO DO: tratamento para valores negativos se combinado com gráficos do tipo `coluna`.
            const verifiedData = !this.allowNegativeData && data <= 0 ? 0 : data;
            const xCoordinate = this.xCoordinate(index, containerSize);
            const yCoordinate = this.yCoordinate(range, verifiedData, containerSize);
            const category = this.serieCategory(index, this.categories);
            const label = serie['label'];
            const tooltip = serie['tooltip'];
            const tooltipLabel = this.getTooltipLabel(verifiedData, label, tooltip);

            pointCoordinates = [
              ...pointCoordinates,
              { category, label, tooltipLabel, data: verifiedData, xCoordinate, yCoordinate }
            ];
            pathCoordinates += ` ${svgPathCommand}${xCoordinate} ${yCoordinate}`;
          }
        });
        this.seriesPointsCoordinates = [...this.seriesPointsCoordinates, pointCoordinates];

        return { coordinates: pathCoordinates, color: serie['color'] };
      }
    });
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
    const halfCategoryWidth = (containerSize.svgWidth - PoChartAxisXLabelArea) / this.seriesLength / 2;

    const divideIndexBySeriesLength = index / this.seriesLength;
    const xRatio = isNaN(divideIndexBySeriesLength) ? 0 : divideIndexBySeriesLength;

    return PoChartAxisXLabelArea + halfCategoryWidth + containerSize.svgPlottingAreaWidth * xRatio;
  }

  private serieCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  private yCoordinate(range: PoChartMinMaxValues, data: number, containerSize: PoChartContainerSize) {
    const yRratio = this.mathsService.getSeriePercentage(range, data);
    const yCoordinate =
      containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRratio + PoChartPlotAreaPaddingTop;

    return Math.floor(yCoordinate);
  }

  // É necessário reordenar os svgs on hover pois eventualmente os elemntos svg ficam por trás de outros. Não há z-index para svgElement.
  private reorderSVGGroup(pathGroup: string) {
    const pathGroupElement = this.elementRef.nativeElement.querySelectorAll(`.${pathGroup}`);

    this.animate = false;
    this.renderer.appendChild(this.chartLine.nativeElement, pathGroupElement[0]);
  }
}
