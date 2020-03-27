import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  NgZone,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { PoChartCircular } from '../po-chart-circular/po-chart-circular';
import { PoChartGaugeSerie } from './po-chart-gauge-series.interface';
import { poChartGaugeStartAngle } from '../po-chart-circular/po-chart-circular.constant';
import { PoChartGaugeTextContentComponent } from './po-chart-gauge-text-content/po-chart-gauge-text-content.component';

@Component({
  selector: 'po-chart-gauge',
  templateUrl: '../po-chart-dynamic-type.component.html'
})
export class PoChartGaugeComponent extends PoChartCircular implements AfterViewInit {
  chartItemStartAngle: number = poChartGaugeStartAngle;

  protected _series: Array<PoChartGaugeSerie> = [];

  set series(series: Array<PoChartGaugeSerie>) {
    this._series = this.getGaugeSerie(series);
  }

  get series() {
    return this._series;
  }

  @ViewChild('svgContainer', { static: true, read: ViewContainerRef }) svgContainerRef: ViewContainerRef;

  /* istanbul ignore next */
  constructor(
    private changeDetection: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    el: ElementRef,
    ngZone: NgZone,
    renderer: Renderer2
  ) {
    super(el, ngZone, renderer);
  }

  ngAfterViewInit() {
    this.drawBasePath();
    this.createComponent();
  }

  private createComponent() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PoChartGaugeTextContentComponent);

    const componentRef = this.svgContainerRef.createComponent(factory);
    const instance = componentRef.instance;

    instance.serie = this.series.length && this.series[0];
    instance.gaugeWidth = this.getGaugeBaseWidth();

    this.resizeListenerSubscription(instance);
  }

  private checkGaugeValueLimits(value: number) {
    if (value <= 0) {
      return 0;
    } else if (value >= 100) {
      return 100;
    } else {
      return value;
    }
  }

  private drawBasePath() {
    const basePath = this.el.nativeElement.querySelector('.po-chart-gauge-base-path');

    this.drawPath(basePath, this.chartItemStartAngle, 0);
  }

  private getGaugeBaseWidth() {
    const basePath = this.el.nativeElement.querySelector('.po-chart-gauge-base-path');

    if (basePath) {
      return basePath.getBoundingClientRect().width;
    }
  }

  private getGaugeSerie(series: Array<PoChartGaugeSerie> = []) {
    const [serie] = series;

    if (serie && typeof serie === 'object') {
      return [
        {
          ...serie,
          color: this.colors[0],
          value: this.checkGaugeValueLimits(serie.value)
        }
      ];
    }

    return [];
  }

  private resizeListenerSubscription(instance: PoChartGaugeTextContentComponent) {
    this.windowResizeEmitter.subscribe(() => {
      instance.gaugeWidth = this.getGaugeBaseWidth();
      this.changeDetection.detectChanges();
    });
  }
}
