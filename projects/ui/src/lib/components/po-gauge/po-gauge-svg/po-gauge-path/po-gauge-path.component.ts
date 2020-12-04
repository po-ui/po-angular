import { Component, Input, OnInit } from '@angular/core';

import { PoGaugeCoordinates } from '../../interfaces/po-gauge-coordinates.interface';

@Component({
  selector: '[po-gauge-path]',
  templateUrl: './po-gauge-path.component.svg'
})
export class PoGaugePathComponent implements OnInit {
  @Input('p-base-coordinates') baseCoordinates: PoGaugeCoordinates;

  @Input('p-ranges-coordinates') rangesCoordinates: Array<PoGaugeCoordinates>;

  constructor() {}

  ngOnInit(): void {}

  trackBy(index) {
    return index;
  }
}
