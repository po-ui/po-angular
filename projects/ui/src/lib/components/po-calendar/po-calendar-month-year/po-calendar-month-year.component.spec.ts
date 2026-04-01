import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCalendarMonthYearComponent } from './po-calendar-month-year.component';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

describe('PoCalendarMonthYearComponent:', () => {
  let component: PoCalendarMonthYearComponent;
  let fixture: ComponentFixture<PoCalendarMonthYearComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCalendarMonthYearComponent],
      providers: [PoCalendarLangService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarMonthYearComponent);
    component = fixture.componentInstance;
    spyOn(component['cdr'], 'markForCheck');
    spyOn(component['cdr'], 'detectChanges');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('isMonthYearMode: should return true when mode is monthYear', () => {
      component.mode = 'monthYear';
      expect(component.isMonthYearMode).toBeTruthy();
    });

    it('isMonthYearMode: should return false when mode is year', () => {
      component.mode = 'year';
      expect(component.isMonthYearMode).toBeFalsy();
    });

    it('isYearMode: should return true when mode is year', () => {
      component.mode = 'year';
      expect(component.isYearMode).toBeTruthy();
    });

    it('isYearMode: should return false when mode is monthYear', () => {
      component.mode = 'monthYear';
      expect(component.isYearMode).toBeFalsy();
    });

    it('locale: should call setupMonths when locale is set', () => {
      spyOn(component as any, 'setupMonths');
      component.locale = 'pt';
      expect(component['setupMonths']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    beforeEach(() => {
      component.mode = 'monthYear';
      component.ngOnInit();
    });

    it('ngOnInit: should call setupMonths, setupYears and setInitialFocus', () => {
      spyOn(component as any, 'setupMonths');
      spyOn(component as any, 'setupYears');
      spyOn(component as any, 'setInitialFocus');

      component.ngOnInit();

      expect(component['setupMonths']).toHaveBeenCalled();
      expect(component['setupYears']).toHaveBeenCalled();
      expect(component['setInitialFocus']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call setupMonths when locale changes', () => {
      spyOn(component as any, 'setupMonths');
      component.ngOnChanges({
        locale: new SimpleChange('en', 'pt', false)
      });
      expect(component['setupMonths']).toHaveBeenCalled();
    });

    it('ngOnChanges: should not call setupMonths on first change', () => {
      spyOn(component as any, 'setupMonths');
      component.ngOnChanges({
        locale: new SimpleChange(undefined, 'pt', true)
      });
      expect(component['setupMonths']).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call setupYears when yearRange changes', () => {
      spyOn(component as any, 'setupYears');
      component.ngOnChanges({
        yearRange: new SimpleChange(100, 150, false)
      });
      expect(component['setupYears']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call setupYears when minDate changes', () => {
      spyOn(component as any, 'setupYears');
      component.ngOnChanges({
        minDate: new SimpleChange(null, new Date(), false)
      });
      expect(component['setupYears']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call setupYears when maxDate changes', () => {
      spyOn(component as any, 'setupYears');
      component.ngOnChanges({
        maxDate: new SimpleChange(null, new Date(), false)
      });
      expect(component['setupYears']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call setInitialFocus when selectedMonth changes', () => {
      spyOn(component as any, 'setInitialFocus');
      component.ngOnChanges({
        selectedMonth: new SimpleChange(null, 5, false)
      });
      expect(component['setInitialFocus']).toHaveBeenCalled();
    });

    it('ngOnChanges: should call setInitialFocus when selectedYear changes', () => {
      spyOn(component as any, 'setInitialFocus');
      component.ngOnChanges({
        selectedYear: new SimpleChange(null, 2025, false)
      });
      expect(component['setInitialFocus']).toHaveBeenCalled();
    });

    describe('setupMonths:', () => {
      it('should populate displayMonths with 12 months', () => {
        component.locale = 'pt';
        expect(component.displayMonths.length).toBe(12);
      });

      it('should populate displayMonths with correct month names in Portuguese', () => {
        component.locale = 'pt';
        expect(component.displayMonths[0]).toBe('Janeiro');
        expect(component.displayMonths[11]).toBe('Dezembro');
      });

      it('should populate displayMonths with correct month names in English', () => {
        component.locale = 'en';
        expect(component.displayMonths[0]).toBe('January');
        expect(component.displayMonths[11]).toBe('December');
      });

      it('should populate displayMonths with correct month names in Spanish', () => {
        component.locale = 'es';
        expect(component.displayMonths[0]).toBe('Enero');
        expect(component.displayMonths[11]).toBe('Diciembre');
      });

      it('should capitalize first letter of month names', () => {
        component.locale = 'pt';
        component.displayMonths.forEach(month => {
          expect(month.charAt(0)).toBe(month.charAt(0).toUpperCase());
        });
      });
    });

    describe('setupYears:', () => {
      it('should generate years based on yearRange', () => {
        component.yearRange = 150;
        component['setupYears']();
        const currentYear = new Date().getFullYear();
        expect(component.displayYears).toContain(currentYear);
        expect(component.displayYears[0]).toBe(currentYear - 150);
        expect(component.displayYears[component.displayYears.length - 1]).toBe(currentYear + 150);
      });

      it('should generate total of (yearRange * 2 + 1) years', () => {
        component.yearRange = 10;
        component['setupYears']();
        expect(component.displayYears.length).toBe(21);
      });

      it('should respect minDate when generating years', () => {
        const currentYear = new Date().getFullYear();
        component.minDate = new Date(currentYear - 10, 0, 1);
        component.yearRange = 150;
        component['setupYears']();
        expect(component.displayYears[0]).toBe(currentYear - 10);
      });

      it('should respect maxDate when generating years', () => {
        const currentYear = new Date().getFullYear();
        component.maxDate = new Date(currentYear + 5, 11, 31);
        component.yearRange = 150;
        component['setupYears']();
        expect(component.displayYears[component.displayYears.length - 1]).toBe(currentYear + 5);
      });

      it('should respect both minDate and maxDate', () => {
        component.minDate = new Date(2020, 0, 1);
        component.maxDate = new Date(2030, 11, 31);
        component.yearRange = 150;
        component['setupYears']();
        expect(component.displayYears[0]).toBe(2020);
        expect(component.displayYears[component.displayYears.length - 1]).toBe(2030);
        expect(component.displayYears.length).toBe(11);
      });
    });

    describe('setInitialFocus:', () => {
      it('should set focusedMonthIndex to selectedMonth when valid', () => {
        component.selectedMonth = 5;
        component['setInitialFocus']();
        expect(component.focusedMonthIndex).toBe(5);
      });

      it('should set focusedMonthIndex to 0 when selectedMonth is null', () => {
        component.selectedMonth = null;
        component['setInitialFocus']();
        expect(component.focusedMonthIndex).toBe(0);
      });

      it('should set focusedMonthIndex to 0 when selectedMonth is undefined', () => {
        component.selectedMonth = undefined;
        component['setInitialFocus']();
        expect(component.focusedMonthIndex).toBe(0);
      });

      it('should set focusedYearIndex to index of selectedYear', () => {
        const currentYear = new Date().getFullYear();
        component.selectedYear = currentYear;
        component['setInitialFocus']();
        const expectedIndex = component.displayYears.indexOf(currentYear);
        expect(component.focusedYearIndex).toBe(expectedIndex);
      });

      it('should set focusedYearIndex to current year index when selectedYear is null', () => {
        const currentYear = new Date().getFullYear();
        component.selectedYear = null;
        component['setInitialFocus']();
        const expectedIndex = component.displayYears.indexOf(currentYear);
        expect(component.focusedYearIndex).toBe(expectedIndex);
      });

      it('should set focusedYearIndex to 0 when selectedYear is not in displayYears and currentYear is also not in range', () => {
        component.minDate = new Date(2060, 0, 1);
        component.maxDate = new Date(2065, 11, 31);
        component['setupYears']();
        component.selectedYear = 2000;
        component['setInitialFocus']();
        expect(component.focusedYearIndex).toBe(0);
      });
    });

    describe('onSelectMonth:', () => {
      it('should set selectedMonth and focusedMonthIndex', () => {
        component.onSelectMonth(3);
        expect(component.selectedMonth).toBe(3);
        expect(component.focusedMonthIndex).toBe(3);
      });

      it('should emit selection when both month and year are selected in monthYear mode', () => {
        component.mode = 'monthYear';
        component.selectedYear = 2025;
        spyOn(component.select, 'emit');

        component.onSelectMonth(5);

        expect(component.select.emit).toHaveBeenCalledWith({ month: 5, year: 2025 });
      });

      it('should not emit selection when year is not selected in monthYear mode', () => {
        component.mode = 'monthYear';
        component.selectedYear = null;
        spyOn(component.select, 'emit');

        component.onSelectMonth(5);

        expect(component.select.emit).not.toHaveBeenCalled();
      });

      it('should call markForCheck after selection', () => {
        (component['cdr'].markForCheck as jasmine.Spy).calls.reset();
        component.onSelectMonth(5);
        expect(component['cdr'].markForCheck).toHaveBeenCalled();
      });
    });

    describe('onSelectYear:', () => {
      it('should set selectedYear and focusedYearIndex', () => {
        const currentYear = new Date().getFullYear();
        component.onSelectYear(currentYear);
        expect(component.selectedYear).toBe(currentYear);
        expect(component.focusedYearIndex).toBe(component.displayYears.indexOf(currentYear));
      });

      it('should emit selection in year mode', () => {
        component.mode = 'year';
        spyOn(component.select, 'emit');

        component.onSelectYear(2025);

        expect(component.select.emit).toHaveBeenCalledWith({ year: 2025 });
      });

      it('should emit selection with month and year in monthYear mode when month is selected', () => {
        component.mode = 'monthYear';
        component.selectedMonth = 3;
        spyOn(component.select, 'emit');

        component.onSelectYear(2025);

        expect(component.select.emit).toHaveBeenCalledWith({ month: 3, year: 2025 });
      });

      it('should not emit selection in monthYear mode when month is not selected', () => {
        component.mode = 'monthYear';
        component.selectedMonth = null;
        spyOn(component.select, 'emit');

        component.onSelectYear(2025);

        expect(component.select.emit).not.toHaveBeenCalled();
      });

      it('should call markForCheck after selection', () => {
        (component['cdr'].markForCheck as jasmine.Spy).calls.reset();
        component.onSelectYear(2025);
        expect(component['cdr'].markForCheck).toHaveBeenCalled();
      });
    });

    describe('isMonthSelected:', () => {
      it('should return true when index matches selectedMonth', () => {
        component.selectedMonth = 5;
        expect(component.isMonthSelected(5)).toBeTruthy();
      });

      it('should return false when index does not match selectedMonth', () => {
        component.selectedMonth = 5;
        expect(component.isMonthSelected(3)).toBeFalsy();
      });

      it('should return false when selectedMonth is null', () => {
        component.selectedMonth = null;
        expect(component.isMonthSelected(0)).toBeFalsy();
      });
    });

    describe('isYearSelected:', () => {
      it('should return true when year matches selectedYear', () => {
        component.selectedYear = 2025;
        expect(component.isYearSelected(2025)).toBeTruthy();
      });

      it('should return false when year does not match selectedYear', () => {
        component.selectedYear = 2025;
        expect(component.isYearSelected(2020)).toBeFalsy();
      });

      it('should return false when selectedYear is null', () => {
        component.selectedYear = null;
        expect(component.isYearSelected(2025)).toBeFalsy();
      });
    });

    describe('isMonthDisabled:', () => {
      it('should return false when selectedYear is not set', () => {
        component.selectedYear = null;
        expect(component.isMonthDisabled(0)).toBeFalsy();
      });

      it('should return true when month is before minDate', () => {
        component.selectedYear = 2025;
        component.minDate = new Date(2025, 5, 1);
        expect(component.isMonthDisabled(3)).toBeTruthy();
      });

      it('should return false when month is equal to minDate month', () => {
        component.selectedYear = 2025;
        component.minDate = new Date(2025, 5, 1);
        expect(component.isMonthDisabled(5)).toBeFalsy();
      });

      it('should return true when month is after maxDate', () => {
        component.selectedYear = 2025;
        component.maxDate = new Date(2025, 5, 30);
        expect(component.isMonthDisabled(8)).toBeTruthy();
      });

      it('should return false when month is equal to maxDate month', () => {
        component.selectedYear = 2025;
        component.maxDate = new Date(2025, 5, 30);
        expect(component.isMonthDisabled(5)).toBeFalsy();
      });

      it('should return true when selectedYear is before minDate year', () => {
        component.selectedYear = 2020;
        component.minDate = new Date(2025, 0, 1);
        expect(component.isMonthDisabled(0)).toBeTruthy();
      });

      it('should return true when selectedYear is after maxDate year', () => {
        component.selectedYear = 2030;
        component.maxDate = new Date(2025, 11, 31);
        expect(component.isMonthDisabled(0)).toBeTruthy();
      });

      it('should return false when no min/max constraints', () => {
        component.selectedYear = 2025;
        component.minDate = undefined;
        component.maxDate = undefined;
        expect(component.isMonthDisabled(6)).toBeFalsy();
      });
    });

    describe('isYearDisabled:', () => {
      it('should return true when year is before minDate year', () => {
        component.minDate = new Date(2020, 0, 1);
        expect(component.isYearDisabled(2019)).toBeTruthy();
      });

      it('should return false when year is equal to minDate year', () => {
        component.minDate = new Date(2020, 0, 1);
        expect(component.isYearDisabled(2020)).toBeFalsy();
      });

      it('should return true when year is after maxDate year', () => {
        component.maxDate = new Date(2025, 11, 31);
        expect(component.isYearDisabled(2026)).toBeTruthy();
      });

      it('should return false when year is equal to maxDate year', () => {
        component.maxDate = new Date(2025, 11, 31);
        expect(component.isYearDisabled(2025)).toBeFalsy();
      });

      it('should return false when no min/max constraints', () => {
        component.minDate = undefined;
        component.maxDate = undefined;
        expect(component.isYearDisabled(2025)).toBeFalsy();
      });
    });

    describe('getMonthButtonKind:', () => {
      it('should return secondary when month is selected', () => {
        component.selectedMonth = 3;
        expect(component.getMonthButtonKind(3)).toBe('secondary');
      });

      it('should return tertiary when month is not selected', () => {
        component.selectedMonth = 3;
        expect(component.getMonthButtonKind(5)).toBe('tertiary');
      });
    });

    describe('getYearButtonKind:', () => {
      it('should return secondary when year is selected', () => {
        component.selectedYear = 2025;
        expect(component.getYearButtonKind(2025)).toBe('secondary');
      });

      it('should return tertiary when year is not selected', () => {
        component.selectedYear = 2025;
        expect(component.getYearButtonKind(2020)).toBe('tertiary');
      });
    });

    describe('getMonthTabIndex:', () => {
      it('should return 0 for focused month index', () => {
        component.focusedMonthIndex = 3;
        expect(component.getMonthTabIndex(3)).toBe(0);
      });

      it('should return -1 for non-focused month index', () => {
        component.focusedMonthIndex = 3;
        expect(component.getMonthTabIndex(5)).toBe(-1);
      });
    });

    describe('getYearTabIndex:', () => {
      it('should return 0 for focused year index', () => {
        component.focusedYearIndex = 5;
        expect(component.getYearTabIndex(5)).toBe(0);
      });

      it('should return -1 for non-focused year index', () => {
        component.focusedYearIndex = 5;
        expect(component.getYearTabIndex(3)).toBe(-1);
      });
    });

    describe('Keyboard Navigation:', () => {
      describe('onMonthKeydown:', () => {
        it('should navigate down with ArrowDown', () => {
          spyOn(component as any, 'navigateMonth');
          const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

          component.onMonthKeydown(event, 3);

          expect(component['navigateMonth']).toHaveBeenCalledWith(3, 1);
        });

        it('should navigate up with ArrowUp', () => {
          spyOn(component as any, 'navigateMonth');
          const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

          component.onMonthKeydown(event, 3);

          expect(component['navigateMonth']).toHaveBeenCalledWith(3, -1);
        });

        it('should select month on Enter', () => {
          spyOn(component, 'onSelectMonth');
          const event = new KeyboardEvent('keydown', { key: 'Enter' });

          component.onMonthKeydown(event, 3);

          expect(component.onSelectMonth).toHaveBeenCalledWith(3);
        });

        it('should select month on Space', () => {
          spyOn(component, 'onSelectMonth');
          const event = new KeyboardEvent('keydown', { key: ' ' });

          component.onMonthKeydown(event, 3);

          expect(component.onSelectMonth).toHaveBeenCalledWith(3);
        });

        it('should not select disabled month on Enter', () => {
          spyOn(component, 'isMonthDisabled').and.returnValue(true);
          spyOn(component, 'onSelectMonth');
          const event = new KeyboardEvent('keydown', { key: 'Enter' });

          component.onMonthKeydown(event, 3);

          expect(component.onSelectMonth).not.toHaveBeenCalled();
        });

        it('should not select disabled month on Space', () => {
          spyOn(component, 'isMonthDisabled').and.returnValue(true);
          spyOn(component, 'onSelectMonth');
          const event = new KeyboardEvent('keydown', { key: ' ' });

          component.onMonthKeydown(event, 3);

          expect(component.onSelectMonth).not.toHaveBeenCalled();
        });

        it('should emit close on Shift+Tab', () => {
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

          component.onMonthKeydown(event, 0);

          expect(component.close.emit).toHaveBeenCalled();
        });

        it('should not emit close on Tab without shift', () => {
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });

          component.onMonthKeydown(event, 0);

          expect(component.close.emit).not.toHaveBeenCalled();
        });
      });

      describe('onYearKeydown:', () => {
        it('should navigate down with ArrowDown', () => {
          spyOn(component as any, 'navigateYear');
          const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

          component.onYearKeydown(event, 5);

          expect(component['navigateYear']).toHaveBeenCalledWith(5, 1);
        });

        it('should navigate up with ArrowUp', () => {
          spyOn(component as any, 'navigateYear');
          const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

          component.onYearKeydown(event, 5);

          expect(component['navigateYear']).toHaveBeenCalledWith(5, -1);
        });

        it('should select year on Enter', () => {
          const currentYear = new Date().getFullYear();
          const yearIndex = component.displayYears.indexOf(currentYear);
          spyOn(component, 'onSelectYear');
          const event = new KeyboardEvent('keydown', { key: 'Enter' });

          component.onYearKeydown(event, yearIndex);

          expect(component.onSelectYear).toHaveBeenCalledWith(currentYear);
        });

        it('should select year on Space', () => {
          const currentYear = new Date().getFullYear();
          const yearIndex = component.displayYears.indexOf(currentYear);
          spyOn(component, 'onSelectYear');
          const event = new KeyboardEvent('keydown', { key: ' ' });

          component.onYearKeydown(event, yearIndex);

          expect(component.onSelectYear).toHaveBeenCalledWith(currentYear);
        });

        it('should not select disabled year on Enter', () => {
          spyOn(component, 'isYearDisabled').and.returnValue(true);
          spyOn(component, 'onSelectYear');
          const event = new KeyboardEvent('keydown', { key: 'Enter' });

          component.onYearKeydown(event, 5);

          expect(component.onSelectYear).not.toHaveBeenCalled();
        });

        it('should emit close on Tab without shift in year-only mode', () => {
          component.mode = 'year';
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });

          component.onYearKeydown(event, 5);

          expect(component.close.emit).toHaveBeenCalled();
        });

        it('should emit close on Shift+Tab in year-only mode', () => {
          component.mode = 'year';
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

          component.onYearKeydown(event, 5);

          expect(component.close.emit).toHaveBeenCalled();
        });

        it('should not emit close on Tab in monthYear mode', () => {
          component.mode = 'monthYear';
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });

          component.onYearKeydown(event, 5);

          expect(component.close.emit).not.toHaveBeenCalled();
        });

        it('should not emit close on Shift+Tab in monthYear mode', () => {
          component.mode = 'monthYear';
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

          component.onYearKeydown(event, 5);

          expect(component.close.emit).not.toHaveBeenCalled();
        });
      });

      describe('onYearListKeydown:', () => {
        it('should emit close on Tab without shift', () => {
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });

          component.onYearListKeydown(event);

          expect(component.close.emit).toHaveBeenCalled();
        });

        it('should not emit close on Shift+Tab', () => {
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

          component.onYearListKeydown(event);

          expect(component.close.emit).not.toHaveBeenCalled();
        });

        it('should not emit close on non-Tab keys', () => {
          spyOn(component.close, 'emit');
          const event = new KeyboardEvent('keydown', { key: 'Enter' });

          component.onYearListKeydown(event);

          expect(component.close.emit).not.toHaveBeenCalled();
        });
      });
    });

    describe('navigateMonth:', () => {
      beforeEach(() => {
        spyOn(component as any, 'focusMonthButton');
      });

      it('should update focusedMonthIndex when navigating down', () => {
        component.focusedMonthIndex = 0;
        component['navigateMonth'](0, 1);
        expect(component.focusedMonthIndex).toBe(1);
      });

      it('should update focusedMonthIndex when navigating up', () => {
        component.focusedMonthIndex = 5;
        component['navigateMonth'](5, -1);
        expect(component.focusedMonthIndex).toBe(4);
      });

      it('should not navigate below 0', () => {
        component.focusedMonthIndex = 0;
        component['navigateMonth'](0, -1);
        expect(component.focusedMonthIndex).toBe(0);
      });

      it('should not navigate beyond 11', () => {
        component.focusedMonthIndex = 11;
        component['navigateMonth'](11, 1);
        expect(component.focusedMonthIndex).toBe(11);
      });

      it('should skip disabled months when navigating', () => {
        component.selectedYear = 2025;
        component.minDate = new Date(2025, 2, 1);
        component.focusedMonthIndex = 3;
        component['navigateMonth'](3, -1);
        expect(component.focusedMonthIndex).toBe(2);
      });

      it('should call focusMonthButton with new index', () => {
        component['navigateMonth'](0, 1);
        expect(component['focusMonthButton']).toHaveBeenCalledWith(1);
      });
    });

    describe('navigateYear:', () => {
      beforeEach(() => {
        spyOn(component as any, 'focusYearButton');
      });

      it('should update focusedYearIndex when navigating down', () => {
        component.focusedYearIndex = 5;
        component['navigateYear'](5, 1);
        expect(component.focusedYearIndex).toBe(6);
      });

      it('should update focusedYearIndex when navigating up', () => {
        component.focusedYearIndex = 5;
        component['navigateYear'](5, -1);
        expect(component.focusedYearIndex).toBe(4);
      });

      it('should not navigate beyond array bounds (end)', () => {
        const lastIndex = component.displayYears.length - 1;
        component.focusedYearIndex = lastIndex;
        component['navigateYear'](lastIndex, 1);
        expect(component.focusedYearIndex).toBe(lastIndex);
      });

      it('should not navigate below 0', () => {
        component.focusedYearIndex = 0;
        component['navigateYear'](0, -1);
        expect(component.focusedYearIndex).toBe(0);
      });

      it('should call focusYearButton with new index', () => {
        component['navigateYear'](5, 1);
        expect(component['focusYearButton']).toHaveBeenCalledWith(6);
      });

      it('should skip disabled years when navigating', () => {
        component.minDate = new Date(2020, 0, 1);
        component['setupYears']();
        const minIndex = component.displayYears.indexOf(2020);
        component.focusedYearIndex = minIndex + 1;
        component['navigateYear'](minIndex + 1, -1);
        expect(component.focusedYearIndex).toBe(minIndex);
      });
    });

    describe('trackByMonth:', () => {
      it('should return index', () => {
        expect(component.trackByMonth(5)).toBe(5);
      });
    });

    describe('trackByYear:', () => {
      it('should return year', () => {
        expect(component.trackByYear(0, 2025)).toBe(2025);
      });
    });

    describe('focusFirstMonth:', () => {
      it('should call focusMonthButton with focusedMonthIndex', fakeAsync(() => {
        spyOn(component as any, 'focusMonthButton');
        component.focusedMonthIndex = 3;
        component.focusFirstMonth();
        tick(100);
        expect(component['focusMonthButton']).toHaveBeenCalledWith(3);
      }));
    });

    describe('focusFirstYear:', () => {
      it('should call focusYearButton with focusedYearIndex', fakeAsync(() => {
        spyOn(component as any, 'focusYearButton');
        component.focusedYearIndex = 5;
        component.focusFirstYear();
        tick(100);
        expect(component['focusYearButton']).toHaveBeenCalledWith(5);
      }));
    });

    describe('scrollToSelectedYear:', () => {
      it('should call scrollIntoView on selected element', fakeAsync(() => {
        const mockSelectedEl = { scrollIntoView: jasmine.createSpy('scrollIntoView') };
        const mockContainer = {
          querySelector: jasmine.createSpy('querySelector').and.callFake((selector: string) => {
            if (selector === '.po-calendar-month-year-year-item--selected') {
              return mockSelectedEl;
            }
            return null;
          }),
          querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([])
        };
        spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue(mockContainer);

        component.scrollToSelectedYear();
        tick(200);

        expect(mockSelectedEl.scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' });
      }));
    });
  });
});
