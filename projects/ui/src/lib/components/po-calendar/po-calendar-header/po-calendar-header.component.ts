import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { PoComboOption } from '../../po-field/po-combo/interfaces/po-combo-option.interface';

@Component({
  selector: 'po-calendar-header',
  templateUrl: './po-calendar-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarHeaderComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @Input('p-hide-previous') hidePrevious = false;
  @Input('p-hide-next') hideNext = false;
  @Input('p-display-month') displayMonth!: number;
  @Input('p-display-year') displayYear!: number;
  @Input('p-display-month-label') displayMonthLabel: string;
  @Input('p-month-options') monthOptions?: Array<PoComboOption>;
  @Input('p-header-template') headerTemplate?: TemplateRef<any>;
  @Input('p-template-context') templateContext: any;
  @Input('p-size') size: string;
  @Output('p-previous') previous = new EventEmitter<void>();
  @Output('p-next') next = new EventEmitter<void>();
  @Output('p-select-month') selectMonth = new EventEmitter<number>();
  @Output('p-select-year') selectYear = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateContext'] || changes['monthOptions'] || changes['headerTemplate']) {
      this.cdr.markForCheck();
      try {
        this.cdr.detectChanges();
      } catch (e) {
        // Sileciando erro ExpressionChangedAfterItHasBeenCheckedError
      }
    }
  }
}
