import { Directive } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import * as UtilsFunctions from '../../../utils/util';
import * as ValidatorsFunctions from './../validators';
import { convertDateToISOExtended, formatYear, getShortBrowserLanguage, setYearFrom0To100 } from '../../../utils/util';
import { expectSettersMethod, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoDatepickerBaseComponent } from './po-datepicker-base.component';
import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';
import { PoMask } from '../po-input/po-mask';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

@Directive()
class PoDatepickerComponent extends PoDatepickerBaseComponent {
  writeValue(value: any): void {}
  refreshValue(value: Date): void {}
}

describe('PoDatepickerBaseComponent:', () => {
  let component: PoDatepickerComponent;
  let languageService: PoLanguageService;
  languageService = new PoLanguageService();

  beforeEach(() => {
    component = new PoDatepickerComponent(languageService);
    component['shortLanguage'] = 'pt';
  });

  it('should be created', () => {
    expect(component instanceof PoDatepickerBaseComponent).toBeTruthy();
    expect(component.locale).toBe(component['shortLanguage']);
  });

  it('should be update property p-disabled', () => {
    spyOn(component, <any>'validateModel');
    spyOn(UtilsFunctions, 'convertDateToISOExtended');

    expectSettersMethod(component, 'setDisabled', '', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'true', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'false', 'disabled', false);

    expect(component['validateModel']).toHaveBeenCalled();
    expect(convertDateToISOExtended).toHaveBeenCalled();
  });

  it('should update property p-required', () => {
    spyOn(component, <any>'validateModel');
    spyOn(UtilsFunctions, 'convertDateToISOExtended');

    expectSettersMethod(component, 'setRequired', '', 'required', true);
    expectSettersMethod(component, 'setRequired', 'true', 'required', true);
    expectSettersMethod(component, 'setRequired', 'false', 'required', false);

    expect(component['validateModel']).toHaveBeenCalled();
    expect(convertDateToISOExtended).toHaveBeenCalled();
  });

  it('should update property p-readonly', () => {
    expectSettersMethod(component, 'setReadonly', '', 'readonly', true);
    expectSettersMethod(component, 'setReadonly', 'true', 'readonly', true);
    expectSettersMethod(component, 'setReadonly', 'false', 'readonly', false);
  });

  it('should update property p-clean', () => {
    expectSettersMethod(component, 'setClean', '', 'clean', true);
    expectSettersMethod(component, 'setClean', 'true', 'clean', true);
    expectSettersMethod(component, 'setClean', 'false', 'clean', false);
  });

  it('should be update property p-min-date with 0 hours using string', () => {
    spyOn(component, <any>'validateModel');

    component.minDate = new Date(2017, 7, 1, 5, 10, 8).toISOString();

    expect(component['_minDate'].getDate()).toBe(1);
    expect(component['_minDate'].getMonth()).toBe(7);
    expect(component['_minDate'].getFullYear()).toBe(2017);
    expect(component['_minDate'].getHours()).toBe(0);
    expect(component['_minDate'].getMinutes()).toBe(0);
    expect(component['_minDate'].getSeconds()).toBe(0);

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should be update property p-min-date with 0 hours using Date', () => {
    component.minDate = new Date(2017, 7, 1, 5, 10, 8);

    expect(component['_minDate'].getDate()).toBe(1);
    expect(component['_minDate'].getMonth()).toBe(7);
    expect(component['_minDate'].getFullYear()).toBe(2017);
    expect(component['_minDate'].getHours()).toBe(0);
    expect(component['_minDate'].getMinutes()).toBe(0);
    expect(component['_minDate'].getSeconds()).toBe(0);
  });

  it('should be update property p-max-date with 23:59:59 hours using string', () => {
    spyOn(component, <any>'validateModel');

    component.maxDate = new Date(2017, 7, 1, 5, 10, 8).toISOString();

    expect(component['_maxDate'].getDate()).toBe(1);
    expect(component['_maxDate'].getMonth()).toBe(7);
    expect(component['_maxDate'].getFullYear()).toBe(2017);
    expect(component['_maxDate'].getHours()).toBe(23);
    expect(component['_maxDate'].getMinutes()).toBe(59);
    expect(component['_maxDate'].getSeconds()).toBe(59);

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should be update property p-max-date with 23:59:59 hours using Date', () => {
    component.maxDate = new Date(2017, 7, 1, 5, 10, 8);
    expect(component['_maxDate'].getDate()).toBe(1);
    expect(component['_maxDate'].getMonth()).toBe(7);
    expect(component['_maxDate'].getFullYear()).toBe(2017);
    expect(component['_maxDate'].getHours()).toBe(23);
    expect(component['_maxDate'].getMinutes()).toBe(59);
    expect(component['_maxDate'].getSeconds()).toBe(59);
  });

  it('should be update property p-locale', () => {
    expectPropertiesValues(component, 'locale', '', 'pt');
    expectPropertiesValues(component, 'locale', ['pt', 'x'], 'pt');
    expectPropertiesValues(component, 'locale', 'en', 'en');
    expectPropertiesValues(component, 'locale', 'es', 'es');
    expectPropertiesValues(component, 'locale', 'ru', 'ru');
  });

  it('should transform a String to Date', () => {
    component.format = 'dd/MM/yyyy';

    const date = component.getDateFromString('05/06/2017');

    expect(date.toISOString()).toBe(new Date(2017, 5, 5).toISOString());
  });

  it('should be null to invalid date', () => {
    component['setRequired'] = 'false';
    component.format = 'dd/MM/yyyy';

    const date = component.getDateFromString('05/13/2017');

    expect(date).toBeNull();
  });

  it('should format Date to dd/mm/yyyy', () => {
    component.format = 'dd/MM/yyyy';

    const date = new Date(2017, 5, 5);
    const formatted = component.formatToDate(date);

    expect(formatted).toBe('05/06/2017');
  });

  it('should format Date to dd/mm/yyyy when format is invalid', () => {
    component.format = 'aa/aa/aaaa';

    const date = new Date(2017, 5, 5);
    const formatted = component.formatToDate(date);

    expect(formatted).toBe('05/06/2017');
  });

  it('should format Date to dd/mm/yyyy when locale is invalid', () => {
    component.locale = 'e';

    const date = new Date(2017, 5, 5);
    const formatted = component.formatToDate(date);

    expect(formatted).toBe('05/06/2017');
  });

  it('should be date undefined when no pass date to control model and required equal false', () => {
    spyOn(component, 'callOnChange');
    component.required = false;
    component.controlModel(undefined);

    expect(component.callOnChange).toHaveBeenCalledWith('');
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    component.setDisabledState(expectedValue);
    expect(component.disabled).toBe(expectedValue);
  });

  it('should be call callOnChange with minDate', () => {
    spyOn(component, 'callOnChange');
    component.minDate = '2000-01-01';
    component.maxDate = '';
    component.controlModel(new Date(2001, 1, 24));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be call callOnChange with maxDate', () => {
    spyOn(component, 'callOnChange');
    component.minDate = '';
    component.maxDate = '2000-01-01';
    component.controlModel(new Date(1997, 1, 24));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be call callOnChange with no dateStart and no dateEnd', () => {
    spyOn(component, 'callOnChange');
    component.minDate = '';
    component.maxDate = '';
    component.controlModel(new Date(1997, 1, 24));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('registering the change function', () => {
    const fnChangeModel = () => {};

    component.registerOnChange(fnChangeModel);

    expect(component['onChangeModel']).toBe(fnChangeModel);
  });

  it('registering the touched function', () => {
    const fnTouched = () => {};

    component.registerOnTouched(fnTouched);

    expect(component['onTouchedModel']).toBe(fnTouched);
  });

  it('should be mask builded', () => {
    component.format = 'dd/MM/yyyy';

    const objMask: PoMask = component['buildMask']();

    expect(objMask.mask).toBe('99/99/9999');
  });

  describe('Methods:', () => {
    describe('controlModel:', () => {
      it('should call `callOnChange` when have a date.', () => {
        spyOn(component, 'callOnChange');

        component.controlModel(new Date(2018, 7, 30));

        expect(component.callOnChange).toHaveBeenCalled();
      });

      it('should call `callOnChange` when date is `undefined`.', () => {
        spyOn(component, 'callOnChange');

        component.controlModel(undefined);

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });

      it('should call `callOnChange` when date is `undefined` and set `Data inválida` in model.', () => {
        spyOn(component, 'callOnChange');

        component.controlModel(null);

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });

      it('should call `convertDateToISOExtended` if has `date` and `isExtendedISO` is `true`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISOExtended');
        component['isExtendedISO'] = true;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISOExtended).toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISOExtended` if hasn`t `date`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISOExtended');
        component['isExtendedISO'] = true;

        component.controlModel(undefined);

        expect(UtilsFunctions.convertDateToISOExtended).not.toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISOExtended` if `isExtendedISO` is `false`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISOExtended');
        component['isExtendedISO'] = false;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISOExtended).not.toHaveBeenCalled();
      });

      it('should call `convertDateToISODate` if has `date` and `isExtendedISO` is `false`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISODate');
        component['isExtendedISO'] = false;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISODate).toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISODate` if hasn`t `date`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISODate');
        component['isExtendedISO'] = false;

        component.controlModel(undefined);

        expect(UtilsFunctions.convertDateToISODate).not.toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISODate` if `isExtendedISO` is `true`.', () => {
        spyOn(UtilsFunctions, 'convertDateToISODate');
        component['isExtendedISO'] = true;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISODate).not.toHaveBeenCalled();
      });
    });

    it('formatToDate: should call `formatYear` with date year', () => {
      const date = new Date();
      spyOn(UtilsFunctions, 'formatYear');

      component.formatToDate(date);

      expect(formatYear).toHaveBeenCalledWith(date.getFullYear());
    });

    it('getDateFromString: should call `setYearFrom0To100`', () => {
      const date = '0001-01-01';
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.getDateFromString(date);

      expect(setYearFrom0To100).toHaveBeenCalled();
    });

    describe('validate:', () => {
      let invalidDateError;

      beforeEach(() => {
        invalidDateError = {
          date: {
            valid: false
          }
        };
      });

      it(`should invalidate form and set errorPattern with errorPattern value
        when has an errorPattern value and date is invalid`, () => {
        component.errorPattern = 'errorPattern';

        expect(component.validate(new FormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('errorPattern');
      });

      it(`should invalidate form and set errorPattern 'Data inválida' when
        doesn't have an errorPattern value and date is invalid`, () => {
        component.errorPattern = '';

        expect(component.validate(new FormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data inválida');
      });

      it(`should invalidate form and set errorPattern 'Data inválida' when
        errorPattern is equal to 'Data fora do período' and date is invalid`, () => {
        component.errorPattern = 'Data fora do período';

        expect(component.validate(new FormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data inválida');
      });

      it(`should invalidate form and set errorPattern '' when date is undefined`, () => {
        const invalidRequiredError = {
          required: {
            valid: false
          }
        };
        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

        expect(component.validate(new FormControl(undefined))).toEqual(invalidRequiredError);
        expect(component.errorPattern).toBe('');
      });

      it(`should invalidate form and set errorPattern 'Data fora do período' when has a date out of range`, () => {
        spyOn(UtilsFunctions, 'validateDateRange').and.returnValue(false);

        component['date'] = new Date(2018, 5, 5);

        expect(component.validate(new FormControl('Tue Jun 05 2018 00:00:00'))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it(`should invalidate form and set errorPattern 'Data fora do período' when
        has a date out of range and errorPattern is 'Data inválida'`, () => {
        spyOn(UtilsFunctions, 'validateDateRange').and.returnValue(false);

        component.errorPattern = 'Data inválida';
        component['date'] = new Date(2018, 5, 5);

        expect(component.validate(new FormControl('Tue Jun 05 2018 00:00:00'))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it(`shouldn't invalidate form and set errorPattern '' when set a valid date and errorPattern is 'Data inválida'`, () => {
        component.errorPattern = 'Data inválida';

        expect(component.validate(new FormControl('Tue Jun 05 2018 00:00:00'))).toEqual(null);
        expect(component.errorPattern).toBe('');
      });

      it(`shouldn't invalidate form and set errorPattern '' when set a valid date and errorPattern is 'Data fora do período'`, () => {
        component.errorPattern = 'Data fora do período';

        expect(component.validate(new FormControl('Tue Jun 05 2018 00:00:00'))).toEqual(null);
        expect(component.errorPattern).toBe('');
      });
    });

    it('ngOnInit: should call buildMask', () => {
      spyOn(component, <any>'buildMask');

      component.ngOnInit();

      expect(component['buildMask']).toHaveBeenCalled();
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']([]);

      expect(component['validatorChange']).toHaveBeenCalledWith([]);
    });

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('callOnChange: should call `onChangeModel` with `value` param if `onChangeModel` is truthy and `value` is different from the `previousValue`', () => {
      const expectedValue = '2019-04-04';

      const spyOnChangeModel = spyOn(component, <any>'onChangeModel');

      component.callOnChange(expectedValue);

      expect(spyOnChangeModel).toHaveBeenCalledWith(expectedValue);
    });

    it('callOnChange: shouldn`t call `onChangeModel` if `value` is equal to the `previousValue`', () => {
      const expectedValue = '2019-04-04';

      component['previousValue'] = '2019-04-04';

      const spyOnChangeModel = spyOn(component, <any>'onChangeModel');

      component.callOnChange(expectedValue);

      expect(spyOnChangeModel).not.toHaveBeenCalled();
    });

    it('callOnChange: should call `callOnChange` only twice if `retry` param is true and `onChangeModel` is falsy', fakeAsync(() => {
      const value = '2019-04-04';

      const spyCallOnChange = spyOn(component, 'callOnChange').and.callThrough();

      component['onChangeModel'] = undefined;

      component.callOnChange(value);

      tick(50);

      expect(component['onChangeModel']).toBe(undefined);
      expect(spyCallOnChange).toHaveBeenCalledTimes(2);
    }));

    it('callOnChange: should call `callOnChange` only once if `retry` param is false and `onChangeModel` is falsy', fakeAsync(() => {
      const value = '2019-04-04';

      const spyCallOnChange = spyOn(component, 'callOnChange').and.callThrough();

      component['onChangeModel'] = undefined;

      component.callOnChange(value, false);

      tick(50);

      expect(component['onChangeModel']).toBe(undefined);
      expect(spyCallOnChange).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Properties:', () => {
    it('p-no-autocomplete: should update property with valid values with valid values.', () => {
      const invalidValues = [undefined, null, 0, 'false', 'string'];
      expectPropertiesValues(component, 'noAutocomplete', invalidValues, false);
    });

    it('p-no-autocomplete: should update property with valid values with valid values.', () => {
      const validValues = [true, 'true', 1, ' '];
      expectPropertiesValues(component, 'noAutocomplete', validValues, true);
    });

    it('isExtendedISO: should be false.', () => {
      expect(component['isExtendedISO']).toBeFalsy();
    });

    it('p-format: should set with valid values', () => {
      const validValues = ['dd/mm/yyyy', 'mm/dd/yyyy', 'yyyy/mm/dd'];
      expectPropertiesValues(component, 'format', validValues, validValues);
    });

    it('p-format: should set with invalid values', () => {
      const invalidValues = ['', undefined, null, 0, 'text'];
      expectPropertiesValues(component, 'format', invalidValues, 'dd/mm/yyyy');
    });

    it('p-format: should call refreshValue and buildMask when set a date format', () => {
      spyOn(component, <any>'buildMask');
      spyOn(component, 'refreshValue');

      component.format = 'dd/mm/yyyy';

      expect(component['buildMask']).toHaveBeenCalled();
      expect(component.refreshValue).toHaveBeenCalled();
    });

    it('p-format: should call buildMask and set a `dd/mm/yyyy` date format when set a invalid value', () => {
      spyOn(component, <any>'buildMask');

      component.format = undefined;

      expect(component['buildMask']).toHaveBeenCalled();
      expect(component['_format']).toBe('dd/mm/yyyy');
    });

    it('p-placeholder: should update a empty string when valid values', () => {
      const invalidValues = [undefined, 1, {}, [], true, false];

      expectPropertiesValues(component, 'placeholder', invalidValues, '');
    });

    it('p-placeholder: should update with valid value', () => {
      const validValue = 'test';

      expectPropertiesValues(component, 'placeholder', validValue, validValue);
    });

    it('p-min-date: should set start date with year 1', () => {
      const date = new Date(1, 1, 1);
      date.setFullYear(1);

      component.minDate = date;

      expect(component['_minDate'].getFullYear()).toBe(1);
    });

    it('minDate: should call `setYearFrom0To100`', () => {
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.minDate = new Date();
      expect(setYearFrom0To100).toHaveBeenCalled();
    });

    it('p-max-date: should set end date with year 1', () => {
      const date = new Date(1, 1, 1);
      date.setFullYear(1);

      component.maxDate = date;

      expect(component['_maxDate'].getFullYear()).toBe(1);
    });

    it('maxDate: should call `setYearFrom0To100`', () => {
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.maxDate = new Date();

      expect(setYearFrom0To100).toHaveBeenCalled();
    });

    it('p-iso-format: should update with valid value', () => {
      const validValue = [PoDatepickerIsoFormat.Basic, PoDatepickerIsoFormat.Extended, 'basic', 'extended'];

      expectPropertiesValues(component, 'isoFormat', validValue, validValue);
    });

    it('p-iso-format: should set isExtendedISO with `false` if isoFormat value is `PoDatepickerIsoFormat.Basic`', () => {
      component.isoFormat = PoDatepickerIsoFormat.Basic;

      expect(component['isExtendedISO']).toBe(false);
    });

    it('p-iso-format: should set isExtendedISO with `true` if isoFormat value is `PoDatepickerIsoFormat.Extended`', () => {
      component.isoFormat = PoDatepickerIsoFormat.Extended;

      expect(component['isExtendedISO']).toBe(true);
    });

    it('p-iso-format: should be set with `undefined` if it receives an invalid value', () => {
      const invalidValues = [undefined, 0, 1, 3, 'valor', [], true, false];

      expectPropertiesValues(component, 'isoFormat', invalidValues, undefined);
    });
  });
});
