import { AbstractControl } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';

import { PoFieldValidateModel } from './po-field-validate.model';
import * as ValidatorsFunctions from './validators';

class FieldValidate extends PoFieldValidateModel<any> {
  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  onWriteValue() {}
}

describe('PoFieldValidateModel', () => {
  let component: FieldValidate;

  beforeEach(() => {
    component = new FieldValidate();
  });

  it('registerOnValidatorChange: should register validatorChange function.', () => {
    const registerOnValidatorChangeFn = () => {};

    component.registerOnValidatorChange(registerOnValidatorChangeFn);
    expect(component['onValidatorChange']).toBe(registerOnValidatorChangeFn);
  });

  it('should return null in validate', () => {
    component.required = true;
    expect(component.validate(new UntypedFormControl(''))).not.toBeNull();
  });

  it('should return object invalid in validate', () => {
    component.required = true;
    expect(component.validate(new UntypedFormControl('test'))).toBeNull();
  });

  it('validateModel: should call `onValidatorChange` when it is true.', () => {
    component['onValidatorChange'] = () => {};

    spyOn(component, <any>'onValidatorChange');

    component['validateModel']();

    expect(component['onValidatorChange']).toHaveBeenCalled();
  });

  it('validateModel: should`t call `onValidatorChange` when it is false.', () => {
    component['onValidatorChange'] = false;
    component['validateModel']();

    expect(component['onValidatorChange']).not.toBeUndefined();
  });

  it('validate: should return required obj when `requiredFailed` is true.', () => {
    const validObj = {
      required: {
        valid: false
      }
    };

    spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

    expect(component.validate(new UntypedFormControl([]))).toEqual(validObj);
    expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
  });

  it('validate: should return undefined when `requiredFailed` is false', () => {
    spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

    expect(component.validate(new UntypedFormControl(null))).toBeNull();
    expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
  });
});
