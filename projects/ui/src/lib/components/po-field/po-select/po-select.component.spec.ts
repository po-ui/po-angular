import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import * as UtilsFunctions from '../../../utils/util';
import { configureTestSuite, expectPropertiesValues, expectSettersMethod } from './../../../util-test/util-expect.spec';

import { removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoSelectOptionGroup } from './po-select-option-group.interface';
import { PoSelectOption } from './po-select-option.interface';
import { PoSelectComponent } from './po-select.component';

describe('PoSelectComponent:', () => {
  let component: PoSelectComponent;
  let fixture: ComponentFixture<PoSelectComponent>;
  let nativeElement;
  const booleanValidFalseValues = [false, 'false'];
  const booleanValidTrueValues = [true, 'true', ''];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  const event = new MouseEvent('click', { 'bubbles': false, 'cancelable': true });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PoSelectComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSelectComponent);
    component = fixture.componentInstance;
    component.options = [{ value: 1, label: 'Teste2' }];

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should click in document', () => {
    const documentBody = document.body;
    spyOn(documentBody, 'dispatchEvent');

    documentBody.dispatchEvent(event);
    documentBody.click();

    expect(documentBody.dispatchEvent).toHaveBeenCalled();
  });

  it('should execute isEqual', () => {
    const isEqual = component['isEqual'](null, 'null');
    expect(isEqual).toBe(true);
  });

  it('should execute isEqual when value is undefined and input have value', () => {
    const isEqual = component['isEqual'](undefined, 'teste');
    expect(isEqual).toBe(false);
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of select', () => {
      component.selectElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.selectElement.nativeElement, 'focus');

      component.focus();

      expect(component.selectElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of select if `disabled`', () => {
      component.selectElement = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.selectElement.nativeElement, 'focus');

      component.focus();

      expect(component.selectElement.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('onBlur: should be called when blur event', () => {
      component['onModelTouched'] = () => {};
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onBlur: shouldn´t throw error if onModelTouched is falsy', () => {
      component['onModelTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });

    it('extraValidation: should return null', () => {
      const returnExtraValidation = component.extraValidation(null);

      expect(returnExtraValidation).toBeNull();
    });

    it('updateValues: should execute updateValues and call onChange', () => {
      const option = { value: undefined, label: '' };
      const fakeThis = {
        selectElement: component.selectElement,
        selectedValue: '',
        displayValue: label => {},
        updateModel: value => {},
        emitChange: value => {}
      };

      spyOn(fakeThis, 'emitChange');
      component['updateValues'].call(fakeThis, option);

      expect(fakeThis.emitChange).toHaveBeenCalledWith(option.value);
      expect(fakeThis.selectedValue).toBe(undefined);
    });

    it('onUpdateOptions: should call `onSelectChange` if model is truthy.', () => {
      component.modelValue = '1';

      spyOn(component, 'onSelectChange');
      component.onUpdateOptions();

      expect(component.onSelectChange).toHaveBeenCalled();
    });

    it('onUpdateOptions: shouldn´t call `onSelectChange` if model is falsy.', () => {
      component.modelValue = undefined;

      spyOn(component, 'onSelectChange');
      component.onUpdateOptions();

      expect(component.onSelectChange).not.toHaveBeenCalled();
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

    it('p-options: should return `optionWithoutGroup` and `listGroupOptions` emptys when option is empty', () => {
      const options: Array<any> = [];

      component.options = options;

      expect(component.optionWithoutGroup).toEqual([]);
      expect(component.listGroupOptions).toEqual([]);
    });

    it('p-options: should call `transformInArray` when options is a listGroup', () => {
      const options: Array<any> = [
        {
          label: 'Group 1',
          options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 }
          ]
        },
        { label: 'Group 2', options: [{ label: 'Option 3', value: 3 }] }
      ];

      spyOn(component, <any>'transformInArray').and.callThrough();
      component.options = options;

      expect(component.listGroupOptions).toEqual(options);
      expect(component['transformInArray']).toHaveBeenCalledWith(options);
    });

    it("p-options: should return `listGroupOptions` empty and `optionWithoutGroup` when options isn't a listGroup", () => {
      const options: Array<any> = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 }
      ];

      component.options = options;

      expect(component.listGroupOptions).toEqual([]);
      expect(component.optionWithoutGroup).toEqual(options);
    });

    it('p-readonly: should update with valid values.', () => {
      component.readonly = UtilsFunctions.convertToBoolean(1);

      expect(component.readonly).toBe(true);
    });

    it('p-readonly: should update with invalid values.', () => {
      component.readonly = UtilsFunctions.convertToBoolean(5555);

      expect(component.readonly).toBe(false);
    });

    it('onSelectChange: shouldn`t call `updateValues` if value is undefined', () => {
      spyOn(component, 'updateValues');

      component.onSelectChange(undefined);
      expect(component.updateValues).not.toHaveBeenCalled();
    });

    it('onSelectChange: should call `updateValues` if value is valid', () => {
      component['onModelTouched'] = () => {};

      spyOn(component, 'updateValues');
      spyOn(component, <any>'onModelTouched');

      component.onSelectChange(component.options[0].value);
      expect(component.updateValues).toHaveBeenCalledWith(component.options[0]);
      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onSelectChange: shouldn`t call `updateValues` if value is invalid', () => {
      spyOn(component, 'updateValues');

      component.onSelectChange(5);
      expect(component.updateValues).not.toHaveBeenCalled();
    });

    it('writeValue: should receive the changed value in the model', () => {
      component.writeValue(1);
      expect(component.options).not.toBeNull();
    });

    it('writeValue: should define selectedValue with undefined', () => {
      component.writeValue(undefined);

      expect(component.selectedValue).toBeUndefined();
    });

    it('writeValue: should define selectedValue value with undefined if options is empty', () => {
      component.selectedValue = 'payment';
      component.options.length = 0;
      component.writeValue(undefined);
      expect(component.selectedValue).toBeUndefined();
    });

    it('writeValue: should define selectedValue with undefined and doesn`t call setScrollPosition if optionsFound is false', () => {
      component.selectedValue = 'payment';

      component.writeValue('value invalid');
      expect(component.selectedValue).toBeUndefined();
    });

    it('writeValue: should set property values and call `setScrollPosition` if is a valid option', () => {
      spyOn(component, <any>'findOptionValue').and.returnValue(component.options[0]);

      component.writeValue(component.options[0]);

      expect(component.selectedValue).toBe(component.options[0].value);
      expect(component.displayValue).toBe(component.options[0].label);
    });

    it('findOptionValue: should return undefined if it receives an undefined parameter', () => {
      const expectedValue = component['findOptionValue'](undefined);

      expect(expectedValue).toBeUndefined();
    });

    it('findOptionValue: should return the properly option if it receives a valid parameter', () => {
      const expectedValue = component['findOptionValue'](component.options[0].value);

      expect(expectedValue).toEqual(component.options[0]);
    });

    it('registerOnTouched: should set `onModelTouched` with value of the `fnTouched`', () => {
      const fnTouched = () => {};

      component.registerOnTouched(fnTouched);

      expect(component['onModelTouched']).toBe(fnTouched);
    });

    it('ngOnChanges: should set `currentValue` in options', () => {
      const changes: any = {
        options: {
          currentValue: [{ label: 'test', value: 'test' }]
        }
      };

      component.ngOnChanges(changes);

      expect(component.options).toEqual([{ label: 'test', value: 'test' }]);
    });

    it('ngOnChanges: shouldn´t set `currentValue` in options if options is undefined', () => {
      component.options = [{ label: 'test', value: 'test' }];
      const changes: any = {
        options: undefined
      };

      component.ngOnChanges(changes);

      expect(component.options).toEqual([{ label: 'test', value: 'test' }]);
    });

    it('isItemGroup: should return true when the item has "options" property as an array', () => {
      const item: PoSelectOption = { label: 'Option 1', value: 'option1' };

      expect(component.isItemGroup(item)).toBeFalse();
    });

    it('isItemGroup: should return true when the item has "options" property as an array', () => {
      const item: PoSelectOptionGroup = { label: 'Group', options: [{ label: 'Option 1', value: 'option1' }] };

      expect(component.isItemGroup(item)).toBeTrue();
    });

    it('isItemGroup: isItemGroup: should return false when the item has "options" property as any other type', () => {
      const item = { label: 'Item with options', options: { option1: 'value1', option2: 'value2' } };

      expect(component.isItemGroup(item)).toBeFalse();
    });

    it('separateOptions: should separate options with groups and validate each group options', () => {
      const option1: PoSelectOption = { label: 'Option 1', value: 'option1' };
      const optionGroup: PoSelectOptionGroup = {
        label: 'Group',
        options: [
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ]
      };

      component.optionsDefault = [option1, optionGroup];

      spyOn(component, <any>'validateOptions');

      component['separateOptions']();

      expect(component.listGroupOptions).toContain(optionGroup);
      expect(component.listGroupOptions.length).toBe(1);
      expect(component.listGroupOptions[0].options.length).toBe(2);
      expect(component['validateOptions']).toHaveBeenCalledWith(optionGroup.options);
      expect(component.optionWithoutGroup).toContain(option1);
    });

    it("transformInArray: should call a empty array if hasn't objects", () => {
      const objectWithArray: Array<any> = [];

      const result = component['transformInArray'](objectWithArray);
      expect(result).toEqual([]);
    });

    it('transformInArray: should call a array with only `options` propertie', () => {
      const objectWithArray: Array<any> = [
        {
          label: 'Group 1',
          options: [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 }
          ]
        },
        { label: 'Group 2', options: [{ label: 'Option 3', value: 3 }] }
      ];

      const result = component['transformInArray'](objectWithArray);
      expect(result).toEqual([
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 }
      ]);
    });

    it("transformInArray: should return an empty array if objects don't have `options` property", () => {
      const objectWithArray: Array<any> = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2, otherProperty: 'Test' }
      ];

      const result = component['transformInArray'](objectWithArray);
      expect(result).toEqual([]);
    });
  });

  describe('Templates:', () => {
    it('should set p-field-value with `defaultValue` if param is empty', () => {
      const defaultValue = 'value';
      expectSettersMethod(component, 'fieldValue', '', 'fieldValue', defaultValue);
      expect(component.fieldValue).toEqual(defaultValue);
    });

    it('should set p-field-label with `defaultValue` if param is empty', () => {
      const defaultLabel = 'label';
      expectSettersMethod(component, 'fieldLabel', '', 'fieldLabel', defaultLabel);
      expect(component.fieldLabel).toEqual(defaultLabel);
    });
  });
});
