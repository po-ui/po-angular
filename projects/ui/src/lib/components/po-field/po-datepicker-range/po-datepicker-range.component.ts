import { ChangeDetectorRef, Component, ElementRef, forwardRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoDatepickerRange } from './interfaces/po-datepicker-range.interface';
import { PoDatepickerRangeBaseComponent } from './po-datepicker-range-base.component';
import { PoDateService } from './../../../services/po-date/po-date.service';
import { PoMask } from '../po-input/po-mask';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

const arrowLeftKey = 37;
const arrowRightKey = 39;
const backspaceKey = 8;
const poDatepickerRangeDateLengthDefault = 10;

/* istanbul ignore next */
const providers = [
  {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoDatepickerRangeComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoDatepickerRangeComponent),
    multi: true
  }
];
/**
 * @docsExtends PoDatepickerRangeBaseComponent
 *
 * @example
 *
 * <example name="po-datepicker-range-basic" title="PO Datepicker Range Basic">
 *  <file name="sample-po-datepicker-range-basic/sample-po-datepicker-range-basic.component.html"> </file>
 *  <file name="sample-po-datepicker-range-basic/sample-po-datepicker-range-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-range-labs" title="PO Datepicker Range Labs">
 *  <file name="sample-po-datepicker-range-labs/sample-po-datepicker-range-labs.component.html"> </file>
 *  <file name="sample-po-datepicker-range-labs/sample-po-datepicker-range-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-range-vacations" title="PO Datepicker Range - Vacations Suggestion">
 *  <file name="sample-po-datepicker-range-vacations/sample-po-datepicker-range-vacations.component.html"> </file>
 *  <file name="sample-po-datepicker-range-vacations/sample-po-datepicker-range-vacations.component.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-range-vacations-reactive-form" title="PO Datepicker Range - Vacations Reactive Form">
 *  <file name="sample-po-datepicker-range-vacations-reactive-form/sample-po-datepicker-range-vacations-reactive-form.component.html">
 *  </file>
 *  <file name="sample-po-datepicker-range-vacations-reactive-form/sample-po-datepicker-range-vacations-reactive-form.component.ts">
 *  </file>
 * </example>
 */
@Component({
  selector: 'po-datepicker-range',
  templateUrl: './po-datepicker-range.component.html',
  providers
})
export class PoDatepickerRangeComponent extends PoDatepickerRangeBaseComponent implements AfterViewInit, OnInit {
  private poDatepickerRangeElement: ElementRef<any>;
  private poMaskObject: PoMask;

  @ViewChild('dateRangeField', { read: ElementRef, static: true }) dateRangeField: ElementRef;
  @ViewChild('endDateInput', { read: ElementRef, static: true }) endDateInput: ElementRef;
  @ViewChild('startDateInput', { read: ElementRef, static: true }) startDateInput: ElementRef;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  get enableCleaner(): boolean {
    return this.clean && (this.startDateInputValue || this.endDateInputValue) && !this.disabled && !this.readonly;
  }

  get endDateInputName(): string {
    return 'end-date';
  }

  get endDateInputValue(): string {
    return this.endDateInput.nativeElement.value;
  }

  get getErrorMessage(): string {
    return this.errorMessage !== '' && this.hasInvalidClass() ? this.errorMessage : '';
  }

  get isDateRangeInputUncompleted(): boolean {
    return (
      this.endDateInputValue.length < poDatepickerRangeDateLengthDefault &&
      this.startDateInputValue.length < poDatepickerRangeDateLengthDefault
    );
  }

  get isDirtyDateRangeInput(): boolean {
    return this.endDateInputValue.length > 0 || this.startDateInputValue.length > 0;
  }

  get startDateInputName(): string {
    return 'start-date';
  }

  get startDateInputValue(): string {
    return this.startDateInput.nativeElement.value;
  }

  static getKeyCode(event: KeyboardEvent) {
    return event.keyCode || event.which;
  }

  static getTargetElement(event: any) {
    return event.target || event.srcElement;
  }

  static isValidKey(keyCode: number): boolean {
    const isNumericKey = keyCode >= 48 && keyCode <= 57;
    const isNumericNumpadKey = keyCode >= 96 && keyCode <= 105;

    return isNumericKey || isNumericNumpadKey;
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    poDateService: PoDateService,
    poDatepickerRangeElement: ElementRef,
    poLanguageService: PoLanguageService
  ) {
    super(poDateService, poLanguageService);
    this.poDatepickerRangeElement = poDatepickerRangeElement;
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngOnInit() {
    // Classe de máscara
    this.poMaskObject = this.buildMask();
  }

  clear() {
    this.resetDateRangeInputValidation();
    this.dateRange = { start: '', end: '' };

    this.updateScreenByModel(this.dateRange);
    this.updateModel(this.dateRange);
  }

  eventOnClick($event: any) {
    this.poMaskObject.click($event);
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoDatepickerRangeComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoDatepickerRangeComponent, { static: true }) datepickerRange: PoDatepickerRangeComponent;
   *
   * focusDatepickerRange() {
   *   this.datepickerRange.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.startDateInput.nativeElement.focus();
    }
  }

  onBlur(event: any) {
    this.onTouchedModel?.();
    const isStartDateTargetEvent = event.target.name === this.startDateInputName;

    this.updateModelByScreen(isStartDateTargetEvent);

    this.removeFocusFromDatePickerRangeField();
  }

  onFocus(event: any) {
    this.applyFocusOnDatePickerRangeField();
    this.poMaskObject.resetPositions(event);
  }

  onKeydown(event?: any) {
    if (this.readonly) {
      return;
    }

    if (this.isSetFocusOnBackspace(event)) {
      event.preventDefault();
      this.setFocusOnBackspace();
    } else {
      this.poMaskObject.keydown(event);
    }
  }

  onKeyup(event: any) {
    if (this.readonly) {
      return;
    }

    const isStartDateTargetEvent = event.target.name === this.startDateInputName;

    this.setFocus(event);
    this.poMaskObject.keyup(event);
    this.updateModelWhenComplete(isStartDateTargetEvent);
  }

  resetDateRangeInputValidation() {
    this.isStartDateRangeInputValid = true;
    this.isDateRangeInputFormatValid = true;
  }

  updateScreenByModel(model: PoDatepickerRange) {
    const dateRange = { start: model.start as string, end: model.end as string };
    const isStartDateValid = this.poDateService.isDateRangeValid(dateRange.end, dateRange.start);
    const isDateValid = date => !this.dateFormatFailed(date) && isStartDateValid;

    const endDateFormated = isDateValid(dateRange.end) ? this.formatModelToScreen(dateRange.end) : '';
    const startDateFormated = isDateValid(dateRange.start) ? this.formatModelToScreen(dateRange.start) : '';

    this.endDateInput.nativeElement.value = endDateFormated;
    this.startDateInput.nativeElement.value = startDateFormated;
    this.changeDetector.detectChanges();
  }

  private applyFocusOnDatePickerRangeField() {
    this.dateRangeField.nativeElement.classList.add('po-datepicker-range-field-focused');
  }

  // Retorna um objeto do tipo PoMask com a mascara configurada.
  private buildMask(): PoMask {
    let mask = this.format.toUpperCase();

    mask = mask.replace(/DD/g, '99');
    mask = mask.replace(/MM/g, '99');
    mask = mask.replace(/YYYY/g, '9999');

    return new PoMask(mask, true);
  }

  private formatDate(format: string, day: string = '', month: string = '', year: string = ''): string {
    let dateFormatted = format;

    day = day && day.includes('T') ? day.slice(0, 2) : day;

    dateFormatted = dateFormatted.replace('dd', ('0' + day).slice(-2));
    dateFormatted = dateFormatted.replace('mm', ('0' + month).slice(-2));
    dateFormatted = dateFormatted.replace('yyyy', String(year));

    return dateFormatted;
  }

  private formatScreenToModel(value: string = ''): string {
    const [day, month, year] = value.split('/');

    return value ? this.formatDate('yyyy-mm-dd', day, month, year) : '';
  }

  private formatModelToScreen(value: string = ''): string {
    const [year, month, day] = value.split('-');

    return value ? this.formatDate(this.format, day, month, year) : '';
  }

  private getDateRangeFormatValidation(
    startDate: string,
    endDate: string,
    isStartDateTargetEvent: boolean
  ): { isValid: boolean; dateRangeModel: PoDatepickerRange } {
    this.setDateRangeInputValidation(startDate, endDate);

    return {
      isValid: this.isDateRangeInputFormatValid && this.isStartDateRangeInputValid,
      dateRangeModel: this.getValidatedModel(startDate, endDate, isStartDateTargetEvent)
    };
  }

  private getValidatedModel(startDate: string, endDate: string, isStartDateTargetEvent: boolean): PoDatepickerRange {
    const dateRangeModel = { start: '', end: '' };

    dateRangeModel.end =
      (isStartDateTargetEvent || this.isStartDateRangeInputValid) && !this.dateFormatFailed(endDate) ? endDate : '';

    dateRangeModel.start =
      (!isStartDateTargetEvent || this.isStartDateRangeInputValid) && !this.dateFormatFailed(startDate)
        ? startDate
        : '';

    return dateRangeModel;
  }

  private hasInvalidClass(): boolean {
    return (
      this.poDatepickerRangeElement.nativeElement.classList.contains('ng-invalid') &&
      this.poDatepickerRangeElement.nativeElement.classList.contains('ng-dirty')
    );
  }

  private isEqualBeforeValue(startDate: string, endDate: string): boolean {
    return this.isDateRangeInputFormatValid && endDate === this.dateRange.end && startDate === this.dateRange.start;
  }

  private isSetFocusOnBackspace(event: any) {
    return (
      event.target.name === this.endDateInputName &&
      this.endDateInput.nativeElement.selectionStart === 0 &&
      this.endDateInput.nativeElement.selectionEnd === 0 &&
      event.keyCode === backspaceKey
    );
  }

  private removeFocusFromDatePickerRangeField() {
    this.dateRangeField.nativeElement.classList.remove('po-datepicker-range-field-focused');
  }

  private setDateRangeInputValidation(startDate: string, endDate: string) {
    this.isStartDateRangeInputValid = this.poDateService.isDateRangeValid(endDate, startDate);

    this.isDateRangeInputFormatValid = !this.dateFormatFailed(startDate) && !this.dateFormatFailed(endDate);
  }

  private setFocus(event: any) {
    const inputElement = PoDatepickerRangeComponent.getTargetElement(event);
    const keyCode = PoDatepickerRangeComponent.getKeyCode(event);
    const inputName = inputElement['name'];

    this.setFocusOnArrowLeft(keyCode, inputName);
    this.setFocusOnArrowRight(keyCode, inputName, inputElement);
    this.setFocusOnStartDateCompleted(keyCode, inputName);
  }

  private setFocusAndPosition(position: number, inputElement: ElementRef, selectionRange: number) {
    this.focusOnElement(inputElement);

    setTimeout(() => {
      inputElement.nativeElement.setSelectionRange(selectionRange, selectionRange);
      this.poMaskObject.initialPosition = position;
      this.poMaskObject.finalPosition = position;
    });
  }

  private focusOnElement(inputElement: ElementRef) {
    inputElement.nativeElement.focus();
  }

  private setFocusOnArrowLeft(keyCode: number, inputName: string) {
    const isCursorAtStartOfInput = this.endDateInput.nativeElement.selectionStart === 0;

    if (inputName === this.endDateInputName && isCursorAtStartOfInput && keyCode === arrowLeftKey) {
      const inputLength = this.startDateInput.nativeElement.value.length;
      this.setFocusAndPosition(inputLength, this.startDateInput, inputLength);
    }
  }

  private setFocusOnArrowRight(keyCode: number, inputName: string, inputElement: any) {
    const isCursorAtEndOfInput = this.startDateInput.nativeElement.selectionStart === inputElement.value.length;

    if (inputName === this.startDateInputName && isCursorAtEndOfInput && keyCode === arrowRightKey) {
      this.setFocusAndPosition(0, this.endDateInput, 0);
    }
  }

  private setFocusOnBackspace() {
    const inputLength = this.startDateInput.nativeElement.value.length;

    this.startDateInput.nativeElement.value = this.startDateInputValue.slice(0, -1);
    this.setFocusAndPosition(inputLength, this.startDateInput, inputLength);
  }

  private setFocusOnStartDateCompleted(keyCode: number, inputName: string) {
    const isLastKeyPressed = this.startDateInput.nativeElement.selectionStart === poDatepickerRangeDateLengthDefault;
    const isNewDateCompleted =
      this.startDateInputValue.length === poDatepickerRangeDateLengthDefault && isLastKeyPressed;
    const isValidKey = PoDatepickerRangeComponent.isValidKey(keyCode);

    if (inputName === this.startDateInputName && isNewDateCompleted && isValidKey) {
      this.setFocusAndPosition(0, this.endDateInput, 0);
    }
  }

  private updateModelWhenComplete(isStartDateTargetEvent: boolean) {
    const endDateFormatted = this.formatScreenToModel(this.endDateInputValue);
    const startDateFormatted = this.formatScreenToModel(this.startDateInputValue);
    const dateFormatValidation = this.getDateRangeFormatValidation(
      startDateFormatted,
      endDateFormatted,
      isStartDateTargetEvent
    );

    if (this.isEqualBeforeValue(startDateFormatted, endDateFormatted)) {
      this.resetDateRangeInputValidation();
      this.validateModel(this.dateRange);
      return;
    }

    if (dateFormatValidation.isValid) {
      this.dateRange = { start: startDateFormatted, end: endDateFormatted };
      this.updateModel(this.dateRange);
      this.onChange.emit({ ...this.dateRange });
    }
  }

  private updateModelByScreen(isStartDateTargetEvent: boolean) {
    const endDateFormatted = this.formatScreenToModel(this.endDateInputValue);
    const startDateFormatted = this.formatScreenToModel(this.startDateInputValue);
    if (this.isDateRangeInputUncompleted && this.isDirtyDateRangeInput) {
      this.updateModel(this.dateRange);
      return;
    }

    if (this.isEqualBeforeValue(startDateFormatted, endDateFormatted)) {
      this.resetDateRangeInputValidation();
      this.validateModel(this.dateRange);
      return;
    }

    const dateFormatValidation = this.getDateRangeFormatValidation(
      startDateFormatted,
      endDateFormatted,
      isStartDateTargetEvent
    );

    if (dateFormatValidation.isValid) {
      this.dateRange = { start: startDateFormatted, end: endDateFormatted };
      this.updateModel(this.dateRange);
      this.onChange.emit({ ...this.dateRange });
    }

    if (!dateFormatValidation.isValid && this.verifyFormattedDates(startDateFormatted, endDateFormatted)) {
      this.dateRange = { ...dateFormatValidation.dateRangeModel };
      this.updateModel(dateFormatValidation.dateRangeModel);
    }
  }

  private verifyFormattedDates(start: string, end: string): boolean {
    return !!start || !!end;
  }
}
