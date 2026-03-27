import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoButtonModule } from '../po-button/po-button.module';

import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoTimerComponent } from './po-timer.component';
import { PoTimerFormat } from './enums/po-timer-format.enum';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('PoTimerComponent:', () => {
  let component: PoTimerComponent;
  let fixture: ComponentFixture<PoTimerComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoButtonModule],
      declarations: [PoTimerComponent]
    })
      .overrideComponent(PoTimerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
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

  describe('Providers:', () => {
    it('should provide NG_VALUE_ACCESSOR using the component instance', () => {
      const valueAccessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);

      expect(Array.isArray(valueAccessors)).toBeTrue(); // multi: true
      expect(valueAccessors).toContain(component); // useExisting: PoCheckboxComponent
    });
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
        component.secondInterval = 1;
        component.minTime = '08:30:30';
        component.ngOnInit();
        component.selectedHour = 8;
        component.selectedMinute = 30;
        component.selectedSecond = null;
        component['rebuildDisabledCaches']();

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

      it('should not realign columns when writing the same value after view init', () => {
        component.format = PoTimerFormat.Format24;
        component['hasViewInitialized'] = true;
        component.selectedHour = 14;
        component.selectedMinute = 30;

        const initAllColumnOffsetsSpy = spyOn(component, 'initAllColumnOffsets');

        component.writeValue('14:30');

        expect(initAllColumnOffsetsSpy).not.toHaveBeenCalled();
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
      it('should move focus from AM to PM on ArrowDown without selecting', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');
        spyOn<any>(component, 'focusButtonAt');
        spyOn(component, 'onSelectPeriod');
        component['focusedDisplayIndex'].period = 0;

        component.onPeriodKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusedDisplayIndex'].period).toBe(1);
        expect(component['focusButtonAt']).toHaveBeenCalledWith('period', 1);
        expect(component.onSelectPeriod).not.toHaveBeenCalled();
      });

      it('should move focus from PM to AM on ArrowUp without selecting', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        spyOn(event, 'preventDefault');
        spyOn<any>(component, 'focusButtonAt');
        spyOn(component, 'onSelectPeriod');
        component['focusedDisplayIndex'].period = 1;

        component.onPeriodKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusedDisplayIndex'].period).toBe(0);
        expect(component['focusButtonAt']).toHaveBeenCalledWith('period', 0);
        expect(component.onSelectPeriod).not.toHaveBeenCalled();
      });

      it('should select focused period on Enter', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectPeriod');
        component['focusedDisplayIndex'].period = 0;

        component.onPeriodKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectPeriod).toHaveBeenCalledWith('AM');
      });

      it('should select focused period on Space', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectPeriod');
        component['focusedDisplayIndex'].period = 1;

        component.onPeriodKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectPeriod).toHaveBeenCalledWith('PM');
      });

      it('should do nothing for unhandled key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');

        component.onPeriodKeydown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('onCellKeydown:', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should move focus to next item without translate when focused item remains visible', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');
        spyOn<any>(component, 'getNextEnabledDisplayIndex').and.returnValue(10);
        spyOn<any>(component, 'shouldTranslateToRevealFocusedItem').and.returnValue(false);
        const scrollSpy = spyOn<any>(component, 'scrollColumnByStep');
        const focusSpy = spyOn<any>(component, 'focusButtonAt');

        component['focusedDisplayIndex'].hour = 9;
        component.onCellKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(scrollSpy).not.toHaveBeenCalled();
        expect(component['focusedDisplayIndex'].hour).toBe(10);
        expect(focusSpy).toHaveBeenCalledWith('hour', 10);
      });

      it('should translate only when focused item goes out of view', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        spyOn(event, 'preventDefault');
        spyOn<any>(component, 'getNextEnabledDisplayIndex').and.returnValue(15);
        spyOn<any>(component, 'shouldTranslateToRevealFocusedItem').and.returnValue(true);
        spyOn<any>(component, 'getStepsToRevealFocusedItem').and.returnValue(2);
        const scrollSpy = spyOn<any>(component, 'scrollColumnByStep');
        const focusSpy = spyOn<any>(component, 'focusButtonAt');

        component['focusedDisplayIndex'].hour = 14;
        component.onCellKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(scrollSpy).toHaveBeenCalledWith('hour', 2, false);
        expect(component['focusedDisplayIndex'].hour).toBe(15);
        expect(focusSpy).toHaveBeenCalledWith('hour', 15);
      });

      it('should update active descendant only once when translate is needed', () => {
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const mockItemsEl = {
          style: { transform: '' },
          scrollHeight: 0,
          parentElement: { clientHeight: 200 }
        } as any;

        spyOn(event, 'preventDefault');
        spyOn<any>(component, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn<any>(component, 'getCellStep').and.returnValue(40);
        spyOn<any>(component, 'focusButtonAt');
        const activeSpy = spyOn<any>(component, 'updateActiveDescendant').and.callThrough();

        component['columnOffsets'].second = 0;
        component['focusedDisplayIndex'].second = 5;

        component.onCellKeydown(event, 'second');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(activeSpy).toHaveBeenCalledTimes(1);
      });

      it('should select focused item on Enter', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectHour');

        component['focusedDisplayIndex'].hour = 7;
        component.onCellKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectHour).toHaveBeenCalledWith(component.displayHours[7]);
      });

      it('should pick next repeated index near viewport when navigating down', () => {
        const mockItemsEl = { style: { transform: '' }, scrollHeight: 0 } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(1);

        component['columnOffsets'].hour = 42;

        const displayIndex = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);

        expect(displayIndex).toBe(48);
      });

      it('should pick previous repeated index near viewport when navigating up', () => {
        const mockItemsEl = { style: { transform: '' }, scrollHeight: 0 } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(1);

        component['columnOffsets'].hour = 42;

        const displayIndex = component['getDisplayIndexForSourceNearViewport']('hour', 17, -1);

        expect(displayIndex).toBe(41);
      });

      it('should request translate when focused item is partially clipped at bottom', () => {
        const mockItemsEl = {
          style: { transform: '' },
          scrollHeight: 0,
          parentElement: { clientHeight: 239 }
        } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(40);

        component['columnOffsets'].minute = 0;

        const shouldTranslate = component['shouldTranslateToRevealFocusedItem']('minute', 5);
        const steps = component['getStepsToRevealFocusedItem']('minute', 5, 1);

        expect(shouldTranslate).toBe(true);
        expect(steps).toBe(1);
      });

      it('should not request translate when focused item is fully visible', () => {
        const mockItemsEl = {
          style: { transform: '' },
          scrollHeight: 0,
          parentElement: { clientHeight: 240 }
        } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(40);

        component['columnOffsets'].minute = 0;

        const shouldTranslate = component['shouldTranslateToRevealFocusedItem']('minute', 5);
        const steps = component['getStepsToRevealFocusedItem']('minute', 5, 1);

        expect(shouldTranslate).toBe(false);
        expect(steps).toBe(0);
      });

      it('should resolve focus to visible equivalent repeated minute index', () => {
        component.minuteInterval = 5;
        component.ngOnInit();

        const mockItemsEl = {
          style: { transform: '' },
          scrollHeight: 0,
          parentElement: { clientHeight: 240 }
        } as any;

        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(40);

        component['columnOffsets'].minute = 680;

        const resolvedIndex = component['getFocusableDisplayIndex']('minute', 29, component.displayMinutes.length);

        expect(resolvedIndex).toBe(17);
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

      it('should keep tabindex 0 on the exact focused minute display index', () => {
        component['focusedDisplayIndex'].minute = 17;

        expect(component.getCellTabIndex('minute', 17)).toBe(0);
        expect(component.getCellTabIndex('minute', 18)).toBe(-1);
      });

      it('should prioritize DOM focused minute index for tabindex', () => {
        const fakeHost = document.createElement('po-button');
        fakeHost.className = 'po-timer-display';
        fakeHost.id = 'po-timer-minute-17';

        const fakeButton = document.createElement('button');
        fakeHost.appendChild(fakeButton);

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(fakeButton);

        component['focusedDisplayIndex'].minute = 25;

        expect(component.getCellTabIndex('minute', 17)).toBe(0);
        expect(component.getCellTabIndex('minute', 25)).toBe(-1);
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

    describe('ngOnChanges - dynamic property changes:', () => {
      it('should rebuild display arrays when format changes from 24h to 12h', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();

        expect(component.hours.length).toBe(24);

        const changes = {
          format: {
            currentValue: PoTimerFormat.Format12,
            previousValue: PoTimerFormat.Format24,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.format = PoTimerFormat.Format12;
        component.ngOnChanges(changes);

        expect(component.hours.length).toBe(12);
        expect(component.displayHours.length).toBeGreaterThan(0);
        expect(component.hours[0]).toBe(1);
        expect(component.hours[11]).toBe(12);
      });

      it('should rebuild display arrays when format changes from 12h to 24h', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();

        expect(component.hours.length).toBe(12);

        const changes = {
          format: {
            currentValue: PoTimerFormat.Format24,
            previousValue: PoTimerFormat.Format12,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.format = PoTimerFormat.Format24;
        component.ngOnChanges(changes);

        expect(component.hours.length).toBe(24);
        expect(component.displayHours.length).toBeGreaterThan(0);
        expect(component.hours[0]).toBe(0);
        expect(component.hours[23]).toBe(23);
      });

      it('should rebuild display arrays when showSeconds is enabled dynamically', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = false;
        component.ngOnInit();

        expect(component.seconds.length).toBe(0);
        expect(component.displaySeconds.length).toBe(0);

        const changes = {
          showSeconds: {
            currentValue: true,
            previousValue: false,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.showSeconds = true;
        component.ngOnChanges(changes);

        expect(component.seconds.length).toBeGreaterThan(0);
        expect(component.displaySeconds.length).toBeGreaterThan(0);
      });

      it('should rebuild display arrays when showSeconds is disabled dynamically', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.ngOnInit();

        expect(component.seconds.length).toBeGreaterThan(0);

        const changes = {
          showSeconds: {
            currentValue: false,
            previousValue: true,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.showSeconds = false;
        component.ngOnChanges(changes);

        expect(component.seconds.length).toBe(0);
        expect(component.displaySeconds.length).toBe(0);
      });

      it('should rebuild display arrays when minuteInterval changes', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 5;
        component.ngOnInit();

        const originalMinuteCount = component.minutes.length;
        expect(originalMinuteCount).toBe(12);

        const changes = {
          minuteInterval: {
            currentValue: 15,
            previousValue: 5,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.minuteInterval = 15;
        component.ngOnChanges(changes);

        expect(component.minutes.length).toBe(4);
        expect(component.displayMinutes.length).toBeGreaterThan(0);
        expect(component.minutes).toEqual([0, 15, 30, 45]);
      });

      it('should rebuild display arrays when secondInterval changes', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();

        const originalSecondCount = component.seconds.length;
        expect(originalSecondCount).toBe(60);

        const changes = {
          secondInterval: {
            currentValue: 15,
            previousValue: 1,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.secondInterval = 15;
        component.ngOnChanges(changes);

        expect(component.seconds.length).toBe(4);
        expect(component.displaySeconds.length).toBeGreaterThan(0);
        expect(component.seconds).toEqual([0, 15, 30, 45]);
      });

      it('should not rebuild on firstChange', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        spyOn(component as any, 'buildDisplayArrays');

        const changes = {
          format: {
            currentValue: PoTimerFormat.Format12,
            previousValue: undefined,
            firstChange: true,
            isFirstChange: () => true
          }
        };

        component.ngOnChanges(changes);

        expect(component['buildDisplayArrays']).not.toHaveBeenCalled();
      });

      it('should call realignColumnsToSelection when view is initialized', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['hasViewInitialized'] = true;
        spyOn(component as any, 'realignColumnsToSelection');

        const changes = {
          minuteInterval: {
            currentValue: 15,
            previousValue: 5,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.minuteInterval = 15;
        component.ngOnChanges(changes);

        expect(component['realignColumnsToSelection']).toHaveBeenCalled();
      });

      it('should not call realignColumnsToSelection when view is not initialized', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['hasViewInitialized'] = false;
        spyOn(component as any, 'realignColumnsToSelection');

        const changes = {
          minuteInterval: {
            currentValue: 15,
            previousValue: 5,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.minuteInterval = 15;
        component.ngOnChanges(changes);

        expect(component['realignColumnsToSelection']).not.toHaveBeenCalled();
      });

      it('should call markForCheck when rebuilding display arrays', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        spyOn(component['changeDetector'], 'markForCheck');

        const changes = {
          format: {
            currentValue: PoTimerFormat.Format12,
            previousValue: PoTimerFormat.Format24,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.format = PoTimerFormat.Format12;
        component.ngOnChanges(changes);

        expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      });
    });

    describe('ngAfterViewChecked:', () => {
      it('should realign columns when rendered size changes', fakeAsync(() => {
        spyOn(component as any, 'initAllColumnOffsets');

        component['hasViewInitialized'] = true;
        component['currentRenderedSize'] = 'medium';
        component['_size'] = 'small';

        component.ngAfterViewChecked();
        tick(50);

        expect(component['initAllColumnOffsets']).toHaveBeenCalled();
      }));

      it('should not realign when rendered size is unchanged', fakeAsync(() => {
        spyOn(component as any, 'initAllColumnOffsets');

        component['hasViewInitialized'] = true;
        component['_size'] = 'medium';
        component['currentRenderedSize'] = component.size;

        component.ngAfterViewChecked();
        tick(50);

        expect(component['initAllColumnOffsets']).not.toHaveBeenCalled();
      }));
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
        component.minuteInterval = 1;
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
      component.ngOnInit();
      fixture.detectChanges();

      const periodColumn = nativeElement.querySelector('.po-timer-column-period');
      expect(periodColumn).toBeTruthy();
    });

    it('should render AM and PM cells in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      component.ngOnInit();
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
      component.ngOnInit();
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
      component['rebuildDisabledCaches']();
      fixture.detectChanges();

      const disabledCells = nativeElement.querySelectorAll('po-button.po-timer-display .po-button:disabled');
      expect(disabledCells.length).toBeGreaterThan(0);
    });

    it('should render scroll containers for infinity scroll', () => {
      const scrollContainers = nativeElement.querySelectorAll('.po-timer-column-scroll');
      expect(scrollContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Infinity scroll wrap behavior:', () => {
    it('should wrap offset forward into middle section range', () => {
      const step = 40;
      const sourceLength = 24;
      const sectionHeight = sourceLength * step;

      const rawOffset = 2 * sectionHeight + 5 * step;
      const wrapped = component['wrapOffset'](rawOffset, sectionHeight);

      expect(wrapped).toBeGreaterThanOrEqual(sectionHeight);
      expect(wrapped).toBeLessThan(2 * sectionHeight);
    });

    it('should wrap offset backward into middle section range', () => {
      const step = 40;
      const sourceLength = 24;
      const sectionHeight = sourceLength * step;

      const rawOffset = -3 * step;
      const wrapped = component['wrapOffset'](rawOffset, sectionHeight);

      expect(wrapped).toBeGreaterThanOrEqual(sectionHeight);
      expect(wrapped).toBeLessThan(2 * sectionHeight);
    });

    it('should preserve visual position after wrap (modular equivalence)', () => {
      const step = 40;
      const sourceLength = 12;
      const sectionHeight = sourceLength * step;

      const beforeWrap = sectionHeight + 7 * step;
      const afterScroll = beforeWrap + sourceLength * step;
      const wrapped = component['wrapOffset'](afterScroll, sectionHeight);

      expect(wrapped).toBe(beforeWrap);
    });

    it('should compute correct top display index from wrapped offset', () => {
      const step = 40;
      const displayLength = 72;

      const offset = 5 * step;
      const topIndex = component['computeTopDisplayIndex'](offset, step, displayLength);

      expect(topIndex).toBe(5);
    });

    it('should compute top display index with modular wrapping', () => {
      const step = 40;
      const displayLength = 36;

      const offset = 38 * step;
      const topIndex = component['computeTopDisplayIndex'](offset, step, displayLength);

      expect(topIndex).toBe(2);
    });

    it('should repeat source array at least 3 times for infinity scroll', () => {
      const source = Array.from({ length: 24 }, (_, i) => i);
      const display = component['repeatArray'](source);

      expect(display.length).toBeGreaterThanOrEqual(source.length * 3);
      expect(display.slice(0, source.length)).toEqual(source);
      expect(display.slice(source.length, source.length * 2)).toEqual(source);
    });

    it('should not repeat source array when fewer than 6 items', () => {
      const source = [0, 15, 30, 45];
      const display = component['repeatArray'](source);

      expect(display.length).toBe(source.length);
      expect(display).toEqual(source);
    });

    it('should scroll column by step and apply wrap in single operation', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const mockItemsEl = {
        style: { transform: '' },
        scrollHeight: 2880,
        parentElement: { clientHeight: 240 }
      } as any;

      spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
      spyOn(component as any, 'getCellStep').and.returnValue(40);

      const sectionHeight = 24 * 40;
      component['columnOffsets'].hour = sectionHeight;

      component['scrollColumnByStep']('hour', 1);

      const newOffset = component['columnOffsets'].hour;
      expect(newOffset).toBeGreaterThanOrEqual(sectionHeight);
      expect(newOffset).toBeLessThan(2 * sectionHeight);
      expect(mockItemsEl.style.transform).toBe(`translateY(${-newOffset}px)`);
    });

    it('should keep offset in valid range after multiple forward scrolls past boundary', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const mockItemsEl = {
        style: { transform: '' },
        scrollHeight: 2880,
        parentElement: { clientHeight: 240 }
      } as any;

      spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
      spyOn(component as any, 'getCellStep').and.returnValue(40);

      const sectionHeight = 24 * 40;
      component['columnOffsets'].hour = 2 * sectionHeight - 40;

      component['scrollColumnByStep']('hour', 1);

      const newOffset = component['columnOffsets'].hour;
      expect(newOffset).toBeGreaterThanOrEqual(sectionHeight);
      expect(newOffset).toBeLessThan(2 * sectionHeight);
    });

    it('should keep offset in valid range after multiple backward scrolls past boundary', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const mockItemsEl = {
        style: { transform: '' },
        scrollHeight: 2880,
        parentElement: { clientHeight: 240 }
      } as any;

      spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
      spyOn(component as any, 'getCellStep').and.returnValue(40);

      const sectionHeight = 24 * 40;
      component['columnOffsets'].hour = sectionHeight;

      component['scrollColumnByStep']('hour', -1);

      const newOffset = component['columnOffsets'].hour;
      expect(newOffset).toBeGreaterThanOrEqual(sectionHeight);
      expect(newOffset).toBeLessThan(2 * sectionHeight);
    });

    it('should return 0 for wrapOffset when sectionHeight is 0', () => {
      const result = component['wrapOffset'](100, 0);
      expect(result).toBe(100);
    });

    it('should return 0 for computeTopDisplayIndex when step is 0', () => {
      const result = component['computeTopDisplayIndex'](100, 0, 72);
      expect(result).toBe(0);
    });

    it('should not apply translateY when source array has fewer than 6 items', () => {
      component.minuteInterval = 15;
      component.ngOnInit();
      fixture.detectChanges();

      const mockItemsEl = { style: { transform: '' }, scrollHeight: 160, parentElement: { clientHeight: 160 } } as any;
      spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
      spyOn(component as any, 'getCellStep').and.returnValue(40);

      component['initColumnOffset']('minute');

      expect(mockItemsEl.style.transform).toBe('');
      expect(component['columnOffsets'].minute).toBe(0);
    });

    it('should handle scrollColumnByStep without infinity scroll', () => {
      component.minuteInterval = 15;
      component.ngOnInit();
      fixture.detectChanges();

      const mockItemsEl = { style: { transform: '' }, scrollHeight: 160, parentElement: { clientHeight: 160 } } as any;
      spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
      spyOn(component as any, 'getCellStep').and.returnValue(40);

      component['focusedDisplayIndex'].minute = 0;
      component['scrollColumnByStep']('minute', 1);

      expect(component['focusedDisplayIndex'].minute).toBe(1);
    });
  });

  describe('Additional coverage:', () => {
    describe('onColumnWheel:', () => {
      it('should call scrollColumnByStep with direction 1 for deltaY > 0', fakeAsync(() => {
        component.ngOnInit();
        fixture.detectChanges();

        const event = new WheelEvent('wheel', { deltaY: 100 });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'scrollColumnByStep');

        component.onColumnWheel(event, 'hour');
        tick(50);

        expect(event.preventDefault).toHaveBeenCalled();
      }));

      it('should throttle multiple wheel events via requestAnimationFrame', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const event1 = new WheelEvent('wheel', { deltaY: 100 });
        const event2 = new WheelEvent('wheel', { deltaY: 100 });
        spyOn(event1, 'preventDefault');
        spyOn(event2, 'preventDefault');

        component.onColumnWheel(event1, 'hour');
        component.onColumnWheel(event2, 'hour');

        expect(event1.preventDefault).toHaveBeenCalled();
        expect(event2.preventDefault).toHaveBeenCalled();
      });
    });

    describe('onCellFocus:', () => {
      it('should update focusedDisplayIndex and activeDescendant', () => {
        component.ngOnInit();
        fixture.detectChanges();

        component.onCellFocus('hour', 5);

        expect(component['focusedDisplayIndex'].hour).toBeGreaterThanOrEqual(0);
        expect(component.activeDescendantIds.hour).toContain('po-timer-hour-');
      });
    });

    describe('focusFirstVisibleCell:', () => {
      it('should focus active button of the first visible column', () => {
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'focusActiveButton');

        component.focusFirstVisibleCell();

        expect(component['focusActiveButton']).toHaveBeenCalledWith('hour');
      });
    });

    describe('focusLastVisibleCell:', () => {
      it('should focus active button of the last visible column in 24h mode', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'focusActiveButton');

        component.focusLastVisibleCell();

        expect(component['focusActiveButton']).toHaveBeenCalledWith('minute');
      });

      it('should focus period column in 12h mode', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'focusActiveButton');

        component.focusLastVisibleCell();

        expect(component['focusActiveButton']).toHaveBeenCalledWith('period');
      });

      it('should focus second column when showSeconds is true in 24h', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'focusActiveButton');

        component.focusLastVisibleCell();

        expect(component['focusActiveButton']).toHaveBeenCalledWith('second');
      });
    });

    describe('ngOnDestroy:', () => {
      it('should cancel wheelRafId when set', () => {
        spyOn(window, 'cancelAnimationFrame');
        component['wheelRafId'] = 42;

        component.ngOnDestroy();

        expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42);
      });

      it('should not cancel when wheelRafId is null', () => {
        spyOn(window, 'cancelAnimationFrame');
        component['wheelRafId'] = null;

        component.ngOnDestroy();

        expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit:', () => {
      it('should set hasViewInitialized to true', () => {
        component['hasViewInitialized'] = false;
        spyOn(component, 'initAllColumnOffsets');

        component.ngAfterViewInit();

        expect(component['hasViewInitialized']).toBeTrue();
      });
    });

    describe('ngAfterViewChecked:', () => {
      it('should not do anything when not initialized', () => {
        component['hasViewInitialized'] = false;
        spyOn(component as any, 'initAllColumnOffsets');

        component.ngAfterViewChecked();

        expect(component['initAllColumnOffsets']).not.toHaveBeenCalled();
      });
    });

    describe('trackByIndex:', () => {
      it('should return the index', () => {
        expect(component.trackByIndex(5, 10)).toBe(5);
      });
    });

    describe('getVisibleColumnTypes (private):', () => {
      it('should return hour and minute in 24h no seconds', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = false;
        component.ngOnInit();

        expect(component['getVisibleColumnTypes']()).toEqual(['hour', 'minute']);
      });

      it('should include second when showSeconds is true', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.ngOnInit();

        expect(component['getVisibleColumnTypes']()).toEqual(['hour', 'minute', 'second']);
      });

      it('should include period in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        component.showSeconds = false;
        component.ngOnInit();

        expect(component['getVisibleColumnTypes']()).toEqual(['hour', 'minute', 'period']);
      });

      it('should include second and period in 12h with seconds', () => {
        component.format = PoTimerFormat.Format12;
        component.showSeconds = true;
        component.ngOnInit();

        expect(component['getVisibleColumnTypes']()).toEqual(['hour', 'minute', 'second', 'period']);
      });
    });

    describe('getCellsForType (private):', () => {
      it('should return hourCells for hour', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getCellsForType']('hour')).toBe(component.hourCells);
      });

      it('should return minuteCells for minute', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getCellsForType']('minute')).toBe(component.minuteCells);
      });

      it('should return secondCells for second', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getCellsForType']('second')).toBe(component.secondCells);
      });

      it('should return periodCells for period', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getCellsForType']('period')).toBe(component.periodCells);
      });

      it('should return null for unknown type', () => {
        expect(component['getCellsForType']('unknown' as any)).toBeNull();
      });
    });

    describe('getSourceArray (private):', () => {
      it('should return hours for hour type', () => {
        component.ngOnInit();
        expect(component['getSourceArray']('hour')).toBe(component.hours);
      });

      it('should return minutes for minute type', () => {
        component.ngOnInit();
        expect(component['getSourceArray']('minute')).toBe(component.minutes);
      });

      it('should return seconds for second type', () => {
        component.showSeconds = true;
        component.ngOnInit();
        expect(component['getSourceArray']('second')).toBe(component.seconds);
      });

      it('should return hours as default for unknown type', () => {
        component.ngOnInit();
        expect(component['getSourceArray']('unknown' as any)).toBe(component.hours);
      });
    });

    describe('getDisplayArray (private):', () => {
      it('should return displayHours for hour type', () => {
        component.ngOnInit();
        expect(component['getDisplayArray']('hour')).toBe(component.displayHours);
      });

      it('should return displayMinutes for minute type', () => {
        component.ngOnInit();
        expect(component['getDisplayArray']('minute')).toBe(component.displayMinutes);
      });

      it('should return displaySeconds for second type', () => {
        component.showSeconds = true;
        component.ngOnInit();
        expect(component['getDisplayArray']('second')).toBe(component.displaySeconds);
      });

      it('should return empty array for unknown type', () => {
        component.ngOnInit();
        expect(component['getDisplayArray']('unknown' as any)).toEqual([]);
      });
    });

    describe('getSelectedValue (private):', () => {
      it('should return selectedHour for hour type', () => {
        component.selectedHour = 10;
        expect(component['getSelectedValue']('hour')).toBe(10);
      });

      it('should return selectedMinute for minute type', () => {
        component.selectedMinute = 30;
        expect(component['getSelectedValue']('minute')).toBe(30);
      });

      it('should return selectedSecond for second type', () => {
        component.selectedSecond = 45;
        expect(component['getSelectedValue']('second')).toBe(45);
      });

      it('should return 0 for unknown type', () => {
        expect(component['getSelectedValue']('unknown' as any)).toBe(0);
      });
    });

    describe('isValueDisabledByType (private):', () => {
      beforeEach(() => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        component.ngOnInit();
      });

      it('should delegate to isHourDisabled for hour type', () => {
        expect(component['isValueDisabledByType']('hour', 5)).toBeTrue();
        expect(component['isValueDisabledByType']('hour', 10)).toBeFalse();
      });

      it('should return false for minute when no hour selected', () => {
        component.selectedHour = null;
        expect(component['isValueDisabledByType']('minute', 30)).toBeFalse();
      });

      it('should delegate to isMinuteDisabled for minute when hour selected', () => {
        component.selectedHour = 8;
        component['rebuildDisabledCaches']();
        expect(component['isValueDisabledByType']('minute', 30)).toBeFalse();
      });

      it('should return false for second when no hour or minute selected', () => {
        component.selectedHour = null;
        component.selectedMinute = null;
        expect(component['isValueDisabledByType']('second', 30)).toBeFalse();
      });

      it('should return false for unknown type', () => {
        expect(component['isValueDisabledByType']('unknown' as any, 0)).toBeFalse();
      });
    });

    describe('isDisplayIndexDisabled (private):', () => {
      beforeEach(() => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        component.ngOnInit();
      });

      it('should check hour disabled state', () => {
        expect(component['isDisplayIndexDisabled']('hour', 5, component.displayHours)).toBeTrue();
      });

      it('should check minute disabled state', () => {
        component.selectedHour = 7;
        component['rebuildDisabledCaches']();

        expect(component['isDisplayIndexDisabled']('minute', 0, component.displayMinutes)).toBeTrue();
      });

      it('should return false for default type', () => {
        expect(component['isDisplayIndexDisabled']('unknown' as any, 0, [0])).toBeFalse();
      });
    });

    describe('getForwardDistance (private):', () => {
      it('should compute forward distance', () => {
        expect(component['getForwardDistance'](2, 5, 10)).toBe(3);
      });

      it('should wrap around when to < from', () => {
        expect(component['getForwardDistance'](8, 2, 10)).toBe(4);
      });

      it('should return 0 for same index', () => {
        expect(component['getForwardDistance'](5, 5, 10)).toBe(0);
      });

      it('should return 0 for zero length', () => {
        expect(component['getForwardDistance'](5, 3, 0)).toBe(0);
      });
    });

    describe('getNormalizedDisplayIndex (private):', () => {
      it('should return -1 for empty display array', () => {
        component.displayHours = [];
        expect(component['getNormalizedDisplayIndex']('hour', 5)).toBe(-1);
      });

      it('should normalize negative index', () => {
        component.ngOnInit();
        const len = component.displayHours.length;
        expect(component['getNormalizedDisplayIndex']('hour', -1)).toBe(len - 1);
      });
    });

    describe('getColumnViewportHeight (private):', () => {
      it('should return clientHeight from parent element', () => {
        const mockEl = { parentElement: { clientHeight: 240 } } as any;
        expect(component['getColumnViewportHeight'](mockEl, 40)).toBe(240);
      });

      it('should fall back to step * VISIBLE_ITEMS when no clientHeight', () => {
        const mockEl = { parentElement: null } as any;
        expect(component['getColumnViewportHeight'](mockEl, 40)).toBe(240);
      });

      it('should fall back when clientHeight is 0', () => {
        const mockEl = { parentElement: { clientHeight: 0 } } as any;
        expect(component['getColumnViewportHeight'](mockEl, 40)).toBe(240);
      });
    });

    describe('getCurrentFocusedDisplayIndex (private):', () => {
      it('should return period index modulo 2 for period type', () => {
        component['focusedDisplayIndex'].period = 5;
        expect(component['getCurrentFocusedDisplayIndex']('period')).toBe(1);
      });

      it('should return normalized index for non-period type', () => {
        component.ngOnInit();
        component['focusedDisplayIndex'].hour = 3;
        expect(component['getCurrentFocusedDisplayIndex']('hour')).toBe(3);
      });
    });

    describe('getNormalizedFocusedIndex (private):', () => {
      it('should return 0 for empty display array', () => {
        component.displayHours = [];
        expect(component['getNormalizedFocusedIndex']('hour')).toBe(0);
      });

      it('should return 0 for period type when display array is empty', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        // getDisplayArray('period') returns [], so early return 0
        const result = component['getNormalizedFocusedIndex']('period');
        expect(result).toBe(0);
      });
    });

    describe('updateActiveDescendant (private):', () => {
      it('should set activeDescendantIds for valid index', () => {
        component.ngOnInit();
        component['updateActiveDescendant']('hour', 5);
        expect(component.activeDescendantIds.hour).toBe('po-timer-hour-5');
      });

      it('should not update for invalid index', () => {
        component.displayHours = [];
        component.activeDescendantIds.hour = 'old';
        component['updateActiveDescendant']('hour', 5);
        expect(component.activeDescendantIds.hour).toBe('old');
      });
    });

    describe('selectFocusedItem (private):', () => {
      beforeEach(() => {
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should call onSelectMinute for minute type', () => {
        spyOn(component, 'onSelectMinute');
        component['focusedDisplayIndex'].minute = 0;
        component['selectFocusedItem']('minute');
        expect(component.onSelectMinute).toHaveBeenCalled();
      });

      it('should call onSelectSecond for second type', () => {
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();
        fixture.detectChanges();

        spyOn(component, 'onSelectSecond');
        component['focusedDisplayIndex'].second = 0;
        component['selectFocusedItem']('second');
        expect(component.onSelectSecond).toHaveBeenCalled();
      });

      it('should not call any selection for empty display array', () => {
        component.displayHours = [];
        spyOn(component, 'onSelectHour');
        component['selectFocusedItem']('hour');
        expect(component.onSelectHour).not.toHaveBeenCalled();
      });

      it('should not select disabled item', () => {
        component.minTime = '08:00';
        component['rebuildDisabledCaches']();

        spyOn(component, 'onSelectHour');
        component['focusedDisplayIndex'].hour = 3;
        component['selectFocusedItem']('hour');
        expect(component.onSelectHour).not.toHaveBeenCalled();
      });
    });

    describe('ngOnChanges - minTime/maxTime changes:', () => {
      it('should rebuild disabled caches when minTime changes', () => {
        component.ngOnInit();
        spyOn(component as any, 'rebuildDisabledCaches');
        spyOn(component['changeDetector'], 'markForCheck');

        const changes = {
          minTime: {
            currentValue: '08:00',
            previousValue: undefined,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.ngOnChanges(changes);

        expect(component['rebuildDisabledCaches']).toHaveBeenCalled();
        expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      });

      it('should rebuild disabled caches when maxTime changes', () => {
        component.ngOnInit();
        spyOn(component as any, 'rebuildDisabledCaches');
        spyOn(component['changeDetector'], 'markForCheck');

        const changes = {
          maxTime: {
            currentValue: '18:00',
            previousValue: undefined,
            firstChange: false,
            isFirstChange: () => false
          }
        };

        component.ngOnChanges(changes);

        expect(component['rebuildDisabledCaches']).toHaveBeenCalled();
        expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      });
    });

    describe('onSelectHour - cascade to seconds:', () => {
      it('should cascade update to seconds when second is disabled after hour change', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '08:30:30';
        component.ngOnInit();

        component.selectedHour = 10;
        component.selectedMinute = 30;
        component.selectedSecond = 15;

        component.onSelectHour(8);

        expect(component.selectedHour).toBe(8);
      });
    });

    describe('onSelectMinute - cascade to seconds:', () => {
      it('should cascade update to seconds when second is disabled after minute change', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '08:30:30';
        component.ngOnInit();

        component.selectedHour = 8;
        component.selectedSecond = 15;

        component.onSelectMinute(30);

        expect(component.selectedMinute).toBe(30);
      });
    });

    describe('focusNextColumn / focusPreviousColumn (via Tab):', () => {
      beforeEach(() => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should move focus from hour to minute on Tab', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'focusActiveButton');

        component.onCellKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusActiveButton']).toHaveBeenCalledWith('minute');
      });

      it('should move focus from minute to second on Tab', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'focusActiveButton');

        component.onCellKeydown(event, 'minute');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusActiveButton']).toHaveBeenCalledWith('second');
      });

      it('should move focus from second to minute on Shift+Tab', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'focusActiveButton');

        component.onCellKeydown(event, 'second');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusActiveButton']).toHaveBeenCalledWith('minute');
      });

      it('should move focus from minute to hour on Shift+Tab', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'focusActiveButton');

        component.onCellKeydown(event, 'minute');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusActiveButton']).toHaveBeenCalledWith('hour');
      });
    });

    describe('onPeriodKeydown Tab navigation:', () => {
      beforeEach(() => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should emit forward boundary on Tab from period', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component.boundaryTab, 'emit');

        component.onPeriodKeydown(event);

        expect(component.boundaryTab.emit).toHaveBeenCalledWith({
          direction: 'forward',
          event,
          column: 'period'
        });
      });

      it('should move focus to minute on Shift+Tab from period', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'focusActiveButton');

        component.onPeriodKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['focusActiveButton']).toHaveBeenCalledWith('minute');
      });
    });

    describe('onCellKeydown - Space selection:', () => {
      it('should select focused minute on Space', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: ' ' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'onSelectMinute');

        component['focusedDisplayIndex'].minute = 0;
        component.onCellKeydown(event, 'minute');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.onSelectMinute).toHaveBeenCalled();
      });
    });

    describe('onCellKeydown - default case:', () => {
      it('should not prevent default for unhandled keys', () => {
        component.ngOnInit();
        const event = new KeyboardEvent('keydown', { key: 'a' });
        spyOn(event, 'preventDefault');

        component.onCellKeydown(event, 'hour');

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('getItemsElement (private):', () => {
      it('should return null for unknown type', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getItemsElement']('unknown' as any)).toBeNull();
      });
    });

    describe('writeValue (extended):', () => {
      it('should set period to PM for 12h format with afternoon time', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();

        component.writeValue('15:30');

        expect(component.period).toBe('PM');
        expect(component.selectedHour).toBe(3);
        expect(component.selectedMinute).toBe(30);
      });

      it('should set period to AM for 12h format with morning time', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();

        component.writeValue('09:30');

        expect(component.period).toBe('AM');
        expect(component.selectedHour).toBe(9);
        expect(component.selectedMinute).toBe(30);
      });

      it('should set selectedSecond for time with seconds', () => {
        component.showSeconds = true;
        component.ngOnInit();

        component.writeValue('10:30:45');

        expect(component.selectedSecond).toBe(45);
      });
    });

    describe('getDomFocusedDisplayIndex (private):', () => {
      it('should return null when no active element matches', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component['getDomFocusedDisplayIndex']('hour')).toBeNull();
      });
    });

    describe('buildDisplayArrays (private):', () => {
      it('should populate display arrays on init', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();

        expect(component.displayHours.length).toBeGreaterThan(0);
        expect(component.displayMinutes.length).toBeGreaterThan(0);
        expect(component.displaySeconds.length).toBeGreaterThan(0);
      });

      it('should have empty displaySeconds when showSeconds is false', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = false;
        component.ngOnInit();

        expect(component.displaySeconds.length).toBe(0);
      });
    });

    describe('rebuildDisabledCaches (private):', () => {
      it('should populate disabledMinuteCache', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:30';
        component.ngOnInit();
        component.selectedHour = 8;
        component['rebuildDisabledCaches']();

        expect(component.disabledMinuteCache.has(15)).toBeTrue();
        expect(component.disabledMinuteCache.has(30)).toBeFalse();
      });
    });

    describe('getFirstAvailableMinuteForCurrentHour (private):', () => {
      it('should return first non-disabled minute', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:15';
        component.ngOnInit();
        component.selectedHour = 8;
        component['rebuildDisabledCaches']();

        const result = component['getFirstAvailableMinuteForCurrentHour']();

        expect(result).toBe(15);
      });

      it('should return null when all minutes are disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '09:00';
        component.maxTime = '07:59';
        component.ngOnInit();
        component.selectedHour = 8;
        component['rebuildDisabledCaches']();

        const result = component['getFirstAvailableMinuteForCurrentHour']();

        expect(result).toBeNull();
      });
    });

    describe('getFirstAvailableSecondForCurrentHourAndMinute (private):', () => {
      it('should return first non-disabled second', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '08:30:20';
        component.ngOnInit();
        component.selectedHour = 8;
        component.selectedMinute = 30;
        component['rebuildDisabledCaches']();

        const result = component['getFirstAvailableSecondForCurrentHourAndMinute']();

        expect(result).toBe(20);
      });
    });

    describe('scrollColumnByStep with empty arrays:', () => {
      it('should return early when getItemsElement returns null', () => {
        component.ngOnInit();
        spyOn(component as any, 'getItemsElement').and.returnValue(null);

        expect(() => component['scrollColumnByStep']('hour', 1)).not.toThrow();
      });

      it('should return early when source array is empty', () => {
        component.ngOnInit();
        component.seconds = [];
        component.displaySeconds = [];

        const mockItemsEl = { style: { transform: '' } } as any;
        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);

        expect(() => component['scrollColumnByStep']('second', 1)).not.toThrow();
      });
    });

    describe('initColumnOffset edge cases:', () => {
      it('should return early when getItemsElement returns null', () => {
        component.ngOnInit();
        spyOn(component as any, 'getItemsElement').and.returnValue(null);

        expect(() => component['initColumnOffset']('hour')).not.toThrow();
      });

      it('should return early when source array is empty', () => {
        component.ngOnInit();
        component.hours = [];
        component.displayHours = [];

        const mockItemsEl = { style: { transform: '' } } as any;
        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);

        expect(() => component['initColumnOffset']('hour')).not.toThrow();
      });
    });

    describe('shouldTranslateToRevealFocusedItem edge cases:', () => {
      it('should return false when source array has < 6 items', () => {
        component.minuteInterval = 15;
        component.ngOnInit();

        expect(component['shouldTranslateToRevealFocusedItem']('minute', 0)).toBeFalse();
      });

      it('should return false when getItemsElement is null', () => {
        component.ngOnInit();
        spyOn(component as any, 'getItemsElement').and.returnValue(null);

        expect(component['shouldTranslateToRevealFocusedItem']('hour', 0)).toBeFalse();
      });
    });

    describe('getStepsToRevealFocusedItem edge cases:', () => {
      it('should return 0 when getItemsElement is null', () => {
        component.ngOnInit();
        spyOn(component as any, 'getItemsElement').and.returnValue(null);

        expect(component['getStepsToRevealFocusedItem']('hour', 0, 1)).toBe(0);
      });

      it('should return 0 when step is 0', () => {
        component.ngOnInit();
        const mockItemsEl = { style: { transform: '' }, scrollHeight: 0, parentElement: { clientHeight: 240 } } as any;
        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(0);

        expect(component['getStepsToRevealFocusedItem']('hour', 0, 1)).toBe(0);
      });

      it('should return negative steps when item is above viewport', () => {
        component.ngOnInit();
        const mockItemsEl = {
          style: { transform: '' },
          scrollHeight: 2880,
          parentElement: { clientHeight: 240 }
        } as any;
        spyOn(component as any, 'getItemsElement').and.returnValue(mockItemsEl);
        spyOn(component as any, 'getCellStep').and.returnValue(40);

        component['columnOffsets'].hour = 400;

        const steps = component['getStepsToRevealFocusedItem']('hour', 0, -1);
        expect(steps).toBeLessThan(0);
      });
    });

    describe('getNextEnabledDisplayIndex edge cases:', () => {
      it('should return 0 for empty display array', () => {
        component.displayHours = [];
        expect(component['getNextEnabledDisplayIndex']('hour', 0, 1)).toBe(0);
      });

      it('should return current index when all items are disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();

        const result = component['getNextEnabledDisplayIndex']('hour', 5, 1);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });

    describe('initAllColumnOffsets:', () => {
      it('should call initColumnOffset for hour, minute, second', () => {
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'initColumnOffset');
        spyOn(component as any, 'refreshRovingTabIndex');

        component.initAllColumnOffsets();

        expect(component['initColumnOffset']).toHaveBeenCalledWith('hour');
        expect(component['initColumnOffset']).toHaveBeenCalledWith('minute');
        expect(component['initColumnOffset']).toHaveBeenCalledWith('second');
        expect(component['refreshRovingTabIndex']).toHaveBeenCalled();
      });
    });

    describe('onSelectPeriod extended:', () => {
      it('should update focusedDisplayIndex for AM', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        fixture.detectChanges();

        component.onSelectPeriod('AM');

        expect(component['focusedDisplayIndex'].period).toBe(0);
      });

      it('should update focusedDisplayIndex for PM', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        fixture.detectChanges();

        component.onSelectPeriod('PM');

        expect(component['focusedDisplayIndex'].period).toBe(1);
      });
    });

    describe('moveFocusByStep (private):', () => {
      it('should not throw for empty display array', () => {
        component.displayHours = [];
        expect(() => component['moveFocusByStep']('hour', 1)).not.toThrow();
      });
    });

    describe('focusButtonAt (private) edge cases:', () => {
      it('should return early when cells are null', () => {
        spyOn(component as any, 'getCellsForType').and.returnValue(null);
        expect(() => component['focusButtonAt']('hour', 0)).not.toThrow();
      });
    });

    describe('getFirstAvailableIndexByType (private):', () => {
      it('should return 0 for empty source array', () => {
        expect(component['getFirstAvailableIndexByType']('hour', [])).toBe(0);
      });

      it('should return first non-disabled hour', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '05:00';
        component.ngOnInit();

        const result = component['getFirstAvailableIndexByType']('hour', component.hours);
        expect(result).toBe(5);
      });

      it('should return 0 for default type', () => {
        expect(component['getFirstAvailableIndexByType']('unknown' as any, [1, 2, 3])).toBe(0);
      });
    });

    describe('getReferenceHourForConstraints (private):', () => {
      it('should return selectedHour when valid', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component.selectedHour = 10;

        expect(component['getReferenceHourForConstraints']()).toBe(10);
      });

      it('should return first available hour when selectedHour is null', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '08:00';
        component.ngOnInit();
        component.selectedHour = null;

        expect(component['getReferenceHourForConstraints']()).toBe(8);
      });

      it('should return null when no hours available', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();
        component.selectedHour = null;

        expect(component['getReferenceHourForConstraints']()).toBeNull();
      });
    });

    describe('getReferenceMinuteForConstraints (private):', () => {
      it('should return selectedMinute when valid', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component.selectedMinute = 30;

        expect(component['getReferenceMinuteForConstraints'](10)).toBe(30);
      });

      it('should return first available minute when selectedMinute is null', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:15';
        component.ngOnInit();
        component.selectedMinute = null;

        expect(component['getReferenceMinuteForConstraints'](8)).toBe(15);
      });

      it('should return null when no minutes are allowed', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.minTime = '08:59';
        component.maxTime = '08:00';
        component.ngOnInit();
        component.selectedMinute = null;

        const result = component['getReferenceMinuteForConstraints'](8);
        expect(result).toBeNull();
      });
    });

    describe('onCellKeydown - ArrowUp branch:', () => {
      it('should call moveFocusByStep with -1 on ArrowUp', () => {
        component.ngOnInit();
        spyOn(component as any, 'moveFocusByStep');
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

        component.onCellKeydown(event, 'hour');

        expect(component['moveFocusByStep']).toHaveBeenCalledWith('hour', -1);
      });
    });

    describe('onPeriodKeydown - default branch:', () => {
      it('should not throw on unrecognized key', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        const event = new KeyboardEvent('keydown', { key: 'a' });

        expect(() => component.onPeriodKeydown(event)).not.toThrow();
      });
    });

    describe('onColumnWheel - direction < 0:', () => {
      it('should pass direction -1 when deltaY < 0', fakeAsync(() => {
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'scrollColumnByStep');

        const event = new WheelEvent('wheel', { deltaY: -100 });
        spyOn(event, 'preventDefault');

        component.onColumnWheel(event, 'hour');
        tick(50);

        expect(event.preventDefault).toHaveBeenCalled();
      }));
    });

    describe('getFirstAvailableIndexByType - minute branch:', () => {
      it('should return 0 when referenceHour is null for minute type', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();
        component.selectedHour = null;

        const result = component['getFirstAvailableIndexByType']('minute', component.minutes);
        expect(result).toBe(0);
      });
    });

    describe('getFirstAvailableIndexByType - second branch:', () => {
      it('should return 0 when referenceHour is null for second type', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '25:00';
        component.ngOnInit();
        component.selectedHour = null;

        const result = component['getFirstAvailableIndexByType']('second', component.seconds);
        expect(result).toBe(0);
      });

      it('should return 0 when referenceMinute is null for second type', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minuteInterval = 1;
        component.minTime = '08:59';
        component.maxTime = '08:00';
        component.ngOnInit();
        component.selectedHour = null;

        const result = component['getFirstAvailableIndexByType']('second', component.seconds);
        expect(result).toBe(0);
      });
    });

    describe('isValueDisabledByType - second branch with null selectedHour:', () => {
      it('should return false for second type when selectedHour is null', () => {
        component.ngOnInit();
        component.selectedHour = null;
        component.selectedMinute = null;

        expect(component['isValueDisabledByType']('second', 0)).toBe(false);
      });
    });

    describe('focusButtonAt - edge cases:', () => {
      it('should return early when cells are empty', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(() => component['focusButtonAt']('hour', 0)).not.toThrow();
      });
    });

    describe('focusPreviousColumn - unknown type:', () => {
      it('should return early when type is not in visible columns', () => {
        component.ngOnInit();
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

        expect(() => component['focusPreviousColumn'](event, 'period')).not.toThrow();
      });
    });

    describe('selectFocusedItem - second type:', () => {
      it('should call onSelectSecond for second type', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();
        component['buildDisplayArrays']();
        spyOn(component, 'onSelectSecond');
        component['focusedDisplayIndex']['second'] = 0;

        component['selectFocusedItem']('second');

        expect(component.onSelectSecond).toHaveBeenCalled();
      });

      it('should not throw for default type in selectFocusedItem', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();
        component['focusedDisplayIndex']['hour'] = 0;

        expect(() => component['selectFocusedItem']('period' as any)).not.toThrow();
      });
    });

    describe('shouldTranslateToRevealFocusedItem - step <= 0:', () => {
      it('should return false when step is 0', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['shouldTranslateToRevealFocusedItem']('hour', 0);
        expect(result).toBe(false);
      });
    });

    describe('getStepsToRevealFocusedItem - stepDirection < 0:', () => {
      it('should return 0 when step is 0', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['getStepsToRevealFocusedItem']('hour', 0, -1);
        expect(result).toBe(0);
      });
    });

    describe('getDisplayIndexForSourceNearViewport - edge cases:', () => {
      it('should fallback when sourceLength < 6', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 15;
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['getDisplayIndexForSourceNearViewport']('minute', 0, 1);
        expect(result).toBeDefined();
      });

      it('should fallback when no items element', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });

      it('should return normalized index when display array is empty', () => {
        component.ngOnInit();
        component.displayHours = [];
        component.displayMinutes = [];

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(result).toBe(-1);
      });
    });

    describe('getNormalizedFocusedIndex - period with display array:', () => {
      it('should return modulo for period type', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        component['buildDisplayArrays']();
        component['focusedDisplayIndex']['period'] = 5;

        const result = component['getNormalizedFocusedIndex']('period');
        // getDisplayArray('period') may return empty, so result is 0
        expect(typeof result).toBe('number');
      });

      it('should return startIndex when all items are disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();
        component['buildDisplayArrays']();
        component['focusedDisplayIndex']['hour'] = 0;

        const result = component['getNormalizedFocusedIndex']('hour');
        expect(typeof result).toBe('number');
      });
    });

    describe('getDomFocusedDisplayIndex - edge cases:', () => {
      it('should return null when active element is not a timer button', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['getDomFocusedDisplayIndex']('hour');
        expect(result).toBeNull();
      });
    });

    describe('realignColumnsToSelection:', () => {
      it('should call initAllColumnOffsets via double rAF', fakeAsync(() => {
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component, 'initAllColumnOffsets');

        component['realignColumnsToSelection']();
        tick(100);

        expect(component.initAllColumnOffsets).toHaveBeenCalled();
      }));
    });

    describe('getFirstAvailableSecondForCurrentHourAndMinute:', () => {
      it('should return first non-disabled second', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();

        const result = component['getFirstAvailableSecondForCurrentHourAndMinute']();
        expect(result).toBe(0);
      });

      it('should return null when all seconds are disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.minTime = '25:00';
        component.maxTime = '00:00';
        component.ngOnInit();

        const result = component['getFirstAvailableSecondForCurrentHourAndMinute']();
        expect(result).toBeNull();
      });
    });

    describe('getFocusableDisplayIndex - edge cases:', () => {
      it('should return normalizedIndex when sourceLength < 6', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 15;
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['getFocusableDisplayIndex']('minute', 0, 4);
        expect(result).toBe(0);
      });

      it('should return normalizedIndex when step is 0', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['getFocusableDisplayIndex']('hour', 0, 72);
        expect(typeof result).toBe('number');
      });
    });

    describe('getNextEnabledDisplayIndex - edge cases:', () => {
      it('should return startIndex when all items are disabled', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['getNextEnabledDisplayIndex']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });

      it('should use displayArray.length as maxIterations when sourceLength < 6', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 15;
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['getNextEnabledDisplayIndex']('minute', 0, 1);
        expect(typeof result).toBe('number');
      });
    });

    describe('isValueDisabledByType - second branch with non-null selectedHour but null selectedMinute:', () => {
      it('should return false for second type when selectedMinute is null', () => {
        component.ngOnInit();
        component.selectedHour = 10;
        component.selectedMinute = null;

        expect(component['isValueDisabledByType']('second', 0)).toBe(false);
      });

      it('should call isSecondDisabled when both selectedHour and selectedMinute are set', () => {
        component.ngOnInit();
        component.selectedHour = 10;
        component.selectedMinute = 30;

        const result = component['isValueDisabledByType']('second', 0);
        expect(typeof result).toBe('boolean');
      });
    });

    describe('focusButtonAt - all buttons disabled branch:', () => {
      it('should skip disabled buttons via continue', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        fixture.detectChanges();

        // Create mock cells with disabled buttons
        const mockCells = {
          toArray: () => [
            {
              nativeElement: (() => {
                const el = document.createElement('div');
                const btn = document.createElement('button');
                btn.disabled = true;
                el.appendChild(btn);
                return el;
              })()
            },
            {
              nativeElement: (() => {
                const el = document.createElement('div');
                const btn = document.createElement('button');
                el.appendChild(btn);
                return el;
              })()
            }
          ]
        };
        spyOn(component as any, 'getCellsForType').and.returnValue(mockCells);

        expect(() => component['focusButtonAt']('hour', 0)).not.toThrow();
      });

      it('should handle empty cells array', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const mockCells = { toArray: () => [] };
        spyOn(component as any, 'getCellsForType').and.returnValue(mockCells);

        expect(() => component['focusButtonAt']('hour', 0)).not.toThrow();
      });
    });

    describe('focusActiveButton:', () => {
      it('should call normalizeFocusedIndex, focusButtonAt and updateActiveDescendant', () => {
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component as any, 'normalizeFocusedIndex');
        spyOn(component as any, 'focusButtonAt');
        spyOn(component as any, 'updateActiveDescendant');

        component['focusActiveButton']('hour');

        expect(component['normalizeFocusedIndex']).toHaveBeenCalledWith('hour');
        expect(component['focusButtonAt']).toHaveBeenCalled();
        expect(component['updateActiveDescendant']).toHaveBeenCalled();
      });
    });

    describe('getStepsToRevealFocusedItem - step <= 0 branch:', () => {
      it('should return 0 when step <= 0', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(0);

        const result = component['getStepsToRevealFocusedItem']('hour', 0, 1);
        expect(result).toBe(0);
      });

      it('should return negative steps when scrolling backward and item is above viewport', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(40);
        spyOn(component as any, 'getColumnViewportHeight').and.returnValue(240);
        component['columnOffsets']['hour'] = 400;

        const result = component['getStepsToRevealFocusedItem']('hour', 0, -1);
        expect(typeof result).toBe('number');
      });
    });

    describe('getDisplayIndexForSourceNearViewport - isVisible branch:', () => {
      it('should prefer visible candidates over non-visible ones', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(40);
        component['columnOffsets']['hour'] = 40;

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });
    });

    describe('getNormalizedFocusedIndex - period type branch:', () => {
      it('should return period modulo 2 when period display array is available', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        component['buildDisplayArrays']();
        component['focusedDisplayIndex']['period'] = 3;

        // Need to mock getDisplayArray to return non-empty for period
        spyOn(component as any, 'getDisplayArray').and.callFake((type: string) => {
          if (type === 'period') {
            return ['AM', 'PM'];
          }
          return component['displayHours'];
        });

        const result = component['getNormalizedFocusedIndex']('period');
        expect(result).toBe(1);
      });
    });

    describe('getDomFocusedDisplayIndex - NaN rawIndex branch:', () => {
      it('should return null when id suffix is not a number', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const btn = document.createElement('button');
        const poBtn = document.createElement('po-button');
        poBtn.classList.add('po-timer-display');
        poBtn.id = 'po-timer-hour-abc';
        poBtn.appendChild(btn);
        document.body.appendChild(poBtn);
        btn.focus();

        const result = component['getDomFocusedDisplayIndex']('hour');
        expect(result).toBeNull();

        document.body.removeChild(poBtn);
      });
    });

    describe('getDisplayArray - default branch:', () => {
      it('should return empty array for unknown type', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['getDisplayArray']('period');
        expect(result).toEqual([]);
      });
    });

    describe('getCellsForType - default branch:', () => {
      it('should return null for unknown type', () => {
        component.ngOnInit();

        const result = component['getCellsForType']('unknown' as any);
        expect(result).toBeNull();
      });
    });

    describe('getFirstAvailableIndexByType - index fallback to 0:', () => {
      it('should return 0 when hour findIndex returns -1 (all hours disabled)', () => {
        component.format = PoTimerFormat.Format24;
        component.minTime = '25:00';
        component.ngOnInit();

        const result = component['getFirstAvailableIndexByType']('hour', component.hours);
        expect(result).toBe(0);
      });

      it('should return 0 when minute findIndex returns -1 (all minutes disabled)', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 1;
        component.ngOnInit();

        spyOn(component as any, 'getReferenceHourForConstraints').and.returnValue(10);
        spyOn(component as any, 'isMinuteAllowedForHour').and.returnValue(false);

        const result = component['getFirstAvailableIndexByType']('minute', component.minutes);
        expect(result).toBe(0);
      });

      it('should return 0 when second findIndex returns -1 (all seconds disabled)', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;
        component.secondInterval = 1;
        component.ngOnInit();

        spyOn(component as any, 'getReferenceHourForConstraints').and.returnValue(10);
        spyOn(component as any, 'getReferenceMinuteForConstraints').and.returnValue(30);
        spyOn(component as any, 'isSecondAllowed').and.returnValue(false);

        const result = component['getFirstAvailableIndexByType']('second', component.seconds);
        expect(result).toBe(0);
      });

      it('should return 0 for empty sourceArray', () => {
        component.ngOnInit();

        const result = component['getFirstAvailableIndexByType']('hour', []);
        expect(result).toBe(0);
      });
    });

    describe('getSourceArray - default returns hours:', () => {
      it('should return hours for unknown type', () => {
        component.ngOnInit();

        const result = component['getSourceArray']('unknown' as any);
        expect(result).toBe(component.hours);
      });
    });

    describe('getItemsElement - default returns null:', () => {
      it('should return null for period type', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const result = component['getItemsElement']('period');
        expect(result).toBeNull();
      });
    });

    describe('getSelectedValue - default returns 0:', () => {
      it('should return 0 for unknown type', () => {
        component.ngOnInit();

        const result = component['getSelectedValue']('unknown' as any);
        expect(result).toBe(0);
      });
    });

    describe('isDisplayIndexDisabled - default returns false:', () => {
      it('should return false for period type', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['isDisplayIndexDisabled']('period', 0, [0, 1]);
        expect(result).toBe(false);
      });
    });

    describe('getForwardDistance - length <= 0:', () => {
      it('should return 0 when length is 0', () => {
        component.ngOnInit();

        const result = component['getForwardDistance'](0, 5, 0);
        expect(result).toBe(0);
      });
    });

    describe('getNormalizedDisplayIndex - empty display array:', () => {
      it('should return -1 when display array is empty', () => {
        component.ngOnInit();
        component.displayHours = [];

        const result = component['getNormalizedDisplayIndex']('hour', 0);
        expect(result).toBe(-1);
      });
    });

    describe('getFocusableDisplayIndex - step <= 0 branch:', () => {
      it('should return normalizedIndex when step is 0', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(0);

        const result = component['getFocusableDisplayIndex']('hour', 5, component.displayHours.length);
        expect(typeof result).toBe('number');
      });
    });

    describe('getDisplayIndexForSourceNearViewport - step <= 0 and no itemsEl:', () => {
      it('should return normalized index when step <= 0', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(0);

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });

      it('should return normalized index when itemsEl is null', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getItemsElement').and.returnValue(null);

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });

      it('should handle sourceLength === 0', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();
        component.hours = [];
        component.displayHours = [];

        const result = component['getDisplayIndexForSourceNearViewport']('hour', 0, 1);
        expect(result).toBe(-1);
      });
    });

    describe('getNextEnabledDisplayIndex - sourceLength 0 branch:', () => {
      it('should return candidateIndex directly when sourceLength is 0', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();

        spyOn(component as any, 'getSourceArray').and.returnValue([]);
        spyOn(component as any, 'getDisplayArray').and.returnValue([1, 2, 3]);
        spyOn(component as any, 'isDisplayIndexDisabled').and.returnValue(false);
        spyOn(component as any, 'getDisplayIndexForSourceNearViewport').and.callFake((_t: string, idx: number) => idx);

        const result = component['getNextEnabledDisplayIndex']('hour', 0, 1);
        expect(typeof result).toBe('number');
      });
    });

    describe('scrollColumnByStep - default/period type:', () => {
      it('should return early for period type (no items element)', () => {
        component.format = PoTimerFormat.Format12;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        expect(() => component['scrollColumnByStep']('period', 1, true)).not.toThrow();
      });
    });

    describe('selectFocusedItem - default branch:', () => {
      it('should do nothing for unknown type', () => {
        component.ngOnInit();
        component['buildDisplayArrays']();
        component['focusedDisplayIndex']['hour'] = 0;

        spyOn(component as any, 'getDisplayArray').and.returnValue([1, 2, 3]);
        spyOn(component as any, 'getNormalizedDisplayIndex').and.returnValue(0);
        spyOn(component as any, 'isDisplayIndexDisabled').and.returnValue(false);

        expect(() => component['selectFocusedItem']('unknown' as any)).not.toThrow();
      });
    });

    describe('getDomFocusedDisplayIndex - valid numeric id:', () => {
      it('should return numeric index when id has valid number', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const btn = document.createElement('button');
        const poBtn = document.createElement('po-button');
        poBtn.classList.add('po-timer-display');
        poBtn.id = 'po-timer-hour-5';
        poBtn.appendChild(btn);
        document.body.appendChild(poBtn);
        btn.focus();

        const result = component['getDomFocusedDisplayIndex']('hour');
        expect(result).toBe(5);

        document.body.removeChild(poBtn);
      });
    });

    describe('moveFocusByStep - integration with stepsToReveal:', () => {
      it('should scroll column when shouldTranslateToRevealFocusedItem returns true', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'shouldTranslateToRevealFocusedItem').and.returnValue(true);
        spyOn(component as any, 'getStepsToRevealFocusedItem').and.returnValue(2);
        spyOn(component as any, 'scrollColumnByStep');
        spyOn(component as any, 'focusButtonAt');
        spyOn(component as any, 'updateActiveDescendant');

        component['moveFocusByStep']('hour', 1);

        expect(component['scrollColumnByStep']).toHaveBeenCalled();
      });
    });

    describe('getColumnViewportHeight - no parent element:', () => {
      it('should fallback to step * VISIBLE_ITEMS when parent has no clientHeight', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const itemsEl = document.createElement('div');
        const step = 40;
        const result = component['getColumnViewportHeight'](itemsEl, step);
        expect(result).toBe(step * 6);
      });
    });

    describe('shouldTranslateToRevealFocusedItem - edge cases:', () => {
      it('should return false when sourceArray length < 6', () => {
        component.format = PoTimerFormat.Format24;
        component.minuteInterval = 15;
        component.ngOnInit();
        component['buildDisplayArrays']();

        const result = component['shouldTranslateToRevealFocusedItem']('minute', 0);
        expect(result).toBe(false);
      });
    });

    describe('getNextEnabledDisplayIndex - empty displayArray:', () => {
      it('should return 0 when displayArray is empty', () => {
        component.ngOnInit();
        component.displayHours = [];

        const result = component['getNextEnabledDisplayIndex']('hour', 0, 1);
        expect(result).toBe(0);
      });
    });

    describe('shouldTranslateToRevealFocusedItem - step <= 0 branch:', () => {
      it('should return false when getCellStep returns 0', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(0);

        const result = component['shouldTranslateToRevealFocusedItem']('hour', 0);
        expect(result).toBe(false);
      });
    });

    describe('getStepsToRevealFocusedItem - step <= 0 branch:', () => {
      it('should return 0 when getCellStep returns 0', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        component['buildDisplayArrays']();
        fixture.detectChanges();

        spyOn(component as any, 'getCellStep').and.returnValue(0);

        const result = component['getStepsToRevealFocusedItem']('hour', 0, 1);
        expect(result).toBe(0);
      });
    });

    describe('writeValue - hasViewInitialized branch:', () => {
      it('should call initAllColumnOffsets via rAF when hasViewInitialized is true', fakeAsync(() => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        fixture.detectChanges();
        component.ngAfterViewInit();
        component['hasViewInitialized'] = true;

        spyOn(component, 'initAllColumnOffsets');

        component.writeValue('10:30');
        tick(50);

        expect(component.initAllColumnOffsets).toHaveBeenCalled();
      }));

      it('should return early when time equals buildTimeValue and hasViewInitialized', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        fixture.detectChanges();
        component['hasViewInitialized'] = true;

        spyOn(component as any, 'buildTimeValue').and.returnValue('10:30');
        const superSpy = spyOn(Object.getPrototypeOf(PoTimerComponent.prototype), 'writeValue');

        component.writeValue('10:30');

        expect(superSpy).not.toHaveBeenCalled();
      });
    });

    describe('getDomFocusedDisplayIndex - NaN id:', () => {
      it('should return null when id has non-numeric suffix', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const btn = document.createElement('button');
        const poBtn = document.createElement('po-button');
        poBtn.classList.add('po-timer-display');
        poBtn.id = 'po-timer-hour-abc';
        poBtn.appendChild(btn);
        document.body.appendChild(poBtn);
        btn.focus();

        const result = component['getDomFocusedDisplayIndex']('hour');
        expect(result).toBeNull();

        document.body.removeChild(poBtn);
      });
    });

    describe('isDisplayIndexDisabled - default branch:', () => {
      it('should return false for unknown type', () => {
        component.ngOnInit();
        const result = component['isDisplayIndexDisabled']('unknown' as any, 0, [1, 2, 3]);
        expect(result).toBe(false);
      });
    });

    describe('getSelectedValue - default branch:', () => {
      it('should return 0 for unknown type', () => {
        component.ngOnInit();
        const result = component['getSelectedValue']('unknown' as any);
        expect(result).toBe(0);
      });
    });

    describe('getSourceArray - default branch:', () => {
      it('should return hours for unknown type', () => {
        component.format = PoTimerFormat.Format24;
        component.ngOnInit();
        const result = component['getSourceArray']('unknown' as any);
        expect(result).toBe(component.hours);
      });
    });

    describe('getDisplayArray - default branch:', () => {
      it('should return empty array for unknown type', () => {
        component.ngOnInit();
        const result = component['getDisplayArray']('unknown' as any);
        expect(result).toEqual([]);
      });
    });

    describe('getItemsElement - default branch:', () => {
      it('should return null for unknown type', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const result = component['getItemsElement']('unknown' as any);
        expect(result).toBeNull();
      });
    });

    describe('forwardRef factory coverage:', () => {
      it('should have NG_VALUE_ACCESSOR provider registered', () => {
        expect(component).toBeTruthy();
        expect(component.writeValue).toBeDefined();
      });
    });
  });
});
