import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoCalendarComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoCalendarComponent),
    multi: true
  }
];

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
  providers
})
export class PoCalendarComponent extends PoCalendarBaseComponent implements OnInit {
  constructor(private changeDetector: ChangeDetectorRef, poDate: PoDateService, languageService: PoLanguageService) {
    super(poDate, languageService);
  }

  ngOnInit() {
    this.setActivateDate();
  }

  getActivateDate(partType) {
    if (this.isRange && this.activateDate) {
      return this.activateDate[partType];
    } else {
      return this.activateDate;
    }
  }

  getValue(partType) {
    if (this.isRange && this.value) {
      return this.value[partType];
    } else {
      return this.value;
    }
  }

  onSelectDate(selectedDate, partType?) {
    let newValue;

    if (this.isRange) {
      newValue = this.getValueFromSelectedDate(selectedDate);

      if (partType === 'end' && (!this.value?.start || (this.value.start && this.value.end))) {
        this.setActivateDate(selectedDate);
      }
    } else {
      newValue = selectedDate;
    }

    this.value = newValue;
    const newModel = this.convertDateToISO(this.value);
    this.updateModel(newModel);
    this.change.emit(newModel);
  }

  onHeaderChange({ month, year }, partType) {
    if (this.isRange) {
      let newStart;
      let newEnd;
      const { start, end } = this.activateDate;

      if (partType === 'end') {
        const newYear = month === 0 ? year - 1 : year;

        newStart = new Date(new Date(start.setMonth(month - 1)).setFullYear(newYear));
        newEnd = new Date(new Date(end.setMonth(month)).setFullYear(year));
      } else {
        const newYear = month === 11 ? year + 1 : year;

        newEnd = new Date(new Date(end.setMonth(month + 1)).setFullYear(newYear));
        newStart = new Date(new Date(start.setMonth(month)).setFullYear(year));
      }

      this.activateDate = { start: newStart, end: newEnd };
    }
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
    if (value) {
      this.writeDate(value);
    } else {
      this.value = null;
    }

    const activateDate = this.getValidateStartDate(value);
    this.setActivateDate(activateDate);

    this.changeDetector.markForCheck();
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
    if (typeof stringDate === 'string') {
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
