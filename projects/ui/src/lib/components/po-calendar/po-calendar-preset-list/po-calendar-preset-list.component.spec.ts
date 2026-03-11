import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoButtonModule } from '../../po-button/po-button.module';
import { PoCalendarPresetListComponent } from './po-calendar-preset-list.component';
import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';
import { PO_CALENDAR_DEFAULT_RANGE_PRESETS } from '../constants/po-calendar-range-presets.constant';

describe('PoCalendarPresetListComponent:', () => {
  let component: PoCalendarPresetListComponent;
  let fixture: ComponentFixture<PoCalendarPresetListComponent>;
  let nativeElement: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoCalendarPresetListComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarPresetListComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should render all presets as buttons', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      fixture.detectChanges();

      const presets = nativeElement.querySelectorAll('.po-calendar-preset-item');
      expect(presets.length).toBe(PO_CALENDAR_DEFAULT_RANGE_PRESETS.length);
    });

    it('should apply `po-calendar-preset-item-selected` class when selectedPreset matches', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      component.selectedPreset = 'tomorrow';
      fixture.detectChanges();

      const presets = nativeElement.querySelectorAll('.po-calendar-preset-item');
      expect(presets[0].classList.contains('po-calendar-preset-item-selected')).toBeTrue();
      expect(presets[1].classList.contains('po-calendar-preset-item-selected')).toBeFalse();
    });

    it('should set aria-selected="true" on the selected preset button', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      component.selectedPreset = 'yesterday';
      fixture.detectChanges();

      const presets = nativeElement.querySelectorAll('.po-calendar-preset-item');
      const yesterdayIndex = PO_CALENDAR_DEFAULT_RANGE_PRESETS.findIndex(p => p.label === 'yesterday');
      expect(presets[yesterdayIndex].getAttribute('aria-selected')).toBe('true');
      expect(presets[0].getAttribute('aria-selected')).toBe('false');
    });

    it('should render no buttons when presets is empty', () => {
      component.presets = [];
      component.locale = 'pt';
      fixture.detectChanges();

      const presets = nativeElement.querySelectorAll('.po-calendar-preset-item');
      expect(presets.length).toBe(0);
    });
  });

  describe('Methods:', () => {
    it('getDisplayLabel: should return translated label for default preset keys in pt', () => {
      component.locale = 'pt';

      expect(
        component.getDisplayLabel({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBe('Hoje');
    });

    it('getDisplayLabel: should return translated label for default preset keys in en', () => {
      component.locale = 'en';

      expect(
        component.getDisplayLabel({ label: 'yesterday', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBe('Yesterday');
    });

    it('getDisplayLabel: should return literal label for custom preset keys', () => {
      component.locale = 'pt';

      expect(
        component.getDisplayLabel({ label: 'Custom Range', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBe('Custom Range');
    });

    it('onPresetClick: should emit p-select-preset with correct start/end dates', () => {
      const mockPreset: PoCalendarRangePreset = {
        label: 'test',
        dateRange: () => ({
          start: new Date(2025, 0, 1),
          end: new Date(2025, 0, 31)
        })
      };

      spyOn(component.selectPreset, 'emit');

      component.onPresetClick(mockPreset);

      expect(component.selectPreset.emit).toHaveBeenCalledWith({
        label: 'test',
        start: new Date(2025, 0, 1),
        end: new Date(2025, 0, 31)
      });
    });

    it('onPresetClick: should call preset.dateRange with a new Date', () => {
      const dateRangeSpy = jasmine.createSpy('dateRange').and.returnValue({
        start: new Date(),
        end: new Date()
      });

      const mockPreset: PoCalendarRangePreset = {
        label: 'test',
        dateRange: dateRangeSpy
      };

      component.onPresetClick(mockPreset);

      expect(dateRangeSpy).toHaveBeenCalledWith(jasmine.any(Date));
    });

    it('isSelected: should return true when selectedPreset matches preset label', () => {
      component.selectedPreset = 'today';

      expect(
        component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBeTrue();
    });

    it('isSelected: should return false when selectedPreset does not match preset label', () => {
      component.selectedPreset = 'yesterday';

      expect(
        component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBeFalse();
    });

    it('isSelected: should return false when selectedPreset is null', () => {
      component.selectedPreset = null;

      expect(
        component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })
      ).toBeFalse();
    });

    it('getTabIndex: should return 0 for focused index and -1 for others', () => {
      component.focusedIndex = 2;

      expect(component.getTabIndex(2)).toBe(0);
      expect(component.getTabIndex(0)).toBe(-1);
      expect(component.getTabIndex(1)).toBe(-1);
    });

    describe('onKeydown:', () => {
      beforeEach(() => {
        component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
        component.locale = 'pt';
        fixture.detectChanges();
      });

      it('should focus next preset on ArrowDown', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');

        component.onKeydown(event, 0);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.focusedIndex).toBe(1);
      });

      it('should not go past last preset on ArrowDown', () => {
        const lastIndex = component.presets.length - 1;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

        component.onKeydown(event, lastIndex);

        expect(component.focusedIndex).toBe(lastIndex);
      });

      it('should focus previous preset on ArrowUp', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        spyOn(event, 'preventDefault');

        component.onKeydown(event, 2);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.focusedIndex).toBe(1);
      });

      it('should not go before first preset on ArrowUp', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onKeydown(event, 0);

        expect(component.focusedIndex).toBe(0);
      });

      it('should emit closeCalendar on Shift+Tab from first preset', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(component.closeCalendar, 'emit');

        component.onKeydown(event, 0);

        expect(component.closeCalendar.emit).toHaveBeenCalled();
      });

      it('should emit closeCalendar on Shift+Tab from any preset', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(component.closeCalendar, 'emit');

        component.onKeydown(event, 2);

        expect(component.closeCalendar.emit).toHaveBeenCalled();
      });

      it('should reset focusedIndex to 0 on Tab without Shift', () => {
        component.focusedIndex = 3;
        const event = new KeyboardEvent('keydown', { key: 'Tab' });

        component.onKeydown(event, 3);

        expect(component.focusedIndex).toBe(0);
      });
    });

    it('focusFirstPreset: should set focusedIndex to 0', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      fixture.detectChanges();

      component.focusedIndex = 3;
      component.focusFirstPreset();

      expect(component.focusedIndex).toBe(0);
    });

    it('focusLastPreset: should set focusedIndex to last index', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      fixture.detectChanges();

      component.focusLastPreset();

      expect(component.focusedIndex).toBe(component.presets.length - 1);
    });
  });
});
