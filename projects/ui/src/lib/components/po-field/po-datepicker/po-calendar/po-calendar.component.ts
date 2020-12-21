import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { isMobile, setYearFrom0To100, validateDateRange } from '../../../../utils/util';
import { PoCalendarLangService } from './po-calendar.lang.service';
import { PoCalendarService } from './po-calendar.service';

import { PoLanguageService } from '../../../../services/po-language/po-language.service';
import { poLocales } from '../../../../services/po-language/po-language.constant';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de calendário de uso interno
 */
@Component({
  selector: 'po-calendar',
  templateUrl: './po-calendar.component.html',
  providers: [PoCalendarService, PoCalendarLangService]
})
export class PoCalendarComponent {
  private _dateEnd: Date;
  private _dateStart: Date;
  private _locale: string = this.languageService.getShortLanguage();
  private _selectedDate?: Date;

  currentYear: number;
  dayVisible: boolean = false;
  displayDays: Array<number>;
  displayDecade: Array<number>;
  displayFinalDecade: number;
  displayMonth: any;
  displayMonthNumber: number;
  displayMonths: Array<any> = Array();
  displayStartDecade: number;
  displayWeedDays: Array<any> = Array();
  displayYear: number;
  monthVisible: boolean = false;
  overlayInvisible: boolean = true;
  visible: boolean = false;
  yearVisible: boolean = false;

  private currentMonthNumber: number;
  private isMobile: any = isMobile;
  private lastDisplay: string;
  private today: Date = new Date();
  private shortLanguage: string;

  @ViewChild('days', { read: ElementRef, static: true }) elDays: ElementRef;
  @ViewChild('months', { read: ElementRef, static: true }) elMonths: ElementRef;
  @ViewChild('years', { read: ElementRef, static: true }) elYears: ElementRef;

  /**
   * @optional
   *
   * @description
   *
   * Data máxima possível de ser selecionada no calendário.
   */
  @Input('p-date-end') set dateEnd(val: Date) {
    if (val && val instanceof Date) {
      const year = val.getFullYear();
      const month = val.getMonth();
      const day = val.getDate();

      const date = new Date(year, month, day, 23, 59, 59);
      setYearFrom0To100(date, year);

      this._dateEnd = date;
    } else {
      this._dateEnd = undefined;
    }
  }
  get dateEnd() {
    return this._dateEnd;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma do calendário.
   *
   * > O locale padrão sera recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-locale') set locale(locale: string) {
    this._locale = poLocales.includes(locale) ? locale : this.shortLanguage;
    this.initializeLanguage();
  }
  get locale() {
    return this._locale;
  }

  /**
   * @optional
   *
   * @description
   *
   * Data selecionada no calendário.
   */
  @Input('p-selected-date') set selectedDate(selectedDate: Date) {
    this._selectedDate = selectedDate && selectedDate instanceof Date ? selectedDate : undefined;
  }
  get selectedDate(): Date {
    return this._selectedDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Data mínima possível de ser selecionada no calendário.
   */
  @Input('p-date-start') set dateStart(val: Date) {
    if (val && val instanceof Date) {
      const year = val.getFullYear();
      const month = val.getMonth();
      const day = val.getDate();

      const date = new Date(year, month, day, 0, 0, 0);
      setYearFrom0To100(date, year);

      this._dateStart = date;
    } else {
      this._dateStart = undefined;
    }
  }
  get dateStart() {
    return this._dateStart;
  }

  @Output('p-selected-dateChange') selectedDateChange = new EventEmitter<Date>();
  @Output('p-submit') submit = new EventEmitter<Date>();

  constructor(
    private poCalendarService: PoCalendarService,
    private poCalendarLangService: PoCalendarLangService,
    private languageService: PoLanguageService
  ) {
    this.shortLanguage = languageService.getShortLanguage();
  }

  close() {
    this.overlayInvisible = true;
    this.visible = false;
  }

  // Obtém um array de todos os anos desta década
  getArrayDecade(year) {
    this.displayDecade = Array();

    if (year % 10 !== 0) {
      while (year % 10 !== 0) {
        year--;
      }
    }
    this.updateDecade(year);
  }

  getBackgroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-background-selected' : 'po-calendar-box-background';
  }

  getDayBackgroundColor(date: Date) {
    if (this.equalsDate(date, this.selectedDate)) {
      return 'po-calendar-box-background-selected';
    } else if (this.equalsDate(date, this.today)) {
      return 'po-calendar-box-background-today';
    } else if (date) {
      if (validateDateRange(date, this.dateStart, this.dateEnd)) {
        return 'po-calendar-box-background';
      } else {
        return 'po-calendar-box-background-disabled';
      }
    } else {
      return '';
    }
  }

  getDayForegroundColor(date: Date) {
    if (this.equalsDate(date, this.selectedDate)) {
      return 'po-calendar-box-foreground-selected';
    } else if (this.equalsDate(date, this.today)) {
      return 'po-calendar-box-foreground-today';
    } else {
      if (validateDateRange(date, this.dateStart, this.dateEnd)) {
        return 'po-calendar-box-foreground';
      } else {
        return 'po-calendar-box-foreground-disabled';
      }
    }
  }

  getForegroundColor(displayValue: number, propertyValue: number) {
    return displayValue === propertyValue ? 'po-calendar-box-foreground-selected' : 'po-calendar-box-foreground';
  }

  getWordMonth() {
    return this.poCalendarLangService.getWordMonth();
  }

  getWordYear() {
    return this.poCalendarLangService.getWordYear();
  }

  init() {
    this.selectedDate ? this.updateDate(this.selectedDate) : this.updateDate(this.today);

    this.initializeLanguage();

    this.selectDay();

    if (this.isMobile()) {
      this.overlayInvisible = false;
    }

    this.visible = true;
  }

  initializeLanguage() {
    this.poCalendarLangService.setLanguage(this.locale);
    this.displayWeedDays = this.poCalendarLangService.getArrayWeekDays();
    this.displayMonths = this.poCalendarLangService.getArrayMonths();
  }

  onNextMonth() {
    if (this.displayMonthNumber < 11) {
      this.updateDisplay(this.displayYear, this.displayMonthNumber + 1);
    } else {
      this.updateDisplay(this.displayYear + 1, 0);
    }
  }

  onPrevMonth() {
    if (this.displayMonthNumber > 0) {
      this.updateDisplay(this.displayYear, this.displayMonthNumber - 1);
    } else {
      this.updateDisplay(this.displayYear - 1, 11);
    }
  }

  // Ao selecionar uma data
  onSelectDate(date: Date) {
    if (validateDateRange(date, this.dateStart, this.dateEnd)) {
      this.selectedDate = date;
      this.selectedDateChange.emit(date);
      this.submit.emit(date);
    }
  }

  // Ao selecionar um mês
  onSelectMonth(year: number, month: number) {
    this.selectDay();
    this.updateDisplay(year, month);
  }

  // Ao selecionar um ano
  onSelectYear(year: number, month: number) {
    // Se veio da tela de seleção de mês
    this.lastDisplay === 'month' ? this.selectMonth() : this.selectDay();

    this.currentYear = year;
    this.updateDisplay(year, month);
  }

  selectDay() {
    this.dayVisible = true;
    this.monthVisible = false;
    this.yearVisible = false;
    this.lastDisplay = 'day';
  }

  selectMonth() {
    this.dayVisible = false;
    this.monthVisible = true;
    this.yearVisible = false;
    this.lastDisplay = 'month';
  }

  selectYear() {
    this.dayVisible = false;
    this.monthVisible = false;
    this.yearVisible = true;
  }

  setMobileVisualization() {
    return this.isMobile() ? 'po-calendar po-calendar-mobile' : 'po-calendar';
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

  private updateDate(date: Date) {
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
    this.getArrayDecade(year);
  }
}
