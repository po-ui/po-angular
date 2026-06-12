import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoDateService } from '../../services/po-date/po-date.service';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarPresetListComponent } from './po-calendar-preset-list/po-calendar-preset-list.component';

import { PoCalendarBaseComponent } from './po-calendar-base.component';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarMode } from './po-calendar-mode.enum';
import { PoCalendarService } from './services/po-calendar.service';
import { PO_CALENDAR_DEFAULT_RANGE_PRESETS } from './constants/po-calendar-range-presets.constant';

describe('PoCalendarComponent:', () => {
  let component: PoCalendarComponent;
  let fixture: ComponentFixture<PoCalendarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [
        PoCalendarComponent,
        PoCalendarWrapperComponent,
        PoCalendarHeaderComponent,
        PoCalendarPresetListComponent
      ],
      providers: [PoCalendarService, PoDateService],
      schemas: [NO_ERRORS_SCHEMA]
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
      vi.spyOn(component as any, 'setActivateDate');

      component.ngOnInit();

      expect(component['setActivateDate']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call `setActivateDate` if `changes` contain minDate', () => {
      const changes: any = {
        minDate: '2021-08-08'
      };

      const spy = vi.spyOn(component as any, 'setActivateDate');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it('ngOnChanges: should call `setActivateDate` if `changes` contain maxDate', () => {
      const changes: any = {
        maxDate: '2021-08-08'
      };

      const spy = vi.spyOn(component as any, 'setActivateDate');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it(`ngOnChanges: shouldn't call 'setActivateDate' if 'changes' not contain maxDate ou minDate`, () => {
      const changes = {};

      const spy = vi.spyOn(component as any, 'setActivateDate');

      component.ngOnChanges(changes);

      expect(spy).not.toHaveBeenCalled();
    });

    it('ngDoCheck: should sync internal signals from input properties', () => {
      component.mode = PoCalendarMode.Range;
      component.rangePresets = true;
      component.rangePresetOptions = undefined;
      component.rangePresetsOrder = 'desc';
      component.minDate = new Date(2024, 0, 1);
      component.maxDate = new Date(2024, 11, 31);

      component.ngDoCheck();

      expect(component['_isRange']()).toBe(true);
      expect(component['_rangePresetsValue']()).toBe(true);
      expect(component['_rangePresetOptionsValue']()).toBeUndefined();
      expect(component['_rangePresetsOrderValue']()).toBe('desc');
      expect(component['_minDateValue']()).toEqual(component.minDate);
      expect(component['_maxDateValue']()).toEqual(component.maxDate);
    });

    it('getActivateDate: should get activateDate if range is true', () => {
      const expectedValue = new Date(2020, 10, 10);
      component.activateDate = { start: expectedValue, end: new Date(2020, 11, 10) };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component.getActivateDate('start')).toBe(expectedValue);
    });

    it('getActivateDate: should get `null` if range is true', () => {
      component.activateDate = null;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component.getActivateDate('start')).toBe(null);
    });

    it('getActivateDate: should get `activateDate` if range is false', () => {
      component.activateDate = new Date();

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      expect(component.getActivateDate('start')).toEqual(component.activateDate);
    });

    it('getValue: should get value if range is true and value is truthy', () => {
      const expectedValue = new Date(2020, 10, 10);
      component.value = { start: expectedValue, end: new Date(2021, 5, 10) };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component.getValue('start')).toBe(expectedValue);
    });

    it('getValue: should get `null` if range is true and value is null', () => {
      component.value = null;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component.getValue('start')).toBe(null);
    });

    it('getValue: should get `value` if range is false', () => {
      component.value = new Date();

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

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

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      component.onSelectDate(selectedDate);

      expect(component.value).toBe(selectedDate);
    });

    it(`onSelectDate: should set component.value with { start, end } if isRange is true'`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = null;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      vi.spyOn(component as any, 'getValueFromSelectedDate');

      component.onSelectDate(selectedDate);

      expect(component['getValueFromSelectedDate']).toHaveBeenCalled();
      expect(component.value).toEqual({ start: selectedDate, end: null });
    });

    it(`onSelectDate: should update activateDate when isRange is true and component.value is falsy`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = null;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onSelectDate(selectedDate, 'end');

      expect(component.activateDate).toEqual({ start: selectedDate, end: selectedDate });
    });

    it(`onSelectDate: should update activateDate when isRange is true and { start, end } are truthy`, () => {
      const selectedDate = new Date(2018, 6, 5);
      component.value = { start: new Date(2018, 4, 5), end: new Date(2018, 5, 5) };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onSelectDate(selectedDate, 'end');

      expect(component.activateDate).toEqual({ start: selectedDate, end: selectedDate });
    });

    it(`onSelectDate: should call 'convertDateToISO' to set 'dateIso' and call updateModel with new value`, () => {
      const selectedDate = new Date(2018, 6, 5);
      const isoDate = '2018-07-05';

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);
      vi.spyOn(component.change as any, 'emit');
      vi.spyOn(component as any, 'updateModel');

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

      vi.spyOn(component as any, 'propagateChange');

      component['updateModel'](expectedValue);

      expect(component['propagateChange']).toHaveBeenCalledWith(expectedValue);
    });

    it(`convertDateToISO: should convert { start, end } date to null if invalid value and range is true`, () => {
      const date = { start: 123, end: 12 };
      const expectedValue = { start: null, end: null };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should return { start: null, end: null } if date is null`, () => {
      const date = null;
      const expectedValue = { start: null, end: null };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should convert { start, end } date to iso if range is true`, () => {
      const date = { start: new Date(2020, 6, 5), end: new Date(2021, 6, 5) };
      const expectedValue = { start: '2020-07-05', end: '2021-07-05' };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component['convertDateToISO'](date)).toEqual(expectedValue);
    });

    it(`convertDateToISO: should convert simple date to iso if range is false`, () => {
      const date = new Date(2020, 6, 5);
      const expectedValue = '2020-07-05';

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

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

      vi.spyOn(component as any, 'writeDate');

      component.writeValue(value);

      expect(component['writeDate']).toHaveBeenCalledWith(value);
    });

    it('writeValue: should set component.value with null if value param is undefined', () => {
      const value = undefined;

      vi.spyOn(component as any, 'writeDate');

      component.writeValue(value);

      expect(component['writeDate']).not.toHaveBeenCalledWith(value);
    });

    it(`writeDate: should set { start, end } with null if param is undefined`, () => {
      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      vi.spyOn(component as any, 'convertDateFromIso');

      component['writeDate'](undefined);

      expect(component.value.start).toBe(null);
      expect(component.value.end).toBe(null);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and call 'convertDateFromIso' if value.start and value.end are not Date`, () => {
      const value = { start: '2018-07-05T03:00:00.000', end: '2019-04-05T03:00:00.000' };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      vi.spyOn(component as any, 'convertDateFromIso');

      component['writeDate'](value);

      expect(component.value.start instanceof Date).toBe(true);
      expect(component.value.end instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and not call 'convertDateFromIso' if value.start and value.end are Date`, () => {
      const value = { start: new Date(2018, 7, 5), end: new Date(2019, 9, 5) };

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      vi.spyOn(component as any, 'convertDateFromIso');

      component['writeDate'](value);

      expect(component.value.start instanceof Date).toBe(true);
      expect(component.value.end instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).not.toHaveBeenCalled();
    });

    it(`writeDate: should set value and call 'convertDateFromIso' if value param is not a Date`, () => {
      const value = '2018-07-05T03:00:00.000';

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);
      vi.spyOn(component as any, 'convertDateFromIso');

      component['writeDate'](value);

      expect(component.value instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).toHaveBeenCalled();
    });

    it(`writeDate: should set value and not call 'convertDateFromIso' if value param is a Date`, () => {
      const value = new Date();

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);
      vi.spyOn(component as any, 'convertDateFromIso');

      component['writeDate'](value);

      expect(component.value instanceof Date).toBe(true);
      expect(component['convertDateFromIso']).not.toHaveBeenCalled();
    });

    it(`getValidateStartDate: should return null if range is true and value param is undefined`, () => {
      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component['getValidateStartDate'](undefined)).toBe(null);
    });

    it(`getValidateStartDate: should return start date if range is true and value param is valid`, () => {
      const today = new Date();

      const date = { start: today };
      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      expect(component['getValidateStartDate'](date)).toEqual(today);
    });

    it(`getValidateStartDate: should return date if range is false and value param is Date`, () => {
      const date = new Date();
      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      expect(component['getValidateStartDate'](date)).toEqual(date);
    });

    it(`getValidateStartDate:  should return date if range is false and value param is string`, () => {
      const date = '2010-10-10';
      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      expect(component['getValidateStartDate'](date)).toEqual(date);
    });

    it(`getValidateStartDate: should return null if range is false and value param is undefined`, () => {
      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      expect(component['getValidateStartDate'](undefined)).toEqual(null);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 8, 10);
      const end = new Date(2010, 9, 10);

      component.activateDate = { start, end };

      const nextMonth = 7;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(9);
      expect(component.activateDate.end.getFullYear()).toEqual(2010);
    });

    it(`onHeaderChange: change the header correctly when the selected date is in the middle of the month`, () => {
      const start = new Date('Wed Mar 15 2023 00:00:00');
      const end = new Date('Sat Apr 01 2023 00:00:00');

      component.activateDate = { start, end };

      const nextMonth = 1;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2023 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.start.getFullYear()).toEqual(2023);

      expect(component.activateDate.end.getMonth()).toEqual(3);
      expect(component.activateDate.end.getFullYear()).toEqual(2023);
    });

    it(`onHeaderChange: change the header correctly when the selected date is on the last day of the month`, () => {
      const start = new Date('Thu Mar 31 2023 00:00:00');
      const end = new Date('Sat Apr 01 2023 00:00:00');

      component.activateDate = { start, end };

      const nextMonth = 1;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2023 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.start.getFullYear()).toEqual(2023);

      expect(component.activateDate.end.getMonth()).toEqual(3);
      expect(component.activateDate.end.getFullYear()).toEqual(2023);
    });

    it(`onHeaderChange: change the header correctly when the previous month is in another year`, () => {
      const start = new Date('Tue Jan 03 2023 00:00:00');
      const end = new Date('Wed Feb 01 2023 00:00:00');

      component.activateDate = { start, end };

      const nextMonth = 11;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2022 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.start.getFullYear()).toEqual(2022);

      expect(component.activateDate.end.getMonth()).toEqual(1);
      expect(component.activateDate.end.getFullYear()).toEqual(2023);
    });

    it(`onHeaderChange: change header correctly when next month is in later year`, () => {
      const start = new Date('Fri Nov 03 2023 00:00:00 ');
      const end = new Date('Fri Dec 01 2023 00:00:00');

      component.activateDate = { start, end };

      const nextMonth = 1; // Janeiro em formato 1-indexed

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2024 }, 'end');

      expect(component.activateDate.start.getMonth()).toEqual(10);
      expect(component.activateDate.start.getFullYear()).toEqual(2023);

      expect(component.activateDate.end.getMonth()).toEqual(nextMonth - 1); // 0 = Janeiro 0-indexed
      expect(component.activateDate.end.getFullYear()).toEqual(2024);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2011, 0, 10);
      const end = new Date(2011, 1, 10);

      component.activateDate = { start, end };

      const nextMonth = 11;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'start');

      expect(component.activateDate.start.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(1);
      expect(component.activateDate.end.getFullYear()).toEqual(2011);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 10, 10);
      const end = new Date(2010, 11, 10);

      component.activateDate = { start, end };

      const nextMonth = 1; // Janeiro em formato 1-indexed

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2011 }, 'end');

      expect(component.activateDate.start.getMonth()).toEqual(10);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(nextMonth - 1); // 0 = Janeiro 0-indexed
      expect(component.activateDate.end.getFullYear()).toEqual(2011);
    });

    it(`onHeaderChange: `, () => {
      const start = new Date(2010, 7, 10);
      const end = new Date(2010, 8, 10);

      component.activateDate = { start, end };

      const nextMonth = 9;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);

      component.onHeaderChange({ month: nextMonth, year: 2010 }, 'end');

      expect(component.activateDate.start.getMonth()).toEqual(7);
      expect(component.activateDate.start.getFullYear()).toEqual(2010);

      expect(component.activateDate.end.getMonth()).toEqual(nextMonth - 1);
      expect(component.activateDate.end.getFullYear()).toEqual(2010);
    });

    it('onHeaderChange: should use new Date when activateDate.start is not a Date', () => {
      component.activateDate = { start: 'invalid', end: new Date(2010, 8, 10) } as any;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      const buildSpy = vi.spyOn(component as any, 'buildDateWithMonthYear');

      component.onHeaderChange({ month: 5, year: 2010 }, 'start');

      expect(buildSpy).toHaveBeenCalled();
      expect(vi.mocked(buildSpy).mock.lastCall[0] instanceof Date).toBe(true);
    });

    it('onHeaderChange: should use new Date when activateDate.end is not a Date', () => {
      component.activateDate = { start: new Date(2010, 7, 10), end: 'invalid' } as any;

      vi.spyOn(component as any, 'isRange').mockReturnValue(true);
      const buildSpy = vi.spyOn(component as any, 'buildDateWithMonthYear');

      component.onHeaderChange({ month: 5, year: 2010 }, 'end');

      expect(buildSpy).toHaveBeenCalled();
      expect(vi.mocked(buildSpy).mock.lastCall[0] instanceof Date).toBe(true);
    });

    it('buildDateWithMonthYear: should default day to 1 when baseDate is not a Date', () => {
      const result = (component as any).buildDateWithMonthYear('invalid', 1, 2024);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(1);
    });

    it('buildDateWithMonthYear: should clamp day to last day of target month', () => {
      const baseDate = new Date(2024, 0, 31);

      const result = (component as any).buildDateWithMonthYear(baseDate, 1, 2024);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29);
    });

    it(`onHeaderChange: should set activateDate if isRange is false`, () => {
      component.activateDate = null;

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      component.onHeaderChange({ month: 10, year: 2010 }, 'start');

      expect(component.activateDate).toEqual(null);
    });

    it('onHoverDate: should set hoverValue', () => {
      const expectedValue = new Date(2010, 7, 10);

      component.onHoverDate(expectedValue);

      expect(component.hoverValue).toBe(expectedValue);
    });

    it('onSelectDate: should clear value and emit empty string when selectedDate is empty or undefined', () => {
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component.change as any, 'emit');
      vi.spyOn(component['changeDetector'] as any, 'markForCheck');

      component.value = new Date();

      component.onSelectDate('');
      expect(component.value).toBeNull();
      expect(component['updateModel']).toHaveBeenCalledWith('');
      expect(component.change.emit).toHaveBeenCalledWith('');
      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();

      component.value = new Date();

      component.onSelectDate(undefined);
      expect(component.value).toBeNull();
      expect(component['updateModel']).toHaveBeenCalledWith('');
      expect(component.change.emit).toHaveBeenCalledWith('');
      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
    });

    it('onCloseCalendar: should emit change with current value', () => {
      const currentValue = new Date(2024, 4, 10);

      component.value = currentValue;
      vi.spyOn(component.change as any, 'emit');

      component.onCloseCalendar();

      expect(component.change.emit).toHaveBeenCalledWith(currentValue as any);
    });

    it('onCloseCalendar: should emit close event', () => {
      vi.spyOn(component.close as any, 'emit');

      component.onCloseCalendar();

      expect(component.close.emit).toHaveBeenCalled();
    });

    it('onTimeChange: should emit changeTime with the time value', () => {
      vi.spyOn(component.changeTime as any, 'emit');

      component.onTimeChange('14:30');

      expect(component.changeTime.emit).toHaveBeenCalledWith('14:30');
    });

    it('onTimerBoundaryTab: should emit timerBoundaryTab event', () => {
      vi.spyOn(component.timerBoundaryTab as any, 'emit');
      const event = { direction: 'forward', event: new KeyboardEvent('keydown'), column: 'minutes' };

      component.onTimerBoundaryTab(event);

      expect(component.timerBoundaryTab.emit).toHaveBeenCalledWith(event);
    });

    describe('onSelectDate in date-time mode:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.DateTime;
        component['timerComponent'] = { writeValue: vi.fn() } as any;
      });

      it('should reset timer and emit changeTime with empty string when clearing in date-time mode', () => {
        vi.spyOn(component.changeTime as any, 'emit');
        vi.spyOn(component.change as any, 'emit');

        component.onSelectDate(undefined);

        expect(component['timerComponent'].writeValue).toHaveBeenCalledWith(null);
        expect(component.changeTime.emit).toHaveBeenCalledWith('');
        expect(component.change.emit).toHaveBeenCalledWith('');
      });

      it('should set current time on timer and emit changeTime when selecting today in date-time mode', () => {
        vi.spyOn(component.changeTime as any, 'emit');
        const today = new Date();

        component.onSelectDate(today);

        expect(component['timerComponent'].writeValue).toHaveBeenCalled();
        expect(component.changeTime.emit).toHaveBeenCalled();

        const emittedTime = vi.mocked(component.changeTime.emit as Mock).mock.lastCall[0];
        expect(emittedTime).toMatch(/^\d{2}:\d{2}$/);
      });

      it('should include seconds in time when showSeconds is true and selecting today', () => {
        vi.spyOn(component.changeTime as any, 'emit');
        component.showSeconds = true;
        const today = new Date();

        component.onSelectDate(today);

        const emittedTime = vi.mocked(component.changeTime.emit as Mock).mock.lastCall[0];
        expect(emittedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      });

      it('should not set time on timer when selecting a date that is not today', () => {
        vi.spyOn(component.changeTime as any, 'emit');
        const notToday = new Date(2020, 0, 1);

        component.onSelectDate(notToday);

        expect(component.changeTime.emit).not.toHaveBeenCalled();
      });
    });

    describe('isToday:', () => {
      it('should return true for today', () => {
        const today = new Date();
        expect(component['poCalendarService'].isToday(today)).toBe(true);
      });

      it('should return false for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(component['poCalendarService'].isToday(yesterday)).toBe(false);
      });

      it('should return false for null', () => {
        expect(component['poCalendarService'].isToday(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(component['poCalendarService'].isToday(undefined)).toBe(false);
      });
    });

    describe('effectivePresets:', () => {
      it('should return default presets when rangePresets is true and rangePresetOptions is undefined', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = true;
        component.ngDoCheck();

        const result = component.effectivePresets();
        expect(result.length).toBe(PO_CALENDAR_DEFAULT_RANGE_PRESETS.length);
        PO_CALENDAR_DEFAULT_RANGE_PRESETS.forEach(preset => {
          expect(result.some(p => p.label === preset.label)).toBe(true);
        });
      });

      it('should return empty array when rangePresets is false and rangePresetOptions is undefined', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = false;
        component.ngDoCheck();

        expect(component.effectivePresets()).toEqual([]);
      });

      it('should return empty array when mode is not Range', () => {
        component.rangePresets = true;
        component.ngDoCheck();

        expect(component.effectivePresets()).toEqual([]);
      });

      it('should return defaults + custom when rangePresets is true and rangePresetOptions has values', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = true;
        const customPresets = [{ label: 'custom', dateRange: () => ({ start: new Date(), end: new Date() }) }];
        component.rangePresetOptions = customPresets;
        component.ngDoCheck();

        const result = component.effectivePresets();
        expect(result.length).toBe(PO_CALENDAR_DEFAULT_RANGE_PRESETS.length + customPresets.length);
        expect(result.some(p => p.label === 'custom')).toBe(true);
      });

      it('should return only custom presets when rangePresets is false and rangePresetOptions has values', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = false;
        const customPresets = [{ label: 'custom', dateRange: () => ({ start: new Date(), end: new Date() }) }];
        component.rangePresetOptions = customPresets;
        component.ngDoCheck();

        const result = component.effectivePresets();
        // custom + mandatory 'today'
        expect(result.some(p => p.label === 'custom')).toBe(true);
        expect(result.some(p => p.label === 'today')).toBe(true);
      });

      it('should return empty array when rangePresets is true but mode is not Range', () => {
        component.rangePresets = true;
        component.mode = undefined;
        component.ngDoCheck();

        expect(component.effectivePresets()).toEqual([]);
      });

      it('should filter default presets when rangePresets is an array of keys', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = ['7days', '30days'];
        component.ngDoCheck();

        const result = component.effectivePresets();
        // Should include 7days, 30days, and today (mandatory)
        expect(result.some(p => p.label === 'today')).toBe(true);
        expect(result.some(p => p.label === '7days')).toBe(true);
        expect(result.some(p => p.label === '30days')).toBe(true);
        expect(result.some(p => p.label === 'yesterday')).toBe(false);
      });

      it('should always include today preset even if not in array', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = ['7days'];
        component.ngDoCheck();

        const result = component.effectivePresets();
        expect(result.some(p => p.label === 'today')).toBe(true);
      });

      it('should inject today preset when only custom presets exist without today', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = false;
        const customPresets = [{ label: 'myPreset', dateRange: () => ({ start: new Date(), end: new Date() }) }];
        component.rangePresetOptions = customPresets;
        component.ngDoCheck();

        const result = component.effectivePresets();
        expect(result.some(p => p.label === 'today')).toBe(true);
        expect(result.some(p => p.label === 'myPreset')).toBe(true);
      });

      it('should combine filtered default presets with custom presets when rangePresets is Array<string> and rangePresetOptions has values', () => {
        component.mode = PoCalendarMode.Range;
        component.rangePresets = ['today', 'yesterday', '7days'];

        const today = new Date();
        const customPreset1 = {
          label: 'custom1',
          dateRange: () => {
            const start = new Date(today);
            start.setDate(start.getDate() - 3);
            return { start, end: today };
          }
        };
        const customPreset2 = {
          label: 'custom2',
          dateRange: () => {
            const start = new Date(today);
            start.setDate(start.getDate() - 15);
            return { start, end: today };
          }
        };
        component.rangePresetOptions = [customPreset1, customPreset2];
        component.ngDoCheck();

        const result = component.effectivePresets();

        // Should contain the filtered default presets
        expect(result.some(p => p.label === 'today')).toBe(true);
        expect(result.some(p => p.label === 'yesterday')).toBe(true);
        expect(result.some(p => p.label === '7days')).toBe(true);

        // Should contain custom presets
        expect(result.some(p => p.label === 'custom1')).toBe(true);
        expect(result.some(p => p.label === 'custom2')).toBe(true);

        // Should NOT contain default presets not in the array
        expect(result.some(p => p.label === '14days')).toBe(false);
        expect(result.some(p => p.label === '30days')).toBe(false);
        expect(result.some(p => p.label === '3months')).toBe(false);
        expect(result.some(p => p.label === '6months')).toBe(false);

        // Result should be sorted (all are past/present, sorted by proximity)
        // and enriched with isDisabled property
        result.forEach(p => {
          expect(p.isDisabled).toBeDefined();
        });
      });
    });

    describe('sortPresetsByTemporality:', () => {
      it('should sort presets in ASC order: Future -> Present -> Past', () => {
        component.rangePresetsOrder = 'asc';
        const today = new Date();
        const presets = [
          {
            label: 'past',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() - 10);
              return { start, end: today };
            }
          },
          {
            label: 'future',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() + 5);
              const end = new Date(today);
              end.setDate(end.getDate() + 10);
              return { start, end };
            }
          },
          {
            label: 'present',
            dateRange: () => ({ start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), end: today })
          }
        ];

        const result = component['sortPresetsByTemporality'](presets);
        expect(result[0].label).toBe('future');
        expect(result[1].label).toBe('present');
        expect(result[2].label).toBe('past');
      });

      it('should sort presets in DESC order: Past -> Present -> Future', () => {
        component.rangePresetsOrder = 'desc';
        const today = new Date();
        const presets = [
          {
            label: 'past',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() - 10);
              return { start, end: today };
            }
          },
          {
            label: 'future',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() + 5);
              const end = new Date(today);
              end.setDate(end.getDate() + 10);
              return { start, end };
            }
          },
          {
            label: 'present',
            dateRange: () => ({ start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), end: today })
          }
        ];

        const result = component['sortPresetsByTemporality'](presets);
        expect(result[0].label).toBe('past');
        expect(result[1].label).toBe('present');
        expect(result[2].label).toBe('future');
      });

      it('should sort by proximity within the same group (ASC)', () => {
        component.rangePresetsOrder = 'asc';
        const today = new Date();
        const presets = [
          {
            label: 'far-past',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() - 30);
              return { start, end: today };
            }
          },
          {
            label: 'near-past',
            dateRange: () => {
              const start = new Date(today);
              start.setDate(start.getDate() - 3);
              return { start, end: today };
            }
          }
        ];

        const result = component['sortPresetsByTemporality'](presets);
        expect(result[0].label).toBe('near-past');
        expect(result[1].label).toBe('far-past');
      });
    });

    describe('enrichPresetsWithDisabledState:', () => {
      it('should set isDisabled to true when preset start is before minDate', () => {
        component['_minDate'] = new Date(2025, 5, 1);

        const presets = [
          {
            label: 'before-min',
            dateRange: () => ({
              start: new Date(2025, 4, 1),
              end: new Date(2025, 5, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(true);
      });

      it('should set isDisabled to true when preset end is after maxDate', () => {
        component['_maxDate'] = new Date(2025, 5, 30);

        const presets = [
          {
            label: 'after-max',
            dateRange: () => ({
              start: new Date(2025, 5, 1),
              end: new Date(2025, 6, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(true);
      });

      it('should set isDisabled to true when preset violates both minDate and maxDate', () => {
        component['_minDate'] = new Date(2025, 5, 10);
        component['_maxDate'] = new Date(2025, 5, 20);

        const presets = [
          {
            label: 'invalid-both',
            dateRange: () => ({
              start: new Date(2025, 4, 1),
              end: new Date(2025, 6, 30)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(true);
      });

      it('should set isDisabled to false when preset is within min/max range', () => {
        component['_minDate'] = new Date(2025, 0, 1);
        component['_maxDate'] = new Date(2025, 11, 31);

        const presets = [
          {
            label: 'valid',
            dateRange: () => ({
              start: new Date(2025, 5, 1),
              end: new Date(2025, 5, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(false);
      });

      it('should set isDisabled to false when no minDate/maxDate configured', () => {
        const presets = [
          {
            label: 'no-limits',
            dateRange: () => ({
              start: new Date(2025, 5, 1),
              end: new Date(2025, 5, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(false);
      });

      it('should correctly disable some presets and enable others', () => {
        component['_minDate'] = new Date(2025, 5, 1);

        const presets = [
          {
            label: 'invalid',
            dateRange: () => ({
              start: new Date(2025, 4, 1),
              end: new Date(2025, 4, 15)
            })
          },
          {
            label: 'valid',
            dateRange: () => ({
              start: new Date(2025, 5, 5),
              end: new Date(2025, 5, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        const invalidPreset = result.find(p => p.label === 'invalid');
        const validPreset = result.find(p => p.label === 'valid');
        expect(invalidPreset.isDisabled).toBe(true);
        expect(validPreset.isDisabled).toBe(false);
      });

      it('should set isDisabled to false when only maxDate is set and preset end is within range', () => {
        component['_maxDate'] = new Date(2025, 11, 31);

        const presets = [
          {
            label: 'within-max',
            dateRange: () => ({
              start: new Date(2025, 5, 1),
              end: new Date(2025, 5, 15)
            })
          }
        ];

        const result = component['enrichPresetsWithDisabledState'](presets);
        expect(result[0].isDisabled).toBe(false);
      });

      it('should use explicit minDate/maxDate parameters when provided instead of component properties', () => {
        component['_minDate'] = undefined;
        component['_maxDate'] = undefined;

        const presets = [
          {
            label: 'test-explicit',
            dateRange: () => ({
              start: new Date(2025, 3, 1),
              end: new Date(2025, 7, 30)
            })
          }
        ];

        const explicitMin = new Date(2025, 5, 1);
        const explicitMax = new Date(2025, 5, 30);

        const result = component['enrichPresetsWithDisabledState'](presets, explicitMin, explicitMax);
        expect(result[0].isDisabled).toBe(true);
      });
    });

    describe('onPresetSelected:', () => {
      it('should update value, activateDate, and selectedPresetLabel', () => {
        const start = new Date(2025, 0, 1);
        const end = new Date(2025, 0, 31);

        vi.spyOn(component as any, 'isRange').mockReturnValue(true);
        vi.spyOn(component.change as any, 'emit');
        vi.spyOn(component as any, 'updateModel');

        component.onPresetSelected({ label: 'test', start, end });

        expect(component.selectedPresetLabel).toBe('test');
        expect(component.value.start).toEqual(start);
        expect(component.value.end).toEqual(end);
        expect(component.activateDate.start).toEqual(start);
        expect(component.activateDate.end).toEqual(end);
        expect(component['updateModel']).toHaveBeenCalled();
        expect(component.change.emit).toHaveBeenCalled();
      });

      it('should clamp dates to minDate/maxDate', () => {
        const minDate = new Date(2025, 0, 10);
        const maxDate = new Date(2025, 0, 20);

        component['_minDate'] = minDate;
        component['_maxDate'] = maxDate;

        vi.spyOn(component as any, 'isRange').mockReturnValue(true);
        vi.spyOn(component.change as any, 'emit');
        vi.spyOn(component as any, 'updateModel');

        component.onPresetSelected({ label: 'test', start: new Date(2025, 0, 1), end: new Date(2025, 0, 31) });

        expect(component.value.start.getTime()).toEqual(minDate.getTime());
        expect(component.value.end.getTime()).toEqual(maxDate.getTime());
      });

      it('should do nothing when clamped start > end', () => {
        const minDate = new Date(2025, 0, 10);
        const maxDate = new Date(2025, 0, 20);

        component['_minDate'] = minDate;
        component['_maxDate'] = maxDate;

        vi.spyOn(component as any, 'isRange').mockReturnValue(true);
        vi.spyOn(component.change as any, 'emit');

        component.onPresetSelected({ label: 'test', start: new Date(2025, 0, 25), end: new Date(2025, 0, 5) });

        expect(component.change.emit).not.toHaveBeenCalled();
      });
    });

    it('onSelectDate: should clear selectedPresetLabel', () => {
      component.selectedPresetLabel = 'today';

      vi.spyOn(component as any, 'isRange').mockReturnValue(false);

      component.onSelectDate(new Date(2025, 0, 1));

      expect(component.selectedPresetLabel).toBeNull();
    });
  });

  describe('Month-Year/Year mode:', () => {
    describe('isMonthDisabled:', () => {
      it('should return true when month is before minDate', () => {
        component.minDate = new Date(2025, 5, 1); // June 2025
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(3)).toBe(true); // April (index 3 = month 4)
      });

      it('should return false when month is equal to minDate month', () => {
        component.minDate = new Date(2025, 5, 1); // June 2025
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(5)).toBe(false); // June (index 5 = month 6)
      });

      it('should return false when month is after minDate', () => {
        component.minDate = new Date(2025, 5, 1); // June 2025
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(7)).toBe(false); // August (index 7 = month 8)
      });

      it('should return true when month is after maxDate', () => {
        component.maxDate = new Date(2025, 8, 30); // September 2025
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(10)).toBe(true); // November (index 10 = month 11)
      });

      it('should return false when month is equal to maxDate month', () => {
        component.maxDate = new Date(2025, 8, 30); // September 2025
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(8)).toBe(false); // September (index 8 = month 9)
      });

      it('should return false when no minDate or maxDate', () => {
        component.minDate = undefined;
        component.maxDate = undefined;
        component['selectedYear'] = 2025;

        expect(component.isMonthDisabled(0)).toBe(false);
        expect(component.isMonthDisabled(11)).toBe(false);
      });

      it('should return true when year is before minDate year', () => {
        component.minDate = new Date(2025, 0, 1);
        component['selectedYear'] = 2024;

        expect(component.isMonthDisabled(11)).toBe(true);
      });

      it('should return true when year is after maxDate year', () => {
        component.maxDate = new Date(2025, 11, 31);
        component['selectedYear'] = 2026;

        expect(component.isMonthDisabled(0)).toBe(true);
      });
    });

    describe('isYearDisabled:', () => {
      it('should return true when year is before minDate year', () => {
        component.minDate = new Date(2020, 0, 1);

        expect(component.isYearDisabled(2019)).toBe(true);
      });

      it('should return false when year equals minDate year', () => {
        component.minDate = new Date(2020, 0, 1);

        expect(component.isYearDisabled(2020)).toBe(false);
      });

      it('should return true when year is after maxDate year', () => {
        component.maxDate = new Date(2030, 11, 31);

        expect(component.isYearDisabled(2031)).toBe(true);
      });

      it('should return false when year equals maxDate year', () => {
        component.maxDate = new Date(2030, 11, 31);

        expect(component.isYearDisabled(2030)).toBe(false);
      });

      it('should return false when no minDate or maxDate', () => {
        component.minDate = undefined;
        component.maxDate = undefined;

        expect(component.isYearDisabled(1900)).toBe(false);
        expect(component.isYearDisabled(2100)).toBe(false);
      });

      it('should return false when year is within range', () => {
        component.minDate = new Date(2020, 0, 1);
        component.maxDate = new Date(2030, 11, 31);

        expect(component.isYearDisabled(2025)).toBe(false);
      });
    });

    describe('isYearDisabled with selectedMonth:', () => {
      it('should return true when selectedMonth is set and year+month is before minDate', () => {
        component.minDate = new Date(2025, 5, 1);
        component['selectedMonth'] = 3;

        expect(component.isYearDisabled(2025)).toBe(true);
      });

      it('should return true when selectedMonth is set and year+month is after maxDate', () => {
        component.maxDate = new Date(2025, 5, 30);
        component['selectedMonth'] = 8;

        expect(component.isYearDisabled(2025)).toBe(true);
      });

      it('should return false when selectedMonth is set and year+month is within range', () => {
        component.minDate = new Date(2020, 0, 1);
        component.maxDate = new Date(2030, 11, 31);
        component['selectedMonth'] = 6;

        expect(component.isYearDisabled(2025)).toBe(false);
      });
    });

    describe('selectMonth:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should set selectedIndexMonth, selectedMonth and call updateModel on Enter key', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        component.selectMonth(3, event);

        expect(component['selectedIndexMonth']).toBe(3);
        expect(component['selectedMonth']).toBe(4);
        expect(component['updateModel']).toHaveBeenCalledWith(4);
      });

      it('should set selectedIndexMonth, selectedMonth and call updateModel on Space key', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { code: 'Space' });

        component.selectMonth(0, event);

        expect(component['selectedIndexMonth']).toBe(0);
        expect(component['selectedMonth']).toBe(1);
        expect(component['updateModel']).toHaveBeenCalledWith(1);
      });

      it('should set selectedIndexMonth, selectedMonth and call updateModel when selected=true', () => {
        vi.spyOn(component as any, 'updateModel');

        component.selectMonth(5, undefined, true);

        expect(component['selectedIndexMonth']).toBe(5);
        expect(component['selectedMonth']).toBe(6);
        expect(component['updateModel']).toHaveBeenCalledWith(6);
      });

      it('should not call updateModel when event is not a select action', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.selectMonth(3, event);

        expect(component['updateModel']).not.toHaveBeenCalled();
      });
    });

    describe('selectYear:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should use default selected=false and call updateModel only on Enter key', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        component.selectYear(2, event, undefined, 2022);

        expect(component['selectedIndexYear']).toBe(2);
        expect(component['selectedYear']).toBe(2022);
        expect(component['updateModel']).toHaveBeenCalledWith(2022);
      });

      it('should set selectedIndexYear, selectedYear and call updateModel on Enter key', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        component.selectYear(10, event, false, 2025);

        expect(component['selectedIndexYear']).toBe(10);
        expect(component['selectedYear']).toBe(2025);
        expect(component['updateModel']).toHaveBeenCalledWith(2025);
      });

      it('should set selectedIndexYear, selectedYear and call updateModel on Space key', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { code: 'Space' });

        component.selectYear(5, event, false, 2020);

        expect(component['selectedIndexYear']).toBe(5);
        expect(component['selectedYear']).toBe(2020);
        expect(component['updateModel']).toHaveBeenCalledWith(2020);
      });

      it('should set selectedIndexYear, selectedYear and call updateModel when selected=true', () => {
        vi.spyOn(component as any, 'updateModel');

        component.selectYear(8, undefined, true, 2030);

        expect(component['selectedIndexYear']).toBe(8);
        expect(component['selectedYear']).toBe(2030);
        expect(component['updateModel']).toHaveBeenCalledWith(2030);
      });

      it('should not call updateModel when event is not a select action', () => {
        vi.spyOn(component as any, 'updateModel');
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.selectYear(3, event, false, 2025);

        expect(component['updateModel']).not.toHaveBeenCalled();
      });
    });

    describe('onKeydownMonth:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should call selectMonth on Enter key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        component.onKeydownMonth(event, 3);

        expect(component.selectMonth).toHaveBeenCalledWith(3, event);
      });

      it('should call selectMonth on Space key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { code: 'Space' });

        component.onKeydownMonth(event, 5);

        expect(component.selectMonth).toHaveBeenCalledWith(5, event);
      });

      it('should navigate down on ArrowDown key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.onKeydownMonth(event, 3);

        expect(component.selectMonth).toHaveBeenCalledWith(4, event);
      });

      it('should not exceed max index on ArrowDown key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.onKeydownMonth(event, 11);

        expect(component.selectMonth).toHaveBeenCalledWith(11, event);
      });

      it('should navigate up on ArrowUp key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onKeydownMonth(event, 5);

        expect(component.selectMonth).toHaveBeenCalledWith(4, event);
      });

      it('should not go below 0 on ArrowUp key', () => {
        vi.spyOn(component as any, 'selectMonth');
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(new Array(12).fill(null));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onKeydownMonth(event, 0);

        expect(component.selectMonth).toHaveBeenCalledWith(0, event);
      });

      it('should emit close on Shift+Tab', () => {
        vi.spyOn(component.close as any, 'emit');
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

        component.onKeydownMonth(event, 0);

        expect(component.close.emit).toHaveBeenCalled();
        expect(component['focusedIndex']).toBe(0);
      });

      it('should focus year list on Tab (no shift)', () => {
        const mockYearBtn = { focus: vi.fn(), disabled: false } as any;
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([mockYearBtn]);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        component['selectedIndexYear'] = 0;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        component.onKeydownMonth(event, 0);

        expect(mockYearBtn.focus).toHaveBeenCalled();
      });

      it('should focus first enabled year option on Tab when no selected year', () => {
        const mockYearBtn = { focus: vi.fn(), disabled: false } as any;
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([mockYearBtn]);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        component['selectedIndexYear'] = undefined;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        component.onKeydownMonth(event, 0);

        expect(mockYearBtn.focus).toHaveBeenCalled();
      });
    });

    describe('onKeydownYear:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should call selectYear on Enter key', () => {
        vi.spyOn(component as any, 'selectYear');
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(new Array(301).fill(null));
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        component.onKeydownYear(event, 3);

        expect(component.selectYear).toHaveBeenCalledWith(3, event);
      });

      it('should call selectYear on Space key', () => {
        vi.spyOn(component as any, 'selectYear');
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(new Array(301).fill(null));
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { code: 'Space' });

        component.onKeydownYear(event, 5);

        expect(component.selectYear).toHaveBeenCalledWith(5, event);
      });

      it('should navigate down on ArrowDown key', () => {
        vi.spyOn(component as any, 'selectYear');
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(new Array(301).fill(null));
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.onKeydownYear(event, 3);

        expect(component.selectYear).toHaveBeenCalledWith(4, event);
      });

      it('should navigate up on ArrowUp key', () => {
        vi.spyOn(component as any, 'selectYear');
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(new Array(301).fill(null));
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onKeydownYear(event, 5);

        expect(component.selectYear).toHaveBeenCalledWith(4, event);
      });

      it('should not go below 0 on ArrowUp key', () => {
        vi.spyOn(component as any, 'selectYear');
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onKeydownYear(event, 0);

        expect(component.selectYear).toHaveBeenCalledWith(0, event);
      });

      it('should emit close on Tab key (no shift)', () => {
        vi.spyOn(component.close as any, 'emit');
        const event = new KeyboardEvent('keydown', { key: 'Tab' });

        component.onKeydownYear(event, 3);

        expect(component.close.emit).toHaveBeenCalled();
        expect(component['focusedIndex']).toBe(0);
      });

      it('should emit close on Shift+Tab in year mode', () => {
        component.mode = PoCalendarMode.Year;
        vi.spyOn(component.close as any, 'emit');
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

        component.onKeydownYear(event, 0);

        expect(component.close.emit).toHaveBeenCalled();
      });

      it('should focus month list on Shift+Tab in month-year mode', () => {
        component.mode = PoCalendarMode.MonthYear;
        const mockMonthBtn = { focus: vi.fn() } as any;
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([mockMonthBtn]);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        component['selectedIndexMonth'] = 0;

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        component.onKeydownYear(event, 0);

        expect(mockMonthBtn.focus).toHaveBeenCalled();
      });

      it('should focus first month option on Shift+Tab when no selected month', () => {
        component.mode = PoCalendarMode.MonthYear;
        const mockMonthBtn = { focus: vi.fn() } as any;
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([mockMonthBtn]);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        component['selectedIndexMonth'] = undefined;

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        component.onKeydownYear(event, 0);

        expect(mockMonthBtn.focus).toHaveBeenCalled();
      });

      it('should not exceed max index on ArrowDown key', () => {
        vi.spyOn(component as any, 'selectYear');
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(new Array(301));
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeydownYear(event, 300);

        expect(component.selectYear).toHaveBeenCalledWith(300, event);
      });
    });

    describe('updateModel for month-year mode:', () => {
      it('should emit Date with month and year when both selected in month-year mode', () => {
        component.mode = PoCalendarMode.MonthYear;
        component['selectedMonth'] = 6;
        component['selectedYear'] = 2025;

        vi.spyOn(component.change as any, 'emit');

        component['updateModel'](6);

        expect(component.change.emit).toHaveBeenCalled();
        const emittedValue = vi.mocked(component.change.emit as Mock).mock.lastCall[0];
        expect(emittedValue instanceof Date).toBe(true);
        expect(emittedValue.getFullYear()).toBe(2025);
        expect(emittedValue.getMonth()).toBe(5);
      });

      it('should return early when selectedMonth is missing in month-year mode', () => {
        component.mode = PoCalendarMode.MonthYear;
        component['selectedMonth'] = null;
        component['selectedYear'] = 2025;

        vi.spyOn(component.change as any, 'emit');

        component['updateModel'](null);

        expect(component.change.emit).not.toHaveBeenCalled();
      });

      it('should emit Date with year when selectedYear exists in year mode', () => {
        component.mode = PoCalendarMode.Year;
        component['selectedYear'] = 2025;

        vi.spyOn(component.change as any, 'emit');

        component['updateModel'](2025);

        expect(component.change.emit).toHaveBeenCalled();
        const emittedValue = vi.mocked(component.change.emit as Mock).mock.lastCall[0];
        expect(emittedValue instanceof Date).toBe(true);
        expect(emittedValue.getFullYear()).toBe(2025);
        expect(emittedValue.getMonth()).toBe(0);
      });

      it('should return early when selectedYear is missing in year mode', () => {
        component.mode = PoCalendarMode.Year;
        component['selectedYear'] = null;

        vi.spyOn(component.change as any, 'emit');

        component['updateModel'](null);

        expect(component.change.emit).not.toHaveBeenCalled();
      });

      it('should call propagateChange with finalValue', () => {
        component.mode = PoCalendarMode.Year;
        component['selectedYear'] = 2025;
        component['propagateChange'] = vi.fn();

        component['updateModel'](2025);

        expect(component['propagateChange']).toHaveBeenCalled();
      });
    });

    describe('writeDate for month-year/year modes:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should set month and year when mode is month-year', () => {
        const date = new Date(2025, 5, 1);
        const mockYearBtns = component.displayYears.map((y: number) => ({ label: () => String(y) }));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockYearBtns);

        component['writeDate'](date);

        expect(component['selectedMonth']).toBe(6);
        expect(component['selectedIndexMonth']).toBe(5);
        expect(component['selectedYear']).toBe(2025);
      });

      it('should set year when mode is year', () => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();
        const date = new Date(2025, 0, 1);
        const mockYearBtns = component.displayYears.map((y: number) => ({ label: () => String(y) }));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockYearBtns);

        component['writeDate'](date);

        expect(component['selectedYear']).toBe(2025);
      });

      it('should set selectedIndexYear correctly via findIndex callback in month-year mode', () => {
        const targetYear = new Date().getFullYear();
        const date = new Date(targetYear, 3, 1);
        const mockYearBtns = component.displayYears.map((y: number) => ({ label: () => String(y) }));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockYearBtns);

        component['writeDate'](date);

        const expectedIndex = component.displayYears.indexOf(targetYear);
        expect(component['selectedIndexYear']).toBe(expectedIndex);
      });

      it('should set selectedIndexYear correctly via findIndex callback in year mode', () => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();
        const targetYear = new Date().getFullYear();
        const date = new Date(targetYear, 0, 1);
        const mockYearBtns = component.displayYears.map((y: number) => ({ label: () => String(y) }));
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockYearBtns);

        component['writeDate'](date);

        const expectedIndex = component.displayYears.indexOf(targetYear);
        expect(component['selectedIndexYear']).toBe(expectedIndex);
      });
    });

    describe('writeValue for month-year/year modes:', () => {
      it('should clear selectedMonth, selectedYear, selectedIndexMonth, selectedIndexYear when value is falsy', () => {
        component['selectedMonth'] = 6;
        component['selectedYear'] = 2025;
        component['selectedIndexMonth'] = 5;
        component['selectedIndexYear'] = 10;

        component.writeValue(null);

        expect(component['selectedMonth']).toBeNull();
        expect(component['selectedYear']).toBeNull();
        expect(component['selectedIndexMonth']).toBeNull();
        expect(component['selectedIndexYear']).toBeNull();
      });
    });

    describe('isMonthDisabled when selectedYear is undefined:', () => {
      it('should return false when selectedYear is not set', () => {
        component['selectedYear'] = undefined;
        component.minDate = new Date(2025, 0, 1);

        expect(component.isMonthDisabled(0)).toBe(false);
      });
    });

    describe('selectMonth with DOM focus:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should set focusedIndex and call focus when monthOptions[index] exists', () => {
        const mockBtn = { focus: vi.fn() } as any;
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([mockBtn]);
        vi.spyOn(component as any, 'updateModel');

        component.selectMonth(0, undefined, true);

        expect(component['focusedIndex']).toBe(0);
        expect(mockBtn.focus).toHaveBeenCalled();
      });

      it('should not call focus when monthOptions[index] does not exist', () => {
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'updateModel');

        component.selectMonth(5, undefined, true);

        expect(component['focusedIndex']).not.toBe(5);
      });
    });

    describe('selectYear with DOM focus:', () => {
      beforeEach(() => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should set focusedIndex and call focus when yearOptions[index] exists', () => {
        const mockBtn = { focus: vi.fn() } as any;
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([mockBtn]);
        vi.spyOn(component as any, 'updateModel');

        component.selectYear(0, undefined, true, 2025);

        expect(component['focusedIndex']).toBe(0);
        expect(mockBtn.focus).toHaveBeenCalled();
      });

      it('should not call focus when yearOptions[index] does not exist', () => {
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'updateModel');

        component.selectYear(5, undefined, true, 2025);

        expect(component['focusedIndex']).not.toBe(5);
      });
    });

    describe('onKeydownYear ArrowDown at boundary:', () => {
      it('should increment index when not at last position', () => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();

        const mockBtns = new Array(5).fill(null);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockBtns);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'selectYear');

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeydownYear(event, 2);

        expect(component.selectYear).toHaveBeenCalledWith(3, event);
      });

      it('should stay at max index on ArrowDown at last position', () => {
        component.mode = PoCalendarMode.Year;
        component.ngOnInit();
        fixture.detectChanges();

        const mockBtns = new Array(5).fill(null);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue(mockBtns);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'selectYear');

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeydownYear(event, 4);

        expect(component.selectYear).toHaveBeenCalledWith(4, event);
      });
    });

    describe('onKeydownMonth ArrowDown at boundary:', () => {
      it('should increment index when not at last position', () => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();

        const mockBtns = new Array(12).fill(null);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(mockBtns);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'selectMonth');

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeydownMonth(event, 5);

        expect(component.selectMonth).toHaveBeenCalledWith(6, event);
      });

      it('should stay at max index on ArrowDown at last position', () => {
        component.mode = PoCalendarMode.MonthYear;
        component.ngOnInit();
        fixture.detectChanges();

        const mockBtns = new Array(12).fill(null);
        vi.spyOn(component as any, 'getMonthOptions').mockReturnValue(mockBtns);
        vi.spyOn(component as any, 'getYearOptions').mockReturnValue([]);
        vi.spyOn(component as any, 'selectMonth');

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        component.onKeydownMonth(event, 11);

        expect(component.selectMonth).toHaveBeenCalledWith(11, event);
      });
    });

    describe('ngOnInit for month-year mode:', () => {
      it('should initialize displayMonths and displayYears for month-year mode', () => {
        component.mode = PoCalendarMode.MonthYear;

        component.ngOnInit();

        expect(component.displayMonths).toBeDefined();
        expect(component.displayMonths.length).toBe(12);
        expect(component.displayYears).toBeDefined();
        expect(component.displayYears.length).toBe(301);
      });

      it('should initialize displayMonths and displayYears for year mode', () => {
        component.mode = PoCalendarMode.Year;

        component.ngOnInit();

        expect(component.displayMonths).toBeDefined();
        expect(component.displayYears).toBeDefined();
        expect(component.displayYears.length).toBe(301);
      });

      it('should not initialize displayYears for default mode', () => {
        component.mode = undefined;
        component.displayYears = [];

        component.ngOnInit();

        expect(component.displayYears.length).toBe(0);
      });
    });
  });

  describe('Templates:', () => {
    it('should show `po-calendar` if mode is range', () => {
      component.mode = PoCalendarMode.Range;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-calendar')).toBeTruthy();
    });

    it('should show `po-calendar` if mode is not set', () => {
      component.mode = undefined;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-calendar')).toBeTruthy();
    });

    it('should show po-calendar container when mode is range', () => {
      component.mode = PoCalendarMode.Range;

      fixture.detectChanges();

      const calendarDiv = fixture.debugElement.nativeElement.querySelector('.po-calendar');
      expect(calendarDiv).toBeTruthy();
      expect(component.isRange).toBe(true);
      expect(component.isMonthYear).toBe(false);
      expect(component.isYear).toBe(false);
    });
  });
});
