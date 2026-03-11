import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoCalendarPresetListComponent } from './po-calendar-preset-list.component';
import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';
import { PO_CALENDAR_DEFAULT_RANGE_PRESETS } from '../constants/po-calendar-range-presets.constant';

describe('PoCalendarPresetListComponent:', () => {
  let component: PoCalendarPresetListComponent;
  let fixture: ComponentFixture<PoCalendarPresetListComponent>;
  let nativeElement: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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

      const buttons = nativeElement.querySelectorAll('button.po-calendar-preset-item');
      expect(buttons.length).toBe(7);
    });

    it('should apply `po-calendar-preset-item-selected` class when selectedPreset matches', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      component.selectedPreset = 'today';
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('button.po-calendar-preset-item');
      expect(buttons[0].classList.contains('po-calendar-preset-item-selected')).toBeTrue();
      expect(buttons[1].classList.contains('po-calendar-preset-item-selected')).toBeFalse();
    });

    it('should set aria-selected="true" on the selected preset button', () => {
      component.presets = PO_CALENDAR_DEFAULT_RANGE_PRESETS;
      component.locale = 'pt';
      component.selectedPreset = 'yesterday';
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('button.po-calendar-preset-item');
      expect(buttons[1].getAttribute('aria-selected')).toBe('true');
      expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    });

    it('should render no buttons when presets is empty', () => {
      component.presets = [];
      component.locale = 'pt';
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('button.po-calendar-preset-item');
      expect(buttons.length).toBe(0);
    });
  });

  describe('Methods:', () => {
    it('getDisplayLabel: should return translated label for default preset keys in pt', () => {
      component.locale = 'pt';

      expect(component.getDisplayLabel({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })).toBe(
        'Hoje'
      );
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

      expect(component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })).toBeTrue();
    });

    it('isSelected: should return false when selectedPreset does not match preset label', () => {
      component.selectedPreset = 'yesterday';

      expect(component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })).toBeFalse();
    });

    it('isSelected: should return false when selectedPreset is null', () => {
      component.selectedPreset = null;

      expect(component.isSelected({ label: 'today', dateRange: () => ({ start: new Date(), end: new Date() }) })).toBeFalse();
    });
  });
});
