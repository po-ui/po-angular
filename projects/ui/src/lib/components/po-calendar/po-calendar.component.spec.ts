import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDateService } from '../../services/po-date/po-date.service';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarService } from './services/po-calendar.service';

describe('PoCalendarComponent:', () => {
  let component: PoCalendarComponent;
  let fixture: ComponentFixture<PoCalendarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCalendarComponent, PoCalendarWrapperComponent, PoCalendarHeaderComponent],
      providers: [PoCalendarService, PoDateService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoCalendarBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `setActivateDate`', () => {
      spyOn(component, <any>'setActivateDate');

      component.ngOnInit();

      expect(component['setActivateDate']).toHaveBeenCalled();
    });

    it('getActivateDate: should get activateDate if range is true', () => {
      const expectedValue = new Date(2020, 10, 10);
      component.activateDate = { start: expectedValue, end: new Date(2020, 11, 10) };

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component.getActivateDate('start')).toBe(expectedValue);
    });

    it('getActivateDate: should get `null` if range is true', () => {
      component.activateDate = null;

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component.getActivateDate('start')).toBe(null);
    });

    it('getActivateDate: should get `activateDate` if range is false', () => {
      component.activateDate = new Date();

      spyOnProperty(component, 'isRange').and.returnValue(false);

      expect(component.getActivateDate('start')).toEqual(component.activateDate);
    });

    it('getValue: should get value if range is true and value is truthy', () => {
      const expectedValue = new Date(2020, 10, 10);
      component.value = { start: expectedValue, end: new Date(2021, 5, 10) };

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component.getValue('start')).toBe(expectedValue);
    });

    it('getValue: should get `null` if range is true and value is null', () => {
      component.value = null;

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component.getValue('start')).toBe(null);
    });

    it('getValue: should get `value` if range is false', () => {
      component.value = new Date();

      spyOnProperty(component, 'isRange').and.returnValue(false);

      expect(component.getValue('start')).toEqual(component.value);
    });

    it('getValueFromSelectedDate: should return { start, end: null } if component.value is null', () => {
      const selectedDate = new Date(2020, 10, 10);
      const expectedValue = { start: selectedDate, end: null };

      component.value = null;

      expect(component['getValueFromSelectedDate'](selectedDate)).toEqual(expectedValue);
    });

    it('getValueFromSelectedDate: should return { start, end: null } if component.value.start and component.value.end are truthy', () => {
      const selectedDate = new Date(2020, 10, 10);
      const expectedValue = { start: selectedDate, end: null };

      component.value = { start: new Date(2020, 8, 10), end: new Date(2020, 9, 5) };

      expect(component['getValueFromSelectedDate'](selectedDate)).toEqual(expectedValue);
    });

    it('getValueFromSelectedDate: should return { start, end: null } if component.value.start > selectedDate', () => {
      const selectedDate = new Date(2020, 10, 10);
      const expectedValue = { start: selectedDate, end: null };

      component.value = { start: new Date(2020, 11, 10), end: null };

      expect(component['getValueFromSelectedDate'](selectedDate)).toEqual(expectedValue);
    });

    it('getValueFromSelectedDate: should return { start, end } if component.value.end is falsy', () => {
      const start = new Date(2020, 9, 10);
      const selectedDate = new Date(2020, 10, 10);
      const expectedValue = { start, end: selectedDate };

      component.value = { start, end: null };

      expect(component['getValueFromSelectedDate'](selectedDate)).toEqual(expectedValue);
    });

    it(`onSelectDate: should set component.value with selectedDate if isRange is false'`, () => {
      const selectedDate = new Date(2018, 6, 5);

      spyOnProperty(component, 'isRange').and.returnValue(false);

      component.onSelectDate(selectedDate);

      expect(component.value).toBe(selectedDate);
    });

    it(`onSelectDate: should set component.value with { start, end } if isRange is true'`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = null;

      spyOnProperty(component, 'isRange').and.returnValue(true);
      spyOn(component, <any>'getValueFromSelectedDate').and.callThrough();

      component.onSelectDate(selectedDate);

      expect(component['getValueFromSelectedDate']).toHaveBeenCalled();
      expect(component.value).toEqual({ start: selectedDate, end: null });
    });

    it(`onSelectDate: should call setActivateDate with selectedDate if isRange is true and component.value is falsy`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = null;

      spyOnProperty(component, 'isRange').and.returnValue(true);
      spyOn(component, <any>'setActivateDate').and.callThrough();

      component.onSelectDate(selectedDate, 'end');

      expect(component['setActivateDate']).toHaveBeenCalledWith(selectedDate);
    });

    it(`onSelectDate: should call setActivateDate with selectedDate if isRange is true and { start, end } are truthy`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = { start: new Date(2018, 4, 5), end: new Date(2018, 5, 5) };

      spyOnProperty(component, 'isRange').and.returnValue(true);
      spyOn(component, <any>'setActivateDate').and.callThrough();

      component.onSelectDate(selectedDate, 'end');

      expect(component['setActivateDate']).toHaveBeenCalledWith(selectedDate);
    });

    it(`onSelectDate: should call 'convertDateToISO' to set 'dateIso' and call updateModel with new value`, () => {
      const selectedDate = new Date(2018, 6, 5);
      const isoDate = '2018-07-05';

      spyOnProperty(component, 'isRange').and.returnValue(false);
      spyOn(component.change, 'emit');
      spyOn(component, <any>'updateModel');

      component.onSelectDate(selectedDate);

      expect(component.value).toBe(selectedDate);
      expect(component['updateModel']).toHaveBeenCalledWith(isoDate);
      expect(component.change.emit).toHaveBeenCalledWith(isoDate);
    });

    it(`convertDateFromIso: should return null if date param is not string`, () => {
      const dateFromIso = component['convertDateFromIso'](<any>{});

      expect(dateFromIso).toBe(null);
    });

    it(`convertDateFromIso: should return converted date from iso if date param is string`, () => {
      const dateParam = '2018-07-05';

      const dateFromIso = component['convertDateFromIso'](dateParam);

      expect(dateFromIso.toISOString().substring(0, 10)).toBe(dateParam);
    });

    it(`updateModel: should call propagateChange with model param`, () => {
      const expectedValue = new Date();
      component['propagateChange'] = () => {};

      spyOn(component, <any>'propagateChange');

      component['updateModel'](expectedValue);

      expect(component['propagateChange']).toHaveBeenCalledWith(expectedValue);
    });

    it(`convertDateToISO: should convert { start, end } date to null if invalid value and range is true`, () => {
      const date = { start: 123, end: 12 };
      const expectedValue = { start: null, end: null };

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should return { start: null, end: null } if date is null`, () => {
      const date = null;
      const expectedValue = { start: null, end: null };

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should convert { start, end } date to iso if range is true`, () => {
      const date = { start: new Date(2020, 6, 5), end: new Date(2021, 6, 5) };
      const expectedValue = { start: '2020-07-05', end: '2021-07-05' };

      spyOnProperty(component, 'isRange').and.returnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should convert simple date to iso if range is false`, () => {
      const date = new Date(2020, 6, 5);
      const expectedValue = '2020-07-05';

      spyOnProperty(component, 'isRange').and.returnValue(false);

      expect(component['convertDateToISO'](date)).toBe(expectedValue);
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

    it('validate: should return null', () => {
      expect(component['validate'](undefined)).toBeNull();
    });

    it('writeValue: should call `writeDate` if value is defined', () => {
      const value = '2018-07-05T03:00:00.000Z';

      spyOn(component, <any>'writeDate');

      component.writeValue(value);

      expect(component['writeDate']).toHaveBeenCalledWith(value);
    });

    it('writeValue: should set component.value with null if value param is undefined', () => {
      const value = undefined;

      spyOn(component, <any>'writeDate');

      component.writeValue(value);

      expect(component['writeDate']).not.toHaveBeenCalledWith(value);
    });

    it(`writeDate: should set { start, end } with null if param is undefined`, () => {
      spyOnProperty(component, <any>'isRange').and.returnValue(true);
      spyOn(component, <any>'convertDateFromIso').and.callThrough();

      component['writeDate'](undefined);

      expect(component.value.start).toBe(null);
      expect(component.value.end).toBe(null);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and call 'convertDateFromIso' if value.start and value.end are not Date`, () => {
      const value = { start: '2018-07-05T03:00:00.000', end: '2019-04-05T03:00:00.000' };

      spyOnProperty(component, <any>'isRange').and.returnValue(true);
      spyOn(component, <any>'convertDateFromIso').and.callThrough();

      component['writeDate'](value);

      expect(component.value.start instanceof Date).toBe(true);
      expect(component.value.end instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and not call 'convertDateFromIso' if value.start and value.end are Date`, () => {
      const value = { start: new Date(2018, 7, 5), end: new Date(2019, 9, 5) };

      spyOnProperty(component, <any>'isRange').and.returnValue(true);
      spyOn(component, <any>'convertDateFromIso').and.callThrough();

      component['writeDate'](value);

      expect(component.value.start instanceof Date).toBe(true);
      expect(component.value.end instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).not.toHaveBeenCalled();
    });

    it(`writeDate: should set value and call 'convertDateFromIso' if value param is not a Date`, () => {
      const value = '2018-07-05T03:00:00.000';

      spyOnProperty(component, <any>'isRange').and.returnValue(false);
      spyOn(component, <any>'convertDateFromIso').and.callThrough();

      component['writeDate'](value);

      expect(component.value instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and not call 'convertDateFromIso' if value param is a Date`, () => {
      const value = new Date();

      spyOnProperty(component, <any>'isRange').and.returnValue(false);
      spyOn(component, <any>'convertDateFromIso').and.callThrough();

      component['writeDate'](value);

      expect(component.value instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).not.toHaveBeenCalled();
    });

    it(`getValidateStartDate: should return null if range is true and value param is undefined`, () => {
      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      expect(component['getValidateStartDate'](undefined)).toBe(null);
    });

    it(`getValidateStartDate: should return start date if range is true and value param is valid`, () => {
      const today = new Date();

      const date = { start: today };
      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      expect(component['getValidateStartDate'](date)).toEqual(today);
    });

    it(`getValidateStartDate: should return date if range is false and value param is Date`, () => {
      const date = new Date();
      spyOnProperty(component, <any>'isRange').and.returnValue(false);

      expect(component['getValidateStartDate'](date)).toEqual(date);
    });

    it(`getValidateStartDate:  should return date if range is false and value param is string`, () => {
      const date = '2010-10-10';
      spyOnProperty(component, <any>'isRange').and.returnValue(false);

      expect(component['getValidateStartDate'](date)).toEqual(date);
    });

    it(`getValidateStartDate: should return null if range is false and value param is undefined`, () => {
      spyOnProperty(component, <any>'isRange').and.returnValue(false);

      expect(component['getValidateStartDate'](undefined)).toEqual(null);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 8, 10);
      const end = new Date(2010, 9, 10);

      component.activateDate = { start, end };

      const nextMonth = 7;

      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(8);
      expect(component.activateDate.end.getFullYear()).toEqual(2010);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2011, 0, 10);
      const end = new Date(2011, 1, 10);

      component.activateDate = { start, end };

      const nextMonth = 11;

      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(0);
      expect(component.activateDate.end.getFullYear()).toEqual(2011);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 10, 10);
      const end = new Date(2010, 11, 10);

      component.activateDate = { start, end };

      const nextMonth = 0;

      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2011 }, 'end');

      expect(component.activateDate.start.getMonth()).toEqual(11);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(nextMonth);
      expect(component.activateDate.end.getFullYear()).toEqual(2011);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 7, 10);
      const end = new Date(2010, 8, 10);

      component.activateDate = { start, end };

      const nextMonth = 9;

      spyOnProperty(component, <any>'isRange').and.returnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'end');

      expect(component.activateDate.start.getMonth()).toEqual(8);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(nextMonth);
      expect(component.activateDate.end.getFullYear()).toEqual(2010);
    });

    it(`onHeaderChange: should set activateDate if isRange is false`, () => {
      component.activateDate = null;

      spyOnProperty(component, <any>'isRange').and.returnValue(false);

      component.onHeaderChange({ month: 10, year: 2010 }, 'start');

      expect(component.activateDate).toEqual(null);
    });
  });

  describe('Templates:', () => {
    it('should show `po-calendar-range` if isRange is true', () => {
      spyOnProperty(component, 'isRange').and.returnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-calendar-range')).toBeTruthy();
    });

    it('should show `po-calendar` if isRange is false ', () => {
      spyOnProperty(component, 'isRange').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-calendar')).toBeTruthy();
    });
  });
});
