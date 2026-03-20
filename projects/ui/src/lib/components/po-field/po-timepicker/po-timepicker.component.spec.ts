import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventEmitter, SimpleChanges } from '@angular/core';

import { PoTimepickerComponent } from './po-timepicker.component';
import { PoTimepickerModule } from './po-timepicker.module';

describe('PoTimepickerComponent:', () => {
  let component: PoTimepickerComponent;
  let fixture: ComponentFixture<PoTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoTimepickerModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTimepickerComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.autoFocus = false;
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

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
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
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        component.label = 'Test';
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
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
    });
  });

  describe('Template:', () => {
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
  });
});
