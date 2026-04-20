import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DoCheck,
  forwardRef,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarRangePreset } from './interfaces/po-calendar-range-preset.interface';
import { PO_CALENDAR_DEFAULT_RANGE_PRESETS } from './constants/po-calendar-range-presets.constant';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoCalendarLangService } from './services';
import { isMobile } from '../../utils/util';

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
 * <example name="po-calendar-range-presets" title="PO Calendar - Range and Presets" >
 *  <file name="sample-po-calendar-range-presets/sample-po-calendar-range-presets.component.html"> </file>
 *  <file name="sample-po-calendar-range-presets/sample-po-calendar-range-presets.component.ts"> </file>
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
export class PoCalendarComponent extends PoCalendarBaseComponent implements OnInit, OnChanges, DoCheck {
  @ViewChildren('monthOption') monthOptions: QueryList<HTMLButtonElement>;
  @ViewChildren('yearOption') yearOptions: QueryList<HTMLButtonElement>;

  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly poCalendarLangService = inject(PoCalendarLangService);

  hoverValue: Date;
  displayToClean: string;
  displayMonths: Array<string> = [];
  displayYears: Array<number> = [];
  focusedIndex: number = 0;
  selectedIndexMonth: number | null = null;
  selectedIndexYear: number | null = null;
  selectedMonth: number | null;
  selectedYear: number | null;

  private readonly _isRange = signal(false);
  private readonly _rangePresetsValue = signal<boolean | Array<string>>(false);
  private readonly _rangePresetOptionsValue = signal<Array<PoCalendarRangePreset> | undefined>(undefined);
  private readonly _rangePresetsOrderValue = signal<'asc' | 'desc'>('asc');
  private readonly _minDateValue = signal<Date | undefined>(undefined);
  private readonly _maxDateValue = signal<Date | undefined>(undefined);

  readonly effectivePresets = computed<Array<PoCalendarRangePreset>>(() => {
    const isRange = this._isRange();
    const rangePresets = this._rangePresetsValue();
    const rangePresetOptions = this._rangePresetOptionsValue();
    const rangePresetsOrder = this._rangePresetsOrderValue();
    const minDate = this._minDateValue();
    const maxDate = this._maxDateValue();

    if (!isRange) {
      return [];
    }

    const hasCustomPresets = rangePresetOptions !== undefined && rangePresetOptions.length > 0;
    let defaultPresets: Array<PoCalendarRangePreset> = [];

    if (Array.isArray(rangePresets)) {
      const allowedKeys = new Set(rangePresets.map(k => k.toLowerCase()));
      allowedKeys.add('today');
      defaultPresets = PO_CALENDAR_DEFAULT_RANGE_PRESETS.filter(p => allowedKeys.has(p.label.toLowerCase()));
    } else if (rangePresets) {
      defaultPresets = [...PO_CALENDAR_DEFAULT_RANGE_PRESETS];
    }

    const customPresets = hasCustomPresets ? rangePresetOptions : [];
    const combined = [...defaultPresets, ...customPresets];

    // Regra: o preset "today" é obrigatório e deve estar presente mesmo com apenas presets customizados
    if (combined.length > 0 && !combined.some(p => p.label.toLowerCase() === 'today')) {
      const todayPreset = PO_CALENDAR_DEFAULT_RANGE_PRESETS.find(p => p.label === 'today');
      if (todayPreset) {
        combined.unshift(todayPreset);
      }
    }

    if (combined.length === 0) {
      return [];
    }

    const sorted = this.sortPresetsByTemporality(combined, rangePresetsOrder);
    return this.enrichPresetsWithDisabledState(sorted, minDate, maxDate);
  });

  constructor() {
    const poDate = inject(PoDateService);
    const languageService = inject(PoLanguageService);

    super(poDate, languageService);
  }

  get isResponsive() {
    return isMobile();
  }

  ngOnInit() {
    this.setActivateDate();
    this.displayToClean = this.poCalendarLangService.getToCleanLabel();

    if (this.mode === 'month-year' || this.mode === 'year') {
      this.displayMonths = this.poCalendarLangService.getMonthsArray();
      const currentYear = new Date().getFullYear();
      this.displayYears = Array.from(
        { length: this.yearRangeLimit * 2 + 1 },
        (_, i) => currentYear - this.yearRangeLimit + i
      );
    }
  }

  private getMonthOptions(): Array<HTMLButtonElement> {
    return this.monthOptions.toArray();
  }

  private getYearOptions(): Array<HTMLButtonElement> {
    return this.yearOptions.toArray();
  }

  selectMonth(index: number, event?: KeyboardEvent, selected = false): void {
    const monthOptions = this.getMonthOptions();

    if (event?.key === 'Enter' || event?.code === 'Space' || selected) {
      this.selectedIndexMonth = index;
    }

    if (monthOptions[index]) {
      this.focusedIndex = index;
      monthOptions[index].focus();
    }

    this.selectedMonth = index + 1;

    this.updateModel(this.selectedMonth);
  }

  selectYear(index: number, event?: KeyboardEvent, selected = false, year?): void {
    const yearOptions = this.getYearOptions();

    if (event?.key === 'Enter' || event?.code === 'Space' || selected) {
      this.selectedIndexYear = index;
    }

    if (yearOptions[index]) {
      this.focusedIndex = index;
      yearOptions[index].focus();
    }

    this.selectedYear = year;
    this.updateModel(this.selectedYear);
  }

  onKeydownMonth(event: KeyboardEvent, index: number): void {
    const monthOptions = this.getMonthOptions();
    const yearOptions = this.getYearOptions();

    if (event.key === 'Enter' || event.code === 'Space') {
      this.selectMonth(index, event);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = index < monthOptions.length - 1 ? index + 1 : index;
      this.selectMonth(nextIndex, event);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = index > 0 ? index - 1 : index;
      this.selectMonth(prevIndex, event);
    } else if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const selected = yearOptions[this.selectedIndexYear];
      const enabledOptions = yearOptions.filter(btn => !btn.disabled);

      (selected || enabledOptions[0])?.focus();
    } else if (event.key === 'Tab' && event.shiftKey) {
      this.focusedIndex = 0;
      this.close.emit();
    }
  }

  onKeydownYear(event: KeyboardEvent, index: number): void {
    const monthOptions = this.getMonthOptions();
    const yearOptions = this.getYearOptions();

    if (event.key === 'Enter' || event.code === 'Space') {
      this.selectYear(index, event);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = index < yearOptions.length - 1 ? index + 1 : index;
      this.selectYear(nextIndex, event);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = index > 0 ? index - 1 : index;
      this.selectYear(prevIndex, event);
    } else if (event.key === 'Tab' && !event.shiftKey) {
      this.focusedIndex = 0;
      this.close.emit();
    } else if (event.key === 'Tab' && event.shiftKey && this.mode === 'month-year') {
      event.preventDefault();
      const selected = monthOptions[this.selectedIndexMonth];
      selected ? selected.focus() : monthOptions[0].focus();
    } else if (event.key === 'Tab' && event.shiftKey && this.mode === 'year') {
      this.close.emit();
    }
  }

  isMonthDisabled(monthIndex: number): boolean {
    if (!this.selectedYear) return false;

    const year = this.selectedYear;
    const month = monthIndex + 1;

    if (this.minDate) {
      const minYear = this.minDate.getFullYear();
      const minMonth = this.minDate.getMonth() + 1;

      if (year < minYear || (year === minYear && month < minMonth)) {
        return true;
      }
    }

    if (this.maxDate) {
      const maxYear = this.maxDate.getFullYear();
      const maxMonth = this.maxDate.getMonth() + 1;

      if (year > maxYear || (year === maxYear && month > maxMonth)) {
        return true;
      }
    }

    return false;
  }

  isYearDisabled(year: number): boolean {
    const selectedMonth = this.selectedMonth;

    const minYear = this.minDate?.getFullYear();
    const minMonth = this.minDate?.getMonth() + 1;

    const maxYear = this.maxDate?.getFullYear();
    const maxMonth = this.maxDate?.getMonth() + 1;

    if (selectedMonth !== undefined) {
      const month = selectedMonth;

      if (minYear && (year < minYear || (year === minYear && month < minMonth))) {
        return true;
      }

      if (maxYear !== undefined && (year > maxYear || (year === maxYear && month > maxMonth))) {
        return true;
      }

      return false;
    }

    if (minYear !== undefined && year < minYear) return true;
    if (maxYear !== undefined && year > maxYear) return true;

    return false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate || changes.maxDate) {
      this.setActivateDate();
    }
  }

  ngDoCheck(): void {
    this._isRange.set(this.isRange);
    this._rangePresetsValue.set(this.rangePresets);
    this._rangePresetOptionsValue.set(this.rangePresetOptions);
    this._rangePresetsOrderValue.set(this.rangePresetsOrder);
    this._minDateValue.set(this.minDate);
    this._maxDateValue.set(this.maxDate);
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
    this.selectedPresetLabel = null;

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

  onPresetSelected(event: { label: string; start: Date; end: Date }): void {
    const start = this.clampDate(event.start, this.minDate, this.maxDate);
    const end = this.clampDate(event.end, this.minDate, this.maxDate);

    if (start > end) {
      return;
    }

    this.selectedPresetLabel = event.label;
    this.value = { start, end };
    this.activateDate = { start, end };

    const newModel = this.convertDateToISO(this.value);
    this.updateModel(newModel);
    this.change.emit(newModel);
    this.changeDetector.markForCheck();
  }

  private sortPresetsByTemporality(
    presets: Array<PoCalendarRangePreset>,
    order?: 'asc' | 'desc'
  ): Array<PoCalendarRangePreset> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const todayTime = todayStart.getTime();
    const getGroup = (startDate: Date): number => {
      const startTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        0,
        0,
        0
      ).getTime();
      if (startTime > todayTime) {
        return 0; // Futuro
      }
      if (startTime < todayTime) {
        return 2; // Passado
      }
      return 1; // Presente
    };

    // Ordena em ASC: Futuro → Presente → Passado, proximidade crescente dentro de cada grupo
    const sorted = [...presets].sort((a, b) => {
      const rangeA = a.dateRange(today);
      const rangeB = b.dateRange(today);
      const startA = new Date(rangeA.start);
      const startB = new Date(rangeB.start);
      const groupA = getGroup(startA);
      const groupB = getGroup(startB);
      if (groupA !== groupB) {
        return groupA - groupB;
      }
      const distA = Math.abs(startA.getTime() - todayTime);
      const distB = Math.abs(startB.getTime() - todayTime);
      return distA - distB;
    });

    const resolvedOrder = order ?? this.rangePresetsOrder;
    // DESC: inverte completamente a lista (Passado → Presente → Futuro, mais distante primeiro)
    return resolvedOrder === 'desc' ? sorted.reverse() : sorted;
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private enrichPresetsWithDisabledState(
    presets: Array<PoCalendarRangePreset>,
    minDateInput?: Date,
    maxDateInput?: Date
  ): Array<PoCalendarRangePreset> {
    const today = new Date();

    const resolvedMinDate = minDateInput ?? this.minDate;
    const resolvedMaxDate = maxDateInput ?? this.maxDate;

    const minDate = resolvedMinDate ? this.normalizeDate(resolvedMinDate) : undefined;
    const maxDate = resolvedMaxDate ? this.normalizeDate(resolvedMaxDate) : undefined;

    return presets.map(preset => {
      const range = preset.dateRange(today);

      const start = this.normalizeDate(new Date(range.start));
      const end = this.normalizeDate(new Date(range.end));

      const isBeforeMin = minDate ? start < minDate : false;
      const isAfterMax = maxDate ? end > maxDate : false;

      const isDisabled = isBeforeMin || isAfterMax;

      return { ...preset, isDisabled };
    });
  }

  private clampDate(date: Date, min?: Date, max?: Date): Date {
    let result = new Date(date);
    if (min && result < min) {
      result = new Date(min);
    }
    if (max && result > max) {
      result = new Date(max);
    }
    return result;
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
    const MODE_YEAR = this.mode === 'year';
    const MODE_MONTH_YEAR = this.mode === 'month-year';

    let finalValue = value;

    if (MODE_MONTH_YEAR) {
      if (this.selectedMonth && this.selectedYear) {
        const month = String(this.selectedMonth).padStart(2, '0');
        finalValue = `${month}-${this.selectedYear}`;
        this.change.emit(finalValue);
      } else {
        return;
      }
    } else if (MODE_YEAR) {
      if (this.selectedYear) {
        finalValue = String(this.selectedYear);
        this.change.emit(finalValue);
      } else {
        return;
      }
    }

    if (this.propagateChange) {
      this.propagateChange(finalValue);
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
