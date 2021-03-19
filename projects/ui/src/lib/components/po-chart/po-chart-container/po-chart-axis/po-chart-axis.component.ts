import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  PoChartGridLines,
  PoChartPadding,
  PoChartPlotAreaPaddingTop
} from '../../helpers/po-chart-default-values.constant';

import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartLabelCoordinates } from '../../interfaces/po-chart-label-coordinates.interface';
import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoChartType } from '../../enums/po-chart-type.enum';

@Component({
  selector: '[po-chart-axis]',
  templateUrl: './po-chart-axis.component.svg'
})
export class PoChartAxisComponent {
  axisXCoordinates: Array<PoChartPathCoordinates>;
  axisXLabelCoordinates: Array<PoChartLabelCoordinates>;
  axisYCoordinates: Array<PoChartPathCoordinates>;
  axisYLabelCoordinates: Array<PoChartLabelCoordinates>;

  private axisXLabels: Array<string> = [];
  private axisYLabels: Array<string> = [];
  private gridLines: number = PoChartGridLines;
  private seriesLength: number = 0;

  private _axisOptions: PoChartAxisOptions;
  private _categories: Array<string> = [];
  private _containerSize: PoChartContainerSize = {};
  private _series: Array<any> = [];

  @Input('p-align-by-the-corners') alignByTheCorners: boolean = false;

  @Input('p-type') type: PoChartType;

  @Input('p-range') range: PoChartMinMaxValues;

  @Input('p-series') set series(seriesList: Array<any>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;

      this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
      this.checkAxisOptions(this.axisOptions);
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
      this.setAxisYCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
    } else {
      this._series = [];
      this.cleanUpCoordinates();
    }
  }

  get series() {
    return this._series;
  }

  @Input('p-categories') set categories(value: Array<string>) {
    this._categories = value;

    if (this.type === PoChartType.Bar) {
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
    } else {
      this.setAxisYCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
    }
  }

  get categories() {
    return this._categories;
  }

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.checkAxisOptions(this.axisOptions);
    this.setAxisXCoordinates(this.gridLines, this.seriesLength, this._containerSize, this.range, this.type);
    this.setAxisYCoordinates(this.gridLines, this.seriesLength, this._containerSize, this.range, this.type);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-options') set axisOptions(value: PoChartAxisOptions) {
    this._axisOptions = value;

    this.checkAxisOptions(this._axisOptions);

    if (this.type === PoChartType.Bar) {
      this.setAxisYCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
    } else {
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.range, this.type);
    }
  }

  get axisOptions() {
    return this._axisOptions;
  }

  @Output('p-categories-coordinates') categoriesCoordinates: EventEmitter<Array<number>> = new EventEmitter();

  constructor(private mathsService: PoChartMathsService) {}

  private setAxisXCoordinates(
    gridLines: number,
    seriesLength: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    if (seriesLength) {
      const amountOfAxisLabels = type === PoChartType.Bar ? seriesLength : gridLines;
      this.calculateAxisXLabelCoordinates(amountOfAxisLabels, containerSize, minMaxAxisValues, type);
    }

    const amountOfAxisXLines = this.amountOfAxisXLines(seriesLength, gridLines, type);
    this.calculateAxisXCoordinates(amountOfAxisXLines, containerSize, minMaxAxisValues);
  }

  private amountOfAxisXLines(seriesLength: number, gridLines: number, type: PoChartType): number {
    if (type === PoChartType.Bar) {
      return seriesLength <= 1 ? 2 : seriesLength + 1;
    }
    return gridLines === 0 ? 1 : gridLines;
  }

  private setAxisYCoordinates(
    gridLines: number,
    seriesLength: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    const amountOfAxisY = type === PoChartType.Bar ? gridLines : seriesLength;

    if (seriesLength) {
      this.calculateAxisYLabelCoordinates(amountOfAxisY, containerSize, minMaxAxisValues, type);
    }

    if (type === PoChartType.Area) {
      this.getCategoriesRangeForMouseMove(amountOfAxisY, containerSize);
    }

    this.calculateAxisYCoordinates(amountOfAxisY, containerSize, type, minMaxAxisValues);
  }

  private calculateAxisXCoordinates(
    amountOfAxisX: number,
    containerSize: PoChartContainerSize,
    range: PoChartMinMaxValues
  ) {
    const startX = containerSize.axisXLabelWidth;
    const endX = containerSize.svgWidth;

    let coordinatesReferedToZero;
    let coordinatesList = [...Array(amountOfAxisX)].map((_, index: number) => {
      const yCoordinate = this.calculateAxisXCoordinateY(amountOfAxisX, containerSize, index);
      const coordinates = `M${startX} ${yCoordinate} L${endX}, ${yCoordinate}`;

      return { coordinates };
    });

    // Avalia a necessidade de adicionar a linha referente ao valor zero em gráficos do tipo `column`, `area` e `line`.
    if (this.type !== PoChartType.Bar && range.minValue < 0 && !this.axisXLabels.includes('0')) {
      coordinatesReferedToZero = this.getCoordinatesRelatedToZero(containerSize, range, startX, endX);
      coordinatesList = [...coordinatesList, coordinatesReferedToZero];
    }

    this.axisXCoordinates = coordinatesList;
  }

  private getCoordinatesRelatedToZero(
    containerSize: PoChartContainerSize,
    range: PoChartMinMaxValues,
    start: number,
    end: number,
    isAxisY: boolean = false
  ) {
    const type = isAxisY ? PoChartType.Bar : PoChartType.Column;
    const basePosition = this.axisCoordinatesForValueZero(range, 0, containerSize, isAxisY);
    const coordinates = {
      column: {
        startX: start,
        endX: end,
        startY: basePosition,
        endY: basePosition
      },
      bar: {
        startX: basePosition,
        endX: basePosition,
        startY: start,
        endY: end
      }
    };

    return {
      coordinates: `M${coordinates[type].startX} ${coordinates[type].startY} L${coordinates[type].endX} ${coordinates[type].endY}`
    };
  }

  private axisCoordinatesForValueZero(
    range: PoChartMinMaxValues,
    data: number,
    containerSize: PoChartContainerSize,
    isAxisY: boolean
  ) {
    const { axisXLabelWidth, svgWidth, svgPlottingAreaHeight } = containerSize;
    const ratio = this.mathsService.getSeriePercentage(range, data);

    return Math.floor(
      isAxisY
        ? axisXLabelWidth + (svgWidth - axisXLabelWidth) * ratio
        : svgPlottingAreaHeight - svgPlottingAreaHeight * ratio + PoChartPlotAreaPaddingTop
    );
  }

  private calculateAxisXLabelCoordinates(
    amountOfAxisX: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    this.axisXLabels = this.getAxisXLabels(type, minMaxAxisValues, amountOfAxisX);

    this.axisXLabelCoordinates = [...Array(amountOfAxisX)].map((_, index: number) => {
      const label = this.axisXLabels[index];
      const xCoordinate = this.calculateAxisXLabelXCoordinate(containerSize.axisXLabelWidth);
      const yCoordinate = this.calculateAxisXLabelYCoordinate(amountOfAxisX, containerSize, type, index);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private calculateAxisYCoordinates(
    amountOfAxisY: number,
    containerSize: PoChartContainerSize,
    type: PoChartType,
    range: PoChartMinMaxValues
  ) {
    const startY = PoChartPlotAreaPaddingTop;
    const endY = containerSize.svgPlottingAreaHeight + PoChartPlotAreaPaddingTop;

    // tratamento necessário para criar uma linha a mais para fechar o gráfico
    const length = amountOfAxisY === 0 || type === PoChartType.Bar ? amountOfAxisY : amountOfAxisY + 1;

    let coordinatesReferedToZero;
    let coordinatesList = [...Array(length)].map((_, index: number) => {
      const xCoordinate = this.calculateAxisYCoordinateX(containerSize, amountOfAxisY, index);
      const coordinates = `M${xCoordinate} ${startY} L${xCoordinate}, ${endY}`;

      return { coordinates };
    });

    // Avalia a necessidade de adicionar a linha referente ao valor zero em gráficos do tipo `bar`.
    if (type === PoChartType.Bar && range.minValue < 0 && !this.axisYLabels.includes('0')) {
      coordinatesReferedToZero = this.getCoordinatesRelatedToZero(containerSize, range, startY, endY, true);
      coordinatesList = [...coordinatesList, coordinatesReferedToZero];
    }

    this.axisYCoordinates = [...coordinatesList];
  }

  private calculateAxisYLabelCoordinates(
    amountOfAxisY: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    this.axisYLabels = this.getAxisYLabels(type, minMaxAxisValues, amountOfAxisY);

    this.axisYLabelCoordinates = [...Array(amountOfAxisY)].map((_, index: number) => {
      const label = this.axisYLabels[index];

      const xCoordinate = this.getAxisXCoordinates(containerSize, amountOfAxisY, type, index);
      const yCoordinate = this.calculateAxisYLabelYCoordinate(containerSize);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private calculateAxisXLabelXCoordinate(axisXLabelWidth: number): number {
    const labelPoChartPadding = PoChartPadding / 3;

    return axisXLabelWidth - labelPoChartPadding;
  }

  private calculateAxisXLabelYCoordinate(
    amountOfAxisX: number,
    containerSize: PoChartContainerSize,
    type: PoChartType,
    index: number
  ): number {
    const amountOfLines = type === PoChartType.Bar ? amountOfAxisX : amountOfAxisX - 1;
    const yRatio = index / amountOfLines;

    if (type !== PoChartType.Bar) {
      return (
        containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRatio + PoChartPlotAreaPaddingTop
      );
    }

    const halfCategoryHeight = containerSize.svgPlottingAreaHeight / amountOfAxisX / 2;
    return (
      containerSize.svgPlottingAreaHeight -
      halfCategoryHeight -
      containerSize.svgPlottingAreaHeight * yRatio +
      PoChartPlotAreaPaddingTop
    );
  }

  private calculateAxisXCoordinateY(amountOfAxisX: number, containerSize: PoChartContainerSize, index: number): number {
    const yRatio = index / (amountOfAxisX - 1);

    return (
      containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRatio + PoChartPlotAreaPaddingTop
    );
  }

  private calculateAxisYLabelYCoordinate(containerSize: PoChartContainerSize): number {
    const textPoChartPadding = PoChartPadding / 3;

    return containerSize.svgHeight - textPoChartPadding;
  }

  private centeredInCategoryArea(
    containerSize: PoChartContainerSize,
    amountOfAxisY: number,
    type: PoChartType,
    index: number
  ): number {
    const amountOfLines = type === PoChartType.Bar ? amountOfAxisY - 1 : amountOfAxisY;
    const xRatio = index / amountOfLines;

    if (type === PoChartType.Bar) {
      return Math.round(
        containerSize.axisXLabelWidth + (containerSize.svgWidth - containerSize.axisXLabelWidth) * xRatio
      );
    }

    const halfCategoryWidth = (containerSize.svgWidth - containerSize.axisXLabelWidth) / amountOfAxisY / 2;
    return Math.round(
      containerSize.axisXLabelWidth +
        halfCategoryWidth +
        (containerSize.svgWidth - containerSize.axisXLabelWidth) * xRatio
    );
  }

  private calculateAxisYCoordinateX(
    containerSize: PoChartContainerSize,
    amountOfAxisY: number,
    index: number,
    subtractCategoryWidth: boolean = false
  ): number {
    const amountOfLines = this.alignByTheCorners ? amountOfAxisY - 1 : amountOfAxisY;
    const halfCategoryWidth =
      this.alignByTheCorners && subtractCategoryWidth
        ? (containerSize.svgWidth - containerSize.axisXLabelWidth) / (amountOfAxisY - 1) / 2
        : 0;
    const divideIndexByAmountOfLines = index / amountOfLines;
    const xRatio = divideIndexByAmountOfLines === Infinity ? 0 : divideIndexByAmountOfLines;

    return Math.round(
      containerSize.axisXLabelWidth +
        (containerSize.svgWidth - containerSize.axisXLabelWidth) * xRatio -
        halfCategoryWidth
    );
  }

  private checkAxisOptions(options: PoChartAxisOptions = {}): void {
    this.gridLines =
      options.gridLines && this.isValidGridLinesLengthOption(options.gridLines) ? options.gridLines : PoChartGridLines;
  }

  private cleanUpCoordinates() {
    this.axisXCoordinates = [];
    this.axisYCoordinates = [];
    this.axisXLabelCoordinates = [];
    this.axisYLabelCoordinates = [];
    this.seriesLength = 0;
  }

  private getAxisXCoordinates(
    containerSize: PoChartContainerSize,
    amountOfAxisY: number,
    type: PoChartType,
    index: number
  ): number {
    return this.alignByTheCorners
      ? this.calculateAxisYCoordinateX(containerSize, amountOfAxisY, index)
      : this.centeredInCategoryArea(containerSize, amountOfAxisY, type, index);
  }

  private getCategoriesRangeForMouseMove(amountOfAxisY: number, containerSize: PoChartContainerSize) {
    const categoriesCoordinates = [...Array(amountOfAxisY)].map((_, index: number) => {
      return this.calculateAxisYCoordinateX(containerSize, amountOfAxisY, index, true);
    });

    this.categoriesCoordinates.emit(categoriesCoordinates);
  }

  private isValidGridLinesLengthOption(gridLines: number): boolean {
    return gridLines >= 2 && gridLines <= 10;
  }

  private getAxisXLabels(type: PoChartType, minMaxAxisValues: PoChartMinMaxValues, amountOfAxisX: number) {
    if (type === PoChartType.Bar) {
      const axisXLabelsList = this.formatCategoriesLabels(amountOfAxisX, this.categories);
      return axisXLabelsList.reverse();
    }

    return this.generateAverageOfLabels(minMaxAxisValues, amountOfAxisX);
  }

  private getAxisYLabels(type: PoChartType, minMaxAxisValues: PoChartMinMaxValues, amountOfAxisX: number) {
    return type === PoChartType.Bar
      ? this.generateAverageOfLabels(minMaxAxisValues, amountOfAxisX)
      : this.formatCategoriesLabels(amountOfAxisX, this.categories);
  }

  private formatCategoriesLabels(amountOfAxisX: number, categories: Array<string> = []) {
    return [...Array(amountOfAxisX)].map((_, index: number) => {
      return categories[index] ?? '-';
    });
  }

  private generateAverageOfLabels(minMaxAxisValues: PoChartMinMaxValues, amountOfAxisLines: number) {
    const averageLabelsList = this.mathsService.range(minMaxAxisValues, amountOfAxisLines);

    return averageLabelsList.map(label => {
      const formattedDigit = label.toFixed(label % 1 && 2);
      // Remove dígitos com zero.
      // Também trata caso quando o valor retornado era -0, substituindo-o por 0.
      const removeZeroDigits = formattedDigit.replace(/\.00$/, '').replace(/\-0$/, 0);

      return removeZeroDigits.toString();
    });
  }
}
