import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import * as UtilsFunctions from '../../../utils/util';
import * as ValidatorsFunctions from '../validators';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

import { PoDatepickerRange } from './interfaces/po-datepicker-range.interface';
import { PoDatepickerRangeBaseComponent } from './po-datepicker-range-base.component';
import { poDatepickerRangeLiteralsDefault } from './po-datepicker-range.literals';
import { PoLanguageService } from '../../../services';

describe('PoDatepickerRangeBaseComponent:', () => {
  @Directive()
  class PoDatepickerRangeComponent extends PoDatepickerRangeBaseComponent {
    updateScreenByModel(dateRange: PoDatepickerRange) {}
    resetDateRangeInputValidation() {}
  }

  const mockedService: any = {
    dateRegex: '',
    isoRegex: '',
    convertIsoToDate: () => {},
    convertDateToISO: () => {},
    formatYear: () => {},
    getDateFromIso: () => {},
    getDateForDateRange: () => {},
    isDateRangeValid: () => {},
    isValidIso: () => {},
    setYearFrom0To100: () => {},
    splitDate: () => {},
    validateDateRange: () => {},
    validateDate: () => {}
  };

  const component = new PoDatepickerRangeComponent(mockedService, new PoLanguageService());

  it('should be created', () => {
    expect(component instanceof PoDatepickerRangeBaseComponent).toBeTruthy();
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

    it('clean: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'clean', booleanValidTrueValues, true);
    });

    it('clean: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];

      expectPropertiesValues(component, 'clean', booleanInvalidValues, false);
    });

    it('disabled: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
    });

    it('disabled: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];

      expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
    });

    it('disabled: should call `validateModel` with `dateRange`.', () => {
      spyOn(component, <any>'validateModel');

      component.disabled = true;

      expect(component['validateModel']).toHaveBeenCalledWith(component['dateRange']);
    });

    it(`endDate: should call 'convertPatternDateFormat' with 'date', set 'dateRange.end',
      call 'updateScreenByModel' with 'endDate' and call 'updateModel' with 'endDate.`, () => {
      const date = '2018-02-25';
      const endDate: PoDatepickerRange = { start: '', end: date };
      component['dateRange'] = { start: '', end: '' };

      spyOn(component, <any>'convertPatternDateFormat').and.returnValue(date);
      spyOn(component, 'updateScreenByModel');
      spyOn(component, <any>'updateModel');

      component.endDate = date;

      expect(component['dateRange'].end).toBe(date);
      expect(component['convertPatternDateFormat']).toHaveBeenCalledWith(date);
      expect(component.updateScreenByModel).toHaveBeenCalledWith(endDate);
      expect(component['updateModel']).toHaveBeenCalledWith(endDate);
    });

    it('literals: should return literals default if `_literals` is undefined', () => {
      component['language'] = 'pt';

      component['_literals'] = undefined;

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault.pt);
    });

    it('literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault[poLocaleDefault]);
    });

    it('literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault.pt);
    });

    it('literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault.en);
    });

    it('literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, poDatepickerRangeLiteralsDefault[poLocaleDefault]);

      customLiterals.invalidFormat = 'Incorrect format';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault.es);
    });

    it('literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poDatepickerRangeLiteralsDefault.ru);
    });

    it('literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poDatepickerRangeLiteralsDefault[poLocaleDefault]);
    });

    it('readonly: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
    });

    it('readonly: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];

      expectPropertiesValues(component, 'readonly', booleanInvalidValues, false);
    });

    it('readonly: should call `validateModel`.', () => {
      spyOn(component, <any>'validateModel');

      component.readonly = true;

      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('required: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'required', booleanValidTrueValues, true);
    });

    it('required: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];

      expectPropertiesValues(component, 'required', booleanInvalidValues, false);
    });

    it('required: should call `validateModel`.', () => {
      spyOn(component, <any>'validateModel');

      component.required = true;

      expect(component['validateModel']).toHaveBeenCalled();
    });

    it(`start-date: should call 'convertPatternDateFormat' with 'date', set 'dateRange.start',
      call 'updateScreenByModel' with 'startDate' and call 'updateModel' with 'startDate.`, () => {
      const date = '2018-02-25';
      const start: PoDatepickerRange = { start: date, end: '' };
      component['dateRange'] = { start: '', end: '' };

      spyOn(component, <any>'convertPatternDateFormat').and.returnValue(date);
      spyOn(component, 'updateScreenByModel');
      spyOn(component, <any>'updateModel');

      component.startDate = date;

      expect(component['dateRange'].start).toBe(date);
      expect(component['convertPatternDateFormat']).toHaveBeenCalledWith(date);
      expect(component.updateScreenByModel).toHaveBeenCalledWith(start);
      expect(component['updateModel']).toHaveBeenCalledWith(start);
    });
  });

  describe('Methods:', () => {
    it('registerOnChange: should set `onChangeModel` with value of the `func`.', () => {
      const func = () => {};

      component.registerOnChange(func);

      expect(component['onChangeModel']).toBe(func);
    });

    it('registerOnTouched: should set `onTouchedModel` with value of the `func`.', () => {
      const func = () => {};

      component.registerOnTouched(func);

      expect(component['onTouchedModel']).toBe(func);
    });

    it('registerOnValidatorChange: should set `validatorChange` with value of the `func`.', () => {
      const func = () => {};

      component.registerOnValidatorChange(func);

      expect(component['validatorChange']).toBe(func);
    });

    describe('validate:', () => {
      let invalidDateRangeError;

      beforeEach(() => {
        invalidDateRangeError = {
          date: {
            valid: false
          }
        };
      });

      it('should call `convertPatternDateFormat` to have been called 2 times.', () => {
        const value = { value: { start: '2018-10-15', end: '2018-10-20' } };

        spyOn(component, <any>'convertPatternDateFormat');
        spyOn(component, <any>'requiredDateRangeFailed');
        spyOn(component, <any>'dateRangeFormatFailed');
        spyOn(component, <any>'dateRangeFailed');

        component.validate(<any>value);

        expect(component['convertPatternDateFormat']).toHaveBeenCalledTimes(2);
      });

      it(`should call 'requiredDateRangeFailed', set 'errorMessage' to '' and return 'invalidDateRangeRequiredError'.`, () => {
        const invalidDateRangeRequiredError = {
          required: {
            valid: false
          }
        };

        spyOn(component, <any>'requiredDateRangeFailed').and.returnValue(true);
        spyOn(component, <any>'dateRangeFormatFailed');
        spyOn(component, <any>'dateRangeFailed');

        const validate = component.validate(new FormControl([]));

        expect(component['requiredDateRangeFailed']).toHaveBeenCalled();
        expect(component.errorMessage).toEqual('');
        expect(validate).toEqual(invalidDateRangeRequiredError);
      });

      it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
        const expectedValue = true;
        component.setDisabledState(expectedValue);
        expect(component.disabled).toBe(expectedValue);
      });

      it(`should call 'dateRangeObjectFailed', set 'errorMessage' as 'literals.invalidFormat'
        and return 'invalidDateRangeError'.`, () => {
        component.literals = poDatepickerRangeLiteralsDefault.pt;

        spyOn(component, <any>'dateRangeFormatFailed').and.returnValue(true);
        spyOn(component, <any>'dateRangeObjectFailed').and.returnValue(false);
        spyOn(component, <any>'requiredDateRangeFailed');
        spyOn(component, <any>'dateRangeFailed');

        const validate = component.validate(new FormControl([]));

        expect(component['dateRangeFormatFailed']).toHaveBeenCalled();
        expect(component.errorMessage).toEqual(component.literals.invalidFormat);
        expect(validate).toEqual(invalidDateRangeError);
      });

      it(`should call 'dateRangeObjectFailed', set 'errorMessage' as 'literals.invalidFormat'
        and return 'invalidDateRangeError'.`, () => {
        component.literals = poDatepickerRangeLiteralsDefault.pt;

        spyOn(component, <any>'dateRangeObjectFailed').and.returnValue(true);
        spyOn(component, <any>'requiredDateRangeFailed');
        spyOn(component, <any>'dateRangeFailed');

        const validate = component.validate(new FormControl([]));

        expect(component['dateRangeObjectFailed']).toHaveBeenCalled();
        expect(component.errorMessage).toEqual(component.literals.invalidFormat);
        expect(validate).toEqual(invalidDateRangeError);
      });

      it(`should call 'dateRangeFailed', set 'errorMessage' to 'literals.startDateGreaterThanEndDate' and return
        'invalidDateRangeError'.`, () => {
        component.literals = poDatepickerRangeLiteralsDefault.pt;

        spyOn(component, <any>'dateRangeObjectFailed').and.returnValue(false);
        spyOn(component, <any>'dateRangeFailed').and.returnValue(true);
        spyOn(component, <any>'requiredDateRangeFailed');
        spyOn(component, <any>'dateRangeFormatFailed');

        const validate = component.validate(new FormControl([]));

        expect(component['dateRangeFailed']).toHaveBeenCalled();
        expect(component.errorMessage).toEqual(component.literals.startDateGreaterThanEndDate);
        expect(validate).toEqual(invalidDateRangeError);
      });

      it(`should call 'requiredDateRangeFailed', 'dateRangeFormatFailed' and 'dateRangeFailed' with return
        false and return 'invalidDateRangeError'.`, () => {
        const spyOnReturns = false;
        const returnNull = null;

        spyOn(component, <any>'requiredDateRangeFailed').and.returnValue(spyOnReturns);
        spyOn(component, <any>'dateRangeFormatFailed').and.returnValue(spyOnReturns);
        spyOn(component, <any>'dateRangeFailed').and.returnValue(spyOnReturns);

        const validate = component.validate(new FormControl(undefined));

        expect(component['requiredDateRangeFailed']).toHaveBeenCalled();
        expect(component['dateRangeFormatFailed']).toHaveBeenCalled();
        expect(component['dateRangeFailed']).toHaveBeenCalled();
        expect(validate).toEqual(returnNull);
      });
    });

    it(`writeValue: should call 'validateModel', updateScreenByModel and set 'dateRange' with empty properties if
      'dateRange' is falsy`, () => {
      component['dateRange'] = { start: '2018-05-20', end: '2018-06-23' };
      const dateRangeExpeted = { start: '', end: '' };

      spyOn(component, <any>'validateModel');
      spyOn(component, <any>'isDateRangeObject').and.returnValue(false);
      spyOn(component, 'updateScreenByModel');

      const value = undefined;

      component.writeValue(value);

      expect(component['dateRange']).toEqual(dateRangeExpeted);
      expect(component['validateModel']).toHaveBeenCalledWith(dateRangeExpeted);
      expect(component.updateScreenByModel).toHaveBeenCalledWith(dateRangeExpeted);
    });

    it(`writeValue: should call 'updateModel', updateScreenByModel and set 'dateRange' with empty properties if
      'dateRangeObjectFailed' return is false`, () => {
      component['dateRange'] = { start: '2018-05-20', end: '2018-06-23' };
      const dateRangeExpeted = { start: '', end: '' };

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'dateRangeObjectFailed').and.returnValue(true);
      spyOn(component, 'updateScreenByModel');

      const value = 'invalid value';

      component.writeValue(<any>value);

      expect(component['dateRange']).toEqual(dateRangeExpeted);
      expect(component['updateModel']).toHaveBeenCalledWith(value);
      expect(component.updateScreenByModel).toHaveBeenCalledWith(dateRangeExpeted);
    });

    it(`writeValue: should call 'updateModel', updateScreenByModel and set 'dateRange' with value param if
      its is dateRange object`, () => {
      component['dateRange'] = { start: '2018-05-20', end: '2018-06-23' };

      spyOn(component, <any>'isDateRangeObject').and.returnValue(true);
      spyOn(component, <any>'validateModel');
      spyOn(component, <any>'updateModel');
      spyOn(component, 'updateScreenByModel');

      const value = { start: '2019-05-20', end: '2019-06-23' };

      component.writeValue(value);

      expect(component['dateRange']).toEqual(value);
      expect(component['validateModel']).not.toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith(value);
      expect(component.updateScreenByModel).toHaveBeenCalledWith(value);
    });

    it(`writeValue: should call 'convertPatternDateFormat' to set 'dateRange' if its is date range object`, () => {
      component['dateRange'] = { start: '2018-05-20', end: '2018-06-23' };
      const dateRangeExpeted = { start: '2019-05-20', end: '2019-06-23' };

      spyOn(component, <any>'isDateRangeObject').and.returnValue(true);
      spyOn(component, <any>'convertPatternDateFormat').and.returnValues('2019-05-20', '2019-06-23');

      const value = { start: new Date(), end: new Date() };

      component.writeValue(value);

      expect(component['dateRange']).toEqual(dateRangeExpeted);
      expect(component['convertPatternDateFormat']).toHaveBeenCalledWith(value.start);
      expect(component['convertPatternDateFormat']).toHaveBeenCalledWith(value.end);
    });

    it('dateFormatFailed: ', () => {
      const value = '2018-10-25';
      const fakeThis = {
        poDateService: {
          isValidIso: arg => {}
        }
      };

      spyOn(fakeThis.poDateService, 'isValidIso');

      component['dateFormatFailed'].call(fakeThis, value);

      expect(fakeThis.poDateService.isValidIso).toHaveBeenCalledWith(value);
    });

    it(`dateRangeFailed: should return false if 'isDateRangeValid(endDate, startDate)' returns true and
      'isStartDateRangeInputValid' is true.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis: any = {
        isStartDateRangeInputValid: true,
        poDateService: {
          isDateRangeValid: () => {}
        }
      };

      spyOn(fakeThis.poDateService, 'isDateRangeValid').and.returnValue(true);

      const dateRangeFailedReturn = component['dateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(fakeThis.poDateService.isDateRangeValid).toHaveBeenCalledWith(endDate, startDate);
      expect(dateRangeFailedReturn).toBeFalsy();
    });

    it(`dateRangeFailed: should return true if 'isDateRangeValid(endDate, startDate)' return false.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis: any = {
        isStartDateRangeInputValid: true,
        poDateService: {
          isDateRangeValid: () => {}
        }
      };

      spyOn(fakeThis.poDateService, 'isDateRangeValid').and.returnValue(false);

      const dateRangeFailedReturn = component['dateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(fakeThis.poDateService.isDateRangeValid).toHaveBeenCalledWith(endDate, startDate);
      expect(dateRangeFailedReturn).toBeTruthy();
    });

    it(`dateRangeFailed: should return true if 'isStartDateRangeInputValid' return false.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis: any = {
        isStartDateRangeInputValid: false,
        poDateService: {
          isDateRangeValid: () => {}
        }
      };

      spyOn(fakeThis.poDateService, 'isDateRangeValid').and.returnValue(true);

      const dateRangeFailedReturn = component['dateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(fakeThis.poDateService.isDateRangeValid).toHaveBeenCalledWith(endDate, startDate);
      expect(dateRangeFailedReturn).toBeTruthy();
    });

    it(`dateRangeFormatFailed: should return true if 'dateFormatFailed(endDate)' or 'dateFormatFailed(endDate)' return true.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis = {
        isDateRangeInputFormatValid: true,
        dateFormatFailed: () => {}
      };

      spyOn(fakeThis, <any>'dateFormatFailed').and.returnValue(true);

      const dateRangeFormatFailedReturn = component['dateRangeFormatFailed'].call(fakeThis, startDate, endDate);

      expect(dateRangeFormatFailedReturn).toBeTruthy();
    });

    it(`dateRangeFormatFailed: should return true if 'isDateRangeInputFormatValid' is false.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis = {
        isDateRangeInputFormatValid: false,
        dateFormatFailed: () => {}
      };

      spyOn(fakeThis, <any>'dateFormatFailed').and.returnValue(false);

      const dateRangeFormatFailedReturn = component['dateRangeFormatFailed'].call(fakeThis, startDate, endDate);

      expect(dateRangeFormatFailedReturn).toBeTruthy();
    });

    it(`isDateRangeInputValid: should return true if 'isDateRangeInputFormatValid' and 'isStartDateRangeInputValid' are
      true`, () => {
      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = true;

      expect(component.isDateRangeInputValid).toBeTruthy();
    });

    it(`isDateRangeInputValid: should return false if 'isDateRangeInputFormatValid' is true and 'isStartDateRangeInputValid'
      is false`, () => {
      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = false;

      expect(component.isDateRangeInputValid).toBeFalsy();
    });

    it(`isDateRangeInputValid: should return false if 'isDateRangeInputFormatValid' is false and 'isStartDateRangeInputValid'
      is true`, () => {
      component['isDateRangeInputFormatValid'] = false;
      component['isStartDateRangeInputValid'] = true;

      expect(component.isDateRangeInputValid).toBeFalsy();
    });

    it('dateRangeObjectFailed: should return true if value is defined and `isDateRangeObject` return is false', () => {
      spyOn(component, <any>'isDateRangeObject').and.returnValue(false);

      const value = 'value';

      expect(component['dateRangeObjectFailed'](value)).toBeTruthy();
    });

    it('dateRangeObjectFailed: should return false if value is undefined and `isDateRangeObject` return is false', () => {
      spyOn(component, <any>'isDateRangeObject').and.returnValue(false);

      const value = undefined;

      expect(component['dateRangeObjectFailed'](value)).toBeFalsy();
    });

    it('dateRangeObjectFailed: should return false if value is defined and `isDateRangeObject` return is true', () => {
      spyOn(component, <any>'isDateRangeObject').and.returnValue(true);

      const value = 'value';

      expect(component['dateRangeObjectFailed'](value)).toBeFalsy();
    });

    it(`isDateRangeObject: should return true if 'value' is valid, value.hasOwnProperty('start') and value.hasOwnProperty('end').`, () => {
      const value: PoDatepickerRange = { start: '2018-10-20', end: '2018-10-25' };

      expect(component['isDateRangeObject'](value)).toBeTruthy();
    });

    it(`isDateRangeObject: should return true if 'value' is valid, value.hasOwnProperty('start') and value.hasOwnProperty('end').`, () => {
      expect(component['isDateRangeObject'](undefined)).toBeFalsy();
    });

    it(`requiredDateRangeFailed: should return true if 'isDateRangeInputValid' is true and requiredFailed(required, disabled, startDate)
      and requiredFailed(required, disabled, endDate) returns true.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis = {
        isDateRangeInputValid: true
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      const requiredDateRangeFailedReturn = component['requiredDateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(requiredDateRangeFailedReturn).toBeTruthy();
    });

    it(`requiredDateRangeFailed: should return false if 'isDateRangeInputValid' is true and requiredFailed(required, disabled, startDate)
      and requiredFailed(required, disabled, endDate) returns false.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis = {
        isDateRangeInputValid: true
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      const requiredDateRangeFailedReturn = component['requiredDateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(requiredDateRangeFailedReturn).toBeFalsy();
    });

    it(`requiredDateRangeFailed: should return false if 'isDateRangeInputValid' is false and requiredFailed(required, disabled, startDate)
      and requiredFailed(required, disabled, endDate) returns false.`, () => {
      const startDate = '2018-10-25';
      const endDate = '2018-10-28';
      const fakeThis = {
        isDateRangeInputValid: false
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      const requiredDateRangeFailedReturn = component['requiredDateRangeFailed'].call(fakeThis, startDate, endDate);

      expect(requiredDateRangeFailedReturn).toBeFalsy();
    });

    it('updateModel: should call `onChangeModel` with `value` if `onChangeModel` is valid.', () => {
      const fakeThis = {
        onChangeModel: arg => {}
      };
      const value: any = 'value';

      spyOn(fakeThis, 'onChangeModel');

      component['updateModel'].call(fakeThis, value);

      expect(fakeThis.onChangeModel).toHaveBeenCalledWith(value);
    });

    it('updateModel: should call `onChangeModel` with `value` object if `onChangeModel` is valid.', () => {
      const fakeThis = {
        onChangeModel: arg => {}
      };
      const value: any = { key: 'value' };

      spyOn(fakeThis, 'onChangeModel');

      component['updateModel'].call(fakeThis, value);

      expect(fakeThis.onChangeModel).toHaveBeenCalledWith({ ...value });
    });

    it('validateModel: should call `validatorChange` with `value` if `validatorChange` is valid.', () => {
      const fakeThis = {
        validatorChange: arg => {}
      };
      const value: any = 'value';

      spyOn(fakeThis, 'validatorChange');

      component['validateModel'].call(fakeThis, value);

      expect(fakeThis.validatorChange).toHaveBeenCalledWith({ ...value });
    });

    it('convertPatternDateFormat: should call `poDateService.convertDateToISO` if `value` is instanceof `Date`.', () => {
      const fakeThis = {
        poDateService: {
          convertDateToISO: arg => {}
        }
      };
      const date = new Date('2018-10-25');

      spyOn(fakeThis.poDateService, 'convertDateToISO');

      component['convertPatternDateFormat'].call(fakeThis, date);

      expect(fakeThis.poDateService.convertDateToISO).toHaveBeenCalledWith(date);
    });

    it(`convertPatternDateFormat: should not call 'poDateService.convertDateToISO' if value is instanceof 'string' and
      return value.`, () => {
      const date = '2018-10-25';

      expect(component['convertPatternDateFormat'](date)).toBe(date);
    });
  });
});
