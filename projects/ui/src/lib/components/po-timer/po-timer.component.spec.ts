import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoButtonModule } from '../po-button/po-button.module';
import { configureTestSuite } from './../../util-test/util-expect.spec';

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

      it('should normalize invalid selected minute when selecting hour and emit valid value', () => {
        spyOn(component.change, 'emit');

        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:12';
        component.maxTime = '08:55';
        component.ngOnInit();
        component.selectedMinute = 5;

        component.onSelectHour(8);

        expect(component.selectedMinute).toBe(12);
        expect(component.change.emit).toHaveBeenCalledWith('08:12');
        expect(component.change.emit).not.toHaveBeenCalledWith('08:05');
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

      it('should disable minutes before selecting hour when no valid hour/minute combination exists', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:12';
        component.maxTime = '08:55';
        component.ngOnInit();

        expect(component['isMinuteDisabled'](5)).toBe(true);
        expect(component['isMinuteDisabled'](12)).toBe(false);
        expect(component['isMinuteDisabled'](55)).toBe(false);
        expect(component['isMinuteDisabled'](56)).toBe(true);
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

    describe('onPeriodKeydown:', () => {
      it('should toggle from AM to PM on ArrowDown', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectPeriod');

        component.onPeriodKeydown(event, 'AM');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectPeriod).toHaveBeenCalledWith('PM');
      });

      it('should toggle from PM to AM on ArrowUp', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectPeriod');

        component.onPeriodKeydown(event, 'PM');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectPeriod).toHaveBeenCalledWith('AM');
      });

      it('should select current period on Enter', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectPeriod');

        component.onPeriodKeydown(event, 'AM');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectPeriod).toHaveBeenCalledWith('AM');
      });

      it('should do nothing for unhandled key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');

        component.onPeriodKeydown(event, 'AM');

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('roving tabindex:', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should return tabindex 0 for focused display index', () => {
        component['focusedDisplayIndex'].hour = 3;

        expect(component.getCellTabIndex('hour', 3)).toBe(0);
        expect(component.getCellTabIndex('hour', 2)).toBe(-1);
      });

      it('should emit backward boundary tab on Shift+Tab from first visible column', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(component.boundaryTab, 'emit');

        component.onCellKeydown(event, 'hour');

        expect(component.boundaryTab.emit).toHaveBeenCalledWith({
          direction: 'backward',
          event,
          column: 'hour'
        });
      });

      it('should emit forward boundary tab on Tab from last visible column in 24h mode', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component.boundaryTab, 'emit');

        component.onCellKeydown(event, 'minute');

        expect(component.boundaryTab.emit).toHaveBeenCalledWith({
          direction: 'forward',
          event,
          column: 'minute'
        });
      });
    });

    describe('ngAfterViewChecked:', () => {
      it('should realign columns when rendered size changes', () => {
        spyOn(component as any, 'realignColumnsToSelection');

        component['hasViewInitialized'] = true;
        component['currentRenderedSize'] = 'medium';
        component.size = 'small';

        component.ngAfterViewChecked();

        expect(component['realignColumnsToSelection']).toHaveBeenCalled();
      });

      it('should not realign when rendered size is unchanged', () => {
        spyOn(component as any, 'realignColumnsToSelection');

        component['hasViewInitialized'] = true;
        component.size = 'medium';
        component['currentRenderedSize'] = component.size;

        component.ngAfterViewChecked();

        expect(component['realignColumnsToSelection']).not.toHaveBeenCalled();
      });
    });

    describe('initColumnOffset with min/max:', () => {
      it('should initialize hour and minute columns at first available values', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:12';
        component.maxTime = '08:55';
        component.ngOnInit();

        const mockItemsEl = { style: { transform: '' }, scrollHeight: 0 } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(1);

        component['initColumnOffset']('hour');
        component['initColumnOffset']('minute');

        expect(component['columnOffsets'].hour).toBe(32);
        expect(component['columnOffsets'].minute).toBe(72);
      });

      it('should initialize second column at first available second when constrained', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '08:12:34';
        component.maxTime = '08:12:55';
        component.ngOnInit();

        const mockItemsEl = { style: { transform: '' }, scrollHeight: 0 } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(1);

        component['initColumnOffset']('second');

        expect(component['columnOffsets'].second).toBe(94);
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

    it('should render hour cells as po-button', () => {
      const hourCells = nativeElement.querySelectorAll('po-button.po-timer-display');
      expect(hourCells.length).toBeGreaterThan(0);
    });

    it('should render minutes column', () => {
      const columns = nativeElement.querySelectorAll('[role="listbox"]');
      expect(columns.length).toBeGreaterThanOrEqual(2);
    });

    it('should not render separator between columns', () => {
      const separator = nativeElement.querySelector('.po-timer-column-separator');
      expect(separator).toBeFalsy();
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

    it('should not render AM/PM column in 24h format', () => {
      const periodColumn = nativeElement.querySelector('.po-timer-column-period');
      expect(periodColumn).toBeFalsy();
    });

    it('should render AM/PM column in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      fixture.detectChanges();

      const periodColumn = nativeElement.querySelector('.po-timer-column-period');
      expect(periodColumn).toBeTruthy();
    });

    it('should render AM and PM cells in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      fixture.detectChanges();

      const periodColumn = nativeElement.querySelector('.po-timer-column-period');
      const periodCells = periodColumn.querySelectorAll('po-button.po-timer-display');
      expect(periodCells.length).toBe(2);
      expect(periodCells[0].textContent.trim()).toBe('AM');
      expect(periodCells[1].textContent.trim()).toBe('PM');
    });

    it('should mark selected period cell with selected class', () => {
      component.format = PoTimerFormat.Format12;
      component.period = 'PM';
      fixture.detectChanges();

      const periodColumn = nativeElement.querySelector('.po-timer-column-period');
      const pmCell = periodColumn.querySelectorAll('po-button.po-timer-display')[1];
      expect(pmCell.classList.contains('po-timer-display-selected')).toBe(true);
    });

    it('should add selected class to selected hour cell', () => {
      component.selectedHour = 10;
      fixture.detectChanges();

      const selectedCell = nativeElement.querySelector('.po-timer-display-selected');
      expect(selectedCell).toBeTruthy();
      expect(selectedCell.textContent.trim()).toBe('10');
    });

    it('should add disabled attribute to disabled hour cells', () => {
      component.minTime = '08:00';
      fixture.detectChanges();

      const disabledCells = nativeElement.querySelectorAll('po-button.po-timer-display .po-button:disabled');
      expect(disabledCells.length).toBeGreaterThan(0);
    });

    it('should render scroll containers for infinity scroll', () => {
      const scrollContainers = nativeElement.querySelectorAll('.po-timer-column-scroll');
      expect(scrollContainers.length).toBeGreaterThanOrEqual(2);
    });
  });
});
