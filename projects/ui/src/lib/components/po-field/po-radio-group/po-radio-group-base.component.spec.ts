import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as UtilsFunction from '../../../utils/util';
import * as ValidatorsFunctions from '../validators';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoRadioGroupBaseComponent } from './po-radio-group-base.component';

@Directive()
class PoRadioGroup extends PoRadioGroupBaseComponent {
  inputEl = {
    checked: false,
    value: ''
  };

  getElementByValue(value: any) {
    return {};
  }
}

describe('PoRadioGroupBase: ', () => {
  const component = new PoRadioGroup();

  it('should be instance of PoRadioGroupBaseComponent', () => {
    expect(component instanceof PoRadioGroupBaseComponent).toBeTruthy();
  });

  it('should set options', () => {
    component['options'] = [];
    expect(component['options']).toEqual([]);
  });

  it('should register function OnChangePropagate', () => {
    component['onChangePropagate'] = undefined;
    const func = () => true;

    component.registerOnChange(func);
    expect(component['onChangePropagate']).toBe(func);
  });

  it('should emit change when value is different', () => {
    component.value = '2';
    component['onChangePropagate'] = (v: any) => {};

    spyOn(component.change, 'emit');
    spyOn(component, <any>'onChangePropagate');
    component.changeValue('1');
    expect(component.change.emit).toHaveBeenCalled();
    expect(component['onChangePropagate']).toHaveBeenCalled();
  });

  it('shouldn`t emit change when value is different', () => {
    component.value = '1';
    component['onChangePropagate'] = (v: any) => {};

    spyOn(component.change, 'emit');
    spyOn(component, <any>'onChangePropagate');
    component.changeValue('1');
    expect(component.change.emit).not.toHaveBeenCalled();
    expect(component['onChangePropagate']).toHaveBeenCalled();
  });

  it('shouldn`t call onChangePropagate if it is undefined', () => {
    component.value = '1';
    component['onChangePropagate'] = (v: any) => {};

    spyOn(component.change, 'emit');
    const spy = spyOn(component, <any>'onChangePropagate');
    component['onChangePropagate'] = undefined;
    component.changeValue('1');
    expect(component.change.emit).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  describe('Methods: ', () => {
    const onChangePropagate: any = 'onChangePropagate';

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('writeValue: should set `value` to undefined and call `onChangePropagate`', () => {
      const modelValue = '1';

      component.value = '2';
      component[onChangePropagate] = () => {};

      spyOn(component, 'getElementByValue').and.returnValue(false);
      spyOn(component, onChangePropagate);

      component.writeValue(modelValue);

      expect(component.value).toBeUndefined();
      expect(component.getElementByValue).toHaveBeenCalled();
      expect(component[onChangePropagate]).toHaveBeenCalled();
    });

    it('writeValue: should set `value` to modelValue param and not call `onChangePropagate`', () => {
      const modelValue = '3';

      component.value = undefined;
      component[onChangePropagate] = () => {};

      spyOn(component, 'getElementByValue').and.returnValue(true);
      spyOn(component, onChangePropagate);

      component.writeValue(modelValue);

      expect(component.value).toBe(modelValue);
      expect(component.getElementByValue).toHaveBeenCalled();
      expect(component[onChangePropagate]).not.toHaveBeenCalled();
    });

    it('validateModel: should call `validatorChange` if `validatorChange` is defined', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']();

      expect(component['validatorChange']).toHaveBeenCalled();
    });

    it('validateModel: shouldn`t call `validatorChange` if it is undefined', () => {
      component['validatorChange'] = undefined;

      component['validateModel']();

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validate: should return required obj if `requiredFailed` is true', () => {
      const formControl = new FormControl(undefined);
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new FormControl(formControl))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined if `requiredFailed` is false', () => {
      const formControl = new FormControl('1');

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(formControl)).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('checkColumnsRange: should return `true` if columns are between columns range', () => {
      const columns = 2;
      const maxColumns = 4;

      expect(component['checkColumnsRange'](columns, maxColumns)).toBe(true);
    });

    it('checkColumnsRange: should return `false` if columns aren`t between columns range', () => {
      const columns = 0;
      const maxColumns = 2;

      expect(component['checkColumnsRange'](columns, maxColumns)).toBe(false);
    });

    it('getGridSystemColumns: should return `4 grid system columns` if `columns` are between columns range', () => {
      const columns = 3;
      const maxColumns = 4;

      expect(component['getGridSystemColumns'](columns, maxColumns)).toBe(4);
    });

    it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
      const expectedValue = true;
      component.setDisabledState(expectedValue);
      expect(component.disabled).toBe(expectedValue);
    });

    it('getGridSystemColumns: should return `6 grid system columns` if `columns` aren`t between columns range', () => {
      const columns = 7;
      const maxColumns = 4;

      expect(component['getGridSystemColumns'](columns, maxColumns)).toBe(6);
    });
  });

  describe('Properties:', () => {
    const validValues = [true, 'true', 1, ''];
    const invalidValues = [false, 'false', 0, null, undefined, NaN];
    const validateModel: any = 'validateModel';

    it('p-disabled: should be update with valid and invalid values.', () => {
      spyOn(component, validateModel);

      expectPropertiesValues(component, 'disabled', validValues, true);
      expectPropertiesValues(component, 'disabled', invalidValues, false);
      expect(component[validateModel]).toHaveBeenCalled();
    });

    it('p-required: should be update with valid and invalid values.', () => {
      spyOn(component, validateModel);

      expectPropertiesValues(component, 'required', validValues, true);
      expectPropertiesValues(component, 'required', invalidValues, false);
      expect(component[validateModel]).toHaveBeenCalled();
    });

    it('p-columns: should update property with valid values', () => {
      const values = [1, 2, 3, 4, 7, true, '', '2', 200];
      const expectedValues = [12, 6, 4, 3, 6, 6, 6, 6, 6];

      expectPropertiesValues(component, 'columns', values, expectedValues);
    });

    it('p-columns: should update property with `6` if invalid value', () => {
      expectPropertiesValues(component, 'columns', invalidValues, 6);
    });

    it('p-columns: should set `mdColumns` and call `convertToInt` and `getGridSystemColumns` when `p-columns` property is setted', () => {
      component.mdColumns = undefined;

      spyOn(UtilsFunction, 'convertToInt');
      spyOn(component, <any>'getGridSystemColumns').and.returnValue(6);

      expectPropertiesValues(component, 'columns', 2, 6);
      expect(component.mdColumns).toBe(6);

      expect(UtilsFunction.convertToInt).toHaveBeenCalled();
      expect(component['getGridSystemColumns']).toHaveBeenCalled();
    });
  });
});
