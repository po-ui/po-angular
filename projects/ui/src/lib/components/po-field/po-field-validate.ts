import { Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';

import { PoField } from './po-field';
import { requiredFailed } from './validators';

export abstract class PoFieldValidate<T> extends PoField<T> implements Validator {

  @Input('p-optional') optional: string;

  @Input('p-required') required: boolean;

  private onValidatorChange: any;

  abstract stateValidate(control: AbstractControl): ValidationErrors;

  validate(control: AbstractControl): ValidationErrors {

    // avaliar quando for input number (0)
    if (requiredFailed(this.required, this.disabled, control.value)) {
      return { required: {
        valid: false,
      }};
    }

    return this.stateValidate(control);
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChange = fn;
  }

  validateModel() {
    if (this.onValidatorChange) {
      this.onValidatorChange();
    }
  }

}
