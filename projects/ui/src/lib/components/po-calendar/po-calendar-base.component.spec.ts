import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoDateService } from './../../services/po-date/po-date.service';

import { PoCalendarMode } from './po-calendar-mode.enum';
import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

describe('PoCalendarBaseComponent:', () => {
  let component: PoCalendarBaseComponent;
  let poDate: PoDateService;
  let languageService: PoLanguageService;

  beforeEach(() => {
    poDate = new PoDateService();
    languageService = new PoLanguageService();
    component = new PoCalendarBaseComponent(poDate, languageService);
    component['shortLanguage'] = 'pt';
  });

  describe('Properties:', () => {
    it('p-mode: should set mode and call `setActivateDate`', () => {
      spyOn(component, <any>'setActivateDate');

      component.mode = PoCalendarMode.Range;

      expect(component['setActivateDate']).toHaveBeenCalled();
    });

    it('p-locale: should update with valid values', () => {
      const validValues = ['pt', 'es', 'en', 'ru'];

      expectPropertiesValues(component, 'locale', validValues, validValues);
    });

    it('p-locale: should update to `pt` if invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'locale', invalidValues, 'pt');
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
    it('setActivateDate: should set { start, end } with today date if isRange is true and date param is undefined', () => {
      spyOnProperty(component, 'isRange').and.returnValue(true);

      component['setActivateDate']();

      const { start, end } = component.activateDate;

      expect(start instanceof Date).toBe(true);
      expect(end instanceof Date).toBe(true);
    });

    it('setActivateDate: should set { start, end } with date param if isRange is true', () => {
      const year = 2020;
      const month = 10;
      const day = 10;

      const date = new Date(`${year}-${month}-${day}T00:00:00`);

      spyOnProperty(component, 'isRange').and.returnValue(true);

      component['setActivateDate'](date);

      const { start, end } = component.activateDate;

      expect(start instanceof Date).toBe(true);
      expect(end instanceof Date).toBe(true);

      expect(start.getDate()).toBe(day);
      expect(start.getMonth()).toBe(date.getMonth());
      expect(start.getFullYear()).toBe(year);

      expect(end.getDate()).toBe(day);
      expect(end.getMonth()).toBe(date.getMonth() + 1);
      expect(end.getFullYear()).toBe(year);
    });

    it('setActivateDate: should set {start, end } with date param of type string if isRange is true', () => {
      const date = '2021-09-15';
      const day = 15;
      const year = 2021;
      const month = 9;

      spyOnProperty(component, 'isRange').and.returnValue(true);

      component['setActivateDate'](date);
      const { start, end } = component.activateDate;

      expect(start instanceof Date).toBe(true);
      expect(end instanceof Date).toBe(true);

      expect(start.getDate()).toBe(day);
      expect(start.getMonth()).toBe(month - 1);
      expect(start.getFullYear()).toBe(year);

      expect(end.getDate()).toBe(day);
      expect(end.getMonth()).toBe(month);
      expect(end.getFullYear()).toBe(year);
    });

    it('setActivateDate: should set with date param if isRange is false', () => {
      const date = new Date(2019, 10, 5);

      spyOnProperty(component, 'isRange').and.returnValue(false);

      component['setActivateDate'](date);

      expect(component.activateDate instanceof Date).toBe(true);
      expect(component.activateDate.getFullYear()).toBe(date.getFullYear());
      expect(component.activateDate.getMonth()).toBe(date.getMonth());
    });

    it('setActivateDate: should set with today date if isRange is false and date param is undefined', () => {
      const today = new Date();

      spyOnProperty(component, 'isRange').and.returnValue(false);

      component['setActivateDate']();

      expect(component.activateDate instanceof Date).toBe(true);
      expect(component.activateDate.getFullYear()).toBe(today.getFullYear());
      expect(component.activateDate.getMonth()).toBe(today.getMonth());
    });

    it('setActivateDate: should set with date iso if isRange is false and date param is string', () => {
      const date = '2010-10-10';

      spyOnProperty(component, 'isRange').and.returnValue(false);

      component['setActivateDate'](date);

      expect(component.activateDate instanceof Date).toBe(true);
      expect(component.activateDate.getFullYear()).toBe(2010);
      expect(component.activateDate.getMonth()).toBe(9);
    });

    it('setActivateDate: should keep the initial month and the following month when selecting the last day of the month', () => {
      const date = '2023-03-31';

      spyOnProperty(component, 'isRange').and.returnValue(true);

      component['setActivateDate'](date);

      const { start, end } = component.activateDate;

      expect(start instanceof Date).toBe(true);
      expect(end instanceof Date).toBe(true);

      expect(start.getMonth()).toBe(2);
      expect(start.getFullYear()).toBe(2023);

      expect(end.getMonth()).toBe(3);
      expect(end.getFullYear()).toBe(2023);
    });

    it('setActivateDate: should keep the start month and the after month when selecting the first day of the month', () => {
      const date = '2023-03-01';

      spyOnProperty(component, 'isRange').and.returnValue(true);

      component['setActivateDate'](date);

      const { start, end } = component.activateDate;

      expect(start instanceof Date).toBe(true);
      expect(end instanceof Date).toBe(true);

      expect(start.getMonth()).toBe(2);
      expect(start.getFullYear()).toBe(2023);

      expect(end.getMonth()).toBe(3);
      expect(end.getFullYear()).toBe(2023);
    });

    it('verifyActivateDate: `activateDate` should receive `minDate` if the minimum date is later than today', () => {
      const today = new Date();
      component.minDate = new Date(new Date(today).setMonth(today.getMonth() + 1));

      spyOnProperty(component, 'isRange').and.returnValue(false);
      component['setActivateDate'](null);

      spyOn(component, <any>'verifyActivateDate').and.callThrough();

      expect(component.activateDate).toEqual(component.minDate);
    });

    it('verifyActivateDate: `activateDate` should receive `maxDate` if `minDate` is null and `maxDate` is before today', () => {
      const today = new Date();
      component.minDate = null;
      component.maxDate = new Date(new Date(today).setMonth(today.getMonth() - 1));

      spyOnProperty(component, 'isRange').and.returnValue(false);
      component['setActivateDate'](null);

      spyOn(component, <any>'verifyActivateDate').and.callThrough();

      expect(component.activateDate).toEqual(component.maxDate);
    });

    it('verifyActivateDate: `activateDate` should receive `today` if `minDate` and `maxDate` is null', () => {
      const today = new Date();
      component.minDate = null;
      component.maxDate = null;

      spyOnProperty(component, 'isRange').and.returnValue(false);
      component['setActivateDate'](null);

      spyOn(component, <any>'verifyActivateDate').and.callThrough();

      expect(component.activateDate.getDate()).toEqual(today.getDate());
    });
  });
});
