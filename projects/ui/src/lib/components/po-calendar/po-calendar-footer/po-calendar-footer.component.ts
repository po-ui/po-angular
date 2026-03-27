import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-calendar-footer',
  templateUrl: './po-calendar-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarFooterComponent {
  @Input('p-size') size: string;
  @Input('p-label-clear') labelClear: string;
  @Input('p-label-today') labelToday: string;
  @Input('p-responsive') responsive: boolean = false;
  @Input('p-today-disabled') todayDisabled: boolean = false;
  @Input('p-hide-today-button') hideTodayButton: boolean = false;

  @Output('p-clear') clear = new EventEmitter<void>();
  @Output('p-select-today') selectToday = new EventEmitter<void>();
  @Output('p-close-calendar') closeCalendar = new EventEmitter<void>();

  onClear(): void {
    this.clear.emit();
  }

  onSelectToday(): void {
    this.selectToday.emit();
  }

  onClearKeydown(event: KeyboardEvent): void {
    if (this.hideTodayButton && event.key === 'Tab' && !event.shiftKey) {
      this.closeCalendar.emit();
    }
  }

  onTodayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey) {
      this.closeCalendar.emit();
    }
  }
}
