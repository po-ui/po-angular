import { ElementRef, ViewChild, Directive } from '@angular/core';

import { Subject } from 'rxjs';

import { PoChartGaugeSerie } from './po-chart-gauge/po-chart-gauge-series.interface';
import { PoChartType } from '../enums/po-chart-type.enum';

const Padding: number = 24;

/* eslint-disable @angular-eslint/directive-class-suffix */
@Directive()
export abstract class PoChartDynamicTypeComponent {
  protected windowResizeListener: () => void;
  protected windowScrollListener: () => void;
  // eslint-disable-next-line
  protected _series: Array<PoChartGaugeSerie> = [];

  centerX: number;
  chartElementCategory: any;
  chartElementDescription: any;
  chartElementValue: any;
  chartHeader: number;
  chartLegend: number;
  chartWrapper: number;
  colors: Array<string>;
  height: number;
  innerRadius: number = 0;
  onSerieClick: Subject<PoChartGaugeSerie> = new Subject();
  onSerieHover: Subject<PoChartGaugeSerie> = new Subject();
  svgElement: HTMLObjectElement;
  svgHeight: number;
  target: HTMLInputElement & EventTarget;
  tooltipElement: HTMLObjectElement;
  tooltipText: string;
  totalValue: number;
  type: PoChartType;

  @ViewChild('chartBody', { static: true }) chartBody: ElementRef;

  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  get isChartGaugeType(): boolean {
    return this.type === PoChartType.Gauge;
  }

  calculateSVGContainerDimensions(chartWrapperElement: number, chartHeaderElement: number, chartLegendElement: number) {
    const svgContainerHeightCalc = this.height - chartHeaderElement - chartLegendElement - Padding * 2;

    this.svgHeight = svgContainerHeightCalc <= 0 ? 0 : svgContainerHeightCalc;
    this.centerX = chartWrapperElement / 2;
  }

  calculateTotalValue() {
    this.totalValue =
      this.type === PoChartType.Gauge
        ? 100
        : this.series.reduce((previousValue, serie) => previousValue + (serie.data ? serie.data : serie.value), 0);
  }

  set series(value: Array<any>) {
    this._series = this.getSeriesWithValue(value);
  }

  get series() {
    return this._series;
  }

  protected getSeriesWithValue(value) {
    return value;
  }
}
