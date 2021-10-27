import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

import { InputBoolean } from '../../decorators';
import { PoFieldModel } from './po-field.model';
import { requiredFailed } from './validators';

/**
 * @docsExtends PoFieldModel
 */
@Directive()
export abstract class PoFieldValidateModel<T> extends PoFieldModel<T> implements Validator {
  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') @InputBoolean() optional: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') @InputBoolean() required: boolean = false;

  private onValidatorChange;

  validate(abstractControl: AbstractControl): ValidationErrors {
    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }

    return this.extraValidation(abstractControl);
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChange = fn;
  }

  validateModel() {
    if (this.onValidatorChange) {
      this.onValidatorChange();
    }
  }

  abstract extraValidation(c: AbstractControl): { [key: string]: any };
}
