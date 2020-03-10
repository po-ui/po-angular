import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  DoCheck,
  ElementRef,
  HostListener,
  IterableDiffers,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { Subject } from 'rxjs';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartColors } from './po-chart-colors.constant';
import { PoChartDonutComponent } from './po-chart-types/po-chart-donut/po-chart-donut.component';
import { PoChartDynamicTypeComponent } from './po-chart-types/po-chart-dynamic-type.component';
import { PoChartGaugeComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge.component';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';
import { PoChartType } from './enums/po-chart-type.enum';

/**
 * @docsExtends PoChartBaseComponent
 *
 * @example
 *
 * <example name="po-chart-basic" title="Portinari Chart Basic">
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.html"> </file>
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-labs" title="Portinari Chart Labs">
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.html"> </file>
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-coffee-ranking" title="Portinari Chart - Coffee Ranking">
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.html"> </file>
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-chart',
  templateUrl: './po-chart.component.html'
})
export class PoChartComponent extends PoChartBaseComponent implements AfterViewInit, DoCheck, OnDestroy, OnInit {
  private calculatedElement: boolean = false;
  private componentRef: ComponentRef<{}>;
  private differ: any;
  private initialized: boolean = false;
  private windowResizeListener: Subject<any> = new Subject();

  private mappings = {
    [PoChartType.Donut]: PoChartDonutComponent,
    [PoChartType.Gauge]: PoChartGaugeComponent,
    [PoChartType.Pie]: PoChartPieComponent
  };

  colors: Array<string> = [];

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  chartContainer: ViewContainerRef;

  @ViewChild('chartHeader', { static: true }) chartHeader: ElementRef;

  @ViewChild('chartLegend', { read: ElementRef }) chartLegend: ElementRef;

  @ViewChild('chartWrapper', { static: true }) chartWrapper: ElementRef;

  @HostListener('window:resize')
  onResize = () => this.windowResizeListener.next();

  constructor(
    public changeDetector: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private differs: IterableDiffers
  ) {
    super();

    this.differ = this.differs.find([]).create(null);
  }

  get isChartGaugeType(): boolean {
    return this.type === PoChartType.Gauge;
  }

  ngAfterViewInit() {
    this.initialized = true;
  }

  ngDoCheck() {
    const charWrapperWidth = this.chartWrapper.nativeElement.offsetWidth;

    // Permite que o chart seja calculado na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (charWrapperWidth && !this.calculatedElement && this.initialized) {
      this.calculatedElement = true;
      this.getSeriesColor();
      this.dynamicComponentSetting();
    }

    this.checkingForSerieChanges();
  }

  ngOnDestroy() {
    this.removeWindowResizeListener();
  }

  ngOnInit() {
    this.getSeriesColor();
  }

  rebuildComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.getSeriesColor();
      this.dynamicComponentSetting();
    }
  }

  private chartLegendHeight(chartLegend: ElementRef) {
    return chartLegend ? chartLegend.nativeElement.offsetHeight : 0;
  }

  private checkingForSerieChanges() {
    if (this.componentRef && this.differ) {
      const changeSeries = this.differ.diff(this.chartSeries);
      if (changeSeries) {
        this.getSeriesColor();
        this.rebuildComponent();
      }
    }
  }

  private createComponent() {
    const componentType = this.getComponentType(this.type);
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    this.componentRef = this.chartContainer.createComponent(factory);

    const instance = <PoChartDynamicTypeComponent>this.componentRef.instance;

    this.setChartProperties(instance);

    return instance;
  }

  private dynamicComponentSetting() {
    const instance = this.createComponent();

    this.setResizeListenerSubscribe(instance);
    this.changeDetector.detectChanges();
    this.setClickSubscribe(instance);
    this.setHoverSubscribe(instance);
  }

  private getComponentType(typeName) {
    return this.mappings[typeName];
  }

  private getSeriesColor() {
    const colorsLength = PoChartColors.length - 1;

    if (!this.chartSeries) {
      return (this.colors = PoChartColors[colorsLength]);
    }
    if (this.type === PoChartType.Gauge) {
      return (this.colors = PoChartColors[0]);
    }

    const seriesLength = this.chartSeries.length - 1;

    if (seriesLength > colorsLength) {
      let colors = PoChartColors[colorsLength];

      // recupera o resultado da divisao entre tamanho das series e o numero de cores disponiveis
      const quantityDuplicates = seriesLength / colorsLength;

      for (let i = 1; i <= quantityDuplicates; i++) {
        colors = colors.concat(PoChartColors[colorsLength]);
      }

      return (this.colors = colors);
    }

    return (this.colors = PoChartColors[seriesLength]);
  }

  private removeWindowResizeListener() {
    if (this.onResize) {
      this.onResize = () => {};
    }
  }

  private setChartProperties(instance: PoChartDynamicTypeComponent) {
    instance.chartHeader = this.chartHeader.nativeElement.offsetHeight;
    instance.chartLegend = this.chartLegendHeight(this.chartLegend);
    instance.chartWrapper = this.chartWrapper.nativeElement.offsetWidth;
    instance.colors = Array.isArray(this.colors) ? [...this.colors] : [];
    instance.height = this.height;
    instance.type = this.type;
    instance.series = this.chartSeries || [];
  }

  private setClickSubscribe(instance: PoChartDynamicTypeComponent) {
    instance.onSerieClick.subscribe(event => {
      this.onSeriesClick(event);
    });
  }

  private setHoverSubscribe(instance: PoChartDynamicTypeComponent) {
    instance.onSerieHover.subscribe(event => {
      this.onSeriesHover(event);
    });
  }

  private setResizeListenerSubscribe(instance: PoChartDynamicTypeComponent) {
    this.windowResizeListener.subscribe(() => {
      instance.chartHeader = this.chartHeader.nativeElement.offsetHeight;
      instance.chartLegend = this.chartLegendHeight(this.chartLegend);
      instance.chartWrapper = this.chartWrapper.nativeElement.offsetWidth;
    });
  }
}
