import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoCalendarService } from './services/po-calendar.service';
import { PoDateService } from '../../services/po-date/po-date.service';

/**
 * @docsExtends PoCalendarBaseComponent
 *
 * @example
 *
 * <example name="po-calendar-basic" title="Portinari Calendar Basic" >
 *  <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.html"> </file>
 *  <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-calendar-labs" title="Portinari Calendar Labs" >
 *  <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.html"> </file>
 *  <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-calendar-ticket-sales" title="Portinari Calendar - Ticket Sales" >
 *  <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.html"> </file>
 *  <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-calendar',
  templateUrl: './po-calendar.component.html',
  providers: [
    PoCalendarService,
    PoCalendarLangService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoCalendarComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoCalendarComponent),
      multi: true
    }
  ]
})
export class PoCalendarComponent extends PoCalendarBaseComponent implements OnInit {
  constructor(
    private poCalendarService: PoCalendarService,
    poCalendarLangService: PoCalendarLangService,
    poDate: PoDateService
  ) {
    super(poDate, poCalendarLangService);
  }

  ngOnInit() {
    this.init();
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

  getMonthLabel() {
    return this.poCalendarLangService.getMonthLabel();
  }

  getYearLabel() {
    return this.poCalendarLangService.getYearLabel();
  }

  onNextMonth() {
    this.displayMonthNumber < 11
      ? this.updateDisplay(this.displayYear, this.displayMonthNumber + 1)
      : this.updateDisplay(this.displayYear + 1, 0);
  }

  onPreviousMonth() {
    this.displayMonthNumber > 0
      ? this.updateDisplay(this.displayYear, this.displayMonthNumber - 1)
      : this.updateDisplay(this.displayYear - 1, 11);
  }

  // Ao selecionar uma data
  onSelectDate(date: Date) {
    this.date = date;
    this.dateIso = this.poDate.convertDateToISO(date);
    if (this.propagateChange) {
      this.propagateChange(this.dateIso);
    }
    this.change.emit(this.dateIso);
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

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
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

  updateYear(value: number) {
    this.updateDisplay(this.displayYear + value, this.displayMonthNumber);
  }

  validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  validate(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  writeValue(value: any) {
    if (value) {
      this.writeDate(value);
    } else {
      this.date = undefined;
      this.updateDate(this.today);
    }
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

  private getColorForDateRange(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}`
      : `po-calendar-box-${local}-disabled`;
  }

  private getColorForToday(date: Date, local: string) {
    return this.poDate.validateDateRange(date, this.minDate, this.maxDate)
      ? `po-calendar-box-${local}-today`
      : `po-calendar-box-${local}-today-disabled`;
  }

  private getDayColor(date: Date, local: string) {
    if (this.equalsDate(date, this.date)) {
      return this.getColorForDate(date, local);
    } else if (this.equalsDate(date, this.today)) {
      return this.getColorForToday(date, local);
    } else {
      return this.getColorForDateRange(date, local);
    }
  }

  private init() {
    this.date && this.poDate.isValidIso(this.poDate.convertDateToISO(this.date))
      ? this.updateDate(this.date)
      : this.updateDate(this.today);
    this.initializeLanguage();
    this.selectDay();
  }

  private selectDateFromDate(date: Date) {
    this.date = date;
    this.onSelectDate(this.date);
  }

  private selectDateFromIso(stringDate: string) {
    const { year, month, day } = this.poDate.getDateFromIso(stringDate);
    const date = new Date(year, month - 1, day);
    this.poDate.setYearFrom0To100(date, year);
    this.date = date;
    this.onSelectDate(this.date);
  }

  private updateDate(date: Date) {
    if (date) {
      this.currentMonthNumber = date.getMonth();
      this.currentYear = date.getFullYear();
      this.updateDisplay(this.currentYear, this.currentMonthNumber);
    }
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

  private writeDate(value: any) {
    value instanceof Date ? this.selectDateFromDate(value) : this.writeDateIso(value);
    this.updateDate(this.date);
  }

  private writeDateIso(value: any) {
    this.poDate.isValidIso(value) ? this.selectDateFromIso(value) : (this.date = undefined);
  }
}
