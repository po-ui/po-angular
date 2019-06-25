import { ElementRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { PoPieChartSeries } from '../interfaces/po-chart-series.interface';

const Padding: number = 24;

export abstract class PoChartDynamicTypeComponent {

  protected windowResizeListener: () => void;
  protected windowScrollListener: () => void;

  centerX: number;
  chartElementCategory: any;
  chartElementValue: any;
  chartHeader: number;
  chartLegend: number;
  chartWrapper: number;
  colors: Array<string>;
  height: number;
  onSerieClick: Subject<PoPieChartSeries> = new Subject();
  onSerieHover: Subject<PoPieChartSeries> = new Subject();
  series: Array<any> = [];
  svgElement: HTMLObjectElement;
  svgHeight: number;
  target: HTMLInputElement & EventTarget;
  tooltipElement: HTMLObjectElement;
  tooltipText: string;
  totalValue: number;

  @ViewChild('chartBody', { static: true }) chartBody: ElementRef;

  @ViewChild('svgContainer', { static: true }) svgContainer: ElementRef;

  calculateSVGContainerDimensions(chartWrapperElement: number, chartHeaderElement: number, chartLegendElement: number) {
    const svgContainerHeightCalc = this.height - chartHeaderElement - chartLegendElement - (Padding * 2);

    this.svgHeight = svgContainerHeightCalc <= 0 ? 0 : svgContainerHeightCalc;
    this.centerX = chartWrapperElement / 2;
  }

  calculateTotalValue() {
    this.totalValue = this.series.reduce(
      (previousValue, serie) => previousValue + serie.value, 0);
  }

}
