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
  SimpleChanges,
  ElementRef
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
  readonly cdr = inject(ChangeDetectorRef);
  readonly elementRef = inject(ElementRef<HTMLElement>);

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
  @Input('p-size') size: string;
  // Template customizado para o header do calendário. Para uso interno do datepicker/datepicker-range.
  @Input('p-header-template') headerTemplate?: TemplateRef<any>;
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
  readonly hoverDateSource = new Subject<Date>();
  @Output('p-hover-date') hoverDate = this.hoverDateSource.pipe(debounceTime(100));
  // Evento para fechar o calendário. Para uso interno do datepicker/datepicker-range.
  @Output('p-close-calendar') closeCalendar = new EventEmitter<void>();

  currentYear: number;
  displayYear: number;
  displayMonthNumber: number;
  displayMonth: string;

  displayDays: Array<Date> = [];
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

  private get date() {
    return this.value;
  }

  ngOnInit() {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { activateDate, minDate, maxDate, locale } = changes;

    if (minDate || maxDate) {
      this.comboYearsOptions = [...this.poCalendarService.getYearOptions(this.minDate, this.maxDate)];
      this.updateTemplateContext();
      this.ensureValidFocusedDay();
      this.cdr.markForCheck();
    }

    if (locale && !locale.firstChange && locale.previousValue !== locale.currentValue) {
      this.comboKey++;
      this.updateTemplateContext();
      this.cdr.detectChanges();
    }

    if (activateDate && !activateDate.firstChange) {
      const val = activateDate.currentValue;
      const dateToUse = this.getDateToUse(val);

      if (dateToUse.getFullYear() !== this.displayYear || dateToUse.getMonth() !== this.displayMonthNumber) {
        this.updateDisplay(dateToUse.getFullYear(), dateToUse.getMonth());
      }
    }
  }

  private getDateToUse(value: any): Date {
    if (value instanceof Date) {
      return value;
    }

    if (value?.start instanceof Date) {
      return value.start;
    }

    return new Date();
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
  }

  private updateTemplateContext() {
    const yearsOptions = [...this.comboYearsOptions];

    if (this.displayYear !== undefined && !yearsOptions.some(option => option.value === this.displayYear)) {
      yearsOptions.push({ label: this.displayYear.toString(), value: this.displayYear });
      yearsOptions.sort((a, b) => a.value - b.value);
    }

    this.templateContext = {
      monthIndex: this.displayMonthNumber,
      monthsOptions: [...this.comboMonthsOptions],
      year: this.displayYear,
      yearsOptions,
      updateDate: (year: number, month: number) => this.updateDate(year, month)
    };
    this.cdr.markForCheck();
  }

  updateDate(year: number, month: number) {
    const hasChanged = this.displayYear !== year || this.displayMonthNumber !== month;
    this.updateDisplay(year, month);
    if (hasChanged) {
      // Emite mês em formato 1-indexed (janeiro = 1, não 0)
      this.headerChange.emit({ month: month + 1, year });
    }
  }

  private updateDisplay(year: number, month: number) {
    if (year === undefined || month === undefined) return;

    this.displayYear = year;
    this.displayMonthNumber = month;
    this.displayMonth = this.displayMonths[month];

    const calendarArray = this.poCalendarService.monthDays(year, month);
    this.displayDays = [].concat(...calendarArray);

    this.getDecadeArray(year);

    this.updateTemplateContext();

    this.setInitialFocusedDay();

    this.ensureValidFocusedDay();

    this.cdr.detectChanges();
  }

  private setInitialFocusedDay(): void {
    if (this.value) {
      const selectedDate = this.value instanceof Date ? this.value : this.value?.start;
      if (selectedDate instanceof Date) {
        const selectedIndex = this.displayDays.findIndex(
          day =>
            day &&
            this.equalsDate(day, selectedDate) &&
            day.getMonth() === this.displayMonthNumber &&
            !this.isDayDisabled(day)
        );
        if (selectedIndex !== -1) {
          this.focusedDayIndex = selectedIndex;
          return;
        }
      }
    }

    const firstAvailableIndex = this.displayDays.findIndex(
      day => day instanceof Date && day.getMonth() === this.displayMonthNumber && !this.isDayDisabled(day)
    );

    if (firstAvailableIndex !== -1) {
      this.focusedDayIndex = firstAvailableIndex;
    }
  }

  private ensureValidFocusedDay(): void {
    const currentDay = this.displayDays[this.focusedDayIndex];

    if (
      currentDay instanceof Date &&
      currentDay.getMonth() === this.displayMonthNumber &&
      !this.isDayDisabled(currentDay)
    ) {
      return;
    }

    const firstAvailableIndex = this.displayDays.findIndex(
      day => day instanceof Date && day.getMonth() === this.displayMonthNumber && !this.isDayDisabled(day)
    );

    if (firstAvailableIndex !== -1) {
      this.focusedDayIndex = firstAvailableIndex;
    }
  }

  getDayTabIndex(day: Date, index: number): number {
    if (!day || !(day instanceof Date)) {
      return -1;
    }
    if (day.getMonth() !== this.displayMonthNumber) {
      return -1;
    }
    if (this.isDayDisabled(day)) {
      return -1;
    }
    return index === this.focusedDayIndex ? 0 : -1;
  }

  // --- 4. Navegação (Setas) ---

  onNextMonth() {
    const newMonth = this.displayMonthNumber < 11 ? this.displayMonthNumber + 1 : 0;
    const newYear = this.displayMonthNumber < 11 ? this.displayYear : this.displayYear + 1;
    this.updateDisplay(newYear, newMonth);
    this.headerChange.emit({ month: newMonth + 1, year: newYear });
  }

  onPreviousMonth() {
    const newMonth = this.displayMonthNumber > 0 ? this.displayMonthNumber - 1 : 11;
    const newYear = this.displayMonthNumber > 0 ? this.displayYear : this.displayYear - 1;
    this.updateDisplay(newYear, newMonth);
    this.headerChange.emit({ month: newMonth + 1, year: newYear });
  }

  updateYear(value: number) {
    const newYear = this.displayYear + value;
    this.updateDisplay(newYear, this.displayMonthNumber);
  }

  onSelectMonth(year: number, month: number) {
    this.selectDisplayMode('day');
    this.updateDisplay(year, month);
  }

  onSelectYear(year: number, month: number) {
    this.selectDisplayMode(this.lastDisplay === 'month' ? 'month' : 'day');
    this.currentYear = year;
    this.updateDisplay(year, month);
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

  onTodayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey) {
      this.closeCalendar.emit();
    }
  }

  onTodayKeydownEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.onSelectDate(this.today);
  }

  onTodayKeydownSpace(event: KeyboardEvent): void {
    event.preventDefault();
    this.onSelectDate(this.today);
  }

  onDayKeydown(event: KeyboardEvent, day: Date, index: number) {
    const key = event.key;
    const dayOfMonth = day.getDate();

    if (this.isSelectionKey(key)) {
      this.handleSelectKey(day, index);
      event.preventDefault();
    } else if (this.handleNavigationKey(key, index)) {
      event.preventDefault();
    } else if (this.handlePageNavigation(key, event.shiftKey, dayOfMonth, index)) {
      event.preventDefault();
    } else if (key === 'Escape') {
      event.preventDefault();
    }
  }

  private isSelectionKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }

  private handleSelectKey(day: Date, index: number): void {
    // Bloqueia seleção de dias desabilitados
    if (this.isDayDisabled(day)) {
      return;
    }
    this.onSelectDate(day);
    this.focusElement(index);
  }

  private handleNavigationKey(key: string, index: number): boolean {
    let newIndex = this.getNextNavigationIndex(key, index);

    if (newIndex !== -1 && newIndex < this.displayDays.length) {
      let newDate = this.displayDays[newIndex];
      if (!newDate) return false;
      if (newDate.getMonth() !== this.displayMonthNumber || newDate.getFullYear() !== this.displayYear) {
        return false;
      }
      if (this.isDayDisabled(newDate)) {
        const direction = this.getNavigationDirection(key);
        newIndex = this.findNextAvailableDay(newIndex, direction);
        if (newIndex === -1) {
          return false;
        }
        newDate = this.displayDays[newIndex];
        if (!newDate || this.isDayDisabled(newDate)) {
          return false;
        }
      }

      this.focusedDayIndex = newIndex;
      this.cdr.detectChanges();
      this.focusElement(newIndex);
      return true;
    }

    return false;
  }

  private getNextNavigationIndex(key: string, index: number): number {
    switch (key) {
      case 'ArrowUp':
        return Math.max(0, index - 7);
      case 'ArrowDown':
        return Math.min(this.displayDays.length - 1, index + 7);
      case 'ArrowRight':
        return Math.min(this.displayDays.length - 1, index + 1);
      case 'ArrowLeft':
        return Math.max(0, index - 1);
      case 'Home':
        return this.getFirstAvailableDayInWeek(index);
      case 'End':
        return this.getLastAvailableDayInWeek(index);
      default:
        return -1;
    }
  }

  private getFirstAvailableDayInWeek(index: number): number {
    const weekStart = Math.floor(index / 7) * 7;
    const weekEnd = Math.min(weekStart + 7, this.displayDays.length);

    for (let i = weekStart; i < weekEnd; i++) {
      const date = this.displayDays[i];
      if (date instanceof Date && date.getMonth() === this.displayMonthNumber && !this.isDayDisabled(date)) {
        return i;
      }
    }

    return weekStart;
  }

  private getLastAvailableDayInWeek(index: number): number {
    const weekStart = Math.floor(index / 7) * 7;
    const weekEnd = Math.min(weekStart + 7, this.displayDays.length);

    for (let i = weekEnd - 1; i >= weekStart; i--) {
      const date = this.displayDays[i];
      if (date instanceof Date && date.getMonth() === this.displayMonthNumber && !this.isDayDisabled(date)) {
        return i;
      }
    }

    return weekStart;
  }

  private getNavigationDirection(key: string): 'forward' | 'backward' {
    return key === 'ArrowRight' || key === 'ArrowDown' || key === 'End' ? 'forward' : 'backward';
  }

  private findNextAvailableDay(startIndex: number, direction: 'forward' | 'backward'): number {
    const step = direction === 'forward' ? 1 : -1;
    let index = startIndex + step;

    for (let i = 0; i < 100; i++) {
      if (index < 0 || index >= this.displayDays.length) {
        break;
      }

      const date = this.displayDays[index];
      if (date instanceof Date && date.getMonth() === this.displayMonthNumber && !this.isDayDisabled(date)) {
        return index;
      }

      index += step;
    }

    return -1;
  }

  private handlePageNavigation(key: string, isShiftKey: boolean, dayOfMonth: number, index: number): boolean {
    const directionMap: Record<string, 'up' | 'down'> = {
      PageUp: 'up',
      PageDown: 'down'
    };

    const direction = directionMap[key];

    if (!direction) {
      return false;
    }

    const step = direction === 'up' ? -1 : 1;
    let targetMonth = this.displayMonthNumber;
    let targetYear = this.displayYear;

    if (isShiftKey) {
      targetYear += step;
    } else {
      targetMonth += step;
      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear -= 1;
      } else if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }

    if (!this.hasAvailableDaysInMonth(targetYear, targetMonth)) {
      return false;
    }

    this.applyPageNavigation(direction, isShiftKey);
    this.focusOnSameDayAndWeek(dayOfMonth, index);
    return true;
  }

  private hasAvailableDaysInMonth(year: number, month: number): boolean {
    const calendarArray = this.poCalendarService.monthDays(year, month);
    const monthDays = [].concat(...calendarArray);

    return monthDays.some(day => day instanceof Date && day.getMonth() === month && !this.isDayDisabled(day));
  }

  private applyPageNavigation(direction: 'up' | 'down', isShiftKey: boolean): void {
    const step = direction === 'up' ? -1 : 1;

    if (isShiftKey) {
      this.displayYear += step;
    } else {
      this.displayMonthNumber += step;
      if (this.displayMonthNumber < 0) {
        this.displayMonthNumber = 11;
        this.displayYear -= 1;
      } else if (this.displayMonthNumber > 11) {
        this.displayMonthNumber = 0;
        this.displayYear += 1;
      }
    }
    this.updateDisplay(this.displayYear, this.displayMonthNumber);
  }

  private focusElement(index: number): void {
    this.focusedDayIndex = index;
    this.cdr.detectChanges();
    setTimeout(() => {
      const element = this.queryDayElement(index);
      if (element instanceof HTMLElement) {
        element.focus();
      }
    }, 0);
  }

  private focusOnSameDayAndWeek(dayOfMonth: number, currentIndex: number): void {
    const currentWeekRow = Math.floor(currentIndex / 7);
    const dayOfWeek = currentIndex % 7;

    setTimeout(() => {
      const focusIndex = this.findTargetDayIndex(dayOfMonth, dayOfWeek, currentWeekRow);

      if (focusIndex !== -1) {
        let targetIndex = focusIndex;
        const targetDate = this.displayDays[targetIndex];

        if (targetDate instanceof Date && this.isDayDisabled(targetDate)) {
          targetIndex = this.getFirstAvailableDayInWeek(targetIndex);
        }

        this.focusedDayIndex = targetIndex;
        this.cdr.detectChanges();

        const element = this.queryDayElement(targetIndex);
        if (element instanceof HTMLElement) {
          element.focus();
        }
      }
    }, 0);
  }

  private queryDayElement(index: number): Element | null {
    return this.elementRef.nativeElement.querySelector(`[data-day-index="${index}"]`);
  }

  private findTargetDayIndex(dayOfMonth: number, dayOfWeek: number, startWeekRow: number): number {
    const totalRows = Math.ceil(this.displayDays.length / 7);

    for (let row = 0; row < totalRows; row++) {
      const checkIndex = row * 7 + dayOfWeek;
      if (this.isValidCalendarDate(checkIndex, dayOfMonth)) return checkIndex;
    }

    for (let row = startWeekRow - 1; row >= 0; row--) {
      const checkIndex = row * 7 + dayOfWeek;
      if (this.isValidCalendarDate(checkIndex)) return checkIndex;
    }

    for (let row = startWeekRow + 1; row < totalRows; row++) {
      const checkIndex = row * 7 + dayOfWeek;
      if (this.isValidCalendarDate(checkIndex)) return checkIndex;
    }

    return -1;
  }

  private isValidCalendarDate(index: number, requiredDayOfMonth?: number): boolean {
    if (index >= this.displayDays.length) return false;

    const date = this.displayDays[index];

    if (!(date instanceof Date) || date.getMonth() !== this.displayMonthNumber) {
      return false;
    }

    return requiredDayOfMonth === undefined || date.getDate() === requiredDayOfMonth;
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

  private getDayColor(date: Date, type: 'background' | 'foreground'): string {
    if (!date) return '';
    const prefix = `po-calendar-box-${type}`;

    if (date.getMonth() !== this.displayMonthNumber) {
      const isDisabled = !this.poDate.validateDateRange(date, this.minDate, this.maxDate);
      return isDisabled ? `${prefix}-other-month-disabled` : `${prefix}-other-month`;
    }

    if (this.range && this.selectedValue) {
      const rangeColor = this.getRangeColor(date, prefix, type);
      if (rangeColor) return rangeColor;
    }

    if (!this.range && this.equalsDate(date, this.today) && this.equalsDate(date, this.date)) {
      const prefix = `po-calendar-box-${type}`;
      return `${prefix}-today-selected`;
    }

    if (!this.range && this.equalsDate(date, this.date)) {
      return this.getColorForDate(date, type);
    }

    if (this.equalsDate(date, this.today)) {
      return this.getColorForToday(date, type);
    }
    return this.getColorForDefaultDate(date, type);
  }

  private getRangeColor(date: Date, prefix: string, type: 'background' | 'foreground'): string | void {
    const { start, end } = this.selectedValue;

    if ((start && this.equalsDate(date, start)) || (end && this.equalsDate(date, end))) {
      return this.getColorForDate(date, type);
    }

    if (!start) return;

    if (end && date > start && date < end) {
      return this.getColorForDateRange(date, type);
    }

    if (!end && date > start && date < this.hoverValue) {
      return `${prefix}-hover`;
    }
  }

  getColorForDate(date: Date, type: 'background' | 'foreground') {
    const prefix = `po-calendar-box-${type}`;
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `${prefix}-selected`
      : `${prefix}-selected-disabled`;
  }

  getColorForDefaultDate(date: Date, type: 'background' | 'foreground') {
    const prefix = `po-calendar-box-${type}`;
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate) ? prefix : `${prefix}-disabled`;
  }

  getColorForToday(date: Date, type: 'background' | 'foreground') {
    const prefix = `po-calendar-box-${type}`;
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `${prefix}-today`
      : `${prefix}-today-disabled`;
  }

  getColorForDateRange(date: Date, type: 'background' | 'foreground') {
    const prefix = `po-calendar-box-${type}`;
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `${prefix}-in-range`
      : `${prefix}-in-range-disabled`;
  }

  getColorState(date: Date, prefix: string, state: string) {
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

    this.updateDecade(startYear);
  }

  private updateDecade(startYear: number) {
    this.displayStartDecade = startYear;
    this.displayFinalDecade = startYear + 9;
    this.addAllYearsInDecade(startYear);
  }

  private addAllYearsInDecade(startYear: number) {
    for (let i = startYear; i < startYear + 10; i++) {
      this.displayDecade.push(i);
    }
  }

  trackByYear(index: number, year: number): number {
    return year;
  }

  trackByMonth(index: number, month: string): number {
    return index;
  }

  trackByDay(index: number, day: Date): string {
    if (!day || !(day instanceof Date)) {
      return `invalid-${index}`;
    }
    return `${index}:${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
  }

  trackByWeekDay(index: number, weekDay: string): string {
    return `${index}:${weekDay}`;
  }
}
