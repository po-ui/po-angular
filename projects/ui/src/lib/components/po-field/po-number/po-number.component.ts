import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Component, ElementRef, forwardRef, Input, ViewChild, ChangeDetectionStrategy, AfterViewInit, Renderer2 } from '@angular/core';

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
export class PoNumberComponent extends PoNumberBaseComponent implements AfterViewInit {

  @ViewChild('inp', { static: true }) inputElement: ElementRef<HTMLInputElement>;

  valueBeforeChange: any;
  timeoutChange;

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

  // get autocomplete() {
  //   return this.noAutocomplete ? 'off' : 'on';
  // }

  get check() {
    // console.log('NUMBER');
    return '';
  }

  constructor(renderer: Renderer2, private el: ElementRef) {
    super(renderer);
  }

  // ngAfterViewInit() {
  //   if (this.autoFocus) {
  //     this.focus();
  //   }
  // }

  updateModel(e) {
    super.updateModel(e);
    // this.updateModel(e);
    this.emitChangeModel(e);
  }

  onInput(inputValue: any) {
    const valueMaxlength = this.validMaxLength(this.maxlength, inputValue); // rever

    if (inputValue !== valueMaxlength) {
      inputValue = valueMaxlength;

      this.inputElement.nativeElement.value = inputValue;
    }

    this.updateModel(this.formatNumber(inputValue));
    // this.emitChangeModel(this.formatNumber(value));
  }

  onFocus(e) {
    this.valueBeforeChange = this.inputElement.nativeElement.value;

    this.emitEnter();
  }

  // controlChangeEmitter() {
  //   const elementValue = this.inputElement.nativeElement.value;

  //   // Emite o evento change manualmente quando o campo é alterado
  //   // Este evento é controlado manualmente devido ao preventDefault existente na máscara
  //   // e devido ao controle do p-clean, que também precisa emitir change
  //   // console.log(elementValue, this.valueBeforeChange)
  //   if (elementValue !== this.valueBeforeChange) {
  //     clearTimeout(this.timeoutChange);
  //     this.timeoutChange = setTimeout(() => {
  //       this.emitChange(elementValue);
  //     }, 200);
  //   }
  // }

  onWriteValue(value: number) {
    if (this.inputElement) {
      if (value || value === 0) {
        this.inputElement.nativeElement.value = <any> value;
      } else { // Se for o valor for undefined, deve limpar o campo
        this.inputElement.nativeElement.value = '';
      }
    }

    // Emite evento quando o model é atualizado, inclusive a primeira vez

    // this.changeModel.emit(value);
  }

  // focus() {
  //   // throw new Error("Method not implemented.");
  //   if (!this.disabled) {
  //     this.inputElement.nativeElement.focus();
  //   }
  // }

  getErrorPattern() {
    return (this.errorPattern !== '' && this.hasInvalidClass()) ? this.errorPattern : '';
  }

  stateValidate(abstractControl: AbstractControl): ValidationErrors {

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
      this.inputElement.nativeElement.value !== ''
    );
  }

}
