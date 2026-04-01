import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarMonthYearComponent } from './po-calendar-month-year/po-calendar-month-year.component';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoCalendarComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoCalendarComponent),
    multi: true
  }
];

const poCalendarRangeWidth = 600;

/**
 * @docsExtends PoCalendarBaseComponent
 *
 * @example
 *
 * <example name="po-calendar-basic" title="PO Calendar Basic" >
 *  <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.html"> </file>
 *  <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-calendar-labs" title="PO Calendar Labs" >
 *  <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.html"> </file>
 *  <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-calendar-ticket-sales" title="PO Calendar - Ticket Sales" >
 *  <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.html"> </file>
 *  <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-calendar',
  templateUrl: './po-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers,
  standalone: false
})
export class PoCalendarComponent extends PoCalendarBaseComponent implements OnInit, OnChanges {
  private readonly changeDetector = inject(ChangeDetectorRef);

  @ViewChild('monthYearPicker') monthYearPicker: PoCalendarMonthYearComponent;

  hoverValue: Date;
  selectedMonthValue: number = null;
  selectedYearValue: number = null;

  constructor() {
    const poDate = inject(PoDateService);
    const languageService = inject(PoLanguageService);

    super(poDate, languageService);
  }

  get isResponsive() {
    return window.innerWidth < poCalendarRangeWidth;
  }

  ngOnInit() {
    this.setActivateDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate || changes.maxDate) {
      this.setActivateDate();
    }
  }

  getActivateDate(partType) {
    if (this.isRange && this.activateDate) {
      return this.activateDate.start;
    } else {
      return this.activateDate;
    }
  }

  getValue(partType) {
    if (this.isRange && this.value) {
      return this.value.start;
    } else {
      return this.value;
    }
  }

  onSelectDate(selectedDate, partType?) {
    if (selectedDate === '' || selectedDate === undefined) {
      this.value = null;
      this.updateModel('');
      this.change.emit('');
      this.changeDetector.markForCheck();
      return;
    }

    let newValue;

    if (this.isRange) {
      newValue = this.getValueFromSelectedDate(selectedDate);
      this.activateDate = { start: newValue.start, end: newValue.end || newValue.start };
    } else {
      newValue = selectedDate;
      this.setActivateDate(selectedDate);
    }

    this.value = newValue;
    const newModel = this.convertDateToISO(this.value);
    this.updateModel(newModel);
    this.change.emit(newModel);
  }

  onHoverDate(date) {
    this.hoverValue = date;
  }

  onHeaderChange({ month, year }, partType) {
    this.updateActivateDateFromHeaderChange(month, year, partType);

    this.changeMonthYear.emit({ month, year });
  }

  onCloseCalendar() {
    this.change.emit(this.value);
    this.close.emit();
  }

  onMonthYearSelect(event: { month?: number; year: number }): void {
    if (this.isMonthYear) {
      this.selectedMonthValue = event.month;
      this.selectedYearValue = event.year;
      const formattedMonth = ('0' + (event.month + 1)).slice(-2);
      const modelValue = `${formattedMonth}/${event.year}`;
      this.value = modelValue;
      this.updateModel(modelValue);
      this.change.emit(modelValue);
    } else if (this.isYearOnly) {
      this.selectedYearValue = event.year;
      const modelValue = `${event.year}`;
      this.value = modelValue;
      this.updateModel(modelValue);
      this.change.emit(modelValue);
    }
    this.changeDetector.markForCheck();
  }

  onMonthYearClose(): void {
    this.close.emit();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  writeValue(value: any) {
    if (this.isMonthYear && value && typeof value === 'string') {
      this.writeMonthYearValue(value);
    } else if (this.isYearOnly && value) {
      this.writeYearValue(value);
    } else if (value) {
      this.writeDate(value);
    } else {
      this.value = null;
      this.selectedMonthValue = null;
      this.selectedYearValue = null;
    }

    if (!this.isMonthYear && !this.isYearOnly) {
      const activateDate = this.getValidateStartDate(value);
      this.setActivateDate(activateDate);
    }

    this.changeDetector.markForCheck();
  }

  private writeMonthYearValue(value: string): void {
    const parts = value.split('/');
    if (parts.length === 2) {
      this.selectedMonthValue = parseInt(parts[0], 10) - 1;
      this.selectedYearValue = parseInt(parts[1], 10);
      this.value = value;
    }
  }

  private writeYearValue(value: any): void {
    const year = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!isNaN(year)) {
      this.selectedYearValue = year;
      this.value = `${year}`;
    }
  }

  private getValidateStartDate(value) {
    if (this.isRange) {
      return value?.start || null;
    } else if (value instanceof Date || typeof value === 'string') {
      return value;
    }

    return null;
  }

  private getValueFromSelectedDate(selectedDate: Date): { start: Date; end?: Date } {
    if (!this.value?.start || this.value.start > selectedDate || (this.value.end && this.value.start)) {
      return { start: new Date(selectedDate), end: null };
    }

    return { start: new Date(this.value.start), end: new Date(selectedDate) };
  }

  private updateActivateDateFromHeaderChange(month: number, year: number, partType: string): void {
    if (!this.isRange || !this.activateDate) {
      return;
    }

    if (partType === 'start') {
      const currentStart = this.activateDate.start instanceof Date ? this.activateDate.start : new Date();
      const newStart = this.buildDateWithMonthYear(currentStart, month - 1, year);

      this.activateDate = { start: newStart, end: this.activateDate.end };
      return;
    }

    if (partType === 'end') {
      const currentEnd = this.activateDate.end instanceof Date ? this.activateDate.end : new Date();
      const newEnd = this.buildDateWithMonthYear(currentEnd, month - 1, year);

      this.activateDate = { start: this.activateDate.start, end: newEnd };
    }
  }

  private buildDateWithMonthYear(baseDate: Date, month: number, year: number): Date {
    const day = baseDate instanceof Date ? baseDate.getDate() : 1;
    const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(day, daysInTargetMonth));
  }

  private convertDateToISO(date) {
    if (this.isRange) {
      const start = date?.start instanceof Date ? this.poDate.convertDateToISO(date.start) : null;
      const end = date?.end instanceof Date ? this.poDate.convertDateToISO(date.end) : null;

      return { start, end };
    } else {
      return this.poDate.convertDateToISO(date);
    }
  }

  private convertDateFromIso(stringDate: string) {
    if (stringDate && typeof stringDate === 'string') {
      const { year, month, day } = this.poDate.getDateFromIso(stringDate);
      const date = new Date(year, month - 1, day);
      this.poDate.setYearFrom0To100(date, year);

      return date;
    }

    return null;
  }

  private updateModel(value) {
    if (this.propagateChange) {
      this.propagateChange(value);
    }
  }

  private writeDate(value: any) {
    if (this.isRange) {
      const start = value?.start;
      const end = value?.end;

      const newStart = start instanceof Date ? new Date(start) : this.convertDateFromIso(start);
      const newEnd = end instanceof Date ? new Date(end) : this.convertDateFromIso(end);

      this.value = { start: newStart, end: newEnd };
    } else {
      this.value = value instanceof Date ? new Date(value) : this.convertDateFromIso(value);
    }
  }
}
