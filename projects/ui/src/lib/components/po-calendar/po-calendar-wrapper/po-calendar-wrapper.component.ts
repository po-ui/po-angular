import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  inject,
  TemplateRef,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';
import { PoCalendarService } from '../services/po-calendar.service';
import { PoDateService } from '../../../services/po-date/po-date.service';

@Component({
  selector: 'po-calendar-wrapper',
  templateUrl: './po-calendar-wrapper.component.html',
  providers: [PoCalendarService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarWrapperComponent implements OnInit, OnChanges {
  private poCalendarService = inject(PoCalendarService);
  private poCalendarLangService = inject(PoCalendarLangService);
  private poDate = inject(PoDateService);
  private cdr = inject(ChangeDetectorRef);

  @Input('p-value') value: any;
  @Input('p-mode') mode: 'day' | 'month' | 'year' = 'day';
  @Input('p-responsive') responsive: boolean = false;
  @Input('p-part-type') partType: 'start' | 'end';
  @Input('p-range') range: boolean = false;
  @Input('p-activate-date') activateDate: Date = new Date();
  @Input('p-selected-value') selectedValue: any;
  @Input('p-min-date') minDate: any;
  @Input('p-max-date') maxDate: any;
  @Input('p-hover-value') hoverValue: Date;
  @Input('p-header-template') headerTemplate?: TemplateRef<any>;
  @Input('p-size') size: string;

  private _locale: string;
  @Input('p-locale') set locale(value: string) {
    this._locale = value;
    this.setupOptions();
  }
  get locale() {
    return this._locale;
  }

  @Output('p-header-change') headerChange = new EventEmitter<any>();
  @Output('p-select-date') selectDate = new EventEmitter<any>();

  private hoverDateSource = new Subject<Date>();
  @Output('p-hover-date') hoverDate = this.hoverDateSource.pipe(debounceTime(100));

  currentYear: number;
  displayYear: number;
  displayMonthNumber: number;
  displayMonth: string;

  displayDays: Array<Date | number> = [];
  displayWeekDays: Array<string> = [];
  displayMonths: Array<string> = [];

  displayDecade: Array<number> = [];
  displayStartDecade: number;
  displayFinalDecade: number;

  displayToday: string;
  displayToClean: string;
  today: Date = new Date();

  comboMonthsOptions: Array<{ label: string; value: number }> = [];
  comboYearsOptions: Array<{ label: string; value: number }> = [];
  comboKey: number = 0;
  focusedDayIndex: number = 0;

  templateContext: any = {
    monthIndex: 0,
    monthsOptions: [],
    year: 0,
    yearsOptions: [],
    updateDate: (year: number, month: number) => this.updateDate(year, month)
  };

  protected currentMonthNumber: number;
  protected lastDisplay: string;

  get monthLabel() {
    return this.poCalendarLangService.getMonthLabel();
  }
  get yearLabel() {
    return this.poCalendarLangService.getYearLabel();
  }
  get isDayVisible() {
    return this.mode === 'day';
  }
  get isMonthVisible() {
    return this.mode === 'month';
  }
  get isYearVisible() {
    return this.mode === 'year';
  }
  get isStartPart() {
    return this.partType === 'start';
  }
  get isEndPart() {
    return this.partType === 'end';
  }

  ngOnInit() {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { activateDate, minDate, maxDate, locale } = changes;

    if (minDate || maxDate) {
      this.comboYearsOptions = [...this.poCalendarService.getYearOptions(this.minDate, this.maxDate)];
      this.updateTemplateContext();
      this.cdr.markForCheck();
    }

    if (locale && !locale.firstChange) {
      this.comboKey++;
      this.updateTemplateContext();
      this.cdr.detectChanges();
    }

    if (activateDate && !activateDate.firstChange) {
      const val = activateDate.currentValue || new Date();
      this.updateDisplay(val.getFullYear(), val.getMonth());
    }
  }

  private initializeData() {
    const date = this.activateDate || new Date();
    this.displayYear = date.getFullYear();
    this.displayMonthNumber = date.getMonth();

    this.setupOptions();

    this.updateDisplay(this.displayYear, this.displayMonthNumber);
  }

  private setupOptions() {
    this.poCalendarLangService.setLanguage(this.locale);

    this.displayWeekDays = this.poCalendarLangService.getWeekDaysArray();
    this.displayMonths = this.poCalendarLangService.getMonthsArray();
    this.displayToday = this.poCalendarLangService.getTodayLabel();
    this.displayToClean = this.poCalendarLangService.getToCleanLabel();

    this.comboYearsOptions = [...this.poCalendarService.getYearOptions(this.minDate, this.maxDate)];

    this.comboMonthsOptions = [
      ...this.displayMonths.map((label, index) => ({
        label: label,
        value: index
      }))
    ];

    if (this.displayMonthNumber !== undefined) {
      this.displayMonth = this.displayMonths[this.displayMonthNumber];
    }

    this.cdr.markForCheck();

    this.updateTemplateContext();
  }

  onHeaderDateChange(event: { year: number; month: number }) {
    this.mode = 'day';
    this.updateDisplay(event.year, event.month);
    this.headerChange.emit(event);
  }

  private updateTemplateContext() {
    this.templateContext = {
      monthIndex: this.displayMonthNumber,
      monthsOptions: [...this.comboMonthsOptions],
      year: this.displayYear,
      yearsOptions: [...this.comboYearsOptions],
      updateDate: (year: number, month: number) => this.updateDate(year, month)
    };
    this.cdr.markForCheck();
  }

  updateDate(year: number, month: number) {
    this.updateDisplay(year, month);
    this.headerChange.emit({ month, year });
  }

  private updateDisplay(year: number, month: number) {
    if (year === undefined || month === undefined) return;

    this.displayYear = year;
    this.displayMonthNumber = month;
    this.displayMonth = this.displayMonths[month];

    const calendarArray = this.poCalendarService.monthDays(year, month);
    this.displayDays = [].concat.apply([], calendarArray);

    this.getDecadeArray(year);

    this.updateTemplateContext();

    this.cdr.detectChanges();
  }

  // --- 4. Navegação (Setas) ---

  onNextMonth() {
    this.displayMonthNumber < 11
      ? this.updateDisplay(this.displayYear, this.displayMonthNumber + 1)
      : this.updateDisplay(this.displayYear + 1, 0);

    this.headerChange.emit({ month: this.displayMonthNumber, year: this.displayYear });
  }

  onPreviousMonth() {
    if (this.displayMonthNumber > 0) {
      this.updateDisplay(this.displayYear, this.displayMonthNumber - 1);
    } else {
      this.updateDisplay(this.displayYear - 1, 11);
    }

    this.headerChange.emit({ month: this.displayMonthNumber, year: this.displayYear });
  }

  updateYear(value: number) {
    this.updateDisplay(this.displayYear + value, this.displayMonthNumber);
  }

  onSelectMonth(year: number, month: number) {
    this.selectDisplayMode('day');
    this.updateDisplay(year, month);
    this.headerChange.emit({ month, year });
  }

  onSelectYear(year: number, month: number) {
    this.selectDisplayMode(this.lastDisplay === 'month' ? 'month' : 'day');
    this.currentYear = year;
    this.updateDisplay(year, month);
    this.headerChange.emit({ month, year });
  }

  selectDisplayMode(mode: 'month' | 'day' | 'year') {
    this.lastDisplay = this.mode;
    this.mode = mode;
    this.cdr.detectChanges();
  }

  onSelectDate(date: Date) {
    if (!this.poDate.validateDateRange(date, this.minDate, this.maxDate)) {
      return;
    }
    this.selectDate.emit(date);
  }

  onMouseEnter(day: any) {
    this.hoverDateSource.next(day);
  }

  onMouseLeave() {
    this.hoverDateSource.next(null);
  }

  onDayKeydown(event: KeyboardEvent, day: Date, index: number) {
    let newIndex = index;
    let newYear = this.displayYear;
    let newMonth = this.displayMonthNumber;
    let focusedDayOfMonth = day.getDate();
    let preventDefault = true;

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.onSelectDate(day);
        this.focusedDayIndex = index;
        this.cdr.detectChanges();
        setTimeout(() => {
          const element = document.querySelector(`[data-day-index="${index}"]`) as HTMLElement;
          if (element) {
            element.focus();
          }
        }, 0);
        break;
      case 'ArrowUp':
        newIndex = Math.max(0, index - 7);
        break;
      case 'ArrowDown':
        newIndex = Math.min(this.displayDays.length - 1, index + 7);
        break;
      case 'ArrowRight':
        newIndex = Math.min(this.displayDays.length - 1, index + 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(0, index - 1);
        break;
      case 'Home':
        newIndex = Math.floor(index / 7) * 7;
        break;
      case 'End':
        newIndex = Math.floor(index / 7) * 7 + 6;
        break;
      case 'PageUp':
        if (event.shiftKey) {
          newYear = newYear - 1;
        } else {
          newMonth = newMonth === 0 ? 11 : newMonth - 1;
          if (newMonth === 11) newYear--;
        }
        this.updateDisplay(newYear, newMonth);
        this.focusOnSameDayAndWeek(focusedDayOfMonth, index);
        break;
      case 'PageDown':
        if (event.shiftKey) {
          newYear = newYear + 1;
        } else {
          newMonth = newMonth === 11 ? 0 : newMonth + 1;
          if (newMonth === 0) newYear++;
        }
        this.updateDisplay(newYear, newMonth);
        this.focusOnSameDayAndWeek(focusedDayOfMonth, index);
        break;
      case 'Escape':
        preventDefault = true;
        break;
      default:
        preventDefault = false;
    }

    if (preventDefault && !['PageUp', 'PageDown'].includes(event.key)) {
      event.preventDefault();
    } else if (['PageUp', 'PageDown'].includes(event.key)) {
      event.preventDefault();
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      this.focusedDayIndex = newIndex;
      this.cdr.detectChanges();
      setTimeout(() => {
        const element = document.querySelector(`[data-day-index="${newIndex}"]`) as HTMLElement;
        if (element) {
          element.focus();
        }
      }, 0);
    }
  }

  private focusOnSameDayAndWeek(dayOfMonth: number, currentIndex: number) {
    const currentWeekRow = Math.floor(currentIndex / 7);
    const currentDayOfWeek = currentIndex % 7;

    setTimeout(() => {
      let focusIndex = -1;

      for (let row = 0; row < Math.ceil(this.displayDays.length / 7); row++) {
        const checkIndex = row * 7 + currentDayOfWeek;
        if (checkIndex < this.displayDays.length) {
          const dateAtIndex = this.displayDays[checkIndex];
          if (
            dateAtIndex instanceof Date &&
            dateAtIndex.getDate() === dayOfMonth &&
            dateAtIndex.getMonth() === this.displayMonthNumber
          ) {
            focusIndex = checkIndex;
            break;
          }
        }
      }

      if (focusIndex === -1) {
        const weekUp = currentWeekRow - 1;
        for (let row = weekUp; row >= 0; row--) {
          const checkIndex = row * 7 + currentDayOfWeek;
          if (checkIndex < this.displayDays.length) {
            const dateAtCheckIndex = this.displayDays[checkIndex];
            if (dateAtCheckIndex instanceof Date && dateAtCheckIndex.getMonth() === this.displayMonthNumber) {
              focusIndex = checkIndex;
              break;
            }
          }
        }
      }

      if (focusIndex === -1) {
        const weekDown = currentWeekRow + 1;
        for (let row = weekDown; row < Math.ceil(this.displayDays.length / 7); row++) {
          const checkIndex = row * 7 + currentDayOfWeek;
          if (checkIndex < this.displayDays.length) {
            const dateAtCheckIndex = this.displayDays[checkIndex];
            if (dateAtCheckIndex instanceof Date && dateAtCheckIndex.getMonth() === this.displayMonthNumber) {
              focusIndex = checkIndex;
              break;
            }
          }
        }
      }

      if (focusIndex !== -1) {
        this.focusedDayIndex = focusIndex;
        this.cdr.detectChanges();
        const element = document.querySelector(`[data-day-index="${focusIndex}"]`) as HTMLElement;
        if (element) {
          element.focus();
        }
      }
    }, 0);
  }

  onClear() {
    this.selectDate.emit(undefined);
  }

  getDayBackgroundColor(date: Date) {
    return this.getDayColor(date, 'background');
  }
  getDayForegroundColor(date: Date) {
    return this.getDayColor(date, 'foreground');
  }

  getBackgroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-background-selected' : 'po-calendar-box-background';
  }

  getForegroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-foreground-selected' : 'po-calendar-box-foreground';
  }

  isTodayUnavailable() {
    return this.minDate > this.today || this.maxDate < this.today;
  }

  isDayDisabled(date: Date): boolean {
    return !this.poDate.validateDateRange(date, this.minDate, this.maxDate);
  }

  private getDayColor(date: Date, type: 'background' | 'foreground') {
    if (!date) return '';
    const prefix = `po-calendar-box-${type}`;
    const isOtherMonth = date.getMonth() !== this.displayMonthNumber;

    if (isOtherMonth) {
      const isDisabled = !this.poDate.validateDateRange(date, this.minDate, this.maxDate);
      return isDisabled ? `${prefix}-other-month-disabled` : `${prefix}-other-month`;
    }

    if (this.range && this.selectedValue) {
      const { start, end } = this.selectedValue;
      if ((start && this.equalsDate(date, start)) || (end && this.equalsDate(date, end))) {
        return this.getColorState(date, prefix, 'selected');
      }
      if (start && end && date > start && date < end) {
        return this.getColorState(date, prefix, 'in-range');
      }
      if (start && !end && date > start && date < this.hoverValue) {
        return `${prefix}-hover`;
      }
    } else if (!this.range && this.equalsDate(date, this.value)) {
      if (this.equalsDate(date, this.today)) {
        return this.getColorState(date, prefix, 'today-selected');
      }
      return this.getColorState(date, prefix, 'selected');
    }

    if (this.equalsDate(date, this.today)) {
      return this.getColorState(date, prefix, 'today');
    }

    return this.poDate.validateDateRange(date, this.minDate, this.maxDate) ? prefix : `${prefix}-disabled`;
  }

  private getColorState(date: Date, prefix: string, state: string) {
    const isValid = this.poDate.validateDateRange(date, this.minDate, this.maxDate);
    return isValid ? `${prefix}-${state}` : `${prefix}-${state}-disabled`;
  }

  private equalsDate(d1: Date, d2: Date): boolean {
    try {
      return (
        !!d1 &&
        !!d2 &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    } catch {
      return false;
    }
  }

  private getDecadeArray(year: number) {
    this.displayDecade = [];
    let startYear = year;
    if (year % 10 !== 0) {
      while (startYear % 10 !== 0) startYear--;
    }

    for (let i = startYear; i < startYear + 10; i++) {
      this.displayDecade.push(i);
    }

    this.displayStartDecade = startYear;
    this.displayFinalDecade = startYear + 9;
  }
}
