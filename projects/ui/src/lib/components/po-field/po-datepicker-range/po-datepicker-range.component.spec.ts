import type { Mock } from 'vitest';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PoCalendarModule } from '../../po-calendar/po-calendar.module';
import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoDatepickerRangeBaseComponent } from './po-datepicker-range-base.component';
import { PoDatepickerRangeComponent } from './po-datepicker-range.component';
import { PoDateService } from './../../../services/po-date/po-date.service';
import { PoFieldContainerBottomComponent } from '../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoMask } from './../po-input/po-mask';
import { ElementRef, EventEmitter } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

describe('PoDatepickerRangeComponent:', () => {
  let component: PoDatepickerRangeComponent;
  let fixture: ComponentFixture<PoDatepickerRangeComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoCalendarModule, OverlayModule],
      declarations: [
        PoCleanComponent,
        PoDatepickerRangeComponent,
        PoFieldContainerBottomComponent,
        PoFieldContainerComponent
      ],
      providers: [PoDateService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDatepickerRangeComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoDatepickerRangeBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('autocomplete: should return `off` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });

    it('enableCleaner: should return true if `startDateInputValue` has value, `disabled` is false and `readonly` is false', () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.startDateInput.nativeElement.value = '23/08/2009';
      component.endDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeTruthy();
    });

    it('enableCleaner: should return true if `endDateInputValue` has value, `disabled` is false and `readonly` is false', () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeTruthy();
    });

    it(`enableCleaner: should return false if 'endDateInputValue' and 'startDateInputValue' have no value`, () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`enableCleaner: should return false if 'readonly' is true`, () => {
      component.clean = true;
      component.readonly = true;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`enableCleaner: should return false if 'disabled' is true`, () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = true;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`endDateInputName: should return 'end-date'`, () => {
      expect(component.endDateInputName).toBe('end-date');
    });

    it(`endDateInputValue: should return value of end date input`, () => {
      component.endDateInput.nativeElement.value = '23/08/2009';

      expect(component.endDateInputValue).toBe('23/08/2009');
    });

    it(`getErrorMessage: should return 'errorMessage' if 'hasInvalidClass' is true and 'errorMessage' has value`, () => {
      component.errorMessage = 'Invalid date';

      vi.spyOn(component as any, 'hasInvalidClass').mockReturnValue(true);

      expect(component.getErrorMessage).toBe('Invalid date');
    });

    it(`getErrorMessage: should return a empty string if 'hasInvalidClass' is true and 'errorMessage' have no value`, () => {
      component.errorMessage = '';

      vi.spyOn(component as any, 'hasInvalidClass').mockReturnValue(true);

      expect(component.getErrorMessage).toBe('');
    });

    it(`getErrorMessage: should return a empty string if 'hasInvalidClass' is false and 'errorMessage' has value`, () => {
      component.errorMessage = 'Invalid date';

      vi.spyOn(component as any, 'hasInvalidClass').mockReturnValue(false);

      expect(component.getErrorMessage).toBe('');
    });

    it(`isDateRangeInputUncompleted: should return true if length of 'endDateInputValue' and 'startDateInputValue' is
      less than  10`, () => {
      vi.spyOn(component as any, 'endDateInputValue').mockReturnValue('01/12');
      vi.spyOn(component as any, 'startDateInputValue').mockReturnValue('01');

      expect(component.isDateRangeInputUncompleted).toBeTruthy();
    });

    it(`isDateRangeInputUncompleted: should return false if length of 'endDateInputValue' is 10`, () => {
      vi.spyOn(component as any, 'endDateInputValue').mockReturnValue('01/12/2023');
      vi.spyOn(component as any, 'startDateInputValue').mockReturnValue('01');

      expect(component.isDateRangeInputUncompleted).toBeFalsy();
    });

    it(`isDateRangeInputUncompleted: should return false if length of 'startDateInputValue' is 10`, () => {
      vi.spyOn(component as any, 'endDateInputValue').mockReturnValue('02/12');
      vi.spyOn(component as any, 'startDateInputValue').mockReturnValue('01/12/2023');

      expect(component.isDateRangeInputUncompleted).toBeFalsy();
    });

    it(`isDirtyDateRangeInput: should return false if length of 'endDateInputValue' and 'startDateInputValue' are 0`, () => {
      vi.spyOn(component as any, 'endDateInputValue').mockReturnValue('');
      vi.spyOn(component as any, 'startDateInputValue').mockReturnValue('');

      expect(component.isDirtyDateRangeInput).toBeFalsy();
    });

    it(`startDateInputName: should return 'start-date'`, () => {
      expect(component.startDateInputName).toBe('start-date');
    });

    it(`startDateInputValue: should return value of end date input`, () => {
      component.startDateInput.nativeElement.value = '23/04/2005';

      expect(component.startDateInputValue).toBe('23/04/2005');
    });
  });

  describe('Methods:', () => {
    const poCalendarContentOffset = 8;

    describe('ngAfterViewInit:', () => {
      let inputFocus: any;

      beforeEach(() => {
        inputFocus = vi.spyOn(component as any, 'focus');
      });

      it('should call focus method if autoFocus is true.', () => {
        component.autoFocus = true;

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {}
          }
        } as any;

        Object.defineProperty(component, 'renderer', {
          value: {
            setAttribute: vi.fn()
          } as any
        });

        component.literals = {
          open: 'Open calendar'
        };

        component.ngAfterViewInit();

        expect(component.focus).toHaveBeenCalled();
      });

      it('should not call focus if autoFocus is false', () => {
        component.autoFocus = false;

        (component.focus as Mock).mockClear();

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {}
          }
        } as any;

        Object.defineProperty(component, 'renderer', {
          value: {
            setAttribute: vi.fn()
          } as any
        });

        component.literals = {
          open: 'Open calendar'
        };

        component.ngAfterViewInit();

        expect(component.focus).not.toHaveBeenCalled();
      });

      it('should not throw error when iconCalendar is undefined', () => {
        component.iconCalendar = undefined;

        const fnCall = () => component.ngAfterViewInit();

        expect(fnCall).not.toThrow();
      });

      it('should not call renderer.setAttribute when iconCalendar is undefined', () => {
        component.iconCalendar = undefined;

        const setAttributeSpy = vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(setAttributeSpy).not.toHaveBeenCalled();
      });

      it('should call renderer.setAttribute with aria-label when iconCalendar is defined', () => {
        component.iconCalendar = {
          buttonElement: {
            nativeElement: document.createElement('button')
          }
        } as any;

        component.literals = {
          open: 'Open calendar'
        };

        const setAttributeSpy = vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(setAttributeSpy).toHaveBeenCalledWith(
          component.iconCalendar.buttonElement.nativeElement,
          'aria-label',
          'Open calendar'
        );
      });
    });

    it('ngOnDestroy: should call `removeListeners`.', () => {
      const removeListener = vi.spyOn(component as any, 'removeListeners');

      component.ngOnDestroy();

      expect(removeListener).toHaveBeenCalled();
    });

    it('closeCalendar: should set isCalendarVisible to false and focus iconCalendar when available', fakeAsync(() => {
      component.isCalendarVisible = true;
      component.iconCalendar = { focus: vi.fn() } as any;

      component.closeCalendar();
      tick();

      expect(component.isCalendarVisible).toBe(false);
      expect(component.iconCalendar.focus).toHaveBeenCalled();
    }));

    it('closeCalendar: should set isCalendarVisible to false even when iconCalendar is undefined', fakeAsync(() => {
      component.isCalendarVisible = true;
      component.iconCalendar = undefined;

      component.closeCalendar();
      tick();

      expect(component.isCalendarVisible).toBe(false);
    }));

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        (component as any).label = 'this.label';
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });
    });

    it('ngOnInit: should set `poMaskObject` with `buildMask` return', () => {
      component['poMaskObject'] = undefined;
      const buildMaskReturn = new PoMask(undefined, false);

      vi.spyOn(component as any, 'buildMask').mockReturnValue(buildMaskReturn);

      component.ngOnInit();

      expect(component['poMaskObject']).toEqual(buildMaskReturn);
    });

    it(`ngOnChanges: should set displayAdditionalHelp false when label changes`, () => {
      const changes: any = {
        label: 'new label'
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBe(false);
    });

    it('ngOnChanges: should call `validateModel` if `changes` contain minDate', () => {
      const changes: any = {
        minDate: '2021-08-08'
      };

      const spy = vi.spyOn(component as any, 'validateModel');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it('ngOnChanges: should call `validateModel` if `changes` contain maxDate', () => {
      const changes: any = {
        maxDate: '2021-08-08'
      };

      const spy = vi.spyOn(component as any, 'validateModel');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it(`ngOnChanges: shouldn't call 'validateModel' if 'changes' not contain maxDate ou minDate`, () => {
      const changes = {};

      const spy = vi.spyOn(component as any, 'validateModel');

      component.ngOnChanges(changes);

      expect(spy).not.toHaveBeenCalled();
    });

    it(`ngOnChanges: shouldn't call 'updateScreenByModel' if 'changes' contain locale`, () => {
      const changes: any = {
        locale: 'pt'
      };

      const spy = vi.spyOn(component as any, 'buildMask');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it(`ngOnChanges: shouldn't call 'updateScreenByModel' if 'changes' contain locale and contain 'dateRange'`, () => {
      const changes: any = {
        locale: 'pt'
      };
      component.dateRange = { start: '2023-01-25', end: '2023-02-21' };

      const spyBuildMask = vi.spyOn(component as any, 'buildMask');
      const spyUpdateScreenByModel = vi.spyOn(component as any, 'updateScreenByModel');

      component.ngOnChanges(changes);

      expect(spyBuildMask).toHaveBeenCalled();
      expect(spyUpdateScreenByModel).toHaveBeenCalled();
    });

    it('clear: should call `updateScreenByModel`, `resetDateRangeInputValidation` and `updateModel`', () => {
      vi.spyOn(component as any, 'updateScreenByModel');
      vi.spyOn(component as any, 'resetDateRangeInputValidation');
      vi.spyOn(component as any, 'updateModel');

      const dateRange = { start: '', end: '' };

      component.clear();

      expect(component.updateScreenByModel).toHaveBeenCalledWith(dateRange);
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith(dateRange);
      expect(component['dateRange']).toEqual(dateRange);
      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('');
    });

    describe('onCalendarKeyDown:', () => {
      beforeEach(() => {
        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;
      });

      it('should do nothing when calendar is not visible', () => {
        component.isCalendarVisible = false;

        const event = {
          key: 'Escape',
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(false);
      });

      it('should close calendar on Escape key', () => {
        component.isCalendarVisible = true;

        const event = {
          key: 'Escape',
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.iconCalendar.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(false);
      });

      it('should close calendar on Shift+Tab when focus is on first combo', () => {
        component.isCalendarVisible = true;

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(null)
          }
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.iconCalendar.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(false);
      });

      it('should not close calendar on Shift+Tab when focus is not on first combo', () => {
        component.isCalendarVisible = true;

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(false);

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(true);
      });

      it('should focus first preset on Shift+Tab when it exists', () => {
        component.isCalendarVisible = true;

        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({
              focus: focusSpy
            })
          }
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(null);

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();

        expect(component.isCalendarVisible).toBe(true);

        expect(component.iconCalendar.buttonElement.nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should close calendar on mobile Shift+Tab from first combo', () => {
        component.isCalendarVisible = true;

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(['mobile'] as any);

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.iconCalendar.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(false);
      });
    });

    describe('clearAndFocus', () => {
      it('should call clear method and focus on input element', () => {
        const clearSpy = vi.spyOn(component as any, 'clear');
        const focusSpy = vi.spyOn(component.startDateInput.nativeElement, 'focus');

        component.clearAndFocus();

        expect(clearSpy).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
        expect(Math.min(...vi.mocked(clearSpy).mock.invocationCallOrder)).toBeLessThan(
          Math.min(...vi.mocked(focusSpy).mock.invocationCallOrder)
        );
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        (component as any).label = 'this.label';
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });
    });

    it('eventOnClick: should click when select text and edit model', () => {
      fixture.detectChanges();
      vi.spyOn(component['poMaskObject'] as any, 'click');
      const eventMock = { target: { name: '' } };

      component.eventOnClick(eventMock);

      expect(component['poMaskObject'].click).toHaveBeenCalledWith(eventMock);
    });

    it('focus: should call `focus` of datepicker-range', () => {
      component.startDateInput = {
        nativeElement: {
          focus: () => {}
        }
      };

      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.focus();

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of datepicker-range if `disabled`', () => {
      component.startDateInput = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.focus();

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
    });

    describe('onBlur:', () => {
      let setupTest;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          vi.spyOn(component as any, 'showAdditionalHelp');
        };
      });

      it('onBlur: should call `removeFocusFromDatePickerRangeField` and `updateModelByScreen` with `true`', () => {
        component['onTouchedModel'] = () => {};
        vi.spyOn(component as any, 'removeFocusFromDatePickerRangeField');
        vi.spyOn(component as any, 'updateModelByScreen');
        vi.spyOn(component as any, 'onTouchedModel');

        const eventMock = { target: { name: 'start-date' } };

        component.onBlur(eventMock);

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component['updateModelByScreen']).toHaveBeenCalledWith(true);
        expect(component['removeFocusFromDatePickerRangeField']).toHaveBeenCalled();
      });

      it('onBlur: should call `removeFocusFromDatePickerRangeField` and `updateModelByScreen` with `false`', () => {
        component['onTouchedModel'] = () => {};
        vi.spyOn(component as any, 'removeFocusFromDatePickerRangeField');
        vi.spyOn(component as any, 'updateModelByScreen');
        vi.spyOn(component as any, 'onTouchedModel');

        const eventMock = { target: { name: 'end-date' } };

        component.onBlur(eventMock);

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component['updateModelByScreen']).toHaveBeenCalledWith(false);
        expect(component['removeFocusFromDatePickerRangeField']).toHaveBeenCalled();
      });

      it('onBlur: shouldn´t throw error if onTouchedModel is falsy', () => {
        const fakeEvent = { target: {} };

        component['onTouchedModel'] = null;

        const fnError = () => component.onBlur(fakeEvent);

        expect(fnError).not.toThrow();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        const eventMock = { target: { name: 'start-date' } };

        component.onBlur(eventMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        const eventMock = { target: { name: 'start-date' } };

        component.onBlur(eventMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });
    });

    it('onFocus: should call `applyFocusOnDatePickerRangeField`', () => {
      fixture.detectChanges();
      vi.spyOn(component as any, 'applyFocusOnDatePickerRangeField');
      vi.spyOn(component['poMaskObject'] as any, 'resetPositions');
      const eventMock = { target: { name: '' } };

      component.onFocus(eventMock);
      expect(component['applyFocusOnDatePickerRangeField']).toHaveBeenCalled();
      expect(component['poMaskObject'].resetPositions).toHaveBeenCalledWith(eventMock);
    });

    it('onKeydown: should call `poMaskObject.keydown` if `readonly` is false', () => {
      const eventMock = { target: { name: '' } };
      component.readonly = false;
      fixture.detectChanges();
      vi.spyOn(component['poMaskObject'] as any, 'keydown');

      component.onKeydown(eventMock);

      expect(component['poMaskObject'].keydown).toHaveBeenCalledWith(eventMock);
    });

    it('onKeydown: shouldn`t call `poMaskObject.keydown` if `readonly` is true', () => {
      const eventMock = {};
      fixture.detectChanges();
      component.readonly = true;
      vi.spyOn(component['poMaskObject'] as any, 'keydown');

      component.onKeydown(eventMock);

      expect(component['poMaskObject'].keydown).not.toHaveBeenCalled();
    });

    it('onKeydown: should call `setFocusOnBackspace` and `preventDefault` if `isSetFocusOnBackspace` returns true.', () => {
      const fakeEvent: any = {
        preventDefault: () => {}
      };
      fixture.detectChanges();

      vi.spyOn(component, <any>['isSetFocusOnBackspace']).mockReturnValue(true);
      vi.spyOn(component, <any>['setFocusOnBackspace']);
      vi.spyOn(component['poMaskObject'] as any, 'keydown');
      vi.spyOn(fakeEvent as any, 'preventDefault');

      component.onKeydown(fakeEvent);

      expect(component['setFocusOnBackspace']).toHaveBeenCalled();
      expect(component['poMaskObject'].keydown).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('onKeydown: shouldn`t call `setFocusOnBackspace` if `isSetFocusOnBackspace` returns false.', () => {
      const fakeEvent: any = {};
      fixture.detectChanges();
      vi.spyOn(component, <any>['isSetFocusOnBackspace']).mockReturnValue(false);
      vi.spyOn(component, <any>['setFocusOnBackspace']);
      vi.spyOn(component['poMaskObject'] as any, 'keydown');

      component.onKeydown(fakeEvent);

      expect(component['setFocusOnBackspace']).not.toHaveBeenCalled();
      expect(component['poMaskObject'].keydown).toHaveBeenCalled();
    });

    it('should emit event when field is focused', () => {
      const eventMock = { target: { name: '' } };
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const combinedEvent = { ...fakeEvent, target: { ...fakeEvent.target, ...eventMock.target } };
      component['poMaskObject'] = new PoMask('99/99/9999', true);

      vi.spyOn(component['poMaskObject'] as any, 'keydown');
      vi.spyOn(component.keydown as any, 'emit');

      component.startDateInput = {
        nativeElement: {
          focus: vi.fn()
        }
      };

      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.startDateInput.nativeElement);

      component.onKeydown(combinedEvent);

      expect(component['poMaskObject'].keydown).toHaveBeenCalledWith(combinedEvent);
      expect(component.keydown.emit).toHaveBeenCalledWith(combinedEvent);
    });

    describe('onKeyPress', () => {
      it('should call toggleCalendar when button is clicked', () => {
        vi.spyOn(component as any, 'toggleCalendar');

        component.toggleCalendar();

        expect(component.toggleCalendar).toHaveBeenCalled();
      });

      it('should focus iconClean when Shift+Tab, calendar hidden and enableCleaner true', () => {
        const focusSpy = vi.fn();

        vi.spyOn(component, 'enableCleaner', 'get').mockReturnValue(true);

        component.isCalendarVisible = false;

        component.iconClean = {
          nativeElement: { focus: focusSpy }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn()
        };

        component.onKeyPress(event);

        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should call focus when Shift+Tab and calendar hidden without cleaner', () => {
        vi.spyOn(component, 'enableCleaner', 'get').mockReturnValue(false);
        vi.spyOn(component as any, 'focus');

        component.isCalendarVisible = false;

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        component.onKeyPress(event);

        expect(component.focus).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should focus first combo when Tab and calendar visible', () => {
        component.isCalendarVisible = true;

        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({
              focus: focusSpy
            })
          }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: false,
          preventDefault: vi.fn()
        };

        component.onKeyPress(event);

        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus first combo when Tab and calendar visible and no preset', () => {
        component.isCalendarVisible = true;

        const focusSpy = vi.fn();

        const querySelectorSpy = vi.fn();

        querySelectorSpy.mockReturnValueOnce(null).mockReturnValueOnce({ focus: focusSpy });

        component.calendarPicker = {
          nativeElement: {
            querySelector: querySelectorSpy
          }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: false,
          preventDefault: vi.fn()
        };

        component.onKeyPress(event);

        expect(querySelectorSpy).toHaveBeenCalledTimes(2);
        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus first combo on mobile when Tab and calendar visible', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(['mobile'] as any);

        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: false,
          preventDefault: vi.fn()
        };

        component.onKeyPress(event);

        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('onKeydownDatepickerRange', () => {
      it('should return immediately when readonly is true', () => {
        component.readonly = true;

        component['poMaskObject'] = {
          keydown: vi.fn()
        } as any;

        component.onKeydownDatepickerRange({});

        expect(component['poMaskObject'].keydown).not.toHaveBeenCalled();
      });

      it('should close calendar on Escape when visible', () => {
        component.readonly = false;
        component.isCalendarVisible = true;

        const event: any = {
          key: 'Escape',
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        component.onKeydownDatepickerRange(event);

        expect(component.isCalendarVisible).toBe(false);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should close calendar on Shift+Tab from startDateInput when visible', () => {
        component.readonly = false;
        component.isCalendarVisible = true;

        const startInputMock = document.createElement('input');

        component.startDateInput = {
          nativeElement: startInputMock
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          target: startInputMock
        };

        component.onKeydownDatepickerRange(event);

        expect(component.isCalendarVisible).toBe(false);
      });

      it('should prevent default and focus calendar button on Tab from iconClean', () => {
        component.readonly = false;

        const iconCleanMock = document.createElement('button');
        const focusSpy = vi.fn();

        component.iconClean = {
          nativeElement: iconCleanMock
        };

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              focus: focusSpy
            }
          }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: false,
          target: iconCleanMock,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        component.onKeydownDatepickerRange(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
      });
    });

    it('onKeyup: shouldn`t call `setFocus`, `updateModelWhenComplete` and `poMaskObject.keyup` if `readonly` is true', () => {
      const eventMock = {};
      component.readonly = true;
      fixture.detectChanges();

      vi.spyOn(component['poMaskObject'] as any, 'keyup');
      vi.spyOn(component as any, 'setFocus');
      vi.spyOn(component as any, 'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['poMaskObject'].keyup).not.toHaveBeenCalled();
      expect(component['setFocus']).not.toHaveBeenCalled();
      expect(component['updateModelWhenComplete']).not.toHaveBeenCalled();
    });

    it('onKeyup: should call `setFocus`, `updateModelWhenComplete` and `poMaskObject.keyup` if `readonly` is false', () => {
      const eventMock = { key: '1', target: { name: component.startDateInputName } };
      const isStartDateTargetEvent = true;
      component.readonly = false;

      fixture.detectChanges();

      vi.spyOn(component['poMaskObject'] as any, 'keyup');
      vi.spyOn(component as any, 'setFocus');
      vi.spyOn(component as any, 'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['poMaskObject'].keyup).toHaveBeenCalledWith(eventMock);
      expect(component['setFocus']).toHaveBeenCalledWith(eventMock);
      expect(component['updateModelWhenComplete']).toHaveBeenCalledWith(
        isStartDateTargetEvent,
        component.startDateInputValue,
        component.endDateInputValue
      );
    });

    it('onKeyup: should call `updateModelWhenComplete` with `false` if `isStartDateTargetEvent` is false', () => {
      const eventMock = { key: '1', target: { name: component.endDateInputName } };
      const isStartDateTargetEvent = false;
      component.readonly = false;

      fixture.detectChanges();

      vi.spyOn(component['poMaskObject'] as any, 'keyup');
      vi.spyOn(component as any, 'setFocus');
      vi.spyOn(component as any, 'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['updateModelWhenComplete']).toHaveBeenCalledWith(
        isStartDateTargetEvent,
        component.startDateInputValue,
        component.endDateInputValue
      );
    });

    it('updateScreenByModel: should update date range input with value param if its valid', () => {
      component.startDateInput.nativeElement.value = '';
      component.endDateInput.nativeElement.value = '';

      const dateRangeModel = { start: '2018-03-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('12/03/2018');
      expect(component.endDateInputValue).toBe('15/03/2018');
    });

    it('updateScreenByModel: should update date range input with empty string if start date is greater than end date', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '15/03/2018';

      const dateRangeModel = { start: '2018-04-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('');
    });

    it('updateScreenByModel: should update date range input with empty start date if start date is invalid', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '26/07/2019';

      const dateRangeModel = { start: '20-04-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('15/03/2018');
    });

    it('updateScreenByModel: should update date range input with empty end date if end date is invalid', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '26/07/2019';

      const dateRangeModel = { start: '2018-04-12', end: '2018-88-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('12/04/2018');
      expect(component.endDateInputValue).toBe('');
    });

    it('updateScreenByModel: should call `poDateService.isDateRangeValid`, `formatModelToScreen`, `this.dateFormatFailed` and `detectChanges`', () => {
      vi.spyOn(component as any, 'dateFormatFailed').mockReturnValue(false);
      vi.spyOn(component['poDateService'] as any, 'isDateRangeValid').mockReturnValue(true);
      vi.spyOn(component as any, 'formatModelToScreen');
      const spyDetectChanges = vi.spyOn(component['changeDetector'] as any, 'detectChanges');

      const dateRangeModel = { start: '2018-04-12', end: '2018-08-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component['dateFormatFailed']).toHaveBeenCalledWith(dateRangeModel.start);
      expect(component['dateFormatFailed']).toHaveBeenCalledWith(dateRangeModel.end);
      expect(component['formatModelToScreen']).toHaveBeenCalledWith(dateRangeModel.start);
      expect(component['formatModelToScreen']).toHaveBeenCalledWith(dateRangeModel.end);
      expect(component['poDateService'].isDateRangeValid).toHaveBeenCalledWith(
        dateRangeModel.end,
        dateRangeModel.start
      );
      expect(spyDetectChanges).toHaveBeenCalled();
    });

    it(`applyFocusOnDatePickerRangeField: should call 'dateRangeField.nativeElement.classList.add' with
      'po-datepicker-range-field-focused'`, () => {
      vi.spyOn(component.dateRangeField.nativeElement.classList, 'add');

      component['applyFocusOnDatePickerRangeField']();

      expect(component.dateRangeField.nativeElement.classList.add).toHaveBeenCalledWith(
        'po-datepicker-range-field-focused'
      );
    });

    it('buildMask: should return a poMask object', () => {
      const mask = '99/99/9999';
      const poMaskObject = new PoMask(mask, true);
      component['format'] = 'dd/mm/yyyy';

      expect(component['buildMask']()).toEqual(poMaskObject);
    });

    it('formatDate: should convert date to `dd/mm/yyyy` format', () => {
      const format = 'dd/mm/yyyy';
      const date = ['12', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('12/03/2018');
    });

    it('formatDate: should convert date to the `yyyy-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-12');
    });

    it('formatDate: should convert iso date to `yyyy-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-12');
    });

    it('formatDate: should convert date to `-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', '3', undefined];

      expect(component['formatDate'](format, ...date)).toBe('-03-12');
    });

    it('formatDate: should convert date to `yyyy--dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', undefined, '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-0-12');
    });

    it('formatDate: should convert date to `yyyy-mm-` format', () => {
      const format = 'yyyy-mm-dd';
      const date = [undefined, '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-0');
    });

    it('formatDate: should convert date to `yyyy-mm-` with default format value', () => {
      component['format'] = 'yyyy-mm-dd';
      const date = [undefined, '3', '2018'];

      expect(component['formatDate'](undefined, ...date)).toBe('2018-03-0');
    });

    it('formatScreenToModel: should return empty string if value is undefined', () => {
      const value = undefined;

      expect(component['formatScreenToModel'](value)).toBe('');
    });

    it('formatScreenToModel: should call `formatDate` and return its value', () => {
      const value = '12/03/2018';
      const dateFormatted = '2018-03-12';

      vi.spyOn(component as any, 'formatDate').mockReturnValue(dateFormatted);

      expect(component['formatScreenToModel'](value)).toBe(dateFormatted);
      expect(component['formatDate']).toHaveBeenCalledWith('yyyy-mm-dd', '12', '03', '2018');
    });

    it('formatModelToScreen: should call `formatDate` and return its value', () => {
      const value = '2018-03-12';
      const dateFormatted = '12/03/2018';

      vi.spyOn(component as any, 'formatDate').mockReturnValue(dateFormatted);

      expect(component['formatModelToScreen'](value)).toBe(dateFormatted);
      expect(component['formatDate']).toHaveBeenCalledWith(component['format'], '12', '03', '2018');
    });

    it('formatModelToScreen: should return empty string if value is undefined', () => {
      const value = undefined;

      expect(component['formatModelToScreen'](value)).toBe('');
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with true and 'dateRangeModel' with
      'getValidatedModel' return if 'isDateRangeInputFormatValid' and 'isStartDateRangeInputValid' are true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-22';
      const valitedModel = { start: startDate, end: endDate };
      const isStartDateTargetEvent = false;

      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = true;

      vi.spyOn(component as any, 'getValidatedModel').mockReturnValue(valitedModel);

      const result = component['getDateRangeFormatValidation'](startDate, endDate, isStartDateTargetEvent);

      expect(result.isValid).toBeTruthy();
      expect(result.dateRangeModel).toEqual(valitedModel);
      expect(component['getValidatedModel']).toHaveBeenCalledWith(startDate, endDate, isStartDateTargetEvent);
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with false if 'isDateRangeInputFormatValid' is false and
      'isStartDateRangeInputValid' is true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-85-22';
      const valitedModel = { start: startDate, end: endDate };

      component['isDateRangeInputFormatValid'] = false;
      component['isStartDateRangeInputValid'] = true;

      vi.spyOn(component as any, 'getValidatedModel').mockReturnValue(valitedModel);
      vi.spyOn(component as any, 'setDateRangeInputValidation');

      const result = component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(result.isValid).toBeFalsy();
      expect(result.dateRangeModel).toEqual(valitedModel);
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with false if 'isDateRangeInputFormatValid' is true and
      'isStartDateRangeInputValid' is false`, () => {
      const startDate = '2018-05-29';
      const endDate = '2018-05-22';
      const valitedModel = { start: startDate, end: endDate };

      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = false;

      vi.spyOn(component as any, 'getValidatedModel').mockReturnValue(valitedModel);
      vi.spyOn(component as any, 'setDateRangeInputValidation');

      const result = component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(result.isValid).toBeFalsy();
      expect(result.dateRangeModel).toEqual(valitedModel);
    });

    it(`getDateRangeFormatValidation: should call 'setDateRangeInputValidation' with 'startDate' and 'endDate'`, () => {
      const startDate = '2018-05-29';
      const endDate = '2018-05-22';

      vi.spyOn(component as any, 'setDateRangeInputValidation');

      component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(component['setDateRangeInputValidation']).toHaveBeenCalledWith(startDate, endDate);
    });

    it('getValidatedModel: should return startDate and endDate if they are valid', () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: endDate });
    });

    it('getValidatedModel: should return startDate and empty endDate if end date is invalid format', () => {
      const startDate = '2018-05-20';
      const endDate = '2018-78-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: '' });
    });

    it(`getValidatedModel: should return startDate and empty endDate if start date is greater than end date and
      'isStartDateTargetEvent' is false`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-10';
      const isStartDateTargetEvent = false;
      component['isStartDateRangeInputValid'] = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: '' });
    });

    it('getValidatedModel: should return empty startDate and endDate if start date is invalid format', () => {
      const startDate = '2018-78-90';
      const endDate = '2018-08-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: '', end: endDate });
    });

    it(`getValidatedModel: should return empty startDate and endDate if start date is greater than end date and
      'isStartDateTargetEvent' is true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-10';
      const isStartDateTargetEvent = true;
      component['isStartDateRangeInputValid'] = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: '', end: endDate });
    });

    it('hasInvalidClass: should return true if `poDatepickerRangeElement` contains `ng-invalid` and `ng-dirty`', () => {
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');

      expect(component['hasInvalidClass']()).toBeTruthy();
    });

    it('hasInvalidClass: should return false if `poDatepickerRangeElement` does not contain `ng-invalid` or `ng-dirty`', () => {
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();

      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();

      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();
    });

    it(`isEqualBeforeValue: should return true if 'isDateRangeInputFormatValid' is true and date range is equal before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2018-08-15';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeTruthy();
    });

    it(`isEqualBeforeValue: should return false if 'isDateRangeInputFormatValid' is false and date range is equal before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2018-08-15';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeFalsy();
    });

    it(`isEqualBeforeValue: should return false if 'isDateRangeInputFormatValid' is true and date range is diffent before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2019-11-15';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeFalsy();
    });

    it(`removeFocusFromDatePickerRangeField: should call 'dateRangeField.nativeElement.classList.remove' with
      'po-datepicker-range-field-focused'`, () => {
      vi.spyOn(component.dateRangeField.nativeElement.classList, 'remove');

      component['removeFocusFromDatePickerRangeField']();

      expect(component.dateRangeField.nativeElement.classList.remove).toHaveBeenCalledWith(
        'po-datepicker-range-field-focused'
      );
    });

    it('resetDateRangeInputValidation: should set `isStartDateRangeInputValid` and `isDateRangeInputFormatValid` to true', () => {
      component['isDateRangeInputFormatValid'] = false;
      component['isStartDateRangeInputValid'] = false;

      component['resetDateRangeInputValidation']();

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
      expect(component['isDateRangeInputFormatValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with false if start date is greater than end date', () => {
      const startDate = '2018-12-24';
      const endDate = '2018-12-10';

      component['isStartDateRangeInputValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with true if start date and end date are equal', () => {
      const startDate = '2018-12-24';
      const endDate = '2018-12-24';

      component['isStartDateRangeInputValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with true if start date is less than end date', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-12-24';

      component['isStartDateRangeInputValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date and end date are valid', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-12-24';

      component['isDateRangeInputFormatValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date is invalid', () => {
      const startDate = '2018-99-28';
      const endDate = '2018-12-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if end date is invalid', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-78-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date and end date are invalid', () => {
      const startDate = '2018-00-00';
      const endDate = '2018-78-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setFocus: should call `setFocusOnArrowLeft` with `keyCode` and `inputName`', () => {
      const keyCode = 1;
      const inputName = component.endDateInputName;
      const inputElement = component.endDateInput.nativeElement;
      const eventMock = { keyCode, target: inputElement };
      fixture.detectChanges();
      vi.spyOn(component as any, 'setFocusOnArrowLeft');
      vi.spyOn(component as any, 'setFocusOnArrowRight');
      vi.spyOn(component as any, 'setFocusOnStartDateCompleted');

      component['setFocus'](eventMock);
      expect(component['setFocusOnArrowLeft']).toHaveBeenCalledWith(keyCode, inputName);
      expect(component['setFocusOnArrowRight']).toHaveBeenCalledWith(keyCode, inputName, inputElement);
      expect(component['setFocusOnStartDateCompleted']).toHaveBeenCalledWith(keyCode, inputName);
    });

    it('updateModelByScreen: should call `updateModel` and `onChange.emit` with date range if its valid', () => {
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      const dateRange = { start: '2018-06-12', end: '2018-08-15' };
      const isStartDateTargetEvent = false;

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component.onChange as any, 'emit');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['updateModel']).toHaveBeenCalledWith(dateRange);
      expect(component['dateRange']).toEqual(dateRange);
      expect(component.onChange.emit).toHaveBeenCalledWith(dateRange);
    });

    it(`updateModelByScreen: should call 'validateModel' and not call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is true and date range is equal before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      vi.spyOn(component as any, 'getDateRangeFormatValidation');
      vi.spyOn(component as any, 'resetDateRangeInputValidation');
      vi.spyOn(component as any, 'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).not.toHaveBeenCalled();

      expect(component['validateModel']).toHaveBeenCalledWith(component['dateRange']);
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
    });

    it(`updateModelByScreen: should call 'updateModel' and not call 'getDateRangeFormatValidation' and 'isEqualBeforeValue'
      if 'isDateRangeInputUncompleted' and 'isDirtyDateRangeInput' are true`, () => {
      const isStartDateTargetEvent = false;
      component['dateRange'] = { start: '', end: '' };

      vi.spyOn(component as any, 'isDirtyDateRangeInput').mockReturnValue(true);
      vi.spyOn(component as any, 'isDateRangeInputUncompleted').mockReturnValue(true);

      vi.spyOn(component as any, 'getDateRangeFormatValidation');
      vi.spyOn(component as any, 'isEqualBeforeValue');
      vi.spyOn(component as any, 'updateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).not.toHaveBeenCalled();
      expect(component['isEqualBeforeValue']).not.toHaveBeenCalled();

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
    });

    it(`updateModelByScreen: shouldn't call 'validateModel' and call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is false and date range is equal before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      vi.spyOn(component as any, 'getDateRangeFormatValidation').mockReturnValue({
        isValid: false,
        dateRangeModel: {}
      });
      vi.spyOn(component as any, 'resetDateRangeInputValidation');
      vi.spyOn(component as any, 'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();

      expect(component['validateModel']).not.toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).not.toHaveBeenCalled();
    });

    it(`updateModelByScreen: shouldn't call 'validateModel' and call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is true and date range is different before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '', end: '' };

      vi.spyOn(component as any, 'getDateRangeFormatValidation').mockReturnValue({
        isValid: false,
        dateRangeModel: {}
      });
      vi.spyOn(component as any, 'resetDateRangeInputValidation');
      vi.spyOn(component as any, 'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();

      expect(component['validateModel']).not.toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).not.toHaveBeenCalled();
    });

    it('updateModelByScreen: should call `updateModel` and not call `onChange.emit` with date range if its invalid', () => {
      component.startDateInput.nativeElement.value = '12/88/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      const isStartDateTargetEvent = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component.onChange as any, 'emit');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: component['dateRange'].end });
      expect(component.onChange.emit).not.toHaveBeenCalled();
    });

    it('updateModelWhenComplete: should call `resetDateRangeInputValidation` and `validateModel` when `isEqualBeforeValue` returns true', () => {
      const isStartDateTargetEvent = true;
      component.startDateInput.nativeElement.value = '15/08/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-08-15', end: '2018-08-15' };

      vi.spyOn(component as any, 'getDateRangeFormatValidation').mockReturnValue({
        isValid: false,
        dateRangeModel: {}
      });
      vi.spyOn(component as any, 'resetDateRangeInputValidation');
      vi.spyOn(component as any, 'validateModel');
      vi.spyOn(component as any, 'isEqualBeforeValue').mockReturnValue(true);

      component['updateModelWhenComplete'](
        isStartDateTargetEvent,
        component.startDateInputValue,
        component.endDateInputValue
      );

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();
      expect(component['isEqualBeforeValue']).toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('getKeyCode: should return the typed key.', () => {
      const fakeEvent: any = { keyCode: 7 };
      expect(PoDatepickerRangeComponent.getKeyCode(fakeEvent)).toBe(7);
    });

    it('getKeyCode: should return the typed which.', () => {
      const fakeEvent: any = { which: 7 };
      expect(PoDatepickerRangeComponent.getKeyCode(fakeEvent)).toBe(7);
    });

    it('getTargetElement: should return the event target.', () => {
      const fakeEvent: any = { target: { name: 'start-date' } };
      expect(PoDatepickerRangeComponent.getTargetElement(fakeEvent)).toEqual({ name: 'start-date' });
    });

    it('getTargetElement: should return the event srcElement.', () => {
      const fakeEvent: any = { srcElement: { name: 'end-date' } };
      expect(PoDatepickerRangeComponent.getTargetElement(fakeEvent)).toEqual({ name: 'end-date' });
    });

    it('isValidKey: should return true if is numeric key.', () => {
      for (let key = 48; key < 58; key++) {
        expect(PoDatepickerRangeComponent.isValidKey(key)).toBe(true);
      }

      for (let key = 96; key < 106; key++) {
        expect(PoDatepickerRangeComponent.isValidKey(key)).toBe(true);
      }
    });

    it('isValidKey: should return false if isn`t numeric key.', () => {
      expect(PoDatepickerRangeComponent.isValidKey(8)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(16)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(24)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(47)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(58)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(95)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(106)).toBe(false);
    });

    it('setFocusAndPosition: should call `focusOnElement`.', fakeAsync(() => {
      const elementPosition = 0;
      fixture.detectChanges();
      const inputStart = component.startDateInput;
      vi.spyOn(component as any, 'focusOnElement');
      vi.spyOn(inputStart.nativeElement as any, 'setSelectionRange');

      component['setFocusAndPosition'](elementPosition, inputStart, elementPosition);

      tick(10);

      expect(component['focusOnElement']).toHaveBeenCalledWith(inputStart);
      expect(component['poMaskObject'].initialPosition).toBe(elementPosition);
      expect(component['poMaskObject'].finalPosition).toBe(elementPosition);
      expect(inputStart.nativeElement.setSelectionRange).toHaveBeenCalledWith(elementPosition, elementPosition);
    }));

    it('focusOnElement: should call `focus`.', fakeAsync(() => {
      const fakeElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      vi.spyOn(fakeElement.nativeElement as any, 'focus');

      component['focusOnElement'](fakeElement);

      tick(10);

      expect(fakeElement.nativeElement.focus).toHaveBeenCalled();
    }));

    describe('setFocusOnArrowLeft:', () => {
      let arrowLeftkeyCode;
      let inputEndDateName;

      beforeEach(() => {
        arrowLeftkeyCode = 37;
        inputEndDateName = component.endDateInputName;
      });

      it('should call `setFocusAndPosition` if input name is `end date` and key code is `arrow left`.', () => {
        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t `end date`.', () => {
        const inputStartDateName = component.startDateInputName;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t at start of input.', () => {
        fixture.detectChanges();
        component.endDateInput.nativeElement.value = '19/12/2';
        component.endDateInput.nativeElement.focus();

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](keyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('setFocusOnArrowRight:', () => {
      let arrowRightkeyCode;
      let inputStartDateName;
      let startDateElement;

      beforeEach(() => {
        arrowRightkeyCode = 39;
        inputStartDateName = component.startDateInputName;
        startDateElement = component.startDateInput.nativeElement;
      });

      it('should call `setFocusAndPosition` if input name is `start date` and key code is `arrow left`.', () => {
        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t start date.', () => {
        const inputEndDateName = component.endDateInputName;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputEndDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t at start of input.', () => {
        fixture.detectChanges();
        startDateElement.value = '19/12/2';
        startDateElement.focus();
        startDateElement.selectionEnd = 0;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowRight'](keyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('setFocusOnStartDateCompleted:', () => {
      let inputStartDateName;
      let digit7keyCode;
      let startDateElement;

      beforeEach(() => {
        inputStartDateName = component.startDateInputName;
        digit7keyCode = 56;
        startDateElement = component.startDateInput.nativeElement;
      });

      it('should call `setFocusAndPosition` if input name is `start date` and key code is `56`.', () => {
        fixture.detectChanges();
        startDateElement.value = '19/12/2018';
        startDateElement.focus();
        startDateElement.selectionStart = 10;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnStartDateCompleted'](digit7keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t start date.', () => {
        const inputEndDateName = component.endDateInputName;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](digit7keyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t in the last position.', () => {
        fixture.detectChanges();
        startDateElement.value = '19/12/201';
        startDateElement.focus();
        startDateElement.selectionStart = 9;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](digit7keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        vi.spyOn(component as any, 'setFocusAndPosition');
        component['setFocusOnArrowLeft'](keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('isSetFocusOnBackspace:', () => {
      let fakeEvent;
      let endDateElement;

      beforeEach(() => {
        endDateElement = component.endDateInput.nativeElement;

        fakeEvent = {
          keyCode: 8,
          target: { name: 'end-date' }
        };
      });

      it('should return `true` if input name is end date, cursor is at start of input and key code is backspace.', () => {
        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(true);
      });

      it('should return `false` if input name isn`t end date.', () => {
        fakeEvent.target = 'start-date';

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if cursor isn`t at start of input.', () => {
        fixture.detectChanges();
        endDateElement.value = '19/1';
        endDateElement.focus();
        endDateElement.selectionStart = 3;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if end date input is selected.', () => {
        fixture.detectChanges();
        endDateElement.value = '20/12/2018';
        endDateElement.focus();
        endDateElement.selectionStart = 3;
        endDateElement.selectionEnd = 5;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if key code isn`t arrow left.', () => {
        fakeEvent.keyCode = 32;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });
    });

    it('setFocusOnBackspace: should call `setFocusAndPosition`.', () => {
      const inputPosition = 0;
      vi.spyOn(component as any, 'setFocusAndPosition');
      component['setFocusOnBackspace']();

      expect(component['setFocusAndPosition']).toHaveBeenCalledWith(
        inputPosition,
        component.startDateInput,
        inputPosition
      );
    });

    describe('isFocusOnFirstCombo', () => {
      it('should return true when first combo is the active element', () => {
        const fakeElement = {} as Element;

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeElement)
          }
        } as any;

        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(fakeElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBe(true);
      });

      it('should return false when first combo is not the active element', () => {
        const fakeElement = {} as Element;
        const anotherElement = {} as Element;

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeElement)
          }
        } as any;

        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(anotherElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBe(false);
      });
    });

    it('verifyFormattedDates: should startDateFormatted and endDateFormatted is true', () => {
      const startDateFormatted = '2021-02-22';
      const endDateFormatted = '2021-03-01';
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted is true and endDateFormatted is false', () => {
      const startDateFormatted = undefined;
      const endDateFormatted = '2021-03-01';
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted is true and endDateFormatted is false', () => {
      const startDateFormatted = '2021-02-22';
      const endDateFormatted = undefined;
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted and endDateFormatted is false', () => {
      const startDateFormatted = undefined;
      const endDateFormatted = undefined;
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeFalsy();
    });

    it('hasAttrCalendar: should return falsy if element is null', () => {
      expect(component['hasAttrCalendar'](null)).toBeFalsy();
    });

    it('hasAttrCalendar: should return true if element contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => 'attr-calendar',
        parentElement: {
          hasAttribute: () => {}
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return true if parent element contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => 'attr-calendar'
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return false if element and parent element not contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => {}
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeFalsy();
    });

    it('initializeListeners: should initialize listeners and call `wasClickedOnPicker` and `addEventListener`.', () => {
      const wasClickedOnPicker = vi.spyOn(component as any, 'wasClickedOnPicker');
      const addEventListener = vi.spyOn(window as any, 'addEventListener');
      const listen = vi
        .spyOn(component['renderer'], 'listen')
        .mockImplementation((target: any, eventName: any, callback: any) => callback({}));

      component['initializeListeners']();

      expect(wasClickedOnPicker).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it('onScroll: should call `controlPosition.adjustPosition()`', () => {
      component.isCalendarVisible = true;
      vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
    });

    it('onScroll: should not call `controlPosition.adjustPosition()` if `isCalendarVisible` is falsy', () => {
      component.isCalendarVisible = false;
      vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).not.toHaveBeenCalled();
    });

    it('setCalendarPosition: should return early when verifyMobile is true', () => {
      component.isCalendarVisible = true;

      vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true);

      const rafSpy = vi.spyOn(window as any, 'requestAnimationFrame');

      (component as any).controlPosition = {
        setElements: vi.fn(),
        adjustPosition: vi.fn()
      };

      component.setCalendarPosition();

      expect(rafSpy).not.toHaveBeenCalled();
      expect((component as any).controlPosition.setElements).not.toHaveBeenCalled();
      expect((component as any).controlPosition.adjustPosition).not.toHaveBeenCalled();
    });

    it(`setCalendarPosition: should call controlPosition methods`, () => {
      component.isCalendarVisible = true;

      vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });

      component.calendarPicker = {
        nativeElement: document.createElement('div')
      } as any;

      component.dateRangeField = new ElementRef(document.createElement('div'));

      (component as any).controlPosition = {
        setElements: vi.fn(),
        adjustPosition: vi.fn()
      };

      vi.spyOn(component.calendarPicker.nativeElement, 'querySelector').mockReturnValue(document.createElement('div'));

      component.setCalendarPosition();

      expect((component as any).controlPosition.setElements).toHaveBeenCalled();
      expect((component as any).controlPosition.adjustPosition).toHaveBeenCalled();
    });

    it('setCalendarPosition: should use nativeElement scroll when .po-calendar is not found', () => {
      component.isCalendarVisible = true;

      vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });

      const nativeElementMock = document.createElement('div');

      Object.defineProperty(nativeElementMock, 'scrollHeight', { value: 300, configurable: true });
      Object.defineProperty(nativeElementMock, 'scrollWidth', { value: 500, configurable: true });

      component.calendarPicker = {
        nativeElement: nativeElementMock
      } as any;

      component.dateRangeField = new ElementRef(document.createElement('div'));

      (component as any).controlPosition = {
        setElements: vi.fn(),
        adjustPosition: vi.fn()
      };

      vi.spyOn(nativeElementMock as any, 'querySelector').mockReturnValue(null);

      component.setCalendarPosition();

      expect(nativeElementMock.style.height).toBe('300px');
      expect(nativeElementMock.style.width).toBe('500px');

      expect((component as any).controlPosition.setElements).toHaveBeenCalled();
      expect((component as any).controlPosition.adjustPosition).toHaveBeenCalled();
    });

    describe('wasClickedOnPicker:', () => {
      let fakeTarget: HTMLElement;
      let event: Event;

      beforeEach(() => {
        fakeTarget = document.createElement('div');

        event = {
          target: fakeTarget
        } as unknown as Event;

        component.calendarPicker = {
          nativeElement: {
            contains: () => false
          }
        } as any;

        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              contains: () => false
            }
          }
        } as any;

        vi.spyOn(component['cd'] as any, 'markForCheck');
      });

      it('shouldn`t call calendarPickerElement.contains if isCalendarVisible is false', () => {
        component.isCalendarVisible = false;

        const spyCalendarPickerContains = vi.spyOn(component.calendarPicker.nativeElement, 'contains');

        component['wasClickedOnPicker'](event);

        expect(spyCalendarPickerContains).not.toHaveBeenCalled();
      });

      it('should not set isCalendarVisible with false if calendarPicker contains event.target', () => {
        component.isCalendarVisible = true;

        const spyCalendarPickerContains = vi
          .spyOn(component.calendarPicker.nativeElement, 'contains')
          .mockReturnValue(true);

        const spyIconCalendarContains = vi
          .spyOn(component.iconCalendar.buttonElement.nativeElement, 'contains')
          .mockReturnValue(false);

        component['wasClickedOnPicker'](event);

        expect(spyCalendarPickerContains).toHaveBeenCalled();
        expect(spyIconCalendarContains).not.toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(true);
      });

      it('should not set isCalendarVisible with false if iconCalendar contains event.target', () => {
        component.isCalendarVisible = true;

        const spyCalendarPickerContains = vi
          .spyOn(component.calendarPicker.nativeElement, 'contains')
          .mockReturnValue(false);

        const spyIconCalendarContains = vi
          .spyOn(component.iconCalendar.buttonElement.nativeElement, 'contains')
          .mockReturnValue(true);

        component['wasClickedOnPicker'](event);

        expect(spyCalendarPickerContains).toHaveBeenCalled();
        expect(spyIconCalendarContains).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(true);
      });

      it('should not set isCalendarVisible with false if event.target hasAttrCalendar', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component.calendarPicker.nativeElement, 'contains').mockReturnValue(false);

        vi.spyOn(component.iconCalendar.buttonElement.nativeElement, 'contains').mockReturnValue(false);

        const spyHasAttrCalendar = vi.spyOn(component as any, 'hasAttrCalendar').mockReturnValue(true);

        component['wasClickedOnPicker'](event);

        expect(spyHasAttrCalendar).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(true);
      });

      it('should set isCalendarVisible with false if calendarPickerElement and iconElement do not contain event.target', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component.calendarPicker.nativeElement, 'contains').mockReturnValue(false);

        vi.spyOn(component.iconCalendar.buttonElement.nativeElement, 'contains').mockReturnValue(false);

        vi.spyOn(component as any, 'hasAttrCalendar').mockReturnValue(false);

        component['wasClickedOnPicker'](event);

        expect(component.isCalendarVisible).toBe(false);
      });
    });

    it('removeListeners: should remove click, resize and scroll listeners', () => {
      component['clickListener'] = () => {};
      component['eventResizeListener'] = () => {};

      vi.spyOn(component as any, 'clickListener');
      vi.spyOn(component as any, 'eventResizeListener');
      vi.spyOn(window as any, 'removeEventListener');

      component['removeListeners']();

      expect(component['clickListener']).toHaveBeenCalled();
      expect(component['eventResizeListener']).toHaveBeenCalled();
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: vi.fn(),
          closeHelperPopover: vi.fn(),
          helperIsVisible: vi.fn().mockReturnValue(false)
        };
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBe(false);
        expect(component.displayAdditionalHelp).toBe(false);
      });
    });

    it('toggleCalendar: should not call initializeListeners if component.disabled is true', () => {
      component.disabled = true;

      vi.spyOn(component as any, 'removeListeners');
      vi.spyOn(component as any, 'initializeListeners');

      component['toggleCalendar']();

      expect(component['removeListeners']).not.toHaveBeenCalled();
      expect(component['initializeListeners']).not.toHaveBeenCalled();
    });

    it('toggleCalendar: should not call initializeListeners if component.readonly is true', () => {
      component.readonly = true;

      vi.spyOn(component as any, 'removeListeners');
      vi.spyOn(component as any, 'initializeListeners');

      component['toggleCalendar']();

      expect(component['removeListeners']).not.toHaveBeenCalled();
      expect(component['initializeListeners']).not.toHaveBeenCalled();
    });

    it('toggleCalendar: should call initializeListeners and setCalendarPosition if component.isCalendarVisible is falsy', () => {
      component.readonly = false;
      component.disabled = false;

      vi.spyOn(component as any, 'setCalendarPosition');
      vi.spyOn(component as any, 'initializeListeners');

      component['toggleCalendar']();

      expect(component['setCalendarPosition']).toHaveBeenCalled();
      expect(component['initializeListeners']).toHaveBeenCalled();
    });

    it('toggleCalendar: should call removeListeners if component.isCalendarVisible is truthy', () => {
      component.isCalendarVisible = true;
      component.readonly = false;
      component.disabled = false;

      vi.spyOn(component as any, 'removeListeners');

      component['toggleCalendar']();

      expect(component['removeListeners']).toHaveBeenCalled();
    });

    it(`onCalendarChange: should call updateModelByScreen with true, start and empty value if
      start param is truthy and end param is falsy`, fakeAsync(() => {
      component.isCalendarVisible = true;

      const start = new Date(10, 10, 2021);
      const end = null;

      vi.spyOn(component as any, 'updateScreenByModel');
      vi.spyOn(component as any, 'updateModelByScreen');

      component.onCalendarChange({ start, end });

      tick(300);

      expect(component.isCalendarVisible).toBe(true);

      expect(component['updateScreenByModel']).toHaveBeenCalledWith({ start, end: '' });
      expect(component['updateModelByScreen']).toHaveBeenCalledWith(true, start, '');
    }));

    it(`onCalendarChange: should focus on startDateInput after selecting both dates`, fakeAsync(() => {
      component.isCalendarVisible = true;

      const start = new Date(2021, 10, 10);
      const end = new Date(2021, 11, 11);

      vi.spyOn(component as any, 'updateScreenByModel');
      vi.spyOn(component as any, 'updateModelByScreen');
      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.onCalendarChange({ start, end });

      tick(300);

      expect(component.isCalendarVisible).toBe(false);
      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
    }));

    it(`onCalendarChange: should focus on startDateInput after selecting both dates`, fakeAsync(() => {
      component.isCalendarVisible = true;

      const start = new Date(2021, 10, 10);
      const end = new Date(2021, 11, 11);

      vi.spyOn(component as any, 'updateScreenByModel');
      vi.spyOn(component as any, 'updateModelByScreen');
      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.onCalendarChange({ start, end });

      tick(300);

      expect(component.isCalendarVisible).toBe(false);
      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
    }));

    it(`onCalendarChange: should call updateModelByScreen, updateScreenByModel with empty value
      if start and end param is falsy`, fakeAsync(() => {
      const start = null;
      const end = null;

      vi.spyOn(component as any, 'updateScreenByModel');
      vi.spyOn(component as any, 'updateModelByScreen');

      component.onCalendarChange({ start, end });

      expect(component['updateScreenByModel']).toHaveBeenCalledWith({ start: '', end: '' });
      expect(component['updateModelByScreen']).toHaveBeenCalledWith(null, '', '');
    }));

    describe('getErrorMessage:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage and required is true', () => {
        component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
        component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.errorMessage = undefined;
        expect(component['hasInvalidClass']()).toBeTruthy();
        expect(component.getErrorMessage).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
        component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorMessage).toBe('');
      });
    });

    describe('calculateWidthWithPresets:', () => {
      it('should return false when no presets are configured', () => {
        component.rangePresets = false;
        component.rangePresetOptions = undefined;

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(false);
      });

      it('should return false when rangePresets is falsy and rangePresetOptions is empty', () => {
        component.rangePresets = false;
        component.rangePresetOptions = [];

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(false);
      });

      it('should return false when size does not match any key in MIN_CALENDAR_WIDTH_WITH_PRESETS', () => {
        component.rangePresets = true;
        (component as any)._size = 'invalid';

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(false);
      });

      it('should return true when rangePresets is true and window.innerWidth < minWidth for medium size', () => {
        component.rangePresets = true;
        component.rangePresetOptions = [];
        component.size = 'medium';

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 500
        });

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(true);
      });

      it('should return false when rangePresets is true and window.innerWidth >= minWidth for medium size', () => {
        component.rangePresets = true;
        component.rangePresetOptions = [];
        component.size = 'medium';

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 700
        });

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(false);
      });

      it('should return true when rangePresetOptions has items and window.innerWidth < minWidth', () => {
        component.rangePresets = false;
        component.rangePresetOptions = [{ label: 'test', dateRange: () => ({ start: new Date(), end: new Date() }) }];
        component.size = 'medium';

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 500
        });

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(true);
      });

      it('should return true when both rangePresets and rangePresetOptions are set and window.innerWidth < minWidth', () => {
        component.rangePresets = true;
        component.rangePresetOptions = [{ label: 'test', dateRange: () => ({ start: new Date(), end: new Date() }) }];

        component.size = 'medium';

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 400
        });

        const result = component['calculateWidthWithPresets']();

        expect(result).toBe(true);
      });
    });

    describe('updateWidthWithPresets:', () => {
      it('should update widthWithPresets with the result of calculateWidthWithPresets', () => {
        component.widthWithPresets = false;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(true);

        component['updateWidthWithPresets']();

        expect(component.widthWithPresets).toBe(true);
      });

      it('should set widthWithPresets to false when calculateWidthWithPresets returns false', () => {
        component.widthWithPresets = true;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(false);

        component['updateWidthWithPresets']();

        expect(component.widthWithPresets).toBe(false);
      });
    });

    describe('onResize:', () => {
      it('should call updateWidthWithPresets', () => {
        vi.spyOn(component as any, 'updateWidthWithPresets');

        component.onResize();

        expect(component['updateWidthWithPresets']).toHaveBeenCalled();
      });
    });

    describe('enableHorizontalMouseWheel:', () => {
      it('should add wheel event listener to preset list element', () => {
        const addEventListenerSpy = vi.fn();
        const fakeEl = {
          addEventListener: addEventListenerSpy,
          scrollLeft: 0
        };

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeEl)
          }
        } as any;

        component.enableHorizontalMouseWheel();

        expect(component.calendarPicker.nativeElement.querySelector).toHaveBeenCalledWith('.po-calendar-preset-list');
        expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
      });

      it('should prevent default and update scrollLeft on wheel event', () => {
        const fakeEl = {
          addEventListener: vi.fn(),
          scrollLeft: 0
        };

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeEl)
          }
        } as any;

        component.enableHorizontalMouseWheel();

        const wheelCallback = vi.mocked(fakeEl.addEventListener).mock.lastCall[1];
        const wheelEvent = { preventDefault: vi.fn(), deltaY: 50 };
        wheelCallback(wheelEvent);

        expect(wheelEvent.preventDefault).toHaveBeenCalled();
        expect(fakeEl.scrollLeft).toBe(50);
      });
    });

    describe('verifyMobile:', () => {
      it('should return the result of isMobile()', () => {
        const result = component.verifyMobile();

        expect(typeof result === 'boolean' || result === null || result !== undefined).toBe(true);
      });
    });

    describe('handleMobileNavigation:', () => {
      it('should return true and focus first combo when mobile and combo exists', () => {
        const focusSpy = vi.fn();

        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true as any);

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handleMobileNavigation'](event);

        expect(result).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
      });

      it('should return true without focusing when mobile but combo does not exist', () => {
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true as any);

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(null)
          }
        } as any;

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handleMobileNavigation'](event);

        expect(result).toBe(true);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should return false when not mobile', () => {
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false as any);

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handleMobileNavigation'](event);

        expect(result).toBe(false);
      });
    });

    describe('handlePresetNavigation:', () => {
      it('should return true and focus preset when preset exists and calculateWidthWithPresets is false', () => {
        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(false);

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handlePresetNavigation'](event);

        expect(result).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
      });

      it('should return false when preset exists but calculateWidthWithPresets is true', () => {
        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: vi.fn() })
          }
        } as any;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(true);

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handlePresetNavigation'](event);

        expect(result).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should return false when no preset element found', () => {
        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(null)
          }
        } as any;

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handlePresetNavigation'](event);

        expect(result).toBe(false);
      });
    });

    describe('handleComboNavigation:', () => {
      it('should return true and focus combo when combo exists', () => {
        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handleComboNavigation'](event);

        expect(result).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
      });

      it('should return false when no combo found', () => {
        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(null)
          }
        } as any;

        const event: any = {
          preventDefault: vi.fn()
        };

        const result = component['handleComboNavigation'](event);

        expect(result).toBe(false);
      });
    });

    describe('handleTabWithCalendarVisible:', () => {
      it('should return false when key is not Tab', () => {
        const event: any = { key: 'Enter', shiftKey: false };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(false);
      });

      it('should return false when shiftKey is true', () => {
        component.isCalendarVisible = true;

        const event: any = { key: 'Tab', shiftKey: true };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(false);
      });

      it('should return false when calendar is not visible', () => {
        component.isCalendarVisible = false;

        const event: any = { key: 'Tab', shiftKey: false };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(false);
      });

      it('should delegate to handleMobileNavigation first when Tab and calendar visible', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'handleMobileNavigation').mockReturnValue(true);

        const event: any = { key: 'Tab', shiftKey: false };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(true);
        expect(component['handleMobileNavigation']).toHaveBeenCalledWith(event);
      });

      it('should delegate to handlePresetNavigation when mobile returns false', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'handleMobileNavigation').mockReturnValue(false);
        vi.spyOn(component as any, 'handlePresetNavigation').mockReturnValue(true);

        const event: any = { key: 'Tab', shiftKey: false };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(true);
        expect(component['handlePresetNavigation']).toHaveBeenCalledWith(event);
      });

      it('should delegate to handleComboNavigation when both mobile and preset return false', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'handleMobileNavigation').mockReturnValue(false);
        vi.spyOn(component as any, 'handlePresetNavigation').mockReturnValue(false);
        vi.spyOn(component as any, 'handleComboNavigation').mockReturnValue(true);

        const event: any = { key: 'Tab', shiftKey: false };

        const result = component['handleTabWithCalendarVisible'](event);

        expect(result).toBe(true);
        expect(component['handleComboNavigation']).toHaveBeenCalledWith(event);
      });
    });

    describe('handleShiftTabWithCleaner:', () => {
      it('should return true when Shift+Tab, calendar hidden, and enableCleaner true', () => {
        component.isCalendarVisible = false;

        vi.spyOn(component, 'enableCleaner', 'get').mockReturnValue(true);

        component.iconClean = {
          nativeElement: { focus: vi.fn() }
        } as any;

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn()
        };

        const result = component['handleShiftTabWithCleaner'](event);

        expect(result).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should return false when enableCleaner is false', () => {
        component.isCalendarVisible = false;

        vi.spyOn(component, 'enableCleaner', 'get').mockReturnValue(false);

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn()
        };

        const result = component['handleShiftTabWithCleaner'](event);

        expect(result).toBe(false);
      });

      it('should return false when calendar is visible', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component, 'enableCleaner', 'get').mockReturnValue(true);

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn()
        };

        const result = component['handleShiftTabWithCleaner'](event);

        expect(result).toBe(false);
      });

      it('should return false when key is not Tab', () => {
        const event: any = {
          key: 'Enter',
          shiftKey: true,
          preventDefault: vi.fn()
        };

        const result = component['handleShiftTabWithCleaner'](event);

        expect(result).toBe(false);
      });
    });

    describe('handleShiftTabWithoutCleaner:', () => {
      it('should return true and call focus when Shift+Tab and calendar hidden', () => {
        component.isCalendarVisible = false;

        vi.spyOn(component as any, 'focus');

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        const result = component['handleShiftTabWithoutCleaner'](event);

        expect(result).toBe(true);
        expect(component.focus).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should return false when calendar is visible', () => {
        component.isCalendarVisible = true;

        const event: any = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        const result = component['handleShiftTabWithoutCleaner'](event);

        expect(result).toBe(false);
      });

      it('should return false when key is not Tab', () => {
        const event: any = {
          key: 'Enter',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };

        const result = component['handleShiftTabWithoutCleaner'](event);

        expect(result).toBe(false);
      });
    });

    describe('toggleCalendar with widthWithPresets:', () => {
      it('should call enableHorizontalMouseWheel when calendar becomes visible and calculateWidthWithPresets returns true', () => {
        component.isCalendarVisible = false;
        component.disabled = false;
        component.readonly = false;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(true);
        vi.spyOn(component as any, 'enableHorizontalMouseWheel');
        vi.spyOn(component as any, 'setCalendarPosition');
        vi.spyOn(component as any, 'initializeListeners');

        component.toggleCalendar();

        expect(component.enableHorizontalMouseWheel).toHaveBeenCalled();
      });

      it('should not call enableHorizontalMouseWheel when calculateWidthWithPresets returns false', () => {
        component.isCalendarVisible = false;
        component.disabled = false;
        component.readonly = false;

        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(false);
        vi.spyOn(component as any, 'enableHorizontalMouseWheel');
        vi.spyOn(component as any, 'setCalendarPosition');
        vi.spyOn(component as any, 'initializeListeners');

        component.toggleCalendar();

        expect(component.enableHorizontalMouseWheel).not.toHaveBeenCalled();
      });
    });

    describe('onCalendarKeyDown with calculateWidthWithPresets:', () => {
      beforeEach(() => {
        component.iconCalendar = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;
      });

      it('should not focus preset when Shift+Tab from first combo and calculateWidthWithPresets returns true', () => {
        component.isCalendarVisible = true;

        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false as any);
        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(true);

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(focusSpy).not.toHaveBeenCalled();
        expect(component.iconCalendar.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(false);
      });

      it('should focus preset when Shift+Tab from first combo and calculateWidthWithPresets returns false', () => {
        component.isCalendarVisible = true;

        const focusSpy = vi.fn();

        component.calendarPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue({ focus: focusSpy })
          }
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false as any);
        vi.spyOn(component as any, 'calculateWidthWithPresets').mockReturnValue(false);

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.onCalendarKeyDown(event);

        expect(focusSpy).toHaveBeenCalled();
        expect(component.isCalendarVisible).toBe(true);
      });
    });

    describe('onScroll with verifyMobile:', () => {
      it('should call adjustPosition when calendar is visible and not mobile', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false as any);
        vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

        component['onScroll']();

        expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
      });

      it('should not call adjustPosition when calendar is visible and is mobile', () => {
        component.isCalendarVisible = true;

        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true as any);
        vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

        component['onScroll']();

        expect(component['controlPosition'].adjustPosition).not.toHaveBeenCalled();
      });
    });

    describe('ngOnInit widthWithPresets:', () => {
      it('should set widthWithPresets based on window.innerWidth and MIN_CALENDAR_WIDTH_WITH_PRESETS', () => {
        component.size = 'medium';

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 500
        });

        component.ngOnInit();

        expect(component.widthWithPresets).toBe(true);
      });
    });

    describe('ngAfterViewInit with optional chaining:', () => {
      it('should not throw when iconCalendar is undefined', () => {
        component.iconCalendar = undefined;

        expect(() => component.ngAfterViewInit()).not.toThrow();
      });

      it('should not throw when iconCalendar.buttonElement is undefined', () => {
        component.iconCalendar = { buttonElement: undefined } as any;

        expect(() => component.ngAfterViewInit()).not.toThrow();
      });
    });
  });

  describe('Templates:', () => {
    let keyupBoardEvent: KeyboardEvent;
    let blurFocusEvent: FocusEvent;

    beforeEach(() => {
      keyupBoardEvent = new KeyboardEvent('keyup');
      blurFocusEvent = new FocusEvent('blur');
    });

    it('should contain class `po-datepicker-range-field-disabled` if `disabled` is true', () => {
      component.disabled = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-datepicker-range-field-disabled')).toBeTruthy();
    });

    it('shouldn`t contain class `po-datepicker-range-field-disabled` if `disabled` is false', () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-datepicker-range-field-disabled')).toBeFalsy();
    });

    it('shouldn`t disable calendar icon if `readonly` and `disabled` are false', () => {
      component.readonly = false;
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeFalsy();
    });

    it('should contain `po-clean` if `enableCleaner` is true', () => {
      vi.spyOn(component as any, 'enableCleaner').mockReturnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-clean')).toBeTruthy();
    });

    it('shouldn`t contain `po-clean` if `enableCleaner` is false', () => {
      vi.spyOn(component as any, 'enableCleaner').mockReturnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-clean')).toBeFalsy();
    });

    it('should update screen with empty date range if `writeValue` is called with undefined``', () => {
      component.writeValue(undefined);

      fixture.detectChanges();

      expect(component.endDateInput.nativeElement.value).toBe('');
      expect(component.startDateInput.nativeElement.value).toBe('');
    });

    it('should update model with empty string if the length of the end date input value is different from 10', () => {
      component.startDate = '';
      component.endDate = '';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '2';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('2');
    });

    it('should update model with empty end date if the length of the end date input value is different from 10', () => {
      component.startDate = '2018-11-05T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/201';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-11-05', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-11-05', end: '' });
      expect(component.startDateInput.nativeElement.value).toBe('05/11/2018');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/201');
    });

    it('should update model with empty start date if the length of the start date input value is different from 10', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/12/201';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/12/201');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2018');
    });

    it(`should update model with empty string if the length of the start date and end date input value are
      different from 10`, () => {
      component['dateRange'] = { start: '', end: '' };
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '24/12/201';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/201');
    });

    it('should update model with empty string if end date is invalid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/88/2018';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      fixture.detectChanges();

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('24/88/2018');
    });

    it('should update model with empty string if start date is invalid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/88/2018';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/88/2018');
    });

    it('should update model with start date empty if start date is greater than end date', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/12/2019';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/12/2019');
    });

    it('should update model with end date empty if start date is greater than end date', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/2016';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2016');
    });

    it('should update model if start date of input is valid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';

      vi.spyOn(component as any, 'updateModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '25/12/1995';
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '1995-12-25', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '1995-12-25', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('25/12/1995');
    });

    it('should update model if end date of input is valid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';

      vi.spyOn(component as any, 'updateModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/2019';
      component.endDateInput.nativeElement.dispatchEvent(keyupBoardEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '2019-12-24' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '2019-12-24' });
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2019');
    });

    it('should set cursor to end date input if last letter of start date is typed', () => {
      fixture.detectChanges();
      vi.spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.focus();

      const digit8KeyEvent = new KeyboardEvent('keyup', { keyCode: 56 });

      component.startDateInput.nativeElement.dispatchEvent(digit8KeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('should keep start date input active if typed key isn`t a number', () => {
      fixture.detectChanges();
      const shiftKeyEvent = new KeyboardEvent('keyup', { keyCode: 16 });
      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(shiftKeyEvent);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(10);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(10);
    });

    it('should set cursor to end date input if typed key is arrowRight and cursor position is last number of start date', () => {
      const arrowRightKeyEvent = new KeyboardEvent('keyup', { keyCode: 39 });
      vi.spyOn(component.endDateInput.nativeElement, 'focus');
      fixture.detectChanges();
      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.setSelectionRange(10, 10);
      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(arrowRightKeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('should set cursor to start date input if typed key is arrowLeft and cursor position is first number of end date', () => {
      const arrowLeftKeyEvent = new KeyboardEvent('keyup', { keyCode: 37 });
      vi.spyOn(component.startDateInput.nativeElement, 'focus');
      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/11/2018';
      component.endDateInput.nativeElement.value = '24/11/2018';
      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.setSelectionRange(0, 0);
      component.endDateInput.nativeElement.dispatchEvent(arrowLeftKeyEvent);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(10);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(10);
    });

    it('should set focus on end date input if cursor position is at the end of start date input', () => {
      const arrowRightKeyEvent = new KeyboardEvent('keyup', { keyCode: 39 });
      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      fixture.detectChanges();
      vi.spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.setSelectionRange(4, 4);
      component.startDateInput.nativeElement.selectionStart = 4;
      component.startDateInput.nativeElement.selectionEnd = 4;
      component.startDateInput.nativeElement.dispatchEvent(arrowRightKeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it(`should delete last caracter of start date input if element is end data input, typed key is backspace and cursor
      position is 0`, () => {
      // keyCode 8 is backspace
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', { keyCode: 8 });
      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';
      fixture.detectChanges();
      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(3);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(3);
      expect(component.startDateInput.nativeElement.value).toBe('24/');
    });

    it(`should delete last caracter of start date input if element is start date input, typed key is backspace and
      end date cursor position is 0`, () => {
      // keyCode 8 is backspace
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 8,
        target: { name: component.startDateInputName }
      });

      component.startDateInput.nativeElement.value = '24/12';
      component.endDateInput.nativeElement.value = '';

      fixture.detectChanges();

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.selectionStart).toBe(4);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(4);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it(`should delete last caracter of start date input if typed key is backspace, end date cursor position is 0 and
      end date input has value`, () => {
      fixture.detectChanges();
      // keyCode 8 is backspace
      const keydownBoardEventBackspace = new KeyboardEvent('keydown', { keyCode: 8 });
      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      // set value for start date input
      component.startDateInput.nativeElement.value = '24/1';

      // set value for input end date input
      component.endDateInput.nativeElement.value = '12/02/2003';

      // set focus on end date input
      component.endDateInput.nativeElement.focus();

      // set cursor position on 0 in end date input
      component.endDateInput.nativeElement.setSelectionRange(0, 0);

      // press the backspace key
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventBackspace);

      fixture.detectChanges();

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(3);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(3);
      expect(component.startDateInput.nativeElement.value).toBe('24/');
      expect(component.endDateInput.nativeElement.value).toBe('12/02/2003');
    });

    it('should delete last caracter of start date input if typed key is backspace and start date input cursor position is 5', () => {
      fixture.detectChanges();
      // keyCode 8 is backspace
      const keyupBoardEventBackspace = new KeyboardEvent('keyup', { keyCode: 8 });
      const keyDownBoardEventBackspace = new KeyboardEvent('keydown', { keyCode: 8 });

      component.startDateInput.nativeElement.value = '24/12';
      component.startDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.value = '';

      fixture.detectChanges();

      // posiciona o cursor depois do numero 1
      component.endDateInput.nativeElement.setSelectionRange(0, 0);

      component.startDateInput.nativeElement.setSelectionRange(5, 5);

      // pressiona a tecla backspace
      component.startDateInput.nativeElement.dispatchEvent(keyDownBoardEventBackspace);
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEventBackspace);

      expect(component.startDateInput.nativeElement.selectionStart).toBe(4);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(4);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it('should keep end date input active if first caracter is deleted', () => {
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 8, // keyCode 8 is backspace
        target: { name: component.endDateInputName }
      });

      fixture.detectChanges();

      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.focus();

      component.endDateInput.nativeElement.value = '1';
      component.endDateInput.nativeElement.setSelectionRange(1, 1);

      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it('shouldn`t set cursor to start date input if element is end data input, typed keys aren`t backspace and arrowLeft', () => {
      fixture.detectChanges();
      // keyCode 16 is shift
      const keyupBoardEventSetFocus = new KeyboardEvent('keyup', { keyCode: 16 });
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 16,
        target: { name: component.endDateInputName }
      });

      vi.spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);
      component.endDateInput.nativeElement.dispatchEvent(keyupBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('shouldn`t set cursor to end date input if element is start date input, typed keys aren`t backspace and arrowRight', () => {
      fixture.detectChanges();
      // keyCode 16 is shift
      const keyupBoardEventSetFocus = new KeyboardEvent('keyup', { keyCode: 16 });
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 16,
        target: { name: component.endDateInputName }
      });

      vi.spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEventSetFocus);

      expect(component.endDateInput.nativeElement.focus).not.toHaveBeenCalled();
    });

    it(`should contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'startDateInput' is
      active element`, () => {
      const startDateInputName = `input[name="${component.startDateInputName}"]`;
      fixture.detectChanges();
      const startDateInput = fixture.debugElement.query(By.css(startDateInputName));
      const eventMock = { target: { name: '' } };
      startDateInput.triggerEventHandler('focus', eventMock);

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');
      expect(poDatepickerField.classList).toContain('po-datepicker-range-field-focused');
    });

    it(`should contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'endDateInput' is
      active element`, () => {
      const endDateInputName = `input[name="${component.endDateInputName}"]`;
      fixture.detectChanges();
      const endDateInput = fixture.debugElement.query(By.css(endDateInputName));
      const eventMock = { target: { name: '' } };
      endDateInput.triggerEventHandler('focus', eventMock);

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');

      expect(poDatepickerField.classList).toContain('po-datepicker-range-field-focused');
    });

    it(`shouldn't contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'endDateInput' and
      startDateInput aren't active elements`, () => {
      const endDateInputName = `input[name="${component.endDateInputName}"]`;
      const startDateInputName = `input[name="${component.startDateInputName}"]`;
      fixture.detectChanges();

      const endDateInput = fixture.debugElement.query(By.css(endDateInputName));
      const startDateInput = fixture.debugElement.query(By.css(startDateInputName));
      const mockEvent = { target: { name: '' } };
      fixture.detectChanges();
      endDateInput.triggerEventHandler('blur', mockEvent);
      startDateInput.triggerEventHandler('blur', mockEvent);

      fixture.detectChanges();

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');

      expect(poDatepickerField.classList).not.toContain('po-datepicker-range-field-focused');
    });
  });
});
