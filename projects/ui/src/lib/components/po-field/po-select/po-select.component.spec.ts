import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import * as UtilsFunctions from '../../../utils/util';
import { expectSettersMethod } from './../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoFieldValidateModel } from '../po-field-validate.model';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoSelectOptionGroup } from './po-select-option-group.interface';
import { PoSelectOption } from './po-select-option.interface';
import { PoSelectComponent } from './po-select.component';
import { EventEmitter } from '@angular/core';

describe('PoSelectComponent:', () => {
  let component: PoSelectComponent;
  let fixture: ComponentFixture<PoSelectComponent>;
  let nativeElement;
  let changeDetectorRef: jasmine.SpyObj<any>;

  const booleanValidFalseValues = [false, 'false'];
  const booleanValidTrueValues = [true, 'true', ''];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  const event = new MouseEvent('click', { 'bubbles': false, 'cancelable': true });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PoSelectComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });

    changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);
    fixture = TestBed.createComponent(PoSelectComponent);
    component = fixture.componentInstance;
    component.options = [{ value: 1, label: 'Teste2' }];
    component['changeDetector'] = changeDetectorRef;

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

  describe('p-loading:', () => {
    it('should set loading=true and call markForCheck', () => {
      component.loading = true;

      expect(component.loading).toBeTrue();
      expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
    });

    it('should set loading=false and call markForCheck', () => {
      component.loading = false;

      expect(component.loading).toBeFalse();
      expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
    });

    it('loading should not affect disabled state', () => {
      component.disabled = false;

      component.loading = true;
      expect(component.disabled).toBeFalse();

      component.disabled = true;
      component.loading = false;
      expect(component.disabled).toBeTrue();
    });

    it('should set loading=true when input receives string empty', () => {
      component.loading = '' as any;
      expect(component.loading).toBeTrue();
    });

    it('should set loading=false when input receives string "false"', () => {
      component.loading = 'false' as any;
      expect(component.loading).toBeFalse();
    });

    it('should set loading=true when input receives string "true"', () => {
      component.loading = 'true' as any;
      expect(component.loading).toBeTrue();
    });

    it('should not throw when cd is undefined', () => {
      component['changeDetector'] = undefined;
      expect(() => (component.loading = true)).not.toThrow();
    });

    it('mapSizeToIcon: should map sizes to icon sizes', () => {
      expect(component.mapSizeToIcon('small')).toBe('xs');
      expect(component.mapSizeToIcon('medium')).toBe('sm');
      expect(component.mapSizeToIcon('large')).toBe('sm');
      expect(component.mapSizeToIcon(undefined)).toBe('sm');
      expect(component.mapSizeToIcon('invalid')).toBe('sm');
    });
  });

  describe('isDisabled:', () => {
    it('should return false when disabled and loading are false', () => {
      component.disabled = false;
      component.loading = false;

      expect(component.isDisabled).toBeFalse();
    });

    it('should return true when disabled is true and loading is false', () => {
      component.disabled = true;
      component.loading = false;

      expect(component.isDisabled).toBeTrue();
    });

    it('should return true when disabled is false and loading is true', () => {
      component.disabled = false;
      component.loading = true;

      expect(component.isDisabled).toBeTrue();
    });

    it('should return true when disabled and loading are true', () => {
      component.disabled = true;
      component.loading = true;

      expect(component.isDisabled).toBeTrue();
    });

    it('should keep disabled true after loading toggles from true to false', () => {
      component.disabled = true;
      component.loading = true;

      expect(component.isDisabled).toBeTrue();

      component.loading = false;

      expect(component.isDisabled).toBeTrue();
    });
  });

  describe('p-size', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    it('should set property with valid values for accessibility level is AA', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

      component.size = 'small';
      expect(component.size).toBe('small');

      component.size = 'medium';
      expect(component.size).toBe('medium');
    });

    it('should set property with valid values for accessibility level is AAA', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

      component.size = 'small';
      expect(component.size).toBe('medium');

      component.size = 'medium';
      expect(component.size).toBe('medium');
    });

    it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
      localStorage.setItem('po-default-size', 'small');

      component['_size'] = undefined;
      expect(component.size).toBe('small');
    });

    it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
      localStorage.setItem('po-default-size', 'medium');

      component['_size'] = undefined;
      expect(component.size).toBe('medium');
    });

    it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
      component['_size'] = undefined;
      expect(component.size).toBe('medium');
    });
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

    describe('onBlur', () => {
      let setupTest;
      const fakeEvent = { target: { value: '' } };
      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          spyOn(component, 'showAdditionalHelp');
        };
      });

      it('should be called when blur event', () => {
        component['onModelTouched'] = () => {};
        spyOn(component, <any>'onModelTouched');

        component.onBlur(fakeEvent);

        expect(component['onModelTouched']).toHaveBeenCalled();
      });

      it('shouldn´t throw error if onModelTouched is falsy', () => {
        component['onModelTouched'] = null;

        const fnError = () => component.onBlur(fakeEvent);

        expect(fnError).not.toThrow();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.onBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.onBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });

      it('should emit blur event when event.type is "blur"', () => {
        spyOn(component.blur, 'emit');

        component.onBlur({ type: 'blur' });

        expect(component.blur.emit).toHaveBeenCalled();
      });

      it('should not emit blur event when event.type is different from "blur"', () => {
        spyOn(component.blur, 'emit');

        component.onBlur({ type: 'focus' });

        expect(component.blur.emit).not.toHaveBeenCalled();
      });
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
        emitChange: value => {},
        getValueUpdate: value => {}
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

    it('showAdditionalHelp: should call `showAdditionalHelp` and return value', () => {
      const spySuperMethod = spyOn(PoFieldValidateModel.prototype, 'showAdditionalHelp').and.returnValue(true);

      const result = component.showAdditionalHelp();

      expect(spySuperMethod).toHaveBeenCalled();
      expect(result).toBe(true);
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

    describe('onKeyDown:', () => {
      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.selectElement = {
          nativeElement: {
            focus: () => {}
          }
        };

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(component.selectElement.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });

      it('should not emit event when field is not focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.selectElement = {
          nativeElement: document.createElement('input')
        };

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(document.createElement('input'));
        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
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

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage and required is true', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
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

  describe('controlValueWithLabel', () => {
    it('should return the object when controlValueWithLabel is true', () => {
      const option = { value: 1, label: 'Xpto' };

      component.controlValueWithLabel = true;

      expect(component['getValueUpdate'](option)).toEqual(option);
    });

    it('should only return the value when controlValueWithLabel is false', () => {
      const option = { value: 1, label: 'Xpto' };

      component.controlValueWithLabel = false;

      expect(component['getValueUpdate'](option)).toEqual(1);
    });

    it('should return a {value: any, label: any} object when controlValueWithLabel is true and both fieldValue and fieldLabel are set', () => {
      const option = { id: 1, name: 'Xpto' };

      component.controlValueWithLabel = true;
      component.fieldValue = 'id';
      component.fieldLabel = 'name';

      expect(component['getValueUpdate'](option)).toEqual({ value: 1, label: 'Xpto' });
    });

    it('should only return the value when calling getValueWrite when controlValueWithLabel is true', () => {
      component.controlValueWithLabel = true;
      const option = { value: 1, label: 'Xpto' };

      expect(component['getValueWrite'](option)).toEqual(1);
    });

    it('should return when calling getValueWrite when controlValueWithLabel is true and the object structure does not contain the value property', () => {
      component.controlValueWithLabel = true;
      const data = 1;

      expect(component['getValueWrite'](data)).toEqual(data);
    });
  });
});
