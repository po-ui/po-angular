import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Component, ElementRef, forwardRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { minFailed, maxFailed, maxlengpoailed, minlengpoailed } from '../validators';

import { PoNumberBaseComponent } from './po-number-base.component';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @description
 *
 * po-number é um input específico para receber apenas números.
 * É possível configurar um valor mínimo, máximo e um step com p-min, p-max e p-step,
 * respectivamente.
 *
 * @example
 *
 * <example name="po-number-basic" title="Portinari Number Basic">
 *  <file name="sample-po-number-basic/sample-po-number-basic.component.html"> </file>
 *  <file name="sample-po-number-basic/sample-po-number-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-number-labs" title="Portinari Number Labs">
 *  <file name="sample-po-number-labs/sample-po-number-labs.component.html"> </file>
 *  <file name="sample-po-number-labs/sample-po-number-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-number-calculate" title="Portinari Number - Calculate">
 *  <file name="sample-po-number-calculate/sample-po-number-calculate.component.html"> </file>
 *  <file name="sample-po-number-calculate/sample-po-number-calculate.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-number',
  templateUrl: './po-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PoNumberComponent),
    multi: true,
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PoNumberComponent),
    multi: true,
  }]
})
export class PoNumberComponent extends PoNumberBaseComponent {

  @ViewChild('inp', { static: true }) inputEl: ElementRef;

  /** Valor mínimo. */
  min?: number;
  @Input('p-min') set setMin(min: string) {
    const parsedInt = parseInt(min, 10);
    this.min = !isNaN(parsedInt) ? parsedInt : undefined;
    this.validateModel();
  }

  /** Valor máximo. */
  max?: number;
  @Input('p-max') set setMax(max: string) {
    const parsedInt = parseInt(max, 10);
    this.max = !isNaN(parsedInt) ? parsedInt : undefined;
    this.validateModel();
  }

  /**
   * @optional
   *
   * @description
   *
   * Intervalo.
   *
   * @default 1
   */
  @Input('p-step') step?: string = '1';

  // constructor(el: ElementRef) {
  //   super(el);
  // }

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  get check() {
    console.log('NUMBER');
    return '';
  }

  constructor(private el: ElementRef) {
    super();
  }

  onInput(e: any) {
    let value = e.target.value;
    const valueMaxlength = this.validMaxLength(this.maxlength, value); // rever

    if (value !== valueMaxlength) {
      value = valueMaxlength;

      this.inputEl.nativeElement.value = value;
    }

    this.updateModel(this.formatNumber(value));
    this.emitChange(this.formatNumber(value));
  }

  onBlur(e) {

  }

  onFocus(e) {

  }

  onWriteValue(value: number) {
    if (this.inputEl) {
      if (value || value === 0) {
        this.inputEl.nativeElement.value = value;
      } else { // Se for o valor for undefined, deve limpar o campo
        this.inputEl.nativeElement.value = '';
      }
    }

    // Emite evento quando o model é atualizado, inclusive a primeira vez

    // this.changeModel.emit(value);
  }

  focus() {
    // throw new Error("Method not implemented.");
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  getErrorPattern() {
    return (this.errorPattern !== '' && this.hasInvalidClass()) ? this.errorPattern : '';
  }

  stateValidate(abstractControl: AbstractControl): { [key: string]: any; } {

    if (minFailed(this.min, abstractControl.value)) {
      return { min: {
        valid: false,
      }};
    }

    if (maxFailed(this.max, abstractControl.value)) {
      return { max: {
        valid: false,
      }};
    }

    if (maxlengpoailed(this.maxlength, abstractControl.value)) {
      return { maxlength: {
        valid: false,
      }};
    }

    if (minlengpoailed(this.minlength, abstractControl.value)) {
      return { minlength: {
        valid: false,
      }};
    }

    return null;
  }

  private hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      this.inputEl.nativeElement.value !== ''
    );
  }

}
