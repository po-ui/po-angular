import { Directive } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';

import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';
import { convertIsoToDate, mapInputSizeToLoadingIcon, PoUtils as UtilsFunctions } from '../../../utils/util';
import { PoValidators as ValidatorsFunctions } from './../validators';

import { Subject } from 'rxjs';
import { PoThemeA11yEnum } from '../../../services';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoMask } from '../po-input/po-mask';
import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';
import { PoDatepickerBaseComponent } from './po-datepicker-base.component';

@Directive()
class PoDatepickerComponent extends PoDatepickerBaseComponent {
  writeValue(value: any): void {}
  refreshValue(value: Date): void {}
  replaceFormatSeparator(): any {}
}

describe('PoDatepickerBaseComponent:', () => {
  let component: PoDatepickerComponent;

  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    const languageService = TestBed.inject(PoLanguageService);
    const changeDetector = { detectChanges: () => {}, markForCheck: () => {} } as any;

    component = TestBed.runInInjectionContext(() => new PoDatepickerComponent(languageService, changeDetector));

    (component as any)['shortLanguage'] = 'pt';
  });

  it('should be created', () => {
    expect(component instanceof PoDatepickerBaseComponent).toBeTruthy();
    expect(component.locale).toBe(component['shortLanguage']);
  });

  it('should be update property p-disabled', () => {
    vi.spyOn(component as any, 'validateModel');
    vi.spyOn(UtilsFunctions as any, 'convertDateToISOExtended');

    expectSettersMethod(component, 'setDisabled', '', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'true', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'false', 'disabled', false);

    expect(component['validateModel']).toHaveBeenCalled();
    expect(UtilsFunctions.convertDateToISOExtended).toHaveBeenCalled();
  });

  it('should update property p-required', () => {
    vi.spyOn(component as any, 'validateModel');
    vi.spyOn(UtilsFunctions as any, 'convertDateToISOExtended');

    expectSettersMethod(component, 'setRequired', '', 'required', true);
    expectSettersMethod(component, 'setRequired', 'true', 'required', true);
    expectSettersMethod(component, 'setRequired', 'false', 'required', false);

    expect(component['validateModel']).toHaveBeenCalled();
    expect(UtilsFunctions.convertDateToISOExtended).toHaveBeenCalled();
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
    vi.spyOn(component as any, 'validateModel');

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
    vi.spyOn(component as any, 'validateModel');

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

  it('should be update property date', () => {
    const expectedValue = convertIsoToDate('2021/08/20', false, false);
    expectPropertiesValues(component, 'date', '2021/08/20', expectedValue);
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
    vi.spyOn(component as any, 'callOnChange');
    component.required = false;
    component.controlModel(undefined);

    expect(component.callOnChange).toHaveBeenCalledWith('');
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    const markForCheck = vi.spyOn(component['cd'] as any, 'markForCheck');

    component.setDisabledState(expectedValue);

    expect(component.disabled).toBe(expectedValue);
    expect(markForCheck).toHaveBeenCalled();
  });

  it('should be call callOnChange with minDate', () => {
    vi.spyOn(component as any, 'callOnChange');
    component.minDate = '2000-01-01';
    component.maxDate = '';
    component.controlModel(new Date(2001, 1, 24));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be call callOnChange with maxDate', () => {
    vi.spyOn(component as any, 'callOnChange');
    component.minDate = '';
    component.maxDate = '2000-01-01';
    component.controlModel(new Date(1997, 1, 24));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be call callOnChange with no dateStart and no dateEnd', () => {
    vi.spyOn(component as any, 'callOnChange');
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
        vi.spyOn(component as any, 'callOnChange');

        component.controlModel(new Date(2018, 7, 30));

        expect(component.callOnChange).toHaveBeenCalled();
      });

      it('should call `callOnChange` when date is `undefined`.', () => {
        vi.spyOn(component as any, 'callOnChange');

        component.controlModel(undefined);

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });

      it('should call `callOnChange` when date is `undefined` and set `Data inválida` in model.', () => {
        vi.spyOn(component as any, 'callOnChange');

        component.controlModel(null);

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });

      it('should call `convertDateToISOExtended` if has `date` and `isExtendedISO` is `true`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISOExtended');
        component['isExtendedISO'] = true;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISOExtended).toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISOExtended` if hasn`t `date`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISOExtended');
        component['isExtendedISO'] = true;

        component.controlModel(undefined);

        expect(UtilsFunctions.convertDateToISOExtended).not.toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISOExtended` if `isExtendedISO` is `false`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISOExtended');
        component['isExtendedISO'] = false;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISOExtended).not.toHaveBeenCalled();
      });

      it('should call `convertDateToISODate` if has `date` and `isExtendedISO` is `false`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISODate');
        component['isExtendedISO'] = false;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISODate).toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISODate` if hasn`t `date`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISODate');
        component['isExtendedISO'] = false;

        component.controlModel(undefined);

        expect(UtilsFunctions.convertDateToISODate).not.toHaveBeenCalled();
      });

      it('shouldn`t call `convertDateToISODate` if `isExtendedISO` is `true`.', () => {
        vi.spyOn(UtilsFunctions as any, 'convertDateToISODate');
        component['isExtendedISO'] = true;

        component.controlModel(new Date(2018, 7, 30));

        expect(UtilsFunctions.convertDateToISODate).not.toHaveBeenCalled();
      });
    });

    it('formatToDate: should call `formatYear` with date year', () => {
      const date = new Date();
      vi.spyOn(UtilsFunctions as any, 'formatYear');

      component.formatToDate(date);

      expect(UtilsFunctions.formatYear).toHaveBeenCalledWith(date.getFullYear());
    });

    it('getDateFromString: should call `setYearFrom0To100`', () => {
      const date = '0001-01-01';
      vi.spyOn(UtilsFunctions as any, 'setYearFrom0To100');

      component.getDateFromString(date);

      expect(UtilsFunctions.setYearFrom0To100).toHaveBeenCalled();
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
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        expect(component.validate(new UntypedFormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('errorPattern');
      });

      it(`should invalidate form and set errorPattern 'Data inválida' when
        doesn't have an errorPattern value and date is invalid`, () => {
        component['cd'] = { markForCheck: () => {} } as any;
        component.errorPattern = '';
        vi.spyOn(component['cd'] as any, 'markForCheck');
        expect(component.validate(new UntypedFormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data inválida');
      });

      it(`should invalidate form and set errorPattern 'Data inválida' when
        errorPattern is equal to 'Data fora do período' and date is invalid`, () => {
        component.errorPattern = 'Data fora do período';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        expect(component.validate(new UntypedFormControl([]))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data inválida');
      });

      it(`should invalidate form and set errorPattern '' when date is undefined`, () => {
        const invalidRequiredError = {
          required: {
            valid: false
          }
        };
        vi.spyOn(ValidatorsFunctions as any, 'requiredFailed').mockReturnValue(true);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        expect(component.validate(new UntypedFormControl(undefined))).toEqual(invalidRequiredError);
        expect(component.errorPattern).toBe('');
      });

      it(`should invalidate form and set errorPattern 'Data fora do período' when has a date out of range`, () => {
        vi.spyOn(UtilsFunctions as any, 'validateDateRange').mockReturnValue(false);

        component['date'] = new Date(2018, 5, 5);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        expect(component.validate(new UntypedFormControl('Tue Jun 05 2018 00:00:00'))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it(`should invalidate form and set errorPattern 'Data fora do período' when
        has a date out of range and errorPattern is 'Data inválida'`, () => {
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(UtilsFunctions as any, 'validateDateRange').mockReturnValue(false);
        vi.spyOn(component['cd'] as any, 'markForCheck');
        component.errorPattern = 'Data inválida';
        component['date'] = new Date(2018, 5, 5);

        expect(component.validate(new UntypedFormControl('Tue Jun 05 2018 00:00:00'))).toEqual(invalidDateError);
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it(`shouldn't invalidate form and set errorPattern '' when set a valid date and errorPattern is 'Data inválida'`, () => {
        component.errorPattern = 'Data inválida';

        expect(component.validate(new UntypedFormControl('Tue Jun 05 2018 00:00:00'))).toEqual(null);
        expect(component.errorPattern).toBe('');
      });

      it(`shouldn't invalidate form and set errorPattern '' when set a valid date and errorPattern is 'Data fora do período'`, () => {
        component.errorPattern = 'Data fora do período';

        expect(component.validate(new UntypedFormControl('Tue Jun 05 2018 00:00:00'))).toEqual(null);
        expect(component.errorPattern).toBe('');
      });

      it('should call markForCheck when status is INVALID', fakeAsync(() => {
        component['cd'] = { markForCheck: () => {} } as any;
        component.errorPattern = 'Erro inválido';
        const controlMock = {
          statusChanges: new Subject<string>()
        } as any;

        vi.spyOn(component['cd'] as any, 'markForCheck');

        component.validate(controlMock);

        controlMock.statusChanges.next('INVALID');
        tick();

        expect(component['cd'].markForCheck).toHaveBeenCalled();
      }));

      it('should set hasValidatorRequired to true if showErrorMessageRequired is true and control has required validator', () => {
        component['hasValidatorRequired'] = false;
        component.showErrorMessageRequired = true;

        const controlMock = new FormControl('', Validators.required);

        component.validate(controlMock);

        expect(component['hasValidatorRequired']).toBe(true);
      });

      // Tests for month-year mode validation
      it('should NOT return error for valid month-year string "04/2025" when mode is month-year', () => {
        component.mode = 'month-year';
        expect(component.validate(new UntypedFormControl('04/2025'))).toEqual(null);
      });

      it('should NOT return error for valid month-year string "12/2000" when mode is month-year', () => {
        component.mode = 'month-year';
        expect(component.validate(new UntypedFormControl('12/2000'))).toEqual(null);
      });

      it('should return date error for invalid month "13/2025" when mode is month-year', () => {
        component.mode = 'month-year';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('13/2025'));
        expect(result).toEqual({ date: { valid: false } });
      });

      it('should return date error for invalid month "00/2025" when mode is month-year', () => {
        component.mode = 'month-year';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('00/2025'));
        expect(result).toEqual({ date: { valid: false } });
      });

      it('should return date error for non-string value when mode is month-year', () => {
        component.mode = 'month-year';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl(12345));
        expect(result).toEqual({ date: { valid: false } });
      });

      it('should NOT return error for empty value when mode is month-year', () => {
        component.mode = 'month-year';
        expect(component.validate(new UntypedFormControl(''))).toEqual(null);
      });

      it('should NOT return error for null value when mode is month-year', () => {
        component.mode = 'month-year';
        expect(component.validate(new UntypedFormControl(null))).toEqual(null);
      });

      // Tests for year mode validation
      it('should NOT return error for valid year string "2025" when mode is year', () => {
        component.mode = 'year';
        expect(component.validate(new UntypedFormControl('2025'))).toEqual(null);
      });

      it('should return date error for invalid year "0000" when mode is year', () => {
        component.mode = 'year';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('0000'));
        expect(result).toEqual({ date: { valid: false } });
      });

      it('should return date error for non-numeric year "abcd" when mode is year', () => {
        component.mode = 'year';
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('abcd'));
        expect(result).toEqual({ date: { valid: false } });
      });

      it('should NOT return error for empty value when mode is year', () => {
        component.mode = 'year';
        expect(component.validate(new UntypedFormControl(''))).toEqual(null);
      });

      // Tests for month-year date range validation
      it('should return date error when month-year date is before minDate', () => {
        component.mode = 'month-year';
        component['date'] = new Date(2024, 0, 1);
        component['_minDate'] = new Date(2025, 0, 1);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('01/2024'));
        expect(result).toEqual({ date: { valid: false } });
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it('should return date error when month-year date is after maxDate', () => {
        component.mode = 'month-year';
        component['date'] = new Date(2026, 5, 1);
        component['_maxDate'] = new Date(2025, 11, 1);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('06/2026'));
        expect(result).toEqual({ date: { valid: false } });
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it('should NOT return error when month-year date is within range', () => {
        component.mode = 'month-year';
        component['date'] = new Date(2025, 5, 1);
        component['_minDate'] = new Date(2025, 0, 1);
        component['_maxDate'] = new Date(2025, 11, 1);
        const result = component.validate(new UntypedFormControl('06/2025'));
        expect(result).toEqual(null);
      });

      // Tests for year date range validation
      it('should return date error when year date is before minDate year', () => {
        component.mode = 'year';
        component['date'] = new Date(2024, 0, 1);
        component['_minDate'] = new Date(2025, 0, 1);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('2024'));
        expect(result).toEqual({ date: { valid: false } });
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it('should return date error when year date is after maxDate year', () => {
        component.mode = 'year';
        component['date'] = new Date(2026, 0, 1);
        component['_maxDate'] = new Date(2025, 0, 1);
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('2026'));
        expect(result).toEqual({ date: { valid: false } });
        expect(component.errorPattern).toBe('Data fora do período');
      });

      it('should NOT return error when year date is within range', () => {
        component.mode = 'year';
        component['date'] = new Date(2025, 0, 1);
        component['_minDate'] = new Date(2020, 0, 1);
        component['_maxDate'] = new Date(2030, 0, 1);
        const result = component.validate(new UntypedFormControl('2025'));
        expect(result).toEqual(null);
      });

      // Ensures default mode still uses dateFailed
      it('should still use dateFailed for default mode (no mode set)', () => {
        component.mode = undefined;
        component['cd'] = { markForCheck: () => {} } as any;
        vi.spyOn(component['cd'] as any, 'markForCheck');
        const result = component.validate(new UntypedFormControl('04/2025'));
        expect(result).toEqual({ date: { valid: false } });
      });
    });

    it('ngOnInit: should call buildMask', () => {
      vi.spyOn(component as any, 'buildMask');

      component.ngOnInit();

      expect(component['buildMask']).toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe `subscription` on destroy', () => {
      component['subscription'] = fakeSubscription;

      vi.spyOn(component['subscription'] as any, 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      vi.spyOn(component as any, 'validatorChange');

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

      const spyOnChangeModel = vi.spyOn(component as any, 'onChangeModel');

      component.callOnChange(expectedValue);

      expect(spyOnChangeModel).toHaveBeenCalledWith(expectedValue);
    });

    it('callOnChange: shouldn`t call `onChangeModel` if `value` is equal to the `previousValue`', () => {
      const expectedValue = '2019-04-04';

      component['previousValue'] = '2019-04-04';

      const spyOnChangeModel = vi.spyOn(component as any, 'onChangeModel');

      component.callOnChange(expectedValue);

      expect(spyOnChangeModel).not.toHaveBeenCalled();
    });

    it('callOnChange: should call `callOnChange` only twice if `retry` param is true and `onChangeModel` is falsy', fakeAsync(() => {
      const value = '2019-04-04';

      const spyCallOnChange = vi.spyOn(component as any, 'callOnChange');

      component['onChangeModel'] = undefined;

      component.callOnChange(value);

      tick(50);

      expect(component['onChangeModel']).toBe(undefined);
      expect(spyCallOnChange).toHaveBeenCalledTimes(2);
    }));

    it('callOnChange: should call `callOnChange` only once if `retry` param is false and `onChangeModel` is falsy', fakeAsync(() => {
      const value = '2019-04-04';

      const spyCallOnChange = vi.spyOn(component as any, 'callOnChange');

      component['onChangeModel'] = undefined;

      component.callOnChange(value, false);

      tick(50);

      expect(component['onChangeModel']).toBe(undefined);
      expect(spyCallOnChange).toHaveBeenCalledTimes(1);
    }));

    it('formatTimeAndHour: should call `formatTimeAndHour` with timezone negative', () => {
      component.formatTimezoneAndHour(180);
      expect(component['hour']).toBe('T00:00:00-03:00');
    });

    it('formatTimeAndHour: should call `formatTimeAndHour` with timezone positive', () => {
      component.formatTimezoneAndHour(-180);
      expect(component['hour']).toBe('T00:00:00+03:00');
    });
  });

  describe('Properties:', () => {
    it('p-compact-label: should have default value as false', () => {
      expect(component.compactLabel()).toBe(false);
    });

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
      vi.spyOn(component as any, 'buildMask');
      vi.spyOn(component as any, 'refreshValue');

      component.format = 'dd/mm/yyyy';

      expect(component['buildMask']).toHaveBeenCalled();
      expect(component.refreshValue).toHaveBeenCalled();
    });

    it('p-format: should call buildMask and set a `dd/mm/yyyy` date format when set a invalid value', () => {
      vi.spyOn(component as any, 'buildMask');

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
      vi.spyOn(UtilsFunctions as any, 'setYearFrom0To100');

      component.minDate = new Date();
      expect(UtilsFunctions.setYearFrom0To100).toHaveBeenCalled();
    });

    it('p-max-date: should set end date with year 1', () => {
      const date = new Date(1, 1, 1);
      date.setFullYear(1);

      component.maxDate = date;

      expect(component['_maxDate'].getFullYear()).toBe(1);
    });

    it('maxDate: should call `setYearFrom0To100`', () => {
      vi.spyOn(UtilsFunctions as any, 'setYearFrom0To100');

      component.maxDate = new Date();

      expect(UtilsFunctions.setYearFrom0To100).toHaveBeenCalled();
    });

    it('should convert value to boolean and call markForCheck', () => {
      const markForCheckSpy = vi.spyOn(component['cd'] as any, 'markForCheck');

      component.loading = 'true' as any;

      expect(component['_loading']).toBe(true);
      expect(markForCheckSpy).toHaveBeenCalled();
    });

    it('should set loading to false when value is falsy', () => {
      const markForCheckSpy = vi.spyOn(component['cd'] as any, 'markForCheck');

      component.loading = null;

      expect(component['_loading']).toBe(false);
      expect(markForCheckSpy).toHaveBeenCalled();
    });

    it('should return the value from mapInputSizeToLoadingIcon', () => {
      const result = component.mapSizeToIcon('md');

      expect(result).toBe(mapInputSizeToLoadingIcon('md'));
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

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        vi.spyOn(component as any, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });
  });

  describe('Getters:', () => {
    it('minDate getter should return _minDate', () => {
      const date = new Date(2025, 0, 1);
      component['_minDate'] = date;
      expect(component.minDate).toBe(date);
    });

    it('maxDate getter should return _maxDate', () => {
      const date = new Date(2025, 11, 31);
      component['_maxDate'] = date;
      expect(component.maxDate).toBe(date);
    });

    it('loading getter should return _loading', () => {
      component['_loading'] = true;
      expect(component.loading).toBe(true);
    });

    it('isDisabled should return true when loading is true', () => {
      component['_loading'] = true;
      component['disabled'] = false;
      expect(component.isDisabled).toBe(true);
    });

    it('isDisabled should return true when disabled is true', () => {
      component['_loading'] = false;
      component['disabled'] = true;
      expect(component.isDisabled).toBe(true);
    });

    it('isDisabled should return false when both are false', () => {
      component['_loading'] = false;
      component['disabled'] = false;
      expect(component.isDisabled).toBe(false);
    });
  });

  describe('date setter for month-year/year modes:', () => {
    it('should parse month-year string correctly', () => {
      component['mode'] = 'month-year';
      component.date = '04/2025';
      expect(component.date.getFullYear()).toBe(2025);
      expect(component.date.getMonth()).toBe(3);
    });

    it('should parse year string correctly', () => {
      component['mode'] = 'year';
      component.date = '2025';
      expect(component.date.getFullYear()).toBe(2025);
      expect(component.date.getMonth()).toBe(0);
    });
  });

  describe('ngOnInit for month-year/year modes:', () => {
    it('should set mask for month-year mode', () => {
      component['mode'] = 'month-year';
      component.ngOnInit();
      expect(component['objMask']).toBeDefined();
    });

    it('should set mask for year mode', () => {
      component['mode'] = 'year';
      component.ngOnInit();
      expect(component['objMask']).toBeDefined();
    });
  });

  describe('isMonthYearOrYearInvalid:', () => {
    it('should return true for non-string value in month-year mode', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid'](12345)).toBe(true);
    });

    it('should return true for invalid month in month-year mode', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('13/2025')).toBe(true);
    });

    it('should return true for month 0 in month-year mode', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('00/2025')).toBe(true);
    });

    it('should return false for valid month-year', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('06/2025')).toBe(false);
    });

    it('should return true for invalid year in year mode', () => {
      component['mode'] = 'year';
      expect(component['isMonthYearOrYearInvalid']('abc')).toBe(true);
    });

    it('should return false for valid year', () => {
      component['mode'] = 'year';
      expect(component['isMonthYearOrYearInvalid']('2025')).toBe(false);
    });

    it('should return true for year 0 in year mode', () => {
      component['mode'] = 'year';
      expect(component['isMonthYearOrYearInvalid']('0')).toBe(true);
    });

    it('should return false for empty string', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('')).toBe(false);
    });

    it('should return false for null value', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid'](null)).toBe(false);
    });

    it('should return false for undefined value', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid'](undefined)).toBe(false);
    });

    it('should return true when month-year has no separator', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('2025')).toBe(true);
    });

    it('should return true when month-year has too many parts', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('01/02/2025')).toBe(true);
    });

    it('should return true when month-year year part is NaN', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('04/abc')).toBe(true);
    });

    it('should return true when month-year month part is NaN', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('xx/2025')).toBe(true);
    });

    it('should return true when month-year year is zero', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('04/0')).toBe(true);
    });

    it('should return true when month-year year is negative', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('04/-1')).toBe(true);
    });

    it('should return true for negative year in year mode', () => {
      component['mode'] = 'year';
      expect(component['isMonthYearOrYearInvalid']('-1')).toBe(true);
    });

    it('should return false for valid boundary month 1 in month-year mode', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('01/2025')).toBe(false);
    });

    it('should return false for valid boundary month 12 in month-year mode', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid']('12/2025')).toBe(false);
    });

    it('should return false when mode is default (not month-year or year)', () => {
      component['mode'] = undefined;
      expect(component['isMonthYearOrYearInvalid']('anything')).toBe(false);
    });

    it('should return true for boolean value', () => {
      component['mode'] = 'month-year';
      expect(component['isMonthYearOrYearInvalid'](true)).toBe(true);
    });

    it('should return true for array value', () => {
      component['mode'] = 'year';
      expect(component['isMonthYearOrYearInvalid']([2025])).toBe(true);
    });
  });

  describe('validateMonthYearRange:', () => {
    it('should return true when date is null', () => {
      expect(component['validateMonthYearRange'](null, new Date(2025, 0, 1), new Date(2025, 11, 31))).toBe(true);
    });

    it('should return false when date is before minDate', () => {
      const date = new Date(2024, 11, 1);
      const minDate = new Date(2025, 0, 1);
      expect(component['validateMonthYearRange'](date, minDate, null)).toBe(false);
    });

    it('should return false when date is after maxDate', () => {
      const date = new Date(2026, 0, 1);
      const maxDate = new Date(2025, 11, 31);
      expect(component['validateMonthYearRange'](date, null, maxDate)).toBe(false);
    });

    it('should return true when date is within range', () => {
      const date = new Date(2025, 6, 1);
      const minDate = new Date(2025, 0, 1);
      const maxDate = new Date(2025, 11, 31);
      expect(component['validateMonthYearRange'](date, minDate, maxDate)).toBe(true);
    });
  });

  describe('validateYearRange:', () => {
    it('should return true when date is null', () => {
      expect(component['validateYearRange'](null, new Date(2020, 0, 1), new Date(2030, 0, 1))).toBe(true);
    });

    it('should return false when date year is before minDate year', () => {
      const date = new Date(2019, 0, 1);
      const minDate = new Date(2020, 0, 1);
      expect(component['validateYearRange'](date, minDate, null)).toBe(false);
    });

    it('should return false when date year is after maxDate year', () => {
      const date = new Date(2031, 0, 1);
      const maxDate = new Date(2030, 0, 1);
      expect(component['validateYearRange'](date, null, maxDate)).toBe(false);
    });

    it('should return true when date year is within range', () => {
      const date = new Date(2025, 0, 1);
      const minDate = new Date(2020, 0, 1);
      const maxDate = new Date(2030, 0, 1);
      expect(component['validateYearRange'](date, minDate, maxDate)).toBe(true);
    });
  });
});
