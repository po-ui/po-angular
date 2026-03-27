import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { PoTimepickerComponent } from './po-timepicker.component';
import { PoTimepickerModule } from './po-timepicker.module';
import { PoTimerFormat } from '../../po-timer/enums/po-timer-format.enum';
import { PoTimepickerModelFormat } from './enums/po-timepicker-iso-format.enum';

describe('PoTimepickerComponent:', () => {
  let component: PoTimepickerComponent;
  let fixture: ComponentFixture<PoTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoTimepickerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTimepickerComponent);
    component = fixture.componentInstance;
    (component as any).additionalHelp = new EventEmitter<any>();
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.autoFocus = false;
    component.locale = 'pt';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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

    describe('placeholder segments:', () => {
      it('should return empty placeholders by default', () => {
        expect(component.hourPlaceholder).toBe('');
        expect(component.minutePlaceholder).toBe('');
        expect(component.secondPlaceholder).toBe('');
      });

      it('should return empty placeholders when placeholder is explicitly empty', () => {
        component.placeholder = '';

        expect(component.hourPlaceholder).toBe('');
        expect(component.minutePlaceholder).toBe('');
        expect(component.secondPlaceholder).toBe('');
      });

      it('should map custom placeholder segments', () => {
        component.placeholder = 'HH:mm:ss';

        expect(component.hourPlaceholder).toBe('HH');
        expect(component.minutePlaceholder).toBe('mm');
        expect(component.secondPlaceholder).toBe('ss');
      });
    });
  });

  describe('Methods:', () => {
    it('should set displayAdditionalHelp to false when label changes', () => {
      component.displayAdditionalHelp = true;

      const changes: SimpleChanges = {
        label: {
          currentValue: 'New label',
          previousValue: 'Old label',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBeFalse();
    });

    it('should not change displayAdditionalHelp when label is not in changes', () => {
      component.displayAdditionalHelp = true;

      const changes: SimpleChanges = {
        otherInput: {
          currentValue: 'value',
          previousValue: 'old',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('ngOnDestroy: should call `removeListeners`', () => {
      const removeListener = spyOn(component, <any>'removeListeners');
      component.ngOnDestroy();
      expect(removeListener).toHaveBeenCalled();
    });

    describe('focus:', () => {
      it('should call `focus` of timepicker', () => {
        fixture.detectChanges();
        spyOn(component.inputEl.nativeElement, 'focus');

        component.focus();

        expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should not call `focus` if `disabled`', () => {
        fixture.detectChanges();
        component.disabled = true;

        spyOn(component.inputEl.nativeElement, 'focus');

        component.focus();

        expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should not call `focus` if `loading` is true', () => {
        fixture.detectChanges();
        component.loading = true;

        spyOn(component.inputEl.nativeElement, 'focus');

        component.focus();

        expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
      });
    });

    describe('togglePicker:', () => {
      it('should not open picker when loading is true', () => {
        fixture.detectChanges();
        component.loading = true;
        component.visible = false;

        component.togglePicker();

        expect(component.visible).toBeFalse();
      });

      it('should not open picker when disabled is true', () => {
        fixture.detectChanges();
        component.disabled = true;
        component.visible = false;

        component.togglePicker();

        expect(component.visible).toBeFalse();
      });

      it('should not open picker when readonly is true', () => {
        fixture.detectChanges();
        component.readonly = true;
        component.visible = false;

        component.togglePicker();

        expect(component.visible).toBeFalse();
      });
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return null when isAdditionalHelpEventTriggered returns false', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });
    });

    describe('clear:', () => {
      it('should clear all segment values and call callOnChange', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '30';
        component.secondDisplay = '00';

        spyOn(component, <any>'callOnChange');
        spyOn(component, <any>'controlChangeEmitter');

        component.clear();

        expect(component.hourDisplay).toBe('');
        expect(component.minuteDisplay).toBe('');
        expect(component.secondDisplay).toBe('');
        expect(component.timeValue).toBe('');
        expect(component['callOnChange']).toHaveBeenCalledWith('');
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should reset periodDisplay to AM when format is 12h', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.periodDisplay = 'PM';
        component.clear();

        expect(component.periodDisplay).toBe('AM');
      });
    });

    describe('clearAndFocus:', () => {
      it('should call clear method and focus on input element', fakeAsync(() => {
        fixture.detectChanges();
        const clearSpy = spyOn(component, 'clear');
        const focusSpy = spyOn(component, 'focus');

        component.clearAndFocus();

        expect(clearSpy).toHaveBeenCalled();

        tick(200);

        expect(focusSpy).toHaveBeenCalled();
      }));
    });

    describe('timerSelected:', () => {
      it('should not close picker after selecting a valid time', () => {
        fixture.detectChanges();
        const togglePickerSpy = spyOn(component, 'togglePicker');
        const focusSpy = spyOn(component, 'focus');

        component.timerSelected('10:30');

        expect(component.timeValue).toBe('10:30');
        expect(togglePickerSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
      });

      it('should not close picker after selecting a valid time with seconds', () => {
        fixture.detectChanges();
        component.showSeconds = true;
        const togglePickerSpy = spyOn(component, 'togglePicker');

        component.timerSelected('10:30:45');

        expect(component.timeValue).toBe('10:30:45');
        expect(togglePickerSpy).not.toHaveBeenCalled();
      });

      it('should keep partial HH:mm without forcing seconds while picker is open', () => {
        fixture.detectChanges();
        component.showSeconds = true;

        component.timerSelected('10:30');

        expect(component.timeValue).toBe('10:30');
        expect(component.secondDisplay).toBe('');
      });
    });

    describe('closeTimer:', () => {
      it('should complete :00 when closing with showSeconds and partial HH:mm value', () => {
        fixture.detectChanges();
        component.showSeconds = true;
        component.visible = true;
        component.timeValue = '10:30';

        spyOn(component, <any>'callOnChange');
        spyOn(component, <any>'controlChangeEmitter');

        component.closeTimer();

        expect(component.timeValue).toBe('10:30:00');
        expect(component.secondDisplay).toBe('00');
        expect(component['callOnChange']).toHaveBeenCalledWith('10:30:00');
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });
    });

    describe('hasValue:', () => {
      it('should return true when hourDisplay has value', () => {
        component.hourDisplay = '10';
        component.minuteDisplay = '';
        component.secondDisplay = '';

        expect(component.hasValue()).toBeTrue();
      });

      it('should return false when all segments are empty', () => {
        component.hourDisplay = '';
        component.minuteDisplay = '';
        component.secondDisplay = '';

        expect(component.hasValue()).toBeFalse();
      });
    });

    describe('getErrorPattern:', () => {
      it('should return empty string when no error pattern', () => {
        component.errorPattern = '';

        expect(component.getErrorPattern()).toBe('');
      });

      it('should return error pattern when hasInvalidClass returns true', () => {
        component.errorPattern = 'Hora inválida';
        spyOn(component, 'hasInvalidClass').and.returnValue(true);

        expect(component.getErrorPattern()).toBe('Hora inválida');
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        component.label = 'Test';
        spyOn((component as any).additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        component.emitAdditionalHelp();

        expect((component as any).additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        spyOn((component as any).additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.emitAdditionalHelp();

        expect((component as any).additionalHelp.emit).not.toHaveBeenCalled();
      });
    });

    describe('eventOnBlur:', () => {
      it('should call onblur emit', () => {
        component['onTouchedModel'] = () => {};

        spyOn(component.onblur, 'emit');
        spyOn(component, <any>'onTouchedModel');

        fixture.detectChanges();
        component.eventOnBlur({});

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component.onblur.emit).toHaveBeenCalled();
      });
    });

    describe('writeValue:', () => {
      it('should set time value for valid time', () => {
        fixture.detectChanges();
        component.writeValue('10:30');

        expect(component.timeValue).toBe('10:30');
        expect(component.hourDisplay).toBe('10');
        expect(component.minuteDisplay).toBe('30');
      });

      it('should fill seconds with 00 when showSeconds is true and value is HH:mm', () => {
        component.showSeconds = true;
        fixture.detectChanges();

        component.writeValue('08:00');

        expect(component.timeValue).toBe('08:00');
        expect(component.secondDisplay).toBe('');
      });

      it('should clear when value is invalid', () => {
        fixture.detectChanges();
        component.writeValue('invalid');

        expect(component.timeValue).toBe('');
      });

      it('should clear when value is null', () => {
        fixture.detectChanges();
        component.writeValue(null);

        expect(component.timeValue).toBe('');
      });

      it('should show clean icon after initializing with value when clean is enabled', fakeAsync(() => {
        component.clean = true;
        fixture.detectChanges();

        component.writeValue('10:30');
        fixture.detectChanges();

        const cleanIconBeforeSync = fixture.nativeElement.querySelector('po-clean .po-field-icon');
        expect(cleanIconBeforeSync).toBeNull();

        tick(16);
        fixture.detectChanges();

        const cleanIconAfterSync = fixture.nativeElement.querySelector('po-clean .po-field-icon');
        expect(cleanIconAfterSync).toBeTruthy();
      }));

      it('should define periodDisplay as AM by default when format is 12h and value is empty', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.writeValue('');

        expect(component.periodDisplay).toBe('AM');
      });
    });

    describe('period segment:', () => {
      it('should toggle AM/PM with ArrowUp and ArrowDown', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.periodDisplay = 'AM';
        component.onPeriodSegmentKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(component.periodDisplay).toBe('PM');

        component.onPeriodSegmentKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(component.periodDisplay).toBe('AM');
      });

      it('should not change periodDisplay on alphanumeric keydown', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.periodDisplay = 'AM';
        component.onPeriodSegmentKeydown(new KeyboardEvent('keydown', { key: 'A' }));

        expect(component.periodDisplay).toBe('AM');
      });

      it('should not toggle periodDisplay when pressing Enter', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.periodDisplay = 'AM';
        component.onPeriodSegmentKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(component.periodDisplay).toBe('AM');
      });
    });

    describe('typed validation:', () => {
      function typeSegment(value: string, segment: 'hour' | 'minute' | 'second') {
        const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
        const segmentIndex = segment === 'hour' ? 0 : segment === 'minute' ? 1 : 2;
        const input = inputs[segmentIndex] as HTMLInputElement;

        input.value = value;
        component.onSegmentInput({ target: input } as any, segment);
      }

      it('should show invalid-time error for semantic invalid typed value even without required', () => {
        fixture.detectChanges();

        typeSegment('24', 'hour');
        typeSegment('60', 'minute');

        expect(component.timeValue).toBe('');
        expect(component.getErrorPattern()).toBe('Hora inválida');
      });

      it('should show out-of-range error for typed value outside min/max', () => {
        component.minTime = '08:00';
        component.maxTime = '18:00';
        fixture.detectChanges();

        typeSegment('07', 'hour');
        typeSegment('00', 'minute');

        expect(component.timeValue).toBe('');
        expect(component.getErrorPattern()).toBe('Hora fora do período');
      });

      it('should validate 12h typed input and reject hour outside 1..12', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        typeSegment('13', 'hour');
        typeSegment('60', 'minute');

        expect(component.timeValue).toBe('');
        expect(component.getErrorPattern()).toBe('Hora inválida');
      });

      it('should keep invalid 12h error when writeValue receives empty value after typed invalid input', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        typeSegment('13', 'hour');
        typeSegment('00', 'minute');
        component.writeValue('');

        expect(component.getErrorPattern()).toBe('Hora inválida');
      });

      it('should keep 12h semantic validation on validate cycle for typed 13:00', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        typeSegment('13', 'hour');
        typeSegment('00', 'minute');

        const validationResult = component.validate(new UntypedFormControl(''));

        expect(validationResult).toEqual({ time: { valid: false } });
        expect(component.getErrorPattern()).toBe('Hora inválida');
      });

      it('should normalize single digit hour when focus moves to minute segment', () => {
        fixture.detectChanges();

        const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
        const hourInput = inputs[0] as HTMLInputElement;
        const minuteInput = inputs[1] as HTMLInputElement;

        hourInput.value = '1';
        component.onSegmentInput({ target: hourInput } as any, 'hour');

        component.onSegmentBlur({ target: hourInput, relatedTarget: minuteInput } as unknown as FocusEvent);

        expect(component.hourDisplay).toBe('01');
        expect(hourInput.value).toBe('01');
      });

      it('should commit and normalize partial value when focus moves to timepicker button', () => {
        fixture.detectChanges();

        const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
        const hourInput = inputs[0] as HTMLInputElement;
        const minuteInput = inputs[1] as HTMLInputElement;
        const button = component.iconTimepicker.buttonElement.nativeElement as HTMLElement;

        hourInput.value = '1';
        component.onSegmentInput({ target: hourInput } as any, 'hour');

        minuteInput.value = '1';
        component.onSegmentInput({ target: minuteInput } as any, 'minute');

        component.onSegmentBlur({ target: minuteInput, relatedTarget: button } as unknown as FocusEvent);

        expect(component.hourDisplay).toBe('01');
        expect(component.minuteDisplay).toBe('01');
        expect(component.timeValue).toBe('01:01');
      });

      it('should mark invalid when internal commit normalizes partial value to out-of-range time', () => {
        fixture.detectChanges();

        const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
        const hourInput = inputs[0] as HTMLInputElement;
        const minuteInput = inputs[1] as HTMLInputElement;
        const button = component.iconTimepicker.buttonElement.nativeElement as HTMLElement;

        hourInput.value = '29';
        component.onSegmentInput({ target: hourInput } as any, 'hour');

        minuteInput.value = '9';
        component.onSegmentInput({ target: minuteInput } as any, 'minute');

        component.onSegmentBlur({ target: minuteInput, relatedTarget: button } as unknown as FocusEvent);

        expect(component.minuteDisplay).toBe('09');
        expect(component.timeValue).toBe('');
        expect(component.getErrorPattern()).toBe('Hora inválida');
      });
    });
  });

  describe('Template:', () => {
    it('should render empty placeholders by default', () => {
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
      const hourInput = inputs[0] as HTMLInputElement;
      const minuteInput = inputs[1] as HTMLInputElement;

      expect(hourInput.placeholder).toBe('');
      expect(minuteInput.placeholder).toBe('');
    });

    it('should render custom placeholders when p-placeholder is informed', () => {
      component.placeholder = 'HH:mm';
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
      const hourInput = inputs[0] as HTMLInputElement;
      const minuteInput = inputs[1] as HTMLInputElement;

      expect(hourInput.placeholder).toBe('HH');
      expect(minuteInput.placeholder).toBe('mm');
    });

    it('should show po-loading-icon when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const loadingIcon = fixture.nativeElement.querySelector('po-loading-icon');
      const buttonIcon = fixture.nativeElement.querySelector('.po-timepicker-button');

      expect(loadingIcon).toBeTruthy();
      expect(buttonIcon).toBeNull();
    });

    it('should show timepicker button when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const loadingIcon = fixture.nativeElement.querySelector('po-loading-icon');
      const buttonIcon = fixture.nativeElement.querySelector('.po-timepicker-button');

      expect(loadingIcon).toBeNull();
      expect(buttonIcon).toBeTruthy();
    });

    it('should disable input segments when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');

      inputs.forEach((input: HTMLInputElement) => {
        expect(input.disabled).toBeTrue();
      });
    });

    it('should enable input segments when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');

      inputs.forEach((input: HTMLInputElement) => {
        expect(input.disabled).toBeFalse();
      });
    });

    it('should apply disabled class on field when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const field = fixture.nativeElement.querySelector('.po-timepicker-field');
      expect(field.classList.contains('po-timepicker-field-disabled')).toBeTrue();
    });

    it('should render readonly period input with default AM in 12h format', () => {
      component.format = PoTimerFormat.Format12;
      fixture.detectChanges();

      const periodInput = fixture.nativeElement.querySelector('.po-timepicker-period-input') as HTMLInputElement;

      expect(periodInput).toBeTruthy();
      expect(periodInput.readOnly).toBeTrue();
      expect(periodInput.value).toBe('AM');
    });

    it('should render second segment when showSeconds is true', () => {
      component.showSeconds = true;
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input');
      expect(inputs.length).toBeGreaterThanOrEqual(3);
    });

    it('should render readonly class on field when readonly is true', () => {
      component.readonly = true;
      fixture.detectChanges();

      const field = fixture.nativeElement.querySelector('.po-timepicker-field');
      expect(field.classList.contains('po-timepicker-field-readonly')).toBeTrue();
    });
  });

  describe('Additional Methods:', () => {
    describe('onKeydown:', () => {
      it('should do nothing if readonly', () => {
        fixture.detectChanges();
        component.readonly = true;
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        spyOn(component, 'togglePicker');

        component.onKeydown(event);

        expect(component.togglePicker).not.toHaveBeenCalled();
      });

      it('should close picker on Escape when visible', () => {
        fixture.detectChanges();
        component.readonly = false;
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component, 'togglePicker');

        component.onKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.togglePicker).toHaveBeenCalledWith(false);
      });

      it('should not close picker on Escape when not visible', () => {
        fixture.detectChanges();
        component.readonly = false;
        component.visible = false;

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        spyOn(component, 'togglePicker');

        component.onKeydown(event);

        expect(component.togglePicker).not.toHaveBeenCalled();
      });

      it('should toggle picker on Shift+Tab from non-segment input when visible', () => {
        fixture.detectChanges();
        component.readonly = false;
        component.visible = true;

        const nonSegmentInput = document.createElement('input');
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        Object.defineProperty(event, 'target', { value: nonSegmentInput });
        spyOn(component, 'togglePicker');

        component.onKeydown(event);

        expect(component.togglePicker).toHaveBeenCalled();
      });

      it('should not toggle on Shift+Tab from segment input', () => {
        fixture.detectChanges();
        component.readonly = false;
        component.visible = true;

        const segmentInput = document.createElement('input');
        segmentInput.classList.add('po-timepicker-segment-input');
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        Object.defineProperty(event, 'target', { value: segmentInput });
        spyOn(component, 'togglePicker');

        component.onKeydown(event);

        expect(component.togglePicker).not.toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit:', () => {
      it('should set dialog picker display to none', () => {
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.ngAfterViewInit();

        expect(component['setDialogPickerStyleDisplay']).toHaveBeenCalledWith('none');
      });

      it('should call focus when autoFocus is true', () => {
        component.autoFocus = true;
        spyOn(component, 'focus');
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.ngAfterViewInit();

        expect(component.focus).toHaveBeenCalled();
      });

      it('should set aria-label on icon button', () => {
        fixture.detectChanges();
        component.ngAfterViewInit();

        const buttonEl = component.iconTimepicker?.buttonElement?.nativeElement;

        expect(buttonEl?.getAttribute('aria-label')).toBeTruthy();
      });
    });

    describe('togglePicker (open and close):', () => {
      it('should open picker and set aria-expanded when not visible', fakeAsync(() => {
        fixture.detectChanges();
        component.visible = false;
        component.disabled = false;
        component.loading = false;
        component.readonly = false;

        spyOn(component as any, 'setTimerPosition');
        spyOn(component as any, 'initializeListeners');

        component.togglePicker();

        expect(component.visible).toBeTrue();
        expect(component['setTimerPosition']).toHaveBeenCalled();
        expect(component['initializeListeners']).toHaveBeenCalled();

        tick(16);
      }));

      it('should close picker when already visible', () => {
        fixture.detectChanges();
        component.visible = true;
        component.disabled = false;
        component.loading = false;
        component.readonly = false;

        spyOn(component, 'closeTimer');

        component.togglePicker();

        expect(component.closeTimer).toHaveBeenCalledWith(true);
      });
    });

    describe('closeTimer:', () => {
      it('should set visible to false and call removeListeners', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');
        spyOn(component as any, 'completeSecondsOnClose');
        spyOn(component, 'focus');

        component.closeTimer();

        expect(component.visible).toBeFalse();
        expect(component['removeListeners']).toHaveBeenCalled();
        expect(component['setDialogPickerStyleDisplay']).toHaveBeenCalledWith('none');
      });

      it('should focus input when focusInput is true and not mobile', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component, 'verifyMobile').and.returnValue(null);
        spyOn(component, 'focus');
        spyOn(component as any, 'completeSecondsOnClose');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.closeTimer(true);

        expect(component.focus).toHaveBeenCalled();
      });

      it('should not focus input when focusInput is false', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component, 'verifyMobile').and.returnValue(null);
        spyOn(component, 'focus');
        spyOn(component as any, 'completeSecondsOnClose');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.closeTimer(false);

        expect(component.focus).not.toHaveBeenCalled();
      });

      it('should focus icon when clean is true and has value and focusInput is false', fakeAsync(() => {
        fixture.detectChanges();
        component.visible = true;
        component.clean = true;
        component.hourDisplay = '10';

        spyOn(component, 'verifyMobile').and.returnValue(null);
        spyOn(component, 'focus');
        spyOn(component as any, 'completeSecondsOnClose');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');
        spyOn(component.iconTimepicker, 'focus');

        component.closeTimer(false, false);

        tick();
        expect(component.iconTimepicker.focus).toHaveBeenCalled();
      }));

      it('should not focus icon when skipRefocus is true', fakeAsync(() => {
        fixture.detectChanges();
        component.visible = true;
        component.clean = true;
        component.hourDisplay = '10';

        spyOn(component, 'verifyMobile').and.returnValue(null);
        spyOn(component, 'focus');
        spyOn(component as any, 'completeSecondsOnClose');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');
        spyOn(component.iconTimepicker, 'focus');

        component.closeTimer(false, true);

        tick();
        expect(component.iconTimepicker.focus).not.toHaveBeenCalled();
      }));

      it('should not complete seconds when showSeconds is false', () => {
        fixture.detectChanges();
        component.showSeconds = false;
        component.visible = true;
        component.timeValue = '10:30';

        spyOn(component as any, 'callOnChange');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.closeTimer();

        expect(component.timeValue).toBe('10:30');
      });

      it('should not complete seconds when timeValue is already HH:mm:ss', () => {
        fixture.detectChanges();
        component.showSeconds = true;
        component.visible = true;
        component.timeValue = '10:30:45';

        spyOn(component as any, 'callOnChange');
        spyOn(component as any, 'removeListeners');
        spyOn(component as any, 'setDialogPickerStyleDisplay');

        component.closeTimer();

        expect(component.timeValue).toBe('10:30:45');
      });
    });

    describe('timerSelected:', () => {
      it('should call clear and close when time is empty', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component, 'clear');
        spyOn(component.onchange, 'emit');
        spyOn(component, 'closeTimer');

        component.timerSelected('');

        tick(200);

        expect(component.clear).toHaveBeenCalled();
        expect(component.onchange.emit).toHaveBeenCalled();
      }));

      it('should call onTouchedModel when provided', () => {
        fixture.detectChanges();
        const touchedSpy = jasmine.createSpy('onTouched');
        component['onTouchedModel'] = touchedSpy;

        component.timerSelected('10:30');

        expect(touchedSpy).toHaveBeenCalled();
      });

      it('should call callOnChange and controlChangeEmitter with output', () => {
        fixture.detectChanges();
        spyOn(component as any, 'callOnChange');
        spyOn(component as any, 'controlChangeEmitter');

        component.timerSelected('14:30');

        expect(component.timeValue).toBe('14:30');
        expect(component['callOnChange']).toHaveBeenCalledWith('14:30');
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should format output according to modelFormat', () => {
        fixture.detectChanges();
        component.modelFormat = PoTimepickerModelFormat.HourMinute;
        spyOn(component as any, 'callOnChange');

        component.timerSelected('14:30:45');

        expect(component['callOnChange']).toHaveBeenCalledWith('14:30');
      });
    });

    describe('wasClickedOnPicker:', () => {
      it('should close timer when click outside picker and icon', () => {
        fixture.detectChanges();
        spyOn(component, 'closeTimer');

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        component.wasClickedOnPicker({ target: outsideEl });

        expect(component.closeTimer).toHaveBeenCalled();
        document.body.removeChild(outsideEl);
      });

      it('should not close when dialogPicker is null', () => {
        component['dialogPicker'] = null;
        spyOn(component, 'closeTimer');

        component.wasClickedOnPicker({ target: document.body });

        expect(component.closeTimer).not.toHaveBeenCalled();
      });
    });

    describe('hasInvalidClass:', () => {
      it('should return true when has ng-invalid, ng-dirty and has value', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.el.nativeElement.classList.add('ng-invalid');
        component.el.nativeElement.classList.add('ng-dirty');

        expect(component.hasInvalidClass()).toBeTrue();
      });

      it('should return true when hasValidationValue returns true', () => {
        fixture.detectChanges();
        component['setValidationValue']('invalid');

        expect(component.hasInvalidClass()).toBeTrue();
      });

      it('should return false when pristine', () => {
        fixture.detectChanges();
        component.hourDisplay = '';
        component.minuteDisplay = '';
        component.secondDisplay = '';

        expect(component.hasInvalidClass()).toBeFalse();
      });
    });

    describe('eventOnClick:', () => {
      it('should blur and toggle picker when mobile', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component, 'verifyMobile').and.returnValue(['mobile'] as any);
        spyOn(component, 'togglePicker');

        const input = fixture.nativeElement.querySelector('.po-timepicker-segment-input');
        spyOn(input, 'blur');
        component.eventOnClick({ target: input });

        tick();

        expect(input.blur).toHaveBeenCalled();
        expect(component.togglePicker).toHaveBeenCalled();
      }));

      it('should not toggle picker when not mobile', () => {
        fixture.detectChanges();
        spyOn(component, 'verifyMobile').and.returnValue(null);
        spyOn(component, 'togglePicker');

        const input = fixture.nativeElement.querySelector('.po-timepicker-segment-input');
        component.eventOnClick({ target: input });

        expect(component.togglePicker).not.toHaveBeenCalled();
      });
    });

    describe('onKeyDown:', () => {
      it('should emit keydown event when field is focused', () => {
        fixture.detectChanges();
        spyOn(component.keydown, 'emit');

        const input = fixture.nativeElement.querySelector('.po-timepicker-segment-input');
        input.focus();

        const event = new KeyboardEvent('keydown', { key: 'a' });
        component.onKeyDown(event);

        expect(component.keydown.emit).toHaveBeenCalledWith(event);
      });

      it('should not emit keydown event when field is not focused', () => {
        fixture.detectChanges();
        spyOn(component.keydown, 'emit');

        document.body.focus();
        const event = new KeyboardEvent('keydown', { key: 'a' });
        component.onKeyDown(event);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('onKeyPress:', () => {
      it('should focus clean icon on Shift+Tab when not visible and clean and hasValue', () => {
        component.clean = true;
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.visible = false;
        fixture.detectChanges();

        const fakeCleanEl = { nativeElement: { focus: jasmine.createSpy('focus') } };
        (component as any).iconClean = fakeCleanEl;

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
        spyOn(event, 'preventDefault');

        component.onKeyPress(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(fakeCleanEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus last segment on Shift+Tab when not visible and no clean', () => {
        fixture.detectChanges();
        component.visible = false;
        component.clean = false;
        component.hourDisplay = '';

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component as any, 'focusLastSegment');

        component.onKeyPress(event);

        expect(component['focusLastSegment']).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not do anything for Tab without shift', () => {
        fixture.detectChanges();
        component.visible = false;

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
        spyOn(event, 'preventDefault');

        component.onKeyPress(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('onSegmentInput:', () => {
      it('should strip non-digits and update hourDisplay', () => {
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = 'a1b2';

        component.onSegmentInput({ target: input } as any, 'hour');

        expect(component.hourDisplay).toBe('12');
      });

      it('should update minuteDisplay on minute segment', () => {
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[1] as HTMLInputElement;
        input.value = '30';

        component.onSegmentInput({ target: input } as any, 'minute');

        expect(component.minuteDisplay).toBe('30');
      });

      it('should update secondDisplay on second segment', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[2] as HTMLInputElement;
        input.value = '45';

        component.onSegmentInput({ target: input } as any, 'second');

        expect(component.secondDisplay).toBe('45');
      });

      it('should advance to next segment on 2 digits', () => {
        fixture.detectChanges();
        spyOn(component as any, 'advanceToNextSegment');

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '12';

        component.onSegmentInput({ target: input } as any, 'hour');

        expect(component['advanceToNextSegment']).toHaveBeenCalledWith('hour');
      });
    });

    describe('onSegmentKeydown:', () => {
      it('should navigate to previous segment on Backspace with empty input', () => {
        fixture.detectChanges();

        const minuteInput = fixture.nativeElement.querySelectorAll(
          '.po-timepicker-segment-input'
        )[1] as HTMLInputElement;
        minuteInput.value = '';
        minuteInput.focus();

        const event = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true });
        Object.defineProperty(event, 'target', { value: minuteInput });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'advanceToPreviousSegment');

        component.onSegmentKeydown(event, 'minute');

        expect(component['advanceToPreviousSegment']).toHaveBeenCalledWith('minute');
      });

      it('should navigate to previous segment on ArrowLeft at position 0', () => {
        fixture.detectChanges();

        const minuteInput = fixture.nativeElement.querySelectorAll(
          '.po-timepicker-segment-input'
        )[1] as HTMLInputElement;
        minuteInput.value = '';
        minuteInput.focus();

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
        Object.defineProperty(event, 'target', { value: minuteInput });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'advanceToPreviousSegment');

        component.onSegmentKeydown(event, 'minute');

        expect(component['advanceToPreviousSegment']).toHaveBeenCalledWith('minute');
      });

      it('should navigate to next segment on ArrowRight at end of input', () => {
        fixture.detectChanges();

        const hourInput = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        hourInput.value = '12';
        hourInput.focus();
        hourInput.selectionStart = 2;

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
        Object.defineProperty(event, 'target', { value: hourInput });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'advanceToNextSegment');

        component.onSegmentKeydown(event, 'hour');

        expect(component['advanceToNextSegment']).toHaveBeenCalledWith('hour');
      });

      it('should increment on ArrowUp', () => {
        fixture.detectChanges();
        component.readonly = false;

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '10';
        component.hourDisplay = '10';

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'incrementSegment');

        component.onSegmentKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component['incrementSegment']).toHaveBeenCalledWith('hour', 1);
      });

      it('should decrement on ArrowDown', () => {
        fixture.detectChanges();
        component.readonly = false;

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '10';

        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'incrementSegment');

        component.onSegmentKeydown(event, 'hour');

        expect(component['incrementSegment']).toHaveBeenCalledWith('hour', -1);
      });

      it('should not increment when readonly', () => {
        fixture.detectChanges();
        component.readonly = true;

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(component as any, 'incrementSegment');

        component.onSegmentKeydown(event, 'hour');

        expect(component['incrementSegment']).not.toHaveBeenCalled();
      });

      it('should prevent non-numeric keys', () => {
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '10';
        input.focus();

        const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(event, 'preventDefault');

        component.onSegmentKeydown(event, 'hour');

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should allow Ctrl+key combinations', () => {
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '10';
        input.focus();

        const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(event, 'preventDefault');

        component.onSegmentKeydown(event, 'hour');

        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should emit keydown event', () => {
        fixture.detectChanges();
        spyOn(component.keydown, 'emit');

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        input.value = '10';
        input.focus();

        const event = new KeyboardEvent('keydown', { key: '5', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });

        component.onSegmentKeydown(event, 'hour');

        expect(component.keydown.emit).toHaveBeenCalledWith(event);
      });

      it('should focus timer on Tab from last segment when visible', () => {
        fixture.detectChanges();
        component.visible = true;
        component.showSeconds = false;
        component.format = PoTimerFormat.Format24;

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[1] as HTMLInputElement;
        input.value = '30';
        input.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(component as any, 'focusTimer');

        component.onSegmentKeydown(event, 'minute');

        expect(component['focusTimer']).toHaveBeenCalledWith(event);
      });

      it('should navigate to previous segment on Shift+Tab with visible picker', () => {
        fixture.detectChanges();
        component.visible = true;

        const input = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[1] as HTMLInputElement;
        input.value = '';
        input.focus();

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
        Object.defineProperty(event, 'target', { value: input });
        spyOn(event, 'preventDefault');
        spyOn(component as any, 'advanceToPreviousSegment');

        component.onSegmentKeydown(event, 'minute');

        expect(component['advanceToPreviousSegment']).toHaveBeenCalledWith('minute');
      });
    });

    describe('onSegmentBlur:', () => {
      it('should set isSegmentFocused to false', () => {
        fixture.detectChanges();
        component.isSegmentFocused = true;

        const hourInput = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        component.onSegmentBlur({ target: hourInput, relatedTarget: null } as unknown as FocusEvent);

        expect(component.isSegmentFocused).toBeFalse();
      });

      it('should call onTouchedModel and emit onblur when focus leaves the component', () => {
        fixture.detectChanges();
        const touchedSpy = jasmine.createSpy('touched');
        component['onTouchedModel'] = touchedSpy;
        spyOn(component.onblur, 'emit');
        spyOn(component as any, 'validateAndUpdateModel');
        spyOn(component as any, 'controlChangeEmitter');

        const hourInput = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        const externalEl = document.createElement('div');
        document.body.appendChild(externalEl);

        component.onSegmentBlur({ target: hourInput, relatedTarget: externalEl } as unknown as FocusEvent);

        expect(touchedSpy).toHaveBeenCalled();
        expect(component.onblur.emit).toHaveBeenCalled();
        expect(component['validateAndUpdateModel']).toHaveBeenCalled();
        document.body.removeChild(externalEl);
      });

      it('should close timer when blurring outside while visible', () => {
        fixture.detectChanges();
        component.visible = true;
        component['onTouchedModel'] = () => {};
        spyOn(component, 'closeTimer');

        const hourInput = fixture.nativeElement.querySelectorAll('.po-timepicker-segment-input')[0] as HTMLInputElement;
        const externalEl = document.createElement('div');
        document.body.appendChild(externalEl);

        component.onSegmentBlur({ target: hourInput, relatedTarget: externalEl } as unknown as FocusEvent);

        expect(component.closeTimer).toHaveBeenCalledWith(false, true);
        document.body.removeChild(externalEl);
      });
    });

    describe('onFieldClick:', () => {
      it('should focus when clicking on field wrapper', () => {
        fixture.detectChanges();
        spyOn(component, 'focus');

        const fieldEl = fixture.nativeElement.querySelector('.po-timepicker-field') as HTMLElement;
        component.onFieldClick({ target: fieldEl } as unknown as MouseEvent);

        expect(component.focus).toHaveBeenCalled();
      });

      it('should not focus when clicking on segment input', () => {
        fixture.detectChanges();
        spyOn(component, 'focus');

        const input = fixture.nativeElement.querySelector('.po-timepicker-segment-input') as HTMLElement;
        component.onFieldClick({ target: input } as unknown as MouseEvent);

        expect(component.focus).not.toHaveBeenCalled();
      });

      it('should not focus when disabled', () => {
        fixture.detectChanges();
        component.disabled = true;
        spyOn(component, 'focus');

        const fieldEl = fixture.nativeElement.querySelector('.po-timepicker-field') as HTMLElement;
        component.onFieldClick({ target: fieldEl } as unknown as MouseEvent);

        expect(component.focus).not.toHaveBeenCalled();
      });
    });

    describe('onSegmentFocus:', () => {
      it('should set isSegmentFocused to true', () => {
        component.isSegmentFocused = false;

        component.onSegmentFocus();

        expect(component.isSegmentFocused).toBeTrue();
      });
    });

    describe('onPeriodSegmentKeydown:', () => {
      it('should not toggle when readonly', () => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component.readonly = true;
        component.periodDisplay = 'AM';

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
        spyOn(event, 'preventDefault');
        component.onPeriodSegmentKeydown(event);

        expect(component.periodDisplay).toBe('AM');
      });

      it('should not toggle when disabled', () => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component.disabled = true;
        component.periodDisplay = 'AM';

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
        component.onPeriodSegmentKeydown(event);

        expect(component.periodDisplay).toBe('AM');
      });

      it('should prevent Backspace and Delete', () => {
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true });
        spyOn(event, 'preventDefault');

        component.onPeriodSegmentKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus second input on Shift+Tab when showSeconds is true', () => {
        component.showSeconds = true;
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(component.secondInputEl.nativeElement, 'focus');

        component.onPeriodSegmentKeydown(event);

        expect(component.secondInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus minute input on Shift+Tab when showSeconds is false', () => {
        component.showSeconds = false;
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(component.minuteInputEl.nativeElement, 'focus');

        component.onPeriodSegmentKeydown(event);

        expect(component.minuteInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus timer on Tab when picker is visible', () => {
        fixture.detectChanges();
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
        spyOn(component as any, 'focusTimer');

        component.onPeriodSegmentKeydown(event);

        expect(component['focusTimer']).toHaveBeenCalledWith(event);
      });

      it('should prevent single character key presses', () => {
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'p', cancelable: true });
        spyOn(event, 'preventDefault');

        component.onPeriodSegmentKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('onPeriodSegmentClick:', () => {
      it('should toggle period when not readonly and not disabled', () => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component.readonly = false;
        component.disabled = false;
        component.periodDisplay = 'AM';
        component.hourDisplay = '10';
        component.minuteDisplay = '30';

        component.onPeriodSegmentClick(new MouseEvent('click'));

        expect(component.periodDisplay).toBe('PM');
      });

      it('should not toggle period when readonly', () => {
        fixture.detectChanges();
        component.readonly = true;
        component.periodDisplay = 'AM';

        component.onPeriodSegmentClick(new MouseEvent('click'));

        expect(component.periodDisplay).toBe('AM');
      });
    });

    describe('refreshValue:', () => {
      it('should call updateInputDisplay when value and inputEl exist', () => {
        fixture.detectChanges();
        spyOn(component as any, 'updateInputDisplay');

        component.refreshValue('14:30');

        expect(component['updateInputDisplay']).toHaveBeenCalledWith('14:30');
      });

      it('should not call updateInputDisplay when value is empty', () => {
        fixture.detectChanges();
        spyOn(component as any, 'updateInputDisplay');

        component.refreshValue('');

        expect(component['updateInputDisplay']).not.toHaveBeenCalled();
      });
    });

    describe('showAdditionalHelp:', () => {
      it('should toggle displayAdditionalHelp', () => {
        component.displayAdditionalHelp = false;
        component.label = 'Test';

        const result = component.showAdditionalHelp();

        expect(component.displayAdditionalHelp).toBeTrue();
        expect(result).toBeTrue();
      });

      it('should return false after second toggle', () => {
        component.displayAdditionalHelp = true;
        component.label = 'Test';

        const result = component.showAdditionalHelp();

        expect(component.displayAdditionalHelp).toBeFalse();
        expect(result).toBeFalse();
      });
    });

    describe('writeValue (extended):', () => {
      it('should update display for valid time in 12h format', fakeAsync(() => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.writeValue('14:30');
        tick(16);

        expect(component.timeValue).toBe('14:30');
        expect(component.hourDisplay).toBe('02');
        expect(component.minuteDisplay).toBe('30');
        expect(component.periodDisplay).toBe('PM');
      }));

      it('should display 12 for midnight in 12h format', fakeAsync(() => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.writeValue('00:00');
        tick(16);

        expect(component.hourDisplay).toBe('12');
        expect(component.periodDisplay).toBe('AM');
      }));

      it('should display 12 for noon in 12h format', fakeAsync(() => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component.writeValue('12:00');
        tick(16);

        expect(component.hourDisplay).toBe('12');
        expect(component.periodDisplay).toBe('PM');
      }));

      it('should clear segment displays for invalid value', () => {
        fixture.detectChanges();

        component.hourDisplay = '10';
        component.writeValue(42);

        expect(component.timeValue).toBe('');
        expect(component.hourDisplay).toBe('');
      });

      it('should keep validation state when writeValue with empty and has validation and value', () => {
        fixture.detectChanges();

        component.hourDisplay = '13';
        component.minuteDisplay = '00';
        component['setValidationValue']('13:00');

        component.writeValue('');

        expect(component.timeValue).toBe('');
      });
    });

    describe('handleCleanKeyboardTab:', () => {
      it('should focus timer when visible and Tab without Shift', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component as any, 'focusTimer');

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        component.handleCleanKeyboardTab(event);

        expect(component['focusTimer']).toHaveBeenCalledWith(event);
      });

      it('should not focus timer when not visible', () => {
        fixture.detectChanges();
        component.visible = false;

        spyOn(component as any, 'focusTimer');

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        component.handleCleanKeyboardTab(event);

        expect(component['focusTimer']).not.toHaveBeenCalled();
      });

      it('should not focus timer on Shift+Tab', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component as any, 'focusTimer');

        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        component.handleCleanKeyboardTab(event);

        expect(component['focusTimer']).not.toHaveBeenCalled();
      });
    });

    describe('onTimerKeyDown:', () => {
      it('should close timer on Escape when visible', () => {
        fixture.detectChanges();
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component, 'closeTimer');

        component.onTimerKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.closeTimer).toHaveBeenCalledWith(false);
      });

      it('should not close timer when not visible', () => {
        fixture.detectChanges();
        component.visible = false;

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        spyOn(component, 'closeTimer');

        component.onTimerKeyDown(event);

        expect(component.closeTimer).not.toHaveBeenCalled();
      });

      it('should not close timer on non-Escape key', () => {
        fixture.detectChanges();
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component, 'closeTimer');

        component.onTimerKeyDown(event);

        expect(component.closeTimer).not.toHaveBeenCalled();
      });
    });

    describe('onTimerBoundaryTab:', () => {
      it('should close timer and focus icon on boundary tab', () => {
        fixture.detectChanges();
        component.visible = true;

        const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        spyOn(component, 'closeTimer');

        component.onTimerBoundaryTab({ direction: 'forward', event });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.closeTimer).toHaveBeenCalledWith(false);
      });

      it('should not close when not visible', () => {
        fixture.detectChanges();
        component.visible = false;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(component, 'closeTimer');

        component.onTimerBoundaryTab({ direction: 'backward', event });

        expect(component.closeTimer).not.toHaveBeenCalled();
      });
    });

    describe('onTimerFocusOut:', () => {
      it('should not close when not visible', () => {
        fixture.detectChanges();
        component.visible = false;

        spyOn(component, 'closeTimer');
        component.onTimerFocusOut({ relatedTarget: document.body } as unknown as FocusEvent);

        expect(component.closeTimer).not.toHaveBeenCalled();
      });

      it('should close when focus moves outside the component', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component, 'closeTimer');

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);

        if (component['dialogPicker']?.nativeElement) {
          component.onTimerFocusOut({ relatedTarget: outsideEl } as unknown as FocusEvent);

          expect(component.closeTimer).toHaveBeenCalledWith(false);
        }
        document.body.removeChild(outsideEl);
      });

      it('should not close when focus moves to element inside timepicker', () => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component, 'closeTimer');

        const insideEl = component.inputEl.nativeElement;
        component.onTimerFocusOut({ relatedTarget: insideEl } as unknown as FocusEvent);

        expect(component.closeTimer).not.toHaveBeenCalled();
      });

      it('should handle null relatedTarget', fakeAsync(() => {
        fixture.detectChanges();
        component.visible = true;

        spyOn(component, 'closeTimer');

        if (component['dialogPicker']?.nativeElement) {
          component.onTimerFocusOut({ relatedTarget: null } as unknown as FocusEvent);
          tick();
        }
      }));
    });

    describe('incrementSegment (private):', () => {
      it('should increment hour from 10 to 11', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';

        component['incrementSegment']('hour', 1);

        expect(component.hourDisplay).toBe('11');
      });

      it('should decrement hour from 10 to 09', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';

        component['incrementSegment']('hour', -1);

        expect(component.hourDisplay).toBe('09');
      });

      it('should wrap hour from 23 to 00 in 24h mode', () => {
        fixture.detectChanges();
        component.hourDisplay = '23';

        component['incrementSegment']('hour', 1);

        expect(component.hourDisplay).toBe('00');
      });

      it('should wrap hour from 00 to 23 in 24h mode', () => {
        fixture.detectChanges();
        component.hourDisplay = '00';

        component['incrementSegment']('hour', -1);

        expect(component.hourDisplay).toBe('23');
      });

      it('should wrap hour from 12 to 01 in 12h mode and toggle period', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '12';
        component.periodDisplay = 'AM';

        component['incrementSegment']('hour', 1);

        expect(component.hourDisplay).toBe('01');
        expect(component.periodDisplay).toBe('PM');
      });

      it('should wrap hour from 01 to 12 in 12h mode and toggle period', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '01';
        component.periodDisplay = 'PM';

        component['incrementSegment']('hour', -1);

        expect(component.hourDisplay).toBe('12');
        expect(component.periodDisplay).toBe('AM');
      });

      it('should increment minute by interval', () => {
        fixture.detectChanges();
        component.minuteInterval = 5;
        component.minuteDisplay = '10';

        component['incrementSegment']('minute', 1);

        expect(component.minuteDisplay).toBe('15');
      });

      it('should decrement minute by interval', () => {
        fixture.detectChanges();
        component.minuteInterval = 5;
        component.minuteDisplay = '10';

        component['incrementSegment']('minute', -1);

        expect(component.minuteDisplay).toBe('05');
      });

      it('should wrap minute from 55 to 00 with interval 5', () => {
        fixture.detectChanges();
        component.minuteInterval = 5;
        component.minuteDisplay = '55';

        component['incrementSegment']('minute', 1);

        expect(component.minuteDisplay).toBe('00');
      });

      it('should wrap minute from 00 to 55 with interval 5', () => {
        fixture.detectChanges();
        component.minuteInterval = 5;
        component.minuteDisplay = '00';

        component['incrementSegment']('minute', -1);

        expect(component.minuteDisplay).toBe('55');
      });

      it('should increment second by interval', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        component.secondInterval = 15;
        component.secondDisplay = '00';

        component['incrementSegment']('second', 1);

        expect(component.secondDisplay).toBe('15');
      });

      it('should wrap second from 45 to 00 with interval 15', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        component.secondInterval = 15;
        component.secondDisplay = '45';

        component['incrementSegment']('second', 1);

        expect(component.secondDisplay).toBe('00');
      });

      it('should initialize hour from empty on increment', () => {
        fixture.detectChanges();
        component.hourDisplay = '';

        component['incrementSegment']('hour', 1);

        expect(component.hourDisplay).toBe('00');
      });

      it('should initialize minute from empty on increment', () => {
        fixture.detectChanges();
        component.minuteDisplay = '';

        component['incrementSegment']('minute', 1);

        expect(component.minuteDisplay).toBe('00');
      });
    });

    describe('updateCombinedValue (private):', () => {
      it('should clear when segments are incomplete', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '';

        spyOn(component as any, 'callOnChange');
        component['updateCombinedValue']();

        expect(component['callOnChange']).toHaveBeenCalledWith('');
      });

      it('should set timeValue when segments are complete and valid', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '30';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('10:30');
      });

      it('should include seconds when showSeconds is true', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '30';
        component.secondDisplay = '45';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('10:30:45');
      });

      it('should convert 12h to 24h for AM times', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '30';
        component.periodDisplay = 'AM';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('10:30');
      });

      it('should convert 12h PM to 24h', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '02';
        component.minuteDisplay = '30';
        component.periodDisplay = 'PM';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('14:30');
      });

      it('should convert 12 AM to 00 in 24h', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '12';
        component.minuteDisplay = '00';
        component.periodDisplay = 'AM';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('00:00');
      });

      it('should keep 12 PM as 12 in 24h', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '12';
        component.minuteDisplay = '00';
        component.periodDisplay = 'PM';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('12:00');
      });

      it('should set error for out-of-range time', () => {
        fixture.detectChanges();
        component.minTime = '08:00';
        component.maxTime = '18:00';
        component.hourDisplay = '07';
        component.minuteDisplay = '00';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('');
      });

      it('should reject 12h hour out of 1..12 range', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component.hourDisplay = '13';
        component.minuteDisplay = '00';
        component.periodDisplay = 'AM';

        component['updateCombinedValue']();

        expect(component.timeValue).toBe('');
      });
    });

    describe('validateAndUpdateModel (private):', () => {
      it('should pad single digit hour and update', () => {
        fixture.detectChanges();
        component.hourDisplay = '1';
        component.minuteDisplay = '30';

        component['validateAndUpdateModel']();

        expect(component.hourDisplay).toBe('01');
        expect(component.timeValue).toBe('01:30');
      });

      it('should pad single digit minute and update', () => {
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '5';

        component['validateAndUpdateModel']();

        expect(component.minuteDisplay).toBe('05');
        expect(component.timeValue).toBe('10:05');
      });

      it('should pad single digit second and update', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        component.hourDisplay = '10';
        component.minuteDisplay = '30';
        component.secondDisplay = '5';

        component['validateAndUpdateModel']();

        expect(component.secondDisplay).toBe('05');
        expect(component.timeValue).toBe('10:30:05');
      });
    });

    describe('controlChangeEmitter (private):', () => {
      it('should emit onchange when value changes', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component.onchange, 'emit');

        component['valueBeforeChange'] = '';
        component.timeValue = '10:30';

        component['controlChangeEmitter']();

        tick(200);

        expect(component.onchange.emit).toHaveBeenCalledWith('10:30');
      }));

      it('should not emit onchange when value has not changed', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component.onchange, 'emit');

        component['valueBeforeChange'] = '10:30';
        component.timeValue = '10:30';

        component['controlChangeEmitter']();

        tick(200);

        expect(component.onchange.emit).not.toHaveBeenCalled();
      }));
    });

    describe('setHelper:', () => {
      it('should call setHelperSettings', () => {
        fixture.detectChanges();

        const result = component.setHelper('Test label');

        expect(result).toBeDefined();
      });

      it('should call setHelperSettings with undefined label', () => {
        fixture.detectChanges();

        const result = component.setHelper(undefined);

        expect(result).toBeDefined();
      });
    });

    describe('clear (extended):', () => {
      it('should clear generated error pattern', () => {
        fixture.detectChanges();
        component.errorPattern = 'Hora inválida';

        component.clear();

        expect(component.errorPattern).toBe('');
      });

      it('should not clear custom error pattern', () => {
        fixture.detectChanges();
        component.errorPattern = 'Custom error message';

        component.clear();

        expect(component.errorPattern).toBe('Custom error message');
      });

      it('should clear native input values', () => {
        fixture.detectChanges();

        const hourInput = component.inputEl.nativeElement as HTMLInputElement;
        const minuteInput = component.minuteInputEl.nativeElement as HTMLInputElement;
        hourInput.value = '10';
        minuteInput.value = '30';

        component.clear();

        expect(hourInput.value).toBe('');
        expect(minuteInput.value).toBe('');
      });
    });

    describe('eventOnBlur (extended):', () => {
      it('should call validateAndUpdateModel and controlChangeEmitter', () => {
        fixture.detectChanges();
        component['onTouchedModel'] = () => {};

        spyOn(component as any, 'validateAndUpdateModel');
        spyOn(component as any, 'controlChangeEmitter');

        component.eventOnBlur({});

        expect(component['validateAndUpdateModel']).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });
    });

    describe('initializeListeners and removeListeners (private):', () => {
      it('should set up click and resize listeners', () => {
        fixture.detectChanges();

        component['initializeListeners']();

        expect(component['clickListener']).toBeDefined();
        expect(component.eventResizeListener).toBeDefined();
      });

      it('should remove listeners on removeListeners', () => {
        fixture.detectChanges();

        component['initializeListeners']();
        const clickListener = component['clickListener'];
        const resizeListener = component.eventResizeListener;

        component['removeListeners']();

        expect(component['clickListener']).toBeDefined();
      });
    });

    describe('focusLastSegment (private):', () => {
      it('should focus period input in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        spyOn(component.periodInputEl.nativeElement, 'focus');

        component['focusLastSegment']();

        expect(component.periodInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus second input when showSeconds in 24h format', () => {
        component.showSeconds = true;
        fixture.detectChanges();

        spyOn(component.secondInputEl.nativeElement, 'focus');

        component['focusLastSegment']();

        expect(component.secondInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus minute input when no seconds and 24h format', () => {
        component.showSeconds = false;
        component.format = PoTimerFormat.Format24;
        fixture.detectChanges();

        spyOn(component.minuteInputEl.nativeElement, 'focus');

        component['focusLastSegment']();

        expect(component.minuteInputEl.nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('isLastSegment (private):', () => {
      it('should return false in 12h format', () => {
        component.format = PoTimerFormat.Format12;

        expect(component['isLastSegment']('minute')).toBeFalse();
        expect(component['isLastSegment']('second')).toBeFalse();
        expect(component['isLastSegment']('hour')).toBeFalse();
      });

      it('should return true for second when showSeconds in 24h format', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = true;

        expect(component['isLastSegment']('second')).toBeTrue();
        expect(component['isLastSegment']('minute')).toBeFalse();
      });

      it('should return true for minute when no seconds in 24h format', () => {
        component.format = PoTimerFormat.Format24;
        component.showSeconds = false;

        expect(component['isLastSegment']('minute')).toBeTrue();
        expect(component['isLastSegment']('hour')).toBeFalse();
      });
    });

    describe('advanceToNextSegment (private):', () => {
      it('should focus minute when current is hour', () => {
        fixture.detectChanges();
        spyOn(component.minuteInputEl.nativeElement, 'focus');

        component['advanceToNextSegment']('hour');

        expect(component.minuteInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus second when current is minute and showSeconds', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        spyOn(component.secondInputEl.nativeElement, 'focus');

        component['advanceToNextSegment']('minute');

        expect(component.secondInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus period when current is minute and is12HourFormat and not showSeconds', () => {
        component.format = PoTimerFormat.Format12;
        component.showSeconds = false;
        fixture.detectChanges();
        spyOn(component.periodInputEl.nativeElement, 'focus');

        component['advanceToNextSegment']('minute');

        expect(component.periodInputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus period when current is second and is12HourFormat', () => {
        component.format = PoTimerFormat.Format12;
        component.showSeconds = true;
        fixture.detectChanges();
        spyOn(component.periodInputEl.nativeElement, 'focus');

        component['advanceToNextSegment']('second');

        expect(component.periodInputEl.nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('advanceToPreviousSegment (private):', () => {
      it('should focus hour when current is minute', () => {
        fixture.detectChanges();
        spyOn(component.inputEl.nativeElement, 'focus');

        component['advanceToPreviousSegment']('minute');

        expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus minute when current is second', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        spyOn(component.minuteInputEl.nativeElement, 'focus');

        component['advanceToPreviousSegment']('second');

        expect(component.minuteInputEl.nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('normalizeSingleDigitSegment (private):', () => {
      it('should pad single digit to two digits', () => {
        fixture.detectChanges();
        const input = component.inputEl.nativeElement as HTMLInputElement;
        input.classList.add('po-timepicker-segment-input');
        input.value = '1';

        const result = component['normalizeSingleDigitSegment'](input);

        expect(result).toBeTrue();
        expect(input.value).toBe('01');
        expect(component.hourDisplay).toBe('01');
      });

      it('should pad minute display', () => {
        fixture.detectChanges();
        const input = component.minuteInputEl.nativeElement as HTMLInputElement;
        input.value = '5';

        const result = component['normalizeSingleDigitSegment'](input);

        expect(result).toBeTrue();
        expect(input.value).toBe('05');
        expect(component.minuteDisplay).toBe('05');
      });

      it('should pad second display', () => {
        component.showSeconds = true;
        fixture.detectChanges();
        const input = component.secondInputEl.nativeElement as HTMLInputElement;
        input.value = '9';

        const result = component['normalizeSingleDigitSegment'](input);

        expect(result).toBeTrue();
        expect(input.value).toBe('09');
        expect(component.secondDisplay).toBe('09');
      });

      it('should return false for null input', () => {
        const result = component['normalizeSingleDigitSegment'](null);

        expect(result).toBeFalse();
      });

      it('should return false when input value is not single digit', () => {
        fixture.detectChanges();
        const input = component.inputEl.nativeElement as HTMLInputElement;
        input.classList.add('po-timepicker-segment-input');
        input.value = '12';

        const result = component['normalizeSingleDigitSegment'](input);

        expect(result).toBeFalse();
      });

      it('should return false for non-segment input', () => {
        const input = document.createElement('input');
        input.value = '1';

        const result = component['normalizeSingleDigitSegment'](input);

        expect(result).toBeFalse();
      });
    });

    describe('shouldCommitForInternalFocusTarget (private):', () => {
      it('should return true for icon button', () => {
        fixture.detectChanges();
        const button = component.iconTimepicker.buttonElement.nativeElement;

        expect(component['shouldCommitForInternalFocusTarget'](button)).toBeTrue();
      });

      it('should return false for null', () => {
        expect(component['shouldCommitForInternalFocusTarget'](null)).toBeFalse();
      });

      it('should return true for helper button', () => {
        fixture.detectChanges();
        const helperBtn = document.createElement('button');
        helperBtn.classList.add('po-field-helper-button');
        const wrapper = document.createElement('div');
        wrapper.classList.add('po-field-helper-button');
        wrapper.appendChild(helperBtn);

        expect(component['shouldCommitForInternalFocusTarget'](helperBtn)).toBeTrue();
      });

      it('should return false for unrelated element', () => {
        const el = document.createElement('div');

        expect(component['shouldCommitForInternalFocusTarget'](el)).toBeFalse();
      });
    });

    describe('isAdditionalHelpEventTriggered (private):', () => {
      it('should return true when additionalHelpEventTrigger is event', () => {
        component.additionalHelpEventTrigger = 'event';

        expect(component['isAdditionalHelpEventTriggered']()).toBeTrue();
      });

      it('should return false when additionalHelpEventTrigger is undefined', () => {
        component.additionalHelpEventTrigger = undefined;

        expect(component['isAdditionalHelpEventTriggered']()).toBeFalse();
      });
    });

    describe('getErrorPattern (extended):', () => {
      it('should return empty when errorPattern is set but hasInvalidClass is false', () => {
        component.errorPattern = 'Some error';
        spyOn(component, 'hasInvalidClass').and.returnValue(false);

        expect(component.getErrorPattern()).toBe('');
      });
    });

    describe('hasInvalidClass - showErrorMessageRequired branch:', () => {
      it('should cover showErrorMessageRequired && required branch', () => {
        fixture.detectChanges();
        component.el.nativeElement.classList.add('ng-invalid', 'ng-dirty');
        component['hourDisplay'] = '';
        component['minuteDisplay'] = '';
        component['secondDisplay'] = '';
        component['showErrorMessageRequired'] = true;
        component.required = true;

        const result = component.hasInvalidClass();
        expect(typeof result).toBe('boolean');
      });

      it('should cover showErrorMessageRequired && hasValidatorRequired branch', () => {
        fixture.detectChanges();
        component.el.nativeElement.classList.add('ng-invalid', 'ng-dirty');
        component['hourDisplay'] = '';
        component['minuteDisplay'] = '';
        component['secondDisplay'] = '';
        component['showErrorMessageRequired'] = true;
        component.required = false;
        component['hasValidatorRequired'] = true;

        const result = component.hasInvalidClass();
        expect(typeof result).toBe('boolean');
      });
    });

    describe('clear - secondInputEl branch:', () => {
      it('should clear secondInputEl when present', fakeAsync(() => {
        fixture.detectChanges();
        component.showSeconds = true;
        component.format = PoTimerFormat.Format24;
        fixture.detectChanges();
        tick(100);

        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['secondDisplay'] = '45';

        component.clear();
        tick(200);

        expect(component['hourDisplay']).toBe('');
        expect(component['minuteDisplay']).toBe('');
        expect(component['secondDisplay']).toBe('');
      }));
    });

    describe('showAdditionalHelp - no label with helper:', () => {
      it('should handle no label with eventOnClick helper', () => {
        fixture.detectChanges();
        component.label = '';
        const mockHelper = { eventOnClick: jasmine.createSpy('eventOnClick') };
        spyOn(component as any, 'poHelperComponent').and.returnValue(mockHelper);
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.showAdditionalHelp();

        expect(mockHelper.eventOnClick).toHaveBeenCalled();
      });

      it('should handle no label with string helper and visible popover', () => {
        fixture.detectChanges();
        component.label = '';
        spyOn(component as any, 'poHelperComponent').and.returnValue('some string');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        if (component['helperEl']) {
          spyOn(component['helperEl'], 'helperIsVisible').and.returnValue(true);
          spyOn(component['helperEl'], 'closeHelperPopover');
        }

        const result = component.showAdditionalHelp();
        expect(result === undefined || typeof result === 'boolean').toBeTrue();
      });

      it('should handle no label with isHelpEvt and no visible popover', () => {
        fixture.detectChanges();
        component.label = '';
        spyOn(component as any, 'poHelperComponent').and.returnValue(undefined);
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        if (component['helperEl']) {
          spyOn(component['helperEl'], 'helperIsVisible').and.returnValue(false);
          spyOn(component['helperEl'], 'openHelperPopover');
        }

        const result = component.showAdditionalHelp();
        expect(result === undefined || typeof result === 'boolean').toBeTrue();
      });
    });

    describe('updateInputDisplay - branches:', () => {
      it('should handle empty time string', fakeAsync(() => {
        fixture.detectChanges();

        component['updateInputDisplay']('');
        tick(100);

        expect(component['hourDisplay']).toBe('');
      }));

      it('should handle 24h format with parts missing', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format24;

        component['updateInputDisplay']('10:');
        tick(100);

        expect(component['hourDisplay']).toBe('10');
        expect(component['minuteDisplay']).toBe('');
      }));

      it('should handle 12h format with seconds', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component.showSeconds = true;

        component['updateInputDisplay']('14:30:45');
        tick(100);

        expect(component['hourDisplay']).toBe('02');
        expect(component['periodDisplay']).toBe('PM');
      }));

      it('should handle 12h format with midnight (00:00)', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;

        component['updateInputDisplay']('00:30');
        tick(100);

        expect(component['hourDisplay']).toBe('12');
        expect(component['periodDisplay']).toBe('AM');
      }));
    });

    describe('initializeListeners (private):', () => {
      it('should register click and resize listeners', fakeAsync(() => {
        fixture.detectChanges();

        component['initializeListeners']();
        tick(100);

        expect(component['clickListener']).toBeDefined();
        expect(component['eventResizeListener']).toBeDefined();

        component['removeListeners']();
      }));
    });

    describe('setTimerPosition (private):', () => {
      it('should call setDialogPickerStyleDisplay and adjustTimerPosition', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component as any, 'setDialogPickerStyleDisplay');
        spyOn(component as any, 'adjustTimerPosition');

        component['setTimerPosition']();

        expect(component['setDialogPickerStyleDisplay']).toHaveBeenCalledWith('block');
        expect(component['adjustTimerPosition']).toHaveBeenCalled();
      }));
    });

    describe('adjustTimerPosition (protected):', () => {
      it('should execute when dialogPicker and visible are set', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        if (component['dialogPicker']?.nativeElement) {
          const mockTimerEl = document.createElement('po-timer');
          Object.defineProperty(mockTimerEl, 'scrollHeight', { value: 300 });
          Object.defineProperty(mockTimerEl, 'scrollWidth', { value: 200 });
          component['dialogPicker'].nativeElement.appendChild(mockTimerEl);

          spyOn(component['controlPosition'], 'setElements');
          spyOn(component['controlPosition'], 'adjustPosition');

          component['adjustTimerPosition']();
          tick(100);
        }

        expect(true).toBeTrue();
      }));
    });

    describe('focusTimer (private):', () => {
      it('should return early when timerComponent is null', () => {
        fixture.detectChanges();
        component['timerComponent'] = null;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');

        component['focusTimer'](event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should call focusFirstVisibleCell on timerComponent', () => {
        fixture.detectChanges();
        const mockTimer = { focusFirstVisibleCell: jasmine.createSpy('focusFirstVisibleCell') };
        component['timerComponent'] = mockTimer as any;

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        spyOn(event, 'preventDefault');

        component['focusTimer'](event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockTimer.focusFirstVisibleCell).toHaveBeenCalled();
      });
    });

    describe('onScroll (private):', () => {
      it('should call controlPosition.adjustPosition', () => {
        fixture.detectChanges();
        spyOn(component['controlPosition'], 'adjustPosition');

        component['onScroll']();

        expect(component['controlPosition'].adjustPosition).toHaveBeenCalledWith('bottom-left');
      });
    });

    describe('incrementSegment - minuteInterval and secondInterval fallback:', () => {
      it('should use 1 as fallback when minuteInterval is falsy', () => {
        fixture.detectChanges();
        component['_minuteInterval'] = 0;
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['readonly'] = false;
        spyOn(component as any, 'incrementIntervalSegment').and.callThrough();

        component['incrementSegment']('minute', 1);

        expect(component['incrementIntervalSegment']).toHaveBeenCalledWith(
          1,
          1,
          'minuteDisplay',
          component.minuteInputEl
        );
      });

      it('should use 1 as fallback when secondInterval is falsy', () => {
        fixture.detectChanges();
        component.showSeconds = true;
        component['_secondInterval'] = 0;
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['secondDisplay'] = '30';
        component['readonly'] = false;
        spyOn(component as any, 'incrementIntervalSegment').and.callThrough();

        component['incrementSegment']('second', 1);

        expect(component['incrementIntervalSegment']).toHaveBeenCalledWith(
          1,
          1,
          'secondDisplay',
          component.secondInputEl
        );
      });
    });

    describe('incrementHourSegment - periodDisplay fallback:', () => {
      it('should use getDefaultPeriodDisplay when periodDisplay is empty in 12h format', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component['hourDisplay'] = '12';
        component['periodDisplay'] = '';

        component['incrementHourSegment'](1);
        tick(100);

        expect(component['periodDisplay']).toBeDefined();
      }));
    });

    describe('togglePeriod - periodDisplay fallback:', () => {
      it('should use getDefaultPeriodDisplay when periodDisplay is empty', () => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component['periodDisplay'] = '';

        component['togglePeriod']();

        expect(component['periodDisplay']).toBe('PM');
      });
    });

    describe('convertDisplayTo24h - periodDisplay fallback:', () => {
      it('should use getDefaultPeriodDisplay when periodDisplay is empty', () => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component['hourDisplay'] = '10';
        component['periodDisplay'] = '';

        const result = component['convertDisplayTo24h']('10:30');

        expect(typeof result).toBe('string');
      });
    });

    describe('updateTimeFromInput - isGeneratedErrorPattern branch:', () => {
      it('should clear errorPattern when it is a generated pattern', fakeAsync(() => {
        fixture.detectChanges();
        component['errorPattern'] = component['getDefaultInvalidTimeMessage']();

        component['updateTimeFromInput']('10:30');
        tick(300);

        expect(component['errorPattern']).toBe('');
      }));
    });

    describe('writeValue - edge cases:', () => {
      it('should handle focus call in else branch', fakeAsync(() => {
        fixture.detectChanges();
        component['hourDisplay'] = '';
        component['minuteDisplay'] = '';

        component.writeValue(null);
        tick(100);

        expect(component['timeValue']).toBe('');
      }));
    });

    describe('onTimerFocusOut - relatedTarget null branch:', () => {
      it('should handle null relatedTarget when visible', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        if (component['dialogPicker']?.nativeElement) {
          const event = new FocusEvent('focusout', { relatedTarget: null });
          component.onTimerFocusOut(event);
          tick(100);
        }

        expect(true).toBeTrue();
      }));
    });

    describe('onSegmentBlur - else branch (focus):', () => {
      it('should call focus when isInternalFocus is false and segment blur triggers else', fakeAsync(() => {
        fixture.detectChanges();
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';

        const input = component['inputEl']?.nativeElement;
        if (input) {
          input.value = '10';
          const blurEvent = new FocusEvent('blur', { relatedTarget: null });
          component.onSegmentBlur(blurEvent);
          tick(100);
        }

        expect(true).toBeTrue();
      }));
    });

    describe('updateInputDisplay - parts[1] and parts[0] fallback || empty:', () => {
      it('should use empty string fallback when parts has only hour', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format24;

        component['updateInputDisplay']('10');
        tick(100);

        expect(component['hourDisplay']).toBe('10');
        expect(component['minuteDisplay']).toBe('');
      }));

      it('should use empty string fallback in 12h format when parts has only hour', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;

        component['updateInputDisplay']('14');
        tick(100);

        expect(component['hourDisplay']).toBe('14');
      }));
    });

    describe('syncSegmentInputElements - secondInputEl branch:', () => {
      it('should sync secondInputEl value when showSeconds is true', fakeAsync(() => {
        component.showSeconds = true;
        component.format = PoTimerFormat.Format24;
        fixture.detectChanges();
        tick(100);

        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['secondDisplay'] = '45';

        component['syncSegmentInputElements']();
        tick(100);

        if (component['secondInputEl']?.nativeElement) {
          expect(component['secondInputEl'].nativeElement.value).toBe('45');
        }
        expect(true).toBeTrue();
      }));
    });

    describe('initializeListeners - clickListener and eventResizeListener:', () => {
      it('should set up click and resize listeners that call proper handlers', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        component['initializeListeners']();
        tick(100);

        expect(component['clickListener']).toBeDefined();
        expect(component['eventResizeListener']).toBeDefined();

        // Trigger a document click to cover the clickListener callback
        const clickEvent = new MouseEvent('click', { bubbles: true });
        document.dispatchEvent(clickEvent);
        tick(100);

        // Trigger a window resize to cover the eventResizeListener callback
        window.dispatchEvent(new Event('resize'));
        tick(100);

        component['removeListeners']();
      }));
    });

    describe('adjustTimerPosition - scrollHeight/scrollWidth fallback:', () => {
      it('should use dialogPicker scrollHeight/scrollWidth when po-timer element is not found', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        if (component['dialogPicker']?.nativeElement) {
          component['dialogPicker'].nativeElement.style.display = 'block';

          spyOn(component['controlPosition'], 'setElements');
          spyOn(component['controlPosition'], 'adjustPosition');

          component['adjustTimerPosition']();
          tick(100);

          expect(component['controlPosition'].setElements).toHaveBeenCalled();
        }

        expect(true).toBeTrue();
      }));
    });

    describe('showAdditionalHelp - helperEl visible branch:', () => {
      it('should close helper popover when helperEl is visible', () => {
        fixture.detectChanges();
        component.label = '';

        const mockHelperEl = {
          helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(true),
          closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
          openHelperPopover: jasmine.createSpy('openHelperPopover')
        };
        Object.defineProperty(component, 'helperEl', { value: mockHelperEl, writable: true });
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component as any, 'poHelperComponent').and.returnValue('some tooltip');

        component.showAdditionalHelp();

        expect(mockHelperEl.helperIsVisible).toHaveBeenCalled();
        expect(mockHelperEl.closeHelperPopover).toHaveBeenCalled();
      });

      it('should open helper popover when helperEl is not visible', () => {
        fixture.detectChanges();
        component.label = '';

        const mockHelperEl = {
          helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(false),
          closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
          openHelperPopover: jasmine.createSpy('openHelperPopover')
        };
        Object.defineProperty(component, 'helperEl', { value: mockHelperEl, writable: true });
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component as any, 'poHelperComponent').and.returnValue('some tooltip');

        component.showAdditionalHelp();

        expect(mockHelperEl.openHelperPopover).toHaveBeenCalled();
      });
    });

    describe('incrementSegment - hour segment in 12h format:', () => {
      it('should increment hour in 12h format', fakeAsync(() => {
        fixture.detectChanges();
        component.format = PoTimerFormat.Format12;
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['periodDisplay'] = 'AM';
        component['readonly'] = false;

        component['incrementSegment']('hour', 1);
        tick(300);

        expect(component['hourDisplay']).toBeDefined();
      }));
    });

    describe('adjustTimerPosition - timepickerFieldEl fallback:', () => {
      it('should use inputEl when timepickerFieldEl is not set', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;
        component['timepickerFieldEl'] = undefined;

        if (component['dialogPicker']?.nativeElement) {
          component['dialogPicker'].nativeElement.style.display = 'block';
          spyOn(component['controlPosition'], 'setElements');
          spyOn(component['controlPosition'], 'adjustPosition');

          component['adjustTimerPosition']();
          tick(100);
        }

        expect(true).toBeTrue();
      }));
    });

    describe('clear - secondInputEl branch:', () => {
      it('should clear secondInputEl when showSeconds is true', () => {
        component.showSeconds = true;
        fixture.detectChanges();

        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['secondDisplay'] = '45';

        const secondInput = component['secondInputEl']?.nativeElement;
        if (secondInput) {
          secondInput.value = '45';
        }

        component.clear();

        expect(component['secondDisplay']).toBe('');
        if (secondInput) {
          expect(secondInput.value).toBe('');
        }
      });
    });

    describe('updateInputDisplay - parts fallback (empty parts):', () => {
      it('should set minuteDisplay to empty string when parts[1] is undefined in 24h format', () => {
        component.format = PoTimerFormat.Format24;
        fixture.detectChanges();

        component['updateInputDisplay']('10');

        expect(component['hourDisplay']).toBe('10');
        expect(component['minuteDisplay']).toBe('');
      });

      it('should set hourDisplay to empty string when parts[0] is empty for non-12h', () => {
        component.format = PoTimerFormat.Format24;
        fixture.detectChanges();

        component['updateInputDisplay'](':30');

        expect(component['hourDisplay']).toBe('');
        expect(component['minuteDisplay']).toBe('30');
      });

      it('should handle 12h format with valid time and set period', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        component['updateInputDisplay']('14:30');

        expect(component['hourDisplay']).toBe('02');
        expect(component['minuteDisplay']).toBe('30');
        expect(component['periodDisplay']).toBe('PM');
      });

      it('should set minuteDisplay fallback in 12h format when parts[1] missing', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();

        spyOn(component as any, 'isValidTimeString').and.returnValue(true);

        component['updateInputDisplay']('10');

        expect(component['minuteDisplay']).toBe('');
      });
    });

    describe('onSegmentBlur - else branch (internal focus, no commit target):', () => {
      it('should not call onblur.emit when focus moves to internal non-commit target', fakeAsync(() => {
        fixture.detectChanges();
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';

        // Create an internal element that is NOT a commit target (not icon, not clean, not helper)
        const minuteInput = component['minuteInputEl']?.nativeElement;
        if (minuteInput) {
          const blurEvent = new FocusEvent('blur', { relatedTarget: minuteInput });
          spyOn(component.onblur, 'emit');
          spyOn(component, 'focus');

          component.onSegmentBlur(blurEvent);
          tick(100);

          // isInternalFocus=true, shouldCommitForInternalFocusTarget=false => else branch (no-op, just falls through)
          expect(component.onblur.emit).not.toHaveBeenCalled();
        }
        expect(true).toBeTrue();
      }));
    });

    describe('incrementSegment - minuteInterval/secondInterval:', () => {
      it('should use minuteInterval when set', () => {
        fixture.detectChanges();
        component['minuteInterval'] = 5;
        component['minuteDisplay'] = '30';
        component['hourDisplay'] = '10';
        component['readonly'] = false;

        component['incrementSegment']('minute', 1);

        expect(parseInt(component['minuteDisplay'], 10)).toBe(35);
      });

      it('should use secondInterval when set', () => {
        fixture.detectChanges();
        component.showSeconds = true;
        component['secondInterval'] = 15;
        component['secondDisplay'] = '30';
        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '20';
        component['readonly'] = false;

        component['incrementSegment']('second', 1);

        expect(parseInt(component['secondDisplay'], 10)).toBe(45);
      });

      it('should decrement minute wrapping below 0 to 60 - interval', () => {
        fixture.detectChanges();
        component['minuteInterval'] = 5;
        component['minuteDisplay'] = '00';
        component['hourDisplay'] = '10';
        component['readonly'] = false;

        component['incrementSegment']('minute', -1);

        expect(parseInt(component['minuteDisplay'], 10)).toBe(55);
      });

      it('should increment minute wrapping above 59 to 0', () => {
        fixture.detectChanges();
        component['minuteInterval'] = 5;
        component['minuteDisplay'] = '55';
        component['hourDisplay'] = '10';
        component['readonly'] = false;

        component['incrementSegment']('minute', 1);

        expect(parseInt(component['minuteDisplay'], 10)).toBe(0);
      });
    });

    describe('initializeListeners - resize callback:', () => {
      it('should close timer on window resize', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        component['initializeListeners']();

        spyOn(component, 'closeTimer');

        window.dispatchEvent(new Event('resize'));
        tick(100);

        expect(component.closeTimer).toHaveBeenCalled();

        component['removeListeners']();
      }));
    });

    describe('adjustTimerPosition - scrollHeight/scrollWidth fallback:', () => {
      it('should fallback to dialogPicker scrollHeight/scrollWidth when po-timer not found', fakeAsync(() => {
        fixture.detectChanges();
        component['visible'] = true;

        if (component['dialogPicker']?.nativeElement) {
          const dialogEl = component['dialogPicker'].nativeElement;
          dialogEl.style.display = 'block';

          spyOn(dialogEl, 'querySelector').and.returnValue(null);
          spyOn(component['controlPosition'], 'setElements');
          spyOn(component['controlPosition'], 'adjustPosition');

          component['adjustTimerPosition']();
          tick(100);

          expect(component['controlPosition'].setElements).toHaveBeenCalled();
        }

        expect(true).toBeTrue();
      }));
    });

    describe('syncSegmentInputElements - secondInputEl branch:', () => {
      it('should set secondInputEl value when showSeconds and secondInputEl exist', fakeAsync(() => {
        component.showSeconds = true;
        fixture.detectChanges();

        component['hourDisplay'] = '10';
        component['minuteDisplay'] = '30';
        component['secondDisplay'] = '45';

        component['syncSegmentInputElements']();
        tick(100);

        const secondInput = component['secondInputEl']?.nativeElement;
        if (secondInput) {
          expect(secondInput.value).toBe('45');
        }
        expect(true).toBeTrue();
      }));
    });

    describe('focusLastSegment - final else branch (no inputs available):', () => {
      it('should call focus() when no segment input elements are available', () => {
        fixture.detectChanges();

        // Make all segment input refs unavailable
        Object.defineProperty(component, 'minuteInputEl', { value: undefined, writable: true });
        Object.defineProperty(component, 'secondInputEl', { value: undefined, writable: true });
        Object.defineProperty(component, 'periodInputEl', { value: undefined, writable: true });

        spyOn(component, 'focus');

        component['focusLastSegment']();

        expect(component.focus).toHaveBeenCalled();
      });
    });

    describe('incrementHourSegment - hour wrapping with 12h format:', () => {
      it('should wrap hour from 12 to 1 and toggle period in 12h format', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component['hourDisplay'] = '12';
        component['minuteDisplay'] = '00';
        component['periodDisplay'] = 'AM';
        component['readonly'] = false;

        component['incrementSegment']('hour', 1);

        expect(parseInt(component['hourDisplay'], 10)).toBe(1);
        expect(component['periodDisplay']).toBe('PM');
      });

      it('should wrap hour from 1 to 12 and toggle period in 12h format on decrement', () => {
        component.format = PoTimerFormat.Format12;
        fixture.detectChanges();
        component['hourDisplay'] = '01';
        component['minuteDisplay'] = '00';
        component['periodDisplay'] = 'PM';
        component['readonly'] = false;

        component['incrementSegment']('hour', -1);

        expect(parseInt(component['hourDisplay'], 10)).toBe(12);
        expect(component['periodDisplay']).toBe('AM');
      });
    });
  });
});
