import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isMobile, setHelperSettings, uuid } from '../../../utils/util';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoButtonComponent } from '../../po-button/po-button.component';
import { PoTimerComponent } from '../../po-timer/po-timer.component';
import { PoTimepickerBaseComponent } from './po-timepicker-base.component';
import { PoTimepickerLiterals } from './po-timepicker.literals';
import { PoHelperComponent } from '../../po-helper';

const poTimerContentOffset = 8;
const poTimerPositionDefault = 'bottom-left';

/**
 * @docsExtends PoTimepickerBaseComponent
 *
 * @example
 *
 * <example name="po-timepicker-basic" title="PO Timepicker Basic">
 *  <file name="sample-po-timepicker-basic/sample-po-timepicker-basic.component.html"> </file>
 *  <file name="sample-po-timepicker-basic/sample-po-timepicker-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-timepicker-labs" title="PO Timepicker Labs">
 *  <file name="sample-po-timepicker-labs/sample-po-timepicker-labs.component.html"> </file>
 *  <file name="sample-po-timepicker-labs/sample-po-timepicker-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-timepicker',
  templateUrl: './po-timepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTimepickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoTimepickerComponent),
      multi: true
    },
    PoControlPositionService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTimepickerComponent extends PoTimepickerBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  private controlPosition = inject(PoControlPositionService);
  private renderer = inject(Renderer2);

  @ViewChild('timer', { static: false }) timer: PoTimerComponent;
  @ViewChild('dialogPicker', { read: ElementRef, static: false }) dialogPicker: ElementRef;
  @ViewChild('iconTimepicker') iconTimepicker: PoButtonComponent;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChild('iconClean', { read: ElementRef }) iconClean!: ElementRef<HTMLElement>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto de apoio para tooltip de ajuda adicional.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  displayAdditionalHelp: boolean = false;
  el: ElementRef;
  id = `po-timepicker[${uuid()}]`;
  visible: boolean = false;
  literals: any;

  eventListenerFunction: () => void;
  eventResizeListener: () => void;

  private clickListener: () => void;
  private timeoutChange: any;
  private valueBeforeChange: string;

  get inputValue(): string {
    return this.inputEl?.nativeElement?.value || '';
  }

  constructor() {
    const languageService = inject(PoLanguageService);
    const cd = inject(ChangeDetectorRef);
    const el = inject(ElementRef);

    super(languageService, cd);
    this.el = el;

    const language = languageService.getShortLanguage();
    this.literals = {
      ...PoTimepickerLiterals[language]
    };
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown($event: KeyboardEvent) {
    if (this.readonly) {
      return;
    }

    if ($event.key === 'Escape' && this.visible) {
      this.togglePicker(false);
      $event.preventDefault();
      $event.stopPropagation();
    }

    if ($event.key === 'Tab' && $event.shiftKey && $event.target instanceof HTMLInputElement && this.visible) {
      this.togglePicker();
    }
  }

  ngAfterViewInit() {
    this.setDialogPickerStyleDisplay('none');
    if (this.autoFocus) {
      this.focus();
    }
    if (this.iconTimepicker?.buttonElement?.nativeElement) {
      this.renderer.setAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-label', this.literals.open);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.label) {
      this.displayAdditionalHelp = false;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.removeListeners();
  }

  emitAdditionalHelp() {
    if (this.label && this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoTimepickerComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoTimepickerComponent, { static: true }) timepicker: PoTimepickerComponent;
   *
   * focusTimepicker() {
   *   this.timepicker.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  togglePicker(focusInput = true) {
    if (this.disabled || this.readonly || !this.iconTimepicker?.buttonElement?.nativeElement) {
      return;
    }

    if (!this.visible) {
      this.visible = true;
      this.setTimerPosition();
      this.initializeListeners();

      this.renderer.setAttribute(this.inputEl.nativeElement, 'aria-expanded', 'true');
      this.renderer.setAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded', 'true');
    } else {
      this.closePicker(focusInput);

      this.renderer.removeAttribute(this.inputEl.nativeElement, 'aria-expanded');
      this.renderer.removeAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded');
    }
  }

  closePicker(focusInput = true) {
    this.visible = false;
    this.removeListeners();
    this.setDialogPickerStyleDisplay('none');

    if (!this.verifyMobile() && focusInput) {
      this.focus();
    }

    if (!focusInput && this.clean && this.inputEl.nativeElement.value) {
      setTimeout(() => {
        this.iconTimepicker.focus();
      });
    }
  }

  timeSelected(value: string) {
    if (!value) {
      this.clear();
      setTimeout(() => this.closePicker(), 200);
      this.onchange.emit(undefined);
      return;
    }

    this.onTouchedModel?.();
    if (!this.verifyMobile()) {
      this.focus();
    }

    this.inputEl.nativeElement.value = value;
    this.callOnChange(value);
    this.controlChangeEmitter(value);
    this.togglePicker();
  }

  // Esconde o picker quando clicado fora
  wasClickedOnPicker(event: any): void {
    if (!this.dialogPicker || !this.iconTimepicker) {
      return;
    }
    if (
      !this.dialogPicker.nativeElement.contains(event.target) &&
      !this.iconTimepicker.buttonElement.nativeElement.contains(event.target)
    ) {
      this.closePicker();
    }
  }

  hasInvalidClass(): boolean {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      (this.inputEl.nativeElement.value !== '' ||
        (this.showErrorMessageRequired && (this.required || this.hasValidatorRequired)))
    );
  }

  getErrorPattern(): string {
    return this.errorPattern !== '' && this.hasInvalidClass() ? this.errorPattern : '';
  }

  clear() {
    this.valueBeforeChange = this.inputEl.nativeElement.value;
    this.inputEl.nativeElement.value = '';
    this.callOnChange(undefined);
    this.controlChangeEmitter(undefined);
  }

  clearAndFocus() {
    this.clear();
    setTimeout(() => {
      this.focus();
    }, 200);
  }

  eventOnBlur($event: any) {
    this.onTouchedModel?.();

    const value = this.inputEl.nativeElement.value;
    this.onblur.emit();

    if (value && this.isValidTime(value)) {
      this.callOnChange(value);
    } else if (!value) {
      this.callOnChange(undefined);
    }

    this.controlChangeEmitter(value);
  }

  eventOnClick($event: any) {
    if (this.verifyMobile()) {
      $event.target.blur();
      setTimeout(() => this.togglePicker(), 0);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const isFieldFocused = document.activeElement === this.inputEl.nativeElement;

    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Tab' && event.shiftKey && !this.visible && this.clean && this.inputEl.nativeElement.value) {
      this.iconClean?.nativeElement?.focus();
      event.preventDefault();
      return;
    }

    if (event.key === 'Tab' && event.shiftKey && !this.visible) {
      this.focus();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Auto-formatação básica: insere ':' após 2 dígitos
    const digits = value.replace(/[^\d]/g, '');
    if (digits.length >= 2 && !value.includes(':')) {
      value = digits.substring(0, 2) + ':' + digits.substring(2);
      input.value = value;
    }

    if (this.isValidTime(value)) {
      this.callOnChange(value);
      if (this.timer) {
        this.timer.setValueFromString(value);
      }
    }
  }

  // Função implementada do ControlValueAccessor
  writeValue(value: string) {
    if (this.inputEl && value) {
      this.inputEl.nativeElement.value = value;
      this.callOnChange(value, false);

      if (this.timer) {
        this.timer.setValueFromString(value);
      }
    } else if (this.inputEl) {
      this.inputEl.nativeElement.value = '';
      this.callOnChange(undefined, false);
    }

    this.valueBeforeChange = value;
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   *
   * ```
   * import { PoTimepickerComponent } from '@po-ui/ng-components';
   *
   * @ViewChild(PoTimepickerComponent, { static: true }) timepicker: PoTimepickerComponent;
   *
   * onKeyDown(event: KeyboardEvent, inp: PoTimepickerComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    const helper = this.poHelperComponent();
    const isHelpEvt = this.isAdditionalHelpEventTriggered();
    if (!this.label && (helper || this.additionalHelpTooltip || isHelpEvt)) {
      if (isHelpEvt) {
        this.additionalHelp.emit();
      }
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

  onTimerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closePicker();
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === 'Tab' && !event.shiftKey) {
      this.closePicker(false);
    }

    if (event.key === 'Tab' && event.shiftKey) {
      this.closePicker();
      event.preventDefault();
    }
  }

  handleCleanKeyboardTab(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey && this.visible) {
      event.preventDefault();
    }
  }

  setHelper(label: string, additionalHelpTooltip: string): any {
    return setHelperSettings(label, additionalHelpTooltip, this.poHelperComponent(), this.additionalHelpEventTrigger);
  }

  /* istanbul ignore next */
  verifyMobile(): boolean {
    return !!isMobile();
  }

  private controlChangeEmitter(value: string) {
    const currentValue = value;

    if (this.valueBeforeChange !== currentValue) {
      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.onchange.emit(currentValue);
      }, 200);
    }
    this.valueBeforeChange = currentValue;
  }

  private initializeListeners(): void {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnPicker(event);
    });
    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      this.closePicker();
    });

    this.setDialogPickerStyleDisplay('');
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      (this.additionalHelp?.observed && !this.additionalHelpTooltip) ||
      this.additionalHelpEventTrigger === 'event'
    );
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
  }

  private setDialogPickerStyleDisplay(value: string): void {
    if (this.dialogPicker) {
      this.renderer.setStyle(this.dialogPicker.nativeElement, 'display', value);
    }
  }

  private setTimerPosition(): void {
    this.controlPosition.setElements(this.dialogPicker.nativeElement, poTimerContentOffset, this.inputEl, [
      'bottom-left',
      'top-left'
    ]);
    this.controlPosition.adjustPosition(poTimerPositionDefault);
  }
}
