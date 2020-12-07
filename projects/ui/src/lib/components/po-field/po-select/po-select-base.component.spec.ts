import { ChangeDetectorRef, Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';
import * as UtilsFunctions from '../../../utils/util';

import { PoSelectBaseComponent } from './po-select-base.component';
import { PoSelectOption } from './po-select-option.interface';

@Directive()
class PoSelect extends PoSelectBaseComponent {
  onUpdateOptions(): void {}

  updateModel(selectOption: PoSelectOption): void {}

  writeValue(value: any): void {}
}

describe('PoSelectBaseComponent:', () => {
  let component: PoSelect;

  beforeEach(() => {
    component = new PoSelect(null, null);
  });

  it('should be created', () => {
    expect(component instanceof PoSelectBaseComponent).toBeTruthy();
  });

  it('should remove duplicated items', () => {
    const optionsSelect = [
      { label: 'Save', value: 1 },
      { label: 'Cancel', value: 2 },
      { label: 'Add', value: 3 },
      { label: 'Add', value: 3 }
    ];

    component.options = optionsSelect;

    expect(component.options.length).toEqual(3);
  });

  it('should execute onModelChange', () => {
    const fakeThis = {
      onModelChange: (v: any) => {},
      ngModelChange: {
        emit: (v: any) => {}
      }
    };
    const value = 'teste';

    spyOn(fakeThis, 'onModelChange');
    component.callModelChange.call(fakeThis, value);
    expect(fakeThis.onModelChange).toHaveBeenCalledWith(value);
  });

  it('should execute ngModelChange', () => {
    const fakeThis = {
      onModelChange: '',
      ngModelChange: {
        emit: (v: any) => {}
      }
    };
    const value = 'teste';

    spyOn(fakeThis.ngModelChange, 'emit');
    component.callModelChange.call(fakeThis, value);
    expect(fakeThis.ngModelChange.emit).toHaveBeenCalledWith(value);
  });

  it('should return null in validate', () => {
    component.required = false;
    expect(component.validate(new FormControl(''))).toBeNull();
  });

  it('should return object invalid in validate', () => {
    component.required = true;
    expect(component.validate(new FormControl(''))).not.toBeNull();
  });

  it('should register function OnChangePropagate', () => {
    component.onModelChange = undefined;
    const func = () => true;

    component.registerOnChange(func);
    expect(component.onModelChange).toBe(func);
  });

  it('should register function registerOnTouched', () => {
    component.onModelTouched = undefined;
    const func = () => true;

    component.registerOnTouched(func);
    expect(component.onModelTouched).toBe(func);
  });

  describe('Properties:', () => {
    const booleanValidFalseValues = [false, 'false'];
    const booleanValidTrueValues = [true, 'true', ''];
    const booleanInvalidValues = [undefined, null, 2, 'string'];

    it('p-disabled: should update with valid values and call `validateModel`.', () => {
      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'disabled', booleanValidFalseValues, false);
      expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-disabled: should update with invalid values.', () => {
      expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
    });

    it('p-readonly: should update with valid values.', () => {
      expectPropertiesValues(component, 'readonly', booleanValidFalseValues, false);
      expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
    });

    it('p-readonly: should update with invalid values.', () => {
      expectPropertiesValues(component, 'readonly', booleanInvalidValues, false);
    });

    it('p-required: should update with valid values and call `validateModel`.', () => {
      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'required', booleanValidFalseValues, false);
      expectPropertiesValues(component, 'required', booleanValidTrueValues, true);
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-required: should update with invalid values.', () => {
      expectPropertiesValues(component, 'required', booleanInvalidValues, false);
    });

    it('p-options: should call `removeDuplicatedOptions`, `removeUndefinedAndNullOptions` and `onUpdateOptions`.', () => {
      const options = [{ label: 'option', value: 'option' }];

      spyOn(UtilsFunctions, 'removeUndefinedAndNullOptions');
      spyOn(UtilsFunctions, 'removeDuplicatedOptions');
      spyOn(component, 'onUpdateOptions');

      component.options = options;

      expect(removeUndefinedAndNullOptions).toHaveBeenCalledWith(options);
      expect(removeDuplicatedOptions).toHaveBeenCalledWith(options);
      expect(component.onUpdateOptions).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it('registerOnValidatorChange: should register validatorChange function.', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['onValidatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validateModel: should call `onValidatorChange` when it is true.', () => {
      component['onValidatorChange'] = () => {};

      spyOn(component, <any>'onValidatorChange');

      component['validateModel']();

      expect(component['onValidatorChange']).toHaveBeenCalled();
    });

    it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
      component.changeDetector = <any>{ detectChanges: () => {} };

      spyOn(component.changeDetector, 'detectChanges');

      const expectedValue = true;
      component.setDisabledState(expectedValue);
      expect(component.disabled).toBe(expectedValue);

      expect(component.changeDetector.detectChanges).toHaveBeenCalled();
    });

    it('validateModel: shouldn`t call `onValidatorChange` when it is false.', () => {
      component['onValidatorChange'] = undefined;
      component['validateModel']();

      expect(component['onValidatorChange']).toBeUndefined();
    });

    it('onChange: should emit change', () => {
      const value = 'emit';

      spyOn(component.change, value);
      component.onChange(value);
      expect(component.change.emit).toHaveBeenCalledWith(value);
    });
  });
});
