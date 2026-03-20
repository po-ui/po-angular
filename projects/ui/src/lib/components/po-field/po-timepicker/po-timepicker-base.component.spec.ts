import { Directive } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl, Validators } from '@angular/forms';

import { mapInputSizeToLoadingIcon } from '../../../utils/util';
import { PoValidators as ValidatorsFunctions } from './../validators';

import { PoThemeA11yEnum } from '../../../services';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoTimepickerBaseComponent } from './po-timepicker-base.component';
import { PoTimepickerModelFormat } from './enums/po-timepicker-iso-format.enum';
import { PoTimerFormat } from '../../po-timer/enums/po-timer-format.enum';
import { poTimepickerLiterals } from './po-timepicker.literals';

@Directive()
class PoTimepickerComponent extends PoTimepickerBaseComponent {
  writeValue(value: any): void {}
  refreshValue(value: string): void {}
}

describe('PoTimepickerBaseComponent:', () => {
  let component: PoTimepickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    const languageService = TestBed.inject(PoLanguageService);
    const changeDetector = { detectChanges: () => {}, markForCheck: () => {} } as any;

    component = TestBed.runInInjectionContext(() => new PoTimepickerComponent(languageService, changeDetector));

    (component as any)['shortLanguage'] = 'pt';
  });

  it('should be created', () => {
    expect(component instanceof PoTimepickerBaseComponent).toBeTruthy();
  });

  it('should be update property p-disabled', () => {
    component.setDisabled = 'true';
    expect(component.disabled).toBeTrue();

    component.setDisabled = 'false';
    expect(component.disabled).toBeFalse();
  });

  it('should update property p-required', () => {
    component.setRequired = 'true';
    expect(component.required).toBeTrue();

    component.setRequired = 'false';
    expect(component.required).toBeFalse();
  });

  it('should update property p-readonly', () => {
    component.setReadonly = 'true';
    expect(component.readonly).toBeTrue();

    component.setReadonly = 'false';
    expect(component.readonly).toBeFalse();
  });

  it('should update property p-clean', () => {
    component.setClean = 'true';
    expect(component.clean).toBeTrue();

    component.setClean = 'false';
    expect(component.clean).toBeFalse();
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    const markForCheck = spyOn(component['cd'], 'markForCheck');

    component.setDisabledState(expectedValue);

    expect(component.disabled).toBe(expectedValue);
    expect(markForCheck).toHaveBeenCalled();
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

  describe('Properties:', () => {
    it('autocomplete: should return `off` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });

    describe('p-loading:', () => {
      it('should convert value to boolean and call markForCheck', () => {
        const markForCheckSpy = spyOn(component['cd'], 'markForCheck');

        component.loading = 'true' as any;

        expect(component['_loading']).toBeTrue();
        expect(markForCheckSpy).toHaveBeenCalled();
      });

      it('should set loading to false when value is falsy', () => {
        const markForCheckSpy = spyOn(component['cd'], 'markForCheck');

        component.loading = null as any;

        expect(component['_loading']).toBeFalse();
        expect(markForCheckSpy).toHaveBeenCalled();
      });

      it('should default loading to false', () => {
        expect(component.loading).toBeFalse();
      });
    });

    describe('isDisabled:', () => {
      it('should return true when disabled is true', () => {
        component.disabled = true;
        component.loading = false;

        expect(component.isDisabled).toBeTrue();
      });

      it('should return true when loading is true', () => {
        component.disabled = false;
        component.loading = true;

        expect(component.isDisabled).toBeTrue();
      });

      it('should return true when both disabled and loading are true', () => {
        component.disabled = true;
        component.loading = true;

        expect(component.isDisabled).toBeTrue();
      });

      it('should return false when both disabled and loading are false', () => {
        component.disabled = false;
        component.loading = false;

        expect(component.isDisabled).toBeFalse();
      });
    });

    describe('mapSizeToIcon:', () => {
      it('should return the value from mapInputSizeToLoadingIcon', () => {
        const result = component.mapSizeToIcon('md');

        expect(result).toBe(mapInputSizeToLoadingIcon('md'));
      });

      it('should map small size correctly', () => {
        const result = component.mapSizeToIcon('small');

        expect(result).toBe(mapInputSizeToLoadingIcon('small'));
      });
    });

    describe('p-format:', () => {
      it('should set format to 24 by default', () => {
        expect(component.format).toBe(PoTimerFormat.Format24);
      });

      it('should accept valid format values', () => {
        component.format = PoTimerFormat.Format12;
        expect(component.format).toBe(PoTimerFormat.Format12);
      });

      it('should default to 24 for invalid values', () => {
        component.format = 'invalid' as any;
        expect(component.format).toBe(PoTimerFormat.Format24);
      });
    });

    describe('p-min-time:', () => {
      it('should set valid minTime', () => {
        component.minTime = '08:00';
        expect(component.minTime).toBe('08:00');
      });

      it('should set undefined for invalid minTime', () => {
        component.minTime = 'invalid';
        expect(component.minTime).toBeUndefined();
      });
    });

    describe('p-max-time:', () => {
      it('should set valid maxTime', () => {
        component.maxTime = '18:00';
        expect(component.maxTime).toBe('18:00');
      });

      it('should set undefined for invalid maxTime', () => {
        component.maxTime = 'invalid';
        expect(component.maxTime).toBeUndefined();
      });
    });

    describe('p-minute-interval:', () => {
      it('should set valid minute interval', () => {
        component.minuteInterval = 10;
        expect(component.minuteInterval).toBe(10);
      });

      it('should default to 5 for invalid value', () => {
        component.minuteInterval = -1;
        expect(component.minuteInterval).toBe(5);
      });
    });

    describe('p-show-seconds:', () => {
      it('should set showSeconds to true', () => {
        component.showSeconds = true;
        expect(component.showSeconds).toBeTrue();
      });

      it('should set showSeconds to false', () => {
        component.showSeconds = false;
        expect(component.showSeconds).toBeFalse();
      });
    });

    describe('p-placeholder:', () => {
      it('should keep empty string placeholder', () => {
        component.placeholder = '';

        expect(component.placeholder).toBe('');
      });
    });

    describe('p-model-format:', () => {
      it('should update with valid value', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinuteSecond;
        expect(component.modelFormat).toBe(PoTimepickerModelFormat.HourMinuteSecond);
      });
    });

    describe('p-size:', () => {
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

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        spyOn<any>(component, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });
  });

  describe('Methods:', () => {
    describe('callOnChange:', () => {
      it('should call onChangeModel when value differs from previousValue', () => {
        const fnChange = jasmine.createSpy('onChangeModel');
        component.registerOnChange(fnChange);
        component['previousValue'] = '';

        component['callOnChange']('10:00');

        expect(fnChange).toHaveBeenCalledWith('10:00');
      });

      it('should not call onChangeModel when value is same as previousValue', () => {
        const fnChange = jasmine.createSpy('onChangeModel');
        component.registerOnChange(fnChange);
        component['previousValue'] = '10:00';

        component['callOnChange']('10:00');

        expect(fnChange).not.toHaveBeenCalled();
      });
    });

    describe('isValidTimeString:', () => {
      it('should return true for valid HH:mm', () => {
        expect(component['isValidTimeString']('10:30')).toBeTrue();
      });

      it('should return true for valid HH:mm:ss', () => {
        expect(component['isValidTimeString']('10:30:45')).toBeTrue();
      });

      it('should return false for invalid values', () => {
        expect(component['isValidTimeString']('')).toBeFalse();
        expect(component['isValidTimeString'](null)).toBeFalse();
        expect(component['isValidTimeString']('abc')).toBeFalse();
        expect(component['isValidTimeString']('24:60:60')).toBeFalse();
        expect(component['isValidTimeString']('13:60')).toBeFalse();
        expect(component['isValidTimeString']('25:00')).toBeFalse();
      });

      it('should support custom hour range for 12h validation', () => {
        expect(component['isValidTimeString']('12:59', 1, 12)).toBeTrue();
        expect(component['isValidTimeString']('13:59', 1, 12)).toBeFalse();
      });
    });

    describe('isTimeInRange:', () => {
      it('should return true when no min/max is set', () => {
        expect(component['isTimeInRange']('10:00')).toBeTrue();
      });

      it('should return false when time is before minTime', () => {
        component.minTime = '08:00';
        expect(component['isTimeInRange']('07:00')).toBeFalse();
      });

      it('should return false when time is after maxTime', () => {
        component.maxTime = '18:00';
        expect(component['isTimeInRange']('19:00')).toBeFalse();
      });

      it('should return true when time is within range', () => {
        component.minTime = '08:00';
        component.maxTime = '18:00';
        expect(component['isTimeInRange']('12:00')).toBeTrue();
      });
    });

    describe('formatOutput:', () => {
      it('should return empty string for invalid input', () => {
        expect(component['formatOutput']('')).toBe('');
        expect(component['formatOutput'](null)).toBe('');
      });

      it('should keep HH:mm when modelFormat is HourMinuteSecond and time has 5 chars', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinuteSecond;
        expect(component['formatOutput']('10:30')).toBe('10:30');
      });

      it('should truncate to 5 chars when modelFormat is HourMinute', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinute;
        expect(component['formatOutput']('10:30:45')).toBe('10:30');
      });
    });

    describe('validate:', () => {
      it('should return required error when required and empty', () => {
        spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl(undefined));

        expect(result).toEqual({ required: { valid: false } });
      });

      it('should return time error for invalid time string', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl('invalid'));

        expect(result).toEqual({ time: { valid: false } });
        expect(component.errorPattern).toBe('Hora inválida');
      });

      it('should return time error for semantic invalid time values', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl('24:60:60'));

        expect(result).toEqual({ time: { valid: false } });
        expect(component.errorPattern).toBe('Hora inválida');
      });

      it('should return time error for time out of range', () => {
        component.minTime = '08:00';
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl('07:00'));

        expect(result).toEqual({ time: { valid: false } });
        expect(component.errorPattern).toBe('Hora fora do período');
      });

      it('should set hasValidatorRequired when showErrorMessageRequired and control has required validator', () => {
        component['hasValidatorRequired'] = false;
        component.showErrorMessageRequired = true;
        component['cd'] = { markForCheck: () => {} } as any;

        component.validate(new UntypedFormControl('', Validators.required));

        expect(component['hasValidatorRequired']).toBeTrue();
      });

      it('should return null for valid time', () => {
        const result = component.validate(new UntypedFormControl('10:00'));

        expect(result).toBeNull();
      });

      it('should clear generated error pattern before validating', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        component.errorPattern = 'Hora inválida';

        component.validate(new UntypedFormControl('10:00'));

        expect(component.errorPattern).toBe('');
      });

      it('should preserve custom error pattern before validating', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        component.errorPattern = 'Custom error message';

        component.validate(new UntypedFormControl('10:00'));

        expect(component.errorPattern).toBe('Custom error message');
      });

      it('should use validationValue when set', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');
        component['setValidationValue']('invalid-time');

        const result = component.validate(new UntypedFormControl(''));

        expect(result).toEqual({ time: { valid: false } });
      });

      it('should use validationHourRange when set', () => {
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');
        component['setValidationValue']('13:00', 1, 12);

        const result = component.validate(new UntypedFormControl(''));

        expect(result).toEqual({ time: { valid: false } });
      });

      it('should return time error for out-of-range with maxTime', () => {
        component.maxTime = '18:00';
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl('19:00'));

        expect(result).toEqual({ time: { valid: false } });
        expect(component.errorPattern).toBe('Hora fora do período');
      });
    });

    describe('updateMask:', () => {
      it('should set objMask to HH:mm when showSeconds is false', () => {
        component.showSeconds = false;
        component['updateMask']();

        expect(component['objMask']).toBeTruthy();
        expect(component['objMask'].mask).toBe('99:99');
      });

      it('should set objMask to HH:mm:ss when showSeconds is true', () => {
        component.showSeconds = true;
        component['updateMask']();

        expect(component['objMask']).toBeTruthy();
        expect(component['objMask'].mask).toBe('99:99:99');
      });
    });

    describe('timeToMinutes:', () => {
      it('should convert HH:mm to total seconds', () => {
        expect(component['timeToMinutes']('01:30')).toBe(5400);
      });

      it('should convert HH:mm:ss to total seconds', () => {
        expect(component['timeToMinutes']('01:30:15')).toBe(5415);
      });

      it('should handle 00:00', () => {
        expect(component['timeToMinutes']('00:00')).toBe(0);
      });

      it('should handle 23:59:59', () => {
        expect(component['timeToMinutes']('23:59:59')).toBe(86399);
      });
    });

    describe('isTimeInRange (extended):', () => {
      it('should return true when time is exactly at minTime', () => {
        component.minTime = '08:00';
        expect(component['isTimeInRange']('08:00')).toBeTrue();
      });

      it('should return true when time is exactly at maxTime', () => {
        component.maxTime = '18:00';
        expect(component['isTimeInRange']('18:00')).toBeTrue();
      });

      it('should handle seconds in range comparison', () => {
        component.minTime = '08:00:00';
        component.maxTime = '18:00:00';
        expect(component['isTimeInRange']('08:00:01')).toBeTrue();
        expect(component['isTimeInRange']('17:59:59')).toBeTrue();
      });

      it('should return true when only minTime is set and time is after', () => {
        component.minTime = '08:00';
        component.maxTime = undefined;
        expect(component['isTimeInRange']('09:00')).toBeTrue();
      });

      it('should return true when only maxTime is set and time is before', () => {
        component.minTime = undefined;
        component.maxTime = '18:00';
        expect(component['isTimeInRange']('17:00')).toBeTrue();
      });
    });

    describe('isValidTimeString (extended):', () => {
      it('should return false for time with invalid seconds', () => {
        expect(component['isValidTimeString']('10:30:60')).toBeFalse();
      });

      it('should return true for boundary hour 23', () => {
        expect(component['isValidTimeString']('23:59')).toBeTrue();
      });

      it('should return true for boundary hour 00', () => {
        expect(component['isValidTimeString']('00:00')).toBeTrue();
      });

      it('should return false for null input', () => {
        expect(component['isValidTimeString'](null)).toBeFalse();
      });

      it('should return false for undefined input', () => {
        expect(component['isValidTimeString'](undefined)).toBeFalse();
      });

      it('should return false for non-string input', () => {
        expect(component['isValidTimeString'](123 as any)).toBeFalse();
      });

      it('should return true for valid time with custom hour range 0-23', () => {
        expect(component['isValidTimeString']('23:00', 0, 23)).toBeTrue();
      });

      it('should return false when hour exceeds custom max', () => {
        expect(component['isValidTimeString']('13:00', 0, 12)).toBeFalse();
      });

      it('should return false when hour is below custom min', () => {
        expect(component['isValidTimeString']('00:00', 1, 12)).toBeFalse();
      });
    });

    describe('formatOutput (extended):', () => {
      it('should return full HH:mm:ss when modelFormat is HourMinuteSecond', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinuteSecond;
        expect(component['formatOutput']('10:30:45')).toBe('10:30:45');
      });

      it('should return time as-is when no modelFormat matches', () => {
        component['_modelFormat'] = 'unknown' as any;
        expect(component['formatOutput']('10:30')).toBe('10:30');
      });

      it('should return empty for invalid time string', () => {
        expect(component['formatOutput']('abc')).toBe('');
      });
    });

    describe('setValidationValue / clearValidationValue / hasValidationValue:', () => {
      it('should set and clear validation value', () => {
        component['setValidationValue']('10:00');
        expect(component['hasValidationValue']()).toBeTrue();

        component['clearValidationValue']();
        expect(component['hasValidationValue']()).toBeFalse();
      });

      it('should set validation value with hour range', () => {
        component['setValidationValue']('10:00', 1, 12);
        expect(component['_validationValue']).toBe('10:00');
        expect(component['_validationMinHour']).toBe(1);
        expect(component['_validationMaxHour']).toBe(12);
      });
    });

    describe('getValidationValue:', () => {
      it('should return validationValue when set', () => {
        component['setValidationValue']('15:00');
        expect(component['getValidationValue']('')).toBe('15:00');
      });

      it('should return control value when no validationValue', () => {
        component['clearValidationValue']();
        expect(component['getValidationValue']('12:00')).toBe('12:00');
      });

      it('should return empty when controlValue is not a string', () => {
        component['clearValidationValue']();
        expect(component['getValidationValue'](42)).toBe('');
      });

      it('should return empty when controlValue is null', () => {
        component['clearValidationValue']();
        expect(component['getValidationValue'](null)).toBe('');
      });
    });

    describe('getValidationHourRange:', () => {
      it('should return undefined when no range is set', () => {
        component['clearValidationValue']();
        expect(component['getValidationHourRange']()).toBeUndefined();
      });

      it('should return range when set', () => {
        component['setValidationValue']('10:00', 1, 12);
        expect(component['getValidationHourRange']()).toEqual({ minHour: 1, maxHour: 12 });
      });
    });

    describe('isGeneratedErrorPattern:', () => {
      it('should return true for invalidTime message', () => {
        expect(component['isGeneratedErrorPattern']('Hora inválida')).toBeTrue();
      });

      it('should return true for outOfRangeTime message', () => {
        expect(component['isGeneratedErrorPattern']('Hora fora do período')).toBeTrue();
      });

      it('should return false for custom error', () => {
        expect(component['isGeneratedErrorPattern']('Custom error')).toBeFalse();
      });

      it('should return false for empty string', () => {
        expect(component['isGeneratedErrorPattern']('')).toBeFalse();
      });

      it('should return false for null', () => {
        expect(component['isGeneratedErrorPattern'](null)).toBeFalse();
      });
    });

    describe('getDefaultInvalidTimeMessage:', () => {
      it('should return invalidTime message for pt locale', () => {
        expect(component['getDefaultInvalidTimeMessage']()).toBe('Hora inválida');
      });
    });

    describe('getDefaultOutOfRangeTimeMessage:', () => {
      it('should return outOfRangeTime message for pt locale', () => {
        expect(component['getDefaultOutOfRangeTimeMessage']()).toBe('Hora fora do período');
      });
    });

    describe('callOnChange (extended):', () => {
      it('should store pending value when onChangeModel is not registered', () => {
        component['onChangeModel'] = null;

        component['callOnChange']('10:00');

        expect(component['pendingChangeValue']).toEqual({ value: '10:00' });
      });

      it('should clear pendingChangeValue after onChangeModel is called', () => {
        const fnChange = jasmine.createSpy('onChangeModel');
        component.registerOnChange(fnChange);
        component['previousValue'] = '';
        component['pendingChangeValue'] = { value: '10:00' };

        component['callOnChange']('12:00');

        expect(component['pendingChangeValue']).toBeNull();
      });
    });

    describe('registerOnChange (extended):', () => {
      it('should flush pending value when registering onChange', () => {
        component['pendingChangeValue'] = { value: '10:00' };
        component['previousValue'] = '';

        const fnChange = jasmine.createSpy('onChangeModel');
        component.registerOnChange(fnChange);

        expect(fnChange).toHaveBeenCalledWith('10:00');
        expect(component['pendingChangeValue']).toBeNull();
      });

      it('should not flush when no pending value', () => {
        component['pendingChangeValue'] = null;

        const fnChange = jasmine.createSpy('onChangeModel');
        component.registerOnChange(fnChange);

        expect(fnChange).not.toHaveBeenCalled();
      });
    });

    describe('registerOnValidatorChange:', () => {
      it('should store the validator change function', () => {
        const fn = jasmine.createSpy('validatorChange');
        component.registerOnValidatorChange(fn);

        expect(component['validatorChange']).toBe(fn);
      });
    });

    describe('validateModel:', () => {
      it('should call validatorChange when registered', () => {
        const fn = jasmine.createSpy('validatorChange');
        component.registerOnValidatorChange(fn);

        component['validateModel']('10:00');

        expect(fn).toHaveBeenCalledWith('10:00');
      });

      it('should not throw when validatorChange is not registered', () => {
        component['validatorChange'] = null;

        expect(() => component['validateModel']('10:00')).not.toThrow();
      });
    });

    describe('is12HourFormat:', () => {
      it('should return true when format is 12', () => {
        component.format = PoTimerFormat.Format12;
        expect(component.is12HourFormat).toBeTrue();
      });

      it('should return false when format is 24', () => {
        component.format = PoTimerFormat.Format24;
        expect(component.is12HourFormat).toBeFalse();
      });
    });

    describe('timeValue getter/setter:', () => {
      it('should set and get timeValue', () => {
        component.timeValue = '14:30';
        expect(component.timeValue).toBe('14:30');
      });
    });

    describe('p-second-interval:', () => {
      it('should set valid second interval', () => {
        component.secondInterval = 15;
        expect(component.secondInterval).toBe(15);
      });

      it('should default to 1 for invalid value', () => {
        component.secondInterval = -1;
        expect(component.secondInterval).toBe(1);
      });
    });

    describe('p-locale:', () => {
      it('should set locale and update mask', () => {
        spyOn(component as any, 'updateMask');
        component.locale = 'en';

        expect(component['_locale']).toBe('en');
      });
    });

    describe('ngOnInit:', () => {
      it('should call updateMask', () => {
        spyOn(component as any, 'updateMask');
        component.ngOnInit();

        expect(component['updateMask']).toHaveBeenCalled();
      });
    });

    describe('p-placeholder (extended):', () => {
      it('should convert undefined placeholder to empty string', () => {
        component.placeholder = undefined;
        expect(component.placeholder).toBe('');
      });

      it('should set a non-empty placeholder', () => {
        component.placeholder = 'HH:MM';
        expect(component.placeholder).toBe('HH:MM');
      });
    });

    describe('p-no-autocomplete:', () => {
      it('should default noAutocomplete to false', () => {
        expect(component.noAutocomplete).toBeFalsy();
      });

      it('should set noAutocomplete to true', () => {
        component.noAutocomplete = true;
        expect(component.noAutocomplete).toBeTrue();
      });
    });

    describe('p-disabled - empty string branch:', () => {
      it('should set disabled to true when empty string is passed', () => {
        component.setDisabled = '';
        expect(component.disabled).toBeTrue();
      });
    });

    describe('p-readonly - empty string branch:', () => {
      it('should set readonly to true when empty string is passed', () => {
        component.setReadonly = '';
        expect(component.readonly).toBeTrue();
      });
    });

    describe('p-required - empty string branch:', () => {
      it('should set required to true when empty string is passed', () => {
        component.setRequired = '';
        expect(component.required).toBeTrue();
      });
    });

    describe('p-clean - empty string branch:', () => {
      it('should set clean to true when empty string is passed', () => {
        component.setClean = '';
        expect(component.clean).toBeTrue();
      });
    });

    describe('isValidTimeString - NaN branch:', () => {
      it('should return false when parsed numbers result in NaN', () => {
        // The regex requires \d{2} so we can't easily make parseInt return NaN
        // Test with a string that doesn't match the regex
        expect(component['isValidTimeString']('ab:cd')).toBeFalse();
      });

      it('should return false when hours exceed max', () => {
        expect(component['isValidTimeString']('24:00')).toBeFalse();
      });

      it('should return false when minutes exceed 59', () => {
        expect(component['isValidTimeString']('10:60')).toBeFalse();
      });

      it('should return false when seconds exceed 59', () => {
        expect(component['isValidTimeString']('10:30:60')).toBeFalse();
      });

      it('should return true for valid time with seconds', () => {
        expect(component['isValidTimeString']('10:30:45')).toBeTrue();
      });

      it('should return false for null value', () => {
        expect(component['isValidTimeString'](null)).toBeFalse();
      });

      it('should return false for non-string value', () => {
        expect(component['isValidTimeString'](123 as any)).toBeFalse();
      });
    });

    describe('isTimeInRange - edge cases:', () => {
      it('should return true when time is null', () => {
        expect(component['isTimeInRange'](null)).toBeTrue();
      });

      it('should return true when time is empty', () => {
        expect(component['isTimeInRange']('')).toBeTrue();
      });

      it('should return true when time is invalid format', () => {
        expect(component['isTimeInRange']('abc')).toBeTrue();
      });

      it('should return false when time is below minTime', () => {
        component['_minTime'] = '10:00';
        expect(component['isTimeInRange']('09:00')).toBeFalse();
      });

      it('should return false when time is above maxTime', () => {
        component['_maxTime'] = '18:00';
        expect(component['isTimeInRange']('19:00')).toBeFalse();
      });

      it('should return true when no minTime or maxTime is set', () => {
        component['_minTime'] = undefined;
        component['_maxTime'] = undefined;
        expect(component['isTimeInRange']('10:00')).toBeTrue();
      });
    });

    describe('getDefaultInvalidTimeMessage - locale fallback:', () => {
      it('should fallback to pt when locale is empty', () => {
        component['_locale'] = '';
        const message = component['getDefaultInvalidTimeMessage']();
        expect(message).toBeTruthy();
      });

      it('should fallback to pt when locale is unknown', () => {
        component['_locale'] = 'xx';
        const message = component['getDefaultInvalidTimeMessage']();
        expect(message).toBeTruthy();
      });
    });

    describe('getDefaultOutOfRangeTimeMessage - locale fallback:', () => {
      it('should fallback to pt when locale is empty', () => {
        component['_locale'] = '';
        const message = component['getDefaultOutOfRangeTimeMessage']();
        expect(message).toBeTruthy();
      });

      it('should fallback to pt when locale is unknown', () => {
        component['_locale'] = 'xx';
        const message = component['getDefaultOutOfRangeTimeMessage']();
        expect(message).toBeTruthy();
      });
    });

    describe('isGeneratedErrorPattern - edge cases:', () => {
      it('should return false for empty string', () => {
        expect(component['isGeneratedErrorPattern']('')).toBeFalse();
      });

      it('should return false for null', () => {
        expect(component['isGeneratedErrorPattern'](null)).toBeFalse();
      });

      it('should return true for invalidTime message', () => {
        const message = component['getDefaultInvalidTimeMessage']();
        expect(component['isGeneratedErrorPattern'](message)).toBeTrue();
      });

      it('should return true for outOfRangeTime message', () => {
        const message = component['getDefaultOutOfRangeTimeMessage']();
        expect(component['isGeneratedErrorPattern'](message)).toBeTrue();
      });

      it('should return false for custom error message', () => {
        expect(component['isGeneratedErrorPattern']('Custom error')).toBeFalse();
      });
    });

    describe('locale setter - fallback branches:', () => {
      it('should use shortLanguage when value is null', () => {
        component['shortLanguage'] = 'pt';
        component.locale = null;
        expect(component['_locale']).toBe('pt');
      });

      it('should use shortLanguage when value is too short', () => {
        component['shortLanguage'] = 'pt';
        component.locale = 'x';
        expect(component['_locale']).toBe('pt');
      });

      it('should use provided value when valid', () => {
        component.locale = 'en';
        expect(component['_locale']).toBe('en');
      });
    });

    describe('locale getter - fallback branch:', () => {
      it('should return shortLanguage when _locale is empty', () => {
        component['_locale'] = '';
        component['shortLanguage'] = 'en';
        expect(component.locale).toBe('en');
      });
    });

    describe('callOnChange - pendingChangeValue branch:', () => {
      it('should store pending change when onChangeModel is not set', () => {
        component['onChangeModel'] = null;
        component['callOnChange']('10:00');
        expect(component['pendingChangeValue']).toEqual({ value: '10:00' });
      });

      it('should not call onChangeModel when value equals previousValue', () => {
        const spy = jasmine.createSpy('onChangeModel');
        component['onChangeModel'] = spy;
        component['previousValue'] = '10:00';

        component['callOnChange']('10:00');

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('registerOnChange - pending change flush:', () => {
      it('should flush pending change when registering onChange', () => {
        component['pendingChangeValue'] = { value: '10:00' };
        const spy = jasmine.createSpy('onChangeModel');

        component.registerOnChange(spy);

        expect(spy).toHaveBeenCalledWith('10:00');
        expect(component['pendingChangeValue']).toBeNull();
      });
    });

    describe('formatOutput - branches:', () => {
      it('should return empty string for invalid time', () => {
        expect(component['formatOutput']('invalid')).toBe('');
      });

      it('should return empty string for null', () => {
        expect(component['formatOutput'](null)).toBe('');
      });

      it('should return HH:mm when modelFormat is HourMinute', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinute;
        expect(component['formatOutput']('10:30:45')).toBe('10:30');
      });

      it('should return full time when modelFormat is HourMinuteSecond', () => {
        component.modelFormat = PoTimepickerModelFormat.HourMinuteSecond;
        expect(component['formatOutput']('10:30:45')).toBe('10:30:45');
      });
    });

    describe('validate - extended branches:', () => {
      it('should validate with hourRange when validationHourRange is set', () => {
        component['setValidationValue']('13:00', 1, 12);
        const control = new UntypedFormControl('');
        const result = component.validate(control);
        expect(result).toEqual({ time: { valid: false } });
      });

      it('should validate out of range time', () => {
        component['_minTime'] = '10:00';
        component['_maxTime'] = '18:00';
        component.timeValue = '09:00';
        component['_validationValue'] = '09:00';
        const control = new UntypedFormControl('09:00');
        const result = component.validate(control);
        expect(result).toBeTruthy();
      });
    });

    describe('getValidationValue - edge cases:', () => {
      it('should return controlValue as string when no validationValue', () => {
        component['_validationValue'] = undefined;
        expect(component['getValidationValue']('10:00')).toBe('10:00');
      });

      it('should return empty string when controlValue is not a string', () => {
        component['_validationValue'] = undefined;
        expect(component['getValidationValue'](null)).toBe('');
      });

      it('should return validationValue when set', () => {
        component['_validationValue'] = '10:00';
        expect(component['getValidationValue']('')).toBe('10:00');
      });

      it('should return empty string when validationValue is empty string', () => {
        component['_validationValue'] = '';
        expect(component['getValidationValue'](null)).toBe('');
      });
    });

    describe('getValidationHourRange - edge cases:', () => {
      it('should return undefined when minHour is undefined', () => {
        component['_validationMinHour'] = undefined;
        component['_validationMaxHour'] = 12;
        expect(component['getValidationHourRange']()).toBeUndefined();
      });

      it('should return range when both are set', () => {
        component['_validationMinHour'] = 1;
        component['_validationMaxHour'] = 12;
        expect(component['getValidationHourRange']()).toEqual({ minHour: 1, maxHour: 12 });
      });
    });

    describe('isValidTimeString - NaN guard path:', () => {
      it('should return false when parsed hours is NaN', () => {
        const originalParseInt = window.parseInt;
        spyOn(window, 'parseInt').and.callFake((value: string, radix?: number) => {
          if (value === '12') {
            return Number.NaN;
          }

          return originalParseInt(value, radix);
        });

        expect(component['isValidTimeString']('12:34:56')).toBeFalse();
      });

      it('should return false when parsed minutes is NaN', () => {
        const originalParseInt = window.parseInt;
        spyOn(window, 'parseInt').and.callFake((value: string, radix?: number) => {
          if (value === '34') {
            return Number.NaN;
          }

          return originalParseInt(value, radix);
        });

        expect(component['isValidTimeString']('12:34:56')).toBeFalse();
      });

      it('should return false when parsed seconds is NaN', () => {
        const originalParseInt = window.parseInt;
        spyOn(window, 'parseInt').and.callFake((value: string, radix?: number) => {
          if (value === '56') {
            return Number.NaN;
          }

          return originalParseInt(value, radix);
        });

        expect(component['isValidTimeString']('12:34:56')).toBeFalse();
      });

      it('should return false for time string with hours above 23', () => {
        expect(component['isValidTimeString']('99:99')).toBeFalse();
      });

      it('should return false for time with seconds above 59', () => {
        expect(component['isValidTimeString']('10:30:99')).toBeFalse();
      });

      it('should return true for valid time with seconds', () => {
        expect(component['isValidTimeString']('10:30:45')).toBeTrue();
      });

      it('should return false for non-matching format', () => {
        expect(component['isValidTimeString']('1:2')).toBeFalse();
      });

      it('should accept custom minHour and maxHour', () => {
        expect(component['isValidTimeString']('05:00', 1, 12)).toBeTrue();
        expect(component['isValidTimeString']('13:00', 1, 12)).toBeFalse();
        expect(component['isValidTimeString']('00:00', 1, 12)).toBeFalse();
      });
    });

    describe('getDefaultInvalidTimeMessage - locale fallback to poLocaleDefault:', () => {
      it('should use poLocaleDefault when locale getter returns empty string', () => {
        spyOnProperty(component, 'locale', 'get').and.returnValue('');

        const msg = component['getDefaultInvalidTimeMessage']();

        expect(msg).toBe(poTimepickerLiterals[poLocaleDefault]?.invalidTime || poTimepickerLiterals.pt.invalidTime);
      });

      it('should use poLocaleDefault when locale is undefined', () => {
        component['_locale'] = undefined;
        const msg = component['getDefaultInvalidTimeMessage']();
        expect(msg).toBeTruthy();
      });

      it('should use poLocaleDefault when locale is empty string', () => {
        component['_locale'] = '';
        const msg = component['getDefaultInvalidTimeMessage']();
        expect(msg).toBeTruthy();
      });
    });

    describe('getDefaultOutOfRangeTimeMessage - locale fallback to poLocaleDefault:', () => {
      it('should use poLocaleDefault when locale getter returns empty string', () => {
        spyOnProperty(component, 'locale', 'get').and.returnValue('');

        const msg = component['getDefaultOutOfRangeTimeMessage']();

        expect(msg).toBe(
          poTimepickerLiterals[poLocaleDefault]?.outOfRangeTime || poTimepickerLiterals.pt.outOfRangeTime
        );
      });

      it('should use poLocaleDefault when locale is undefined', () => {
        component['_locale'] = undefined;
        const msg = component['getDefaultOutOfRangeTimeMessage']();
        expect(msg).toBeTruthy();
      });

      it('should use poLocaleDefault when locale is empty string', () => {
        component['_locale'] = '';
        const msg = component['getDefaultOutOfRangeTimeMessage']();
        expect(msg).toBeTruthy();
      });
    });
  });
});
