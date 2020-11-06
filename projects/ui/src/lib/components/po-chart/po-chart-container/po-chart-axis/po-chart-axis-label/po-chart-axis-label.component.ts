import { Component, Input } from '@angular/core';

import { PoChartAxisLabelCoordinates } from '../../../interfaces/po-chart-axis-label-coordinates.interface';

@Component({
  selector: '[po-chart-axis-label]',
  templateUrl: './po-chart-axis-label.component.svg'
})
export class PoChartAxisLabelComponent {
  @Input('p-axis-x-label-coordinates') axisXLabelCoordinates: Array<PoChartAxisLabelCoordinates>;

  @Input('p-axis-y-label-coordinates') axisYLabelCoordinates: Array<PoChartAxisLabelCoordinates>;

  constructor() {}

  trackBy(index) {
    return index;
  }
}
