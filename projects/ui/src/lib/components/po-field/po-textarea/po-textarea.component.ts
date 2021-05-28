import { Component, ElementRef, forwardRef, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoTextareaBaseComponent } from './po-textarea-base.component';

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
  ]
})
export class PoTextareaComponent extends PoTextareaBaseComponent implements AfterViewInit {
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  valueBeforeChange: any;
  fireChange: boolean = false;

  constructor() {
    super();
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
}
