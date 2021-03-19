import { Component, Input } from '@angular/core';

import { PoChartType } from '../../../enums/po-chart-type.enum';
import { PoChartLabelCoordinates } from '../../../interfaces/po-chart-label-coordinates.interface';

@Component({
  selector: '[po-chart-axis-label]',
  templateUrl: './po-chart-axis-label.component.svg'
})
export class PoChartAxisLabelComponent {
  @Input('p-align-by-the-corners') alignByTheCorners: boolean = false;

  @Input('p-axis-x-label-coordinates') axisXLabelCoordinates: Array<PoChartLabelCoordinates>;

  @Input('p-axis-y-label-coordinates') axisYLabelCoordinates: Array<PoChartLabelCoordinates>;

  @Input('p-type') type: PoChartType;

  constructor() {}

  trackBy(index) {
    return index;
  }
}
