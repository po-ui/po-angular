import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../../util-test/util-expect.spec';

import * as UtilsFunctions from '../../../../utils/util';
import { setYearFrom0To100 } from '../../../../utils/util';

import { PoCalendarLangService } from './po-calendar.lang.service';
import { PoCalendarService } from './po-calendar.service';

import { PoCalendarComponent } from './po-calendar.component';

describe('PoCalendarComponent:', () => {
  let component: PoCalendarComponent;
  let fixture: ComponentFixture<PoCalendarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCalendarComponent],
      providers: [PoCalendarService, PoCalendarLangService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    component['shortLanguage'] = 'pt';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

    it('p-date-end: should update date with hour 23:59:59', () => {
      component.dateEnd = new Date(2018, 0, 1);

      expect(component.dateEnd.getHours()).toBe(23);
      expect(component.dateEnd.getMinutes()).toBe(59);
      expect(component.dateEnd.getSeconds()).toBe(59);
      expect(component.dateEnd.getDate()).toBe(1);
      expect(component.dateEnd.getMonth()).toBe(0);
      expect(component.dateEnd.getFullYear()).toBe(2018);
    });

    it('p-date-start: should set start date with year 1', () => {
      const date = new Date(1, 1, 1);
      date.setFullYear(1);

      component.dateStart = date;

      expect(component.dateStart.getFullYear()).toBe(1);
    });

    it('p-date-start: should call `setYearFrom0To100`', () => {
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.dateStart = new Date();
      expect(setYearFrom0To100).toHaveBeenCalled();
    });

    it('p-date-end: should set end date with year 1', () => {
      const date = new Date(1, 1, 1);
      date.setFullYear(1);

      component.dateEnd = date;

      expect(component.dateEnd.getFullYear()).toBe(1);
    });

    it('p-date-end: should call `setYearFrom0To100`', () => {
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.dateEnd = new Date();

      expect(setYearFrom0To100).toHaveBeenCalled();
    });

    it('p-date-end: should update to `undefined` when set invalid values', () => {
      expectPropertiesValues(component, 'dateEnd', invalidValues, undefined);
    });

    it('p-locale: should update with valid values and call `initializeLanguage`', () => {
      const validValues = ['pt', 'es', 'en', 'ru'];

      spyOn(component, 'initializeLanguage');

      expectPropertiesValues(component, 'locale', validValues, validValues);
      expect(component.initializeLanguage).toHaveBeenCalled();
    });

    it('p-locale: should update to `pt` when invalid values and call `initializeLanguage`', () => {
      spyOn(component, 'initializeLanguage');

      expectPropertiesValues(component, 'locale', invalidValues, 'pt');
      expect(component.initializeLanguage).toHaveBeenCalled();
    });

    it('p-selected-date: should update with valid value', () => {
      component.selectedDate = new Date(2018, 5, 10);

      expect(component.selectedDate instanceof Date).toBeTruthy();
    });

    it('p-selected-date: should update with `undefined` when invalid values', () => {
      expectPropertiesValues(component, 'selectedDate', invalidValues, undefined);
    });

    it('p-date-start: should update with date with hour 00:00:00', () => {
      component.dateStart = new Date(2018, 0, 1);

      expect(component.dateStart.getHours()).toBe(0);
      expect(component.dateStart.getMinutes()).toBe(0);
      expect(component.dateStart.getSeconds()).toBe(0);
      expect(component.dateStart.getDate()).toBe(1);
      expect(component.dateStart.getMonth()).toBe(0);
      expect(component.dateStart.getFullYear()).toBe(2018);
    });

    it('p-date-start: should update with `undefined` when set invalid values', () => {
      expectPropertiesValues(component, 'dateStart', invalidValues, undefined);
    });
  });

  describe('Methods:', () => {
    it(`close: should set 'overlayInvisible' to true and 'visible' to false`, () => {
      component.overlayInvisible = false;
      component.visible = true;

      component.close();

      expect(component.overlayInvisible).toBeTruthy();
      expect(component.visible).toBeFalsy();
    });

    it('getArrayDecade: should call `updateDecade` when year is multiple of 10', () => {
      spyOn(component, <any>'updateDecade');

      component.getArrayDecade(2000);

      expect(component['updateDecade']).toHaveBeenCalled();
    });

    it('getArrayDecade: should call `updateDecade` when year is not multiple of 10', () => {
      spyOn(component, <any>'updateDecade');

      component.getArrayDecade(1995);

      expect(component['updateDecade']).toHaveBeenCalled();
    });

    it('getBackgroundColor: should return background-selected when displayValue is equal propertyValue', () => {
      expect(component.getBackgroundColor(10, 10)).toBe('po-calendar-box-background-selected');
    });

    it('getBackgroundColor: should return background when displayValue is not equal propertyValue', () => {
      expect(component.getBackgroundColor(11, 10)).toBe('po-calendar-box-background');
    });

    it('getDayBackgroundColor: should return background-selected when date is equal `selectedDate`', () => {
      component.selectedDate = new Date(2018, 5, 5);

      expect(component.getDayBackgroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-background-selected');
    });

    it('getDayBackgroundColor: should return background-today when date is equal `today`', () => {
      component['today'] = new Date(2018, 5, 5);

      expect(component.getDayBackgroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-background-today');
    });

    it(`getDayBackgroundColor: should return background when date is different to 'today' and
      'selectedDate' and date is between 'dateStart' and 'dateEnd'`, () => {
      component.dateStart = new Date(2018, 1, 1);
      component.dateEnd = new Date(2019, 1, 1);

      expect(component.getDayBackgroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-background');
    });

    it(`getDayBackgroundColor: should return background-disabled when date is different to 'today' and
      'selectedDate' and date is not between 'dateStart' and 'dateEnd'`, () => {
      component.dateStart = new Date(2019, 1, 1);
      component.dateEnd = new Date(2020, 1, 1);

      expect(component.getDayBackgroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-background-disabled');
    });

    it(`getDayBackgroundColor: should return '' when not have a date`, () => {
      expect(component.getDayBackgroundColor(undefined)).toBe('');
    });

    it('getDayForegroundColor: should return foreground-selected when date is equal `selectedDate`', () => {
      component.selectedDate = new Date(2018, 5, 5);

      expect(component.getDayForegroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-foreground-selected');
    });

    it('getDayForegroundColor: should return foreground-today when date is equal `today`', () => {
      component['today'] = new Date(2018, 5, 5);

      expect(component.getDayForegroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-foreground-today');
    });

    it(`getDayForegroundColor: should return foreground when date is different to 'today' and
      'selectedDate' and date is between 'dateStart' and 'dateEnd'`, () => {
      component.dateStart = new Date(2018, 1, 1);
      component.dateEnd = new Date(2019, 1, 1);

      expect(component.getDayForegroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-foreground');
    });

    it(`getDayForegroundColor: should return foreground-disabled when date is different to 'today' and
      'selectedDate' and date is not between 'dateStart' and 'dateEnd'`, () => {
      component.dateStart = new Date(2019, 1, 1);
      component.dateEnd = new Date(2020, 1, 1);

      expect(component.getDayForegroundColor(new Date(2018, 5, 5))).toBe('po-calendar-box-foreground-disabled');
    });

    it('getForegroundColor: should return foreground-selected when displayValue is equal propertyValue', () => {
      expect(component.getForegroundColor(10, 10)).toBe('po-calendar-box-foreground-selected');
    });

    it('getForegroundColor: should return foreground when displayValue is not equal propertyValue', () => {
      expect(component.getForegroundColor(11, 10)).toBe('po-calendar-box-foreground');
    });

    it(`getWordMonth: should call 'poCalendarLangService.getWordMonth'`, () => {
      const fakeThis = {
        poCalendarLangService: {
          getWordMonth: () => {}
        }
      };

      spyOn(fakeThis.poCalendarLangService, 'getWordMonth');
      component.getWordMonth.call(fakeThis);

      expect(fakeThis.poCalendarLangService.getWordMonth).toHaveBeenCalled();
    });

    it(`getWordYear: should call 'poCalendarLangService.getWordYear'`, () => {
      const fakeThis = {
        poCalendarLangService: {
          getWordYear: () => {}
        }
      };

      spyOn(fakeThis.poCalendarLangService, 'getWordYear');
      component.getWordYear.call(fakeThis);

      expect(fakeThis.poCalendarLangService.getWordYear).toHaveBeenCalled();
    });

    it(`init: should call 'updateDate', 'initializeLanguage' and 'selectDay', when have a 'selectedDate'`, () => {
      component.selectedDate = new Date(2018, 5, 5);

      spyOn(component, <any>'updateDate');
      spyOn(component, 'initializeLanguage');
      spyOn(component, 'selectDay');

      component.init();

      expect(component['updateDate']).toHaveBeenCalledWith(component.selectedDate);
      expect(component.initializeLanguage).toHaveBeenCalled();
      expect(component.selectDay).toHaveBeenCalled();
    });

    it(`init: should call 'updateDate' with selectedDate, 'initializeLanguage' and 'selectDay', when have a 'selectedDate'`, () => {
      component.selectedDate = new Date(2018, 5, 5);

      spyOn(component, <any>'updateDate');
      spyOn(component, 'initializeLanguage');
      spyOn(component, 'selectDay');
      component.init();

      expect(component['updateDate']).toHaveBeenCalledWith(component.selectedDate);
      expect(component.initializeLanguage).toHaveBeenCalled();
      expect(component.selectDay).toHaveBeenCalled();
    });

    it(`init: should call 'updateDate' with today date when not have a 'selectedDate'`, () => {
      component.selectedDate = undefined;
      component['today'] = new Date(2018, 5, 6);

      spyOn(component, <any>'updateDate');
      component.init();

      expect(component['updateDate']).toHaveBeenCalledWith(component['today']);
    });

    it(`init: should set 'overlayInvisible' to false when 'isMobile' is true`, () => {
      component.overlayInvisible = true;

      spyOn(component, <any>'isMobile').and.returnValue(true);
      component.init();

      expect(component.overlayInvisible).toBeFalsy();
    });

    it(`init: shouldn't set 'overlayInvisible' to false when 'isMobile' is false`, () => {
      component.overlayInvisible = true;

      spyOn(component, <any>'isMobile').and.returnValue(false);
      component.init();

      expect(component.overlayInvisible).toBeTruthy();
    });

    it(`initializeLanguage: should call 'setLanguage' , 'getArrayWeekDays' and 'getArrayMonths'`, () => {
      const fakeThis = {
        poCalendarLangService: {
          setLanguage: () => {},
          getArrayWeekDays: () => {},
          getArrayMonths: () => {}
        },
        displayWeedDays: 9,
        displayMonths: 8
      };

      spyOn(fakeThis.poCalendarLangService, 'setLanguage');
      spyOn(fakeThis.poCalendarLangService, 'getArrayWeekDays');
      spyOn(fakeThis.poCalendarLangService, 'getArrayMonths');

      component.initializeLanguage.call(fakeThis);

      expect(fakeThis.poCalendarLangService.setLanguage).toHaveBeenCalled();
      expect(fakeThis.poCalendarLangService.getArrayWeekDays).toHaveBeenCalled();
      expect(fakeThis.poCalendarLangService.getArrayMonths).toHaveBeenCalled();
    });

    it(`onPrevMonth: should call 'updateDisplay' with 'displayYear' and 'displayMonthNumber -1'
      when displayMonthNumber is greater then 0`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 10;

      spyOn(component, <any>'updateDisplay');
      component.onPrevMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1997, 9);
    });

    it(`onPrevMonth: should call 'updateDisplay' with 'displayYear -1' and 11 when displayMonthNumber is equal or less then 0`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 0;

      spyOn(component, <any>'updateDisplay');
      component.onPrevMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1996, 11);
    });

    it(`onNextMonth: should call 'updateDisplay' with 'displayYear' and 'displayMonthNumber +1' when displayMonthNumber is less then 11`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 10;

      spyOn(component, <any>'updateDisplay');
      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1997, 11);
    });

    it(`onNextMonth: should call 'updateDisplay' with 'displayYear +1' and 0 when displayMonthNumber is greater or equal then 11`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      component.onNextMonth();

      expect(component['updateDisplay']).toHaveBeenCalledWith(1998, 0);
    });

    it(`onSelectDate: should call 'selectedDateChange.emit' and 'submit.emit' with date when 'validateDateRange' is true`, () => {
      const date = new Date(2018, 6, 5);
      component.dateStart = new Date(2018, 1, 1);
      component.dateEnd = new Date(2019, 5, 5);

      spyOn(component.selectedDateChange, 'emit');
      spyOn(component.submit, 'emit');
      component.onSelectDate(date);

      expect(component.selectedDateChange.emit).toHaveBeenCalledWith(date);
      expect(component.submit.emit).toHaveBeenCalledWith(date);
    });

    it(`onSelectDate: shouldn't call 'selectedDateChange.emit' and 'submit.emit' with date when 'validateDateRange' is false`, () => {
      const date = new Date(2010, 6, 5);
      component.dateStart = new Date(2018, 1, 1);
      component.dateEnd = new Date(2019, 5, 5);

      spyOn(component.selectedDateChange, 'emit');
      spyOn(component.submit, 'emit');
      component.onSelectDate(date);

      expect(component.selectedDateChange.emit).not.toHaveBeenCalledWith(date);
      expect(component.submit.emit).not.toHaveBeenCalledWith(date);
    });

    it(`onSelectMonth: should call 'selectDay' and 'updateDisplay' with year and month`, () => {
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');
      component.onSelectMonth(2015, 10);

      expect(component.selectDay).toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should call 'selectMonth' and 'updateDisplay' when 'lastDisplay' is equal to 'month'`, () => {
      component['lastDisplay'] = 'month';

      spyOn(component, 'selectMonth');
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');
      component.onSelectYear(2015, 10);

      expect(component.selectMonth).toHaveBeenCalled();
      expect(component.selectDay).not.toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`onSelectYear: should call 'selectDay' and 'updateDisplay' when 'lastDisplay' is different to 'month'`, () => {
      component['lastDisplay'] = '';

      spyOn(component, 'selectMonth');
      spyOn(component, 'selectDay');
      spyOn(component, <any>'updateDisplay');
      component.onSelectYear(2015, 10);

      expect(component.selectMonth).not.toHaveBeenCalled();
      expect(component.selectDay).toHaveBeenCalled();
      expect(component['updateDisplay']).toHaveBeenCalledWith(2015, 10);
    });

    it(`updateYear: should call 'updateDisplay' and update 'displayYear' with positive number`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      component.updateYear(10);

      expect(component['updateDisplay']).toHaveBeenCalledWith(2007, 11);
    });

    it(`updateYear: should call 'updateDisplay' and update 'displayYear' with negative number`, () => {
      component.displayYear = 1997;
      component.displayMonthNumber = 11;

      spyOn(component, <any>'updateDisplay');
      component.updateYear(-10);

      expect(component['updateDisplay']).toHaveBeenCalledWith(1987, 11);
    });

    it(`addAllYearsInDecade: should update 'displayDecade' with 10 years`, () => {
      component.displayDecade = [];

      component['addAllYearsInDecade'](2011);

      expect(component.displayDecade).toEqual([2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]);
    });

    it(`equalsDate: should return 'true' when date1 is equal date2`, () => {
      const date = new Date(2018, 5, 5);
      expect(component['equalsDate'](date, date)).toBeTruthy();
    });

    it(`equalsDate: should return 'false' when date1 is different from the date2`, () => {
      expect(component['equalsDate'](new Date(2018, 5, 5), new Date(2018, 5, 6))).toBeFalsy();
    });

    it(`updateDate: should call 'updateDisplay' with year and month updated`, () => {
      component['currentMonthNumber'] = 2;
      component.currentYear = 2000;

      spyOn(component, <any>'updateDisplay');
      component['updateDate'](new Date(2018, 5, 5));

      expect(component['updateDisplay']).toHaveBeenCalledWith(2018, 5);
    });

    it(`updateDecade: should call 'addAllYearsInDecade' and update 'displayStartDecade' and 'displayFinalDecade'`, () => {
      spyOn(component, <any>'addAllYearsInDecade');
      component['updateDecade'](2000);

      expect(component['displayStartDecade']).toBe(2000);
      expect(component['displayFinalDecade']).toBe(2009);
      expect(component['addAllYearsInDecade']).toHaveBeenCalledWith(2000);
    });

    it(`updateDisplay: should call 'getArrayDecade' with year and set 'displayMonthNumber' with month`, () => {
      spyOn(component, 'getArrayDecade');
      component['updateDisplay'](2000, 5);

      expect(component.displayMonthNumber).toBe(5);
      expect(component.getArrayDecade).toHaveBeenCalledWith(2000);
    });

    it(`selectDay: should display Day Calendar`, () => {
      component.selectDay();

      expect(component.dayVisible).toBeTruthy();
      expect(component.monthVisible).toBeFalsy();
      expect(component.yearVisible).toBeFalsy();
      expect(component['lastDisplay']).toBe('day');
    });

    it(`selectMonth: should display Month Calendar`, () => {
      component.selectMonth();

      expect(component.dayVisible).toBeFalsy();
      expect(component.monthVisible).toBeTruthy();
      expect(component.yearVisible).toBeFalsy();
      expect(component['lastDisplay']).toBe('month');
    });

    it(`selectYear: should display Year Calendar`, () => {
      component.selectYear();

      expect(component.dayVisible).toBeFalsy();
      expect(component.monthVisible).toBeFalsy();
      expect(component.yearVisible).toBeTruthy();
    });

    it(`setMobileVisualization: should return 'po-calendar po-calendar-mobile' when 'isMobile' is true`, () => {
      spyOn(component, <any>'isMobile').and.returnValue(true);
      expect(component.setMobileVisualization()).toBe('po-calendar po-calendar-mobile');
    });

    it(`setMobileVisualization: should return 'po-calendar' when 'isMobile' is false`, () => {
      spyOn(component, <any>'isMobile').and.returnValue(false);
      expect(component.setMobileVisualization()).toBe('po-calendar');
    });
  });
  describe('Templates:', () => {
    it(`should remove class 'po-invisible' when set 'overlayInvisible' to false`, () => {
      const poCalendarOverlay = nativeElement.querySelector('.po-calendar-overlay');
      component.visible = true;
      component.overlayInvisible = false;

      fixture.detectChanges();

      expect(poCalendarOverlay.classList.contains('po-invisible')).toBeFalsy();
    });

    it(`should add class 'po-invisible' when set 'overlayInvisible' to true`, () => {
      const poCalendarOverlay = nativeElement.querySelector('.po-calendar-overlay');
      component.visible = true;
      component.overlayInvisible = true;

      fixture.detectChanges();

      expect(poCalendarOverlay.classList.contains('po-invisible')).toBeTruthy();
    });

    it('should contain a class `po-mr-1` in the `span` within the title.', () => {
      component.visible = true;
      component.dayVisible = true;

      fixture.detectChanges();

      const poCalendarDayVibled = nativeElement.querySelector('.po-calendar-header');

      expect(poCalendarDayVibled.querySelector('div.po-calendar-header-title > span.po-mr-1')).toBeTruthy();
    });
  });
});
