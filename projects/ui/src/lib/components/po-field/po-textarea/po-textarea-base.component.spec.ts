import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as ValidatorsFunctions from '../validators';
import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';

import { PoTextareaBaseComponent } from './po-textarea-base.component';

@Directive()
class PoTextareaComponent extends PoTextareaBaseComponent {
  writeValueModel(value: any): void {}
}

describe('PoTextareaBase:', () => {
  const component = new PoTextareaComponent();

  it('should be created', () => {
    expect(component instanceof PoTextareaBaseComponent).toBeTruthy();
  });

  it('should set name', () => {
    expectSettersMethod(component, 'name', '', 'name', '');
    expectSettersMethod(component, 'name', 'campo', 'name', 'campo');
  });

  it('should set disabled', () => {
    expectSettersMethod(component, 'disabled', '', '_disabled', true);
    expectSettersMethod(component, 'disabled', 'false', '_disabled', false);
    expectSettersMethod(component, 'disabled', 'true', 'disabled', true);
  });

  it('should set readonly', () => {
    expectSettersMethod(component, 'readonly', '', '_readonly', true);
    expectSettersMethod(component, 'readonly', 'false', '_readonly', false);
    expectSettersMethod(component, 'readonly', 'true', 'readonly', true);
  });

  it('should set required', () => {
    expectSettersMethod(component, 'required', '', 'required', true);
    expectSettersMethod(component, 'required', 'false', '_required', false);
    expectSettersMethod(component, 'required', 'true', '_required', true);
    expectSettersMethod(component, 'required', null, 'required', false);
  });

  it('should update property `p-rows` with valid values', () => {
    const validValues = [3, 5, '3', '5'];
    const expectValidValues = [3, 5, 3, 5];

    expectPropertiesValues(component, 'rows', validValues, expectValidValues);
  });

  it('should update property `p-rows` with `3` when invalid values', () => {
    const invalidValues = [0, 1, true, false, '', '2', 'aa', undefined, null, [], {}];

    expectPropertiesValues(component, 'rows', invalidValues, 3);
  });

  it('should register function OnChangePropagate', () => {
    component['onChangePropagate'] = undefined;
    const func = () => true;

    component.registerOnChange(func);
    expect(component['onChangePropagate']).toBe(func);
  });

  it('should register function registerOnTouched', () => {
    component['onTouched'] = undefined;
    const func = () => true;

    component.registerOnTouched(func);
    expect(component['onTouched']).toBe(func);
  });

  it('should call writeValueModel', () => {
    spyOn(component, 'writeValueModel');
    component.writeValue(1);
    expect(component.writeValueModel).toHaveBeenCalledWith(1);
  });

  it('should call onChangePropagate', () => {
    const fakeThis = component;
    spyOn<any>(component, 'onChangePropagate');
    component.callOnChange.call(fakeThis, '123');
    expect(component['onChangePropagate']).toHaveBeenCalledWith('123');
  });

  it('should not call onChangePropagate ', () => {
    const fakeThis = {
      onChangePropagate: '',
      controlChangeModelEmitter: () => true
    };
    component['modelLastUpdate'] = '123';
    spyOn<any>(component, 'onChangePropagate');
    component.callOnChange.call(fakeThis, '123');
    expect(component['onChangePropagate']).not.toHaveBeenCalled();
  });

  describe('Properties:', () => {
    it('p-maxlength: should update property p-maxlength with valid values.', () => {
      const validValues = [105, 1, 7, 0, -5];

      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'maxlength', validValues, validValues);
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-maxlength: should update property p-maxlength with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];
      expectPropertiesValues(component, 'maxlength', invalidValues, undefined);
    });

    it('p-minlength: should update property p-minlength with valid values.', () => {
      spyOn(component, <any>'validateModel');

      const validValues = [105, 1, 7, 0, -5];
      expectPropertiesValues(component, 'minlength', validValues, validValues);

      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-minlength: should update property p-minlength with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];
      expectPropertiesValues(component, 'minlength', invalidValues, undefined);
    });
  });

  describe('Methods:', () => {
    it('controlChangeModelEmitter: should not emit changeModel if previous model value is equal to current model value', () => {
      const newModelValue: number = 1;
      component['modelLastUpdate'] = 1;

      spyOn(component.changeModel, 'emit');
      component.controlChangeModelEmitter.call(component, newModelValue);
      expect(component.changeModel.emit).not.toHaveBeenCalled();
    });

    it(`controlChangeModelEmitter: should emit changeModel with new value if previous
        model value is different from current model value`, () => {
      const newModelValue: number = 2;
      component['modelLastUpdate'] = 1;

      spyOn(component.changeModel, 'emit');
      component.controlChangeModelEmitter.call(component, newModelValue);

      expect(component.changeModel.emit).toHaveBeenCalledWith(newModelValue);
    });

    it('registerOnValidatorChange: should register validatorChange function.', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    describe('validate:', () => {
      it('should return required obj if `requiredFailed` is true.', () => {
        const validObj = {
          required: {
            valid: false
          }
        };

        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

        expect(component.validate(new FormControl([]))).toEqual(validObj);
        expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
      });

      it('should return undefined if `requiredFailed` is false', () => {
        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'minlengpoailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'maxlengpoailed').and.returnValue(false);

        expect(component.validate(new FormControl(null))).toBeUndefined();
        expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
      });

      it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
        const expectedValue = true;
        component.setDisabledState(expectedValue);
        expect(component.disabled).toBe(expectedValue);
      });

      it('should return minlenght obj if `minlengpoailed` is true.', () => {
        const invalidMinlenghtError = {
          minlength: {
            valid: false
          }
        };

        spyOn(ValidatorsFunctions, 'minlengpoailed').and.returnValue(true);

        expect(component.validate(new FormControl())).toEqual(invalidMinlenghtError);
        expect(ValidatorsFunctions.minlengpoailed).toHaveBeenCalled();
      });

      it('shouldn`t invalidate form if number of digits is greater or equal than minLenght value', () => {
        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'minlengpoailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'maxlengpoailed').and.returnValue(false);

        expect(component.validate(new FormControl())).toBeUndefined();
        expect(ValidatorsFunctions.minlengpoailed).toHaveBeenCalled();
      });

      it('should return maxlenght obj if `maxlengpoailed` is true.', () => {
        const invalidMaxlenghtError = {
          maxlength: {
            valid: false
          }
        };

        spyOn(ValidatorsFunctions, 'maxlengpoailed').and.returnValue(true);

        expect(component.validate(new FormControl())).toEqual(invalidMaxlenghtError);
        expect(ValidatorsFunctions.maxlengpoailed).toHaveBeenCalled();
      });

      it('shouldn`t invalidate form if number of digits is less or equal than maxLenght value', () => {
        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'minlengpoailed').and.returnValue(false);
        spyOn(ValidatorsFunctions, 'maxlengpoailed').and.returnValue(false);

        expect(component.validate(new FormControl())).toBeUndefined();
        expect(ValidatorsFunctions.maxlengpoailed).toHaveBeenCalled();
      });
    });

    it('validateModel: should call `validatorChange` when `validateModel` is a function.', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']();

      expect(component['validatorChange']).toHaveBeenCalled();
    });

    it('validateModel: shouldn`t call `validatorChange` when `validateModel` is false.', () => {
      component['validatorChange'] = undefined;
      component['validateModel']();

      expect(component['validatorChange']).toBeUndefined();
    });
  });
});
