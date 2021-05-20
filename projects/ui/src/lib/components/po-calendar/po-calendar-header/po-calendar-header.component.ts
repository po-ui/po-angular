import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-calendar-header',
  templateUrl: './po-calendar-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoCalendarHeaderComponent {
  @Input('p-hide-previous') hidePrevious = false;

  @Input('p-hide-next') hideNext = false;

  @Output('p-previous') previous = new EventEmitter<void>();

  @Output('p-next') next = new EventEmitter<void>();

  constructor() {}
}
