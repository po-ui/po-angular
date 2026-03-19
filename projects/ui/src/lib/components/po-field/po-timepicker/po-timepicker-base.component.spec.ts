import { PoTimepickerBaseComponent } from './po-timepicker-base.component';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { ChangeDetectorRef } from '@angular/core';
import { getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeA11yEnum } from '../../../services';
import { AbstractControl } from '@angular/forms';

class TestTimepickerComponent extends PoTimepickerBaseComponent {
  writeValue(value: any): void {}
}

describe('PoTimepickerBaseComponent:', () => {
  let component: TestTimepickerComponent;
  let languageService: PoLanguageService;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    languageService = new PoLanguageService();
    cd = { detectChanges: jasmine.createSpy('detectChanges') } as any;
    component = new TestTimepickerComponent(languageService, cd);
  });

  describe('Properties:', () => {
    describe('p-format', () => {
      it('should default to 24', () => {
        expect(component.format).toBe('24');
      });

      it('should accept "12"', () => {
        component.format = '12';
        expect(component.format).toBe('12');
      });

      it('should fallback to "24" for invalid values', () => {
        component.format = 'invalid' as any;
        expect(component.format).toBe('24');
      });
    });

    describe('p-interval', () => {
      it('should default to 5', () => {
        expect(component.interval).toBe(5);
      });

      it('should accept valid values', () => {
        component.interval = 15;
        expect(component.interval).toBe(15);
      });

      it('should fallback to 5 for invalid values', () => {
        component.interval = 0;
        expect(component.interval).toBe(5);

        component.interval = -1;
        expect(component.interval).toBe(5);

        component.interval = 61;
        expect(component.interval).toBe(5);
      });
    });

    describe('p-show-seconds', () => {
      it('should default to false', () => {
        expect(component.showSeconds).toBe(false);
      });

      it('should accept true', () => {
        component.showSeconds = true;
        expect(component.showSeconds).toBe(true);
      });
    });

    describe('p-placeholder', () => {
      it('should return default placeholder "hh:mm"', () => {
        expect(component.placeholder).toBe('hh:mm');
      });

      it('should return "hh:mm:ss" when showSeconds is true', () => {
        component.showSeconds = true;
        expect(component.placeholder).toBe('hh:mm:ss');
      });

      it('should accept custom placeholder', () => {
        component.placeholder = 'Selecione';
        expect(component.placeholder).toBe('Selecione');
      });
    });

    describe('p-no-autocomplete', () => {
      it('should default to false', () => {
        expect(component.noAutocomplete).toBe(false);
      });

      it('should return "off" when noAutocomplete is true', () => {
        component.noAutocomplete = true;
        expect(component.autocomplete).toBe('off');
      });

      it('should return "on" when noAutocomplete is false', () => {
        expect(component.autocomplete).toBe('on');
      });
    });

    describe('p-disabled', () => {
      it('should default to false', () => {
        expect(component.disabled).toBe(false);
      });
    });

    describe('p-readonly', () => {
      it('should default to false', () => {
        expect(component.readonly).toBe(false);
      });
    });

    describe('p-required', () => {
      it('should default to false', () => {
        expect(component.required).toBe(false);
      });
    });

    describe('p-clean', () => {
      it('should default to true', () => {
        expect(component.clean).toBe(true);
      });
    });

    describe('p-loading', () => {
      it('should default to false', () => {
        expect(component.loading).toBe(false);
      });

      it('isDisabled should be true when loading is true', () => {
        component.loading = true;
        expect(component.isDisabled).toBe(true);
      });
    });

    describe('p-min-time', () => {
      it('should accept valid time string', () => {
        component.minTime = '08:00';
        expect(component.minTime).toBe('08:00');
      });
    });

    describe('p-max-time', () => {
      it('should accept valid time string', () => {
        component.maxTime = '18:00';
        expect(component.maxTime).toBe('18:00');
      });
    });

    describe('p-size', () => {
      it('should return default size when _size is undefined', () => {
        component['_size'] = undefined;
        expect(component.size).toBe(getDefaultSizeFn(PoFieldSize));
      });

      it('should accept valid values', () => {
        const validSizes = Object.values(PoFieldSize);
        validSizes.forEach(size => {
          component.size = size;
          expect(component.size).toBe(validateSizeFn(size, PoFieldSize));
        });
      });

      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set property with valid values for accessibility level AA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');
      });

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        spyOn<any>(component, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });
  });

  describe('Methods:', () => {
    describe('isValidTime', () => {
      it('should return true for valid HH:mm', () => {
        expect(component.isValidTime('14:30')).toBe(true);
      });

      it('should return true for valid HH:mm:ss', () => {
        component.showSeconds = true;
        expect(component.isValidTime('14:30:45')).toBe(true);
      });

      it('should return false for invalid time', () => {
        expect(component.isValidTime('25:00')).toBe(false);
      });

      it('should return true for empty value', () => {
        expect(component.isValidTime('')).toBe(true);
      });

      it('should return true for null value', () => {
        expect(component.isValidTime(null)).toBe(true);
      });
    });

    describe('callOnChange', () => {
      it('should call onChangeModel when set', () => {
        const fn = jasmine.createSpy('onChange');
        component.registerOnChange(fn);
        component.callOnChange('14:30');
        expect(fn).toHaveBeenCalledWith('14:30');
      });

      it('should not call onChangeModel when emitModelChange is false', () => {
        const fn = jasmine.createSpy('onChange');
        component.registerOnChange(fn);
        component.callOnChange('14:30', false);
        expect(fn).not.toHaveBeenCalled();
      });
    });

    describe('registerOnChange', () => {
      it('should register the callback', () => {
        const fn = () => {};
        component.registerOnChange(fn);
        expect(component['onChangeModel']).toBe(fn);
      });
    });

    describe('registerOnTouched', () => {
      it('should register the callback', () => {
        const fn = () => {};
        component.registerOnTouched(fn);
        expect(component['onTouchedModel']).toBe(fn);
      });
    });

    describe('validate', () => {
      it('should return required error when field is required and empty', () => {
        component.required = true;
        const control = { value: '' } as AbstractControl;
        expect(component.validate(control)).toEqual({ required: { valid: false } });
      });

      it('should return time error for invalid time', () => {
        const control = { value: '25:00' } as AbstractControl;
        expect(component.validate(control)).toEqual({ time: { valid: false } });
      });

      it('should return null for valid time', () => {
        const control = { value: '14:30' } as AbstractControl;
        expect(component.validate(control)).toBeNull();
      });

      it('should return null for empty value when not required', () => {
        const control = { value: '' } as AbstractControl;
        expect(component.validate(control)).toBeNull();
      });
    });

    describe('setDisabledState', () => {
      it('should set disabled and call detectChanges', () => {
        component.setDisabledState(true);
        expect(component.disabled).toBe(true);
        expect(cd.detectChanges).toHaveBeenCalled();
      });
    });

    describe('mapSizeToIcon', () => {
      it('should return "small" for small size', () => {
        expect(component.mapSizeToIcon(PoFieldSize.Small)).toBe('small');
      });

      it('should return "medium" for medium size', () => {
        expect(component.mapSizeToIcon(PoFieldSize.Medium)).toBe('medium');
      });
    });

    describe('formatInputValue', () => {
      it('should return empty for empty input', () => {
        expect(component.formatInputValue('')).toBe('');
      });

      it('should strip non-numeric non-colon characters', () => {
        expect(component.formatInputValue('12:3a0')).toBe('12:30');
      });
    });
  });
});
