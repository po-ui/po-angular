import { Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';

import { PoField } from './po-field';

export abstract class PoFieldValidate<T> extends PoField<T> implements Validator {

  @Input('p-optional') label: string;

  @Input('p-required') required: string;

  private onValidatorChange: any;

  abstract stateValidate(control: AbstractControl): ValidationErrors;

  validate(control: AbstractControl): ValidationErrors {
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
