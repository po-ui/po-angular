import { Directive } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { PoDatetimepickerBaseComponent } from './po-datetimepicker-base.component';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

@Directive()
class PoDatetimepickerTestComponent extends PoDatetimepickerBaseComponent {
  refreshValue(value: Date): void {}
}

describe('PoDatetimepickerBaseComponent:', () => {
  let component: PoDatetimepickerTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    const languageService = TestBed.inject(PoLanguageService);
    component = TestBed.runInInjectionContext(() => new PoDatetimepickerTestComponent(languageService));
    (component as any)['shortLanguage'] = 'pt';
  });

  it('should be created', () => {
    expect(component instanceof PoDatetimepickerBaseComponent).toBeTruthy();
  });

  describe('writeValue:', () => {
    it('should clear date and timeValue when value is null', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue(null);

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
      expect(component.refreshValue).toHaveBeenCalledWith(undefined);
    });

    it('should clear date and timeValue when value is empty string', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue('');

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
    });

    it('should set date and timeValue from Date object', () => {
      vi.spyOn(component as any, 'refreshValue');
      const date = new Date(2026, 4, 12, 14, 30, 0);
      component.writeValue(date);

      expect(component['date'].getFullYear()).toBe(2026);
      expect(component['date'].getMonth()).toBe(4);
      expect(component['date'].getDate()).toBe(12);
      expect(component['timeValue']).toBe('14:30');
    });

    it('should set date and timeValue from ISO string with timezone', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue('2026-05-12T14:30:00-03:00');

      expect(component['date']).toBeDefined();
      expect(component['timeValue']).toBeTruthy();
    });

    it('should set date and timeValue from ISO string without timezone', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue('2026-05-12T14:30:00');

      expect(component['date']).toBeDefined();
      expect(component['timeValue']).toContain('14:30');
    });

    it('should set date with 00:00 time from date-only ISO string', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue('2026-05-12');

      expect(component['date']).toBeDefined();
      expect(component['date'].getFullYear()).toBe(2026);
      expect(component['timeValue']).toBe('00:00');
    });

    it('should call onChangeModel with ISO model when date and time are valid', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue(new Date(2026, 4, 12, 14, 30));

      expect(onChangeSpy).toHaveBeenCalled();
      const calledValue = vi.mocked(onChangeSpy).mock.lastCall[0];
      expect(calledValue).toContain('2026-05-12T14:30');
    });

    it('should always propagate normalized ISO value even when called twice with same Date', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);
      vi.spyOn(component as any, 'refreshValue');

      component.writeValue(new Date(2026, 4, 12, 14, 30));
      component.writeValue(new Date(2026, 4, 12, 14, 30));

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(vi.mocked(onChangeSpy).mock.lastCall[0]).toContain('2026-05-12T14:30');
    });
  });

  describe('registerOnChange:', () => {
    it('should store the onChange function', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      expect(component['onChangeModel']).toBe(fn);
    });
  });

  describe('registerOnTouched:', () => {
    it('should store the onTouched function', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      expect(component['onTouchedModel']).toBe(fn);
    });
  });

  describe('setDisabledState:', () => {
    it('should set disabled to true', () => {
      component.setDisabledState(true);
      expect(component['_disabled']).toBe(true);
    });

    it('should set disabled to false', () => {
      component.setDisabledState(false);
      expect(component['_disabled']).toBe(false);
    });
  });

  describe('validate:', () => {
    it('should return null when value is valid', () => {
      const control = new FormControl('2026-05-12T14:30:00-03:00');
      const result = component.validate(control);
      expect(result).toBeNull();
    });

    it('should return date error when value is invalid date string', () => {
      const control = new FormControl('invalid-date');
      const result = component.validate(control);
      expect(result).toEqual({ date: { valid: false } });
    });

    it('should set hasValidatorRequired when showErrorMessageRequired is true and control has required validator', () => {
      component['hasValidatorRequired'] = false;
      Object.defineProperty(component, 'showErrorMessageRequired', { value: () => true });
      const control = new FormControl('2026-05-12T14:30:00-03:00', Validators.required);
      component.validate(control);
      expect(component['hasValidatorRequired']).toBe(true);
    });

    it('should use pt fallback for invalidDatetime when locale has no literals', () => {
      component['_locale'] = 'xx';
      const control = new FormControl('invalid-date');
      component.validate(control);
      expect(component['currentErrorPattern']()).toBe('Data/hora inválida');
    });

    it('should return required error when field is required and value is empty', () => {
      component['_required'] = true;
      component['_disabled'] = false;
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toEqual({ required: { valid: false } });
    });

    it('should return null when field is required but disabled', () => {
      component['_required'] = true;
      component['_disabled'] = true;
      const control = new FormControl('');
      const result = component.validate(control);
      expect(result).toBeNull();
    });
  });

  describe('getModelValue:', () => {
    it('should return empty string when date is undefined', () => {
      component['date'] = undefined;
      expect(component.getModelValue()).toBe('');
    });

    it('should return ISO string with timezone when date and time are set', () => {
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';
      const result = component.getModelValue();

      expect(result).toContain('2026-05-12T14:30');
      expect(result).toMatch(/[+-]\d{2}:\d{2}$/);
    });

    it('should use 00:00 as default time when timeValue is empty', () => {
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '';
      const result = component.getModelValue();

      expect(result).toContain('2026-05-12T00:00');
    });
  });

  describe('getTimezoneOffset:', () => {
    it('should return timezone in +/-HH:mm format', () => {
      const result = component.getTimezoneOffset(new Date());
      expect(result).toMatch(/^[+-]\d{2}:\d{2}$/);
    });

    it('should use current date when no date is provided', () => {
      const result = component.getTimezoneOffset();
      expect(result).toMatch(/^[+-]\d{2}:\d{2}$/);
    });

    it('should return + sign when offset is negative (east of UTC)', () => {
      const date = new Date();
      vi.spyOn(date as any, 'getTimezoneOffset').mockReturnValue(-180); // UTC+3
      const result = component.getTimezoneOffset(date);
      expect(result).toBe('+03:00');
    });

    it('should return - sign when offset is positive (west of UTC)', () => {
      const date = new Date();
      vi.spyOn(date as any, 'getTimezoneOffset').mockReturnValue(180); // UTC-3
      const result = component.getTimezoneOffset(date);
      expect(result).toBe('-03:00');
    });

    it('should return +00:00 when offset is 0 (UTC)', () => {
      const date = new Date();
      vi.spyOn(date as any, 'getTimezoneOffset').mockReturnValue(0);
      const result = component.getTimezoneOffset(date);
      expect(result).toBe('+00:00');
    });
  });

  describe('callOnChange:', () => {
    it('should call onChangeModel and update previousValue', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.callOnChange('new-value');

      expect(fn).toHaveBeenCalledWith('new-value');
      expect(component['previousValue']).toBe('new-value');
    });

    it('should call onChangeModel even when value is same as previous', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.callOnChange('same-value');
      fn.mockClear();
      component.callOnChange('same-value');

      expect(fn).toHaveBeenCalledWith('same-value');
    });
  });

  describe('controlModel:', () => {
    it('should call callOnChange with model value', () => {
      vi.spyOn(component as any, 'callOnChange');
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';
      component.controlModel();

      expect(component.callOnChange).toHaveBeenCalled();
    });

    it('should call callOnChange with empty string when no date', () => {
      vi.spyOn(component as any, 'callOnChange');
      component['date'] = undefined;
      component.controlModel();

      expect(component.callOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('formatTimeForDisplay:', () => {
    it('should return time as-is in 24h format', () => {
      const result = component.formatTimeForDisplay('14:30');
      expect(result).toBe('14:30');
    });

    it('should return 00:00 when time is empty in 24h format', () => {
      const result = component.formatTimeForDisplay('');
      expect(result).toBe('00:00');
    });

    it('should include seconds when provided in 24h format', () => {
      Object.defineProperty(component, 'showSeconds', { value: () => true });
      const result = component.formatTimeForDisplay('14:30:45');
      expect(result).toBe('14:30:45');
    });

    it('should truncate seconds when showSeconds is false and time has seconds', () => {
      Object.defineProperty(component, 'showSeconds', { value: () => false });
      const result = component.formatTimeForDisplay('14:30:45');
      expect(result).toBe('14:30');
    });

    it('should return 12:00 AM when time is empty in 12h format', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('');
      expect(result).toBe('12:00 AM');
    });

    it('should convert 0 hours to 12 AM', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('00:30');
      expect(result).toBe('12:30 AM');
    });

    it('should convert 12 hours to 12 PM', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('12:00');
      expect(result).toBe('12:00 PM');
    });

    it('should convert 13 hours to 01 PM', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('13:45');
      expect(result).toBe('01:45 PM');
    });

    it('should convert 23 hours to 11 PM', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('23:59');
      expect(result).toBe('11:59 PM');
    });

    it('should keep AM for hours 1-11', () => {
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('09:15');
      expect(result).toBe('09:15 AM');
    });

    it('should include seconds in 12h format', () => {
      Object.defineProperty(component, 'showSeconds', { value: () => true });
      Object.defineProperty(component, 'is12HourFormat', { get: () => true });
      const result = component.formatTimeForDisplay('14:30:45');
      expect(result).toBe('02:30:45 PM');
    });
  });

  describe('getters:', () => {
    it('format should return locale-based format by default', () => {
      expect(component.format).toBe('dd/mm/yyyy');
    });

    it('resolvedTimerFormat should return Format24 for pt locale', () => {
      expect(component.resolvedTimerFormat).toBe('24');
    });

    it('is12HourFormat should return false for pt locale', () => {
      expect(component.is12HourFormat).toBe(false);
    });

    it('isClean should return false by default', () => {
      expect(component.isClean).toBe(false);
    });

    it('isDisabled should return false by default', () => {
      expect(component.isDisabled).toBe(false);
    });

    it('isReadonly should return false by default', () => {
      expect(component.isReadonly).toBe(false);
    });

    it('isRequired should return false by default', () => {
      expect(component.isRequired).toBe(false);
    });

    it('locale should return shortLanguage by default', () => {
      expect(component.locale).toBe('pt');
    });

    it('resolvedMinDate should return undefined by default', () => {
      expect(component.resolvedMinDate).toBeUndefined();
    });

    it('resolvedMaxDate should return undefined by default', () => {
      expect(component.resolvedMaxDate).toBeUndefined();
    });
  });

  describe('registerOnValidatorChange:', () => {
    it('should store the validator change function', () => {
      const fn = vi.fn();
      component.registerOnValidatorChange(fn);
      expect(component['validatorChange']).toBe(fn);
    });
  });

  describe('validate - date range and time range:', () => {
    it('should return date error when date is out of range', () => {
      component['date'] = new Date(2020, 0, 1);
      component['_resolvedMinDate'] = new Date(2025, 0, 1);
      const control = new FormControl('2020-01-01T10:00-03:00');
      expect(component.validate(control)).toEqual({ date: { valid: false } });
    });

    it('should return time error when time is out of range', () => {
      component['date'] = new Date(2026, 4, 12);
      component['_timeValue'] = '22:00';
      // Set maxTime signal - use internal property since we can't setInput without fixture
      component['_resolvedMinDate'] = undefined;
      component['_resolvedMaxDate'] = undefined;
      const control = new FormControl('2026-05-12T22:00-03:00');
      // We need to mock the maxTime signal
      const originalMaxTime = component.maxTime;
      Object.defineProperty(component, 'maxTime', { value: () => '18:00' });
      expect(component.validate(control)).toEqual({ time: { valid: false } });
      Object.defineProperty(component, 'maxTime', { value: originalMaxTime });
    });
  });

  describe('resolvedTimerFormat:', () => {
    it('should return explicit value when timerFormat is set', () => {
      Object.defineProperty(component, 'timerFormat', { value: () => '12' });
      expect(component.resolvedTimerFormat).toBe('12');
    });

    it('should return Format24 as default for unknown locale', () => {
      Object.defineProperty(component, 'timerFormat', { value: () => undefined });
      component['_locale'] = 'xx';
      expect(component.resolvedTimerFormat).toBe('24');
    });
  });

  describe('resolvedSize:', () => {
    it('should return default size when _size is undefined', () => {
      component['_size'] = undefined;
      expect(component.resolvedSize).toBeTruthy();
    });

    it('should return _size when defined', () => {
      component['_size'] = 'small';
      expect(component.resolvedSize).toBe('small');
    });
  });

  describe('onThemeChange:', () => {
    it('should call applySizeBasedOnA11y', () => {
      vi.spyOn(component as any, 'applySizeBasedOnA11y');
      component['onThemeChange']();
      expect(component['applySizeBasedOnA11y']).toHaveBeenCalled();
    });
  });

  describe('mapSizeToIcon:', () => {
    it('should return xs for small size', () => {
      expect(component.mapSizeToIcon('small')).toBe('xs');
    });

    it('should return sm for medium size', () => {
      expect(component.mapSizeToIcon('medium')).toBe('sm');
    });

    it('should return sm for undefined size', () => {
      expect(component.mapSizeToIcon(undefined)).toBe('sm');
    });
  });

  describe('buildMask:', () => {
    it('should build mask with time portion for 24h format', () => {
      const mask = component['buildMask']('dd/mm/yyyy');
      expect(mask.mask).toContain('99:99');
    });

    it('should use this.format as default when no argument provided', () => {
      component['_format'] = 'mm/dd/yyyy';
      const mask = component['buildMask']();
      expect(mask.mask).toContain('99/99/9999');
    });

    it('should include seconds in mask when showSeconds is true', () => {
      Object.defineProperty(component, 'showSeconds', { value: () => true });
      const mask = component['buildMask']('dd/mm/yyyy');
      expect(mask.mask).toContain('99:99:99');
    });
  });

  describe('isDateInRange:', () => {
    it('should return true when date is undefined', () => {
      component['_date'] = undefined;
      expect(component['isDateInRange']()).toBe(true);
    });

    it('should return true when date is within range', () => {
      component['_date'] = new Date(2026, 5, 15);
      component['_resolvedMinDate'] = new Date(2026, 0, 1);
      component['_resolvedMaxDate'] = new Date(2026, 11, 31);
      expect(component['isDateInRange']()).toBe(true);
    });
  });

  describe('isTimeInRange:', () => {
    it('should return true when time is empty', () => {
      expect(component['isTimeInRange']('')).toBe(true);
    });

    it('should return false when time is before minTime', () => {
      Object.defineProperty(component, 'minTime', { value: () => '09:00' });
      Object.defineProperty(component, 'maxTime', { value: () => undefined });
      expect(component['isTimeInRange']('08:00')).toBe(false);
    });

    it('should return true when time is within range', () => {
      Object.defineProperty(component, 'minTime', { value: () => '09:00' });
      Object.defineProperty(component, 'maxTime', { value: () => '18:00' });
      expect(component['isTimeInRange']('12:00')).toBe(true);
    });

    it('should return true when no min/max time defined', () => {
      Object.defineProperty(component, 'minTime', { value: () => undefined });
      Object.defineProperty(component, 'maxTime', { value: () => undefined });
      expect(component['isTimeInRange']('12:00')).toBe(true);
    });
  });

  describe('timeToSeconds:', () => {
    it('should convert HH:mm to seconds', () => {
      expect(component['timeToSeconds']('14:30')).toBe(14 * 3600 + 30 * 60);
    });

    it('should convert HH:mm:ss to seconds', () => {
      expect(component['timeToSeconds']('14:30:45')).toBe(14 * 3600 + 30 * 60 + 45);
    });

    it('should handle NaN hours as 0', () => {
      expect(component['timeToSeconds']('ab:30')).toBe(30 * 60);
    });

    it('should handle NaN seconds as 0', () => {
      expect(component['timeToSeconds']('14:30:xx')).toBe(14 * 3600 + 30 * 60);
    });
  });

  describe('resolveFormat:', () => {
    it('should return poDatepickerFormatDefault when locale has no mapping', () => {
      component['_locale'] = 'zz';
      Object.defineProperty(component, 'dateFormat', { value: () => undefined });
      expect(component['resolveFormat']()).toBe('dd/mm/yyyy');
    });
  });

  describe('validateModel:', () => {
    it('should call validatorChange when defined', () => {
      const fn = vi.fn();
      component['validatorChange'] = fn;
      component['validateModel']('value');
      expect(fn).toHaveBeenCalled();
    });

    it('should not throw when validatorChange is undefined', () => {
      component['validatorChange'] = undefined;
      expect(() => component['validateModel']('value')).not.toThrow();
    });
  });

  describe('processStringValue:', () => {
    it('should use fallback parse when Date constructor returns Invalid Date', () => {
      vi.spyOn(component as any, 'refreshValue');
      component.writeValue('2026-05-12Tinvalid');

      expect(component['date']).toBeDefined();
    });

    it('should parse date-only string and set timeValue to 00:00', () => {
      vi.spyOn(component as any, 'refreshValue');
      component['processStringValue']('2026-05-12');

      expect(component['date']).toBeDefined();
      expect(component['timeValue']).toBe('00:00');
    });
  });

  describe('normalizeTimePart:', () => {
    it('should remove Z suffix', () => {
      expect(component['normalizeTimePart']('14:30:00Z')).toBe('14:30:00');
    });

    it('should remove timezone offset +HH:mm', () => {
      expect(component['normalizeTimePart']('14:30:00+03:00')).toBe('14:30:00');
    });

    it('should remove timezone offset -HH:mm', () => {
      expect(component['normalizeTimePart']('14:30:00-05:00')).toBe('14:30:00');
    });

    it('should truncate to 8 chars when length >= 5', () => {
      expect(component['normalizeTimePart']('14:30:45')).toBe('14:30:45');
    });

    it('should return as-is when length < 5', () => {
      expect(component['normalizeTimePart']('14:3')).toBe('14:3');
    });
  });

  describe('extractTimeFromDate:', () => {
    it('should return HH:mm:ss when seconds are not 00', () => {
      Object.defineProperty(component, 'showSeconds', { value: () => true });
      const date = new Date(2026, 4, 12, 14, 30, 45);
      expect(component['extractTimeFromDate'](date)).toBe('14:30:45');
    });

    it('should return HH:mm when seconds are 00', () => {
      const date = new Date(2026, 4, 12, 14, 30, 0);
      expect(component['extractTimeFromDate'](date)).toBe('14:30');
    });
  });
});

describe('PoDatetimepickerBaseComponent - Effects (with fixture):', () => {
  let component: any;
  let fixture: any;

  beforeEach(async () => {
    const { ComponentFixture } = await import('@angular/core/testing');
    const { Component } = await import('@angular/core');
    const { FormsModule } = await import('@angular/forms');
    const { PoDatetimepickerModule } = await import('./po-datetimepicker.module');
    const { PoDatetimepickerComponent } = await import('./po-datetimepicker.component');

    await TestBed.configureTestingModule({
      imports: [FormsModule, PoDatetimepickerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDatetimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('p-clean effect:', () => {
    it('should set _clean to true when value is empty string', () => {
      fixture.componentRef.setInput('p-clean', '');
      fixture.detectChanges();
      expect(component.isClean).toBe(true);
    });

    it('should set _clean to true when value is true', () => {
      fixture.componentRef.setInput('p-clean', true);
      fixture.detectChanges();
      expect(component.isClean).toBe(true);
    });

    it('should set _clean to false when value is false', () => {
      fixture.componentRef.setInput('p-clean', false);
      fixture.detectChanges();
      expect(component.isClean).toBe(false);
    });
  });

  describe('p-disabled effect:', () => {
    it('should set _disabled to true when value is empty string', () => {
      fixture.componentRef.setInput('p-disabled', '');
      fixture.detectChanges();
      expect(component.isDisabled).toBe(true);
    });

    it('should set _disabled to true when value is true', () => {
      fixture.componentRef.setInput('p-disabled', true);
      fixture.detectChanges();
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('p-locale effect:', () => {
    it('should set locale when value has 2+ chars', () => {
      fixture.componentRef.setInput('p-locale', 'en');
      fixture.detectChanges();
      expect(component.locale).toBe('en');
    });

    it('should use poLocaleDefault when value has less than 2 chars', () => {
      fixture.componentRef.setInput('p-locale', 'x');
      fixture.detectChanges();
      expect(component.locale).toBe('pt');
    });

    it('should use shortLanguage when value is undefined', () => {
      fixture.componentRef.setInput('p-locale', undefined);
      fixture.detectChanges();
      expect(component.locale).toBeTruthy();
    });
  });

  describe('p-date-format effect:', () => {
    it('should update format when dateFormat is set', () => {
      fixture.componentRef.setInput('p-format-date', 'mm/dd/yyyy');
      fixture.detectChanges();
      expect(component.format).toBe('mm/dd/yyyy');
    });
  });

  describe('p-placeholder effect:', () => {
    it('should set placeholder when value is string', () => {
      fixture.componentRef.setInput('p-placeholder', 'Enter date');
      fixture.detectChanges();
      expect(component.placeholderValue).toBe('Enter date');
    });

    it('should set empty string when value is not string', () => {
      fixture.componentRef.setInput('p-placeholder', undefined);
      fixture.detectChanges();
      expect(component.placeholderValue).toBe('');
    });
  });

  describe('p-readonly effect:', () => {
    it('should set _readonly to true when value is empty string', () => {
      fixture.componentRef.setInput('p-readonly', '');
      fixture.detectChanges();
      expect(component.isReadonly).toBe(true);
    });

    it('should set _readonly to true when value is true', () => {
      fixture.componentRef.setInput('p-readonly', true);
      fixture.detectChanges();
      expect(component.isReadonly).toBe(true);
    });
  });

  describe('p-required effect:', () => {
    it('should set _required to true when value is empty string', () => {
      fixture.componentRef.setInput('p-required', '');
      fixture.detectChanges();
      expect(component.isRequired).toBe(true);
    });

    it('should set _required to true when value is true', () => {
      fixture.componentRef.setInput('p-required', true);
      fixture.detectChanges();
      expect(component.isRequired).toBe(true);
    });
  });

  describe('p-min-date effect:', () => {
    it('should set resolvedMinDate from Date object', () => {
      fixture.componentRef.setInput('p-min-date', new Date(2026, 0, 1));
      fixture.detectChanges();
      expect(component.resolvedMinDate).toBeDefined();
      expect(component.resolvedMinDate.getFullYear()).toBe(2026);
      expect(component.resolvedMinDate.getHours()).toBe(0);
    });

    it('should set resolvedMinDate from ISO string', () => {
      fixture.componentRef.setInput('p-min-date', '2026-01-01');
      fixture.detectChanges();
      expect(component.resolvedMinDate).toBeDefined();
    });

    it('should set resolvedMinDate to undefined when value is null', () => {
      fixture.componentRef.setInput('p-min-date', null);
      fixture.detectChanges();
      expect(component.resolvedMinDate).toBeUndefined();
    });
  });

  describe('p-max-date effect:', () => {
    it('should set resolvedMaxDate from Date object', () => {
      fixture.componentRef.setInput('p-max-date', new Date(2026, 11, 31));
      fixture.detectChanges();
      expect(component.resolvedMaxDate).toBeDefined();
      expect(component.resolvedMaxDate.getFullYear()).toBe(2026);
      expect(component.resolvedMaxDate.getHours()).toBe(23);
    });

    it('should set resolvedMaxDate from ISO string', () => {
      fixture.componentRef.setInput('p-max-date', '2026-12-31');
      fixture.detectChanges();
      expect(component.resolvedMaxDate).toBeDefined();
    });

    it('should set resolvedMaxDate to undefined when value is null', () => {
      fixture.componentRef.setInput('p-max-date', null);
      fixture.detectChanges();
      expect(component.resolvedMaxDate).toBeUndefined();
    });
  });
});
