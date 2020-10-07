import { Component, Input } from '@angular/core';

import { PoChartPathCoordinates } from '../../../interfaces/po-chart-path-coordinates.interface';

@Component({
  selector: '[po-chart-axis-path]',
  templateUrl: './po-chart-axis-path.component.svg'
})
export class PoChartAxisPathComponent {
  @Input('p-axis-x-coordinates') axisXCoordinates: Array<PoChartPathCoordinates>;

  @Input('p-axis-y-coordinates') axisYCoordinates: Array<PoChartPathCoordinates>;

  constructor() {}

  trackBy(index) {
    return index;
  }
}
