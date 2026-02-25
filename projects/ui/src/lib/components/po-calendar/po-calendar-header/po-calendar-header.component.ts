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
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { PoComboOption } from '../../po-field/po-combo/interfaces/po-combo-option.interface';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

@Component({
  selector: 'po-calendar-header',
  templateUrl: './po-calendar-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarHeaderComponent implements OnInit, OnChanges {
  readonly cdr = inject(ChangeDetectorRef);
  readonly poCalendarLangService = inject(PoCalendarLangService);

  @Input('p-hide-previous') hidePrevious = false;
  @Input('p-hide-next') hideNext = false;
  @Input('p-display-month') displayMonth!: number;
  @Input('p-display-year') displayYear!: number;
  @Input('p-display-month-label') displayMonthLabel: string;
  @Input('p-month-options') monthOptions?: Array<PoComboOption>;
  @Input('p-header-template') headerTemplate?: TemplateRef<any>;
  @Input('p-template-context') templateContext: any;
  @Input('p-size') size: string;

  private _locale: string;
  @Input('p-locale') set locale(value: string) {
    if (this._locale !== value) {
      this._locale = value;
      this.setupLabels();
    }
  }
  get locale() {
    return this._locale;
  }

  @Output('p-previous') previous = new EventEmitter<void>();
  @Output('p-next') next = new EventEmitter<void>();
  @Output('p-select-month') selectMonth = new EventEmitter<number>();
  @Output('p-select-year') selectYear = new EventEmitter<number>();

  previousMonthLabel: string;
  nextMonthLabel: string;
  private labelsInitialized = false;

  ngOnInit() {
    if (!this.labelsInitialized) {
      this.setupLabels();
    }
  }

  private setupLabels() {
    if (this._locale) {
      this.poCalendarLangService.setLanguage(this._locale);
    }
    this.previousMonthLabel = this.poCalendarLangService.getPreviousMonthLabel();
    this.nextMonthLabel = this.poCalendarLangService.getNextMonthLabel();
    this.labelsInitialized = true;
    this.cdr.markForCheck();
  }

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
