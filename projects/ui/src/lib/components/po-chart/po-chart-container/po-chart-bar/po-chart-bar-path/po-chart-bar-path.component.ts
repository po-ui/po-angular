import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PoChartBarCoordinates } from '../../../interfaces/po-chart-bar-coordinates.interface';

@Component({
  selector: '[po-chart-bar-path]',
  templateUrl: './po-chart-bar-path.component.svg'
})
export class PoChartBarPathComponent {
  @Input('p-color') color?: string;

  @Input('p-coordinates') coordinates: Array<PoChartBarCoordinates>;

  @Input('p-tooltip-position') tooltipPosition: string;

  @Output('p-bar-click') barClick = new EventEmitter<any>();

  @Output('p-bar-hover') barHover = new EventEmitter<any>();

  constructor() {}

  trackBy(index) {
    return index;
  }

  onClick(item: PoChartBarCoordinates) {
    const selectedItem = { label: item.label, data: item.data, category: item.category };

    this.barClick.emit(selectedItem);
  }

  onMouseEnter(item: PoChartBarCoordinates) {
    const selectedItem = { label: item.label, data: item.data, category: item.category };

    this.barHover.emit(selectedItem);
  }
}
