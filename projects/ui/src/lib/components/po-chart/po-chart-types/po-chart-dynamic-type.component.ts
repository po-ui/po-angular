import { ElementRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoDonutChartSeries } from './po-chart-donut/po-chart-donut-series.interface';
import { PoPieChartSeries } from './po-chart-pie/po-chart-pie-series.interface';

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
  innerRadius: number = 0;
  onSerieClick: Subject<PoDonutChartSeries | PoPieChartSeries> = new Subject();
  onSerieHover: Subject<PoDonutChartSeries | PoPieChartSeries> = new Subject();
  series: Array<any> = [];
  svgElement: HTMLObjectElement;
  svgHeight: number;
  target: HTMLInputElement & EventTarget;
  tooltipElement: HTMLObjectElement;
  tooltipText: string;
  totalValue: number;
  type: PoChartType;

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
