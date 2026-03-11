import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryList, ElementRef } from '@angular/core';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoTimerComponent } from './po-timer.component';
import { PoTimerFormat } from './enums/po-timer-format.enum';

describe('PoTimerComponent:', () => {
  let component: PoTimerComponent;
  let fixture: ComponentFixture<PoTimerComponent>;
  let nativeElement: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoTimerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTimerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoTimerBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('ngOnInit:', () => {
      it('should call generateHours, generateMinutes, and generateSeconds', () => {
        spyOn(component as any, 'generateHours');
        spyOn(component as any, 'generateMinutes');
        spyOn(component as any, 'generateSeconds');

        component.ngOnInit();

        expect(component['generateHours']).toHaveBeenCalled();
        expect(component['generateMinutes']).toHaveBeenCalled();
        expect(component['generateSeconds']).toHaveBeenCalled();
      });
    });

    describe('onSelectHour:', () => {
      it('should set selectedHour and emit change', () => {
        spyOn(component.change, 'emit');
        component.selectedMinute = 30;
        component.onSelectHour(10);
        expect(component.selectedHour).toBe(10);
        expect(component.change.emit).toHaveBeenCalled();
      });

      it('should not set selectedHour when hour is disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        component.selectedHour = null;

        component.onSelectHour(5);

        expect(component.selectedHour).toBeNull();
      });

      it('should emit change with correct time value', () => {
        spyOn(component.change, 'emit');
        component.format = PoTimerFormat.Format24;
        component.selectedMinute = 30;

        component.onSelectHour(14);

        expect(component.change.emit).toHaveBeenCalledWith('14:30');
      });
    });

    describe('onSelectMinute:', () => {
      it('should set selectedMinute and emit change', () => {
        spyOn(component.change, 'emit');
        component.selectedHour = 10;
        component.onSelectMinute(30);
        expect(component.selectedMinute).toBe(30);
        expect(component.change.emit).toHaveBeenCalled();
      });

      it('should not set selectedMinute when minute is disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:30';
        component.selectedHour = 8;
        component.selectedMinute = null;

        component.onSelectMinute(15);

        expect(component.selectedMinute).toBeNull();
      });

      it('should emit change with correct time value', () => {
        spyOn(component.change, 'emit');
        component.format = PoTimerFormat.Format24;
        component.selectedHour = 14;

        component.onSelectMinute(45);

        expect(component.change.emit).toHaveBeenCalledWith('14:45');
      });
    });

    describe('onSelectSecond:', () => {
      it('should set selectedSecond and emit change', () => {
        spyOn(component.change, 'emit');
        component.showSeconds = true;
        component.selectedHour = 10;
        component.selectedMinute = 30;
        component.onSelectSecond(45);
        expect(component.selectedSecond).toBe(45);
        expect(component.change.emit).toHaveBeenCalled();
      });

      it('should not set selectedSecond when second is disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.minTime = '08:30:30';
        component.selectedHour = 8;
        component.selectedMinute = 30;
        component.selectedSecond = null;

        component.onSelectSecond(15);

        expect(component.selectedSecond).toBeNull();
      });

      it('should emit change with correct time value including seconds', () => {
        spyOn(component.change, 'emit');
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.selectedHour = 14;
        component.selectedMinute = 30;

        component.onSelectSecond(45);

        expect(component.change.emit).toHaveBeenCalledWith('14:30:45');
      });
    });

    describe('onSelectPeriod:', () => {
      it('should set period to AM', () => {
        component.onSelectPeriod('AM');
        expect(component.period).toBe('AM');
      });

      it('should set period to PM', () => {
        component.onSelectPeriod('PM');
        expect(component.period).toBe('PM');
      });

      it('should emit change when period is changed', () => {
        spyOn(component.change, 'emit');
        component.format = PoTimerFormat.Format12;
        component.selectedHour = 3;
        component.selectedMinute = 30;

        component.onSelectPeriod('PM');

        expect(component.change.emit).toHaveBeenCalledWith('15:30');
      });
    });

    describe('onCellKeydown:', () => {
      let mockCells: QueryList<ElementRef>;
      let mockElements: Array<ElementRef>;

      beforeEach(() => {
        mockElements = [
          { nativeElement: { focus: jasmine.createSpy('focus0') } },
          { nativeElement: { focus: jasmine.createSpy('focus1') } },
          { nativeElement: { focus: jasmine.createSpy('focus2') } }
        ];

        mockCells = new QueryList<ElementRef>();
        mockCells.reset(mockElements);

        component.hourCells = mockCells;
        component.minuteCells = mockCells;
        component.secondCells = mockCells;
      });

      it('should focus previous cell on ArrowUp', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour', 2);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus next cell on ArrowDown', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour', 0);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('should select cell on Enter', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectHour');
        component.displayHours = [10, 11, 12];

        component.onCellKeydown(event, 'hour', 1);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectHour).toHaveBeenCalledWith(11);
      });

      it('should select cell on Space', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectMinute');
        component.displayMinutes = [0, 5, 10];

        component.onCellKeydown(event, 'minute', 2);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectMinute).toHaveBeenCalledWith(10);
      });

      it('should select second cell on Enter', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectSecond');
        component.displaySeconds = [0, 15, 30];

        component.onCellKeydown(event, 'second', 1);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectSecond).toHaveBeenCalledWith(15);
      });

      it('should not focus cell when index is out of bounds (ArrowUp at 0)', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour', 0);

        expect(mockElements[0].nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should not focus cell when index is out of bounds (ArrowDown at last)', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour', 2);

        expect(mockElements[0].nativeElement.focus).not.toHaveBeenCalled();
        expect(mockElements[1].nativeElement.focus).not.toHaveBeenCalled();
        expect(mockElements[2].nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should do nothing for unhandled key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour', 1);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should handle minute cells for keyboard navigation', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'minute', 0);

        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('should handle second cells for keyboard navigation', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'second', 0);

        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('writeValue:', () => {
      it('should set time from string', () => {
        component.format = PoTimerFormat.Format24;
        component.writeValue('14:30');
        expect(component.selectedHour).toBe(14);
        expect(component.selectedMinute).toBe(30);
      });

      it('should clear selection when null is provided', () => {
        component.selectedHour = 10;
        component.selectedMinute = 30;
        component.writeValue(null);
        expect(component.selectedHour).toBeNull();
        expect(component.selectedMinute).toBeNull();
      });
    });

    describe('emitChange (private):', () => {
      it('should not emit when buildTimeValue returns empty string', () => {
        spyOn(component.change, 'emit');
        component.selectedHour = null;
        component.selectedMinute = null;

        component['emitChange']();

        expect(component.change.emit).not.toHaveBeenCalled();
      });

      it('should emit when buildTimeValue returns valid value', () => {
        spyOn(component.change, 'emit');
        component.format = PoTimerFormat.Format24;
        component.selectedHour = 10;
        component.selectedMinute = 30;

        component['emitChange']();

        expect(component.change.emit).toHaveBeenCalledWith('10:30');
      });
    });

    describe('getCellsList (private):', () => {
      it('should return hourCells for hour type', () => {
        const mockList = new QueryList<ElementRef>();
        component.hourCells = mockList;
        expect(component['getCellsList']('hour')).toBe(mockList);
      });

      it('should return minuteCells for minute type', () => {
        const mockList = new QueryList<ElementRef>();
        component.minuteCells = mockList;
        expect(component['getCellsList']('minute')).toBe(mockList);
      });

      it('should return secondCells for second type', () => {
        const mockList = new QueryList<ElementRef>();
        component.secondCells = mockList;
        expect(component['getCellsList']('second')).toBe(mockList);
      });

      it('should return hourCells for default case', () => {
        const mockList = new QueryList<ElementRef>();
        component.hourCells = mockList;
        expect(component['getCellsList']('unknown' as any)).toBe(mockList);
      });
    });

    describe('navigateInfinityScroll (private):', () => {
      let mockElements: Array<ElementRef>;
      let mockCells: QueryList<ElementRef>;

      beforeEach(() => {
        mockElements = [
          { nativeElement: { focus: jasmine.createSpy('focus0') } },
          { nativeElement: { focus: jasmine.createSpy('focus1') } },
          { nativeElement: { focus: jasmine.createSpy('focus2') } }
        ];

        mockCells = new QueryList<ElementRef>();
        mockCells.reset(mockElements);

        component.hourCells = mockCells;
      });

      it('should focus the next cell when direction is 1', () => {
        component['navigateInfinityScroll']('hour', 0, 1);
        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus the previous cell when direction is -1', () => {
        component['navigateInfinityScroll']('hour', 2, -1);
        expect(mockElements[1].nativeElement.focus).toHaveBeenCalled();
      });

      it('should not focus when resulting index is out of bounds (negative)', () => {
        component['navigateInfinityScroll']('hour', 0, -1);
        mockElements.forEach(el => {
          expect(el.nativeElement.focus).not.toHaveBeenCalled();
        });
      });

      it('should not focus when resulting index is out of bounds (exceeds length)', () => {
        component['navigateInfinityScroll']('hour', 2, 1);
        mockElements.forEach(el => {
          expect(el.nativeElement.focus).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Template:', () => {
    beforeEach(() => {
      component.format = PoTimerFormat.Format24;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render hours column', () => {
      const hoursColumn = nativeElement.querySelector('[role="listbox"]');
      expect(hoursColumn).toBeTruthy();
    });

    it('should render hour cells', () => {
      const hourCells = nativeElement.querySelectorAll('.po-timer-cell');
      expect(hourCells.length).toBeGreaterThan(0);
    });

    it('should render minutes column', () => {
      const columns = nativeElement.querySelectorAll('[role="listbox"]');
      expect(columns.length).toBeGreaterThanOrEqual(2);
    });

    it('should render separator between hours and minutes', () => {
      const separator = nativeElement.querySelector('.po-timer-column-separator');
      expect(separator).toBeTruthy();
      expect(separator.textContent.trim()).toBe(':');
    });

    it('should not render seconds column when showSeconds is false', () => {
      const columns = nativeElement.querySelectorAll('[role="listbox"]');
      expect(columns.length).toBe(2);
    });

    it('should render seconds column when showSeconds is true', () => {
      component.showSeconds = true;
      component.ngOnInit();
      fixture.detectChanges();

      const columns = nativeElement.querySelectorAll('[role="listbox"]');
      expect(columns.length).toBe(3);
    });

    it('should not render AM/PM toggle in 24h format', () => {
      const periodToggle = nativeElement.querySelector('.po-timer-period-toggle');
      expect(periodToggle).toBeFalsy();
    });

    it('should render AM/PM toggle in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      fixture.detectChanges();

      const periodToggle = nativeElement.querySelector('.po-timer-period-toggle');
      expect(periodToggle).toBeTruthy();
    });

    it('should render AM and PM po-buttons in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      fixture.detectChanges();

      const periodButtons = nativeElement.querySelectorAll('.po-timer-period-button');
      expect(periodButtons.length).toBe(2);
    });

    it('should add selected class to selected hour cell', () => {
      component.selectedHour = 10;
      fixture.detectChanges();

      const selectedCell = nativeElement.querySelector('.po-timer-cell-selected');
      expect(selectedCell).toBeTruthy();
      expect(selectedCell.textContent.trim()).toBe('10');
    });

    it('should add disabled class to disabled hour cells', () => {
      component.minTime = '08:00';
      fixture.detectChanges();

      const disabledCells = nativeElement.querySelectorAll('.po-timer-cell-disabled');
      expect(disabledCells.length).toBeGreaterThan(0);
    });

    it('should render scroll containers for infinity scroll', () => {
      const scrollContainers = nativeElement.querySelectorAll('.po-timer-column-scroll');
      expect(scrollContainers.length).toBeGreaterThanOrEqual(2);
    });
  });
});
