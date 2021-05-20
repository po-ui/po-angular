import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import { PoCalendarLangService } from '../services/po-calendar.lang.service';
import { PoCalendarService } from '../services/po-calendar.service';
import { PoDateService } from '../../../services/po-date/po-date.service';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

@Component({
  selector: 'po-calendar-wrapper',
  templateUrl: './po-calendar-wrapper.component.html',
  providers: [PoCalendarService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoCalendarWrapperComponent implements OnInit, OnChanges {
  private _locale: string;

  currentYear: number;
  displayDays: Array<number>;
  displayDecade: Array<number>;
  displayFinalDecade: number;
  displayMonth: any;
  displayMonthNumber: number;
  displayMonths: Array<any> = Array();
  displayStartDecade: number;
  displayWeekDays: Array<any> = Array();
  displayYear: number;

  protected currentMonthNumber: number;
  protected date: Date;
  protected lastDisplay: string;
  protected today: Date = new Date();

  @Input('p-value') value;

  @Input('p-locale') set locale(value: string) {
    this._locale = value;
    this.initializeLanguage();
  }

  get locale() {
    return this._locale;
  }

  @Input('p-mode') mode: 'day' | 'month' | 'year' = 'day';

  @Input('p-part-type') partType: 'start' | 'end';

  @Input('p-range') range: boolean = false;

  @Input('p-activate-date') activateDate = new Date();

  @Input('p-selected-value') selectedValue;

  @Input('p-min-date') minDate;

  @Input('p-max-date') maxDate;

  @Output('p-header-change') headerChange = new EventEmitter<any>();

  @Output('p-select-date') selectDate = new EventEmitter<any>();

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

  constructor(
    private poCalendarService: PoCalendarService,
    private poCalendarLangService: PoCalendarLangService,
    private poDate: PoDateService,
    private languageService: PoLanguageService
  ) {}

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes) {
    const { activateDate } = changes;

    if (activateDate) {
      this.updateDate(activateDate.currentValue);
    }
  }

  getBackgroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-background-selected' : 'po-calendar-box-background';
  }

  getDayBackgroundColor(date: Date) {
    return this.getDayColor(date, 'background');
  }

  getDayForegroundColor(date: Date) {
    return this.getDayColor(date, 'foreground');
  }

  getForegroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-foreground-selected' : 'po-calendar-box-foreground';
  }

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

  // Ao selecionar uma data
  onSelectDate(date: Date) {
    this.selectDate.emit(date);
  }

  // Ao selecionar um mês
  onSelectMonth(year: number, month: number) {
    this.selectDisplayMode('day');
    this.updateDisplay(year, month);

    this.headerChange.emit({ month, year });
  }

  // Ao selecionar um ano
  onSelectYear(year: number, month: number) {
    // Se veio da tela de seleção de mês
    this.selectDisplayMode(this.lastDisplay === 'month' ? 'month' : 'day');

    this.currentYear = year;
    this.updateDisplay(year, month);

    this.headerChange.emit({ month, year });
  }

  selectDisplayMode(mode: 'month' | 'day' | 'year') {
    this.lastDisplay = this.mode;
    this.mode = mode;
  }

  updateYear(value: number) {
    this.updateDisplay(this.displayYear + value, this.displayMonthNumber);
  }

  private addAllYearsInDecade(year: number) {
    let i;
    for (i = year; i < year + 10; i++) {
      this.displayDecade.push(i);
    }
  }

  private equalsDate(date1: Date, date2: Date): boolean {
    try {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    } catch (error) {
      return false;
    }
  }

  // Obtém um array de todos os anos desta década
  private getDecadeArray(year) {
    this.displayDecade = Array();

    if (year % 10 !== 0) {
      while (year % 10 !== 0) {
        year--;
      }
    }
    this.updateDecade(year);
  }

  private getColorForDate(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}-selected`
      : `po-calendar-box-${local}-selected-disabled`;
  }

  private getColorForDefaultDate(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}`
      : `po-calendar-box-${local}-disabled`;
  }

  private getColorForToday(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}-today`
      : `po-calendar-box-${local}-today-disabled`;
  }

  private getColorForDateRange(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}-in-range`
      : `po-calendar-box-${local}-in-range-disabled`;
  }

  private getDayColor(date: Date, local: string) {
    const start = this.selectedValue?.start;
    const end = this.selectedValue?.end;

    if (this.range && (this.equalsDate(date, start) || this.equalsDate(date, end))) {
      return this.getColorForDate(date, local);
    } else if (this.range && start && end && date > start && date < end) {
      return this.getColorForDateRange(date, local);
    } else if (!this.range && this.equalsDate(date, this.value)) {
      return this.getColorForDate(date, local);
    } else if (this.equalsDate(date, this.today)) {
      return this.getColorForToday(date, local);
    } else {
      return this.getColorForDefaultDate(date, local);
    }
  }

  private init() {
    this.updateDate(this.activateDate);
    this.initializeLanguage();
    this.selectDisplayMode('day');
  }

  private initializeLanguage() {
    this.poCalendarLangService.setLanguage(this.locale);
    this.displayWeekDays = this.poCalendarLangService.getWeekDaysArray();
    this.displayMonths = this.poCalendarLangService.getMonthsArray();
    this.displayMonth = this.displayMonths[this.displayMonthNumber];
  }

  private updateDate(value: Date = new Date()) {
    const date = new Date(value);

    this.currentMonthNumber = date.getMonth();
    this.currentYear = date.getFullYear();
    this.updateDisplay(this.currentYear, this.currentMonthNumber);
  }

  private updateDecade(year: number) {
    this.addAllYearsInDecade(year);
    this.displayStartDecade = year;
    this.displayFinalDecade = year + 9;
  }

  private updateDisplay(year: number, month: number) {
    const calendarArray = this.poCalendarService.monthDays(year, month);
    this.displayDays = [].concat.apply([], calendarArray);
    this.displayMonthNumber = month;
    this.displayMonth = this.displayMonths[month];
    this.displayYear = year;
    this.getDecadeArray(year);
  }
}
