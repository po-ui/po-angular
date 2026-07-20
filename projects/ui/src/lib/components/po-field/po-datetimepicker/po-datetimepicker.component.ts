import {
  inject,
  OnDestroy,
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  forwardRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoButtonComponent } from '../../po-button';
import { PoHelperComponent } from '../../po-helper';
import { PoLanguageService } from '../../../services';
import { PoDatetimepickerLiterals } from './po-datetimepicker.literals';
import { PoCalendarComponent } from '../../po-calendar/po-calendar.component';
import { isMobile, setHelperSettings, uuid, PoUtils } from '../../../utils/util';
import { PoDatetimepickerBaseComponent } from './po-datetimepicker-base.component';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

const poCalendarContentOffset = 8;
const poCalendarPositionDefault = 'bottom-left';

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoDatetimepickerComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoDatetimepickerComponent),
    multi: true
  },
  PoControlPositionService
];

/**
 * @docsExtends PoDatetimepickerBaseComponent
 *
 * @example
 *
 * <example name="po-datetimepicker-basic" title="PO Datetimepicker Basic">
 *  <file name="sample-po-datetimepicker-basic/sample-po-datetimepicker-basic.component.html"> </file>
 *  <file name="sample-po-datetimepicker-basic/sample-po-datetimepicker-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-datetimepicker-labs" title="PO Datetimepicker Labs">
 *  <file name="sample-po-datetimepicker-labs/sample-po-datetimepicker-labs.component.html"> </file>
 *  <file name="sample-po-datetimepicker-labs/sample-po-datetimepicker-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-datetimepicker-12h-seconds" title="PO Datetimepicker - 12h with Seconds">
 *  <file name="sample-po-datetimepicker-12h-seconds/sample-po-datetimepicker-12h-seconds.component.html"> </file>
 *  <file name="sample-po-datetimepicker-12h-seconds/sample-po-datetimepicker-12h-seconds.component.ts"> </file>
 * </example>
 *
 * <example name="po-datetimepicker-scheduling" title="PO Datetimepicker - Scheduling">
 *  <file name="sample-po-datetimepicker-scheduling/sample-po-datetimepicker-scheduling.component.html"> </file>
 *  <file name="sample-po-datetimepicker-scheduling/sample-po-datetimepicker-scheduling.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-datetimepicker',
  templateUrl: './po-datetimepicker.component.html',
  providers,
  standalone: false
})
export class PoDatetimepickerComponent extends PoDatetimepickerBaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('iconCalendar') iconDatepicker: PoButtonComponent;
  @ViewChild('calendar') calendarComponent: PoCalendarComponent;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChild('dialogPicker', { read: ElementRef, static: false }) dialogPicker: ElementRef;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;
  @ViewChild('datetimepickerField', { read: ElementRef, static: true }) datetimepickerField: ElementRef;

  private readonly renderer = inject(Renderer2);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly controlPosition = inject(PoControlPositionService);

  public id = `po-datetimepicker[${uuid()}]`;
  public displayAdditionalHelp: boolean = false;
  public el: ElementRef;
  public literals: any;
  public visible: boolean = false;
  public currentPeriod: string = 'AM';
  public isInputFocused: boolean = false;

  private clickListener: () => void;
  private eventResizeListener: () => void;
  private valueBeforeChange: string = '';
  private hadValueOnOpen: boolean = false;
  private isTodayPresetInProgress: boolean = false;

  constructor() {
    const languageService = inject(PoLanguageService);
    const el = inject(ElementRef);

    super(languageService);
    this.languageService = languageService;

    this.shortLanguage = this.languageService.getShortLanguage();
    this.el = el;
    const language = languageService.getShortLanguage();
    this.literals = {
      ...PoDatetimepickerLiterals[language]
    };
  }

  ngAfterViewInit(): void {
    this.setDialogPickerStyleDisplay('none');
    if (this.autoFocus()) {
      this.focus();
    }
    if (this.iconDatepicker?.buttonElement?.nativeElement) {
      this.renderer.setAttribute(this.iconDatepicker.buttonElement.nativeElement, 'aria-label', this.literals.open);
    }
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  togglePicker(focusInput = true): void {
    if (this.isDisabled || this.isReadonly || !this.iconDatepicker?.buttonElement?.nativeElement) {
      return;
    }

    if (!this.visible) {
      this.visible = true;
      this.hadValueOnOpen = !!(this.date && this.timeValue);
      this.syncDateFromInput();
      this.setCalendarPosition();
      this.initializeListeners();
      this.syncCalendarAndTimer();

      requestAnimationFrame(() => {
        this.calendarComponent?.timerComponent?.initAllColumnOffsets();
      });

      this.renderer.setAttribute(this.inputEl.nativeElement, 'aria-expanded', 'true');
      this.renderer.setAttribute(this.iconDatepicker.buttonElement.nativeElement, 'aria-expanded', 'true');
    } else {
      this.inputEl.nativeElement.disabled = false;
      this.closeCalendar(focusInput);

      this.renderer.removeAttribute(this.inputEl.nativeElement, 'aria-expanded');
      this.renderer.removeAttribute(this.iconDatepicker.buttonElement.nativeElement, 'aria-expanded');
    }
  }

  closeCalendar(focusInput = true): void {
    this.visible = false;
    this.removeListeners();
    this.setDialogPickerStyleDisplay('none');

    if (!this.verifyMobile() && focusInput) {
      this.focus();
    }

    requestAnimationFrame(() => {
      this.iconDatepicker?.buttonElement?.nativeElement?.focus();
    });
  }

  focus(): void {
    if (!this.isDisabled && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    }
  }

  wasClickedOnPicker(event: any): void {
    if (!this.dialogPicker || !this.iconDatepicker) {
      return;
    }
    if (
      (!this.dialogPicker.nativeElement.contains(event.target) || this.hasOverlayClass(event.target)) &&
      !this.iconDatepicker.buttonElement.nativeElement.contains(event.target) &&
      !this.hasAttrCalendar(event.target)
    ) {
      this.closeCalendar();
    }
  }

  /* istanbul ignore next */
  verifyMobile() {
    return isMobile();
  }

  hasInvalidClass(): boolean {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      (this.inputEl.nativeElement.value !== '' ||
        (this.showErrorMessageRequired() && (this.isRequired || this.hasValidatorRequired)))
    );
  }

  getErrorPattern(): string {
    return this.errorPattern() !== '' && this.hasInvalidClass() ? this.errorPattern() : '';
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any): void {
    if (this.isReadonly || $event?.target !== this.inputEl?.nativeElement) {
      return;
    }

    this.objMask?.keyup($event);

    if (this.objMask?.valueToModel || this.objMask?.valueToModel === '') {
      this.processKeyupWithMask();
    } else {
      this.clearDateTimeState();
      this.syncCalendarAndTimer();
    }
  }

  private processKeyupWithMask(): void {
    const inputValue = this.inputEl.nativeElement.value;
    const minLength = this.getExpectedInputLength();

    if (this.objMask.valueToModel.length >= minLength) {
      this.tryParseCompleteInput(inputValue);
    } else {
      this.clearDateTimeState();
      this.controlModel();
      this.syncCalendarAndTimer();
    }
  }

  private tryParseCompleteInput(inputValue: string): void {
    const parsed = this.parseDateTimeFromInput(inputValue);

    if (parsed) {
      this.date = parsed.date;
      this.timeValue = this.normalizeTimeWithSeconds(parsed.time);

      if (this.is12HourFormat) {
        const hours = Number.parseInt(parsed.time.split(':')[0], 10);
        this.currentPeriod = hours >= 12 ? 'PM' : 'AM';
      }

      this.controlModel();
      this.syncCalendarAndTimer();
    } else {
      this.clearDateTimeState();
      this.controlModel();
      this.syncCalendarAndTimer();
    }
  }

  private clearDateTimeState(): void {
    this.date = undefined;
    this.timeValue = '';
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event: any): void {
    if ($event?.target === this.inputEl?.nativeElement) {
      this.keydown.emit($event);
    }

    if (this.isReadonly) {
      return;
    }

    if ($event.key === 'Escape' && this.visible) {
      this.togglePicker(false);
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }

    if ($event?.target === this.inputEl?.nativeElement) {
      this.objMask?.keydown($event);
    }
  }

  onInputFocus(): void {
    this.isInputFocused = true;
  }

  onPeriodBlur(): void {
    this.isInputFocused = false;
  }

  eventOnBlur($event: any): void {
    this.isInputFocused = false;
    this.onTouchedModel?.();
    this.objMask?.blur($event);
    this.onblur.emit();

    const inputValue = this.inputEl.nativeElement.value;

    if (!inputValue) {
      this.date = undefined;
      this.timeValue = '';
      this.callOnChange('');
      this.emitChangeIfDifferent('');
      this.syncCalendarAndTimer();
      return;
    }

    const minLength = this.getExpectedInputLength();
    if (this.objMask?.valueToModel && this.objMask.valueToModel.length >= minLength) {
      this.parseInputAndSync(inputValue);
      if (this.date && this.timeValue) {
        this.emitChangeIfDifferent(this.getModelValue());
      } else {
        this.emitChangeIfDifferent(this.literals.invalidDatetime);
      }
    } else if (inputValue) {
      this.date = undefined;
      this.timeValue = '';
      this.callOnChange(this.literals.invalidDatetime);
      this.emitChangeIfDifferent(this.literals.invalidDatetime);
      this.syncCalendarAndTimer();
    }
  }

  eventOnButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.shiftKey && this.visible) {
      const firstCombo = this.dialogPicker?.nativeElement?.querySelector('.po-combo-first .po-combo-input');
      if (firstCombo) {
        event.preventDefault();
        event.stopPropagation();
        firstCombo.focus();
      }
    }
  }

  eventOnClick($event: any): void {
    if (this.verifyMobile()) {
      $event.target.blur();
      setTimeout(() => this.togglePicker(), 0);
    } else if (!this.isReadonly) {
      this.objMask?.click($event);
    }
  }

  onFieldClick($event: any): void {
    if (this.isDisabled || this.isReadonly) {
      return;
    }

    const target = $event.target as HTMLElement;

    if (target.closest('.po-datetimepicker-field-period') || target.closest('.po-field-icon-container-right')) {
      return;
    }

    this.focus();
  }

  private isFocusOnFirstCombo(): boolean {
    const first = this.dialogPicker?.nativeElement?.querySelector('.po-combo-first .po-combo-input');
    return first === document.activeElement;
  }

  eventOnCalendarKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && event.shiftKey && this.isFocusOnFirstCombo()) {
      this.closeCalendar(false);
    }
  }

  onTimerBoundaryTab(event: { direction: string; event: KeyboardEvent; column: string }): void {
    if (event.direction === 'forward') {
      event.event.preventDefault();
      this.closeCalendar(false);
    }
  }

  onCalendarClose(): void {
    this.isTodayPresetInProgress = true;
    this.closeCalendar(false);
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    this.valueBeforeChange = this.getModelValue();
  }

  refreshValue(value: Date): void {
    if (!this.inputEl) {
      return;
    }

    if (value && value instanceof Date && !Number.isNaN(value.getTime())) {
      if (this.is12HourFormat && this.timeValue) {
        const hours = Number.parseInt(this.timeValue.split(':')[0], 10);
        this.currentPeriod = hours >= 12 ? 'PM' : 'AM';
      }
      this.inputEl.nativeElement.value = this.formatToDisplay(value, this.timeValue);
    } else if (!value) {
      this.inputEl.nativeElement.value = '';
    }

    this.cd?.markForCheck();
  }

  onTimeChange(time: string): void {
    if (!time) {
      return;
    }
    this.timeValue = this.normalizeTimeWithSeconds(time);

    if (this.date && !Number.isNaN(this.date.getTime())) {
      this.controlModel();
      this.refreshValue(this.date);
      this.emitChangeIfDifferent(this.getModelValue());

      if (this.isTodayPresetInProgress) {
        this.isTodayPresetInProgress = false;
      } else if (!this.hadValueOnOpen) {
        this.closeCalendar(true);
      }

      this.cd.markForCheck();
    }
  }

  onDateChange(date: any): void {
    if (date === null || date === undefined) {
      return;
    }

    if (date === '') {
      this.date = undefined;
      this.timeValue = '';
      this.callOnChange('');
      this.emitChangeIfDifferent('');
      this.refreshValue(undefined);
      this.closeCalendar(false);
      this.cd.markForCheck();
      return;
    }

    const parsedDate = new Date(date + 'T00:00:00');
    if (Number.isNaN(parsedDate.getTime())) {
      return;
    }

    this.date = parsedDate;

    if (this.isTodayPresetInProgress) {
      return;
    }

    if (this.timeValue) {
      this.controlModel();
      this.refreshValue(this.date);
      this.emitChangeIfDifferent(this.getModelValue());
      return;
    }

    this.refreshValue(this.date);
  }

  clear(triggeredByKeyboard = false): void {
    this.date = undefined;
    this.timeValue = '';
    this.currentPeriod = 'AM';
    this.inputEl.nativeElement.value = '';

    if (this.objMask) {
      this.objMask.valueToModel = '';
      this.objMask.valueToInput = '';
    }

    if (triggeredByKeyboard) {
      setTimeout(() => {
        this.focus();
      }, 200);
    } else {
      this.focus();
    }
    this.callOnChange('');
    this.emitChangeIfDifferent('');

    if (this.calendarComponent) {
      this.calendarComponent.writeValue(null);
      if (this.calendarComponent.timerComponent) {
        this.calendarComponent.timerComponent.writeValue(null);
      }
    }

    this.cd.markForCheck();
  }

  setHelper(label?: string, additionalHelpTooltip?: string) {
    return setHelperSettings(label, additionalHelpTooltip, this.poHelperComponent(), this.hostSize);
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.
   *
   * ```
   * // Exemplo com p-label e p-helper
   * <po-datetimepicker
   *  #datetimepicker
   *  ...
   *  p-label="Label"
   *  [p-helper]="helperOptions"
   *  (p-keydown)="onKeyDown($event, datetimepicker)"
   * ></po-datetimepicker>
   * ```
   * ```
   * onKeyDown(event: KeyboardEvent, inp: PoDatetimepickerComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    const helper = this.poHelperComponent();

    if (!this.label() && helper) {
      if (typeof helper !== 'string' && typeof helper?.eventOnClick === 'function') {
        helper.eventOnClick();
        return;
      }
      if (this.helperEl?.helperIsVisible()) {
        this.helperEl?.closeHelperPopover();
        return;
      }
      this.helperEl?.openHelperPopover();
      return;
    }
    return this.displayAdditionalHelp;
  }

  get dateTimeInputValue(): string {
    return this.inputEl.nativeElement.value;
  }

  private formatToDisplay(date: Date, time?: string): string {
    if (!date) {
      return '';
    }

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = PoUtils.formatYear(date.getFullYear());
    const separator = this.languageService.getDateSeparator(this.localeInput());

    let dateFormatted = this.format;
    dateFormatted = dateFormatted.replace('dd', day);
    dateFormatted = dateFormatted.replace('mm', month);
    dateFormatted = dateFormatted.replace('yyyy', year);
    dateFormatted = dateFormatted.replace(/\//g, separator);

    if (!time) {
      const timePlaceholder = this.showSeconds() ? '--:--:--' : '--:--';
      return `${dateFormatted} ${timePlaceholder}`;
    }

    const timeDisplay = this.formatTimeForDisplay(time);
    return `${dateFormatted} ${timeDisplay}`;
  }

  private parseInputAndSync(inputValue: string): void {
    const parsed = this.parseDateTimeFromInput(inputValue);

    if (parsed) {
      this.date = parsed.date;
      this.timeValue = this.normalizeTimeWithSeconds(parsed.time);

      if (this.is12HourFormat) {
        const hours = Number.parseInt(parsed.time.split(':')[0], 10);
        this.currentPeriod = hours >= 12 ? 'PM' : 'AM';
      }

      this.controlModel();
      this.syncCalendarAndTimer();
    } else {
      this.date = undefined;
      this.timeValue = '';
      this.callOnChange(this.literals.invalidDatetime);
    }
  }

  private parseDateTimeFromInput(inputValue: string): { date: Date; time: string } | null {
    if (!inputValue) {
      return null;
    }

    const separator = this.languageService.getDateSeparator(this.localeInput());
    const datePartLength = 10;
    const datePart = inputValue.substring(0, datePartLength);
    const timePart = inputValue.substring(datePartLength + 1).trim();

    const date = this.getDateFromFormattedString(datePart, separator);
    if (!date) {
      return null;
    }

    const time = this.parseTimeFromInput(timePart);
    if (!time) {
      return null;
    }

    return { date, time };
  }

  private getDateFromFormattedString(dateStr: string, separator: string): Date | null {
    const format = this.format.replace(/\//g, separator);
    const dayIndex = format.indexOf('dd');
    const monthIndex = format.indexOf('mm');
    const yearIndex = format.indexOf('yyyy');

    if (dayIndex === -1 || monthIndex === -1 || yearIndex === -1) {
      return null;
    }

    const day = parseInt(dateStr.substring(dayIndex, dayIndex + 2), 10);
    const month = parseInt(dateStr.substring(monthIndex, monthIndex + 2), 10) - 1;
    const year = parseInt(dateStr.substring(yearIndex, yearIndex + 4), 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    const date = new Date(year, month, day);
    PoUtils.setYearFrom0To100(date, year);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return date;
  }

  private parseTimeFromInput(timeStr: string): string | null {
    if (!timeStr) {
      return null;
    }

    return this.is12HourFormat ? this.parse12HourTime(timeStr) : this.parse24HourTime(timeStr);
  }

  private parse12HourTime(timeStr: string): string | null {
    const periodMatch = /(AM|PM)$/i.exec(timeStr);

    const period = periodMatch ? periodMatch[1].toUpperCase() : this.currentPeriod;
    const timeOnly = periodMatch ? timeStr.replace(/(AM|PM)/i, '').trim() : timeStr.trim();
    const parts = timeOnly.split(':');

    if (parts.length < 2) {
      return null;
    }

    let hours = Number.parseInt(parts[0], 10);
    const minutes = Number.parseInt(parts[1], 10);
    const seconds = this.getSeconds(parts);

    if (!this.isValid12Hour(hours, minutes)) {
      return null;
    }

    hours = this.convertTo24Hour(hours, period);

    return this.buildFormattedTime(hours, minutes, seconds);
  }

  private parse24HourTime(timeStr: string): string | null {
    const parts = timeStr.split(':');

    if (parts.length < 2) {
      return null;
    }

    const hours = Number.parseInt(parts[0], 10);
    const minutes = Number.parseInt(parts[1], 10);
    const seconds = this.getSeconds(parts);

    if (!this.isValid24Hour(hours, minutes)) {
      return null;
    }

    return this.buildFormattedTime(hours, minutes, seconds);
  }

  private getSeconds(parts: Array<string>): number | null {
    return parts.length > 2 ? Number.parseInt(parts[2], 10) : null;
  }

  private isValid12Hour(hours: number, minutes: number): boolean {
    return !(Number.isNaN(hours) || Number.isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59);
  }

  private isValid24Hour(hours: number, minutes: number): boolean {
    return !(Number.isNaN(hours) || Number.isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59);
  }

  private convertTo24Hour(hours: number, period: string): number {
    if (period === 'AM' && hours === 12) {
      return 0;
    }

    if (period === 'PM' && hours !== 12) {
      return hours + 12;
    }

    return hours;
  }

  private buildFormattedTime(hours: number, minutes: number, seconds: number | null): string | null {
    const hoursStr = this.padTime(hours);
    const minutesStr = this.padTime(minutes);

    if (seconds !== null) {
      if (!this.isValidSeconds(seconds)) {
        return null;
      }
      return `${hoursStr}:${minutesStr}:${this.padTime(seconds)}`;
    }

    if (this.showSeconds()) {
      return null;
    }

    return `${hoursStr}:${minutesStr}`;
  }

  private isValidSeconds(seconds: number): boolean {
    return !Number.isNaN(seconds) && seconds >= 0 && seconds <= 59;
  }

  private padTime(value: number): string {
    return ('0' + value).slice(-2);
  }

  private normalizeTimeWithSeconds(time: string): string {
    if (!time || !this.showSeconds()) {
      return time;
    }
    const parts = time.split(':');
    if (parts.length === 2) {
      return `${time}:00`;
    }
    return time;
  }

  private syncDateFromInput(): void {
    if (this.date) {
      return;
    }

    const inputValue = this.inputEl?.nativeElement?.value;
    if (!inputValue || inputValue.length < 10) {
      return;
    }

    const separator = this.languageService.getDateSeparator(this.localeInput());

    const fullParsed = this.parseDateTimeFromInput(inputValue);
    if (fullParsed) {
      this.date = fullParsed.date;
      this.timeValue = this.normalizeTimeWithSeconds(fullParsed.time);
      return;
    }

    const datePart = inputValue.substring(0, 10);
    const parsedDate = this.getDateFromFormattedString(datePart, separator);

    if (parsedDate) {
      this.date = parsedDate;
    }
  }

  private syncCalendarAndTimer(): void {
    if (!this.calendarComponent) {
      return;
    }

    if (this.date) {
      this.calendarComponent.writeValue(this.date);

      if (this.calendarComponent.timerComponent && this.timeValue) {
        this.calendarComponent.timerComponent.writeValue(this.timeValue);
      } else if (this.calendarComponent.timerComponent) {
        this.calendarComponent.timerComponent.writeValue(null);
      }
    } else {
      this.calendarComponent.writeValue(null);
      if (this.calendarComponent.timerComponent) {
        this.calendarComponent.timerComponent.writeValue(null);
      }
    }
  }

  private getExpectedInputLength(): number {
    let length = 16;

    if (this.showSeconds()) {
      length += 3;
    }

    return length;
  }

  private setCalendarPosition(): void {
    this.setDialogPickerStyleDisplay('block');
    this.adjustCalendarPosition();
  }

  protected adjustCalendarPosition(): void {
    if (this.dialogPicker?.nativeElement && this.visible) {
      requestAnimationFrame(() => {
        const scrollHeight =
          this.dialogPicker.nativeElement.querySelector('.po-calendar-date-time')?.scrollHeight ??
          this.dialogPicker.nativeElement.scrollHeight;
        const scrollWidth =
          this.dialogPicker.nativeElement.querySelector('.po-calendar-date-time')?.scrollWidth ??
          this.dialogPicker.nativeElement.scrollWidth;

        this.dialogPicker.nativeElement.style.height = scrollHeight + 'px';
        this.dialogPicker.nativeElement.style.width = scrollWidth + 'px';

        this.controlPosition.setElements(
          this.dialogPicker.nativeElement,
          poCalendarContentOffset,
          this.datetimepickerField,
          ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          false,
          true
        );
        this.controlPosition.adjustPosition(poCalendarPositionDefault);
      });
    }
  }

  private initializeListeners(): void {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnPicker(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      this.closeCalendar();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private removeListeners(): void {
    if (this.clickListener) {
      this.clickListener();
      this.clickListener = undefined;
    }

    if (this.eventResizeListener) {
      this.eventResizeListener();
      this.eventResizeListener = undefined;
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private readonly onScroll = (): void => {
    if (this.visible) {
      this.controlPosition.adjustPosition(poCalendarPositionDefault);
    }
  };

  private setDialogPickerStyleDisplay(value: string): void {
    if (this.dialogPicker?.nativeElement) {
      this.dialogPicker.nativeElement.style.display = value;
    }
  }

  private hasOverlayClass(element: any): boolean {
    return element?.classList?.contains('po-datetimepicker-calendar-overlay');
  }

  private hasAttrCalendar(element: any): boolean {
    const attrCalendar = 'attr-calendar';
    return element?.hasAttribute?.(attrCalendar) || element?.parentElement?.hasAttribute?.(attrCalendar);
  }

  private emitChangeIfDifferent(value: string): void {
    if (value !== this.valueBeforeChange) {
      this.valueBeforeChange = value;
      this.onchange.emit(value);
    }
  }

  onPeriodKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isReadonly && !this.isDisabled) {
        this.togglePeriod();
      }
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      this.focus();
      return;
    }

    if (event.key === 'Tab' && !event.shiftKey) {
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
    }
  }

  onPeriodClick(event: MouseEvent): void {
    if (!this.isReadonly && !this.isDisabled) {
      this.togglePeriod();
    }
  }

  private togglePeriod(): void {
    this.currentPeriod = this.currentPeriod === 'AM' ? 'PM' : 'AM';

    const inputValue = this.inputEl.nativeElement.value;
    const minLength = this.getExpectedInputLength();
    if (this.objMask?.valueToModel && this.objMask.valueToModel.length >= minLength) {
      this.parseInputAndSync(inputValue);
      if (this.date && this.timeValue) {
        this.emitChangeIfDifferent(this.getModelValue());
      }
    }
  }
}
