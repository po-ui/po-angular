import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoTimepickerComponent } from './po-timepicker.component';

describe('PoTimepickerComponent:', () => {
  let component: PoTimepickerComponent;
  let fixture: ComponentFixture<PoTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [PoTimepickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default literals', () => {
    expect(component.literals).toBeDefined();
    expect(component.literals.open).toBeDefined();
    expect(component.literals.clean).toBeDefined();
  });

  it('should have default visible as false', () => {
    expect(component.visible).toBe(false);
  });

  describe('writeValue:', () => {
    it('should set input value from string', () => {
      component.writeValue('14:30');
      expect(component.inputEl.nativeElement.value).toBe('14:30');
    });

    it('should clear input for null value', () => {
      component.writeValue('14:30');
      component.writeValue(null);
      expect(component.inputEl.nativeElement.value).toBe('');
    });
  });

  describe('focus:', () => {
    it('should focus the input element', () => {
      spyOn(component.inputEl.nativeElement, 'focus');
      component.focus();
      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus when disabled', () => {
      component.disabled = true;
      spyOn(component.inputEl.nativeElement, 'focus');
      component.focus();
      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('clear:', () => {
    it('should clear input value', () => {
      component.inputEl.nativeElement.value = '14:30';
      component.clear();
      expect(component.inputEl.nativeElement.value).toBe('');
    });

    it('should call onChangeModel with undefined', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.clear();
      expect(fn).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getErrorPattern:', () => {
    it('should return empty string when no error', () => {
      expect(component.getErrorPattern()).toBe('');
    });
  });

  describe('eventOnBlur:', () => {
    it('should call onTouchedModel', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.eventOnBlur({});
      expect(fn).toHaveBeenCalled();
    });

    it('should emit onblur', () => {
      spyOn(component.onblur, 'emit');
      component.eventOnBlur({});
      expect(component.onblur.emit).toHaveBeenCalled();
    });
  });

  describe('onHostKeydown:', () => {
    it('should close picker on Escape when visible', () => {
      component.visible = true;
      spyOn(component, 'togglePicker');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.onHostKeydown(event);
      expect(component.togglePicker).toHaveBeenCalledWith(false);
    });

    it('should not close picker on Escape when not visible', () => {
      component.visible = false;
      spyOn(component, 'togglePicker');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onHostKeydown(event);
      expect(component.togglePicker).not.toHaveBeenCalled();
    });

    it('should do nothing when readonly', () => {
      component.readonly = true;
      spyOn(component, 'togglePicker');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onHostKeydown(event);
      expect(component.togglePicker).not.toHaveBeenCalled();
    });
  });

  describe('handleCleanKeyboardTab:', () => {
    it('should prevent default when Tab is pressed and visible', () => {
      component.visible = true;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      spyOn(event, 'preventDefault');

      component.handleCleanKeyboardTab(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default when not visible', () => {
      component.visible = false;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      spyOn(event, 'preventDefault');

      component.handleCleanKeyboardTab(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onInputChange:', () => {
    it('should auto-format with colon after 2 digits', () => {
      const input = component.inputEl.nativeElement;
      input.value = '14';
      const event = { target: input } as any;

      component.onInputChange(event);
      expect(input.value).toBe('14:');
    });
  });

  describe('timeSelected:', () => {
    it('should set input value and call onChange', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      spyOn(component, 'togglePicker');

      component.timeSelected('14:30');
      expect(component.inputEl.nativeElement.value).toBe('14:30');
      expect(fn).toHaveBeenCalledWith('14:30');
    });

    it('should clear and close for undefined value', () => {
      spyOn(component, 'clear');
      spyOn(component.onchange, 'emit');

      component.timeSelected(undefined);
      expect(component.clear).toHaveBeenCalled();
      expect(component.onchange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('verifyMobile:', () => {
    it('should return a boolean', () => {
      const result = component.verifyMobile();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('showAdditionalHelp:', () => {
    it('should toggle displayAdditionalHelp', () => {
      expect(component.displayAdditionalHelp).toBe(false);
      component.showAdditionalHelp();
      expect(component.displayAdditionalHelp).toBe(true);
    });
  });

  describe('setHelper:', () => {
    it('should return helper settings', () => {
      const result = component.setHelper('Label', 'Tooltip');
      expect(result).toBeDefined();
    });
  });

  describe('closePicker:', () => {
    it('should set visible to false', () => {
      component.visible = true;
      component.closePicker();
      expect(component.visible).toBe(false);
    });
  });
});
