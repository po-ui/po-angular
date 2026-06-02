import { FormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PoDatetimepickerModule } from './po-datetimepicker.module';
import { PoDatetimepickerComponent } from './po-datetimepicker.component';

describe('PoDatetimepickerComponent:', () => {
  let component: PoDatetimepickerComponent;
  let fixture: ComponentFixture<PoDatetimepickerComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, PoDatetimepickerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDatetimepickerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    fixture.componentRef.setInput('p-locale', 'pt');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('togglePicker:', () => {
    it('should open calendar when visible is false', () => {
      component.visible = false;
      component.togglePicker();

      expect(component.visible).toBe(true);
    });

    it('should close calendar when visible is true', () => {
      component.visible = true;
      component.togglePicker();

      expect(component.visible).toBe(false);
    });

    it('should not toggle when disabled', () => {
      component['_disabled'] = true;
      component.visible = false;
      component.togglePicker();

      expect(component.visible).toBe(false);
    });

    it('should not toggle when readonly', () => {
      component['_readonly'] = true;
      component.visible = false;
      component.togglePicker();

      expect(component.visible).toBe(false);
    });

    it('should call initAllColumnOffsets on timer when opening picker', fakeAsync(() => {
      component.visible = false;
      component.togglePicker();
      fixture.detectChanges();
      tick(16);

      // Close and reopen with spy
      component.closeCalendar();
      fixture.detectChanges();

      const timer = component.calendarComponent?.timerComponent;
      if (timer) {
        spyOn(timer, 'initAllColumnOffsets');
        component.togglePicker();
        tick(16);
        expect(timer.initAllColumnOffsets).toHaveBeenCalled();
      }
    }));
  });

  describe('closeCalendar:', () => {
    it('should set visible to false', () => {
      component.visible = true;
      component.closeCalendar();

      expect(component.visible).toBe(false);
    });
  });

  describe('focus:', () => {
    it('should focus the input element', () => {
      spyOn(component.inputEl.nativeElement, 'focus');
      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus when disabled', () => {
      component['_disabled'] = true;
      spyOn(component.inputEl.nativeElement, 'focus');
      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('onKeydown:', () => {
    it('should close calendar on Escape when visible', () => {
      component.visible = true;
      spyOn(component, 'togglePicker');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeydown(event);

      expect(component.togglePicker).toHaveBeenCalledWith(false);
    });

    it('should not close calendar on Escape when not visible', () => {
      component.visible = false;
      spyOn(component, 'togglePicker');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeydown(event);

      expect(component.togglePicker).not.toHaveBeenCalled();
    });

    it('should emit keydown event when target is input', () => {
      spyOn(component.keydown, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'a' });
      Object.defineProperty(event, 'target', { value: component.inputEl.nativeElement });
      component.onKeydown(event);

      expect(component.keydown.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('onTimeChange:', () => {
    it('should not process when time is empty', () => {
      spyOn(component, 'controlModel');
      component.onTimeChange('');

      expect(component.controlModel).not.toHaveBeenCalled();
    });

    it('should update timeValue', () => {
      component['date'] = new Date(2026, 4, 12);
      component.onTimeChange('14:30');

      expect(component['timeValue']).toBe('14:30');
    });

    it('should call controlModel when date is valid', () => {
      spyOn(component, 'controlModel');
      component['date'] = new Date(2026, 4, 12);
      component.onTimeChange('14:30');

      expect(component.controlModel).toHaveBeenCalled();
    });

    it('should not call controlModel when date is undefined', () => {
      spyOn(component, 'controlModel');
      component['date'] = undefined;
      component.onTimeChange('14:30');

      expect(component.controlModel).not.toHaveBeenCalled();
    });
  });

  describe('onDateChange:', () => {
    it('should ignore null values when date exists and calendar is visible', () => {
      component['date'] = new Date(2026, 4, 12);
      component.visible = true;
      component.onDateChange(null);

      expect(component['date']).toBeDefined();
    });

    it('should clear values on empty string (Limpar)', () => {
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';
      component.visible = false;
      component.onDateChange('');

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
    });

    it('should set date from ISO string', () => {
      component.onDateChange('2026-05-12');

      expect(component['date']).toBeDefined();
      expect(component['date'].getFullYear()).toBe(2026);
      expect(component['date'].getMonth()).toBe(4);
      expect(component['date'].getDate()).toBe(12);
    });

    it('should ignore invalid date strings', () => {
      component['date'] = undefined;
      component.onDateChange('invalid');

      expect(component['date']).toBeUndefined();
    });
  });

  describe('clear:', () => {
    it('should clear date, timeValue and input', () => {
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';
      component.inputEl.nativeElement.value = '12/05/2026 14:30';

      component.clear();

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
      expect(component.inputEl.nativeElement.value).toBe('');
    });

    it('should emit change with empty string', () => {
      spyOn(component, 'callOnChange');
      component.clear();

      expect(component.callOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('eventOnBlur:', () => {
    it('should emit blur event', () => {
      spyOn(component.onblur, 'emit');
      component['objMask'] = { blur: jasmine.createSpy('blur') };
      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component.onblur.emit).toHaveBeenCalled();
    });

    it('should clear values when input is empty', () => {
      component.inputEl.nativeElement.value = '';
      spyOn(component, 'callOnChange');
      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component.callOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('eventOnClick:', () => {
    it('should call objMask.click when not readonly', () => {
      component['objMask'] = { click: jasmine.createSpy('click') };
      const event = { target: component.inputEl.nativeElement };
      component.eventOnClick(event);

      expect(component['objMask'].click).toHaveBeenCalledWith(event);
    });
  });

  describe('refreshValue:', () => {
    it('should set input value when date is valid', () => {
      component['timeValue'] = '14:30';
      component.refreshValue(new Date(2026, 4, 12));

      expect(component.inputEl.nativeElement.value).toContain('2026');
      expect(component.inputEl.nativeElement.value).toContain('14:30');
    });

    it('should clear input when date is null', () => {
      component.inputEl.nativeElement.value = 'something';
      component.refreshValue(undefined);

      expect(component.inputEl.nativeElement.value).toBe('');
    });

    it('should not update input with invalid date', () => {
      component.inputEl.nativeElement.value = 'original';
      component.refreshValue(new Date('invalid'));

      expect(component.inputEl.nativeElement.value).toBe('original');
    });
  });

  describe('showAdditionalHelp:', () => {
    it('should toggle displayAdditionalHelp', () => {
      component.displayAdditionalHelp = false;
      component.showAdditionalHelp();

      expect(component.displayAdditionalHelp).toBe(true);
    });
  });

  describe('wasClickedOnPicker:', () => {
    it('should close calendar when clicked outside', fakeAsync(() => {
      component.visible = true;
      component['initializeListeners']();
      fixture.detectChanges();

      spyOn(component, 'closeCalendar');

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: outsideElement });
      component.wasClickedOnPicker(event);

      expect(component.closeCalendar).toHaveBeenCalled();
      document.body.removeChild(outsideElement);
      component['removeListeners']();
    }));
  });

  describe('onTimerBoundaryTab:', () => {
    it('should close calendar on forward direction', () => {
      component.visible = true;
      spyOn(component, 'closeCalendar');

      const event = {
        direction: 'forward',
        event: { preventDefault: jasmine.createSpy('preventDefault') } as any,
        column: 'minutes'
      };
      component.onTimerBoundaryTab(event);

      expect(event.event.preventDefault).toHaveBeenCalled();
      expect(component.closeCalendar).toHaveBeenCalledWith(false);
    });

    it('should not close calendar on backward direction', () => {
      spyOn(component, 'closeCalendar');

      const event = {
        direction: 'backward',
        event: { preventDefault: jasmine.createSpy('preventDefault') } as any,
        column: 'hours'
      };
      component.onTimerBoundaryTab(event);

      expect(component.closeCalendar).not.toHaveBeenCalled();
    });
  });

  describe('dateTimeInputValue:', () => {
    it('should return the input element value', () => {
      component.inputEl.nativeElement.value = '12/05/2026 14:30';
      expect(component.dateTimeInputValue).toBe('12/05/2026 14:30');
    });
  });

  describe('getErrorPattern:', () => {
    it('should return empty string when no error', () => {
      expect(component.getErrorPattern()).toBe('');
    });
  });

  describe('hasInvalidClass:', () => {
    it('should return false by default', () => {
      expect(component.hasInvalidClass()).toBe(false);
    });

    it('should return true when element has ng-invalid and ng-dirty classes with input value', () => {
      component.el.nativeElement.classList.add('ng-invalid');
      component.el.nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = '12/05/2026 14:30';

      expect(component.hasInvalidClass()).toBe(true);
    });

    it('should return true when element has ng-invalid, ng-dirty and showErrorMessageRequired is true', () => {
      component.el.nativeElement.classList.add('ng-invalid');
      component.el.nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = '';
      component['hasValidatorRequired'] = true;
      fixture.componentRef.setInput('p-required', true);
      fixture.componentRef.setInput('p-required-field-error-message', true);
      fixture.detectChanges();

      expect(component.hasInvalidClass()).toBe(true);
    });
  });

  describe('getErrorPattern:', () => {
    it('should return empty string when errorPattern is empty', () => {
      expect(component.getErrorPattern()).toBe('');
    });

    it('should return errorPattern value when hasInvalidClass is true', () => {
      component.el.nativeElement.classList.add('ng-invalid');
      component.el.nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = 'something';
      fixture.componentRef.setInput('p-error-pattern', 'Data/hora inválida');
      fixture.detectChanges();

      expect(component.getErrorPattern()).toBe('Data/hora inválida');
    });
  });

  describe('ngAfterViewInit:', () => {
    it('should call focus when autoFocus is true', () => {
      spyOn(component, 'focus');
      // Simulate autoFocus input being true
      (component as any)['autoFocus'] = () => true;
      component.ngAfterViewInit();

      expect(component.focus).toHaveBeenCalled();
    });
  });

  describe('closeCalendar - focus management:', () => {
    it('should focus iconDatepicker button via requestAnimationFrame when focusInput is false', fakeAsync(() => {
      component.visible = true;
      component['initializeListeners']();

      const buttonEl = component.iconDatepicker?.buttonElement?.nativeElement;
      if (buttonEl) {
        spyOn(buttonEl, 'focus');
      }
      component.closeCalendar(false);
      tick(20);

      if (buttonEl) {
        expect(buttonEl.focus).toHaveBeenCalled();
      }
      component['removeListeners']();
    }));

    it('should call focus on input when focusInput is true and not mobile', () => {
      component.visible = true;
      component['initializeListeners']();
      spyOn(component, 'verifyMobile').and.returnValue(null);
      spyOn(component, 'focus');

      component.closeCalendar(true);

      expect(component.focus).toHaveBeenCalled();
      component['removeListeners']();
    });
  });

  describe('wasClickedOnPicker - edge cases:', () => {
    it('should return early when dialogPicker is undefined', () => {
      component['dialogPicker'] = undefined;
      spyOn(component, 'closeCalendar');

      component.wasClickedOnPicker({ target: document.createElement('div') } as any);

      expect(component.closeCalendar).not.toHaveBeenCalled();
    });

    it('should close when clicking on overlay element', () => {
      component.visible = true;
      component['initializeListeners']();
      fixture.detectChanges();

      spyOn(component, 'closeCalendar');

      const overlayEl = document.createElement('div');
      overlayEl.classList.add('po-datetimepicker-calendar-overlay');
      component['dialogPicker'] = { nativeElement: document.createElement('div') } as any;
      component['dialogPicker'].nativeElement.appendChild(overlayEl);

      component.wasClickedOnPicker({ target: overlayEl } as any);

      expect(component.closeCalendar).toHaveBeenCalled();
      component['removeListeners']();
    });
  });

  describe('onKeyup:', () => {
    it('should not process when readonly', () => {
      component['_readonly'] = true;
      spyOn(component, 'controlModel');

      const event = { target: component.inputEl.nativeElement } as any;
      component.onKeyup(event);

      expect(component.controlModel).not.toHaveBeenCalled();
    });

    it('should not process when target is not the input', () => {
      spyOn(component, 'controlModel');

      const event = { target: document.createElement('div') } as any;
      component.onKeyup(event);

      expect(component.controlModel).not.toHaveBeenCalled();
    });

    it('should call objMask.keyup when target is input', () => {
      component['objMask'] = {
        keyup: jasmine.createSpy('keyup'),
        valueToModel: ''
      } as any;

      const event = { target: component.inputEl.nativeElement } as any;
      component.onKeyup(event);

      expect(component['objMask'].keyup).toHaveBeenCalledWith(event);
    });

    it('should clear date and timeValue when valueToModel length is less than expected', () => {
      component['objMask'] = {
        keyup: jasmine.createSpy('keyup'),
        valueToModel: '1234'
      } as any;
      component.inputEl.nativeElement.value = '12/3';
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';

      spyOn(component, 'controlModel');
      const event = { target: component.inputEl.nativeElement } as any;
      component.onKeyup(event);

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
      expect(component.controlModel).toHaveBeenCalled();
    });

    it('should parse and sync when valueToModel length meets expected length', () => {
      component['objMask'] = {
        keyup: jasmine.createSpy('keyup'),
        valueToModel: '121020261430'
      } as any;
      component.inputEl.nativeElement.value = '12/10/2026 14:30';

      spyOn<any>(component, 'parseInputAndSync');
      const event = { target: component.inputEl.nativeElement } as any;
      component.onKeyup(event);

      expect(component['parseInputAndSync']).toHaveBeenCalledWith('12/10/2026 14:30');
    });

    it('should clear date and timeValue when objMask.valueToModel is falsy and not empty string', () => {
      component['objMask'] = {
        keyup: jasmine.createSpy('keyup'),
        valueToModel: undefined
      } as any;
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '14:30';

      const event = { target: component.inputEl.nativeElement } as any;
      component.onKeyup(event);

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
    });
  });

  describe('hasInvalidClass - hasValidatorRequired branch:', () => {
    it('should return true when hasValidatorRequired is true and isRequired is false', () => {
      component.el.nativeElement.classList.add('ng-invalid');
      component.el.nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = '';
      component['hasValidatorRequired'] = true;
      component['_required'] = false;
      fixture.componentRef.setInput('p-required-field-error-message', true);
      fixture.detectChanges();

      expect(component.hasInvalidClass()).toBe(true);
    });
  });

  describe('onKeydown - readonly branch:', () => {
    it('should return early when readonly', () => {
      component['_readonly'] = true;
      spyOn(component, 'togglePicker');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.visible = true;
      component.onKeydown(event);

      expect(component.togglePicker).not.toHaveBeenCalled();
    });
  });

  describe('eventOnBlur - else branch (incomplete input):', () => {
    it('should mark as invalid when input is incomplete', () => {
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: '1234'
      } as any;
      component.inputEl.nativeElement.value = '12/1';

      spyOn(component, 'callOnChange');
      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component.callOnChange).toHaveBeenCalledWith(component.literals.invalidDatetime);
      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
    });

    it('should emit p-change with invalidDatetime when input is incomplete', () => {
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: '1234'
      } as any;
      component.inputEl.nativeElement.value = '12/1';
      component['valueBeforeChange'] = '2026-06-20T08:30:00-03:00';

      spyOn(component.onchange, 'emit');
      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component.onchange.emit).toHaveBeenCalledWith(component.literals.invalidDatetime);
    });
  });

  describe('parseInputAndSync - invalid value does not emit p-change directly:', () => {
    it('should not emit p-change when called directly (emission happens on blur)', () => {
      component['valueBeforeChange'] = '2026-06-20T08:30:00-03:00';
      spyOn(component.onchange, 'emit');

      component['parseInputAndSync']('32/01/2026 10:00');

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
      expect(component.onchange.emit).not.toHaveBeenCalled();
    });

    it('should call onChange with invalidDatetime when date parse fails', () => {
      spyOn(component, 'callOnChange');

      component['parseInputAndSync']('32/01/2026 10:00');

      expect(component.callOnChange).toHaveBeenCalledWith(component.literals.invalidDatetime);
    });
  });

  describe('eventOnBlur - complete input but invalid value:', () => {
    it('should emit p-change with invalidDatetime when value is complete but invalid', () => {
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: '999999999999'
      } as any;
      component.inputEl.nativeElement.value = '99/99/9999 99:99';
      component['valueBeforeChange'] = '2026-06-20T08:30:00-03:00';

      spyOn(component.onchange, 'emit');
      component.eventOnBlur({ target: component.inputEl.nativeElement });

      expect(component['date']).toBeUndefined();
      expect(component.onchange.emit).toHaveBeenCalledWith(component.literals.invalidDatetime);
    });

    it('should emit p-change with invalidDatetime when time part is invalid on blur', () => {
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: '150620262500'
      } as any;
      component.inputEl.nativeElement.value = '15/06/2026 25:00';
      component['valueBeforeChange'] = '2026-06-20T08:30:00-03:00';

      spyOn(component.onchange, 'emit');
      component.eventOnBlur({ target: component.inputEl.nativeElement });

      expect(component.onchange.emit).toHaveBeenCalledWith(component.literals.invalidDatetime);
    });
  });

  describe('eventOnBlur - complete input with valid date+time:', () => {
    it('should parse input and emit change when valueToModel meets expected length', () => {
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: '121020261430'
      } as any;
      component.inputEl.nativeElement.value = '12/10/2026 14:30';
      component['valueBeforeChange'] = '';

      spyOn(component.onchange, 'emit');
      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component['date']).toBeDefined();
      expect(component['timeValue']).toBe('14:30');
      expect(component.onchange.emit).toHaveBeenCalled();
    });
  });

  describe('eventOnClick:', () => {
    it('should call objMask.click when not mobile and not readonly', () => {
      spyOn(component, 'verifyMobile').and.returnValue(null);
      component['_readonly'] = false;
      component['objMask'] = { click: jasmine.createSpy('click') };

      const event = { target: component.inputEl.nativeElement };
      component.eventOnClick(event);

      expect(component['objMask'].click).toHaveBeenCalledWith(event);
    });

    it('should toggle picker on mobile', fakeAsync(() => {
      spyOn(component, 'verifyMobile').and.returnValue(['mobile'] as any);
      spyOn(component, 'togglePicker');

      const event = { target: { blur: jasmine.createSpy('blur') } };
      component.eventOnClick(event);
      tick(10);

      expect(event.target.blur).toHaveBeenCalled();
      expect(component.togglePicker).toHaveBeenCalled();
    }));
  });

  describe('isFocusOnFirstCombo:', () => {
    it('should return false when no combo is focused', () => {
      expect(component['isFocusOnFirstCombo']()).toBe(false);
    });
  });

  describe('eventOnCalendarKeydown:', () => {
    it('should close calendar on Shift+Tab when first combo is focused', () => {
      spyOn(component, 'closeCalendar');
      spyOn<any>(component, 'isFocusOnFirstCombo').and.returnValue(true);

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      component.eventOnCalendarKeydown(event);

      expect(component.closeCalendar).toHaveBeenCalledWith(false);
    });

    it('should not close calendar on Tab without Shift', () => {
      spyOn(component, 'closeCalendar');
      spyOn<any>(component, 'isFocusOnFirstCombo').and.returnValue(true);

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      component.eventOnCalendarKeydown(event);

      expect(component.closeCalendar).not.toHaveBeenCalled();
    });

    it('should not close calendar when first combo is not focused', () => {
      spyOn(component, 'closeCalendar');
      spyOn<any>(component, 'isFocusOnFirstCombo').and.returnValue(false);

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      component.eventOnCalendarKeydown(event);

      expect(component.closeCalendar).not.toHaveBeenCalled();
    });
  });

  describe('refreshValue - inputEl guard:', () => {
    it('should return early when inputEl is undefined', () => {
      const originalInputEl = component.inputEl;
      component['inputEl'] = undefined;

      expect(() => component.refreshValue(new Date())).not.toThrow();

      component['inputEl'] = originalInputEl;
    });
  });

  describe('onDateChange - isToday with timeValue branch:', () => {
    it('should close calendar and emit change when selecting today with existing timeValue', () => {
      const today = new Date();
      const todayISO = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + today.getDate()).slice(-2)}`;

      component['timeValue'] = '14:30';
      component.visible = true;
      spyOn(component, 'closeCalendar');
      spyOn(component, 'controlModel');

      component.onDateChange(todayISO);

      expect(component.controlModel).toHaveBeenCalled();
      expect(component.closeCalendar).toHaveBeenCalledWith(true);
    });

    it('should not close calendar when selecting today without timeValue', () => {
      const today = new Date();
      const todayISO = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + today.getDate()).slice(-2)}`;

      component['timeValue'] = '';
      component.visible = true;
      spyOn(component, 'closeCalendar');

      component.onDateChange(todayISO);

      expect(component.closeCalendar).not.toHaveBeenCalled();
    });
  });

  describe('onDateChange - non-today date with existing timeValue:', () => {
    it('should propagate model and emit change when selecting a date with existing timeValue', () => {
      component['timeValue'] = '14:30';
      component['valueBeforeChange'] = '2026-05-09T14:30:00-03:00';
      component.visible = true;
      spyOn(component, 'controlModel');
      spyOn(component.onchange, 'emit');

      component.onDateChange('2026-05-15');

      expect(component['date'].getDate()).toBe(15);
      expect(component.controlModel).toHaveBeenCalled();
      expect(component.onchange.emit).toHaveBeenCalled();
    });

    it('should not close calendar when selecting a non-today date with existing timeValue', () => {
      component['timeValue'] = '10:00';
      component.visible = true;
      spyOn(component, 'closeCalendar');

      component.onDateChange('2026-05-15');

      expect(component.closeCalendar).not.toHaveBeenCalled();
      expect(component.visible).toBe(true);
    });

    it('should update display via refreshValue when selecting a non-today date with existing timeValue', () => {
      component['timeValue'] = '08:45';
      spyOn(component, 'refreshValue');

      component.onDateChange('2026-06-20');

      expect(component.refreshValue).toHaveBeenCalledWith(component['date']);
    });

    it('should not propagate model when selecting a date without existing timeValue', () => {
      component['timeValue'] = '';
      spyOn(component, 'controlModel');
      spyOn(component.onchange, 'emit');

      component.onDateChange('2026-05-15');

      expect(component.controlModel).not.toHaveBeenCalled();
      expect(component.onchange.emit).not.toHaveBeenCalled();
    });
  });

  describe('showAdditionalHelp:', () => {
    it('should toggle displayAdditionalHelp', () => {
      component.displayAdditionalHelp = false;
      const result = component.showAdditionalHelp();
      expect(component.displayAdditionalHelp).toBe(true);
      expect(result).toBe(true);
    });

    it('should call helper eventOnClick when helper has eventOnClick and no label', () => {
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', { eventOnClick: jasmine.createSpy('eventOnClick') });
      fixture.detectChanges();

      component.showAdditionalHelp();

      expect(component.poHelperComponent()['eventOnClick']).toHaveBeenCalled();
    });
  });

  describe('formatToDisplay:', () => {
    it('should return empty string when date is null', () => {
      expect(component['formatToDisplay'](null, '14:30')).toBe('');
    });

    it('should return empty string when date is undefined', () => {
      expect(component['formatToDisplay'](undefined, '14:30')).toBe('');
    });

    it('should show --:-- placeholder when time is empty', () => {
      const result = component['formatToDisplay'](new Date(2026, 4, 12), '');
      expect(result).toContain('--:--');
    });

    it('should show --:--:-- placeholder when time is empty and showSeconds is true', () => {
      fixture.componentRef.setInput('p-show-seconds', true);
      fixture.detectChanges();

      const result = component['formatToDisplay'](new Date(2026, 4, 12), '');
      expect(result).toContain('--:--:--');
    });
  });

  describe('parseInputAndSync - else branch:', () => {
    it('should set invalid when parse fails', () => {
      spyOn(component, 'callOnChange');
      component['parseInputAndSync']('invalid/date time');

      expect(component['date']).toBeUndefined();
      expect(component['timeValue']).toBe('');
      expect(component.callOnChange).toHaveBeenCalledWith(component.literals.invalidDatetime);
    });
  });

  describe('parseDateTimeFromInput - null returns:', () => {
    it('should return null when input is empty', () => {
      expect(component['parseDateTimeFromInput']('')).toBeNull();
    });

    it('should return null when date part is invalid', () => {
      expect(component['parseDateTimeFromInput']('99/99/9999 14:30')).toBeNull();
    });

    it('should return null when time part is invalid', () => {
      expect(component['parseDateTimeFromInput']('12/05/2026 99:99')).toBeNull();
    });
  });

  describe('getDateFromFormattedString - null returns:', () => {
    it('should return null when format indices are not found', () => {
      // Force a format without dd/mm/yyyy
      component['_format'] = 'xxxx';
      const separator = '/';
      expect(component['getDateFromFormattedString']('12/05/2026', separator)).toBeNull();
    });

    it('should return null when parsed values are NaN', () => {
      const separator = '/';
      expect(component['getDateFromFormattedString']('ab/cd/efgh', separator)).toBeNull();
    });

    it('should return null when date is inconsistent (e.g. 31/02/2026)', () => {
      const separator = '/';
      expect(component['getDateFromFormattedString']('31/02/2026', separator)).toBeNull();
    });
  });

  describe('parseTimeFromInput:', () => {
    it('should return null when timeStr is empty', () => {
      expect(component['parseTimeFromInput']('')).toBeNull();
    });

    it('should return null when timeStr is null', () => {
      expect(component['parseTimeFromInput'](null)).toBeNull();
    });

    describe('24h format:', () => {
      it('should parse valid HH:mm', () => {
        expect(component['parseTimeFromInput']('14:30')).toBe('14:30');
      });

      it('should parse valid HH:mm:ss', () => {
        expect(component['parseTimeFromInput']('14:30:45')).toBe('14:30:45');
      });

      it('should return null for invalid hours (>23)', () => {
        expect(component['parseTimeFromInput']('25:00')).toBeNull();
      });

      it('should return null for invalid minutes (>59)', () => {
        expect(component['parseTimeFromInput']('14:60')).toBeNull();
      });

      it('should return null for invalid seconds (>59)', () => {
        expect(component['parseTimeFromInput']('14:30:60')).toBeNull();
      });

      it('should return null when parts length is less than 2', () => {
        expect(component['parseTimeFromInput']('14')).toBeNull();
      });

      it('should return null for NaN hours', () => {
        expect(component['parseTimeFromInput']('ab:30')).toBeNull();
      });
    });

    describe('12h format:', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('p-format-time', '12');
        fixture.detectChanges();
      });

      it('should parse valid hh:mm AM', () => {
        const result = component['parseTimeFromInput']('02:30 AM');
        expect(result).toBe('02:30');
      });

      it('should parse valid hh:mm PM', () => {
        const result = component['parseTimeFromInput']('02:30 PM');
        expect(result).toBe('14:30');
      });

      it('should convert 12:00 AM to 00:00', () => {
        const result = component['parseTimeFromInput']('12:00 AM');
        expect(result).toBe('00:00');
      });

      it('should keep 12:00 PM as 12:00', () => {
        const result = component['parseTimeFromInput']('12:00 PM');
        expect(result).toBe('12:00');
      });

      it('should use currentPeriod when AM/PM is not in string', () => {
        component.currentPeriod = 'PM';
        const result = component['parseTimeFromInput']('02:30');
        expect(result).toBe('14:30');
      });

      it('should use AM as default currentPeriod when AM/PM is not in string', () => {
        component.currentPeriod = 'AM';
        const result = component['parseTimeFromInput']('02:30');
        expect(result).toBe('02:30');
      });

      it('should return null for invalid hours (>12)', () => {
        expect(component['parseTimeFromInput']('13:30 AM')).toBeNull();
      });

      it('should return null for invalid hours (<1)', () => {
        expect(component['parseTimeFromInput']('00:30 AM')).toBeNull();
      });

      it('should return null when parts length is less than 2', () => {
        expect(component['parseTimeFromInput']('02 AM')).toBeNull();
      });

      it('should parse hh:mm:ss AM with seconds', () => {
        const result = component['parseTimeFromInput']('02:30:45 AM');
        expect(result).toBe('02:30:45');
      });

      it('should return null for invalid seconds in 12h format', () => {
        expect(component['parseTimeFromInput']('02:30:60 AM')).toBeNull();
      });
    });
  });

  describe('showAdditionalHelp - helperEl branches:', () => {
    it('should close helper popover when helperIsVisible returns true', () => {
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', 'Some help text');
      fixture.detectChanges();

      component['helperEl'] = {
        helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(true),
        closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
        openHelperPopover: jasmine.createSpy('openHelperPopover')
      } as any;

      component.showAdditionalHelp();

      expect(component['helperEl'].closeHelperPopover).toHaveBeenCalled();
      expect(component['helperEl'].openHelperPopover).not.toHaveBeenCalled();
    });

    it('should open helper popover when helperIsVisible returns false', () => {
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', 'Some help text');
      fixture.detectChanges();

      component['helperEl'] = {
        helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(false),
        closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
        openHelperPopover: jasmine.createSpy('openHelperPopover')
      } as any;

      component.showAdditionalHelp();

      expect(component['helperEl'].openHelperPopover).toHaveBeenCalled();
      expect(component['helperEl'].closeHelperPopover).not.toHaveBeenCalled();
    });
  });

  describe('getExpectedInputLength:', () => {
    it('should return 12 for default 24h without seconds', () => {
      fixture.componentRef.setInput('p-show-seconds', false);
      fixture.componentRef.setInput('p-format-time', '24');
      fixture.detectChanges();

      expect(component['getExpectedInputLength']()).toBe(12);
    });

    it('should return 14 when showSeconds is true', () => {
      fixture.componentRef.setInput('p-show-seconds', true);
      fixture.componentRef.setInput('p-format-time', '24');
      fixture.detectChanges();

      expect(component['getExpectedInputLength']()).toBe(14);
    });

    it('should return 12 for 12h format without seconds (AM/PM is separate input)', () => {
      fixture.componentRef.setInput('p-show-seconds', false);
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();

      expect(component['getExpectedInputLength']()).toBe(12);
    });

    it('should return 14 for 12h format with seconds (AM/PM is separate input)', () => {
      fixture.componentRef.setInput('p-show-seconds', true);
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();

      expect(component['getExpectedInputLength']()).toBe(14);
    });
  });

  describe('adjustCalendarPosition - fallback dimensions:', () => {
    it('should use dialogPicker scrollHeight/scrollWidth when no .po-calendar-date-time found', fakeAsync(() => {
      component.visible = true;
      component['dialogPicker'] = {
        nativeElement: {
          querySelector: () => null,
          scrollHeight: 400,
          scrollWidth: 600,
          style: { height: '', width: '', setProperty: jasmine.createSpy('setProperty') }
        }
      } as any;

      spyOn(component['controlPosition'], 'setElements');
      spyOn(component['controlPosition'], 'adjustPosition');

      component['adjustCalendarPosition']();
      tick(20);

      expect(component['dialogPicker'].nativeElement.style.height).toBe('400px');
      expect(component['dialogPicker'].nativeElement.style.width).toBe('600px');
    }));
  });

  describe('initializeListeners:', () => {
    it('should register click listener that calls wasClickedOnPicker', () => {
      spyOn(component, 'wasClickedOnPicker');
      component['initializeListeners']();

      const event = new MouseEvent('click');
      document.dispatchEvent(event);

      expect(component.wasClickedOnPicker).toHaveBeenCalled();
      component['removeListeners']();
    });

    it('should register resize listener that calls closeCalendar', () => {
      spyOn(component, 'closeCalendar');
      component['initializeListeners']();

      window.dispatchEvent(new Event('resize'));

      expect(component.closeCalendar).toHaveBeenCalled();
      component['removeListeners']();
    });

    it('should register scroll listener', () => {
      component.visible = true;
      spyOn(component['controlPosition'], 'adjustPosition');
      component['initializeListeners']();

      const scrollableEl = document.createElement('div');
      document.body.appendChild(scrollableEl);
      scrollableEl.dispatchEvent(new Event('scroll', { bubbles: true }));

      // scroll with capture=true is on window, dispatch on document
      window.dispatchEvent(new Event('scroll'));

      component['removeListeners']();
      scrollableEl.remove();
    });
  });

  describe('onScroll:', () => {
    it('should call adjustPosition when visible', () => {
      component.visible = true;
      spyOn(component['controlPosition'], 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
    });

    it('should not call adjustPosition when not visible', () => {
      component.visible = false;
      spyOn(component['controlPosition'], 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).not.toHaveBeenCalled();
    });
  });

  describe('eventOnButtonKeydown:', () => {
    it('should focus first combo when Tab without Shift, calendar visible, no label, and helper exists', () => {
      component.visible = true;
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', 'test helper');
      fixture.detectChanges();

      const comboInput = document.createElement('input');
      comboInput.classList.add('po-combo-input');
      const comboWrapper = document.createElement('div');
      comboWrapper.classList.add('po-combo-first');
      comboWrapper.appendChild(comboInput);

      component['dialogPicker'] = {
        nativeElement: { querySelector: () => comboInput }
      } as any;

      spyOn(comboInput, 'focus');
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.eventOnButtonKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(comboInput.focus).toHaveBeenCalled();
    });

    it('should not focus combo when calendar is not visible', () => {
      component.visible = false;
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', 'test helper');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      spyOn(event, 'preventDefault');

      component.eventOnButtonKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should not focus combo on Shift+Tab', () => {
      component.visible = true;
      fixture.componentRef.setInput('p-label', undefined);
      fixture.componentRef.setInput('p-helper', 'test helper');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      spyOn(event, 'preventDefault');

      component.eventOnButtonKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onFieldClick:', () => {
    it('should focus input when clicking on wrapper area', () => {
      spyOn(component, 'focus');
      const target = document.createElement('div');

      component.onFieldClick({ target });

      expect(component.focus).toHaveBeenCalled();
    });

    it('should not focus input when clicking on period input', () => {
      spyOn(component, 'focus');
      const periodEl = document.createElement('input');
      const periodWrapper = document.createElement('div');
      periodWrapper.classList.add('po-datetimepicker-field-period');
      periodWrapper.appendChild(periodEl);
      document.body.appendChild(periodWrapper);

      component.onFieldClick({ target: periodEl });

      expect(component.focus).not.toHaveBeenCalled();
      document.body.removeChild(periodWrapper);
    });

    it('should not focus input when clicking on icon container', () => {
      spyOn(component, 'focus');
      const button = document.createElement('button');
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('po-field-icon-container-right');
      iconContainer.appendChild(button);
      document.body.appendChild(iconContainer);

      component.onFieldClick({ target: button });

      expect(component.focus).not.toHaveBeenCalled();
      document.body.removeChild(iconContainer);
    });

    it('should not focus when disabled', () => {
      component['_disabled'] = true;
      spyOn(component, 'focus');

      component.onFieldClick({ target: document.createElement('div') });

      expect(component.focus).not.toHaveBeenCalled();
    });

    it('should not focus when readonly', () => {
      component['_readonly'] = true;
      spyOn(component, 'focus');

      component.onFieldClick({ target: document.createElement('div') });

      expect(component.focus).not.toHaveBeenCalled();
    });
  });

  describe('onPeriodKeydown:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();
    });

    it('should toggle period on ArrowUp', () => {
      component.currentPeriod = 'AM';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.currentPeriod).toBe('PM');
    });

    it('should toggle period on ArrowDown', () => {
      component.currentPeriod = 'PM';
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.currentPeriod).toBe('AM');
    });

    it('should not toggle period when disabled', () => {
      component['_disabled'] = true;
      component.currentPeriod = 'AM';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      component.onPeriodKeydown(event);

      expect(component.currentPeriod).toBe('AM');
    });

    it('should not toggle period when readonly', () => {
      component['_readonly'] = true;
      component.currentPeriod = 'AM';
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      component.onPeriodKeydown(event);

      expect(component.currentPeriod).toBe('AM');
    });

    it('should prevent default on Backspace', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default on Delete', () => {
      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should focus input on Shift+Tab', () => {
      spyOn(component, 'focus');
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.focus).toHaveBeenCalled();
    });

    it('should allow natural tab on Tab without Shift', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block character input', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      spyOn(event, 'preventDefault');

      component.onPeriodKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('onPeriodClick:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();
    });

    it('should toggle period on click', () => {
      component.currentPeriod = 'AM';
      component.onPeriodClick(new MouseEvent('click'));

      expect(component.currentPeriod).toBe('PM');
    });

    it('should not toggle when disabled', () => {
      component['_disabled'] = true;
      component.currentPeriod = 'AM';
      component.onPeriodClick(new MouseEvent('click'));

      expect(component.currentPeriod).toBe('AM');
    });

    it('should not toggle when readonly', () => {
      component['_readonly'] = true;
      component.currentPeriod = 'AM';
      component.onPeriodClick(new MouseEvent('click'));

      expect(component.currentPeriod).toBe('AM');
    });
  });

  describe('togglePeriod:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();
    });

    it('should alternate between AM and PM', () => {
      component.currentPeriod = 'AM';
      component['togglePeriod']();
      expect(component.currentPeriod).toBe('PM');

      component['togglePeriod']();
      expect(component.currentPeriod).toBe('AM');
    });

    it('should emit change when value is complete and period changes', () => {
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '02:30';
      component.inputEl.nativeElement.value = '12/05/2026 02:30';
      component['objMask'] = { valueToModel: '120520260230' } as any;
      component.currentPeriod = 'AM';
      component['valueBeforeChange'] = '';

      spyOn(component.onchange, 'emit');
      component['togglePeriod']();

      expect(component.currentPeriod).toBe('PM');
      expect(component.onchange.emit).toHaveBeenCalled();
    });

    it('should not emit change when input is incomplete', () => {
      component['objMask'] = { valueToModel: '1234' } as any;
      component.inputEl.nativeElement.value = '12/3';
      component.currentPeriod = 'AM';

      spyOn(component.onchange, 'emit');
      component['togglePeriod']();

      expect(component.onchange.emit).not.toHaveBeenCalled();
    });
  });

  describe('clear - triggeredByKeyboard:', () => {
    it('should focus immediately when not triggered by keyboard', () => {
      spyOn(component, 'focus');
      component.clear(false);

      expect(component.focus).toHaveBeenCalled();
    });

    it('should focus after timeout when triggered by keyboard', fakeAsync(() => {
      spyOn(component, 'focus');
      component.clear(true);

      expect(component.focus).not.toHaveBeenCalled();
      tick(200);
      expect(component.focus).toHaveBeenCalled();
    }));

    it('should reset currentPeriod to AM', () => {
      component.currentPeriod = 'PM';
      component.clear();

      expect(component.currentPeriod).toBe('AM');
    });
  });

  describe('writeValue - valueBeforeChange sync:', () => {
    it('should sync valueBeforeChange with model value to prevent spurious p-change on blur', () => {
      component['valueBeforeChange'] = '';
      component.writeValue('2026-06-20T08:30:00-03:00');

      expect(component['valueBeforeChange']).toBe(component.getModelValue());
    });

    it('should set valueBeforeChange to empty string when writeValue receives falsy value', () => {
      component['valueBeforeChange'] = '2026-06-20T08:30:00-03:00';
      component.writeValue(null);

      expect(component['valueBeforeChange']).toBe('');
    });

    it('should not emit p-change on blur when value was not modified after writeValue', () => {
      component.writeValue('2026-06-20T08:30:00-03:00');

      const displayedValue = component.inputEl.nativeElement.value;
      const valueToModel = displayedValue.replace(/\D/g, '');

      spyOn(component.onchange, 'emit');
      component['objMask'] = {
        blur: jasmine.createSpy('blur'),
        valueToModel: valueToModel
      } as any;
      component.inputEl.nativeElement.value = displayedValue;

      component.eventOnBlur({ target: component.inputEl.nativeElement });

      expect(component.onchange.emit).not.toHaveBeenCalled();
    });
  });

  describe('syncCalendarAndTimer - reset behavior:', () => {
    it('should reset calendar when date is undefined', () => {
      const writeValueSpy = jasmine.createSpy('writeValue');
      component['calendarComponent'] = { writeValue: writeValueSpy, timerComponent: null } as any;
      component['date'] = undefined;

      component['syncCalendarAndTimer']();

      expect(writeValueSpy).toHaveBeenCalledWith(null);
    });

    it('should reset both calendar and timer when date is undefined and timer exists', () => {
      const calendarWriteValue = jasmine.createSpy('calendarWriteValue');
      const timerWriteValue = jasmine.createSpy('timerWriteValue');
      component['calendarComponent'] = {
        writeValue: calendarWriteValue,
        timerComponent: { writeValue: timerWriteValue }
      } as any;
      component['date'] = undefined;

      component['syncCalendarAndTimer']();

      expect(calendarWriteValue).toHaveBeenCalledWith(null);
      expect(timerWriteValue).toHaveBeenCalledWith(null);
    });

    it('should sync calendar with date and timer with time when both exist', () => {
      const calendarWriteValue = jasmine.createSpy('calendarWriteValue');
      const timerWriteValue = jasmine.createSpy('timerWriteValue');
      const date = new Date(2026, 4, 12);
      component['calendarComponent'] = {
        writeValue: calendarWriteValue,
        timerComponent: { writeValue: timerWriteValue }
      } as any;
      component['date'] = date;
      component['timeValue'] = '14:30';

      component['syncCalendarAndTimer']();

      expect(calendarWriteValue).toHaveBeenCalledWith(date);
      expect(timerWriteValue).toHaveBeenCalledWith('14:30');
    });

    it('should reset timer when date exists but timeValue is empty', () => {
      const calendarWriteValue = jasmine.createSpy('calendarWriteValue');
      const timerWriteValue = jasmine.createSpy('timerWriteValue');
      component['calendarComponent'] = {
        writeValue: calendarWriteValue,
        timerComponent: { writeValue: timerWriteValue }
      } as any;
      component['date'] = new Date(2026, 4, 12);
      component['timeValue'] = '';

      component['syncCalendarAndTimer']();

      expect(calendarWriteValue).toHaveBeenCalledWith(component['date']);
      expect(timerWriteValue).toHaveBeenCalledWith(null);
    });

    it('should return early when calendarComponent is undefined', () => {
      component['calendarComponent'] = undefined;
      expect(() => component['syncCalendarAndTimer']()).not.toThrow();
    });
  });

  describe('refreshValue - currentPeriod sync:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();
    });

    it('should set currentPeriod to PM when hours >= 12', () => {
      component['timeValue'] = '14:30';
      component.currentPeriod = 'AM';

      component.refreshValue(new Date(2026, 4, 12));

      expect(component.currentPeriod).toBe('PM');
    });

    it('should set currentPeriod to AM when hours < 12', () => {
      component['timeValue'] = '09:30';
      component.currentPeriod = 'PM';

      component.refreshValue(new Date(2026, 4, 12));

      expect(component.currentPeriod).toBe('AM');
    });

    it('should not change currentPeriod when timeValue is empty', () => {
      component['timeValue'] = '';
      component.currentPeriod = 'PM';

      component.refreshValue(new Date(2026, 4, 12));

      expect(component.currentPeriod).toBe('PM');
    });
  });

  describe('parseInputAndSync - currentPeriod sync:', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('p-format-time', '12');
      fixture.detectChanges();
    });

    it('should set currentPeriod to PM when parsed time is >= 12:00', () => {
      component.currentPeriod = 'AM';
      component.inputEl.nativeElement.value = '12/05/2026 02:30 PM';

      component['parseInputAndSync']('12/05/2026 02:30 PM');

      expect(component.currentPeriod).toBe('PM');
    });

    it('should set currentPeriod to AM when parsed time is < 12:00', () => {
      component.currentPeriod = 'PM';
      component.inputEl.nativeElement.value = '12/05/2026 10:30 AM';

      component['parseInputAndSync']('12/05/2026 10:30 AM');

      expect(component.currentPeriod).toBe('AM');
    });
  });

  describe('isInputFocused:', () => {
    it('should initialize as false', () => {
      expect(component.isInputFocused).toBe(false);
    });

    it('should apply po-datetimepicker-field-focused class when isInputFocused is true', () => {
      component.isInputFocused = true;
      fixture.detectChanges();

      const fieldElement = nativeElement.querySelector('.po-datetimepicker-field');
      expect(fieldElement.classList.contains('po-datetimepicker-field-focused')).toBe(true);
    });

    it('should not apply po-datetimepicker-field-focused class when isInputFocused is false', () => {
      component.isInputFocused = false;
      fixture.detectChanges();

      const fieldElement = nativeElement.querySelector('.po-datetimepicker-field');
      expect(fieldElement.classList.contains('po-datetimepicker-field-focused')).toBe(false);
    });
  });

  describe('onInputFocus:', () => {
    it('should set isInputFocused to true', () => {
      component.isInputFocused = false;

      component.onInputFocus();

      expect(component.isInputFocused).toBe(true);
    });
  });

  describe('onPeriodBlur:', () => {
    it('should set isInputFocused to false', () => {
      component.isInputFocused = true;

      component.onPeriodBlur();

      expect(component.isInputFocused).toBe(false);
    });
  });

  describe('eventOnBlur - isInputFocused:', () => {
    it('should set isInputFocused to false on blur', () => {
      component.isInputFocused = true;
      component['objMask'] = { blur: jasmine.createSpy('blur'), valueToModel: '' } as any;
      component.inputEl.nativeElement.value = '';

      const event = { target: component.inputEl.nativeElement };
      component.eventOnBlur(event);

      expect(component.isInputFocused).toBe(false);
    });
  });

  describe('focus integration with isInputFocused:', () => {
    it('should set isInputFocused to true when onInputFocus is called via template binding', () => {
      component.isInputFocused = false;
      fixture.detectChanges();

      component.onInputFocus();
      fixture.detectChanges();

      const fieldElement = nativeElement.querySelector('.po-datetimepicker-field');
      expect(component.isInputFocused).toBe(true);
      expect(fieldElement.classList.contains('po-datetimepicker-field-focused')).toBe(true);
    });

    it('should set isInputFocused to false when eventOnBlur is triggered', () => {
      component.isInputFocused = true;
      component['objMask'] = { blur: jasmine.createSpy('blur'), valueToModel: '' } as any;
      component.inputEl.nativeElement.value = '';
      fixture.detectChanges();

      component.eventOnBlur({ target: component.inputEl.nativeElement });
      fixture.detectChanges();

      const fieldElement = nativeElement.querySelector('.po-datetimepicker-field');
      expect(component.isInputFocused).toBe(false);
      expect(fieldElement.classList.contains('po-datetimepicker-field-focused')).toBe(false);
    });
  });
});
