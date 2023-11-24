import { Component, Input } from '@angular/core';

import { PoGaugeCoordinates } from '../../interfaces/po-gauge-coordinates.interface';

@Component({
  selector: '[po-gauge-path]',
  templateUrl: './po-gauge-path.component.svg'
})
export class PoGaugePathComponent {
  @Input('p-base-coordinates') baseCoordinates: PoGaugeCoordinates;

  @Input('p-ranges-coordinates') rangesCoordinates: Array<PoGaugeCoordinates>;

  constructor() {}

  trackBy(index) {
    return index;
  }
}
