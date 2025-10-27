import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  ViewChild,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setHelperSettings, uuid } from '../../../utils/util';

import { PoTextareaBaseComponent } from './po-textarea-base.component';
import { PoHelperComponent } from '../../po-helper';

/**
 * @docsExtends PoTextareaBaseComponent
 *
 * @example
 *
 * <example name="po-textarea-basic" title="PO Textarea Basic" >
 *  <file name="sample-po-textarea-basic/sample-po-textarea-basic.component.html"> </file>
 *  <file name="sample-po-textarea-basic/sample-po-textarea-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-textarea-labs" title="PO Textarea Labs" >
 *  <file name="sample-po-textarea-labs/sample-po-textarea-labs.component.html"> </file>
 *  <file name="sample-po-textarea-labs/sample-po-textarea-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-textarea-email" title="PO Textarea - Email" >
 *  <file name="sample-po-textarea-email/sample-po-textarea-email.component.html"> </file>
 *  <file name="sample-po-textarea-email/sample-po-textarea-email.component.ts"> </file>
 * </example>
 *
 * <example name="po-textarea-email-reactive-form" title="PO Textarea - Email Reactive Form" >
 *  <file name="sample-po-textarea-email-reactive-form/sample-po-textarea-email-reactive-form.component.html"> </file>
 *  <file name="sample-po-textarea-email-reactive-form/sample-po-textarea-email-reactive-form.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-textarea',
  templateUrl: './po-textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTextareaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoTextareaComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoTextareaComponent extends PoTextareaBaseComponent implements AfterViewInit, OnChanges {
  private el = inject(ElementRef);

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

  id = `po-textarea[${uuid()}]`;
  valueBeforeChange: any;
  fireChange: boolean = false;

  constructor() {
    const cd = inject(ChangeDetectorRef);

    super(cd);
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
   * import { PoTextareaComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoTextareaComponent, { static: true }) textarea: PoTextareaComponent;
   *
   * focusTextarea() {
   *   this.textarea.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label) {
      this.displayAdditionalHelp = false;
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  getErrorPattern() {
    return this.fieldErrorMessage && this.hasInvalidClass() ? this.fieldErrorMessage : '';
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      !this.inputEl.nativeElement.value &&
      (this.required || this.hasValidatorRequired)
    );
  }

  writeValueModel(value: any): void {
    if (this.inputEl) {
      if (!value) {
        // Se for o valor for undefined, deve limpar o campo
        this.inputEl.nativeElement.value = '';
      } else {
        this.inputEl.nativeElement.value = value;
      }
    }

    // Emite evento quando o model é atualizado, inclusive a primeira vez
    if (value) {
      this.change.emit(value);
    }
  }

  validMaxLength(maxlength: number, value: string) {
    return maxlength && value.length > maxlength ? value.toString().substring(0, maxlength) : value;
  }

  eventOnInput(event: any) {
    const value = this.validMaxLength(this.maxlength, event.target.value);
    this.callOnChange(value);
    this.inputEl.nativeElement.value = value;
  }

  eventOnFocus() {
    // Atualiza valor da variável que será usada para verificar se o campo teve alteração
    this.valueBeforeChange = this.inputEl.nativeElement.value;

    // Dispara evento quando o usuário entrar no campo
    // Este evento também é disparado quando o campo inicia com foco.
    this.enter.emit();
  }

  eventOnBlur() {
    this.onTouched?.();
    this.blur.emit();
    this.controlChangeEmitter();
  }

  controlChangeEmitter() {
    const elementValue = this.inputEl.nativeElement.value;

    if (elementValue !== this.valueBeforeChange) {
      this.change.emit(elementValue);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const isFieldFocused = document.activeElement === this.inputEl.nativeElement;

    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.
   *
   * ```
   * //Exemplo com p-label e p-helper
   * <po-textarea
   *  #textarea
   *  ...
   *  p-label="Label do textarea"
   *  [p-helper]="helperOptions"
   *  (p-keydown)="onKeyDown($event, textarea)"
   * ></po-textarea>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoTextareaComponent): void {
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

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
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
}
