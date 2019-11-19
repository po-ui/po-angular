import { AfterViewInit, Component, ElementRef, forwardRef, HostListener, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { formatYear, isMobile, setYearFrom0To100 } from '../../../utils/util';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';

import { PoCalendarComponent } from './po-calendar/po-calendar.component';
import { PoDatepickerBaseComponent } from './po-datepicker-base.component';

const poCalendarContentOffset = 8;
const poCalendarPositionDefault = 'bottom-left';

/**
 * @docsExtends PoDatepickerBaseComponent
 *
 * @example
 *
 * <example name="po-datepicker-basic" title="Portinari Datepicker Basic">
 *  <file name="sample-po-datepicker-basic/sample-po-datepicker-basic.component.html"> </file>
 *  <file name="sample-po-datepicker-basic/sample-po-datepicker-basic.component.ts"> </file>
 *  <file name="sample-po-datepicker-basic/sample-po-datepicker-basic.component.po.ts"> </file>
 *  <file name="sample-po-datepicker-basic/sample-po-datepicker-basic.component.e2e-spec.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-labs" title="Portinari Datepicker Labs">
 *  <file name="sample-po-datepicker-labs/sample-po-datepicker-labs.component.html"> </file>
 *  <file name="sample-po-datepicker-labs/sample-po-datepicker-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-airfare" title="Portinari Datepicker - Airfare">
 *  <file name="sample-po-datepicker-airfare/sample-po-datepicker-airfare.component.html"> </file>
 *  <file name="sample-po-datepicker-airfare/sample-po-datepicker-airfare.component.ts"> </file>
 * </example>
 *
 * <example name="po-datepicker-airfare-reactive-form" title="Portinari Datepicker - Airfare Reactive Form">
 *  <file name="sample-po-datepicker-airfare-reactive-form/sample-po-datepicker-airfare-reactive-form.component.html"> </file>
 *  <file name="sample-po-datepicker-airfare-reactive-form/sample-po-datepicker-airfare-reactive-form.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-datepicker',
  templateUrl: './po-datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoDatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoDatepickerComponent),
      multi: true,
    },
    PoControlPositionService
  ]
})
export class PoDatepickerComponent extends PoDatepickerBaseComponent implements AfterViewInit, OnDestroy {

  date;
  el: ElementRef;
  hour: string;

  private clickListener;
  private readonly dateRegex = new RegExp('^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' +
  '(?:0[1-9]|1[0-2])-' +
  '(?:0[1-9]|[12]\\d|3[01])$');
  private readonly isoRegex = new RegExp('^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' +
  '(?:0[1-9]|1[0-2])-' +
  '(?:0[1-9]|[12]\\d|3[01])' +
  'T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|-0[1-9]|-1\\d|-2[0-3]|' +
  '-00:?(?:0[1-9]|[0-5]\\d)|\\+[01]\\d|\\+2[0-3])' +
  '(?:|:?[0-5]\\d)$');
  private timeoutChange: any;
  private valueBeforeChange: string;

  eventListenerFunction: () => void;
  eventResizeListener: () => void;

  @ViewChild('calendar', { static: true }) calendar: PoCalendarComponent;
  @ViewChild('dialogPicker', { read: ElementRef, static: true }) dialogPicker: ElementRef;
  @ViewChild('iconDatepicker', { read: ElementRef, static: true }) iconDatepicker: ElementRef;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  constructor(private controlPosition: PoControlPositionService, private renderer: Renderer2, el: ElementRef) {
    super();
    this.el = el;
  }

  ngAfterViewInit() {
    this.setDialogPickerStyleDisplay('none');
    // Põe o foco no Input, setado pelo p-focus
    if (this.autofocus) {
      this.inputEl.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoDatepickerComponent } from '@portinari/portinari-ui';
   *
   * ...
   *
   * @ViewChild(PoDatepickerComponent, { static: true }) datepicker: PoDatepickerComponent;
   *
   * focusDatepicker() {
   *   this.datepicker.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  togglePicker() {
    if (this.disabled || this.readonly) {
      return;
    }

    if (!this.calendar.visible) {
      this.calendar.init();
      this.setCalendarPosition();
      this.initializeListeners();

    } else {
      this.inputEl.nativeElement.disabled = false;
      this.closeCalendar();
    }
  }

  dateSelected() {
    if (!this.verifyMobile()) {
      this.inputEl.nativeElement.focus();
    }

    this.inputEl.nativeElement.value = this.formatToDate(this.date);
    this.controlModel(this.date);
    this.controlChangeEmitter();
    this.closeCalendar();
  }

  // Esconde Picker quando for clicado fora
  wasClickedOnPicker(event: any): void {
    if (!this.dialogPicker || !this.iconDatepicker) {
      return;
    }

    if ((!this.dialogPicker.nativeElement.contains(event.target) || this.hasOverlayClass(event.target)) &&
      !this.iconDatepicker.nativeElement.contains(event.target) && !this.hasAttrCalendar(event.target)) {
        this.closeCalendar();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    if (this.readonly) {
      return;
    }

    this.objMask.keyup($event);
    // Controla a atualização do model, verificando se a data é valida
    if (this.objMask.valueToModel || this.objMask.valueToModel === '') {
      if (this.objMask.valueToModel.length >= 10) {
        this.controlModel(this.getDateFromString(this.inputEl.nativeElement.value));
        this.date = this.getDateFromString(this.inputEl.nativeElement.value);
      } else {
        this.date = undefined;
        this.controlModel(this.date);
      }
    } else {
      this.date = undefined;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event?: any) {
    if (this.readonly) {
      return;
    }

    this.objMask.keydown($event);
  }

  hasInvalidClass() {
    return (this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      this.inputEl.nativeElement.value !== '');
  }

  getErrorPattern() {
    return (this.errorPattern !== '' && this.hasInvalidClass()) ? this.errorPattern : '';
  }

  clear() {
    this.valueBeforeChange = this.formatToDate(this.date);
    this.date = undefined;
    this.controlModel(this.date);

    this.controlChangeEmitter();
  }

  eventOnBlur($event: any) {

    const date = this.inputEl.nativeElement.value;
    const newDate = date ? this.getDateFromString(date) : undefined;
    this.objMask.blur($event);
    this.onblur.emit();

    if (this.objMask.valueToModel) {
      if (this.objMask.valueToModel.length >= 10) {
        this.controlModel(newDate);
        this.date = newDate;
      } else {
        this.date = undefined;
        this.controlModel(this.date);
      }

    } else {
      this.date = undefined;
      this.callOnChange(this.date);
    }

    this.controlChangeEmitter();

  }

  eventOnClick($event) {
    if (this.verifyMobile()) {
      $event.target.blur();

      // abre o calendar quando clicar no input somente no mobile
      setTimeout(() => this.togglePicker(), 0);
    } else {
      // Atualiza a posição do cursor ao clicar
      this.objMask.click($event);
    }
  }

  formatToDate(value: Date) {
    if (!value) {
      return undefined;
    }

    let dateFormatted = this.format;

    dateFormatted = dateFormatted.replace('dd', ('0' + value.getDate()).slice(-2));
    dateFormatted = dateFormatted.replace('mm', ('0' + (value.getMonth() + 1)).slice(-2));
    dateFormatted = dateFormatted.replace('yyyy', formatYear(value.getFullYear()));

    return dateFormatted;
  }

  refreshValue(value: Date) {
    if (value) {
      this.inputEl.nativeElement.value = this.formatToDate(value);
    }
  }

  // Função implementada do ControlValueAccessor
  writeValue(value: any) {
    if (this.inputEl && value) {
      if (value instanceof Date) {
        const dateString = value.toString();
        this.hour = 'T' + dateString.substring(16, 24) + dateString.substring(28, 31) + ':' + dateString.substring(31, 33);
        this.date = value;
        this.inputEl.nativeElement.value = this.formatToDate(value);

      } else if (this.isValidDateIso(value) || this.isValidExtendedIso(value)) {

        if (this.isValidExtendedIso(value)) {
          this.hour = value.substring(10, 25);
        }

        if (this.isoFormat === undefined) {
          this.isExtendedISO = this.isValidExtendedIso(value);
        }

        const day = parseInt(value.substring(8, 10), 10);
        const month = parseInt(value.substring(5, 7), 10) - 1;
        const year = parseInt(value.substring(0, 4), 10);

        const dateTemp = new Date(year, month, day);

        setYearFrom0To100(dateTemp, year);

        this.date = dateTemp;
        this.inputEl.nativeElement.value = this.formatToDate(dateTemp);
      } else {
        this.inputEl.nativeElement.value = '';
        this.date = undefined;
      }
      this.controlModel(this.date);
    } else if (this.inputEl) {
      this.inputEl.nativeElement.value = '';
      this.date = undefined;
    }

    this.valueBeforeChange = this.formatToDate(this.date);
  }

  isValidDateIso(value: string) {
    return this.dateRegex.test(value);
  }

  isValidExtendedIso(value) {
    return this.isoRegex.test(value);
  }

  hasOverlayClass(element: any) {
    return element.classList.contains('po-calendar-overlay');
  }

  /* istanbul ignore next */
  verifyMobile() {
    return isMobile();
  }

  private closeCalendar() {
    this.calendar.close();
    this.removeListeners();
    this.setDialogPickerStyleDisplay('none');
  }

  private controlChangeEmitter() {
    const dateModelFormatted = this.formatToDate(this.date);

    if (dateModelFormatted !== this.valueBeforeChange) {
      this.valueBeforeChange = dateModelFormatted;

      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.onchange.emit(dateModelFormatted);
      }, 200);
    }
  }

  private hasAttrCalendar(element: any) {
    const attrCalendar = 'attr-calendar';

    return (element && element.hasAttribute(attrCalendar)) || (element.parentElement && element.parentElement.hasAttribute(attrCalendar));
  }

  private initializeListeners() {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnPicker(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      this.closeCalendar();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private onScroll = (): void => {
    this.controlPosition.adjustPosition(poCalendarPositionDefault);
  }

  private removeListeners() {
    if (this.clickListener) {
      this.clickListener();
    }

    if (this.eventResizeListener) {
      this.eventResizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private setDialogPickerStyleDisplay(value) {
    this.dialogPicker.nativeElement.style.display = value;
  }

  private setCalendarPosition() {
    this.setDialogPickerStyleDisplay('block');

    this.controlPosition.setElements(
      this.dialogPicker.nativeElement,
      poCalendarContentOffset,
      this.inputEl,
      ['top-left', 'bottom-left'],
      false,
      true
    );

    this.controlPosition.adjustPosition(poCalendarPositionDefault);
  }

}
