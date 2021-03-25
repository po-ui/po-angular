import { TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';

import { expectPropertiesValues, expectArraysSameOrdering } from '../../../../util-test/util-expect.spec';

import * as PoDynamicUtil from '../../po-dynamic.util';
import { PoDynamicFieldType } from '../../po-dynamic-field-type.enum';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

describe('PoDynamicFormFieldsBaseComponent:', () => {
  let component: PoDynamicFormFieldsBaseComponent;

  let titleCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleCasePipe]
    });

    titleCase = TestBed.inject(TitleCasePipe);

    component = new PoDynamicFormFieldsBaseComponent(titleCase);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('fields: should set `fields` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'fields', invalidValues, []);
    });

    it('fields: should update property `p-fields` with valid values', () => {
      const validValues = [[{ property: 'Teste 1' }], [{ property: 'Teste 2' }]];

      expectPropertiesValues(component, 'fields', validValues, validValues);
    });

    it('value: should set `value` to `{}` if not object value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'value', invalidValues, {});
    });

    it('value: should update property `p-value` with valid values', () => {
      const validValues = [{}, { name: 'po' }];

      expectPropertiesValues(component, 'value', validValues, validValues);
    });

    it('validateFields: should set `p-validate-fields` with `[]` if it is an invalid Array type value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'validateFields', invalidValues, []);
    });

    it('validateFields: should update property `p-validate-fields` with valid values', () => {
      const validValues = [['propertyA'], ['propertyB']];

      expectPropertiesValues(component, 'validateFields', validValues, validValues);
    });
  });

  describe('Methods:', () => {
    it('compareTo: should return `true` if is the same type and value', () => {
      expect(component['compareTo']('1', '1')).toBe(true);
    });

    it('compareTo: should return `false` if it is of the same value but of different type', () => {
      expect(component['compareTo']('1', 1)).toBe(false);
    });

    it('compareTo: should return `false` if it is of the same type but of different value', () => {
      expect(component['compareTo']('1', '2')).toBe(false);
    });

    it('getVisibleFields: should return fields if contains property and are visibles', () => {
      const fields = [{ property: 'name' }, { property: 'age' }];
      component.fields = fields;

      const visibleFields = component['getVisibleFields']();

      expect(visibleFields.length).toBe(fields.length);
    });

    it('getVisibleFields: shouldn`t return the field if it is duplicate', () => {
      const fields = [{ property: 'name' }];
      component.fields = [...fields, ...fields];

      spyOn(component, <any>'printError');

      const visibleFields = component['getVisibleFields']();

      expect(visibleFields.length).toBe(fields.length);
    });

    describe('getVisibleFields:', () => {
      it('should return the ordered fields', () => {
        const fields: Array<PoDynamicFormField> = [
          { property: 'test 1', order: 2 },
          { property: 'test 2', order: 1 },
          { property: 'test 3', order: 4 },
          { property: 'test 4', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 2' },
          { property: 'test 1' },
          { property: 'test 4' },
          { property: 'test 3' }
        ];

        component.fields = [...fields];

        spyOn(component, <any>'printError');

        const visibleFields = component['getVisibleFields']();

        expectArraysSameOrdering(visibleFields, expectedFields);
      });

      it('should return ordering fields with value default', () => {
        const fields: Array<PoDynamicFormField> = [
          { property: 'test 1' },
          { property: 'test 2', order: 2 },
          { property: 'test 3', order: 1 },
          { property: 'test 4', order: -1 },
          { property: 'test 5', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 3' },
          { property: 'test 2' },
          { property: 'test 5' },
          { property: 'test 1' },
          { property: 'test 4' }
        ];

        component.fields = [...fields];

        spyOn(component, <any>'printError');

        const visibleFields = component['getVisibleFields']();

        expectArraysSameOrdering(visibleFields, expectedFields);
      });

      it('should return ordering fields with zero as default value', () => {
        const fields: Array<PoDynamicFormField> = [
          { property: 'test 1' },
          { property: 'test 0', order: 0 },
          { property: 'test 2', order: 2 },
          { property: 'test 3', order: 1 },
          { property: 'test 4', order: -1 },
          { property: 'test 5', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 3' },
          { property: 'test 2' },
          { property: 'test 5' },
          { property: 'test 1' },
          { property: 'test 0' },
          { property: 'test 4' }
        ];

        component.fields = [...fields];

        spyOn(component, <any>'printError');

        const visibleFields = component['getVisibleFields']();

        expectArraysSameOrdering(visibleFields, expectedFields);
      });

      it('shouldn`t call `isVisibleField` if not exists `field.property`', () => {
        const fields = [{ label: 'name' }];
        component.fields = <any>fields;

        spyOn(PoDynamicUtil, 'isVisibleField');
        spyOn(component, <any>'printError');

        const visibleFields = component['getVisibleFields']();

        expect(visibleFields.length).toBe(0);
        expect(PoDynamicUtil.isVisibleField).not.toHaveBeenCalled();
      });

      it('should return only visible fields', () => {
        const fields = [{ property: 'name' }];
        const invisibleFields = [{ property: 'age', visible: false }];
        component.fields = [...fields, ...invisibleFields];

        const visibleFields = component['getVisibleFields']();

        expect(visibleFields.length).toBe(fields.length);
      });
    });

    it('convertOptions: should convert options to object if the options is an array of string', () => {
      const options = ['po', 'angular'];

      const convertedOptions = component['convertOptions'](options);

      expect(convertedOptions.every(op => typeof op === 'object')).toBe(true);
      expect(convertedOptions.length).toBe(options.length);
    });

    it('convertOptions: shouldn`t call `map` and not convert options to object if optios is a object', () => {
      const options = [{ property: 'po' }, { property: 'angular' }];

      spyOn(options, 'map');

      const convertedOptions = component['convertOptions'](options);

      expect(options.map).not.toHaveBeenCalled();
      expect(convertedOptions.every(op => typeof op === 'object')).toBe(true);
      expect(convertedOptions.length).toBe(options.length);
    });

    it(`createField: should call 'getGridColumnsClasses' and 'hasFocus', not call 'convertOptions' and return an
      object that overrides the values of the same properties.`, () => {
      const field = { property: 'propertyName', label: 'labelName' };

      const spyTitleCasePipeTransform = spyOn(component['titleCasePipe'], 'transform').and.returnValue('propertyName');
      const spyGetGridColumnsClasses = spyOn(PoDynamicUtil, 'getGridColumnsClasses').and.callThrough();
      const spyConvertOptions = spyOn(component, <any>'convertOptions').and.callThrough();
      const spyHasFocus = spyOn(component, <any>'hasFocus');

      const newField = component['createField'](field);

      expect(typeof newField === 'object').toBe(true);
      expect(newField.options).toBeUndefined();
      expect(newField.label).toBe(field.label);

      expect(spyTitleCasePipeTransform).toHaveBeenCalled();
      expect(spyGetGridColumnsClasses).toHaveBeenCalled();
      expect(spyConvertOptions).not.toHaveBeenCalled();
      expect(spyHasFocus).toHaveBeenCalled();
    });

    it(`createField: should call 'getGridColumnsClasses', 'convertOptions', 'hasFocus' and return an
      object that overrides the values of the same properties`, () => {
      const field = { property: 'propertyName', label: 'labelName', options: ['Option 1', 'Option 2'] };

      const spyTitleCasePipeTransform = spyOn(component['titleCasePipe'], 'transform').and.returnValue('propertyName');
      const spyGetGridColumnsClasses = spyOn(PoDynamicUtil, 'getGridColumnsClasses').and.callThrough();
      const spyConvertOptions = spyOn(component, <any>'convertOptions').and.callThrough();
      const spyHasFocus = spyOn(component, <any>'hasFocus');

      const newField = component['createField'](field);

      expect(typeof newField === 'object').toBe(true);
      expect(newField.maskFormatModel).toBe(false);
      expect(Array.isArray(newField.options)).toBe(true);
      expect(newField.label).toBe(field.label);

      expect(spyTitleCasePipeTransform).toHaveBeenCalled();
      expect(spyGetGridColumnsClasses).toHaveBeenCalled();
      expect(spyConvertOptions).toHaveBeenCalled();
      expect(spyHasFocus).toHaveBeenCalled();
    });

    it(`createField: should set maskFormatModel with true if type is 'time'`, () => {
      const field = { property: 'propertyName', label: 'labelName', type: 'time' };

      const newField = component['createField'](field);

      expect(newField.label).toBe(field.label);
      expect(newField.maskFormatModel).toBe(true);
    });

    it(`createField: should set maskFormatModel and mask`, () => {
      const field = { property: 'propertyName', label: 'labelName', mask: '99/9999', maskFormatModel: true };

      const newField = component['createField'](field);

      expect(newField.label).toBe(field.label);
      expect(newField.mask).toBe(field.mask);
      expect(newField.maskFormatModel).toBe(true);
    });

    it(`hasFocus: should return true if 'autoFocus' is equal to 'field.property'`, () => {
      const field = { property: 'field' };

      component.autoFocus = 'field';

      expect(component['hasFocus'](field)).toBe(true);
    });

    it(`hasFocus: should return undefined if 'autoFocus' is undefined`, () => {
      const field = { property: 'field' };

      component.autoFocus = undefined;

      expect(component['hasFocus'](field)).toBe(false);
    });

    it(`hasFocus: should return undefined if 'autoFocus' isn't equal to 'field.property'`, () => {
      const field = { property: 'field' };

      component.autoFocus = 'otherField';

      expect(component['hasFocus'](field)).toBe(false);
    });

    it('existsProperty: should return `true` if property exists in fields', () => {
      const fields = [{ property: 'name' }];
      const property = 'name';

      expect(component['existsProperty'](fields, property)).toBe(true);
    });

    it('existsProperty: should return `false` if property not exists in fields', () => {
      const fields = [{ property: 'name' }];
      const property = 'age';

      expect(component['existsProperty'](fields, property)).toBe(false);
    });

    describe('getComponentControl:', () => {
      it('should return `input` if type is undefined', () => {
        const expectedValue = 'input';
        const field = undefined;

        expect(component['getComponentControl'](field)).toBe(expectedValue);
      });

      it('should return `number` if type is `number` and `isNumberType` is true', () => {
        const expectedValue = 'number';
        const field = { type: 'number', property: 'code' };

        spyOn(component, <any>'isNumberType').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isNumberType']).toHaveBeenCalled();
      });

      it('should return `input` if type is `number` and have a mask', () => {
        const expectedValue = 'input';
        const field = { type: 'number', property: 'code', mask: '99:99:99' };

        spyOn(component, <any>'isNumberType').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isNumberType']).toHaveBeenCalled();
      });

      it('should return `input` if type is `number` and have a mask', () => {
        const expectedValue = 'input';
        const field = { type: 'number', property: 'code', mask: '99:99:99' };

        spyOn(component, <any>'isNumberType').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isNumberType']).toHaveBeenCalled();
      });

      it('should `input` if type is `number` or `currency` or `combo` can use icon', () => {
        const expectedValue = 'input';
        const field = { type: 'number', property: 'code', pattern: '99:99:99' };

        spyOn(component, <any>'isNumberType').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isNumberType']).toHaveBeenCalled();
      });

      it('should return `decimal` if type is `decimal` and `isCurrencyType` can use decimalsLength', () => {
        const expectedValue = 'decimal';
        const field = { type: 'decimal', property: 'code' };

        spyOn(component, <any>'isCurrencyType').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCurrencyType']).toHaveBeenCalled();
      });

      it('should return `decimal` if type is `decimal` and `isCurrencyType` is `true`', () => {
        const expectedValue = 'decimal';
        const field = { type: 'decimal', property: 'code' };

        spyOn(component, <any>'isCurrencyType').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCurrencyType']).toHaveBeenCalled();
      });

      it('should return `input` if type is `decimal` and have a mask', () => {
        const expectedValue = 'input';
        const field = { type: 'decimal', property: 'code', mask: '99:99:99' };

        spyOn(component, <any>'isCurrencyType').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCurrencyType']).toHaveBeenCalled();
      });

      it('should return `input` if type is `decimal` and have a pattern', () => {
        const expectedValue = 'input';
        const field = { type: 'decimal', property: 'code', pattern: '99:99:99' };

        spyOn(component, <any>'isCurrencyType').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCurrencyType']).toHaveBeenCalled();
      });

      it(`should return 'select', call 'isSelect' and not call 'isRadioGroup' if has more than four options`, () => {
        const expectedValue = 'select';
        const field = { options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], property: 'code' };

        spyOn(component, <any>'isSelect').and.callThrough();
        spyOn(component, <any>'isRadioGroup');

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isSelect']).toHaveBeenCalled();
        expect(component['isRadioGroup']).not.toHaveBeenCalled();
      });

      it(`should return 'radioGroup' and call 'isRadioGroup' if has less than four options`, () => {
        const expectedValue = 'radioGroup';
        const field = { options: ['Option 1', 'Option 2'], property: 'code' };

        spyOn(component, <any>'isRadioGroup').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isRadioGroup']).toHaveBeenCalled();
      });

      it(`should return 'checkboxGroup', call 'isCheckboxGroup' and not call 'isMultiselect' if has
        less or equal than three options`, () => {
        const expectedValue = 'checkboxGroup';
        const field = { optionsMulti: true, options: ['Option 1', 'Option 2', 'Option 3'], property: 'codes' };

        const spyIsCheckboxGroup = spyOn(component, <any>'isCheckboxGroup').and.callThrough();
        const spyIsMultiselect = spyOn(component, <any>'isMultiselect').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(spyIsCheckboxGroup).toHaveBeenCalled();
        expect(spyIsMultiselect).not.toHaveBeenCalled();
      });

      it(`should return 'multiselect' and call 'isMultiselect' if has more than three options`, () => {
        const expectedValue = 'multiselect';
        const field = {
          optionsMulti: true,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          property: 'codes'
        };

        const spyIsMultiselect = spyOn(component, <any>'isMultiselect').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(spyIsMultiselect).toHaveBeenCalled();
      });

      it('should call `compareTo` and return `switch` if type is `boolean`', () => {
        const expectedValue = 'switch';
        const field = { type: 'boolean', property: 'code' };

        spyOn(component, <any>'compareTo').and.callThrough();
        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['compareTo']).toHaveBeenCalledWith(field.type, PoDynamicFieldType.Boolean);
      });

      it('should call `compareTo` and return `datepicker` if type is `date`', () => {
        const expectedValue = 'datepicker';
        const field = { type: 'date', property: 'code' };

        spyOn(component, <any>'compareTo').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['compareTo']).toHaveBeenCalledWith(field.type, PoDynamicFieldType.Date);
      });

      it('should call `compareTo` and return `datepicker` if type is `dateTime`', () => {
        const expectedValue = 'datepicker';
        const field = { type: 'dateTime', property: 'code' };

        spyOn(component, <any>'compareTo').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['compareTo']).toHaveBeenCalledWith('datetime', PoDynamicFieldType.DateTime);
      });

      it('should call `compareTo`, set `field.mask` and return `input` if type is `time`', () => {
        const expectedValue = 'input';
        const field = <any>{ type: 'time', property: 'code' };

        spyOn(component, <any>'compareTo').and.callThrough();

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['compareTo']).toHaveBeenCalledWith(field.type, PoDynamicFieldType.Time);
        expect(field.mask).toBe('99:99');
      });

      it('should call `isCombo` and return `combo` if contains `optionsService` as url string', () => {
        const expectedValue = 'combo';
        const field = { optionService: 'http://api.example/1', property: 'code' };

        spyOn(component, <any>'isCombo').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCombo']).toHaveBeenCalledWith(field);
      });

      it('should call `isCombo` and return `combo` if contains `optionsService` as `PoComboFilter` instance', () => {
        const expectedValue = 'combo';
        const mockService = {
          getFilteredData: null,
          getObjectByValue: null
        };
        const field = { optionService: mockService, property: 'code' };

        spyOn(component, <any>'isCombo').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isCombo']).toHaveBeenCalledWith(field);
      });

      it('should call `isLookup` and return `lookup` if contains `searchService` as url string.', () => {
        const expectedValue = 'lookup';
        const field = { searchService: 'http://api.example/1', property: 'code' };

        spyOn(component, <any>'isLookup').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isLookup']).toHaveBeenCalledWith(field);
      });

      it('should call `isLookup` and return `lookup` if contains `searchService` as `PoLookupFilter` instance.', () => {
        const expectedValue = 'lookup';
        const mockService = {
          getObjectByValue: null,
          getFilteredItems: null
        };
        const field = { searchService: mockService, property: 'code' };

        spyOn(component, <any>'isLookup').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isLookup']).toHaveBeenCalledWith(field);
      });

      it('should return `textarea` if contains 3 `rows` or more.', () => {
        const expectedValue = 'textarea';
        const field = { property: 'property', rows: 5 };

        spyOn(component, <any>'isTextarea').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isTextarea']).toHaveBeenCalledWith(field);
      });

      it('should return `input` if contains 2 `rows` or less.', () => {
        const expectedValue = 'input';
        const field = { property: 'property', rows: 2 };

        expect(component['getComponentControl'](field)).toBe(expectedValue);
      });

      it('should call `isPassword` and return `password` if contains `secret`.', () => {
        const expectedValue = 'password';
        const field = { property: 'code', secret: true };

        spyOn(component, <any>'isPassword').and.returnValue(true);

        expect(component['getComponentControl'](field)).toBe(expectedValue);
        expect(component['isPassword']).toHaveBeenCalledWith(field);
      });

      it('should call `isPassword` and return `input` if `secret` is false.', () => {
        const expectedValue = 'input';
        const field = { property: 'code', secret: false };

        expect(component['getComponentControl'](field)).toBe(expectedValue);
      });

      it('should return `input` if type not defined', () => {
        const expectedValue = 'input';
        const field = { property: 'code' };

        expect(component['getComponentControl'](field)).toBe(expectedValue);
      });
    });

    it('isCombo: should return `true` if `optionsService` is defined string', () => {
      const optionsService = 'http://service.api:3100';

      expect(component['isCombo']({ optionsService, property: 'states' })).toBe(true);
    });

    it('isCombo: should return `true` if `optionsService` is defined service', () => {
      const optionsService = {
        getFilteredData: null,
        getObjectByValue: null
      };
      const field = { optionsService, property: 'states' };

      expect(component['isCombo'](field)).toBeTruthy();
    });

    it('isCombo: should return `false` if `optionsService` is invalid string', () => {
      const optionsService = '';

      expect(component['isCombo']({ optionsService, property: 'states' })).toBe(false);
    });

    it('isCurrencyType: should return `true` if `type` is currency and `mask` and `pattern` are undefined', () => {
      const field = { property: 'age' };

      expect(component['isCurrencyType'](field, 'currency')).toBe(true);
    });

    it('isCurrencyType: should return `false` if `type` is currency but `mask` is defined', () => {
      const field = { property: 'age', mask: '9.9' };

      expect(component['isCurrencyType'](field, 'currency')).toBe(false);
    });

    it('isCurrencyType: should return `false` if `type` is currency but `pattern` is defined', () => {
      const field = { property: 'age', pattern: '[0-9]' };

      expect(component['isCurrencyType'](field, 'currency')).toBe(false);
    });

    it('isLookup: should return `true` if `searchService` is defined string.', () => {
      const field = { searchService: 'http://service.api:3100', property: 'states' };

      expect(component['isLookup'](field)).toBeTruthy();
    });

    it('isLookup: should return `true` if `searchService` is defined service.', () => {
      const searchService = {
        getObjectByValue: null
      };
      const field = { searchService: searchService, property: 'states' };

      expect(component['isLookup'](field)).toBeTruthy();
    });

    it('isLookup: should return `false` if `searchService` is invalid string.', () => {
      const field = { searchService: '', property: 'states' };

      expect(component['isLookup'](field)).toBeFalsy();
    });

    it('isLookup: should return `false` if `searchService` is not defined.', () => {
      const field = { optionsService: 'http://service.api:3100', property: 'states' };

      expect(component['isLookup'](field)).toBeFalsy();
    });

    it('isNumberType: should return `true` if `type` is number and `mask` and `pattern` are undefined', () => {
      const field = { property: 'age' };

      expect(component['isNumberType'](field, 'number')).toBe(true);
    });

    it('isNumberType: should return `false` if `type` is number but `mask` is defined', () => {
      const field = { property: 'age', mask: '9.9' };

      expect(component['isNumberType'](field, 'number')).toBe(false);
    });

    it('isNumberType: should return `false` if `type` is number but `pattern` is defined', () => {
      const field = { property: 'age', pattern: '[0-9]' };

      expect(component['isNumberType'](field, 'number')).toBe(false);
    });

    it('isRadioGroup: should return `true` if `options.length` less than 4', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];

      expect(component['isRadioGroup']({ options, property: 'city' })).toBe(true);
    });

    it('isRadioGroup: should return `false` if `optionsMulti` is true', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];

      expect(component['isRadioGroup']({ options, property: 'city', optionsMulti: true })).toBe(false);
    });

    it('isRadioGroup: should return `false` if `options.length` greater than 4', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];

      expect(component['isRadioGroup']({ options, property: 'city' })).toBe(false);
    });

    it('isRadioGroup: should return `false` if `options` is undefined', () => {
      expect(component['isRadioGroup']({ property: 'city' })).toBe(false);
    });

    it('isSelect: should return `true` if `options.length` is greater than 3', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];

      expect(component['isSelect']({ options, property: 'country' })).toBe(true);
    });

    it('isSelect: should return `false` if `optionsMulti` is true', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];

      expect(component['isSelect']({ options, property: 'country', optionsMulti: true })).toBe(false);
    });

    it('isSelect: should return `true` if `options.length` is less than 4', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];

      expect(component['isSelect']({ options, property: 'country' })).toBe(false);
    });

    it('isSelect: should return `false` if `options` is undefined', () => {
      expect(component['isSelect']({ property: 'country' })).toBe(false);
    });

    it('isCheckboxGroup: should return true if `options.length` is less than 4 and `optionsMulti` is true', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];
      const field = { property: 'products', options, optionsMulti: true };

      expect(component['isCheckboxGroup'](field)).toBe(true);
    });

    it('isCheckboxGroup: should return false if `optionsMulti` is false', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];
      const field = { property: 'products', options, optionsMulti: false };

      expect(component['isCheckboxGroup'](field)).toBe(false);
    });

    it('isCheckboxGroup: should return false if `optionsService` is truthy', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
      ];
      const field = {
        property: 'products',
        options,
        optionsMulti: true,
        optionsService: 'http://www.po.com.br/api/customers'
      };

      expect(component['isCheckboxGroup'](field)).toBe(false);
    });

    it('isMultiselect: should return true if `options.length` is more than 3 and `optionsMulti` is true', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];
      const field = { property: 'products', options, optionsMulti: true };

      expect(component['isMultiselect'](field)).toBe(true);
    });

    it('isMultiselect: should return false if `optionsMulti` is false', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];
      const field = { property: 'products', options, optionsMulti: false };

      expect(component['isMultiselect'](field)).toBe(false);
    });

    it('isMultiselect: should return false if `optionsService` is truthy', () => {
      const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 }
      ];
      const field = {
        property: 'products',
        options,
        optionsMulti: true,
        optionsService: 'http://www.po.com.br/api/customers'
      };

      expect(component['isMultiselect'](field)).toBe(false);
    });

    it('isTextarea: should return true if `rows` is 3', () => {
      const field = { property: 'products', rows: 3 };

      expect(component['isTextarea'](field)).toBe(true);
    });

    it('isTextarea: should return true if `rows` is greater than 3', () => {
      const field = { property: 'products', rows: 8 };

      expect(component['isTextarea'](field)).toBe(true);
    });

    it('isTextarea: should return false if `rows` is less than 3', () => {
      const field = { property: 'products', rows: 2 };

      expect(component['isTextarea'](field)).toBe(false);
    });

    it('printError: should call console.error with error message', () => {
      const error = 'error';
      spyOn(global.console, 'error');

      component['printError'](error);

      expect(global.console.error).toHaveBeenCalledWith(error);
    });
  });
});
