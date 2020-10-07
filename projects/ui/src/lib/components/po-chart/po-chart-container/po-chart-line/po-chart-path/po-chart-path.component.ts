import { Component, Input } from '@angular/core';

import { PoChartPathCoordinates } from '../../../interfaces/po-chart-path-coordinates.interface';

@Component({
  selector: '[po-chart-path]',
  templateUrl: './po-chart-path.component.svg'
})
export class PoChartPathComponent {
  @Input('p-color') color?: string;

  @Input('p-coordinates') coordinates: PoChartPathCoordinates;

  constructor() {}
}
