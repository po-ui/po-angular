import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

import { convertToBoolean } from '../..//utils/util';
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
  @Input({ alias: 'p-optional', transform: convertToBoolean }) optional: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input({ alias: 'p-required', transform: convertToBoolean }) required: boolean = false;

  /**
   *  Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

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
