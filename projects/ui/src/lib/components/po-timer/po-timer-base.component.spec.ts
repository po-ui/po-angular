import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoThemeA11yEnum } from '../../services';

describe('PoTimerBaseComponent:', () => {
  let component: PoTimerBaseComponent;
  let languageService: PoLanguageService;

  beforeEach(() => {
    languageService = new PoLanguageService();
    component = new PoTimerBaseComponent(languageService);
  });

  describe('Properties:', () => {
    describe('p-format', () => {
      it('should default to 24', () => {
        expect(component.format).toBe('24');
      });

      it('should accept "12" and build 12h hours', () => {
        component.format = '12';
        expect(component.format).toBe('12');
        expect(component.hours).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      });

      it('should fallback to "24" for invalid values', () => {
        component.format = 'invalid' as any;
        expect(component.format).toBe('24');
      });

      it('should build 24h hours array (0-23)', () => {
        component.format = '24';
        expect(component.hours.length).toBe(24);
        expect(component.hours[0]).toBe(0);
        expect(component.hours[23]).toBe(23);
      });
    });

    describe('p-interval', () => {
      it('should default to 5', () => {
        expect(component.interval).toBe(5);
      });

      it('should accept valid values', () => {
        component.interval = 10;
        expect(component.interval).toBe(10);
        expect(component.minutes).toEqual([0, 10, 20, 30, 40, 50]);
      });

      it('should fallback to 5 for invalid values', () => {
        component.interval = 0;
        expect(component.interval).toBe(5);

        component.interval = -1;
        expect(component.interval).toBe(5);

        component.interval = 61;
        expect(component.interval).toBe(5);
      });

      it('should accept interval of 15', () => {
        component.interval = 15;
        expect(component.minutes).toEqual([0, 15, 30, 45]);
      });

      it('should accept interval of 30', () => {
        component.interval = 30;
        expect(component.minutes).toEqual([0, 30]);
      });
    });

    describe('p-show-seconds', () => {
      it('should default to false', () => {
        expect(component.showSeconds).toBe(false);
        expect(component.seconds).toEqual([]);
      });

      it('should build seconds array when enabled', () => {
        component.showSeconds = true;
        expect(component.showSeconds).toBe(true);
        expect(component.seconds.length).toBeGreaterThan(0);
        expect(component.seconds[0]).toBe(0);
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

      it('should handle invalid size values', () => {
        component.size = 'invalid-size';
        expect(component.size).toBe(getDefaultSizeFn(PoFieldSize));
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

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.size = 'small';
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
    describe('selectHour', () => {
      it('should select a valid hour', () => {
        component.selectHour(10);
        expect(component.selectedHour).toBe(10);
      });

      it('should not select a disabled hour', () => {
        component.minTime = '10:00';
        component.selectHour(5);
        expect(component.selectedHour).toBeNull();
      });

      it('should emit change event', () => {
        spyOn(component.change, 'emit');
        component.selectedMinute = 30;
        component.selectHour(10);
        expect(component.change.emit).toHaveBeenCalledWith('10:30');
      });
    });

    describe('selectMinute', () => {
      it('should select a valid minute', () => {
        component.selectMinute(30);
        expect(component.selectedMinute).toBe(30);
      });

      it('should not select a disabled minute', () => {
        component.minTime = '10:30';
        component.selectedHour = 10;
        component.selectMinute(0);
        expect(component.selectedMinute).toBeNull();
      });
    });

    describe('selectSecond', () => {
      it('should select a valid second', () => {
        component.showSeconds = true;
        component.selectSecond(45);
        expect(component.selectedSecond).toBe(45);
      });
    });

    describe('selectPeriod', () => {
      it('should switch to PM', () => {
        component.selectPeriod('PM');
        expect(component.selectedPeriod).toBe('PM');
      });

      it('should switch to AM', () => {
        component.selectedPeriod = 'PM';
        component.selectPeriod('AM');
        expect(component.selectedPeriod).toBe('AM');
      });
    });

    describe('getFormattedValue', () => {
      it('should return empty string when hour is null', () => {
        expect(component.getFormattedValue()).toBe('');
      });

      it('should return HH:mm format for 24h', () => {
        component.selectedHour = 14;
        component.selectedMinute = 30;
        expect(component.getFormattedValue()).toBe('14:30');
      });

      it('should return HH:mm:ss format when showSeconds is true', () => {
        component.showSeconds = true;
        component.selectedHour = 14;
        component.selectedMinute = 30;
        component.selectedSecond = 45;
        expect(component.getFormattedValue()).toBe('14:30:45');
      });

      it('should convert 12h PM to 24h format', () => {
        component.format = '12';
        component.selectedHour = 2;
        component.selectedMinute = 30;
        component.selectedPeriod = 'PM';
        expect(component.getFormattedValue()).toBe('14:30');
      });

      it('should convert 12h AM 12:xx to 00:xx', () => {
        component.format = '12';
        component.selectedHour = 12;
        component.selectedMinute = 0;
        component.selectedPeriod = 'AM';
        expect(component.getFormattedValue()).toBe('00:00');
      });

      it('should keep 12h PM 12:xx as 12:xx', () => {
        component.format = '12';
        component.selectedHour = 12;
        component.selectedMinute = 0;
        component.selectedPeriod = 'PM';
        expect(component.getFormattedValue()).toBe('12:00');
      });
    });

    describe('setValueFromString', () => {
      it('should parse HH:mm string', () => {
        component.setValueFromString('14:30');
        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
      });

      it('should parse HH:mm:ss string', () => {
        component.showSeconds = true;
        component.setValueFromString('14:30:45');
        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
        expect(component.selectedSecond).toBe(45);
      });

      it('should clear values for empty string', () => {
        component.selectedHour = 10;
        component.setValueFromString('');
        expect(component.selectedHour).toBeNull();
        expect(component.selectedMinute).toBeNull();
        expect(component.selectedSecond).toBeNull();
      });

      it('should set AM/PM for 12h format', () => {
        component.format = '12';
        component.setValueFromString('14:30');
        expect(component.selectedPeriod).toBe('PM');
        expect(component.selectedHour).toBe(2);
      });

      it('should set AM for morning hours in 12h format', () => {
        component.format = '12';
        component.setValueFromString('09:00');
        expect(component.selectedPeriod).toBe('AM');
        expect(component.selectedHour).toBe(9);
      });

      it('should convert 0 hour to 12 in 12h format', () => {
        component.format = '12';
        component.setValueFromString('00:30');
        expect(component.selectedPeriod).toBe('AM');
        expect(component.selectedHour).toBe(12);
      });

      it('should ignore invalid string', () => {
        component.setValueFromString('invalid');
        expect(component.selectedHour).toBeNull();
      });
    });

    describe('isHourDisabled', () => {
      it('should return false when no min/max', () => {
        expect(component.isHourDisabled(10)).toBe(false);
      });

      it('should return true when hour is before minTime', () => {
        component.minTime = '10:00';
        expect(component.isHourDisabled(5)).toBe(true);
      });

      it('should return false when hour equals minTime hour', () => {
        component.minTime = '10:00';
        expect(component.isHourDisabled(10)).toBe(false);
      });

      it('should return true when hour is after maxTime', () => {
        component.maxTime = '18:00';
        expect(component.isHourDisabled(20)).toBe(true);
      });
    });

    describe('isMinuteDisabled', () => {
      it('should return false when no hour selected', () => {
        expect(component.isMinuteDisabled(30)).toBe(false);
      });

      it('should return true when time is before minTime', () => {
        component.minTime = '10:30';
        component.selectedHour = 10;
        expect(component.isMinuteDisabled(0)).toBe(true);
      });
    });

    describe('isSecondDisabled', () => {
      it('should return false when no hour or minute selected', () => {
        expect(component.isSecondDisabled(30)).toBe(false);
      });

      it('should return true when time is before minTime', () => {
        component.minTime = '10:30:30';
        component.selectedHour = 10;
        component.selectedMinute = 30;
        expect(component.isSecondDisabled(0)).toBe(true);
      });
    });

    describe('isTimeDisabled', () => {
      it('should return false when no min/max', () => {
        expect(component.isTimeDisabled(10, 30)).toBe(false);
      });

      it('should return true when time is before minTime', () => {
        component.minTime = '10:30';
        expect(component.isTimeDisabled(10, 0)).toBe(true);
      });

      it('should return true when time is after maxTime', () => {
        component.maxTime = '18:00';
        expect(component.isTimeDisabled(20, 0)).toBe(true);
      });

      it('should return false when time is within range', () => {
        component.minTime = '08:00';
        component.maxTime = '18:00';
        expect(component.isTimeDisabled(12, 0)).toBe(false);
      });
    });
  });
});
