import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDateService } from '../../services/po-date/po-date.service';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoCalendarService } from './services/po-calendar.service';

describe('PoCalendarComponent:', () => {
  let component: PoCalendarComponent;
  let fixture: ComponentFixture<PoCalendarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCalendarComponent],
      providers: [PoCalendarService, PoCalendarLangService, PoDateService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoCalendarBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `init`', () => {
      spyOn(component, <any>'init');

      component.ngOnInit();

      expect(component['init']).toHaveBeenCalled();
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

    it(`getMonthLabel: should call 'poCalendarLangService.getMonthLabel'`, () => {
      spyOn(component.poCalendarLangService, 'getMonthLabel');
      component.getMonthLabel();

      expect(component.poCalendarLangService.getMonthLabel).toHaveBeenCalled();
    });

    it(`getYearLabel: should call 'poCalendarLangService.getYearLabel'`, () => {
      spyOn(component.poCalendarLangService, 'getYearLabel');
      component.getYearLabel();

      expect(component.poCalendarLangService.getYearLabel).toHaveBeenCalled();
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

    it(`onSelectDate: should call 'convertDateToISO' to set 'dateIso' and set 'date' to 'dateparam'`, () => {
      const dateParam = new Date(2018, 6, 5);
      const isoExtended = '2018-07-05T03:00:00.000Z';

      spyOn(component.poDate, 'convertDateToISO').and.returnValue(isoExtended);

      component.onSelectDate(dateParam);

      expect(component['dateIso']).toBe(isoExtended);
      expect(component['date']).toBe(dateParam);
    });

    it(`onSelectDate: should call 'change.emit' with dateparam`, () => {
      const dateParam = new Date(2018, 6, 5);
      const result = '2018-07-05';

      spyOn(component.change, 'emit');

      component.onSelectDate(dateParam);

      expect(component.change.emit).toHaveBeenCalledWith(result);
    });

    it(`onSelectDate: should call 'propagateChange' with 'isoExtended' if 'propagateChange' is defined`, () => {
      const dateParam = new Date(2018, 6, 5);
      const isoExtended = '2018-07-05T03:00:00.000Z';
      component['propagateChange'] = () => {};

      spyOn(component.poDate, 'convertDateToISO').and.returnValue(isoExtended);
      spyOn(component, <any>'propagateChange');

      component.onSelectDate(dateParam);

      expect(component['propagateChange']).toHaveBeenCalledWith(isoExtended);
    });

    it(`onSelectMonth: should call 'selectDay' and 'updateDisplay' with year and month`, () => {
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');
      component.onSelectMonth(2015, 10);

      expect(component.selectDay).toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should call 'updateDisplay' and 'selectMonth' if 'lastDisplay' is equal to 'month'`, () => {
      component['lastDisplay'] = 'month';

      spyOn(component, 'selectMonth');
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(2015, 10);

      expect(component.selectMonth).toHaveBeenCalled();
      expect(component.selectDay).not.toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should call 'updateDisplay' and 'selectDay' if 'lastDisplay' is different to 'month'`, () => {
      component['lastDisplay'] = '';

      spyOn(component, 'selectMonth');
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(2015, 10);

      expect(component.selectMonth).not.toHaveBeenCalled();
      expect(component.selectDay).toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should set 'currentYear' to the value of 'yearParam'`, () => {
      const yearParam = 2018;

      spyOn(component, 'selectMonth');
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');

      component.onSelectYear(yearParam, 10);

      expect(component.currentYear).toBe(yearParam);
    });

    it('registerOnChange: should set `propagateChange` with value of the `fnParam`', () => {
      const fnParam = () => {};

      component.registerOnChange(fnParam);

      expect(component['propagateChange']).toBe(fnParam);
    });

    it('registerOnTouched: should set `onTouched` with value of the `fnParam`', () => {
      const fnParam = () => {};

      component.registerOnTouched(fnParam);

      expect(component['onTouched']).toBe(fnParam);
    });

    it('registerOnValidatorChange: should set `validatorChange` with value of the `fnParam`', () => {
      const fnParam = () => {};

      component.registerOnValidatorChange(fnParam);

      expect(component['validatorChange']).toBe(fnParam);
    });

    it(`selectDay: should set 'dayVisible' to 'true', 'monthVisible' to 'false', 'yearVisible' to 'false' and
      'lastDisplay' to 'day'`, () => {
      component.selectDay();

      expect(component.dayVisible).toBeTruthy();
      expect(component.monthVisible).toBeFalsy();
      expect(component.yearVisible).toBeFalsy();
      expect(component['lastDisplay']).toBe('day');
    });

    it(`selectMonth: should set 'dayVisible' to 'false', 'monthVisible' to 'true', 'yearVisible' to 'false' and
      'lastDisplay' to 'month'`, () => {
      component.selectMonth();

      expect(component.dayVisible).toBeFalsy();
      expect(component.monthVisible).toBeTruthy();
      expect(component.yearVisible).toBeFalsy();
      expect(component['lastDisplay']).toBe('month');
    });

    it(`selectYear: should set 'dayVisible' to 'false', 'monthVisible' to 'false' and 'yearVisible' to 'true'`, () => {
      component.selectYear();

      expect(component.dayVisible).toBeFalsy();
      expect(component.monthVisible).toBeFalsy();
      expect(component.yearVisible).toBeTruthy();
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

    it('validateModel: should call `validatorChange` to validateModel if `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};
      const model = ['value'];

      spyOn(component, <any>'validatorChange');

      component['validateModel'](model);

      expect(component['validatorChange']).toHaveBeenCalledWith(model);
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validate: should return null', () => {
      expect(component['validate'](undefined)).toBeNull();
    });

    it('writeValue: should call `writeDate` if value is defined', () => {
      const value = '2018-07-05T03:00:00.000Z';

      spyOn(component, <any>'writeDate');

      component.writeValue(value);

      expect(component['writeDate']).toHaveBeenCalledWith(value);
    });

    it(`writeValue: should set 'date' to 'undefined', call 'updateDate' with 'today' and not call 'writeDate' if value
      is undefined`, () => {
      const value = undefined;

      spyOn(component, <any>'writeDate');
      spyOn(component, <any>'updateDate');

      component.writeValue(value);

      expect(component['writeDate']).not.toHaveBeenCalled();
      expect(component['updateDate']).toHaveBeenCalledWith(component['today']);
      expect(component['date']).toBeUndefined();
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
      spyOn(component.poDate, 'validateDateRange').and.returnValue(true);

      const result = component['getColorForDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-selected');
    });

    it(`getColorForDate: should return 'po-calendar-box-background-selected-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      const result = component['getColorForDate'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-selected-disabled');
    });

    it(`getColorForDate: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      component['getColorForDate'](date, 'background');

      expect(component.poDate.validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`getColorForDateRange: should return 'po-calendar-box-background' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component.poDate, 'validateDateRange').and.returnValue(true);

      const result = component['getColorForDateRange'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background');
    });

    it(`getColorForDateRange: should return 'po-calendar-box-background-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      const result = component['getColorForDateRange'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-disabled');
    });

    it(`getColorForDateRange: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      component['getColorForDateRange'](date, 'background');

      expect(component.poDate.validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
    });

    it(`getColorForToday: should return 'po-calendar-box-background-today' if 'poDate.validateDateRange'
      return 'true'`, () => {
      spyOn(component.poDate, 'validateDateRange').and.returnValue(true);

      const result = component['getColorForToday'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-today');
    });

    it(`getColorForToday: should return 'po-calendar-box-background-today-disabled' if 'poDate.validateDateRange'
      return 'false'`, () => {
      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      const result = component['getColorForToday'](new Date(), 'background');

      expect(result).toBe('po-calendar-box-background-today-disabled');
    });

    it(`getColorForToday: should call 'poDate.validateDateRange' with 'date', 'minDate' and 'maxDate'`, () => {
      const date = new Date();
      component.minDate = new Date(2018, 4, 3);
      component.maxDate = new Date(2018, 4, 8);

      spyOn(component.poDate, 'validateDateRange').and.returnValue(false);

      component['getColorForToday'](date, 'background');

      expect(component.poDate.validateDateRange).toHaveBeenCalledWith(date, component.minDate, component.maxDate);
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

    it(`getDayColor: should call 'equalsDate', 'getColorForDateRange' and return value of the 'getColorForDateRange' if
      'equalsDate' return 'false'`, () => {
      const colorClass = 'po-calendar-box-background';
      const dateParam = new Date(2018, 5, 6);
      const local = 'background';

      spyOn(component, <any>'equalsDate').and.returnValue(false);
      spyOn(component, <any>'getColorForDateRange').and.returnValue(colorClass);

      const result = component['getDayColor'](dateParam, local);

      expect(result).toBe(colorClass);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['today']);
      expect(component['equalsDate']).toHaveBeenCalledWith(dateParam, component['date']);
      expect(component['getColorForDateRange']).toHaveBeenCalledWith(dateParam, local);
    });

    it(`init: should call 'updateDate' with today date if 'this.date' is undefined and 'poDate.isValidIso'
      return 'false'`, () => {
      component['date'] = undefined;
      component['today'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDate');
      spyOn(component.poDate, 'isValidIso').and.returnValue(false);

      component['init']();

      expect(component['updateDate']).toHaveBeenCalledWith(component['today']);
    });

    it(`init: should call 'updateDate' with today date if 'this.date' is defined and 'poDate.isValidIso'
      return 'false'`, () => {
      component['date'] = new Date(2018, 4, 10);
      component['today'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDate');
      spyOn(component.poDate, 'isValidIso').and.returnValue(false);

      component['init']();

      expect(component['updateDate']).toHaveBeenCalledWith(component['today']);
    });

    it(`init: should call 'updateDate' with today date if 'this.date' is undefined and 'poDate.isValidIso'
      return 'true'`, () => {
      component['date'] = undefined;
      component['today'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDate');
      spyOn(component.poDate, 'isValidIso').and.returnValue(true);

      component['init']();

      expect(component['updateDate']).toHaveBeenCalledWith(component['today']);
    });

    it(`init: should call 'updateDate' with 'this.date' date if 'this.date' is defined and 'poDate.isValidIso'
      return 'true'`, () => {
      component['date'] = new Date(2018, 4, 10);

      spyOn(component, <any>'updateDate');
      spyOn(component.poDate, 'isValidIso').and.returnValue(true);

      component['init']();

      expect(component['updateDate']).toHaveBeenCalledWith(component['date']);
    });

    it(`init: should call 'poDate.convertDateToISO' with 'this.date', 'initializeLanguage' and 'selectDay'`, () => {
      component['date'] = new Date(2018, 4, 10);

      spyOn(component, <any>'updateDate');
      const initializeLanguageSpy = spyOn(component, <any>'initializeLanguage');
      const selectDaySpy = spyOn(component, <any>'selectDay');
      spyOn(component.poDate, 'convertDateToISO');

      component['init']();

      expect(component.poDate.convertDateToISO).toHaveBeenCalledWith(component['date']);
      expect(initializeLanguageSpy).toHaveBeenCalled();
      expect(selectDaySpy).toHaveBeenCalled();
      expect(component['updateDate']).toHaveBeenCalledBefore(selectDaySpy);
      expect(component['updateDate']).toHaveBeenCalledBefore(initializeLanguageSpy);
    });

    it(`selectDateFromDate: should set 'this.date' with dateParam and call 'onSelectDate' with 'this.date'`, () => {
      const dateParam = new Date();

      spyOn(component, 'onSelectDate');

      component['selectDateFromDate'](dateParam);

      expect(component['date']).toEqual(dateParam);
      expect(component.onSelectDate).toHaveBeenCalledWith(dateParam);
    });

    it(`selectDateFromIso: should set 'this.date' with 'dateExpected' and call 'onSelectDate' with 'this.date'`, () => {
      const dateParam = '2018-07-05';

      spyOn(component, 'onSelectDate');

      component['selectDateFromIso'](dateParam);

      expect(component['date'].toISOString().substring(0, 10)).toBe(dateParam);
      expect(component.onSelectDate).toHaveBeenCalledWith(component['date']);
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

    it(`updateDate: shouldn't call 'updateDisplay' if not have date`, () => {
      const date = undefined;

      spyOn(component, <any>'updateDisplay');

      component['updateDate'](date);

      expect(component['updateDisplay']).not.toHaveBeenCalled();
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

    it(`writeDate: should call 'selectDateFromDate' with 'value' if 'value' is instance of 'Date' and call
      'updateDate' with 'this.date'`, () => {
      const value = new Date();
      component['date'] = new Date();

      spyOn(component, <any>'selectDateFromDate');
      spyOn(component, <any>'updateDate');
      spyOn(component, <any>'writeDateIso');

      component['writeDate'](value);

      expect(component['selectDateFromDate']).toHaveBeenCalledWith(value);
      expect(component['writeDateIso']).not.toHaveBeenCalled();
      expect(component['updateDate']).toHaveBeenCalledWith(component['date']);
    });

    it(`writeDate: should call 'writeDateIso' with 'value' if 'value' not is instance of 'Date' and call
      'updateDate' with 'this.date'`, () => {
      const value = '2018-07-05T03:00:00.000';
      component['date'] = new Date();

      spyOn(component, <any>'selectDateFromDate');
      spyOn(component, <any>'updateDate');
      spyOn(component, <any>'writeDateIso');

      component['writeDate'](value);

      expect(component['selectDateFromDate']).not.toHaveBeenCalled();
      expect(component['writeDateIso']).toHaveBeenCalledWith(value);
      expect(component['updateDate']).toHaveBeenCalledWith(component['date']);
    });

    it(`writeDateIso: should call 'selectDateFromIso' with 'value' if 'poDate.isValidIso'
      return 'true'`, () => {
      const value = '2018-07-05T03:00:00.000';
      const date = new Date();
      component['date'] = date;

      spyOn(component.poDate, 'isValidIso').and.returnValue(true);
      spyOn(component, <any>'selectDateFromIso');

      component['writeDateIso'](value);

      expect(component['selectDateFromIso']).toHaveBeenCalledWith(value);
      expect(component.poDate.isValidIso).toHaveBeenCalledWith(value);
      expect(component['date']).toEqual(date);
    });

    it(`writeDateIso: should not call 'selectDateFromIso' with 'value' and set 'this.date' to 'undefined'
      if 'poDate.isValidIso' return 'false'`, () => {
      const value = '2018-07-05T03:00:00.000';
      component['date'] = new Date();

      spyOn(component.poDate, 'isValidIso').and.returnValue(false);
      spyOn(component, <any>'selectDateFromIso');

      component['writeDateIso'](value);

      expect(component['selectDateFromIso']).not.toHaveBeenCalled();
      expect(component.poDate.isValidIso).toHaveBeenCalledWith(value);
      expect(component['date']).toBeUndefined();
    });
  });

  describe('Templates:', () => {
    describe('Day visible:', () => {
      it('should show `po-calendar-content-list-day`', () => {
        component.dayVisible = true;
        fixture.detectChanges();
        expect(nativeElement.querySelector('.po-calendar-content-list-day')).toBeTruthy();
      });

      it('should call `onPreviousMonth` on `po-calendar-nav-left` click', () => {
        component.dayVisible = true;
        spyOn(component, 'onPreviousMonth');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-left');
        calendarNav.click();

        expect(component.onPreviousMonth).toHaveBeenCalled();
      });

      it('should call `selectMonth` on `.po-calendar-nav-title > .po-clickable` click and show `displayMonth`', () => {
        component.dayVisible = true;
        spyOn(component, 'selectMonth');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-title > .po-clickable');
        calendarNav.click();

        expect(component.selectMonth).toHaveBeenCalled();
        expect(calendarNav.innerHTML).toContain(component.displayMonth);
      });

      it('should call `selectYear` on `.po-calendar-nav-title > .po-clickable:nth-of-type(2)` click and show `displayYear`', () => {
        component.dayVisible = true;
        spyOn(component, 'selectYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector(
          '.po-calendar-nav-title > .po-clickable:nth-of-type(2)'
        );
        calendarNav.click();

        expect(component.selectYear).toHaveBeenCalled();
        expect(calendarNav.innerHTML).toContain(component.displayYear);
      });

      it('should call `onNextMonth` on `.po-calendar-nav-right` click', () => {
        component.dayVisible = true;
        spyOn(component, 'onNextMonth');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-right');
        calendarNav.click();

        expect(component.onNextMonth).toHaveBeenCalled();
      });

      it('should show `po-calendar-label` for each day of `displayWeekDays`', () => {
        component.dayVisible = true;
        component.displayWeekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        fixture.detectChanges();

        expect(nativeElement.querySelectorAll('.po-calendar-label').length).toBe(7);
      });

      it('should show `po-calendar-day` for each day of `displayDays`, call `getDayBackgroundColor` and `getDayForegroundColor`', () => {
        spyOn(component, 'getDayBackgroundColor');
        spyOn(component, 'getDayForegroundColor');

        const calendarArray = component['poCalendarService'].monthDays(2018, 10);
        component.displayDays = [].concat.apply([], calendarArray);
        component.dayVisible = true;

        fixture.detectChanges();

        expect(component.getDayBackgroundColor).toHaveBeenCalled();
        expect(component.getDayForegroundColor).toHaveBeenCalled();
        expect(nativeElement.querySelectorAll('.po-calendar-day').length).toBe(35); // 31 days and 4 empty days
      });

      it('should call `onSelectDate` on `.po-calendar-day` click', () => {
        component.dayVisible = true;
        spyOn(component, 'onSelectDate');

        fixture.detectChanges();

        const calendarDay = fixture.debugElement.nativeElement.querySelector('.po-calendar-day');
        calendarDay.click();

        expect(component.onSelectDate).toHaveBeenCalled();
      });
    });

    describe('Month visible:', () => {
      it('should show `po-calendar-content-list-month`', () => {
        component.dayVisible = false;
        component.monthVisible = true;

        fixture.detectChanges();

        expect(nativeElement.querySelector('.po-calendar-content-list-month')).toBeTruthy();
      });

      it('should call `updateYear` with -1 on `po-calendar-nav-left` click', () => {
        component.dayVisible = false;
        component.monthVisible = true;

        spyOn(component, 'updateYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-left');
        calendarNav.click();

        expect(component.updateYear).toHaveBeenCalledWith(-1);
      });

      it('should call `selectYear` on `.po-calendar-nav-title > .po-clickable` click and show `displayYear`', () => {
        component.dayVisible = false;
        component.monthVisible = true;

        spyOn(component, 'selectYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-title > .po-clickable');
        calendarNav.click();

        expect(component.selectYear).toHaveBeenCalled();
        expect(calendarNav.innerHTML).toContain(component.displayYear);
      });

      it('should call `updateYear` with 1 on `.po-calendar-nav-right` click', () => {
        component.dayVisible = false;
        component.monthVisible = true;

        spyOn(component, 'updateYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-right');
        calendarNav.click();

        expect(component.updateYear).toHaveBeenCalledWith(1);
      });

      it('should show `po-calendar-label` for `getMonthLabel`', () => {
        component.dayVisible = false;
        component.monthVisible = true;
        const month = 'July';

        spyOn(component, 'getMonthLabel').and.returnValue(month);

        fixture.detectChanges();

        expect(component.getMonthLabel).toHaveBeenCalled();
        expect(nativeElement.querySelector('.po-calendar-label').innerHTML).toContain(month);
      });

      it('should show `po-calendar-month` for each month of `displayMonths`, call `getBackgroundColor` and `getForegroundColor`', () => {
        spyOn(component, 'getBackgroundColor');
        spyOn(component, 'getForegroundColor');

        component.dayVisible = false;
        component.monthVisible = true;

        fixture.detectChanges();

        expect(component.getBackgroundColor).toHaveBeenCalled();
        expect(component.getForegroundColor).toHaveBeenCalled();
        expect(nativeElement.querySelectorAll('.po-calendar-month').length).toBe(12);
      });

      it('should call `onSelectMonth` on `.po-calendar-month` click', () => {
        component.dayVisible = false;
        component.monthVisible = true;

        spyOn(component, 'onSelectMonth');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-month');
        calendarNav.click();

        expect(component.onSelectMonth).toHaveBeenCalled();
      });
    });

    describe('Year visible:', () => {
      it('po-calendar-content-list-year`', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        fixture.detectChanges();
        expect(nativeElement.querySelector('.po-calendar-content-list-year')).toBeTruthy();
      });

      it('should call `updateYear` with -10 on `po-calendar-nav-left` click', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        spyOn(component, 'updateYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-left');
        calendarNav.click();

        expect(component.updateYear).toHaveBeenCalledWith(-10);
      });

      it('should show `displayStartDecade` - `displayFinalDecade` on `.po-calendar-nav-title`', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-title');

        expect(calendarNav.innerHTML).toContain(`${component.displayStartDecade} - ${component.displayFinalDecade}`);
      });

      it('should call `updateYear` with 10 on `.po-calendar-nav-right` click', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        spyOn(component, 'updateYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-nav-right');
        calendarNav.click();

        expect(component.updateYear).toHaveBeenCalledWith(10);
      });

      it('should show `po-calendar-label` for `getYearLabel`', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        const year = '2018';

        spyOn(component, 'getYearLabel').and.returnValue(year);

        fixture.detectChanges();

        expect(component.getYearLabel).toHaveBeenCalled();
        expect(nativeElement.querySelector('.po-calendar-label').innerHTML).toContain(year);
      });

      it('should show `po-calendar-year` for each year of `displayDecade`, call `getBackgroundColor` and `getForegroundColor`', () => {
        spyOn(component, 'getBackgroundColor');
        spyOn(component, 'getForegroundColor');

        component['updateDisplay'](2018, 7);

        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        fixture.detectChanges();

        expect(component.getBackgroundColor).toHaveBeenCalled();
        expect(component.getForegroundColor).toHaveBeenCalled();
        expect(nativeElement.querySelectorAll('.po-calendar-year').length).toBe(10);
      });

      it('should call `onSelectYear` on `.po-calendar-year` click', () => {
        component.dayVisible = false;
        component.monthVisible = false;
        component.yearVisible = true;

        spyOn(component, 'onSelectYear');

        fixture.detectChanges();

        const calendarNav = fixture.debugElement.nativeElement.querySelector('.po-calendar-year');
        calendarNav.click();

        expect(component.onSelectYear).toHaveBeenCalled();
      });
    });
  });
});
