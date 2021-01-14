import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  DoCheck,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  OnInit
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartColorService } from './services/po-chart-color.service';
import { PoChartSvgContainerService } from './services/po-chart-svg-container.service';
import { PoChartDynamicTypeComponent } from './po-chart-types/po-chart-dynamic-type.component';
import { PoChartGaugeComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge.component';
import { PoChartType } from './enums/po-chart-type.enum';
import { PoChartContainerSize } from './interfaces/po-chart-container-size.interface';
import { debounceTime } from 'rxjs/operators';

/**
 * @docsExtends PoChartBaseComponent
 *
 * @example
 *
 * <example name="po-chart-basic" title="PO Chart Basic">
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.html"> </file>
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-labs" title="PO Chart Labs">
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.html"> </file>
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-coffee-ranking" title="PO Chart - Coffee Ranking">
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.html"> </file>
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-chart',
  templateUrl: './po-chart.component.html'
})
export class PoChartComponent extends PoChartBaseComponent implements AfterViewInit, DoCheck, OnDestroy, OnInit {
  private calculatedComponentRefElement: boolean = false;
  private calculatedSvgContainerElement: boolean = false;
  private colors: Array<string> = [];
  private componentRef: ComponentRef<{}>;
  private initialized: boolean = false;
  private windowResizeListener: Subject<any> = new Subject();
  private subscription = new Subscription();

  private mappings = {
    [PoChartType.Gauge]: PoChartGaugeComponent
  };

  svgContainerSize: PoChartContainerSize;

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true }) chartContainer: ViewContainerRef;

  @ViewChild('chartHeader', { static: true }) chartHeader: ElementRef;

  @ViewChild('chartLegend', { read: ElementRef }) chartLegend: ElementRef;

  @ViewChild('chartWrapper', { static: true }) chartWrapper: ElementRef;

  constructor(
    public changeDetector: ChangeDetectorRef,
    private colorService: PoChartColorService,
    private containerService: PoChartSvgContainerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private elementRef: ElementRef
  ) {
    super();
  }

  get isChartGaugeType(): boolean {
    return this.type === PoChartType.Gauge;
  }

  @HostListener('window:resize')
  onResize = () => {
    this.getSvgContainerSize();
    this.windowResizeListener.next();
  };

  ngAfterViewInit() {
    this.initialized = true;
    this.getSvgContainerSize();
  }

  ngDoCheck() {
    const charWrapperWidth = this.chartWrapper.nativeElement.offsetWidth;
    const isDynamicChart = this.getComponentType(this.type);

    // Permite que o chart seja calculado na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    // Quando modificada a estrutura dos gráficos do tipo circular isto será melhorado.
    if (charWrapperWidth && this.initialized) {
      if (!isDynamicChart && !this.calculatedSvgContainerElement) {
        this.getSvgContainerSize();
        this.calculatedSvgContainerElement = true;
      } else if (isDynamicChart && !this.calculatedComponentRefElement) {
        this.dynamicComponentSetting();
        this.calculatedComponentRefElement = true;
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.removeWindowResizeListener();
  }

  resizeAction() {
    this.getSvgContainerSize();
    this.windowResizeListener.next();
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.getSvgContainerSize();
  }

  rebuildComponentRef() {
    if (this.componentRef) {
      this.componentRef.destroy();

      if (this.isChartGaugeType) {
        this.dynamicComponentSetting();
      }
    }
  }

  protected getSvgContainerSize() {
    const { chartHeaderHeight, chartLegendHeight, chartWrapperWidth } = this.getChartMeasurements();

    this.svgContainerSize = this.containerService.calculateSVGContainerMeasurements(
      this.height,
      chartWrapperWidth,
      chartHeaderHeight,
      chartLegendHeight,
      this.categories?.length
    );
  }

  private chartLegendHeight(chartLegend: ElementRef) {
    return chartLegend ? chartLegend.nativeElement.offsetHeight : 0;
  }

  private createComponent() {
    const componentType = this.getComponentType(this.type);
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    this.componentRef = this.chartContainer.createComponent(factory);

    const instance = <PoChartDynamicTypeComponent>this.componentRef.instance;

    this.setComponentRefProperties(instance);

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

  private getChartMeasurements() {
    const chartWrapperWidth = this.chartWrapper.nativeElement.offsetWidth;
    const chartHeaderHeight = this.chartHeader.nativeElement.offsetHeight;
    const chartLegendHeight = this.chartLegendHeight(this.chartLegend);

    return { chartWrapperWidth, chartHeaderHeight, chartLegendHeight };
  }

  private removeWindowResizeListener() {
    if (this.onResize) {
      this.onResize = () => {};
    }
  }

  private setComponentRefProperties(instance: PoChartDynamicTypeComponent) {
    const { chartHeaderHeight, chartLegendHeight, chartWrapperWidth } = this.getChartMeasurements();

    this.colors = this.colorService.getSeriesColor(this.chartSeries, this.type);

    instance.chartHeader = chartHeaderHeight;
    instance.chartLegend = chartLegendHeight;
    instance.chartWrapper = chartWrapperWidth;
    instance.colors = Array.isArray(this.colors) ? [...this.colors] : [];
    instance.height = this.height;
    instance.type = this.type;
    instance.series = this.chartSeries || [];
  }

  private setClickSubscribe(instance: PoChartDynamicTypeComponent) {
    this.subscription.add(
      instance.onSerieClick.subscribe(event => {
        this.onSeriesClick(event);
      })
    );
  }

  private setHoverSubscribe(instance: PoChartDynamicTypeComponent) {
    this.subscription.add(
      instance.onSerieHover.subscribe(event => {
        this.onSeriesHover(event);
      })
    );
  }

  private setResizeListenerSubscribe(instance: PoChartDynamicTypeComponent) {
    this.subscription.add(
      this.windowResizeListener.subscribe(() => {
        const measuresForComponentRef = this.getChartMeasurements();

        instance.chartWrapper = measuresForComponentRef.chartWrapperWidth;
        instance.chartHeader = measuresForComponentRef.chartHeaderHeight;
        instance.chartLegend = measuresForComponentRef.chartLegendHeight;
      })
    );
  }
}
