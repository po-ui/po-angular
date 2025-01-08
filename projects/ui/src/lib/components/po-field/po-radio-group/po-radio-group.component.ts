import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  Input,
  IterableDiffers,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { removeDuplicatedOptions } from '../../../utils/util';

import { PoRadioComponent } from '../po-radio/po-radio.component';
import { PoRadioGroupBaseComponent } from './po-radio-group-base.component';

/**
 * @docsExtends PoRadioGroupBaseComponent
 *
 * @example
 *
 * <example name="po-radio-group-basic" title="PO Radio Group Basic">
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.html"> </file>
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.ts"> </file>
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-radio-group-labs" title="PO Radio Group Labs">
 *  <file name="sample-po-radio-group-labs/sample-po-radio-group-labs.component.html"> </file>
 *  <file name="sample-po-radio-group-labs/sample-po-radio-group-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-radio-group-translator" title="PO Radio Group - Translator">
 *  <file name="sample-po-radio-group-translator/sample-po-radio-group-translator.component.html"> </file>
 *  <file name="sample-po-radio-group-translator/sample-po-radio-group-translator.component.ts"> </file>
 * </example>
 *
 * <example name="po-radio-group-translator-reactive-form" title="PO Radio Group - Translator Reactive Form">
 *  <file name="sample-po-radio-group-translator-reactive-form/sample-po-radio-group-translator-reactive-form.component.html"> </file>
 *  <file name="sample-po-radio-group-translator-reactive-form/sample-po-radio-group-translator-reactive-form.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-radio-group',
  templateUrl: './po-radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoRadioGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoRadioGroupComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoRadioGroupComponent extends PoRadioGroupBaseComponent implements AfterViewInit, DoCheck {
  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChildren('inputRadio') radioLabels: QueryList<PoRadioComponent>;

  differ: any;

  constructor(
    differs: IterableDiffers,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.differ = differs.find([]).create(null);
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.options);
    if (change) {
      removeDuplicatedOptions(this.options);
    }
    this.cd.markForCheck();
  }

  emitAdditionalHelp() {
    if (this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }

  eventClick(value: any, disabled: any) {
    if (!disabled) {
      this.onTouched?.();
      this.changeValue(value);
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoRadioGroupComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoRadioGroupComponent, { static: true }) radio: PoRadioGroupComponent;
   *
   * focusRadio() {
   *   this.radio.focus();
   * }
   * ```
   */
  focus(): void {
    if (this.radioLabels && !this.disabled) {
      const radioLabel = this.radioLabels.find((_, index) => !this.options[index].disabled);

      if (radioLabel) {
        radioLabel.focus();
      }
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  getElementByValue(value) {
    return this.inputEl.nativeElement.querySelector(`input[value='${value}']`);
  }

  getErrorPattern() {
    return this.fieldErrorMessage && this.hasInvalidClass() ? this.fieldErrorMessage : '';
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') && this.el.nativeElement.classList.contains('ng-dirty')
    );
  }

  onBlur(radio: PoRadioComponent): void {
    if (!this.isRadioOptionFocused(radio) && this.getAdditionalHelpTooltip() && this.displayAdditionalHelp) {
      this.showAdditionalHelp();
    }
  }

  onKeyDown(event: KeyboardEvent, radio?: PoRadioComponent): void {
    if (this.isRadioOptionFocused(radio)) {
      this.keydown.emit(event);
    }
  }

  onKeyUp(event: KeyboardEvent, value) {
    const key = event.keyCode || event.which;

    if (this.isArrowKey(key)) {
      this.changeValue(value);
    }
  }

  /**
   * Método que exibe `p-additionalHelpTooltip` ou executa a ação definida em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * ```
   * <po-radio-group
   *  #radioGroup
   *  ...
   *  p-additional-help-tooltip="Mensagem de ajuda complementar"
   *  (p-keydown)="onKeyDown($event, radioGroup)"
   * ></po-radio-group>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoRadioGroupComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    return this.displayAdditionalHelp;
  }

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  private isArrowKey(key: number) {
    return key >= 37 && key <= 40;
  }

  private isRadioOptionFocused(radio: PoRadioComponent): boolean {
    return document.activeElement === radio.radioInput.nativeElement;
  }
}
