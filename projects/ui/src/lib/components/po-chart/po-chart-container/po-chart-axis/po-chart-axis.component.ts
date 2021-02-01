import { Component, Input } from '@angular/core';

import {
  PoChartAxisXLabelArea,
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

  private gridLines: number = PoChartGridLines;
  private minMaxAxisValues: PoChartMinMaxValues;
  private seriesLength: number = 0;

  private _axisOptions: PoChartAxisOptions;
  private _categories: Array<string> = [];
  private _containerSize: PoChartContainerSize = {};
  private _series: Array<any> = [];

  @Input('p-allow-negative-data') allowNegativeData: boolean;

  @Input('p-type') type: PoChartType;

  @Input('p-series') set series(seriesList: Array<any>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;

      this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
      this.minMaxAxisValues = this.mathsService.calculateMinAndMaxValues(this._series);
      this.checkAxisOptions(this.axisOptions);
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.minMaxAxisValues, this.type);
      this.setAxisYCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.minMaxAxisValues, this.type);
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
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.minMaxAxisValues, this.type);
    } else {
      this.setAxisYCoordinates(
        this.gridLines,
        this.seriesLength,
        this._containerSize,
        this.minMaxAxisValues,
        this.type
      );
    }
  }

  get categories() {
    return this._categories;
  }

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.checkAxisOptions(this.axisOptions);
    this.setAxisXCoordinates(this.gridLines, this.seriesLength, this._containerSize, this.minMaxAxisValues, this.type);
    this.setAxisYCoordinates(this.gridLines, this.seriesLength, this._containerSize, this.minMaxAxisValues, this.type);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-options') set axisOptions(value: PoChartAxisOptions) {
    this._axisOptions = value;

    this.checkAxisOptions(this._axisOptions);

    if (this.type === PoChartType.Bar) {
      this.setAxisYCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.minMaxAxisValues, this.type);
    } else {
      this.setAxisXCoordinates(this.gridLines, this.seriesLength, this.containerSize, this.minMaxAxisValues, this.type);
    }
  }

  get axisOptions() {
    return this._axisOptions;
  }

  constructor(private mathsService: PoChartMathsService) {}

  private setAxisXCoordinates(
    gridLines: number,
    seriesLength: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    const amountOfAxisXLines = this.amountOfAxisXLines(seriesLength, gridLines, type);
    this.calculateAxisXCoordinates(amountOfAxisXLines, containerSize);

    if (seriesLength) {
      const amountOfAxisLabels = type === PoChartType.Bar ? seriesLength : gridLines;
      this.calculateAxisXLabelCoordinates(amountOfAxisLabels, containerSize, minMaxAxisValues, type);
    }
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

    this.calculateAxisYCoordinates(amountOfAxisY, containerSize, type);

    if (seriesLength) {
      this.calculateAxisYLabelCoordinates(amountOfAxisY, containerSize, minMaxAxisValues, type);
    }
  }

  private calculateAxisXCoordinates(amountOfAxisX: number, containerSize: PoChartContainerSize) {
    this.axisXCoordinates = [...Array(amountOfAxisX)].map((_, index: number) => {
      const startX = PoChartAxisXLabelArea;
      const endX = containerSize.svgWidth;
      const yCoordinate = this.calculateAxisXCoordinateY(amountOfAxisX, containerSize, index);

      const coordinates = `M${startX} ${yCoordinate} L${endX}, ${yCoordinate}`;

      return { coordinates };
    });
  }

  private calculateAxisXLabelCoordinates(
    amountOfAxisX: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    const axisXLabels = this.getAxisXLabels(type, minMaxAxisValues, amountOfAxisX);

    this.axisXLabelCoordinates = [...Array(amountOfAxisX)].map((_, index: number) => {
      const label = axisXLabels[index];
      const xCoordinate = this.calculateAxisXLabelXCoordinate();
      const yCoordinate = this.calculateAxisXLabelYCoordinate(amountOfAxisX, containerSize, type, index);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private calculateAxisYCoordinates(amountOfAxisY: number, containerSize: PoChartContainerSize, type: PoChartType) {
    this.categoriesDefinedByAreas(containerSize, amountOfAxisY, type);
  }

  private categoriesDefinedByAreas(containerSize: PoChartContainerSize, amountOfAxisY: number, type: PoChartType) {
    const startY = PoChartPlotAreaPaddingTop;
    const endY = containerSize.svgPlottingAreaHeight + PoChartPlotAreaPaddingTop;

    // tratamento necessário para criar uma linha a mais para fechar o gráfico
    const length = amountOfAxisY === 0 || type === PoChartType.Bar ? amountOfAxisY : amountOfAxisY + 1;

    const innerYCoordinates = [...Array(length)].map((_, index: number) => {
      const xCoordinate = this.calculateAxisYCoordinateX(containerSize, amountOfAxisY, type, index);

      const coordinates = `M${xCoordinate} ${startY} L${xCoordinate}, ${endY}`;

      return { coordinates };
    });

    this.axisYCoordinates = [...innerYCoordinates];
  }

  private calculateAxisYLabelCoordinates(
    amountOfAxisY: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues,
    type: PoChartType
  ) {
    const axisYLabels = this.getAxisYLabels(type, minMaxAxisValues, amountOfAxisY);

    this.axisYLabelCoordinates = [...Array(amountOfAxisY)].map((_, index: number) => {
      const label = axisYLabels[index];

      const xCoordinate = this.centeredInCategoryArea(containerSize, amountOfAxisY, type, index);
      const yCoordinate = this.calculateAxisYLabelYCoordinate(containerSize);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private calculateAxisXLabelXCoordinate(): number {
    const labelPoChartPadding = PoChartPadding / 3;

    return PoChartAxisXLabelArea - labelPoChartPadding;
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
      return Math.round(PoChartAxisXLabelArea + (containerSize.svgWidth - PoChartAxisXLabelArea) * xRatio);
    }

    const halfCategoryWidth = (containerSize.svgWidth - PoChartAxisXLabelArea) / amountOfAxisY / 2;
    return Math.round(
      PoChartAxisXLabelArea + halfCategoryWidth + (containerSize.svgWidth - PoChartAxisXLabelArea) * xRatio
    );
  }

  private calculateAxisYCoordinateX(
    containerSize: PoChartContainerSize,
    amountOfAxisY: number,
    type: PoChartType,
    index: number
  ): number {
    const amountOfLines = type === PoChartType.Bar ? amountOfAxisY - 1 : amountOfAxisY;
    const divideIndexByAmountOfLines = index / amountOfLines;
    const xRatio = divideIndexByAmountOfLines === Infinity ? 0 : divideIndexByAmountOfLines;

    return Math.round(PoChartAxisXLabelArea + (containerSize.svgWidth - PoChartAxisXLabelArea) * xRatio);
  }

  private checkAxisOptions(options: PoChartAxisOptions = {}): void {
    const minMaxSeriesValues = this.mathsService.calculateMinAndMaxValues(this.series, this.allowNegativeData);

    this.minMaxAxisValues = this.checksMinAndMaxValues(options, minMaxSeriesValues);

    this.gridLines =
      options.gridLines && this.isValidGridLinesLengthOption(options.gridLines) ? options.gridLines : PoChartGridLines;
  }

  private checksMinAndMaxValues(
    options: PoChartAxisOptions,
    minMaxSeriesValues: PoChartMinMaxValues
  ): PoChartMinMaxValues {
    let min = options.minRange < minMaxSeriesValues.minValue ? options.minRange : minMaxSeriesValues.minValue;
    const max = options.maxRange > minMaxSeriesValues.maxValue ? options.maxRange : minMaxSeriesValues.maxValue;
    const isNegative = min < 0;

    if (!this.allowNegativeData) {
      min = !options.minRange || isNegative ? 0 : min;
    }

    const minMaxUpdatedValues = {
      minValue: min,
      maxValue: max
    };

    return {
      ...minMaxSeriesValues,
      ...minMaxUpdatedValues
    };
  }

  private cleanUpCoordinates() {
    this.axisXCoordinates = [];
    this.axisYCoordinates = [];
    this.axisXLabelCoordinates = [];
    this.axisYLabelCoordinates = [];
    this.seriesLength = 0;
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
      const removeZeroDigits = formattedDigit.replace(/\.00$/, '');

      return removeZeroDigits.toString();
    });
  }
}
