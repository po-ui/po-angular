import { Directive } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl, Validators } from '@angular/forms';

import { mapInputSizeToLoadingIcon } from '../../../utils/util';
import { PoValidators as ValidatorsFunctions } from './../validators';

import { PoThemeA11yEnum } from '../../../services';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoTimepickerBaseComponent } from './po-timepicker-base.component';
import { PoTimepickerIsoFormat } from './enums/po-timepicker-iso-format.enum';
import { PoTimerFormat } from '../../po-timer/enums/po-timer-format.enum';

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

    describe('p-iso-format:', () => {
      it('should update with valid value', () => {
        component.isoFormat = PoTimepickerIsoFormat.HourMinuteSecond;
        expect(component.isoFormat).toBe(PoTimepickerIsoFormat.HourMinuteSecond);
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

      it('should append :00 when isoFormat is HourMinuteSecond and time has 5 chars', () => {
        component.isoFormat = PoTimepickerIsoFormat.HourMinuteSecond;
        expect(component['formatOutput']('10:30')).toBe('10:30:00');
      });

      it('should truncate to 5 chars when isoFormat is HourMinute', () => {
        component.isoFormat = PoTimepickerIsoFormat.HourMinute;
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
        expect(component.errorPattern).toBe('Hora inv\u00e1lida');
      });

      it('should return time error for time out of range', () => {
        component.minTime = '08:00';
        component['cd'] = { markForCheck: () => {} } as any;
        spyOn(component['cd'], 'markForCheck');

        const result = component.validate(new UntypedFormControl('07:00'));

        expect(result).toEqual({ time: { valid: false } });
        expect(component.errorPattern).toBe('Hora fora do per\u00edodo');
      });

      it('should return null for valid time', () => {
        const result = component.validate(new UntypedFormControl('10:00'));

        expect(result).toBeNull();
      });
    });
  });
});
