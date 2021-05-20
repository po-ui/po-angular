import { ComponentFixture, TestBed } from '@angular/core/testing';

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

  describe('Methods:', () => {
    it('ngOnChanges: shouldn`t call updateDate if activateDate.currentValue is falsy', () => {
      const changes = {};

      spyOn(component, <any>'updateDate');

      component.ngOnChanges(changes);

      expect(component['updateDate']).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call updateDate if activateDate.currentValue is truthy', () => {
      const today = new Date();

      const changes = {
        activateDate: { currentValue: today }
      };

      spyOn(component, <any>'updateDate');

      component.ngOnChanges(changes);

      expect(component['updateDate']).toHaveBeenCalledWith(today);
    });

    it(`initializeLanguage: should call 'setLanguage', 'getWeekDaysArray' and 'getMonthsArray' of
      the 'poCalendarLangService' and set the value of displayWeekDays and displayMonths`, () => {
      const weekDays = ['sun', 'mon', 'tue'];
      const months = ['jan', 'feb', 'mar'];
      component.locale = 'en';

      spyOn(component['poCalendarLangService'], 'setLanguage');
      spyOn(component['poCalendarLangService'], 'getWeekDaysArray').and.returnValue(weekDays);
      spyOn(component['poCalendarLangService'], 'getMonthsArray').and.returnValue(months);

      component['initializeLanguage']();

      expect(component['poCalendarLangService'].setLanguage).toHaveBeenCalledWith(component.locale);
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

    it('getDayForegroundColor: should call `getDayColor` with `date` and `foreground`', () => {
      const date = new Date(2018, 5, 5);

      spyOn(component, <any>'getDayColor');

      component.getDayForegroundColor(date);

      expect(component['getDayColor']).toHaveBeenCalledWith(date, 'foreground');
    });

    it('getForegroundColor: should return `po-calendar-box-foreground-selected` if displayValue is equal propertyValue', () => {
      expect(component.getForegroundColor(10, 10)).toBe('po-calendar-box-foreground-selected');
    });

    it('getForegroundColor: should return `po-calendar-box-foreground` if displayValue is not equal propertyValue', () => {
      expect(component.getForegroundColor(11, 10)).toBe('po-calendar-box-foreground');
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

      spyOn(component, <any>'equalsDate').and.returnValue(true);
      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, 'background');

      expect(result).toBe(colorClass);
    });

    it(`getDayColor: should call 'equalsDate' with 'dateParam' and 'this.date' and return value of the 'getColorForDate'
      if 'equalsDate' return 'true'`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2018, 5, 6);

      spyOn(component, <any>'equalsDate').and.returnValue(true);
      spyOn(component, <any>'getColorForDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, 'background');

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['date']);
    });

    it(`getDayColor: should call 'equalsDate' with 'dateParam' and 'this.today' and return 'po-calendar-box-background-today'
      if 'equalsDate' return 'true'`, () => {
      const colorClass = 'po-calendar-box-background-today';
      const dateParam = new Date(2018, 5, 6);

      spyOn(component, <any>'equalsDate').and.returnValues(false, true);
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

      spyOn(component, <any>'equalsDate').and.returnValue(false);
      spyOn(component, <any>'getColorForDefaultDate').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, local);

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['today']);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['date']);
      expect(component['getColorForDefaultDate']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`getDayColor: should call 'getColorForDate' if range is true and date param is equal to selectedValue.start`, () => {
      const colorClass = 'po-calendar-box-background-selected';
      const dateParam = new Date(2020, 5, 6);
      const local = 'background';

      component.selectedValue = { start: new Date(2020, 5, 6), end: null };
      component.range = true;

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

      spyOn(component, <any>'equalsDate').and.callThrough();
      spyOn(component, <any>'getColorForDateRange').and.callThrough();

      expect(component['getDayColor'](dateParam, local)).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalled();
      expect(component['getColorForDateRange']).toHaveBeenCalledWith(dateParam, local);
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

    it(`init: should call 'updateDate' with activateDate, selectDisplayMode with 'day' and initializeLanguage`, () => {
      component['activateDate'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDate');
      spyOn(component, <any>'selectDisplayMode');
      spyOn(component, <any>'initializeLanguage');

      component['init']();

      expect(component['initializeLanguage']).toHaveBeenCalled();
      expect(component['updateDate']).toHaveBeenCalledWith(component['activateDate']);
      expect(component['selectDisplayMode']).toHaveBeenCalledWith('day');
    });

    it(`updateDate: should set 'currentMonthNumber' and 'currentYear' to 'date.getMonth()' and 'date.getFullYear()' and
      call 'updateDisplay'`, () => {
      const date = new Date();

      spyOn(component, <any>'updateDisplay');

      component['updateDate'](date);

      expect(component['currentMonthNumber']).toBe(date.getMonth());
      expect(component.currentYear).toBe(date.getFullYear());
      expect(component['updateDisplay']).toHaveBeenCalledWith(component.currentYear, component['currentMonthNumber']);
    });

    it(`updateDate: should set 'currentMonthNumber' and 'currentYear' with today default date andbcall 'updateDisplay'`, () => {
      const today = new Date();

      spyOn(component, <any>'updateDisplay');

      component['updateDate']();

      expect(component['currentMonthNumber']).toBe(today.getMonth());
      expect(component.currentYear).toBe(today.getFullYear());
      expect(component['updateDisplay']).toHaveBeenCalledWith(component.currentYear, component['currentMonthNumber']);
    });

    it(`updateDecade: should call 'addAllYearsInDecade' and update 'displayStartDecade' and 'displayFinalDecade'`, () => {
      spyOn(component, <any>'addAllYearsInDecade');

      component['updateDecade'](2000);

      expect(component['displayStartDecade']).toBe(2000);
      expect(component['displayFinalDecade']).toBe(2009);
      expect(component['addAllYearsInDecade']).toHaveBeenCalledWith(2000);
    });

    it(`updateDisplay: should call 'poCalendarService.monthDays' to set 'displayDays'`, () => {
      const monthDays = [1, 2, 3, 4];
      const year = 2018;
      const month = 2;

      spyOn(component['poCalendarService'], 'monthDays').and.returnValue([...monthDays]);

      component['updateDisplay'](year, month);

      expect(component['displayDays']).toEqual(monthDays);
      expect(component['poCalendarService']['monthDays']).toHaveBeenCalledWith(year, month);
    });

    it(`updateDisplay: should set 'displayMonthNumber', 'displayMonth', 'displayYear' and call 'getDecadeArray'
      with 'year'`, () => {
      const monthDays = [1, 2, 3, 4];
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

      spyOn(component.selectDate, 'emit');

      component['onSelectDate'](date);

      expect(component.selectDate.emit).toHaveBeenCalledWith(date);
    });
  });
});
