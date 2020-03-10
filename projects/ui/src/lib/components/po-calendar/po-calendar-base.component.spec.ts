import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoDateService } from './../../services/po-date/po-date.service';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';

describe('PoCalendarBaseComponent:', () => {
  let component: PoCalendarBaseComponent;
  let poDate: PoDateService;
  let poCalendarLangService: PoCalendarLangService;

  beforeEach(() => {
    poDate = new PoDateService();
    poCalendarLangService = new PoCalendarLangService();

    component = new PoCalendarBaseComponent(poDate, poCalendarLangService);
  });

  describe('Properties:', () => {
    it('p-locale: should update with valid values and call `initializeLanguage`', () => {
      const validValues = ['pt', 'es', 'en'];

      spyOn(component, 'initializeLanguage');

      expectPropertiesValues(component, 'locale', validValues, validValues);
      expect(component.initializeLanguage).toHaveBeenCalled();
    });

    it('p-locale: should update to `pt` if invalid values and call `initializeLanguage`', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];
      spyOn(component, 'initializeLanguage');

      expectPropertiesValues(component, 'locale', invalidValues, 'pt');
      expect(component.initializeLanguage).toHaveBeenCalled();
    });

    it('p-max-date: should call `poDate.getDateForDateRange` with `maxDate` and `false`', () => {
      const maxDate = new Date(2018, 0, 1);
      const dateExpected = new Date(2018, 0, 1, 23, 59, 59);

      spyOn(component.poDate, 'getDateForDateRange').and.returnValue(dateExpected);

      component.maxDate = maxDate;

      expect(component.poDate.getDateForDateRange).toHaveBeenCalledWith(maxDate, false);
      expect(component.maxDate).toEqual(dateExpected);
    });

    it('p-min-date: should call `poDate.getDateForDateRange` with `minDate` and `true`', () => {
      const minDate = new Date(2018, 0, 1);
      const dateExpected = new Date(2018, 0, 1, 0, 0, 0);

      spyOn(component.poDate, 'getDateForDateRange').and.returnValue(dateExpected);

      component.minDate = minDate;

      expect(component.poDate.getDateForDateRange).toHaveBeenCalledWith(minDate, true);
      expect(component.minDate).toEqual(dateExpected);
    });
  });

  describe('Methods:', () => {
    it(`initializeLanguage: should call 'setLanguage', 'getWeekDaysArray' and 'getMonthsArray' of
      the 'poCalendarLangService' and set the value of displayWeekDays and displayMonths`, () => {
      const weekDays = ['sun', 'mon', 'tue'];
      const months = ['jan', 'feb', 'mar'];
      component.locale = 'en';

      spyOn(component.poCalendarLangService, 'setLanguage');
      spyOn(component.poCalendarLangService, 'getWeekDaysArray').and.returnValue(weekDays);
      spyOn(component.poCalendarLangService, 'getMonthsArray').and.returnValue(months);

      component.initializeLanguage();

      expect(component.poCalendarLangService.setLanguage).toHaveBeenCalledWith(component.locale);
      expect(component.poCalendarLangService.getWeekDaysArray).toHaveBeenCalled();
      expect(component.poCalendarLangService.getMonthsArray).toHaveBeenCalled();

      expect(component.displayWeekDays).toEqual(weekDays);
      expect(component.displayMonths).toEqual(months);
    });
  });
});
