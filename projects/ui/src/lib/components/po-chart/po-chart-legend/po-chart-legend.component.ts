import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoCircularChartSeries } from '../po-chart-types/po-chart-circular/po-chart-circular-series.interface';

@Component({
  selector: 'po-chart-legend',
  templateUrl: './po-chart-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoChartLegendComponent {
  @Input('p-colors') colors: Array<string>;

  @Input('p-series') series: PoCircularChartSeries;
}
