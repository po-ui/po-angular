import { FormControl } from '@angular/forms';

import * as UtilsFunction from '../../../utils/util';
import * as ValidatorsFunctions from '../validators';
import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoCheckboxGroupBaseComponent } from './po-checkbox-group-base.component';
import { PoCheckboxGroupOption } from './interfaces/po-checkbox-group-option.interface';

describe('PoCheckboxGroupBaseComponent: ', () => {
  let component: PoCheckboxGroupBaseComponent;

  let valuesList: Array<any>;
  let valuesObject;
  let options: Array<PoCheckboxGroupOption>;

  let fakeInstance;

  beforeEach(() => {
    component = new PoCheckboxGroupBaseComponent();
    component.propagateChange = (value: any) => {};

    valuesList = ['1'];
    valuesObject = { 1: true, 3: <any>null };
    options = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3', disabled: true }
    ];

    fakeInstance = {
      required: false,
      changeValue: (value: any) => {},
      checkOptionModel: (value: any) => {},
      changeDetector: {
        detectChanges: () => {}
      },
      ngControl: {
        control: {
          setValidators: ([]) => {}
        }
      }
    };
  });

  it('should be created', () => {
    component.registerOnChange(() => {});
    component.registerOnTouched(() => {});
    expect(component instanceof PoCheckboxGroupBaseComponent).toBeTruthy();
  });

  it('should call checkOptionModel and changeValue', () => {
    spyOn(fakeInstance, 'checkOptionModel');
    spyOn(fakeInstance, 'changeValue');

    component.checkOption.call(fakeInstance, Object.assign({}, valuesObject));

    expect(fakeInstance.checkOptionModel).toHaveBeenCalledWith(valuesObject);
    expect(fakeInstance.changeValue).toHaveBeenCalled();
  });

  it('should update checked options object on changeValue (propagateChange)', () => {
    component.checkedOptions = Object.assign({}, valuesObject);
    component.indeterminate = true;

    spyOn(component, 'propagateChange');
    spyOn(component.change, 'emit');

    component.changeValue();

    expect(component.checkedOptions).toEqual(valuesObject);
    expect(component.propagateChange).toHaveBeenCalledWith(valuesObject);
    expect(component.change.emit).toHaveBeenCalledWith(valuesObject);
  });

  it('should update checked options list on changeValue (propagateChange)', () => {
    component.checkedOptionsList = [].concat(valuesList);
    component.indeterminate = false;

    spyOn(component, 'propagateChange');
    spyOn(component.change, 'emit');

    component.changeValue();

    expect(component.checkedOptionsList).toEqual(valuesList);
    expect(component.propagateChange).toHaveBeenCalledWith(valuesList);
    expect(component.change.emit).toHaveBeenCalledWith(valuesList);
  });

  it('should update checked options object on changeValue (ngModelChange)', () => {
    component.checkedOptions = Object.assign({}, valuesObject);
    component.indeterminate = true;

    component.propagateChange = undefined;

    spyOn(component.ngModelChange, 'emit');
    spyOn(component.change, 'emit');

    component.changeValue();

    expect(component.checkedOptions).toEqual(valuesObject);
    expect(component.ngModelChange.emit).toHaveBeenCalledWith(valuesObject);
    expect(component.change.emit).toHaveBeenCalledWith(valuesObject);
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    component.setDisabledState(expectedValue);
    expect(component.disabled).toBe(expectedValue);
  });

  it('should update checked options list on changeValue (ngModelChange)', () => {
    component.checkedOptionsList = [].concat(valuesList);
    component.indeterminate = false;
    component.propagateChange = undefined;

    spyOn(component.ngModelChange, 'emit');
    spyOn(component.change, 'emit');

    component.changeValue();

    expect(component.checkedOptionsList).toEqual(valuesList);
    expect(component.ngModelChange.emit).toHaveBeenCalledWith(valuesList);
    expect(component.change.emit).toHaveBeenCalledWith(valuesList);
  });

  it('should update checked options object on writeValue', () => {
    component.options = [].concat(options);
    component.checkedOptions = {};

    component.writeValue(Object.assign({}, valuesObject));

    expect(component.checkedOptions).toEqual(
      jasmine.objectContaining({
        1: true,
        2: false,
        3: null
      })
    );
  });

  it('should updated checked options list on writeValue', () => {
    component.options = [];
    component.checkedOptionsList = [];

    component.writeValue([].concat(valuesList));

    expect(component.checkedOptionsList).toEqual(valuesList);
  });

  it('shouldn`t updated checked options object if is disabled', () => {
    component.options = [].concat(options);
    component.checkedOptionsList = [];
    component.checkOption(options[2]);

    expect(component.checkedOptionsList).not.toContain('3');
  });

  it('should toggle checked option of array model', () => {
    component.options = [].concat(options);
    component.checkedOptionsList = [];
    component.checkOption(options[0]);

    expect(component.checkedOptionsList).toContain('1');

    component.checkOption(options[0]);

    expect(component.checkedOptionsList).not.toContain('1');
  });

  it('should toggle checked option of object model', () => {
    component.options = [].concat(options);
    component.checkedOptions = [];
    component.indeterminate = true;
    component.checkOption(options[0]);

    expect(component.checkedOptions['1']).toBe(true);

    component.checkOption(options[0]);

    expect(component.checkedOptions['1']).toBe(false);
  });

  it('should remove duplicated options', () => {
    const duplicatedOptions = options.slice();
    duplicatedOptions.push(options[2]);
    component.options = duplicatedOptions.slice();
    component['removeDuplicatedOptions']();

    expect(component.options.length).toBe(3);
    expect(component.options).toEqual(options);
    expect(component.options).not.toEqual(duplicatedOptions);
  });

  it('should generate options object from array', () => {
    component.checkedOptionsList = [];
    component.options = [].concat(options);
    component['generateCheckOptions']([].concat(valuesList));

    expect(component.checkedOptions['1']).toBe(true);
    expect(component.checkedOptions['2']).toBe(false);
    expect(component.checkedOptions['3']).toBe(false);
  });

  it('should generate options object', () => {
    component.options = [
      { value: '1', label: '1' },
      { value: '3', label: '3' }
    ];
    component['generateCheckOptions'](Object.assign({}, valuesObject));

    expect(component.checkedOptions).toEqual(valuesObject);
  });

  describe('Methods: ', () => {
    it('checkOption: shouldn´t call the methods checkOptionModel and changeValue when component disabled.', () => {
      const option = { label: '1', value: '1' };
      component.disabled = true;
      spyOn(component, <any>'checkOptionModel');
      spyOn(component, <any>'changeValue');

      component.checkOption(option);

      expect(component['checkOptionModel']).not.toHaveBeenCalled();
      expect(component['changeValue']).not.toHaveBeenCalled();
    });

    it('writeValue: should clear checkedOptions when optionsModel is empty', () => {
      spyOn(component, <any>'generateCheckOptions').and.returnValue(null);

      component.writeValue(null);

      expect(component.checkedOptions).toEqual({});
    });

    it('checkIndeterminate: should return checkedOptions when indeterminate is true ', () => {
      component.indeterminate = true;
      component.checkedOptions = Object.assign({}, valuesObject);

      expect(component.checkIndeterminate()).toEqual(valuesObject);
    });

    it('checkIndeterminate: should return checkedOptionsList when indeterminate is false ', () => {
      component.indeterminate = false;
      component.checkedOptionsList = {};

      expect(component.checkIndeterminate()).toEqual({});
    });

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validate: should return required obj when `requiredFailed` is true', () => {
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new FormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return required obj when `isInvalidIndeterminate` is true', () => {
      const isInvalidIndeterminate: any = 'isInvalidIndeterminate';
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);
      spyOn(component, isInvalidIndeterminate).and.returnValue(true);

      expect(component.validate(new FormControl([]))).toEqual(validObj);
      expect(component[isInvalidIndeterminate]).toHaveBeenCalled();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined when `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);
      spyOn(component, <any>'isInvalidIndeterminate').and.returnValue(false);

      expect(component.validate(new FormControl(null))).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']([]);

      expect(component['validatorChange']).toHaveBeenCalledWith([]);
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validatorChange'] = undefined;
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('isInvalidIndeterminate: should return false when indeterminate is true and required is false.', () => {
      component.indeterminate = true;
      component.required = false;

      expect(component['isInvalidIndeterminate']()).toBeFalsy();
    });

    it('isInvalidIndeterminate: should return true when checkedOptions are false, indeterminate is true and `required` is true', () => {
      component.indeterminate = true;
      component.required = true;
      component.checkedOptions = { 1: false, 2: false };

      expect(component['isInvalidIndeterminate']()).toBeTruthy();
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

    it('getGridSystemColumns: should return `6 grid system columns` if `columns` aren`t between columns range', () => {
      const columns = 7;
      const maxColumns = 4;

      expect(component['getGridSystemColumns'](columns, maxColumns)).toBe(6);
    });

    it('setCheckboxGroupOptionsView: should set `checkboxGroupOptionsView` with an id property in each option item', () => {
      spyOn(UtilsFunction, 'uuid');

      component['setCheckboxGroupOptionsView'](options);

      expect(UtilsFunction.uuid).toHaveBeenCalled();
      component.checkboxGroupOptionsView.forEach(checkboxOption => {
        expect(checkboxOption.hasOwnProperty('id')).toBeTruthy();
      });
    });
  });

  describe('Properties: ', () => {
    const trueValues = [true, 'true', 1, '', [], {}];
    const falseValues = [false, 'false', 0, null, undefined, NaN];

    it('p-disabled: should be update with valid and invalid values.', () => {
      expectPropertiesValues(component, 'disabled', trueValues, true);
      expectPropertiesValues(component, 'disabled', falseValues, false);
    });

    it('p-indeterminate: should be update with valid and invalid values.', () => {
      expectPropertiesValues(component, 'indeterminate', trueValues, true);
      expectPropertiesValues(component, 'indeterminate', falseValues, false);
    });

    it('p-required: should be update with valid and invalid values.', () => {
      expectPropertiesValues(component, 'required', trueValues, true);
      expectPropertiesValues(component, 'required', falseValues, false);
    });

    it('p-options: should be update with invalid values.', () => {
      const invalidValues = [NaN, null, undefined, false, {}, 0, 'str'];

      expectPropertiesValues(component, 'options', invalidValues, []);
    });

    it('p-options: should be update with valid values.', () => {
      const validValues = [[], [{ label: '1', value: '2' }]];

      spyOn(component, <any>'removeDuplicatedOptions');
      spyOn(component, <any>'setCheckboxGroupOptionsView');

      expectPropertiesValues(component, 'options', validValues, validValues);
      expect(component['removeDuplicatedOptions']).toHaveBeenCalled();
      expect(component['setCheckboxGroupOptionsView']).toHaveBeenCalledWith(component.options);
    });

    it('p-columns: should update property with valid values', () => {
      const values = [1, 2, 3, 4, 7, true, '', '2', 200];
      const expectedValues = [12, 6, 4, 3, 6, 6, 6, 6, 6];

      expectPropertiesValues(component, 'columns', values, expectedValues);
    });

    it('p-columns: should update property with `6` if invalid value', () => {
      expectPropertiesValues(component, 'columns', falseValues, 6);
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
