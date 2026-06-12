import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'po-grid-cell-action',
  templateUrl: './po-grid-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoGridCellActionComponent {
  @Input('p-position') position?: string = '';

  @Input('p-value') value?: string;

  constructor() {}

  onKeyDownContent(event) {
    // ENTER
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }
}
