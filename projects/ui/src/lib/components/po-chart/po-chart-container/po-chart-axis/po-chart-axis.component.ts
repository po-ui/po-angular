import { Component, Input } from '@angular/core';

import {
  PoChartAxisXLabelArea,
  PoChartAxisXGridLines,
  PoChartPadding,
  PoChartPlotAreaPaddingTop
} from '../../helpers/po-chart-default-values.constant';

import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartAxisLabelCoordinates } from '../../interfaces/po-chart-axis-label-coordinates.interface';
import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';

@Component({
  selector: '[po-chart-axis]',
  templateUrl: './po-chart-axis.component.svg'
})
export class PoChartAxisComponent {
  axisXCoordinates: Array<PoChartPathCoordinates>;
  axisXLabelCoordinates: Array<PoChartAxisLabelCoordinates>;
  axisYCoordinates: Array<PoChartPathCoordinates>;
  axisYLabelCoordinates: Array<PoChartAxisLabelCoordinates>;

  private axisXGridLines: number = PoChartAxisXGridLines;
  private minMaxAxisValues: PoChartMinMaxValues;
  private seriesLength: number = 0;

  private _axisOptions: PoChartAxisOptions;
  private _categories: Array<string> = [];
  private _containerSize: PoChartContainerSize = {};
  private _series: Array<any> = [];

  @Input('p-series') set series(seriesList: Array<any>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;

      this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
      this.minMaxAxisValues = this.mathsService.calculateMinAndMaxValues(this._series);
      this.checkAxisOptions(this.axisOptions);
      this.setAxisYCoordinates(this.containerSize, this.seriesLength);
      this.setAxisYLabelCoordinates(this.containerSize, this.seriesLength, this.categories);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Input('p-categories') set categories(value: Array<string>) {
    this._categories = value;

    this.setAxisYCoordinates(this.containerSize, this.seriesLength);
    this.setAxisYLabelCoordinates(this.containerSize, this.seriesLength, this._categories);
  }

  get categories() {
    return this._categories;
  }

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.checkAxisOptions(this.axisOptions);
    this.setAxisXCoordinates(this.axisXGridLines, this._containerSize);
    this.setAxisXLabelCoordinates(this.axisXGridLines, this._containerSize, this.minMaxAxisValues);
    this.setAxisYCoordinates(this._containerSize, this.seriesLength);
    this.setAxisYLabelCoordinates(this._containerSize, this.seriesLength, this._categories);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-options') set axisOptions(value: PoChartAxisOptions) {
    this._axisOptions = value;

    this.checkAxisOptions(this._axisOptions);
    this.setAxisXLabelCoordinates(this.axisXGridLines, this.containerSize, this.minMaxAxisValues);
  }

  get axisOptions() {
    return this._axisOptions;
  }

  constructor(private mathsService: PoChartMathsService) {}

  private setAxisXCoordinates(axisXGridLines: number, containerSize: PoChartContainerSize) {
    this.axisXCoordinates = [...Array(axisXGridLines)].map((_, index: number) => {
      const startX = PoChartAxisXLabelArea;
      const endX = containerSize.svgWidth;
      const yCoordinate = this.calculateAxisXCoordinateY(axisXGridLines, containerSize, index);

      const coordinates = `M${startX} ${yCoordinate} L${endX}, ${yCoordinate}`;

      return { coordinates };
    });
  }

  private setAxisXLabelCoordinates(
    axisXGridLines: number,
    containerSize: PoChartContainerSize,
    minMaxAxisValues: PoChartMinMaxValues
  ) {
    const labels = this.mathsService.range(minMaxAxisValues, axisXGridLines);

    this.axisXLabelCoordinates = labels.map((labelItem, index: number) => {
      const label = this.formatLabel(labelItem);
      const xCoordinate = this.calculateAxisXLabelXCoordinate();
      const yCoordinate = this.calculateAxisXCoordinateY(axisXGridLines, containerSize, index);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private formatLabel(labelItem: number) {
    const formattedDigit = labelItem.toFixed(labelItem % 1 && 2);
    const removeZeroDigits = formattedDigit.replace(/\.00$/, '');

    return removeZeroDigits.toString();
  }

  private setAxisYCoordinates(containerSize: PoChartContainerSize, seriesLength: number) {
    const startY = PoChartPlotAreaPaddingTop;
    const endY = containerSize.svgPlottingAreaHeight + PoChartPlotAreaPaddingTop;

    const outerYCoordinates = this.setAxisYOuterCoordinates(startY, endY, containerSize);

    const innerYCoordinates = [...Array(seriesLength)].map((_, index: number) => {
      const xCoordinate = this.calculateAxisYCoordinateX(containerSize, index);

      const coordinates = `M${xCoordinate} ${startY} L${xCoordinate}, ${endY}`;

      return { coordinates };
    });

    this.axisYCoordinates = [...outerYCoordinates, ...innerYCoordinates];
  }

  private setAxisYOuterCoordinates(startY: number, endY: number, containerSize: PoChartContainerSize) {
    const firstLineCoordinates = {
      coordinates: `M${PoChartAxisXLabelArea} ${startY} L${PoChartAxisXLabelArea} ${endY}`
    };
    const lastLineCoordinates = {
      coordinates: `M${containerSize.svgWidth} ${startY} L${containerSize.svgWidth} ${endY}`
    };

    return [firstLineCoordinates, lastLineCoordinates];
  }

  private setAxisYLabelCoordinates(
    containerSize: PoChartContainerSize,
    seriesLength: number,
    categories: Array<string> = []
  ) {
    this.axisYLabelCoordinates = [...Array(seriesLength)].map((_, index: number) => {
      const label = categories[index] ?? '-';

      const xCoordinate = this.calculateAxisYCoordinateX(containerSize, index);
      const yCoordinate = this.calculateAxisYLabelYCoordinate(containerSize);

      return { label, xCoordinate, yCoordinate };
    });
  }

  private calculateAxisXLabelXCoordinate(): number {
    const labelPoChartPadding = PoChartPadding / 3;

    return PoChartAxisXLabelArea - labelPoChartPadding;
  }

  private calculateAxisXCoordinateY(
    axisXGridLines: number,
    containerSize: PoChartContainerSize,
    index: number
  ): number {
    const yRatio = index / (axisXGridLines - 1);

    return (
      containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRatio + PoChartPlotAreaPaddingTop
    );
  }

  private calculateAxisYLabelYCoordinate(containerSize: PoChartContainerSize): number {
    const textPoChartPadding = PoChartPadding / 3;

    return containerSize.svgHeight - textPoChartPadding;
  }

  private calculateAxisYCoordinateX(containerSize: PoChartContainerSize, index: number): number {
    const divideIndexBySeriesLength = index / (this.seriesLength - 1);
    const xRatio = isNaN(divideIndexBySeriesLength) ? 0 : divideIndexBySeriesLength;
    const svgAxisSideSpacing = this.mathsService.calculateSideSpacing(containerSize.svgWidth, this.seriesLength);

    return PoChartAxisXLabelArea + svgAxisSideSpacing + containerSize.svgPlottingAreaWidth * xRatio;
  }

  private checkAxisOptions(options: PoChartAxisOptions = {}): void {
    this.minMaxAxisValues = this.mathsService.calculateMinAndMaxValues(this.series);
    const minValue =
      options.minRange < this.minMaxAxisValues.minValue ? options.minRange : this.minMaxAxisValues.minValue;
    const maxValue =
      options.maxRange > this.minMaxAxisValues.maxValue ? options.maxRange : this.minMaxAxisValues.maxValue;
    const minMaxUpdatedValues = { minValue, maxValue };

    this.minMaxAxisValues = {
      ...this.minMaxAxisValues,
      ...minMaxUpdatedValues
    };

    this.axisXGridLines =
      options.axisXGridLines && this.isValidGridLinesLengthOption(options.axisXGridLines)
        ? options.axisXGridLines
        : PoChartAxisXGridLines;

    this.setAxisXGridLines();
  }

  private isValidGridLinesLengthOption(axisXGridLines: number): boolean {
    return axisXGridLines >= 2 && axisXGridLines <= 10;
  }

  private setAxisXGridLines() {
    this.setAxisXCoordinates(this.axisXGridLines, this.containerSize);
    this.setAxisXLabelCoordinates(this.axisXGridLines, this.containerSize, this.minMaxAxisValues);
  }
}
