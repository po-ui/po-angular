import { Component, Input } from '@angular/core';

import { PoGaugeRanges } from '../interfaces/po-gauge-ranges.interface';

@Component({
  selector: 'po-gauge-legend',
  templateUrl: './po-gauge-legend.component.html'
})
export class PoGaugeLegendComponent {
  private _ranges: Array<PoGaugeRanges>;

  @Input('p-ranges') set ranges(value: Array<PoGaugeRanges>) {
    this._ranges = value.length ? this.filterLabel(value) : [];
  }

  get ranges() {
    return this._ranges;
  }

  constructor() {}

  trackBy(index) {
    return index;
  }

  private filterLabel(ranges: Array<PoGaugeRanges>) {
    return ranges.filter(range => range.label);
  }
}
