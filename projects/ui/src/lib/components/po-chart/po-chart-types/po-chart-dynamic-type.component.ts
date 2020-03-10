import { ElementRef, ViewChild, Directive } from '@angular/core';

import { Subject } from 'rxjs';

import { PoChartGaugeSerie } from './po-chart-gauge/po-chart-gauge-series.interface';
import { PoChartType } from '../enums/po-chart-type.enum';
import { PoDonutChartSeries } from './po-chart-donut/po-chart-donut-series.interface';
import { PoPieChartSeries } from './po-chart-pie/po-chart-pie-series.interface';

const Padding: number = 24;

@Directive()
export abstract class PoChartDynamicTypeComponent {
  protected windowResizeListener: () => void;
  protected windowScrollListener: () => void;

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
  onSerieClick: Subject<PoDonutChartSeries | PoPieChartSeries | PoChartGaugeSerie> = new Subject();
  onSerieHover: Subject<PoDonutChartSeries | PoPieChartSeries | PoChartGaugeSerie> = new Subject();
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
        : this.series.reduce((previousValue, serie) => previousValue + serie.value, 0);
  }
}
