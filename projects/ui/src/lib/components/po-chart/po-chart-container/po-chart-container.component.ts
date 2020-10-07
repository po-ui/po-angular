import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoLineChartSeries } from '../interfaces/po-chart-line-series.interface';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';
import { PoChartOptions } from '../interfaces/po-chart-options.interface';
import { PoChartAxisOptions } from '../interfaces/po-chart-axis-options.interface';

@Component({
  selector: 'po-chart-container',
  templateUrl: './po-chart-container.component.html'
})
export class PoChartContainerComponent {
  axisOptions: PoChartAxisOptions;
  viewBox: string;

  private _containerSize: PoChartContainerSize;
  private _options: PoChartOptions;

  @Input('p-categories') categories: Array<string>;

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;
    this.viewBox = this.setViewBox();
  }

  get containerSize() {
    return this._containerSize;
  }

  @Output('p-serie-click') serieClick = new EventEmitter<any>();

  @Output('p-serie-hover') serieHover = new EventEmitter<any>();

  @Input('p-options') set options(value: PoChartOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;

      this.verifyAxisOptions(this._options);
    }
  }

  get options() {
    return this._options;
  }

  @Input('p-type') type: PoChartType;

  @Input('p-series') series: Array<PoLineChartSeries>;

  constructor() {}

  onSerieClick(event: any) {
    this.serieClick.emit(event);
  }

  onSerieHover(event: any) {
    this.serieHover.emit(event);
  }

  private setViewBox() {
    const { svgWidth, svgHeight } = this.containerSize;

    // Tratamento necessário para que não corte o vetor nas extremidades
    const offsetXY = 1;

    return `${offsetXY} -${offsetXY} ${svgWidth} ${svgHeight}`;
  }

  private verifyAxisOptions(options: PoChartOptions): void {
    if (this._options.hasOwnProperty('axis')) {
      this.axisOptions = {
        ...this.axisOptions,
        ...this._options.axis
      };
    }
  }
}
