import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoDateService } from '../../../services/po-date/po-date.service';
import { PoCalendarHeaderComponent } from '../po-calendar-header/po-calendar-header.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper.component';
import { PoCalendarService } from '../services/po-calendar.service';

describe('PoCalendarWrapperComponent', () => {
  let component: PoCalendarWrapperComponent;
  let fixture: ComponentFixture<PoCalendarWrapperComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCalendarWrapperComponent, PoCalendarHeaderComponent],
      providers: [PoCalendarService, PoDateService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getters:', () => {
    it('isStartPart: should return true when partType is "start"', () => {
      component.partType = 'start';
      expect(component.isStartPart).toBe(true);
    });

    it('isStartPart: should return false when partType is not "start"', () => {
      component.partType = 'end';
      expect(component.isStartPart).toBe(false);
    });

    it('isEndPart: should return true when partType is "end"', () => {
      component.partType = 'end';
      expect(component.isEndPart).toBe(true);
    });

    it('isEndPart: should return false when partType is not "end"', () => {
      component.partType = 'start';
      expect(component.isEndPart).toBe(false);
    });

    it('isDayVisible: should return true when mode is "day"', () => {
      component.mode = 'day';
      expect(component.isDayVisible).toBe(true);
    });

    it('isDayVisible: should return false when mode is not "day"', () => {
      component.mode = 'month';
      expect(component.isDayVisible).toBe(false);
    });

    it('isMonthVisible: should return true when mode is "month"', () => {
      component.mode = 'month';
      expect(component.isMonthVisible).toBe(true);
    });

    it('isMonthVisible: should return false when mode is not "month"', () => {
      component.mode = 'day';
      expect(component.isMonthVisible).toBe(false);
    });

    it('isYearVisible: should return true when mode is "year"', () => {
      component.mode = 'year';
      expect(component.isYearVisible).toBe(true);
    });

    it('isYearVisible: should return false when mode is not "year"', () => {
      component.mode = 'day';
      expect(component.isYearVisible).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('ngOnChanges: shouldn`t call updateDisplay if activateDate.currentValue is falsy', () => {
      const changes = {};

      spyOn(component, <any>'updateDisplay');

      component.ngOnChanges(changes);

      expect(component['updateDisplay']).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call updateDisplay if activateDate.currentValue is truthy', () => {
      const today = new Date();

      const changes = {
        activateDate: new SimpleChange(undefined, today, false)
      };

      spyOn(component, <any>'updateDisplay');

      component.ngOnChanges(changes);

      expect(component['updateDisplay']).toHaveBeenCalledWith(today.getFullYear(), today.getMonth());
    });

    it('ngOnChanges: should use activateDate.start when currentValue is a range object', () => {
      const rangeStart = new Date(2024, 2, 10);
      const rangeEnd = new Date(2024, 2, 15);

      component.displayYear = 2020;
      component.displayMonthNumber = 0;

      const changes = {
        activateDate: new SimpleChange(undefined, { start: rangeStart, end: rangeEnd }, false)
      };

      spyOn(component, <any>'updateDisplay');

      component.ngOnChanges(changes);

      expect(component['updateDisplay']).toHaveBeenCalledWith(rangeStart.getFullYear(), rangeStart.getMonth());
    });

    it('ngOnChanges: should not call updateDisplay when dateToUse matches current display month/year', () => {
      const sameMonthDate = new Date(2024, 6, 20);

      component.displayYear = sameMonthDate.getFullYear();
      component.displayMonthNumber = sameMonthDate.getMonth();

      const changes = {
        activateDate: new SimpleChange(undefined, sameMonthDate, false)
      };

      spyOn(component, <any>'updateDisplay');

      component.ngOnChanges(changes);

      expect(component['updateDisplay']).not.toHaveBeenCalled();
    });

    it('getDateToUse: should return value when it is a Date', () => {
      const date = new Date(2024, 5, 10);

      const result = (component as any).getDateToUse(date);

      expect(result).toEqual(date);
    });

    it('getDateToUse: should return value.start when it is a Date', () => {
      const date = new Date(2024, 5, 10);

      const result = (component as any).getDateToUse({ start: date });

      expect(result).toEqual(date);
    });

    it('getDateToUse: should parse YYYY-MM-DD string correctly', () => {
      const dateString = '2024-06-13';
      const result = (component as any).getDateToUse(dateString);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(13);
    });

    it('getDateToUse: should return new Date when value is invalid', () => {
      const result = (component as any).getDateToUse({ start: 'invalid' });

      expect(result instanceof Date).toBeTrue();
    });

    it('getDateToUse: should handle UTC midnight correctly', () => {
      const date = new Date(Date.UTC(2024, 5, 13, 0, 0, 0));
      date.setHours(3, 15, 0, 0);
      spyOn(date, 'getUTCHours').and.returnValue(0);
      spyOn(date, 'getUTCMinutes').and.returnValue(0);
      spyOn(date, 'getUTCFullYear').and.callThrough();
      spyOn(date, 'getUTCMonth').and.callThrough();
      spyOn(date, 'getUTCDate').and.callThrough();
      const result = (component as any).getDateToUse(date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(date.getUTCDate());
      expect(date.getUTCHours).toHaveBeenCalled();
      expect(date.getUTCMinutes).toHaveBeenCalled();
      expect(date.getUTCFullYear).toHaveBeenCalled();
      expect(date.getUTCMonth).toHaveBeenCalled();
      expect(date.getUTCDate).toHaveBeenCalled();
    });

    it('deve incrementar comboKey e chamar cdr.detectChanges() quando o locale mudar (e não for a primeira mudança)', () => {
      const initialComboKey = component.comboKey;
      const cdrSpy = spyOn((component as any).cdr, 'detectChanges');

      spyOn(component as any, 'updateTemplateContext');

      const changes: SimpleChanges = {
        locale: new SimpleChange('pt-BR', 'en-US', false)
      };

      component.ngOnChanges(changes);

      expect(component.comboKey).toBe(initialComboKey + 1);
      expect((component as any).updateTemplateContext).toHaveBeenCalled();
      expect(cdrSpy).toHaveBeenCalled();
    });

    it(`setupOptions: should call 'setLanguage', 'getWeekDaysArray' and 'getMonthsArray' of
    the 'poCalendarLangService' and set the value of displayWeekDays and displayMonths`, () => {
      const weekDays = ['sun', 'mon', 'tue'];
      const months = ['jan', 'feb', 'mar'];

      spyOn(component['poCalendarLangService'], 'setLanguage');
      spyOn(component['poCalendarLangService'], 'getWeekDaysArray').and.returnValue(weekDays);
      spyOn(component['poCalendarLangService'], 'getMonthsArray').and.returnValue(months);

      spyOn(component['poCalendarLangService'], 'getTodayLabel').and.returnValue('Hoje');
      spyOn(component['poCalendarLangService'], 'getToCleanLabel').and.returnValue('Limpar');
      spyOn(component['poCalendarService'], 'getYearOptions').and.returnValue([]);

      component['_locale'] = 'en';
      component['setupOptions']();

      expect(component['poCalendarLangService'].setLanguage).toHaveBeenCalledWith('en');
      expect(component['poCalendarLangService'].getWeekDaysArray).toHaveBeenCalled();
      expect(component['poCalendarLangService'].getMonthsArray).toHaveBeenCalled();

      expect(component.displayWeekDays).toEqual(weekDays);
      expect(component.displayMonths).toEqual(months);
    });

    it(`updateYear: should call 'updateDisplay' with '2007' and '11'`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;
      const value = 10;
      const yearExpected = 2007;

      spyOn(component, <any>'updateDisplay');
      component.updateYear(value);

      expect(component['updateDisplay']).toHaveBeenCalledWith(yearExpected, 11);
    });

    it(`updateYear: should call 'updateDisplay' with '1987' and '11'`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      component.updateYear(-10);

      expect(component['updateDisplay']).toHaveBeenCalledWith(1987, 11);
    });

    it('updateTemplateContext: should add displayYear to yearsOptions when it is missing', () => {
      component.displayYear = 2035;
      component.displayMonthNumber = 5;
      component.comboYearsOptions = [
        { label: '2020', value: 2020 },
        { label: '2021', value: 2021 }
      ];

      (component as any).updateTemplateContext();

      const yearsOptions = component.templateContext.yearsOptions;

      expect(yearsOptions.some(option => option.value === 2035)).toBeTrue();
    });

    it('updateTemplateContext: should not duplicate displayYear when it is already in yearsOptions', () => {
      component.displayYear = 2021;
      component.displayMonthNumber = 5;
      component.comboYearsOptions = [
        { label: '2020', value: 2020 },
        { label: '2021', value: 2021 }
      ];

      (component as any).updateTemplateContext();

      const yearsOptions = component.templateContext.yearsOptions.filter(option => option.value === 2021);

      expect(yearsOptions.length).toBe(1);
    });

    it('onNextMonth: should call updateDisplay with next month/year', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(2024, 6);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 7, year: 2024 });
    });

    it('onNextMonth: should call updateDisplay when month wraps to next year', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 0);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 1, year: 2025 });
    });

    it('onPreviousMonth: should call updateDisplay with previous month/year', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component.onPreviousMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(2024, 4);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 5, year: 2024 });
    });

    it('onPreviousMonth: should call updateDisplay when month wraps to previous year', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 0;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component.onPreviousMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(2023, 11);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 12, year: 2023 });
    });

    it('updateYear: should call updateDisplay with new year', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 6;

      spyOn(component, <any>'updateDisplay');

      component.updateYear(1);

      expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 6);
    });

    it('updateYear: should also work with negative year values', () => {
      component.displayYear = 2024;
      component.displayMonthNumber = 6;

      spyOn(component, <any>'updateDisplay');

      component.updateYear(-1);

      expect(component['updateDisplay']).toHaveBeenCalledWith(2023, 6);
    });

    it(`updateDisplay: should return early when year is undefined`, () => {
      spyOn(component.cdr, 'detectChanges');

      component['updateDisplay'](undefined, 5);

      expect(component.cdr.detectChanges).not.toHaveBeenCalled();
    });

    it(`updateDisplay: should return early when month is undefined`, () => {
      spyOn(component.cdr, 'detectChanges');

      component['updateDisplay'](2024, undefined);

      expect(component.cdr.detectChanges).not.toHaveBeenCalled();
    });

    it(`initializeData: should use activateDate when it is defined (branch coverage for line 141 - truthy path)`, () => {
      const testDate = new Date(2025, 0, 15);
      component.activateDate = testDate;

      spyOn(component, <any>'updateDisplay');

      component['initializeData']();

      expect(component.displayYear).toBe(2025);
      expect(component.displayMonthNumber).toBe(0);
      expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 0);
    });

    it(`initializeData: should create new Date when activateDate is undefined (branch coverage for line 141 - falsy path)`, () => {
      component.activateDate = undefined;

      spyOn(component, <any>'updateDisplay');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      component['initializeData']();

      expect(component.displayYear).toBe(currentYear);
      expect(component.displayMonthNumber).toBe(currentMonth);
      expect(component['updateDisplay']).toHaveBeenCalledWith(currentYear, currentMonth);
    });

    it(`initializeData: should create new Date when activateDate is null (branch coverage for line 141 - falsy path with null)`, () => {
      component.activateDate = null;

      spyOn(component, <any>'updateDisplay');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      component['initializeData']();

      expect(component.displayYear).toBe(currentYear);
      expect(component.displayMonthNumber).toBe(currentMonth);
      expect(component['updateDisplay']).toHaveBeenCalledWith(currentYear, currentMonth);
    });

    it('onTodayKeydown: should emit closeCalendar when key is Tab and shift is not pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });

      spyOn(component.closeCalendar, 'emit');

      component.onTodayKeydown(event);

      expect(component.closeCalendar.emit).toHaveBeenCalled();
    });

    it('onTodayKeydown: should not emit closeCalendar when key is not Tab or shift is pressed', () => {
      const eventWithShift = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      const eventNonTab = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false });

      spyOn(component.closeCalendar, 'emit');

      component.onTodayKeydown(eventWithShift);
      component.onTodayKeydown(eventNonTab);

      expect(component.closeCalendar.emit).not.toHaveBeenCalled();
    });

    it('onTodayKeydownEnter: should prevent default and call onSelectDate with today', () => {
      const event = { key: 'Enter', preventDefault: jasmine.createSpy('preventDefault') } as any;

      spyOn(component, 'onSelectDate');

      component.onTodayKeydownEnter(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.onSelectDate).toHaveBeenCalledWith(component.today);
    });

    it('onTodayKeydownSpace: should prevent default and call onSelectDate with today', () => {
      const event = { key: ' ', preventDefault: jasmine.createSpy('preventDefault') } as any;

      spyOn(component, 'onSelectDate');

      component.onTodayKeydownSpace(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.onSelectDate).toHaveBeenCalledWith(component.today);
    });

    it('onDayKeydown: should not emit closeCalendar when range is false or shift is pressed', () => {
      const eventWithShift = { key: 'Tab', shiftKey: true, preventDefault: jasmine.createSpy('preventDefault') } as any;
      const eventRangeFalse = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;
      const day = new Date(2024, 5, 10);

      spyOn(component.closeCalendar, 'emit');

      component.range = true;
      component.onDayKeydown(eventWithShift, day, 0);

      component.range = false;
      component.onDayKeydown(eventRangeFalse, day, 0);

      expect(component.closeCalendar.emit).not.toHaveBeenCalled();
    });

    it('handleNavigationKey: should return false when target date is invalid or undefined', () => {
      component.displayDays = [];
      component.displayMonthNumber = 0;
      component.displayYear = 2024;

      const result = component['handleNavigationKey']('ArrowUp', 0);

      expect(result).toBeFalse();
    });

    it('handleNavigationKey: should return false when target date is outside current month/year', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      component.displayDays = [new Date(2024, 5, 10), new Date(2024, 6, 1)];

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeFalse();
    });

    it('handleNavigationKey: should return false when key is not a navigation key', () => {
      component.displayDays = [new Date(2024, 5, 10)];
      component.displayMonthNumber = 5;
      component.displayYear = 2024;

      const result = component['handleNavigationKey']('Enter', 0);

      expect(result).toBeFalse();
    });

    it('handleNavigationKey: should return false when newDate is undefined', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      component.displayDays = [new Date(2024, 5, 10), undefined as any];

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeFalse();
    });

    it('handleNavigationKey: should return false when findNextAvailableDay returns -1', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      const disabledDay = new Date(2024, 5, 10);
      component.displayDays = [disabledDay, new Date(2024, 5, 11)];

      spyOn(component as any, 'isDayDisabled').and.returnValues(true, true);
      spyOn(component as any, 'findNextAvailableDay').and.returnValue(-1);

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeFalse();
      expect(component['findNextAvailableDay']).toHaveBeenCalled();
    });

    it('handleNavigationKey: should return false when new date found by findNextAvailableDay is still disabled', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      const disabledDay1 = new Date(2024, 5, 10);
      const disabledDay2 = new Date(2024, 5, 11);
      component.displayDays = [disabledDay1, disabledDay2];

      spyOn(component as any, 'isDayDisabled').and.returnValue(true);
      spyOn(component as any, 'findNextAvailableDay').and.returnValue(1);

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeFalse();
      expect(component['isDayDisabled']).toHaveBeenCalledWith(disabledDay2);
      expect(component['findNextAvailableDay']).toHaveBeenCalled();
    });

    it('handleNavigationKey: should return false when new date found by findNextAvailableDay is null', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      const disabledDay1 = new Date(2024, 5, 10);
      const disabledDay2 = new Date(2024, 5, 11);
      component.displayDays = [disabledDay1, disabledDay2, null as any];

      spyOn(component as any, 'isDayDisabled').and.returnValue(true);
      spyOn(component as any, 'findNextAvailableDay').and.returnValue(2);

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeFalse();
      expect(component['findNextAvailableDay']).toHaveBeenCalled();
    });

    it('handleNavigationKey: should return true and focus when disabled day has available alternative', () => {
      component.displayMonthNumber = 5;
      component.displayYear = 2024;
      const disabledDay = new Date(2024, 5, 10);
      const availableDay = new Date(2024, 5, 11);
      component.displayDays = [disabledDay, availableDay];
      component.focusedDayIndex = 0;

      spyOn(component as any, 'isDayDisabled').and.returnValues(true, false);
      spyOn(component as any, 'findNextAvailableDay').and.returnValue(1);
      spyOn(component as any, 'focusElement');
      spyOn(component.cdr, 'detectChanges');

      const result = component['handleNavigationKey']('ArrowRight', 0);

      expect(result).toBeTrue();
      expect(component.focusedDayIndex).toBe(1);
      expect(component['findNextAvailableDay']).toHaveBeenCalled();
      expect(component['focusElement']).toHaveBeenCalledWith(1);
    });

    it(`onSelectYear: should call 'updateDisplay' and 'selectDisplayMode' with 'month' if 'lastDisplay' is equal to 'month'`, () => {
      component['lastDisplay'] = 'month';

      spyOn(component, 'selectDisplayMode');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(2015, 10);

      expect(component.selectDisplayMode).toHaveBeenCalledWith('month');
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should call 'updateDisplay' and 'selectDisplayMode' with 'day' if 'lastDisplay' is different to 'month'`, () => {
      component['lastDisplay'] = '';

      spyOn(component, 'selectDisplayMode');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(2015, 10);

      expect(component.selectDisplayMode).toHaveBeenCalledWith('day');
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should set 'currentYear' to the value of 'yearParam'`, () => {
      const yearParam = 2018;

      spyOn(component, 'selectDisplayMode');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(yearParam, 10);

      expect(component.currentYear).toBe(yearParam);
    });

    it('getBackgroundColor: should return `po-calendar-box-background-selected` if displayValue is equal propertyValue', () => {
      expect(component.getBackgroundColor(10, 10)).toBe('po-calendar-box-background-selected');
    });

    it('getBackgroundColor: should return `po-calendar-box-background` if displayValue is not equal propertyValue', () => {
      expect(component.getBackgroundColor(11, 10)).toBe('po-calendar-box-background');
    });

    it('getDayBackgroundColor: should call `getDayColor` with `date` and `background`', () => {
      const date = new Date(2018, 5, 5);

      spyOn(component, <any>'getDayColor');

      component.getDayBackgroundColor(date);

      expect(component['getDayColor']).toHaveBeenCalledWith(date, 'background');
    });

    it('getDayBackgroundColor: should return empty string when date is falsy', () => {
      expect(component.getDayBackgroundColor(null as any)).toBe('');
    });

    it('getDayForegroundColor: should call `getDayColor` with `date` and `foreground`', () => {
      const date = new Date(2018, 5, 5);

      spyOn(component, <any>'getDayColor');

      component.getDayForegroundColor(date);

      expect(component['getDayColor']).toHaveBeenCalledWith(date, 'foreground');
    });

    it('getDayBackgroundColor: should return selected color when date equals start in range', () => {
      const date = new Date(2024, 1, 10);
      component.range = true;
      component.selectedValue = { start: new Date(2024, 1, 10), end: new Date(2024, 1, 15) };
      component.displayMonthNumber = 1;

      expect(component.getDayBackgroundColor(date)).toBe('po-calendar-box-background-selected');
    });

    it('getDayBackgroundColor: should return in-range color when date is between start and end', () => {
      const date = new Date(2024, 1, 12);
      component.range = true;
      component.selectedValue = { start: new Date(2024, 1, 10), end: new Date(2024, 1, 15) };
      component.displayMonthNumber = 1;

      expect(component.getDayBackgroundColor(date)).toBe('po-calendar-box-background-in-range');
    });

    it('getDayBackgroundColor: should return hover color when range has start and no end and date before hover', () => {
      const date = new Date(2024, 1, 12);
      component.range = true;
      component.selectedValue = { start: new Date(2024, 1, 10), end: null };
      component.hoverValue = new Date(2024, 1, 20);
      component.displayMonthNumber = 1;

      expect(component.getDayBackgroundColor(date)).toBe('po-calendar-box-background-hover');
    });

    it('getForegroundColor: should return `po-calendar-box-foreground-selected` if displayValue is equal propertyValue', () => {
      expect(component.getForegroundColor(10, 10)).toBe('po-calendar-box-foreground-selected');
    });

    it('getForegroundColor: should return `po-calendar-box-foreground` if displayValue is not equal propertyValue', () => {
      expect(component.getForegroundColor(11, 10)).toBe('po-calendar-box-foreground');
    });

    it('isTodayUnavailable: should return `false` if minDate is less than date', () => {
      const date: string | Date = new Date();
      const minDate: string | Date = new Date(date);

      minDate.setDate(minDate.getDate() - 1);

      component['today'] = date;
      component.minDate = minDate;

      expect(minDate.getTime()).toBeLessThan(date.getTime());
      expect(component.isTodayUnavailable()).toBeFalse();
    });

    it('isTodayUnavailable: should return `false` if minDate is equal date', () => {
      const date: string | Date = new Date();
      const minDate: string | Date = new Date(date);

      component['today'] = date;
      component.minDate = minDate;

      expect(component.isTodayUnavailable()).toBeFalse();
    });

    it('isTodayUnavailable: should return `true` if minDate is greater than date', () => {
      const date: string | Date = new Date();
      const minDate: string | Date = new Date(date);

      minDate.setDate(minDate.getDate() + 1);

      component['today'] = date;
      component.minDate = minDate;

      expect(component.isTodayUnavailable()).toBeTrue();
    });

    it('isTodayUnavailable: should return `false` if maxDate is greater than date', () => {
      const date: string | Date = new Date();
      const maxDate: string | Date = new Date(date);

      maxDate.setDate(maxDate.getDate() + 1);

      component['today'] = date;
      component.maxDate = maxDate;

      expect(component.isTodayUnavailable()).toBeFalse();
    });

    it('isTodayUnavailable: should return `false` if maxDate is equal date', () => {
      const date: string | Date = new Date();
      const maxDate: string | Date = new Date(date);

      component['today'] = date;
      component.maxDate = maxDate;

      expect(component.isTodayUnavailable()).toBeFalse();
    });

    it('isTodayUnavailable: should return `true` if maxDate is less than date', () => {
      const date: string | Date = new Date();
      const maxDate: string | Date = new Date(date);

      maxDate.setDate(maxDate.getDate() - 1);

      component['today'] = date;
      component.maxDate = maxDate;

      expect(component.isTodayUnavailable()).toBeTrue();
    });

    it('isDayDisabled: should return `false` when date is within range', () => {
      const date = new Date(2024, 1, 10);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      expect(component.isDayDisabled(date)).toBeFalse();
      expect(component['poDate'].validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it('isDayDisabled: should return `true` when date is outside range', () => {
      const date = new Date(2024, 1, 10);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      expect(component.isDayDisabled(date)).toBeTrue();
      expect(component['poDate'].validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`monthLabel: should call 'poCalendarLangService.getMonthLabel'`, () => {
      spyOn(component['poCalendarLangService'], 'getMonthLabel').and.callThrough();

      const monthLabel = component.monthLabel;
      expect(typeof monthLabel === 'string').toBe(true);
      expect(component['poCalendarLangService'].getMonthLabel).toHaveBeenCalled();
    });

    it(`yearLabel: should call 'poCalendarLangService.getYearLabel'`, () => {
      spyOn(component['poCalendarLangService'], 'getYearLabel').and.callThrough();

      const yearLabel = component.yearLabel;
      expect(typeof yearLabel === 'string').toBe(true);
      expect(component['poCalendarLangService'].getYearLabel).toHaveBeenCalled();
    });

    it(`onNextMonth: should call 'updateDisplay' with 'displayYear' and 'displayMonthNumber +1' if displayMonthNumber
      is less then 11`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 10;

      spyOn(component, <any>'updateDisplay');
      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1997, 11);
    });

    it(`onNextMonth: should call 'updateDisplay' with 'displayYear +1' and 0 if displayMonthNumber is greater or equal
      then 11`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1998, 0);
    });

    it(`onPreviousMonth: should call 'updateDisplay' with 'displayYear' and 'displayMonthNumber -1' if displayMonthNumber is
      greater then 0`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 10;

      spyOn(component, <any>'updateDisplay');
      component.onPreviousMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1997, 9);
    });

    it(`onPreviousMonth: should call 'updateDisplay' with 'displayYear -1' and 11 if displayMonthNumber is equal or less then 0`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 0;

      spyOn(component, <any>'updateDisplay');
      component.onPreviousMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1996, 11);
    });

    it(`onSelectMonth: should call 'selectDisplayMode' with 'day' and 'updateDisplay' with year and month`, () => {
      spyOn(component, 'selectDisplayMode');
      spyOn(component, <any>'updateDisplay');

      component.onSelectMonth(2015, 10);

      expect(component.selectDisplayMode).toHaveBeenCalledWith('day');
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`addAllYearsInDecade: should update 'displayDecade' with 10 years`, () => {
      component.displayDecade = [];

      component['addAllYearsInDecade'](2011);

      expect(component.displayDecade).toEqual([2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]);
    });

    it(`equalsDate: should return 'true' if date1 is equal date2`, () => {
      const date1 = new Date(2018, 5, 5);
      const date2 = new Date(2018, 5, 5);

      expect(component['equalsDate'](date1, date2)).toBeTruthy();
    });

    it(`equalsDate: should return 'false' if date1 is different from the date2`, () => {
      expect(component['equalsDate'](new Date(2018, 5, 5), new Date(2018, 5, 6))).toBeFalsy();
    });

    it(`equalsDate: should return 'false' if d1 is null`, () => {
      expect(component['equalsDate'](null, new Date(2018, 5, 5))).toBeFalsy();
    });

    it(`equalsDate: should return 'false' if d2 is null`, () => {
      expect(component['equalsDate'](new Date(2018, 5, 5), null)).toBeFalsy();
    });

    it(`equalsDate: should return 'false' if both d1 and d2 are null`, () => {
      expect(component['equalsDate'](null, null)).toBeFalsy();
    });

    it(`equalsDate: should return 'false' if an exception is thrown`, () => {
      const invalidDate1 = {} as Date;
      const validDate2 = new Date(2018, 5, 5);

      expect(component['equalsDate'](invalidDate1, validDate2)).toBeFalsy();
    });

    it(`getDecadeArray: should set 'displayDecade' to instance of 'Array' and call 'updateDecade' with 'year' if 'year'
      is multiple of 10`, () => {
      const year = 2000;
      component['displayDecade'] = undefined;

      spyOn(component, <any>'updateDecade');

      component['getDecadeArray'](year);

      expect(component['updateDecade']).toHaveBeenCalledWith(year);
      expect(component['displayDecade'] instanceof Array).toBeTruthy();
    });

    it(`getDecadeArray: should set 'displayDecade' to instance of 'Array' and call 'updateDecade' with 'yearMultipleTen'
      if 'year' not is multiple of 10`, () => {
      const year = 1995;
      const yearMultipleTen = 1990;
      component['displayDecade'] = undefined;

      spyOn(component, <any>'updateDecade');

      component['getDecadeArray'](year);

      expect(component['updateDecade']).toHaveBeenCalledWith(yearMultipleTen);
      expect(component['displayDecade'] instanceof Array).toBeTruthy();
    });

    it(`getColorForDate: should return 'po-calendar-box-background-selected' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getColorForDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-selected');
    });

    it(`getColorForDate: should return 'po-calendar-box-background-selected-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getColorForDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-selected-disabled');
    });

    it(`getColorForDate: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      component['getColorForDate'](date, 'background');

      expect(component['poDate'].validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`getColorForDefaultDate: should return 'po-calendar-box-background' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getColorForDefaultDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background');
    });

    it(`getColorForDefaultDate: should return 'po-calendar-box-background-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getColorForDefaultDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-disabled');
    });

    it(`getColorForDefaultDate: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      component['getColorForDefaultDate'](date, 'background');

      expect(component['poDate'].validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`getColorForToday: should return 'po-calendar-box-background-today' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getColorForToday'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-today');
    });

    it(`getColorForToday: should return 'po-calendar-box-background-today-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getColorForToday'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-today-disabled');
    });

    it(`getColorForToday: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      component['getColorForToday'](date, 'background');

      expect(component['poDate'].validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`getDayColor: should return value of the 'getColorForDate' if 'equalsDate' return 'true'`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2018, 5, 6);

      component.displayMonthNumber = 5;
      component.range = false;

      spyOn(component, <any>'equalsDate').and.callFake((d1: Date, d2: Date) => {
        return d1 === dateParam && d2 === component['date'];
      });
      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, 'background');

      expect(result).toBe(colorClass);
    });

    it(`getDayColor: should call 'equalsDate' with 'dateParam' and 'this.date' and return value of the 'getColorForDate'
      if 'equalsDate' return 'true'`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2018, 5, 6);

      component.displayMonthNumber = 5;
      component.range = false;

      spyOn(component, <any>'equalsDate').and.callFake((d1: Date, d2: Date) => {
        return d1 === dateParam && d2 === component['date'];
      });
      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, 'background');

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['date']);
    });

    it(`getDayColor: should call 'equalsDate' with 'dateParam' and 'this.today' and return 'po-calendar-box-background-today'
      if 'equalsDate' return 'true'`, () => {
      const colorClass = 'po-calendar-box-background-today';
      const dateParam = new Date(2018, 5, 6);

      component.displayMonthNumber = 5;
      component.range = false;

      spyOn(component, <any>'equalsDate').and.callFake((d1: Date, d2: Date) => {
        return d1 === dateParam && d2 === component['today'];
      });
      spyOn(component, <any>'getColorForToday').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, 'background');

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['today']);
    });

    it(`getDayColor: should call 'equalsDate', 'getColorForDefaultDate' and return value of the 'getColorForDefaultDate' if
      'equalsDate' return 'false'`, () => {
      const colorClass = 'po-calendar-box-background';
      const dateParam = new Date(2018, 5, 6);
      const local = 'background';
      component.displayMonthNumber = dateParam.getMonth();

      spyOn(component, <any>'equalsDate').and.returnValue(false);
      spyOn(component, <any>'getColorForDefaultDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, local);

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['today']);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['date']);
      expect(component['getColorForDefaultDate']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should return 'po-calendar-box-background-other-month' when date is in other month and valid`, () => {
      const dateParam = new Date(2020, 3, 10);
      component.displayMonthNumber = 4;

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      expect(component['getDayColor'](dateParam, 'background')).toBe('po-calendar-box-background-other-month');
    });

    it(`getDayColor: should return 'po-calendar-box-background-other-month-disabled' when date is in other month and invalid`, () => {
      const dateParam = new Date(2020, 3, 10);
      component.displayMonthNumber = 4;

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      expect(component['getDayColor'](dateParam, 'background')).toBe('po-calendar-box-background-other-month-disabled');
    });

    it(`getDayColor: should call 'getColorForDate' if range is true and date param is equal to selectedValue.start`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2020, 5, 6);
      const local = 'background';

      component.selectedValue = { start: new Date(2020, 5, 6), end: null };
      component.range = true;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'equalsDate').and.callThrough();
      spyOn(component, <any>'getColorForDate').and.callThrough();

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component.selectedValue.start);
      expect(component['getColorForDate']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should call 'getColorForDate' if range is true and date param is equal to selectedValue.end`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2020, 5, 6);
      const local = 'background';

      component.selectedValue = { start: new Date(2019, 4, 10), end: new Date(2020, 5, 6) };
      component.range = true;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'equalsDate').and.callThrough();
      spyOn(component, <any>'getColorForDate').and.callThrough();

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalled();
      expect(component['getColorForDate']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should call 'getColorForDateRange' if range is true and date param is between start and end date`, () => {
      const colorClass = 'po-calendar-box-background-in-range';
      const dateParam = new Date(2020, 1, 6);
      const local = 'background';

      component.selectedValue = { start: new Date(2019, 4, 10), end: new Date(2020, 5, 6) };
      component.range = true;
      component.displayMonthNumber = 1;

      spyOn(component, <any>'equalsDate').and.callThrough();
      spyOn(component, <any>'getColorForDateRange').and.callThrough();

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalled();
      expect(component['getColorForDateRange']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should return 'po-calendar-box-background-hover' if range is true and date between startDate and hoverValue`, () => {
      const colorClass = 'po-calendar-box-background-hover';
      const dateParam = new Date(2019, 4, 11);
      const local = 'background';

      component.selectedValue = { start: new Date(2019, 4, 10), end: null };
      component.range = true;
      component.hoverValue = new Date(2019, 4, 20);
      component.displayMonthNumber = 4;

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
    });

    it(`getDayColor: should return 'po-calendar-box-background-today-selected' when date is today and selected in non-range mode`, () => {
      const today = new Date();
      const local = 'background';

      component.range = false;
      component.today = today;
      component.value = today;
      component.displayMonthNumber = today.getMonth();

      const result = component['getDayColor'](today, local);

      expect(result).toBe('po-calendar-box-background-today-selected');
    });

    it(`getDayColor: should return 'po-calendar-box-foreground-today-selected' when date is today and selected in non-range mode with foreground type`, () => {
      const today = new Date();
      const local = 'foreground';

      component.range = false;
      component.today = today;
      component.value = today;
      component.displayMonthNumber = today.getMonth();

      const result = component['getDayColor'](today, local);

      expect(result).toBe('po-calendar-box-foreground-today-selected');
    });

    it(`getDayColor: should not return 'today-selected' when date is today but not selected in non-range mode`, () => {
      const today = new Date();
      const otherDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      const local = 'background';

      component.range = false;
      component.today = today;
      component.value = otherDate;
      component.displayMonthNumber = today.getMonth();

      spyOn(component, <any>'getColorForToday').and.returnValue('po-calendar-box-background-today');

      const result = component['getDayColor'](today, local);

      expect(result).toBe('po-calendar-box-background-today');
    });

    it(`getDayColor: should return color for end date when range is true and only end date exists`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2019, 4, 20);
      const local = 'background';

      component.selectedValue = { start: null, end: new Date(2019, 4, 20) };
      component.range = true;
      component.displayMonthNumber = 4;

      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect((component as any).getColorForDate).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should return selected color when not range and date equals selectedValue`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2019, 4, 15);
      const local = 'background';

      component.range = false;
      component.value = new Date(2019, 4, 15);
      component.displayMonthNumber = 4;

      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect((component as any).getColorForDate).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should return today disabled color when today is in current month but outside date range`, () => {
      const today = new Date();
      const local = 'background';
      component.displayMonthNumber = today.getMonth();
      component.range = false;
      component.value = new Date(today.getFullYear(), today.getMonth(), 15);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getDayColor'](today, local);

      expect(result).toBe('po-calendar-box-background-today-disabled');
    });

    it(`getDayColor: should return today color when today is in current month and within date range`, () => {
      const today = new Date();
      const local = 'background';
      component.displayMonthNumber = today.getMonth();
      component.range = false;
      component.value = new Date(today.getFullYear(), today.getMonth(), 15);

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getDayColor'](today, local);

      expect(result).toBe('po-calendar-box-background-today');
    });

    it(`getColorForDateRange: should return 'po-calendar-box-background-in-range' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const clazz = component['getColorForDateRange'](new Date(), 'background');

      expect(clazz).toBe('po-calendar-box-background-in-range');
    });

    it(`getColorForDateRange: should return 'po-calendar-box-background-in-range-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const clazz = component['getColorForDateRange'](new Date(), 'background');

      expect(clazz).toBe('po-calendar-box-background-in-range-disabled');
    });

    it(`getColorState: should return '\${prefix}-\${state}' if date is valid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getColorState'](date, 'po-calendar-box-background', 'selected');

      expect(result).toBe('po-calendar-box-background-selected');
    });

    it(`getColorState: should return '\${prefix}-\${state}-disabled' if date is invalid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getColorState'](date, 'po-calendar-box-background', 'selected');

      expect(result).toBe('po-calendar-box-background-selected-disabled');
    });

    it(`getColorState: should work with 'foreground' prefix when date is valid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const result = component['getColorState'](date, 'po-calendar-box-foreground', 'today');

      expect(result).toBe('po-calendar-box-foreground-today');
    });

    it(`getColorState: should work with 'foreground' prefix when date is invalid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const result = component['getColorState'](date, 'po-calendar-box-foreground', 'today');

      expect(result).toBe('po-calendar-box-foreground-today-disabled');
    });

    it(`getColorState: should return correct format with different state values when valid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);

      const resultSelected = component['getColorState'](date, 'po-calendar-box-background', 'selected');
      const resultInRange = component['getColorState'](date, 'po-calendar-box-background', 'in-range');
      const resultTodaySelected = component['getColorState'](date, 'po-calendar-box-background', 'today-selected');

      expect(resultSelected).toBe('po-calendar-box-background-selected');
      expect(resultInRange).toBe('po-calendar-box-background-in-range');
      expect(resultTodaySelected).toBe('po-calendar-box-background-today-selected');
    });

    it(`getColorState: should return correct format with different state values when invalid`, () => {
      const date = new Date(2020, 5, 15);
      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);

      const resultSelected = component['getColorState'](date, 'po-calendar-box-background', 'selected');
      const resultInRange = component['getColorState'](date, 'po-calendar-box-background', 'in-range');
      const resultTodaySelected = component['getColorState'](date, 'po-calendar-box-background', 'today-selected');

      expect(resultSelected).toBe('po-calendar-box-background-selected-disabled');
      expect(resultInRange).toBe('po-calendar-box-background-in-range-disabled');
      expect(resultTodaySelected).toBe('po-calendar-box-background-today-selected-disabled');
    });

    it(`init: should call 'updateDate' with activateDate, selectDisplayMode with 'day' and setupOptions`, () => {
      component['activateDate'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDisplay');
      spyOn(component, <any>'setupOptions');

      component['initializeData']();

      expect(component['setupOptions']).toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2018, 5);
    });

    it(`updateDate: should call 'updateDisplay' and 'headerChange.emit' with year and month`, () => {
      const year = 2020;
      const month = 5;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component['updateDate'](year, month);

      expect(component['updateDisplay']).toHaveBeenCalledWith(year, month);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 6, year: 2020 });
    });

    it(`updateDate: should not emit 'headerChange' when year and month are the same`, () => {
      component.displayYear = 2020;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component['updateDate'](2020, 5);

      expect(component['updateDisplay']).toHaveBeenCalledWith(2020, 5);
      expect(component.headerChange.emit).not.toHaveBeenCalled();
    });

    it(`updateDate: should emit 'headerChange' only once when month changes`, () => {
      component.displayYear = 2020;
      component.displayMonthNumber = 5;

      spyOn(component, <any>'updateDisplay');
      spyOn(component.headerChange, 'emit');

      component['updateDate'](2020, 6);

      expect(component['updateDisplay']).toHaveBeenCalledWith(2020, 6);
      expect(component.headerChange.emit).toHaveBeenCalledTimes(1);
      expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 7, year: 2020 });
    });

    it(`updateDecade: should call 'addAllYearsInDecade' and update 'displayStartDecade' and 'displayFinalDecade'`, () => {
      spyOn(component, <any>'addAllYearsInDecade');

      component['updateDecade'](2000);

      expect(component['displayStartDecade']).toBe(2000);
      expect(component['displayFinalDecade']).toBe(2009);
      expect(component['addAllYearsInDecade']).toHaveBeenCalledWith(2000);
    });

    it(`updateDisplay: should call 'poCalendarService.monthDays' to set 'displayDays'`, () => {
      const monthDays = [new Date(2018, 2, 1), new Date(2018, 2, 2), new Date(2018, 2, 3), new Date(2018, 2, 4)];
      const year = 2018;
      const month = 2;

      spyOn(component['poCalendarService'], 'monthDays').and.returnValue([...monthDays]);

      component['updateDisplay'](year, month);

      expect(component['displayDays']).toEqual(monthDays);
      expect(component['poCalendarService']['monthDays']).toHaveBeenCalledWith(year, month);
    });

    it(`updateDisplay: should set 'displayMonthNumber', 'displayMonth', 'displayYear' and call 'getDecadeArray'
      with 'year'`, () => {
      const monthDays = [new Date(2018, 2, 1), new Date(2018, 2, 2), new Date(2018, 2, 3), new Date(2018, 2, 4)];
      const year = 2018;
      const month = 2;

      spyOn(component['poCalendarService'], 'monthDays').and.returnValue([...monthDays]);
      spyOn(component, <any>'getDecadeArray');

      component['updateDisplay'](year, month);

      expect(component.displayMonthNumber).toEqual(month);
      expect(component['displayMonth']).toEqual(component['displayMonths'][month]);
      expect(component['displayYear']).toEqual(year);
      expect(component['getDecadeArray']).toHaveBeenCalledWith(year);
    });

    it(`onSelectDate: should call 'selectDate.emit' with date param`, () => {
      const date = new Date();

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(true);
      spyOn(component.selectDate, 'emit');

      component['onSelectDate'](date);

      expect(component.selectDate.emit).toHaveBeenCalledWith(date);
    });

    it(`onSelectDate: should not emit when date is out of range`, () => {
      const date = new Date();

      spyOn(component['poDate'], 'validateDateRange').and.returnValue(false);
      spyOn(component.selectDate, 'emit');

      component['onSelectDate'](date);

      expect(component.selectDate.emit).not.toHaveBeenCalled();
    });

    it(`onMouseEnter: should call 'hoverDate.next' with date param`, () => {
      const date = new Date(2021, 5, 5);

      const spyHoverDate = spyOn(component.hoverDateSource, 'next');

      component['onMouseEnter'](date);

      expect(spyHoverDate).toHaveBeenCalledWith(date);
    });

    it(`onMouseLeave: should call 'hoverDate.next' with null`, () => {
      const spyHoverDate = spyOn(component.hoverDateSource, 'next');

      component['onMouseLeave']();

      expect(spyHoverDate).toHaveBeenCalledWith(null);
    });

    it(`onClear: should call 'selectDate.emit' with undefined`, () => {
      spyOn(component.selectDate, 'emit');

      component['onClear']();

      expect(component.selectDate.emit).toHaveBeenCalledWith(undefined);
    });

    it('deve limpar a seleção, focar no primeiro dia disponível e detectar mudanças', () => {
      component.displayMonthNumber = 5;
      component.focusedDayIndex = 15;

      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2)];

      const emitSpy = spyOn(component.selectDate, 'emit');
      const detectSpy = spyOn(component.cdr, 'detectChanges');

      spyOn(component, 'isDayDisabled').and.callFake((date: Date) => {
        return date.getDate() === 1;
      });

      component.onClear();

      expect(emitSpy).toHaveBeenCalledWith(undefined);
      expect(component.focusedDayIndex).toBe(2);
      expect(detectSpy).toHaveBeenCalled();
    });

    it('deve limpar a seleção, mas manter o foco intacto se não houver dias disponíveis', () => {
      component.displayMonthNumber = 5;
      component.focusedDayIndex = 15;

      component.displayDays = [new Date(2026, 5, 1), new Date(2026, 5, 2)];

      const emitSpy = spyOn(component.selectDate, 'emit');
      const detectSpy = spyOn(component.cdr, 'detectChanges');

      spyOn(component, 'isDayDisabled').and.returnValue(true);

      component.onClear();

      expect(emitSpy).toHaveBeenCalledWith(undefined);
      expect(component.focusedDayIndex).toBe(15);
      expect(detectSpy).toHaveBeenCalled();
    });

    describe('onDayKeydown', () => {
      it('should handle Tab key and update focusedDayIndex to first available day', () => {
        component.displayDays = [new Date(2024, 5, 10), new Date(2024, 5, 11), new Date(2024, 5, 12)];
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 2;

        const event = { key: 'Tab', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        component.onDayKeydown(event, component.displayDays[2], 2);

        const expectedIndex = component.displayDays.findIndex(
          day =>
            day instanceof Date &&
            day.getMonth() === component.displayMonthNumber &&
            !(component as any).isDayDisabled(day)
        );

        expect(component.focusedDayIndex).toBe(expectedIndex);
      });

      beforeEach(() => {
        component.displayYear = 2024;
        component.displayMonthNumber = 5;
        component.displayDays = new Array(30).fill(null).map((_, i) => new Date(2024, 5, i + 1));
      });

      it('should handle Enter key', () => {
        const date = new Date(2024, 5, 10);
        const event = { key: 'Enter', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        spyOn(component, 'onSelectDate');
        spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, date, 5);

        expect(component.onSelectDate).toHaveBeenCalledWith(date);
        expect(component.focusedDayIndex).toBe(5);
        expect(component.cdr.detectChanges).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle Space key', () => {
        const date = new Date(2024, 5, 10);
        const event = { key: ' ', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        spyOn(component, 'onSelectDate');

        component.onDayKeydown(event, date, 6);

        expect(component.onSelectDate).toHaveBeenCalledWith(date);
        expect(component.focusedDayIndex).toBe(6);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should update the index when using the ArrowUp key within the grid limits', () => {
        component.displayDays = [];
        for (let i = 1; i <= 30; i++) {
          component.displayDays.push(new Date(2024, 5, i));
        }
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 10;

        const event = { key: 'ArrowUp', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        const detectSpy = spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, component.displayDays[10], 10);

        const expectedIndex = 10 - 7;
        expect(component.focusedDayIndex).toBe(expectedIndex);
        expect(detectSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not update the index when using the ArrowUp key on the first row of the grid (upper limit)', () => {
        component.displayDays = [];
        for (let i = 1; i <= 30; i++) {
          component.displayDays.push(new Date(2024, 5, i));
        }
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 3;

        const event = { key: 'ArrowUp', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        const detectSpy = spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, component.displayDays[3], 3);

        expect(component.focusedDayIndex).toBe(3);
        expect(detectSpy).not.toHaveBeenCalled();
      });

      it('should update the index when using the ArrowDown key within the grid limits', () => {
        component.displayDays = [];
        for (let i = 1; i <= 30; i++) {
          component.displayDays.push(new Date(2024, 5, i));
        }
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 10;
        const event = { key: 'ArrowDown', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        const detectSpy = spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, component.displayDays[10], 10);

        const expectedIndex = 10 + 7;
        expect(component.focusedDayIndex).toBe(expectedIndex);
        expect(detectSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not update the index when using the ArrowDown key on the last row of the grid (lower limit)', () => {
        component.displayDays = [];
        for (let i = 1; i <= 30; i++) {
          component.displayDays.push(new Date(2024, 5, i));
        }
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 25;

        const event = { key: 'ArrowDown', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        const detectSpy = spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, component.displayDays[25], 25);

        expect(component.focusedDayIndex).toBe(25);
        expect(detectSpy).not.toHaveBeenCalled();
      });

      it('should handle ArrowRight key', () => {
        const event = {
          key: 'ArrowRight',
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        component.onDayKeydown(event, new Date(2024, 5, 29), 28);

        expect(component.focusedDayIndex).toBe(29);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle ArrowLeft key', () => {
        component.displayDays = [];
        for (let i = 1; i <= 30; i++) {
          component.displayDays.push(new Date(2024, 5, i));
        }
        component.displayMonthNumber = 5;
        component.displayYear = 2024;
        component.focusedDayIndex = 25;

        const event = { key: 'ArrowLeft', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        const detectSpy = spyOn(component.cdr, 'detectChanges');

        component.onDayKeydown(event, component.displayDays[25], 25);

        const expectedIndex = Math.max(25 - 1, 0);
        expect(component.focusedDayIndex).toBe(expectedIndex);
        expect(detectSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle Home key', () => {
        const event = { key: 'Home', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        component.onDayKeydown(event, new Date(2024, 5, 11), 10);

        expect(component.focusedDayIndex).toBe(7);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle End key', () => {
        const event = { key: 'End', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        component.onDayKeydown(event, new Date(2024, 5, 11), 10);

        expect(component.focusedDayIndex).toBe(13);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageUp with shiftKey', () => {
        const event = {
          key: 'PageUp',
          shiftKey: true,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2023, 5);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageUp without shiftKey at month boundary', () => {
        const event = {
          key: 'PageUp',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        component.displayYear = 2024;
        component.displayMonthNumber = 0;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 0, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2023, 11);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageDown with shiftKey', () => {
        const event = {
          key: 'PageDown',
          shiftKey: true,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 5);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageDown without shiftKey at month boundary', () => {
        const event = {
          key: 'PageDown',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        component.displayYear = 2024;
        component.displayMonthNumber = 11;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 11, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 0);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle Escape key', () => {
        const event = { key: 'Escape', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not prevent default for unsupported key', () => {
        const event = { key: 'A', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should block PageUp when all days in target month are disabled', () => {
        component.displayYear = 2024;
        component.displayMonthNumber = 5;
        component.displayDays = new Array(30).fill(null).map((_, i) => new Date(2024, 5, i + 1));

        spyOn(component, <any>'updateDisplay');
        spyOn(component as any, 'hasAvailableDaysInMonth').and.returnValue(false);

        const event = {
          key: 'PageUp',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        const result = component['handlePageNavigation']('PageUp', false, 10, 9);

        expect(result).toBe(false);
        expect(component['updateDisplay']).not.toHaveBeenCalled();
      });

      it('should allow PageUp when target month has available days', () => {
        component.displayYear = 2024;
        component.displayMonthNumber = 5;
        component.displayDays = new Array(30).fill(null).map((_, i) => new Date(2024, 5, i + 1));

        spyOn(component, <any>'updateDisplay');
        spyOn(component as any, 'hasAvailableDaysInMonth').and.returnValue(true);
        spyOn(component as any, 'focusOnSameDayAndWeek');

        const result = component['handlePageNavigation']('PageUp', false, 10, 9);

        expect(result).toBe(true);
        expect(component['updateDisplay']).toHaveBeenCalled();
      });

      it('should block PageDown when all days in target month are disabled', () => {
        component.displayYear = 2024;
        component.displayMonthNumber = 5;
        component.displayDays = new Array(30).fill(null).map((_, i) => new Date(2024, 5, i + 1));

        spyOn(component, <any>'updateDisplay');
        spyOn(component as any, 'hasAvailableDaysInMonth').and.returnValue(false);

        const event = {
          key: 'PageDown',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        const result = component['handlePageNavigation']('PageDown', false, 10, 9);

        expect(result).toBe(false);
        expect(component['updateDisplay']).not.toHaveBeenCalled();
      });

      it('hasAvailableDaysInMonth: should return true when month has available days', () => {
        spyOn(component as any, 'isDayDisabled').and.returnValues(true, false, true);

        const result = component['hasAvailableDaysInMonth'](2024, 5);

        expect(result).toBe(true);
      });

      it('hasAvailableDaysInMonth: should return false when all days are disabled', () => {
        spyOn(component as any, 'isDayDisabled').and.returnValue(true);

        const result = component['hasAvailableDaysInMonth'](2024, 5);

        expect(result).toBe(false);
      });

      it('handleSelectKey: should not select disabled day', () => {
        const day = new Date(2024, 5, 10);
        spyOn(component, 'onSelectDate');
        spyOn(component as any, 'isDayDisabled').and.returnValue(true);

        component['handleSelectKey'](day, 9);

        expect(component.onSelectDate).not.toHaveBeenCalled();
      });

      it('handleSelectKey: should select available day', () => {
        const day = new Date(2024, 5, 10);
        spyOn(component, 'onSelectDate');
        spyOn(component as any, 'isDayDisabled').and.returnValue(false);
        spyOn(component as any, 'focusElement');

        component['handleSelectKey'](day, 9);

        expect(component.onSelectDate).toHaveBeenCalledWith(day);
      });

      it('getFirstAvailableDayInWeek: should return first available day in week', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValues(true, true, false, false, false, false, false);

        const result = component['getFirstAvailableDayInWeek'](3);

        expect(result).toBe(2);
      });

      it('getLastAvailableDayInWeek: should return last available day in week', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValues(false, false, false, false, true, true, false);

        const result = component['getLastAvailableDayInWeek'](3);

        expect(result).toBe(6);
      });

      it('getFirstAvailableDayInWeek: should return weekStart when all days are disabled', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValue(true);

        const result = component['getFirstAvailableDayInWeek'](3);

        expect(result).toBe(0);
      });

      it('getFirstAvailableDayInWeek: should return weekStart when all days are from other month', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 4, 28),
          new Date(2024, 4, 29),
          new Date(2024, 4, 30),
          new Date(2024, 4, 31),
          new Date(2024, 6, 1),
          new Date(2024, 6, 2),
          new Date(2024, 6, 3)
        ];

        const result = component['getFirstAvailableDayInWeek'](3);

        expect(result).toBe(0);
      });

      it('getLastAvailableDayInWeek: should return weekStart when all days are disabled', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValue(true);

        const result = component['getLastAvailableDayInWeek'](3);

        expect(result).toBe(0);
      });

      it('getLastAvailableDayInWeek: should return weekStart when all days are from other month', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 4, 28),
          new Date(2024, 4, 29),
          new Date(2024, 4, 30),
          new Date(2024, 4, 31),
          new Date(2024, 6, 1),
          new Date(2024, 6, 2),
          new Date(2024, 6, 3)
        ];

        const result = component['getLastAvailableDayInWeek'](3);

        expect(result).toBe(0);
      });

      it('findNextAvailableDay: should find next available day forward', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValues(true, true, false);

        const result = component['findNextAvailableDay'](0, 'forward');

        expect(result).toBe(3);
      });

      it('getNavigationDirection: should return forward for ArrowRight', () => {
        const result = component['getNavigationDirection']('ArrowRight');
        expect(result).toBe('forward');
      });

      it('getNavigationDirection: should return forward for ArrowDown', () => {
        const result = component['getNavigationDirection']('ArrowDown');
        expect(result).toBe('forward');
      });

      it('getNavigationDirection: should return forward for End', () => {
        const result = component['getNavigationDirection']('End');
        expect(result).toBe('forward');
      });

      it('getNavigationDirection: should return backward for ArrowLeft', () => {
        const result = component['getNavigationDirection']('ArrowLeft');
        expect(result).toBe('backward');
      });

      it('getNavigationDirection: should return backward for ArrowUp', () => {
        const result = component['getNavigationDirection']('ArrowUp');
        expect(result).toBe('backward');
      });

      it('getNavigationDirection: should return backward for Home', () => {
        const result = component['getNavigationDirection']('Home');
        expect(result).toBe('backward');
      });

      it('getNavigationDirection: should return backward for any other key', () => {
        const result = component['getNavigationDirection']('PageDown');
        expect(result).toBe('backward');
      });

      it('findNextAvailableDay: should find next available day backward', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValues(true, true, false);

        const result = component['findNextAvailableDay'](3, 'backward');

        expect(result).toBe(0);
      });

      it('findNextAvailableDay: should return -1 when no available day found', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4)
        ];

        spyOn(component as any, 'isDayDisabled').and.returnValue(true);

        const result = component['findNextAvailableDay'](0, 'forward');

        expect(result).toBe(-1);
      });

      it('should skip disabled days when navigating with ArrowRight', () => {
        component.minDate = new Date(2024, 5, 1);
        component.maxDate = new Date(2024, 5, 30);
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5)
        ];
        component.displayMonthNumber = 5;
        component.displayYear = 2024;

        spyOn(component as any, 'isDayDisabled').and.returnValues(true, true, false, false);

        const event = {
          key: 'ArrowRight',
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;
        component.onDayKeydown(event, new Date(2024, 5, 1), 0);

        expect(component.focusedDayIndex).toBe(3);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should skip disabled days when navigating with ArrowLeft', () => {
        component.minDate = new Date(2024, 5, 1);
        component.maxDate = new Date(2024, 5, 30);
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5)
        ];
        component.displayMonthNumber = 5;
        component.displayYear = 2024;

        spyOn(component as any, 'isDayDisabled').and.returnValues(true, true, false, false);

        const event = { key: 'ArrowLeft', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;
        component.onDayKeydown(event, new Date(2024, 5, 4), 3);

        expect(component.focusedDayIndex).toBe(0);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not navigate when all days are disabled in direction', () => {
        component.minDate = new Date(2024, 5, 15);
        component.maxDate = new Date(2024, 5, 20);
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5)
        ];
        component.displayMonthNumber = 5;
        component.displayYear = 2024;

        spyOn(component as any, 'isDayDisabled').and.returnValues(false, true, true, true, false);

        const event = {
          key: 'ArrowRight',
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;
        component.onDayKeydown(event, new Date(2024, 5, 1), 0);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageUp without shiftKey in normal month', () => {
        const event = {
          key: 'PageUp',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        component.displayYear = 2024;
        component.displayMonthNumber = 5;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2024, 4);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should handle PageDown without shiftKey in normal month', () => {
        const event = {
          key: 'PageDown',
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        } as any as KeyboardEvent;

        component.displayYear = 2024;
        component.displayMonthNumber = 5;

        spyOn(component, <any>'updateDisplay');
        spyOn(component, <any>'focusOnSameDayAndWeek');

        component.onDayKeydown(event, new Date(2024, 5, 10), 9);

        expect(component['updateDisplay']).toHaveBeenCalledWith(2024, 6);
        expect(component['focusOnSameDayAndWeek']).toHaveBeenCalledWith(10, 9);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    it('should handle Enter key', () => {
      const mockDate = new Date(2026, 5, 10);
      const mockIndex = 15;
      const mockEvent = {
        key: 'Enter',
        preventDefault: jasmine.createSpy('preventDefault')
      } as unknown as KeyboardEvent;

      spyOn(component as any, 'isSelectionKey').and.returnValue(true);
      const handleSelectSpy = spyOn(component as any, 'handleSelectKey');

      component.onDayKeydown(mockEvent, mockDate, mockIndex);

      expect((component as any).isSelectionKey).toHaveBeenCalledWith('Enter');
      expect(handleSelectSpy).toHaveBeenCalledWith(mockDate, mockIndex);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    describe('focusOnSameDayAndWeek', () => {
      beforeEach(() => {
        try {
          jasmine.clock().uninstall();
        } catch {
          // Clock may not be installed yet
        }
        jasmine.clock().install();
      });

      afterEach(() => {
        try {
          jasmine.clock().uninstall();
        } catch {
          // Clock already uninstalled
        }
      });

      describe('focusOnSameDayAndWeek', () => {
        it('should focus same day in current month when found in same week column', fakeAsync(() => {
          component.displayMonthNumber = 5;
          component.displayDays = [
            new Date(2024, 4, 26),
            new Date(2024, 4, 27),
            new Date(2024, 4, 28),
            new Date(2024, 4, 29),
            new Date(2024, 4, 30),
            new Date(2024, 4, 31),
            new Date(2024, 5, 1),
            new Date(2024, 5, 2),
            new Date(2024, 5, 3),
            new Date(2024, 5, 4),
            new Date(2024, 5, 5),
            new Date(2024, 5, 6),
            new Date(2024, 5, 7),
            new Date(2024, 5, 8),
            new Date(2024, 5, 9),
            new Date(2024, 5, 10)
          ];
          component.focusedDayIndex = -1;

          const mockElement = document.createElement('div');
          const focusSpy = spyOn(mockElement, 'focus');

          spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
          spyOn(component.cdr, 'detectChanges');

          component['focusOnSameDayAndWeek'](10, 8);

          tick();

          expect(component.focusedDayIndex).toBe(15);
          expect(focusSpy).toHaveBeenCalled();
        }));

        it('should focus nearest day in weekUp when dayOfMonth not found', fakeAsync(() => {
          component.displayMonthNumber = 5;
          component.displayDays = [
            new Date(2024, 5, 1),
            new Date(2024, 5, 2),
            new Date(2024, 5, 3),
            new Date(2024, 5, 4),
            new Date(2024, 5, 5),
            new Date(2024, 5, 6),
            new Date(2024, 5, 7),
            new Date(2024, 5, 8),
            new Date(2024, 5, 9),
            new Date(2024, 5, 10),
            new Date(2024, 5, 11),
            new Date(2024, 5, 12),
            new Date(2024, 5, 13),
            new Date(2024, 5, 14)
          ];
          component.focusedDayIndex = -1;

          const mockElement = document.createElement('div');
          const focusSpy = spyOn(mockElement, 'focus');

          spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
          spyOn(component.cdr, 'detectChanges');

          component['focusOnSameDayAndWeek'](30, 10);

          tick();

          expect(component.focusedDayIndex).toBe(3);
          expect(focusSpy).toHaveBeenCalled();
        }));
      });

      it('should skip dates from other months during weekUp search', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 4, 26),
          new Date(2024, 4, 27),
          new Date(2024, 4, 28),
          new Date(2024, 4, 29),
          new Date(2024, 4, 30),
          new Date(2024, 4, 31),
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7),
          new Date(2024, 5, 8),
          new Date(2024, 5, 9),
          new Date(2024, 5, 10)
        ];
        component.focusedDayIndex = -1;

        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);

        component['focusOnSameDayAndWeek'](30, 13);
        jasmine.clock().tick(1);

        expect(component.focusedDayIndex).toBe(6);
        expect(focusSpy).toHaveBeenCalled();
      });

      it('should find date in weekUp search and set focusIndex', fakeAsync(() => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7),
          new Date(2024, 5, 8),
          new Date(2024, 5, 9),
          new Date(2024, 5, 10),
          new Date(2024, 5, 11),
          new Date(2024, 5, 12),
          new Date(2024, 5, 13),
          new Date(2024, 5, 14),
          new Date(2024, 5, 15),
          new Date(2024, 5, 16),
          new Date(2024, 5, 17),
          new Date(2024, 5, 18),
          new Date(2024, 5, 19),
          new Date(2024, 5, 20),
          new Date(2024, 5, 21),
          new Date(2024, 5, 22),
          new Date(2024, 5, 23),
          new Date(2024, 5, 24),
          new Date(2024, 5, 25),
          new Date(2024, 5, 26),
          new Date(2024, 5, 27),
          new Date(2024, 5, 28),
          new Date(2024, 5, 29),
          new Date(2024, 5, 30)
        ];
        component.focusedDayIndex = -1;

        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusOnSameDayAndWeek'](4, 24);

        tick();

        expect(component.focusedDayIndex).toBe(3);
        expect(focusSpy).toHaveBeenCalled();
      }));

      it('should focus nearest day in weekDown when dayOfMonth not found', fakeAsync(() => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7),
          new Date(2024, 5, 8),
          new Date(2024, 5, 9),
          new Date(2024, 5, 10),
          new Date(2024, 5, 11),
          new Date(2024, 5, 12),
          new Date(2024, 5, 13),
          new Date(2024, 5, 14)
        ];
        component.focusedDayIndex = -1;

        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusOnSameDayAndWeek'](30, 3);

        tick();

        expect(component.focusedDayIndex).toBe(10);
        expect(focusSpy).toHaveBeenCalled();
      }));

      it('should not change focus when no matching date is found', () => {
        component.displayMonthNumber = 5;
        component.displayDays = [];
        component.focusedDayIndex = 2;

        spyOn((component as any).elementRef.nativeElement, 'querySelector');

        component['focusOnSameDayAndWeek'](10, 0);
        jasmine.clock().tick(1);

        expect(component.focusedDayIndex).toBe(2);
        expect((component as any).elementRef.nativeElement.querySelector).not.toHaveBeenCalled();
      });

      it('should call getFirstAvailableDayInWeek when target day is disabled', fakeAsync(() => {
        component.displayMonthNumber = 5;
        component.displayDays = [
          new Date(2024, 5, 1),
          new Date(2024, 5, 2),
          new Date(2024, 5, 3),
          new Date(2024, 5, 4),
          new Date(2024, 5, 5),
          new Date(2024, 5, 6),
          new Date(2024, 5, 7),
          new Date(2024, 5, 8),
          new Date(2024, 5, 9),
          new Date(2024, 5, 10),
          new Date(2024, 5, 11),
          new Date(2024, 5, 12),
          new Date(2024, 5, 13),
          new Date(2024, 5, 14)
        ];
        component.focusedDayIndex = -1;
        component.minDate = new Date(2024, 5, 1);
        component.maxDate = new Date(2024, 5, 8);

        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');
        const getFirstAvailableSpy = spyOn(component as any, 'getFirstAvailableDayInWeek').and.returnValue(7);

        component['focusOnSameDayAndWeek'](9, 1);

        tick();

        expect(getFirstAvailableSpy).toHaveBeenCalledWith(8);
        expect(component.focusedDayIndex).toBe(7);
        expect(focusSpy).toHaveBeenCalled();
      }));
    });

    describe('focusElement', () => {
      beforeEach(() => {
        try {
          jasmine.clock().uninstall();
        } catch {}
        jasmine.clock().install();
      });

      afterEach(() => {
        try {
          jasmine.clock().uninstall();
        } catch {}
      });

      it('should set focusedDayIndex and call element.focus() when element is found', () => {
        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusElement'](5);

        jasmine.clock().tick(0);

        expect(component.focusedDayIndex).toBe(5);
        expect(component.cdr.detectChanges).toHaveBeenCalled();
        expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalledWith('[data-day-index="5"]');
        expect(focusSpy).toHaveBeenCalled();
      });

      it('should not call focus() when element is not found', () => {
        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(null);
        spyOn(component.cdr, 'detectChanges');

        component['focusElement'](10);

        jasmine.clock().tick(0);

        expect(component.focusedDayIndex).toBe(10);
        expect(component.cdr.detectChanges).toHaveBeenCalled();
        expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalledWith('[data-day-index="10"]');
      });

      it('should handle element that is not an HTMLElement', () => {
        const mockElement = { focus: jasmine.createSpy('focus') } as unknown as HTMLElement;
        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusElement'](3);

        jasmine.clock().tick(0);

        expect(component.focusedDayIndex).toBe(3);
        expect(component.cdr.detectChanges).toHaveBeenCalled();
        expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalledWith('[data-day-index="3"]');
      });

      it('should focus on element with index 0', () => {
        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusElement'](0);

        jasmine.clock().tick(0);

        expect(component.focusedDayIndex).toBe(0);
        expect(focusSpy).toHaveBeenCalled();
        expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalledWith('[data-day-index="0"]');
      });

      it('should focus on element with large index', () => {
        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');

        component['focusElement'](365);

        jasmine.clock().tick(0);

        expect(component.focusedDayIndex).toBe(365);
        expect(focusSpy).toHaveBeenCalled();
        expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalledWith(
          '[data-day-index="365"]'
        );
      });

      it('should use setTimeout with 0 delay before focusing', done => {
        const mockElement = document.createElement('div');
        const focusSpy = spyOn(mockElement, 'focus');

        spyOn((component as any).elementRef.nativeElement, 'querySelector').and.returnValue(mockElement);
        spyOn(component.cdr, 'detectChanges');
        spyOn(window, 'setTimeout').and.callThrough();

        component['focusElement'](7);

        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 0);

        jasmine.clock().tick(0);

        expect(focusSpy).toHaveBeenCalled();
        done();
      });
    });
  });
  it('should call updateDate with correct parameters', () => {
    spyOn(component, 'updateDate').and.callThrough();

    const year = 2023;
    const month = 5;

    component.templateContext.updateDate(year, month);
    expect(component.updateDate).toHaveBeenCalledWith(year, month, undefined);
  });

  it('ngOnChanges: should use the current date if activateDate.currentValue is null', () => {
    const spyUpdateDisplay = spyOn(component as any, 'updateDisplay');
    const changes: SimpleChanges = {
      activateDate: new SimpleChange(new Date(2023, 0, 1), null, false)
    };

    component.ngOnChanges(changes);

    const today = new Date();
    expect(spyUpdateDisplay).toHaveBeenCalledWith(today.getFullYear(), today.getMonth());
  });

  it('ngOnChanges: should use the new date if activateDate.currentValue is not null', () => {
    const spyUpdateDisplay = spyOn(component as any, 'updateDisplay');
    const newDate = new Date(2028, 5, 15);
    const changes: SimpleChanges = {
      activateDate: new SimpleChange(null, newDate, false)
    };

    component.ngOnChanges(changes);

    expect(spyUpdateDisplay).toHaveBeenCalledWith(2028, 5);
  });

  describe('ngOnChanges: ', () => {
    it('should update comboYearsOptions if minDate changes', () => {
      const spyOptions = spyOn((component as any).poCalendarService, 'getYearOptions').and.returnValue([
        { label: '2026', value: 2026 }
      ]);
      const spyContext = spyOn(component as any, 'updateTemplateContext');

      const changes: SimpleChanges = {
        minDate: new SimpleChange(null, new Date(2020, 0, 1), true)
      };

      component.ngOnChanges(changes);

      expect(spyOptions).toHaveBeenCalled();
      expect(spyContext).toHaveBeenCalled();
    });

    it('should increment comboKey and call detectChanges if the locale changes after the first time', () => {
      const spyCdr = spyOn((component as any).cdr, 'detectChanges');
      component.comboKey = 0;

      const changes: SimpleChanges = {
        locale: new SimpleChange('pt-BR', 'en-US', false)
      };

      component.ngOnChanges(changes);

      expect(component.comboKey).toBe(1);
      expect(spyCdr).toHaveBeenCalled();
    });
  });

  it('should call updateTemplateContext when locale is changed to a different value', () => {
    component.locale = 'en-US';
    spyOn(component as any, 'updateTemplateContext');

    component.ngOnChanges({
      locale: new SimpleChange('en-US', 'es-ES', false)
    });

    expect((component as any).updateTemplateContext).toHaveBeenCalled();
    expect(component.comboKey).toBe(1);
  });

  it('should not call updateTemplateContext when locale is unchanged', () => {
    component.locale = 'en-US';
    spyOn(component as any, 'updateTemplateContext');

    component.ngOnChanges({
      locale: new SimpleChange('en-US', 'en-US', false)
    });

    expect((component as any).updateTemplateContext).not.toHaveBeenCalled();
    expect(component.comboKey).toBe(0);
  });

  it('should call updateTemplateContext when locale is set to undefined', () => {
    component.locale = 'en-US';
    spyOn(component as any, 'updateTemplateContext');

    component.ngOnChanges({
      locale: new SimpleChange('en-US', undefined, false)
    });

    expect((component as any).updateTemplateContext).toHaveBeenCalled();
    expect(component.comboKey).toBe(1);
  });

  it('should call updateTemplateContext when locale is set to an empty string', () => {
    component.locale = 'en-US';
    spyOn(component as any, 'updateTemplateContext');

    component.ngOnChanges({
      locale: new SimpleChange('en-US', '', false)
    });

    expect((component as any).updateTemplateContext).toHaveBeenCalled();
    expect(component.comboKey).toBe(1);
  });

  it('should call updateDate when onHeaderDateChange is triggered', () => {
    const event = { year: 2023, month: 5 };

    spyOn(component, <any>'updateDisplay').and.callThrough();
    spyOn(component.headerChange, 'emit');

    component.onHeaderDateChange(event);

    expect(component.mode).toBe('day');
    expect(component['updateDisplay']).toHaveBeenCalledWith(event.year, event.month);
  });

  it('updateDate: should emit headerChange only once with 1-indexed month', () => {
    spyOn(component, <any>'updateDisplay');
    spyOn(component.headerChange, 'emit');

    component.updateDate(2025, 5);

    expect(component.headerChange.emit).toHaveBeenCalledTimes(1);
    expect(component.headerChange.emit).toHaveBeenCalledWith({ month: 6, year: 2025 });
  });

  it('updateDate: should not emit headerChange when no change', () => {
    component.displayYear = 2025;
    component.displayMonthNumber = 5;

    spyOn(component, <any>'updateDisplay');
    spyOn(component.headerChange, 'emit');

    component.updateDate(2025, 5);

    expect(component.headerChange.emit).not.toHaveBeenCalled();
  });

  it('updateDate: should call comboComponent.focus if comboComponent has focus function', fakeAsync(() => {
    component.displayYear = 2024;
    component.displayMonthNumber = 5;
    const comboComponent = { focus: jasmine.createSpy('focus') };
    spyOn(component as any, 'updateDisplay');
    component.updateDate(2024, 5, comboComponent);
    tick();
    expect(comboComponent.focus).toHaveBeenCalled();
    expect((component as any).updateDisplay).toHaveBeenCalledWith(2024, 5);
  }));

  it('should update templateContext and return when year or month is invalid', () => {
    component.templateContext = { year: 2022, monthIndex: 5 };
    spyOn(component as any, 'updateDisplay');
    spyOn(component.headerChange, 'emit');

    component.updateDate(undefined, 5);
    expect(component.templateContext.year).toBeUndefined();
    expect(component.templateContext.monthIndex).toBe(5);
    expect((component as any).updateDisplay).not.toHaveBeenCalled();
    expect(component.headerChange.emit).not.toHaveBeenCalled();

    component.updateDate(2022, undefined);
    expect(component.templateContext.year).toBe(2022);
    expect(component.templateContext.monthIndex).toBeUndefined();
    expect((component as any).updateDisplay).not.toHaveBeenCalled();
    expect(component.headerChange.emit).not.toHaveBeenCalled();

    component.updateDate(undefined, undefined);
    expect(component.templateContext.year).toBeUndefined();
    expect(component.templateContext.monthIndex).toBeUndefined();
    expect((component as any).updateDisplay).not.toHaveBeenCalled();
    expect(component.headerChange.emit).not.toHaveBeenCalled();
  });

  it('onSelectMonth: should not emit headerChange directly', () => {
    spyOn(component, <any>'selectDisplayMode');
    spyOn(component, <any>'updateDisplay');
    spyOn(component.headerChange, 'emit');

    component.onSelectMonth(2025, 5);

    expect(component['selectDisplayMode']).toHaveBeenCalledWith('day');
    expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 5);
    expect(component.headerChange.emit).not.toHaveBeenCalled();
  });

  it('onSelectYear: should not emit headerChange directly', () => {
    component['lastDisplay'] = 'month';

    spyOn(component, <any>'selectDisplayMode');
    spyOn(component, <any>'updateDisplay');
    spyOn(component.headerChange, 'emit');

    component.onSelectYear(2025, 5);

    expect(component['selectDisplayMode']).toHaveBeenCalledWith('month');
    expect(component['updateDisplay']).toHaveBeenCalledWith(2025, 5);
    expect(component.headerChange.emit).not.toHaveBeenCalled();
  });

  describe('trackBy', () => {
    it('trackByYear: should return the year value', () => {
      const year = 2026;
      expect(component.trackByYear(0, year)).toBe(year);
    });

    it('trackByMonth: should return the provided index', () => {
      const index = 11;
      const month = 'Dezembro';
      expect(component.trackByMonth(index, month)).toBe(index);
    });

    it('trackByWeekDay: should return a string composed of index and day', () => {
      const index = 2;
      const weekDay = 'Terça-feira';
      const expected = '2:Terça-feira';
      expect(component.trackByWeekDay(index, weekDay)).toBe(expected);
    });

    describe('trackByDay', () => {
      it('should return a formatted string with year-month-day for a valid date', () => {
        const index = 10;
        const date = new Date(2026, 1, 18);
        const expected = '10:2026-1-18';

        expect(component.trackByDay(index, date)).toBe(expected);
      });

      it('should return "invalid-index" when the date is null', () => {
        const index = 5;
        expect(component.trackByDay(index, null as any)).toBe('invalid-5');
      });

      it('should return "invalid-index" when the object is not an instance of Date', () => {
        const index = 7;
        expect(component.trackByDay(index, { day: 1 } as any)).toBe('invalid-7');
      });
    });
  });

  describe('Business Logic (Dates)', () => {
    it('equalsDate: should return true for the same dates', () => {
      const d1 = new Date(2026, 5, 10);
      const d2 = new Date(2026, 5, 10);
      expect(component['equalsDate'](d1, d2)).toBeTrue();
    });

    it('equalsDate: should return false for different dates', () => {
      const d1 = new Date(2026, 5, 10);
      const d2 = new Date(2026, 5, 11);
      expect(component['equalsDate'](d1, d2)).toBeFalse();
    });
  });

  describe('Métodos de Rastreio (trackBy)', () => {
    it('trackByYear: deve retornar o valor do ano', () => {
      expect(component.trackByYear(0, 2026)).toBe(2026);
    });

    it('trackByMonth: deve retornar o índice', () => {
      expect(component.trackByMonth(5, 'Junho')).toBe(5);
    });

    it('trackByWeekDay: deve retornar chave composta string', () => {
      expect(component.trackByWeekDay(1, 'Segunda')).toBe('1:Segunda');
    });

    it('trackByDay: deve retornar chave composta baseada na data', () => {
      const date = new Date(2026, 1, 18);
      expect(component.trackByDay(10, date)).toBe('10:2026-1-18');
    });

    it('trackByDay: deve retornar fallback para data inválida', () => {
      expect(component.trackByDay(5, null as any)).toBe('invalid-5');
    });
  });

  describe('selectDisplayMode', () => {
    it('deve atualizar mode, salvar lastDisplay e disparar detectChanges', () => {
      const cdrSpy = spyOn(component.cdr, 'detectChanges');
      component.mode = 'day';

      component.selectDisplayMode('month');

      expect(component.mode).toBe('month');
      expect(component['lastDisplay']).toBe('day');
      expect(cdrSpy).toHaveBeenCalled();
    });

    it('deve manter a cadeia de estados em múltiplas trocas', () => {
      component.mode = 'day';

      component.selectDisplayMode('month');
      component.selectDisplayMode('year');

      expect(component.mode).toBe('year');
      expect(component['lastDisplay']).toBe('month');
    });
  });

  it('onSelectMonth: should update display and set mode to day', () => {
    const updateSpy = spyOn(component as any, 'updateDisplay');

    component.onSelectMonth(2026, 5);

    expect(component.mode).toBe('day');
    expect(updateSpy).toHaveBeenCalledWith(2026, 5);
  });

  it('onSelectYear: should restore lastDisplay if it was month', () => {
    component['lastDisplay'] = 'month';
    component.onSelectYear(2030, 0);

    expect(component.mode).toBe('month');
    expect(component.currentYear).toBe(2030);
  });

  it('onClear: should emit undefined when clearing', () => {
    spyOn(component.selectDate, 'emit');
    component.onClear();
    expect(component.selectDate.emit).toHaveBeenCalledWith(undefined);
  });

  it('getRangeColor: should return undefined if start date is null', () => {
    component.selectedValue = {
      start: null,
      end: new Date(2026, 5, 20)
    };

    const dataTestada = new Date(2026, 5, 10);
    const prefix = 'po-calendar-box-background';

    const result = (component as any).getRangeColor(dataTestada, prefix, 'background');

    expect(result).toBeUndefined();
  });

  describe('Tabulation', () => {
    it('setInitialFocusedDay: should fallback to first available day when multiple available days exist', () => {
      component.value = null;
      component.displayMonthNumber = 5;

      component.displayDays = [new Date(2026, 4, 30), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];

      spyOn(component as any, 'isDayDisabled').and.callFake((date: Date) => {
        return date.getDate() === 1;
      });

      component.focusedDayIndex = 0;

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
    });

    it('setInitialFocusedDay: should not change focusedDayIndex when all days are disabled', () => {
      component.value = null;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);
      component.focusedDayIndex = 2;
      (component as any).setInitialFocusedDay();
      const expectedIndex = component.displayDays.findIndex(
        day =>
          day instanceof Date &&
          day.getMonth() === component.displayMonthNumber &&
          !(component as any).isDayDisabled(day)
      );
      expect(component.focusedDayIndex).toBe(expectedIndex === -1 ? 2 : expectedIndex);
    });

    it('setInitialFocusedDay: should not change focusedDayIndex when no days from current month exist', () => {
      component.value = null;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 30), new Date(2026, 4, 31)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);
      component.focusedDayIndex = 5;
      (component as any).setInitialFocusedDay();
      const expectedIndex = component.displayDays.findIndex(
        day =>
          day instanceof Date &&
          day.getMonth() === component.displayMonthNumber &&
          !(component as any).isDayDisabled(day)
      );
      expect(component.focusedDayIndex).toBe(expectedIndex === -1 ? 5 : expectedIndex);
    });

    beforeEach(() => {
      component.displayYear = 2026;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
    });

    it('should update focusedDayIndex to first available day in current month', () => {
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      component.focusedDayIndex = 0;

      spyOn(component as any, 'isDayDisabled').and.callFake((date: Date) => {
        return date.getDate() === 1;
      });

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
      expect((component as any).isDayDisabled).toHaveBeenCalled();
    });

    it('should not change focusedDayIndex if no available day in current month', () => {
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);
      component.focusedDayIndex = 2;
      (component as any).setInitialFocusedDay();
      const expectedIndex = component.displayDays.findIndex(
        day =>
          day instanceof Date &&
          day.getMonth() === component.displayMonthNumber &&
          !(component as any).isDayDisabled(day)
      );
      expect(component.focusedDayIndex).toBe(expectedIndex === -1 ? 2 : expectedIndex);
    });

    it('setInitialFocusedDay: should focus on selected day if available', () => {
      component.value = new Date(2026, 5, 2);
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
    });

    it('setInitialFocusedDay: should focus on first available day if no selection', () => {
      component.value = null;
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('setInitialFocusedDay: should skip disabled days and other months', () => {
      component.value = null;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      spyOn(component as any, 'isDayDisabled').and.returnValues(true, false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
    });

    it('setInitialFocusedDay: should focus on value.start when value is range object', () => {
      component.value = { start: new Date(2026, 5, 2), end: new Date(2026, 5, 10) };
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
    });

    it('setInitialFocusedDay: should focus on value.start when value is range object without end', () => {
      component.displayDays = [
        new Date(2026, 4, 31),
        new Date(2026, 5, 1),
        new Date(2026, 5, 2),
        new Date(2026, 5, 3),
        new Date(2026, 5, 4),
        new Date(2026, 5, 5)
      ];
      component.value = { start: new Date(2026, 5, 5), end: null };
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(5);
    });

    it('setInitialFocusedDay: should fallback to first available when value.start is disabled', () => {
      component.value = { start: new Date(2026, 5, 2), end: null };
      spyOn(component as any, 'isDayDisabled').and.returnValues(true, false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('setInitialFocusedDay: should fallback to first available when value.start is in different month', () => {
      component.value = { start: new Date(2026, 4, 15), end: null };
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('setInitialFocusedDay: should handle value object with null start', () => {
      component.value = { start: null, end: null };
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('setInitialFocusedDay: should handle value object with undefined start', () => {
      component.value = { start: undefined, end: undefined };
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('setInitialFocusedDay: should not change focusedDayIndex when all days are disabled', () => {
      component.value = null;
      component.displayMonthNumber = 5;
      component.focusedDayIndex = 0;
      component.displayDays = [new Date(2026, 4, 30), new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);

      (component as any).setInitialFocusedDay();

      const expectedIndex = component.displayDays.findIndex(
        day =>
          day instanceof Date &&
          day.getMonth() === component.displayMonthNumber &&
          !(component as any).isDayDisabled(day)
      );
      expect(component.focusedDayIndex).toBe(expectedIndex === -1 ? 0 : expectedIndex);
    });

    it('setInitialFocusedDay: should not change focusedDayIndex when no days from current month exist', () => {
      component.value = null;
      component.displayMonthNumber = 5;
      component.focusedDayIndex = 5;
      component.displayDays = [new Date(2026, 4, 30), new Date(2026, 4, 31)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);

      (component as any).setInitialFocusedDay();

      expect(component.focusedDayIndex).toBe(5);
    });

    it('getDayTabIndex: should return -1 for disabled days even if focused', () => {
      const disabledDay = new Date(2026, 5, 1);
      component.displayMonthNumber = 5;
      component.focusedDayIndex = 1;
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);

      const tabIndex = component.getDayTabIndex(disabledDay, 1);

      expect(tabIndex).toBe(-1);
      expect((component as any).isDayDisabled).toHaveBeenCalledWith(disabledDay);
    });

    it('getDayTabIndex: should return -1 for days from other months', () => {
      const otherMonthDay = new Date(2026, 4, 31);

      const tabIndex = component.getDayTabIndex(otherMonthDay, 0);

      expect(tabIndex).toBe(-1);
    });

    it('getDayTabIndex: should return 0 only for focused day', () => {
      const day = new Date(2026, 5, 2);
      component.focusedDayIndex = 2;
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      const tabIndexFocused = component.getDayTabIndex(day, 2);
      const tabIndexNotFocused = component.getDayTabIndex(day, 1);

      expect(tabIndexFocused).toBe(0);
      expect(tabIndexNotFocused).toBe(-1);
    });

    it('getDayTabIndex: should return -1 for null day', () => {
      const tabIndex = component.getDayTabIndex(null, 0);
      expect(tabIndex).toBe(-1);
    });

    it('getDayTabIndex: should return -1 for undefined day', () => {
      const tabIndex = component.getDayTabIndex(undefined, 0);
      expect(tabIndex).toBe(-1);
    });

    it('getDayTabIndex: should return -1 for non-Date object', () => {
      const tabIndex = component.getDayTabIndex({ day: 1 } as any, 0);
      expect(tabIndex).toBe(-1);
    });
  });

  describe('Focus Management', () => {
    it('ensureValidFocusedDay: should maintain focusedDayIndex when current day is valid', () => {
      component.focusedDayIndex = 2;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).ensureValidFocusedDay();

      expect(component.focusedDayIndex).toBe(2);
    });

    it('ensureValidFocusedDay: should update focusedDayIndex when current day is disabled', () => {
      component.focusedDayIndex = 2;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 5, 1), new Date(2026, 5, 2), new Date(2026, 5, 3), new Date(2026, 5, 4)];

      spyOn(component as any, 'isDayDisabled').and.returnValues(true, false);

      (component as any).ensureValidFocusedDay();

      expect(component.focusedDayIndex).toBe(0);
    });

    it('ensureValidFocusedDay: should update focusedDayIndex when current day is from another month', () => {
      component.focusedDayIndex = 0;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 4, 31), new Date(2026, 5, 1), new Date(2026, 5, 2)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(false);

      (component as any).ensureValidFocusedDay();

      expect(component.focusedDayIndex).toBe(1);
    });

    it('ensureValidFocusedDay: should not change focusedDayIndex when no valid days available', () => {
      component.focusedDayIndex = 0;
      component.displayMonthNumber = 5;
      component.displayDays = [new Date(2026, 5, 1), new Date(2026, 5, 2)];
      spyOn(component as any, 'isDayDisabled').and.returnValue(true);

      (component as any).ensureValidFocusedDay();

      expect(component.focusedDayIndex).toBe(0);
    });
  });

  it('should focus on the same day and week', fakeAsync(() => {
    const mockElement = document.createElement('div');
    const focusSpy = spyOn(mockElement, 'focus');

    spyOn((component as any).elementRef.nativeElement, 'querySelector').and.callFake((selector: string) => {
      if (selector.includes('data-day-index')) {
        return mockElement;
      }
      return null;
    });

    component.displayDays = new Array(42).fill(new Date());
    component.displayMonthNumber = new Date().getMonth();
    (component as any).focusOnSameDayAndWeek(10, 15);

    tick();

    expect((component as any).elementRef.nativeElement.querySelector).toHaveBeenCalled();

    expect(focusSpy).toHaveBeenCalled();
  }));

  describe('onComboBlur', () => {
    it('should call component.onComboBlur when templateContext.onComboBlur is invoked', () => {
      const spy = spyOn(component, 'onComboBlur');
      component.templateContext.onComboBlur();
      expect(spy).toHaveBeenCalled();
    });

    it('should call updateDisplay when templateContext.onComboBlur is triggered and month is undefined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.displayYear = 2022;
      component.displayMonthNumber = 3;
      component.today = new Date(2022, 3, 10);
      component.templateContext.year = 2022;
      component.templateContext.monthIndex = undefined;
      component.templateContext.onComboBlur();
      expect(updateDisplaySpy).toHaveBeenCalledWith(2022, 3);
    });

    it('should call updateDisplay with today.getMonth() when month is undefined and displayMonthNumber is also undefined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.displayYear = 2022;
      component.displayMonthNumber = undefined;
      component.today = new Date(2022, 7, 20);
      component.templateContext.year = 2022;
      component.templateContext.monthIndex = undefined;
      component.onComboBlur();
      expect(updateDisplaySpy).toHaveBeenCalledWith(2022, 7);
    });

    it('should call updateDisplay with safe values when year or month is undefined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.displayYear = 2025;
      component.displayMonthNumber = 6;
      component.today = new Date(2025, 6, 15);
      component.templateContext.year = undefined;
      component.templateContext.monthIndex = undefined;
      component.onComboBlur();
      expect(updateDisplaySpy).toHaveBeenCalledWith(2025, 6);
    });

    it('should call updateDisplay with safe year when only year is undefined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.displayYear = 2023;
      component.displayMonthNumber = 4;
      component.today = new Date(2023, 4, 10);
      component.templateContext.year = undefined;
      component.templateContext.monthIndex = 2;
      component.onComboBlur();
      expect(updateDisplaySpy).toHaveBeenCalledWith(2023, 2);
    });

    it('should call updateDisplay with safe month when only month is undefined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.displayYear = 2022;
      component.displayMonthNumber = 8;
      component.today = new Date(2022, 8, 20);
      component.templateContext.year = 2022;
      component.templateContext.monthIndex = undefined;
      component.onComboBlur();
      expect(updateDisplaySpy).toHaveBeenCalledWith(2022, 8);
    });

    it('should NOT call updateDisplay when both year and month are defined', () => {
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      component.templateContext.year = 2024;
      component.templateContext.monthIndex = 5;
      component.onComboBlur();
      expect(updateDisplaySpy).not.toHaveBeenCalled();
    });

    it('onComboBlur: should fallback to today.getFullYear() when year and displayYear are undefined', () => {
      component.displayYear = undefined;
      component.templateContext.year = undefined;
      component.templateContext.monthIndex = 5;
      spyOn(component, 'updateDisplay');
      const todayYear = component.today.getFullYear();
      component.onComboBlur();
      expect((component as any).updateDisplay).toHaveBeenCalledWith(todayYear, 5);
    });

    it('onComboBlur: should fallback to today.getFullYear() when year and displayYear are undefined', () => {
      component.displayYear = undefined;
      component.templateContext.year = undefined;
      component.templateContext.monthIndex = 5;
      spyOn(component as any, 'updateDisplay');
      const todayYear = component.today.getFullYear();
      component.onComboBlur();
      expect((component as any).updateDisplay).toHaveBeenCalledWith(todayYear, 5);
    });

    it('should call onComboBlur from templateContext', () => {
      const spy = spyOn(component, 'onComboBlur');
      component.templateContext.onComboBlur();
      expect(spy).toHaveBeenCalled();
    });

    it('should call onComboBlur after templateContext reassignment', () => {
      const spy = spyOn(component, 'onComboBlur');
      component.templateContext = {
        ...component.templateContext,
        onComboBlur: () => component.onComboBlur()
      };
      component.templateContext.onComboBlur();
      expect(spy).toHaveBeenCalled();
    });

    it('should not throw if templateContext.onComboBlur is missing', () => {
      component.templateContext = {
        ...component.templateContext
      };
      delete component.templateContext.onComboBlur;
      expect(() => {
        if (component.templateContext.onComboBlur) {
          component.templateContext.onComboBlur();
        }
      }).not.toThrow();
    });

    it('should call onComboBlur with context bound to component', () => {
      const spy = spyOn(component, 'onComboBlur');
      const fn = component.onComboBlur.bind(component);
      component.templateContext.onComboBlur = fn;
      component.templateContext.onComboBlur();
      expect(spy).toHaveBeenCalled();
    });

    it('should not call component onComboBlur if context is bound to another object', () => {
      const other = { onComboBlur: jasmine.createSpy('onComboBlur') };
      component.templateContext.onComboBlur = other.onComboBlur;
      component.templateContext.onComboBlur();
      expect(other.onComboBlur).toHaveBeenCalled();
    });

    it('deve executar onComboBlur através do templateContext', () => {
      spyOn(component, 'onComboBlur');

      component['updateTemplateContext']();

      component.templateContext.onComboBlur();

      expect(component.onComboBlur).toHaveBeenCalled();
    });

    it('deve executar updateDate através do templateContext', () => {
      spyOn(component, 'updateDate');

      component['updateTemplateContext']();

      component.templateContext.updateDate(2026, 5, null);

      expect(component.updateDate).toHaveBeenCalledWith(2026, 5, null);
    });
  });

  describe('onSelectToday', () => {
    it('should call onComboBlur from templateContext', () => {
      const spy = spyOn(component, 'onComboBlur');
      component.templateContext.onComboBlur();
      expect(spy).toHaveBeenCalled();
    });

    it('should call onSelectDate, updateDisplay, set focusedDayIndex and call detectChanges', () => {
      const today = new Date(2026, 1, 27);
      component.today = today;
      component.displayYear = 2025;
      component.displayMonthNumber = 0;
      component.displayDays = [new Date(2026, 1, 25), new Date(2026, 1, 26), today, new Date(2026, 1, 28)];
      spyOn(component, 'onSelectDate');
      spyOn(component as any, 'updateDisplay');
      spyOn(component.cdr, 'detectChanges');

      component.onSelectToday();

      expect(component.onSelectDate).toHaveBeenCalledWith(today);
      expect((component as any).updateDisplay).toHaveBeenCalledWith(today.getFullYear(), today.getMonth());
      expect(component.focusedDayIndex).toBe(2);
      expect(component.cdr.detectChanges).toHaveBeenCalled();
    });

    it('should not updateDisplay if month and year already match today', () => {
      const today = new Date(2026, 1, 27);
      component.today = today;
      component.displayYear = today.getFullYear();
      component.displayMonthNumber = today.getMonth();
      component.displayDays = [today];
      spyOn(component, 'onSelectDate');
      const updateDisplaySpy = spyOn(component as any, 'updateDisplay');
      spyOn(component.cdr, 'detectChanges');

      component.onSelectToday();

      expect(updateDisplaySpy).not.toHaveBeenCalled();
      expect(component.onSelectDate).toHaveBeenCalledWith(today);
      expect(component.focusedDayIndex).toBe(0);
      expect(component.cdr.detectChanges).toHaveBeenCalled();
    });

    it('should not set focusedDayIndex or call detectChanges if today is not found in displayDays', () => {
      const today = new Date(2026, 1, 27);
      component.today = today;
      component.displayYear = today.getFullYear();
      component.displayMonthNumber = today.getMonth();
      component.displayDays = [new Date(2026, 1, 25), new Date(2026, 1, 26)];
      component.focusedDayIndex = 5;
      spyOn(component, 'onSelectDate');
      spyOn(component.cdr, 'detectChanges');

      component.onSelectToday();

      expect(component.onSelectDate).toHaveBeenCalledWith(today);
      expect(component.focusedDayIndex).toBe(5);
      expect(component.cdr.detectChanges).not.toHaveBeenCalled();
    });
  });
  describe('Tests: onHostKeydown', () => {
    it('should call restoreOriginalDisplay if pressing Shift+Tab and focus leaves the component', fakeAsync(() => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

      spyOn(component.elementRef.nativeElement, 'contains').and.returnValue(false);

      const restoreSpy = spyOn(component as any, 'restoreOriginalDisplay');

      component.onHostKeydown(event);

      tick(0);
      tick(200);

      expect(restoreSpy).toHaveBeenCalled();
    }));

    it('should not call restoreOriginalDisplay if pressing Shift+Tab but focus remains inside the component', fakeAsync(() => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

      spyOn(component.elementRef.nativeElement, 'contains').and.returnValue(true);
      const restoreSpy = spyOn(component as any, 'restoreOriginalDisplay');

      component.onHostKeydown(event);
      tick(200);

      expect(restoreSpy).not.toHaveBeenCalled();
    }));

    it('should not do anything if the key pressed is not Shift + Tab', fakeAsync(() => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      const restoreSpy = spyOn(component as any, 'restoreOriginalDisplay');

      component.onHostKeydown(event);
      tick(200);

      expect(restoreSpy).not.toHaveBeenCalled();
    }));

    it('should call updateDisplay when the YEAR is different but the month is the same', () => {
      component.value = new Date(2026, 4, 10);
      component.displayYear = 2025;
      component.displayMonthNumber = 4;

      const updateSpy = spyOn(component as any, 'updateDisplay');

      component['restoreOriginalDisplay']();

      expect(updateSpy).toHaveBeenCalledWith(2026, 4);
    });

    it('should call updateDisplay when the YEAR is the same but the month is different', () => {
      component.value = new Date(2026, 4, 10);
      component.displayYear = 2026;
      component.displayMonthNumber = 11;

      const updateSpy = spyOn(component as any, 'updateDisplay');

      component['restoreOriginalDisplay']();

      expect(updateSpy).toHaveBeenCalledWith(2026, 4);
    });

    it('should not call updateDisplay when the YEAR and MONTH are already correct on the screen', () => {
      component.value = new Date(2026, 4, 10);
      component.displayYear = 2026;
      component.displayMonthNumber = 4;

      const updateSpy = spyOn(component as any, 'updateDisplay');

      component['restoreOriginalDisplay']();

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
