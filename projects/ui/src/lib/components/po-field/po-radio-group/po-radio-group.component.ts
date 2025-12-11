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
  ViewChildren,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setHelperSettings, PoUtils } from '../../../utils/util';

import { PoRadioComponent } from '../po-radio/po-radio.component';
import { PoRadioGroupBaseComponent } from './po-radio-group-base.component';
import { PoHelperComponent } from '../../po-helper';

/**
 * @docsExtends PoRadioGroupBaseComponent
 *
 * @example
 *
 * <example name="po-radio-group-basic" title="PO Radio Group Basic">
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.html"> </file>
 *  <file name="sample-po-radio-group-basic/sample-po-radio-group-basic.component.ts"> </file>
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
export class PoRadioGroupComponent extends PoRadioGroupBaseComponent implements AfterViewInit, DoCheck, OnChanges {
  private el = inject(ElementRef);
  private cd = inject(ChangeDetectorRef);

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChildren('inputRadio') radioLabels: QueryList<PoRadioComponent>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

  differ: any;

  constructor() {
    const differs = inject(IterableDiffers);

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
      PoUtils.removeDuplicatedOptions(this.options);
    }
    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label) {
      this.displayAdditionalHelp = false;
    }
  }

  emitAdditionalHelp() {
    if (this.label && this.isAdditionalHelpEventTriggered()) {
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
   *
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.
   *
   * ```
   * // Exemplo com p-label e p-helper
   * <po-radio-group
   *  #radioGroup
   *  ...
   *  p-label="Label do radioGroup"
   *  [p-helper]="helperOptions"
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

  setHelper(label?: string, additionalHelpTooltip?: string) {
    return setHelperSettings(
      label,
      additionalHelpTooltip,
      this.poHelperComponent(),
      this.size,
      this.isAdditionalHelpEventTriggered() ? this.additionalHelp : undefined
    );
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
