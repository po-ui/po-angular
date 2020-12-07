import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';
import { removeDuplicatedOptions, removeUndefinedAndNullOptions, sortOptionsByProperty } from '../../../utils/util';
import * as UtilsFunctions from '../../../utils/util';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

import { PoMultiselectBaseComponent, poMultiselectLiteralsDefault } from './po-multiselect-base.component';
import { PoMultiselectFilterMode } from './po-multiselect-filter-mode.enum';

@Directive()
class PoMultiselectTestComponent extends PoMultiselectBaseComponent {
  constructor() {
    super(new PoLanguageService());
  }

  updateVisibleItems() {}
}

describe('PoMultiselectBaseComponent:', () => {
  const component = new PoMultiselectTestComponent();

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set required', () => {
    expectSettersMethod(component, 'required', '', 'required', true);
    expectSettersMethod(component, 'required', 'true', 'required', true);
    expectSettersMethod(component, 'required', true, 'required', true);
    expectSettersMethod(component, 'required', 'null', 'required', false);
    expectSettersMethod(component, 'required', null, 'required', false);
    expectSettersMethod(component, 'required', 'undefined', 'required', false);
    expectSettersMethod(component, 'required', undefined, 'required', false);

    spyOn(component, <any>'validateModel');
    component.disabled = true;
    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should set disabled', () => {
    expectSettersMethod(component, 'disabled', '', 'disabled', true);
    expectSettersMethod(component, 'disabled', 'true', 'disabled', true);
    expectSettersMethod(component, 'disabled', true, 'disabled', true);
    expectSettersMethod(component, 'disabled', 'null', 'disabled', false);
    expectSettersMethod(component, 'disabled', null, 'disabled', false);
    expectSettersMethod(component, 'disabled', 'undefined', 'disabled', false);
    expectSettersMethod(component, 'disabled', undefined, 'disabled', false);

    spyOn(component, <any>'validateModel');
    spyOn(component, 'updateVisibleItems');
    component.disabled = true;
    expect(component['validateModel']).toHaveBeenCalled();
    expect(component.updateVisibleItems).toHaveBeenCalled();
  });

  it('should set hide-search', () => {
    expectSettersMethod(component, 'hideSearch', '', 'hideSearch', true);
    expectSettersMethod(component, 'hideSearch', 'true', 'hideSearch', true);
    expectSettersMethod(component, 'hideSearch', true, 'hideSearch', true);
    expectSettersMethod(component, 'hideSearch', 'null', 'hideSearch', false);
    expectSettersMethod(component, 'hideSearch', null, 'hideSearch', false);
    expectSettersMethod(component, 'hideSearch', 'undefined', 'hideSearch', false);
    expectSettersMethod(component, 'hideSearch', undefined, 'hideSearch', false);
  });

  it('should set p-filter-mode', () => {
    expectSettersMethod(component, 'filterMode', '', 'filterMode', PoMultiselectFilterMode.startsWith);
    expectSettersMethod(component, 'filterMode', 'startsWith', 'filterMode', PoMultiselectFilterMode.startsWith);
    expectSettersMethod(component, 'filterMode', 'contains', 'filterMode', PoMultiselectFilterMode.contains);
    expectSettersMethod(component, 'filterMode', 'endsWith', 'filterMode', PoMultiselectFilterMode.endsWith);
    expectSettersMethod(
      component,
      'filterMode',
      PoMultiselectFilterMode.startsWith,
      'filterMode',
      PoMultiselectFilterMode.startsWith
    );
    expectSettersMethod(
      component,
      'filterMode',
      PoMultiselectFilterMode.contains,
      'filterMode',
      PoMultiselectFilterMode.contains
    );
    expectSettersMethod(
      component,
      'filterMode',
      PoMultiselectFilterMode.endsWith,
      'filterMode',
      PoMultiselectFilterMode.endsWith
    );
  });

  it('should set options', () => {
    spyOn(component, 'validAndSortOptions');
    component.options = [{ label: '1', value: '1' }];
    expect(component.options.length).toBe(1);
    expect(component.validAndSortOptions).toHaveBeenCalled();
  });

  it('should set p-sort', () => {
    expectSettersMethod(component, 'sort', '', 'sort', true);
    expectSettersMethod(component, 'sort', 'true', 'sort', true);
    expectSettersMethod(component, 'sort', true, 'sort', true);
    expectSettersMethod(component, 'sort', 'null', 'sort', false);
    expectSettersMethod(component, 'sort', null, 'sort', false);
    expectSettersMethod(component, 'sort', 'undefined', 'sort', false);
    expectSettersMethod(component, 'sort', undefined, 'sort', false);

    spyOn(component, 'validAndSortOptions');
    component.sort = true;
    expect(component.validAndSortOptions).toHaveBeenCalled();
  });

  it('should call updateList in OnInit', () => {
    spyOn(component, 'updateList');
    component.options = [];
    component.ngOnInit();
    expect(component.updateList).toHaveBeenCalledWith([]);
  });

  it('should call validation functions and sort function', () => {
    component.options = [{ label: '1', value: 1 }];
    component.sort = true;

    spyOn(UtilsFunctions, 'removeUndefinedAndNullOptions');
    spyOn(UtilsFunctions, 'removeDuplicatedOptions');
    spyOn(component, 'setUndefinedLabels');
    spyOn(UtilsFunctions, 'sortOptionsByProperty');
    component.validAndSortOptions();
    expect(removeUndefinedAndNullOptions).toHaveBeenCalled();
    expect(removeDuplicatedOptions).toHaveBeenCalled();
    expect(component.setUndefinedLabels).toHaveBeenCalled();
    expect(sortOptionsByProperty).toHaveBeenCalled();
  });

  it('should call validation functions but not sort function', () => {
    component.options = [{ label: '1', value: 1 }];
    component.sort = false;

    spyOn(UtilsFunctions, 'removeUndefinedAndNullOptions');
    spyOn(UtilsFunctions, 'removeDuplicatedOptions');
    spyOn(component, 'setUndefinedLabels');
    spyOn(UtilsFunctions, 'sortOptionsByProperty');
    component.validAndSortOptions();
    expect(removeUndefinedAndNullOptions).toHaveBeenCalled();
    expect(removeDuplicatedOptions).toHaveBeenCalled();
    expect(component.setUndefinedLabels).toHaveBeenCalled();
    expect(sortOptionsByProperty).not.toHaveBeenCalled();
  });

  it('shouldn`t call validation functions and sort function', () => {
    component.options = [];
    component.sort = false;

    spyOn(UtilsFunctions, 'removeUndefinedAndNullOptions');
    spyOn(UtilsFunctions, 'removeDuplicatedOptions');
    spyOn(component, 'setUndefinedLabels');
    spyOn(UtilsFunctions, 'sortOptionsByProperty');
    component.validAndSortOptions();
    expect(removeUndefinedAndNullOptions).not.toHaveBeenCalled();
    expect(removeDuplicatedOptions).not.toHaveBeenCalled();
    expect(component.setUndefinedLabels).not.toHaveBeenCalled();
    expect(sortOptionsByProperty).not.toHaveBeenCalled();
  });

  it('should set undefined labels to value', () => {
    const options = [{ value: 1 }, { value: 2, label: undefined }];
    component.setUndefinedLabels(options);
    expect(options[0]['label']).toBe(1);
    expect(options[1]['label']).toBe(2);
  });

  it('should update visible options list', () => {
    component.updateList([{ value: 'TESTE', label: 'teste' }]);
    expect(component['visibleOptionsDropdown'][0]['value']).toBe('TESTE');
    expect(component['visibleOptionsDropdown'][0]['label']).toBe('teste');
  });

  it('should keep visible options list', () => {
    component.visibleOptionsDropdown = [{ value: 1, label: '1' }];
    component.updateList(null);
    expect(component.visibleOptionsDropdown.length).toBe(1);
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    component.setDisabledState(expectedValue);
    expect(component.disabled).toBe(expectedValue);
  });

  it('should call onModelChange and eventChange', () => {
    const fakeThis = {
      onModelChange: v => {},
      eventChange: v => {},
      getValuesFromOptions: v => []
    };

    spyOn(fakeThis, 'onModelChange');
    spyOn(fakeThis, 'eventChange');
    component.callOnChange.call(fakeThis, []);
    expect(fakeThis.onModelChange).toHaveBeenCalledWith([]);
    expect(fakeThis.eventChange).toHaveBeenCalledWith([]);
  });

  it('shouldn`t call eventChange', () => {
    const fakeThis = {
      onModelChange: undefined,
      eventChange: v => {},
      getValuesFromOptions: v => []
    };

    spyOn(fakeThis, 'eventChange');
    component.callOnChange.call(fakeThis, []);
    expect(fakeThis.eventChange).not.toHaveBeenCalled();
  });

  it('should set null to lastLengthModel when selectedOptions is null', () => {
    component['lastLengthModel'] = 1;

    component.eventChange(null);
    expect(component['lastLengthModel']).toBeNull();
  });

  it('should return values from options', () => {
    const options = [
      { value: 1, label: '1' },
      { value: 2, label: '2' }
    ];

    const result = component.getValuesFromOptions(options);
    expect(result.length).toBe(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('should return a empty array', () => {
    let result = component.getValuesFromOptions([]);
    expect(result.length).toBe(0);
    expect(typeof result).toBe('object');

    result = component.getValuesFromOptions(null);
    expect(result.length).toBe(0);
    expect(typeof result).toBe('object');

    result = component.getValuesFromOptions(undefined);
    expect(result.length).toBe(0);
    expect(typeof result).toBe('object');
  });

  it('should return a label by value', () => {
    component.options = [
      { value: 1, label: 'Label 1' },
      { value: 2, label: 'Label 2' }
    ];
    expect(component.getLabelByValue(2)).toBe('Label 2');
  });

  it('should call updateSelectedOptions and callOnChange', () => {
    spyOn(component, 'updateSelectedOptions');
    spyOn(component, 'callOnChange');
    component.changeItems([]);
    expect(component.updateSelectedOptions).toHaveBeenCalled();
    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should search and find options by label', () => {
    component.visibleOptionsDropdown = [];
    const options = [
      { value: 1, label: 'Label 1' },
      { value: 2, label: 'Label 2' },
      { value: 3, label: 'a' },
      { value: 4, label: '1' }
    ];

    component.searchByLabel('Label', options, PoMultiselectFilterMode.startsWith);
    expect(component.visibleOptionsDropdown.length).toBe(2);

    component.searchByLabel('a', options, PoMultiselectFilterMode.contains);
    expect(component.visibleOptionsDropdown.length).toBe(3);

    component.searchByLabel('1', options, PoMultiselectFilterMode.endsWith);
    expect(component.visibleOptionsDropdown.length).toBe(2);
  });

  it('should keep visibleOptionsDropdown', () => {
    component.visibleOptionsDropdown = [{ value: 1, label: 'Label 1' }];

    spyOn(component, 'compareMethod');
    component.searchByLabel('', [], PoMultiselectFilterMode.startsWith);
    expect(component.compareMethod).not.toHaveBeenCalled();
  });

  it('should call startsWith in compareMethod', () => {
    spyOn(component, 'startsWith');
    component.compareMethod('Label', { value: 1, label: 'Label 1' }, PoMultiselectFilterMode.startsWith);
    expect(component.startsWith).toHaveBeenCalled();
  });

  it('should call contains in compareMethod', () => {
    spyOn(component, 'contains');
    component.compareMethod('Label', { value: 1, label: 'Label 1' }, PoMultiselectFilterMode.contains);
    expect(component.contains).toHaveBeenCalled();
  });

  it('should call endsWith in compareMethod', () => {
    spyOn(component, 'endsWith');
    component.compareMethod('Label', { value: 1, label: 'Label 1' }, PoMultiselectFilterMode.endsWith);
    expect(component.endsWith).toHaveBeenCalled();
  });

  it('should find the labels', () => {
    expect(component.startsWith('a', { value: 1, label: 'abc' })).toBeTruthy();
    expect(component.contains('b', { value: 1, label: 'abc' })).toBeTruthy();
    expect(component.endsWith('c', { value: 1, label: 'abc' })).toBeTruthy();
  });

  it('shouldn`t find the labels', () => {
    expect(component.startsWith('b', { value: 1, label: 'abc' })).toBeFalsy();
    expect(component.contains('d', { value: 1, label: 'abc' })).toBeFalsy();
    expect(component.endsWith('a', { value: 1, label: 'abc' })).toBeFalsy();
  });

  it('should return null in validate', () => {
    component.required = false;
    expect(component.validate(new FormControl())).toBeNull();
  });

  it('shouldn`t return null in validate', () => {
    component.required = true;
    component.disabled = false;

    expect(component.validate(new FormControl())).not.toBeNull();
  });

  it('should set selectedOptions and call updateVisibleItems', () => {
    component.selectedOptions = [];
    component.options = [
      { value: 1, label: '1' },
      { value: 2, label: '2' }
    ];

    spyOn(component, 'updateVisibleItems');
    component.updateSelectedOptions([1, 3]);
    expect(component.updateVisibleItems).toHaveBeenCalled();
    expect(component.selectedOptions.length).toBe(1);
  });

  it('should update model if the values is different of the selectedOptions.', () => {
    component.selectedOptions = [];
    component.options = [
      { value: 1, label: '1' },
      { value: 2, label: '2' }
    ];

    spyOn(component, 'updateSelectedOptions').and.callThrough();
    spyOn(component, 'callOnChange');

    component.writeValue([2, 3]);

    expect(component.updateSelectedOptions).toHaveBeenCalledWith([2, 3]);
    expect(component.callOnChange).toHaveBeenCalledWith([{ value: 2, label: '2' }]);
  });

  it('should register onModelChange', () => {
    const fakeThis = {
      onModelChange: ''
    };
    component.registerOnChange.call(fakeThis, () => {});
    expect(typeof fakeThis.onModelChange).toBe('function');
  });

  it('should register onModelTouched', () => {
    const fakeThis = {
      onModelTouched: ''
    };
    component.registerOnTouched.call(fakeThis, () => {});
    expect(typeof fakeThis.onModelTouched).toBe('function');
  });

  describe('Methods:', () => {
    it('eventChange: should emit if model changed', () => {
      const value = [];
      component['lastLengthModel'] = 1;

      spyOn(component.change, 'emit');
      component.eventChange(value);
      expect(component.change.emit).toHaveBeenCalledWith(value);
      expect(component['lastLengthModel']).toBe(0);
    });

    it('eventChange: shouldn`t emit if model is the same', () => {
      component['lastLengthModel'] = 1;

      spyOn(component.change, 'emit');
      component.eventChange([{ value: 1, label: '1' }]);
      expect(component.change.emit).not.toHaveBeenCalled();
    });

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validatorChange'] = undefined;

      component['validateModel']();

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']();

      expect(component['validatorChange']).toHaveBeenCalledWith();
    });

    it('writeValue: should call `updateSelectedOptions` with `[]` if model value is `invalid`.', () => {
      spyOn(component, 'updateSelectedOptions');

      component.writeValue(null);

      expect(component.updateSelectedOptions).toHaveBeenCalledWith([]);
    });
  });

  describe('Properties:', () => {
    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poMultiselectLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poMultiselectLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poMultiselectLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poMultiselectLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poMultiselectLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, poMultiselectLiteralsDefault[poLocaleDefault]);

      // Custom some literals
      customLiterals.noData = 'No data custom';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poMultiselectLiteralsDefault[poLocaleDefault]);
    });
  });
});
