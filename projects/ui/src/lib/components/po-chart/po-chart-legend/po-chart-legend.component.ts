import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';

@Component({
  selector: 'po-chart-legend',
  templateUrl: './po-chart-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoChartLegendComponent {
  private _series: Array<any>;

  @Input('p-type') type: PoChartType;

  @Input('p-series') set series(value: Array<any>) {
    this._series = value;
  }

  get series() {
    return this._series;
  }
}
