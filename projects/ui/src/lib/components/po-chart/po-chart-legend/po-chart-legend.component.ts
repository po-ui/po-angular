import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartColorService } from '../services/po-chart-color.service';

@Component({
  selector: 'po-chart-legend',
  templateUrl: './po-chart-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoChartLegendComponent {
  colors: Array<string>;

  private _series: Array<any>;

  @Input('p-type') type: PoChartType;

  @Input('p-series') set series(value: Array<any>) {
    this._series = value;

    this.colors = this.colorService.getSeriesColor(this._series, this.type);
  }

  get series() {
    return this._series;
  }

  constructor(private colorService: PoChartColorService) {}
}
