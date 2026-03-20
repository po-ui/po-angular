import { PoLanguageService } from '../../services/po-language/po-language.service';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';

import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoTimerFormat } from './enums/po-timer-format.enum';

describe('PoTimerBaseComponent:', () => {
  let component: PoTimerBaseComponent;
  let languageService: PoLanguageService;

  beforeEach(() => {
    languageService = new PoLanguageService();
    component = new PoTimerBaseComponent(languageService);
    Object.defineProperty(component, 'shortLanguage', { value: 'pt', writable: true });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-format:', () => {
      it('should set format to Format24 by default', () => {
        expect(component.format).toBe(PoTimerFormat.Format24);
      });

      it('should set format to Format12 when valid value is provided', () => {
        component.format = PoTimerFormat.Format12;
        expect(component.format).toBe(PoTimerFormat.Format12);
      });

      it('should set format to Format24 when valid value is provided', () => {
        component.format = PoTimerFormat.Format24;
        expect(component.format).toBe(PoTimerFormat.Format24);
      });

      it('should set format to Format24 when invalid value is provided', () => {
        component.format = 'invalid' as PoTimerFormat;
        expect(component.format).toBe(PoTimerFormat.Format24);
      });

      it('should call generateHours when format is set', () => {
        spyOn(component as any, 'generateHours');
        component.format = PoTimerFormat.Format12;
        expect(component['generateHours']).toHaveBeenCalled();
      });
    });

    describe('p-locale:', () => {
      it('should update with valid locale values', () => {
        const validValues = ['pt', 'es', 'en', 'ru'];
        validValues.forEach(locale => {
          component.locale = locale;
          expect(component.locale).toBe(locale);
        });
      });

      it('should fallback to shortLanguage when invalid locale is provided', () => {
        component.locale = 'invalid';
        expect(component.locale).toBe('pt');
      });
    });

    describe('p-max-time:', () => {
      it('should set maxTime with valid time string HH:mm', () => {
        component.maxTime = '23:59';
        expect(component.maxTime).toBe('23:59');
      });

      it('should set maxTime with valid time string HH:mm:ss', () => {
        component.maxTime = '23:59:59';
        expect(component.maxTime).toBe('23:59:59');
      });

      it('should set maxTime to undefined when invalid value is provided', () => {
        component.maxTime = 'invalid';
        expect(component.maxTime).toBeUndefined();
      });

      it('should set maxTime to undefined when null is provided', () => {
        component.maxTime = null;
        expect(component.maxTime).toBeUndefined();
      });
    });

    describe('p-min-time:', () => {
      it('should set minTime with valid time string HH:mm', () => {
        component.minTime = '08:00';
        expect(component.minTime).toBe('08:00');
      });

      it('should set minTime with valid time string HH:mm:ss', () => {
        component.minTime = '08:00:00';
        expect(component.minTime).toBe('08:00:00');
      });

      it('should set minTime to undefined when invalid value is provided', () => {
        component.minTime = 'abc';
        expect(component.minTime).toBeUndefined();
      });
    });

    describe('p-minute-interval:', () => {
      it('should default to 5', () => {
        expect(component.minuteInterval).toBe(5);
      });

      it('should set a valid interval', () => {
        component.minuteInterval = 10;
        expect(component.minuteInterval).toBe(10);
      });

      it('should set a valid interval of 1', () => {
        component.minuteInterval = 1;
        expect(component.minuteInterval).toBe(1);
      });

      it('should set a valid interval of 59', () => {
        component.minuteInterval = 59;
        expect(component.minuteInterval).toBe(59);
      });

      it('should fallback to default when 0 is provided', () => {
        component.minuteInterval = 0;
        expect(component.minuteInterval).toBe(5);
      });

      it('should fallback to default when negative value is provided', () => {
        component.minuteInterval = -1;
        expect(component.minuteInterval).toBe(5);
      });

      it('should fallback to default when 60 is provided', () => {
        component.minuteInterval = 60;
        expect(component.minuteInterval).toBe(5);
      });

      it('should call generateMinutes when set', () => {
        spyOn(component as any, 'generateMinutes');
        component.minuteInterval = 15;
        expect(component['generateMinutes']).toHaveBeenCalled();
      });

      it('should parse string values', () => {
        component.minuteInterval = '15' as any;
        expect(component.minuteInterval).toBe(15);
      });
    });

    describe('p-second-interval:', () => {
      it('should default to 15', () => {
        expect(component.secondInterval).toBe(15);
      });

      it('should set a valid interval', () => {
        component.secondInterval = 30;
        expect(component.secondInterval).toBe(30);
      });

      it('should fallback to default when 0 is provided', () => {
        component.secondInterval = 0;
        expect(component.secondInterval).toBe(15);
      });

      it('should fallback to default when negative value is provided', () => {
        component.secondInterval = -5;
        expect(component.secondInterval).toBe(15);
      });

      it('should fallback to default when 60 or more is provided', () => {
        component.secondInterval = 60;
        expect(component.secondInterval).toBe(15);
      });

      it('should call generateSeconds when set', () => {
        spyOn(component as any, 'generateSeconds');
        component.secondInterval = 10;
        expect(component['generateSeconds']).toHaveBeenCalled();
      });
    });

    describe('p-show-seconds:', () => {
      it('should default to false', () => {
        expect(component.showSeconds).toBe(false);
      });

      it('should set to true when true is provided', () => {
        component.showSeconds = true;
        expect(component.showSeconds).toBe(true);
      });

      it('should set to true when string "true" is provided', () => {
        component.showSeconds = 'true' as any;
        expect(component.showSeconds).toBe(true);
      });

      it('should set to true when empty string is provided', () => {
        component.showSeconds = '' as any;
        expect(component.showSeconds).toBe(true);
      });

      it('should set to false when false is provided', () => {
        component.showSeconds = false;
        expect(component.showSeconds).toBe(false);
      });

      it('should call generateSeconds when set', () => {
        spyOn(component as any, 'generateSeconds');
        component.showSeconds = true;
        expect(component['generateSeconds']).toHaveBeenCalled();
      });
    });

    describe('p-size:', () => {
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

      it('should use default when _size is null', () => {
        component['_size'] = null;
        expect(component.size).toBe(getDefaultSizeFn(PoFieldSize));
      });
    });

    describe('selectedHour:', () => {
      it('should default to null', () => {
        expect(component.selectedHour).toBeNull();
      });

      it('should get and set selectedHour', () => {
        component.selectedHour = 10;
        expect(component.selectedHour).toBe(10);
      });
    });

    describe('selectedMinute:', () => {
      it('should default to null', () => {
        expect(component.selectedMinute).toBeNull();
      });

      it('should get and set selectedMinute', () => {
        component.selectedMinute = 30;
        expect(component.selectedMinute).toBe(30);
      });
    });

    describe('selectedSecond:', () => {
      it('should default to null', () => {
        expect(component.selectedSecond).toBeNull();
      });

      it('should get and set selectedSecond', () => {
        component.selectedSecond = 45;
        expect(component.selectedSecond).toBe(45);
      });
    });

    describe('period:', () => {
      it('should default to AM', () => {
        expect(component.period).toBe('AM');
      });

      it('should get and set period', () => {
        component.period = 'PM';
        expect(component.period).toBe('PM');
      });
    });

    describe('is12HourFormat:', () => {
      it('should return false when format is 24h', () => {
        component.format = PoTimerFormat.Format24;
        expect(component.is12HourFormat).toBe(false);
      });

      it('should return true when format is 12h', () => {
        component.format = PoTimerFormat.Format12;
        expect(component.is12HourFormat).toBe(true);
      });
    });
  });

  describe('Methods:', () => {
    describe('generateHours:', () => {
      it('should generate 24 hours (0-23) for 24h format', () => {
        component.format = PoTimerFormat.Format24;
        component['generateHours']();
        expect(component.hours.length).toBe(24);
        expect(component.hours[0]).toBe(0);
        expect(component.hours[23]).toBe(23);
      });

      it('should generate 12 hours (1-12) for 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component['generateHours']();
        expect(component.hours.length).toBe(12);
        expect(component.hours[0]).toBe(1);
        expect(component.hours[11]).toBe(12);
      });
    });

    describe('generateMinutes:', () => {
      it('should generate minutes with default interval of 5', () => {
        component['generateMinutes']();
        expect(component.minutes.length).toBe(12);
        expect(component.minutes[0]).toBe(0);
        expect(component.minutes[1]).toBe(5);
        expect(component.minutes[11]).toBe(55);
      });

      it('should generate minutes with interval of 15', () => {
        component.minuteInterval = 15;
        component['generateMinutes']();
        expect(component.minutes.length).toBe(4);
        expect(component.minutes).toEqual([0, 15, 30, 45]);
      });

      it('should generate minutes with interval of 1', () => {
        component.minuteInterval = 1;
        component['generateMinutes']();
        expect(component.minutes.length).toBe(60);
      });
    });

    describe('generateSeconds:', () => {
      it('should generate empty array when showSeconds is false', () => {
        component.showSeconds = false;
        component['generateSeconds']();
        expect(component.seconds.length).toBe(0);
      });

      it('should generate seconds with default interval of 15 when showSeconds is true', () => {
        component.showSeconds = true;
        component['generateSeconds']();
        expect(component.seconds).toEqual([0, 15, 30, 45]);
      });

      it('should generate seconds with interval of 30 when showSeconds is true', () => {
        component.showSeconds = true;
        component.secondInterval = 30;
        component['generateSeconds']();
        expect(component.seconds).toEqual([0, 30]);
      });
    });

    describe('formatValue:', () => {
      it('should format single digit with leading zero', () => {
        expect(component['formatValue'](0)).toBe('00');
        expect(component['formatValue'](5)).toBe('05');
        expect(component['formatValue'](9)).toBe('09');
      });

      it('should format double digit without leading zero', () => {
        expect(component['formatValue'](10)).toBe('10');
        expect(component['formatValue'](23)).toBe('23');
        expect(component['formatValue'](59)).toBe('59');
      });

      it('should return -- when value is null', () => {
        expect(component['formatValue'](null)).toBe('--');
      });

      it('should return -- when value is undefined', () => {
        expect(component['formatValue'](undefined)).toBe('--');
      });
    });

    describe('isHourDisabled:', () => {
      it('should return false when no min/max is set', () => {
        expect(component['isHourDisabled'](10)).toBe(false);
      });

      it('should return true when hour is before minTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        expect(component['isHourDisabled'](5)).toBe(true);
      });

      it('should return false when hour equals minTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        expect(component['isHourDisabled'](8)).toBe(false);
      });

      it('should return false when hour is after minTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        expect(component['isHourDisabled'](10)).toBe(false);
      });

      it('should return true when hour is after maxTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:00';
        expect(component['isHourDisabled'](20)).toBe(true);
      });

      it('should return false when hour equals maxTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:00';
        expect(component['isHourDisabled'](18)).toBe(false);
      });

      it('should return false when hour is before maxTime hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:00';
        expect(component['isHourDisabled'](10)).toBe(false);
      });

      it('should handle 12h format with AM period', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'AM';
        component.minTime = '08:00';
        expect(component['isHourDisabled'](5)).toBe(true);
        expect(component['isHourDisabled'](10)).toBe(false);
      });

      it('should handle 12h format with PM period', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'PM';
        component.maxTime = '18:00';
        expect(component['isHourDisabled'](8)).toBe(true);
        expect(component['isHourDisabled'](5)).toBe(false);
      });

      it('should handle both min and max time', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        component.maxTime = '18:00';
        expect(component['isHourDisabled'](5)).toBe(true);
        expect(component['isHourDisabled'](10)).toBe(false);
        expect(component['isHourDisabled'](20)).toBe(true);
      });
    });

    describe('isMinuteDisabled:', () => {
      it('should return false when no min/max is set', () => {
        expect(component['isMinuteDisabled'](30)).toBe(false);
      });

      it('should return false when selectedHour is null', () => {
        component.minTime = '08:30';
        component.selectedHour = null;
        expect(component['isMinuteDisabled'](15)).toBe(false);
      });

      it('should return true when minute is before minTime minute on same hour (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = 8;
        expect(component['isMinuteDisabled'](15)).toBe(true);
      });

      it('should return false when minute equals minTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = 8;
        expect(component['isMinuteDisabled'](30)).toBe(false);
      });

      it('should return false when minute is after minTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = 8;
        expect(component['isMinuteDisabled'](45)).toBe(false);
      });

      it('should return false when selectedHour is after minTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = 10;
        expect(component['isMinuteDisabled'](0)).toBe(false);
      });

      it('should return true when minute is after maxTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30';
        component.selectedHour = 18;
        expect(component['isMinuteDisabled'](45)).toBe(true);
      });

      it('should return false when minute equals maxTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30';
        component.selectedHour = 18;
        expect(component['isMinuteDisabled'](30)).toBe(false);
      });

      it('should return false when selectedHour is before maxTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30';
        component.selectedHour = 10;
        expect(component['isMinuteDisabled'](45)).toBe(false);
      });
    });

    describe('isSecondDisabled:', () => {
      it('should return false when no min/max is set', () => {
        expect(component['isSecondDisabled'](30)).toBe(false);
      });

      it('should return false when selectedHour is null', () => {
        component.minTime = '08:30:15';
        component.selectedHour = null;
        expect(component['isSecondDisabled'](0)).toBe(false);
      });

      it('should return false when selectedMinute is null', () => {
        component.minTime = '08:30:15';
        component.selectedHour = 8;
        component.selectedMinute = null;
        expect(component['isSecondDisabled'](0)).toBe(false);
      });

      it('should return true when second is before minTime second on same hour and minute (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](15)).toBe(true);
      });

      it('should return false when second equals minTime second on same hour and minute', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](30)).toBe(false);
      });

      it('should return false when second is after minTime second on same hour and minute', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](45)).toBe(false);
      });

      it('should return true when second is after maxTime second on same hour and minute (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';
        component.selectedHour = 18;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](45)).toBe(true);
      });

      it('should return false when second equals maxTime second on same hour and minute', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';
        component.selectedHour = 18;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](30)).toBe(false);
      });

      it('should return false when selectedHour and selectedMinute do not match boundary', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';
        component.selectedHour = 10;
        component.selectedMinute = 30;
        expect(component['isSecondDisabled'](0)).toBe(false);
      });
    });

    describe('buildTimeValue:', () => {
      it('should return empty string when selectedHour is null', () => {
        component.selectedHour = null;
        component.selectedMinute = 30;
        expect(component['buildTimeValue']()).toBe('');
      });

      it('should return empty string when selectedMinute is null', () => {
        component.selectedHour = 10;
        component.selectedMinute = null;
        expect(component['buildTimeValue']()).toBe('');
      });

      it('should return HH:mm when showSeconds is false (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.selectedHour = 14;
        component.selectedMinute = 30;
        expect(component['buildTimeValue']()).toBe('14:30');
      });

      it('should return HH:mm:ss when showSeconds is true and selectedSecond is set (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.selectedHour = 14;
        component.selectedMinute = 30;
        component.selectedSecond = 45;
        expect(component['buildTimeValue']()).toBe('14:30:45');
      });

      it('should return HH:mm when showSeconds is true but selectedSecond is null', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.selectedHour = 14;
        component.selectedMinute = 30;
        component.selectedSecond = null;
        expect(component['buildTimeValue']()).toBe('14:30');
      });

      it('should convert 12h AM to 24h for output', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'AM';
        component.selectedHour = 10;
        component.selectedMinute = 30;
        expect(component['buildTimeValue']()).toBe('10:30');
      });

      it('should convert 12h PM to 24h for output', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'PM';
        component.selectedHour = 2;
        component.selectedMinute = 30;
        expect(component['buildTimeValue']()).toBe('14:30');
      });

      it('should convert 12 AM to 00 for output', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'AM';
        component.selectedHour = 12;
        component.selectedMinute = 0;
        expect(component['buildTimeValue']()).toBe('00:00');
      });

      it('should convert 12 PM to 12 for output', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'PM';
        component.selectedHour = 12;
        component.selectedMinute = 0;
        expect(component['buildTimeValue']()).toBe('12:00');
      });

      it('should format single digits with leading zeros', () => {
        component.format = PoTimerFormat.Format24;
        component.selectedHour = 5;
        component.selectedMinute = 3;
        expect(component['buildTimeValue']()).toBe('05:03');
      });
    });

    describe('setTimeFromString:', () => {
      it('should set selectedHour and selectedMinute from HH:mm string (24h)', () => {
        component.format = PoTimerFormat.Format24;
        component.setTimeFromString('14:30');
        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
      });

      it('should keep selectedSecond as null when showSeconds is true and input is HH:mm', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.setTimeFromString('14:30');

        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
        expect(component.selectedSecond).toBeNull();
      });

      it('should set selectedHour, selectedMinute, and selectedSecond from HH:mm:ss string', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.setTimeFromString('14:30:45');
        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
        expect(component.selectedSecond).toBe(45);
      });

      it('should clear selection when null is provided', () => {
        component.selectedHour = 10;
        component.selectedMinute = 30;
        component.selectedSecond = 15;
        component.setTimeFromString(null);
        expect(component.selectedHour).toBeNull();
        expect(component.selectedMinute).toBeNull();
        expect(component.selectedSecond).toBeNull();
      });

      it('should clear selection when empty string is provided', () => {
        component.selectedHour = 10;
        component.selectedMinute = 30;
        component.setTimeFromString('');
        expect(component.selectedHour).toBeNull();
        expect(component.selectedMinute).toBeNull();
        expect(component.selectedSecond).toBeNull();
      });

      it('should convert to 12h format and set AM for hours 1-11', () => {
        component.format = PoTimerFormat.Format12;
        component.setTimeFromString('10:30');
        expect(component.selectedHour).toBe(10);
        expect(component.period).toBe('AM');
      });

      it('should convert hour 0 to 12 AM in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.setTimeFromString('00:30');
        expect(component.selectedHour).toBe(12);
        expect(component.period).toBe('AM');
      });

      it('should set PM for hour 12 in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.setTimeFromString('12:30');
        expect(component.selectedHour).toBe(12);
        expect(component.period).toBe('PM');
      });

      it('should convert hours 13-23 to 1-11 PM in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.setTimeFromString('15:30');
        expect(component.selectedHour).toBe(3);
        expect(component.period).toBe('PM');
      });

      it('should not set seconds when showSeconds is false', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = false;
        component.setTimeFromString('14:30:45');
        expect(component.selectedSecond).toBeNull();
      });

      it('should handle string with only one part gracefully', () => {
        component.setTimeFromString('14');
        expect(component.selectedHour).toBeNull();
      });
    });

    describe('convertTo24Hour:', () => {
      it('should return hour unchanged in 24h format', () => {
        component.format = PoTimerFormat.Format24;
        expect(component['convertTo24Hour'](14)).toBe(14);
      });

      it('should convert 12 AM to 0 in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'AM';
        expect(component['convertTo24Hour'](12)).toBe(0);
      });

      it('should keep AM hours 1-11 unchanged in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'AM';
        expect(component['convertTo24Hour'](5)).toBe(5);
      });

      it('should keep 12 PM as 12 in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'PM';
        expect(component['convertTo24Hour'](12)).toBe(12);
      });

      it('should add 12 to PM hours 1-11 in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.period = 'PM';
        expect(component['convertTo24Hour'](3)).toBe(15);
      });
    });

    describe('parseTimeComponent:', () => {
      it('should parse hour component', () => {
        expect(component['parseTimeComponent']('14:30:45', 'hour')).toBe(14);
      });

      it('should parse minute component', () => {
        expect(component['parseTimeComponent']('14:30:45', 'minute')).toBe(30);
      });

      it('should parse second component', () => {
        expect(component['parseTimeComponent']('14:30:45', 'second')).toBe(45);
      });

      it('should return 0 for missing minute in single-part string', () => {
        expect(component['parseTimeComponent']('14', 'minute')).toBe(0);
      });

      it('should return 0 for missing second in HH:mm string', () => {
        expect(component['parseTimeComponent']('14:30', 'second')).toBe(0);
      });

      it('should return 0 for null time', () => {
        expect(component['parseTimeComponent'](null, 'hour')).toBe(0);
      });

      it('should return 0 for empty string', () => {
        expect(component['parseTimeComponent']('', 'hour')).toBe(0);
      });

      it('should return 0 for default case', () => {
        expect(component['parseTimeComponent']('14:30:45', 'invalid' as any)).toBe(0);
      });

      it('should return 0 when hour part is NaN', () => {
        expect(component['parseTimeComponent']('abc:30:45', 'hour')).toBe(0);
      });

      it('should return 0 when second part is NaN', () => {
        expect(component['parseTimeComponent']('14:30:abc', 'second')).toBe(0);
      });
    });

    describe('isValidTimeString:', () => {
      it('should return true for HH:mm format', () => {
        expect(component['isValidTimeString']('14:30')).toBe(true);
      });

      it('should return true for HH:mm:ss format', () => {
        expect(component['isValidTimeString']('14:30:45')).toBe(true);
      });

      it('should return false for invalid string', () => {
        expect(component['isValidTimeString']('invalid')).toBe(false);
      });

      it('should return false for null', () => {
        expect(component['isValidTimeString'](null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(component['isValidTimeString'](undefined)).toBe(false);
      });

      it('should return false for number', () => {
        expect(component['isValidTimeString'](123 as any)).toBe(false);
      });

      it('should return false for single digit format', () => {
        expect(component['isValidTimeString']('1:30')).toBe(false);
      });
    });

    describe('setLiterals:', () => {
      it('should set literals based on locale', () => {
        component.locale = 'pt';
        expect(component.literals.hours).toBe('Horas');
        expect(component.literals.minutes).toBe('Minutos');
        expect(component.literals.seconds).toBe('Segundos');
      });

      it('should set English literals for en locale', () => {
        component.locale = 'en';
        expect(component.literals.hours).toBe('Hours');
        expect(component.literals.minutes).toBe('Minutes');
        expect(component.literals.seconds).toBe('Seconds');
      });

      it('should set Spanish literals for es locale', () => {
        component.locale = 'es';
        expect(component.literals.hours).toBe('Horas');
        expect(component.literals.minutes).toBe('Minutos');
        expect(component.literals.seconds).toBe('Segundos');
      });

      it('should set Russian literals for ru locale', () => {
        component.locale = 'ru';
        expect(component.literals.hours).toBe('Часы');
        expect(component.literals.minutes).toBe('Минуты');
        expect(component.literals.seconds).toBe('Секунды');
      });
    });

    describe('writeValue:', () => {
      it('should call setTimeFromString with the provided value', () => {
        spyOn(component, 'setTimeFromString');
        component.writeValue('14:30');
        expect(component.setTimeFromString).toHaveBeenCalledWith('14:30');
      });

      it('should handle null value', () => {
        spyOn(component, 'setTimeFromString');
        component.writeValue(null);
        expect(component.setTimeFromString).toHaveBeenCalledWith(null);
      });

      it('should handle undefined value', () => {
        spyOn(component, 'setTimeFromString');
        component.writeValue(undefined);
        expect(component.setTimeFromString).toHaveBeenCalledWith(undefined);
      });
    });

    describe('registerOnChange:', () => {
      it('should register the onChange function', () => {
        const fn = jasmine.createSpy('onChange');
        component.registerOnChange(fn);
        expect(component['onChangePropagate']).toBe(fn);
      });
    });

    describe('registerOnTouched:', () => {
      it('should register the onTouched function', () => {
        const fn = jasmine.createSpy('onTouched');
        component.registerOnTouched(fn);
        expect(component['onTouched']).toBe(fn);
      });
    });

    describe('setDisabledState:', () => {
      it('should not throw when called', () => {
        expect(() => component.setDisabledState(true)).not.toThrow();
        expect(() => component.setDisabledState(false)).not.toThrow();
      });
    });

    describe('emitChange:', () => {
      it('should emit change and call updateModel when value is valid', () => {
        component.selectedHour = 14;
        component.selectedMinute = 30;
        spyOn(component.change, 'emit');
        const fn = jasmine.createSpy('onChange');
        component.registerOnChange(fn);

        component['emitChange']();

        expect(component.change.emit).toHaveBeenCalledWith('14:30');
        expect(fn).toHaveBeenCalledWith('14:30');
      });

      it('should not emit when selectedHour is null', () => {
        component.selectedHour = null;
        component.selectedMinute = 30;
        spyOn(component.change, 'emit');

        component['emitChange']();

        expect(component.change.emit).not.toHaveBeenCalled();
      });

      it('should not emit when selectedMinute is null', () => {
        component.selectedHour = 14;
        component.selectedMinute = null;
        spyOn(component.change, 'emit');

        component['emitChange']();

        expect(component.change.emit).not.toHaveBeenCalled();
      });

      it('should not call onChangePropagate when it is null', () => {
        component.selectedHour = 14;
        component.selectedMinute = 30;
        component['onChangePropagate'] = null;
        spyOn(component.change, 'emit');

        expect(() => component['emitChange']()).not.toThrow();
        expect(component.change.emit).toHaveBeenCalledWith('14:30');
      });
    });

    describe('callOnTouched:', () => {
      it('should call onTouched when registered', () => {
        const fn = jasmine.createSpy('onTouched');
        component.registerOnTouched(fn);

        component['callOnTouched']();

        expect(fn).toHaveBeenCalled();
      });

      it('should not throw when onTouched is null', () => {
        component['onTouched'] = null;
        expect(() => component['callOnTouched']()).not.toThrow();
      });
    });

    describe('onThemeChange:', () => {
      it('should call applySizeBasedOnA11y', () => {
        spyOn(component as any, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect(component['applySizeBasedOnA11y']).toHaveBeenCalled();
      });
    });

    describe('value (getter/setter):', () => {
      it('should set value via writeValue', () => {
        spyOn(component, 'writeValue');
        component.value = '14:30';
        expect(component.writeValue).toHaveBeenCalledWith('14:30');
      });

      it('should return buildTimeValue result', () => {
        component.selectedHour = 14;
        component.selectedMinute = 30;
        expect(component.value).toBe('14:30');
      });

      it('should return empty string when no selection', () => {
        expect(component.value).toBe('');
      });
    });

    describe('convertTo12HourDisplay (private):', () => {
      it('should convert 0 to 12 AM', () => {
        expect(component['convertTo12HourDisplay'](0)).toEqual({ hour: 12, period: 'AM' });
      });

      it('should convert 12 to 12 PM', () => {
        expect(component['convertTo12HourDisplay'](12)).toEqual({ hour: 12, period: 'PM' });
      });

      it('should convert 13 to 1 PM', () => {
        expect(component['convertTo12HourDisplay'](13)).toEqual({ hour: 1, period: 'PM' });
      });

      it('should convert 23 to 11 PM', () => {
        expect(component['convertTo12HourDisplay'](23)).toEqual({ hour: 11, period: 'PM' });
      });

      it('should keep 1-11 as AM', () => {
        expect(component['convertTo12HourDisplay'](5)).toEqual({ hour: 5, period: 'AM' });
        expect(component['convertTo12HourDisplay'](11)).toEqual({ hour: 11, period: 'AM' });
      });
    });

    describe('isMinuteDisabled - branch for hours scanning:', () => {
      it('should check all hours when selectedHour is null with minTime', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = null;
        component['generateHours']();
        component['generateMinutes']();

        expect(component['isMinuteDisabled'](0)).toBe(false);
        expect(component['isMinuteDisabled'](30)).toBe(false);
      });

      it('should return false when hours array is empty and selectedHour is null', () => {
        component.minTime = '08:30';
        component.selectedHour = null;
        component.hours = [];

        expect(component['isMinuteDisabled'](15)).toBe(false);
      });
    });

    describe('isSecondDisabled - branch for selectedHour only:', () => {
      it('should check minutes when selectedHour is set but selectedMinute is null', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = null;
        component['generateMinutes']();
        component['generateSeconds']();

        expect(component['isSecondDisabled'](0)).toBe(false);
      });

      it('should return false when minutes array is empty and selectedHour is set', () => {
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = null;
        component.minutes = [];

        expect(component['isSecondDisabled'](0)).toBe(false);
      });

      it('should check hours when no hour or minute is selected', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minuteInterval = 1;
        component.minTime = '08:30:30';
        component.selectedHour = null;
        component.selectedMinute = null;
        component['generateHours']();
        component['generateMinutes']();
        component['generateSeconds']();

        expect(component['isSecondDisabled'](0)).toBe(false);
      });

      it('should return false when hours array is empty and no selection', () => {
        component.minTime = '08:30:30';
        component.selectedHour = null;
        component.selectedMinute = null;
        component.hours = [];

        expect(component['isSecondDisabled'](0)).toBe(false);
      });
    });

    describe('isSecondAllowed - maxTime edge cases:', () => {
      it('should return false when hour exceeds maxTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';

        expect(component['isSecondAllowed'](20, 0, 0)).toBe(false);
      });

      it('should return false when minute exceeds maxTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';

        expect(component['isSecondAllowed'](18, 45, 0)).toBe(false);
      });

      it('should return false when second exceeds maxTime second on same hour and minute', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';

        expect(component['isSecondAllowed'](18, 30, 45)).toBe(false);
      });

      it('should return true when within maxTime limits', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30:30';

        expect(component['isSecondAllowed'](18, 30, 15)).toBe(true);
      });
    });

    describe('isMinuteAllowedForHour - edge cases:', () => {
      it('should return false when hour is less than minTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';

        expect(component['isMinuteAllowedForHour'](5, 30)).toBe(false);
      });

      it('should return false when hour exceeds maxTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.maxTime = '18:30';

        expect(component['isMinuteAllowedForHour'](20, 0)).toBe(false);
      });

      it('should return true when no min/max is set', () => {
        component.format = PoTimerFormat.Format24;

        expect(component['isMinuteAllowedForHour'](10, 30)).toBe(true);
      });
    });

    describe('isSecondAllowed - minTime edge cases:', () => {
      it('should return false when hour is less than minTime hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';

        expect(component['isSecondAllowed'](5, 0, 0)).toBe(false);
      });

      it('should return false when minute is less than minTime minute on same hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30:30';

        expect(component['isSecondAllowed'](8, 15, 0)).toBe(false);
      });

      it('should return true when no min/max is set', () => {
        component.format = PoTimerFormat.Format24;

        expect(component['isSecondAllowed'](10, 30, 15)).toBe(true);
      });
    });

    describe('applySizeBasedOnA11y (private):', () => {
      it('should set _size from _initialSize using validateSizeFn', () => {
        component['_initialSize'] = 'small';
        component['applySizeBasedOnA11y']();
        expect(component['_size']).toBe(validateSizeFn('small', PoFieldSize));
      });

      it('should handle undefined _initialSize', () => {
        component['_initialSize'] = undefined;
        component['applySizeBasedOnA11y']();
        expect(component['_size']).toBe(validateSizeFn(undefined, PoFieldSize));
      });
    });

    describe('size setter:', () => {
      it('should set _initialSize and call applySizeBasedOnA11y', () => {
        spyOn(component as any, 'applySizeBasedOnA11y');
        component.size = 'small';
        expect(component['_initialSize']).toBe('small');
        expect(component['applySizeBasedOnA11y']).toHaveBeenCalled();
      });
    });

    describe('setLiterals - locale fallback branches:', () => {
      it('should use shortLanguage fallback when _locale key is not found', () => {
        component['_locale'] = 'xx';
        Object.defineProperty(component, 'shortLanguage', { value: 'pt', writable: true });
        component['setLiterals']();
        expect(component['literals']).toBeTruthy();
      });

      it('should use en fallback when both _locale and shortLanguage keys are not found', () => {
        component['_locale'] = 'xx';
        Object.defineProperty(component, 'shortLanguage', { value: 'yy', writable: true });
        component['setLiterals']();
        expect(component['literals']).toBeTruthy();
      });

      it('should use _locale when key is found', () => {
        component['_locale'] = 'pt';
        component['setLiterals']();
        expect(component['literals']).toBeTruthy();
      });
    });

    describe('locale setter - fallback to shortLanguage:', () => {
      it('should fallback to shortLanguage when locale is empty string', () => {
        Object.defineProperty(component, 'shortLanguage', { value: 'pt', writable: true });
        component.locale = '';
        expect(component.locale).toBe('pt');
      });

      it('should fallback to shortLanguage when locale is null', () => {
        Object.defineProperty(component, 'shortLanguage', { value: 'en', writable: true });
        component.locale = null;
        expect(component.locale).toBe('en');
      });
    });
  });
});
