import { AbstractControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoFieldModule } from './../po-field.module';
import { PoNumberBaseComponent } from './po-number-base.component';

@Component({
  template: `
    <input type="number" #inp />
    <span #clean></span>
  `
})
class ContentProjectionComponent extends PoNumberBaseComponent {
  constructor(el: ElementRef) {
    super(el);
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}

describe('PoNumberBaseComponent', () => {
  let component: ContentProjectionComponent;
  let fixture: ComponentFixture<ContentProjectionComponent>;

  const fakeEvent = {
    target: {
      value: '',
      keyCode: 1,
      validity: {
        valid: true
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoFieldModule],
      declarations: [ContentProjectionComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('onBlur: shouldn`t call `callOnChange` if event.target.value is empty and event.target.validity.valid is true', () => {
    fakeEvent.target.value = '';
    fakeEvent.target.validity.valid = true;

    const fakeThis = {
      invalidInputValueOnBlur: false,
      callOnChange: (v: any) => {},
      eventOnBlur: e => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis, 'eventOnBlur');

    component.onBlur.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).toHaveBeenCalledWith(fakeEvent);
  });

  it('onBlur: shouldn`t call `callOnChange` if event.target.value has value and event.target.validity.valid is true', () => {
    fakeEvent.target.value = '1234567890';
    fakeEvent.target.validity.valid = true;

    const fakeThis = {
      invalidInputValueOnBlur: false,
      callOnChange: (v: any) => {},
      eventOnBlur: e => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis, 'eventOnBlur');

    component.onBlur.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).toHaveBeenCalledWith(fakeEvent);
  });

  it('onBlur: should call `callOnChange` if event.target.value is empty and event.target.validity.valid is false', () => {
    fakeEvent.target.value = '';
    fakeEvent.target.validity.valid = false;
    const fakeThis = {
      invalidInputValueOnBlur: false,
      callOnChange: (v: any) => {},
      eventOnBlur: e => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis, 'eventOnBlur');

    component.onBlur.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalledWith('Valor Inválido');
    expect(fakeThis.eventOnBlur).toHaveBeenCalledWith(fakeEvent);
  });

  it('onKeyDown: shouldn`t allow invalid keys and should call `preventDefault`', () => {
    const fakeKeyboardEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      key: 'e'
    };

    spyOn(fakeKeyboardEvent, 'preventDefault');
    spyOn(fakeKeyboardEvent, 'stopPropagation');
    spyOn(component, <any>'isKeyAllowed').and.returnValue(false);

    component.onKeyDown(fakeKeyboardEvent);

    expect(fakeKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(fakeKeyboardEvent.stopPropagation).toHaveBeenCalled();
    expect(component['isKeyAllowed']).toHaveBeenCalledWith(fakeKeyboardEvent);
  });

  it('onKeyDown: shouldn`t call `preventDefault`', () => {
    const fakeKeyboardEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      key: '1'
    };

    spyOn(fakeKeyboardEvent, 'preventDefault');
    spyOn(fakeKeyboardEvent, 'stopPropagation');
    spyOn(component, <any>'isKeyAllowed').and.returnValue(true);

    component.onKeyDown(fakeKeyboardEvent);

    expect(fakeKeyboardEvent.preventDefault).not.toHaveBeenCalled();
    expect(fakeKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('isKeyAllowed: should return false if is a letter', () => {
    const fakeKeyboardEvent = {
      key: 'e'
    };
    spyOn(component, <any>'isShortcut').and.returnValue(false);
    spyOn(component, <any>'isControlKeys').and.returnValue(false);
    spyOn(component, <any>'isInvalidKey').and.returnValue(true);

    const result = component['isKeyAllowed'](fakeKeyboardEvent);
    expect(result).toBeFalse();
  });

  it('isKeyAllowed: should return true if isn`t a letter', () => {
    const fakeKeyboardEvent = {
      key: '1'
    };
    spyOn(component, <any>'isShortcut').and.returnValue(false);
    spyOn(component, <any>'isControlKeys').and.returnValue(false);
    spyOn(component, <any>'isInvalidKey').and.returnValue(false);

    const result = component['isKeyAllowed'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isShortcut: should return true if is an copy event', () => {
    const fakeKeyboardEvent = {
      keyCode: 67,
      ctrlKey: true
    };

    const result = component['isShortcut'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isShortcut: should return true if is a paste event', () => {
    const fakeKeyboardEvent = {
      keyCode: 86,
      metaKey: true
    };

    const result = component['isShortcut'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isShortcut: should return true if is a select all event', () => {
    const fakeKeyboardEvent = {
      keyCode: 65,
      metaKey: true
    };

    const result = component['isShortcut'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isShortcut: should return true if is a cut event', () => {
    const fakeKeyboardEvent = {
      keyCode: 88,
      metaKey: true
    };

    const result = component['isShortcut'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isShortcut: should return false if isn`t a allowed shortcut', () => {
    const fakeKeyboardEvent = {
      keyCode: 66,
      metaKey: false
    };

    const result = component['isShortcut'](fakeKeyboardEvent);
    expect(result).toBeFalse();
  });

  it('isControlKeys: should return true if is a control key', () => {
    const fakeKeyboardEvent = {
      key: 'Backspace'
    };

    const result = component['isControlKeys'](fakeKeyboardEvent);
    expect(result).toBeTrue();
  });

  it('isControlKeys: should return false if isn`t a control key', () => {
    const fakeKeyboardEvent = {
      key: 'e'
    };

    const result = component['isControlKeys'](fakeKeyboardEvent);
    expect(result).toBeFalse();
  });

  it('isInvalidKey: should return true if is invalid', () => {
    const key = 'e';

    const result = component['isInvalidKey'](key);
    expect(result).toBeTrue();
  });

  it('isInvalidKey: should return false if is valid', () => {
    const key = '1';

    const result = component['isInvalidKey'](key);
    expect(result).toBeFalse();
  });

  it('eventOnInput: should call "callOnChange" if doesn`t contain mask and set invalidInputValueOnBlur with false', () => {
    fakeEvent.target.value = '1234567890';
    const fakeThis = {
      mask: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      maxlength: 5,
      formatNumber: component['formatNumber'],
      inputEl: component.inputEl,
      invalidInputValueOnBlur: true,
      isEndWithDot: () => {}
    };

    spyOn(fakeThis, 'callOnChange');

    component.eventOnInput.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalledWith(12345);
    expect(fakeThis.invalidInputValueOnBlur).toBe(false);
    expect(fakeThis.inputEl.nativeElement.value).toBe('12345');
  });

  it('eventOnInput: should call "callOnChange" if doesn`t contain mask and maxlength', () => {
    fakeEvent.target.value = '12345';
    const fakeThis = {
      mask: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      formatNumber: component['formatNumber'],
      inputEl: component.inputEl,
      invalidInputValueOnBlur: true,
      isEndWithDot: () => {}
    };

    spyOn(fakeThis, 'callOnChange');

    component.eventOnInput.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalledWith(12345);
  });

  it('eventOnInput: should not call "callOnChange" if has mask', () => {
    const fakeThis = {
      mask: true,
      callOnChange: () => {},
      validMaxLength: () => {},
      maxlength: ''
    };

    spyOn(fakeThis, 'callOnChange');
    component.eventOnInput.call(fakeThis, fakeEvent);
    expect(fakeThis.callOnChange).not.toHaveBeenCalled();
  });

  it('should valid maxlength when its defined', () => {
    let value = component.validMaxLength(10, '0123456789123456789');
    expect(value).toBe('0123456789');

    value = component.validMaxLength(10, '012345678.21');
    expect(value).toBe('012345678');

    value = component.validMaxLength(20, '0123456789123456789');
    expect(value).toBe('0123456789123456789');

    value = component.validMaxLength(30, '0123456789123456789');
    expect(value).toBe('0123456789123456789');
  });

  it('should valid maxlength when its not defined', () => {
    const value = component.validMaxLength(0, '0123456789123456789');
    expect(value).toBe('0123456789123456789');
  });

  it('should check if value end with dot', () => {
    expect(component['isEndWithDot']('1234.')).toBeTruthy();
  });

  it('shouldn`t check if value end with dot when value param is white', () => {
    expect(component['isEndWithDot']('')).toBeFalsy();
  });

  it('should format value string in number', () => {
    expect(component['formatNumber']('1234')).toBeTruthy(1234);
  });

  it('shouldn`t format value string in number when is a falsy value', () => {
    expect(component['formatNumber']('')).toEqual(null);
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    it('writeValueModel: should emit change', () => {
      const value = 10;
      const fakeThis = {
        inputEl: '',
        mask: '',
        changeModel: component.changeModel
      };
      spyOn(component.changeModel, 'emit');

      component.writeValueModel.call(fakeThis, value);

      expect(component.changeModel.emit).toHaveBeenCalledWith(value);
    });

    it('should set value in input', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '',
        changeModel: component.change
      };

      component.writeValueModel.call(fakeThis, 10);

      expect(component.inputEl.nativeElement.value).toBe('10');
    });

    it('should set value in input, formatted with mask', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '(999)',
        objMask: {
          controlFormatting: value => value + '999',
          formatModel: false
        },
        changeModel: component.changeModel
      };

      component.writeValueModel.call(fakeThis, '100');

      fixture.detectChanges();

      expect(component.inputEl.nativeElement.value).toBe('100999');
    });

    it('should clean input when "value" to be null', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '',
        objMask: {
          controlFormatting: value => {},
          formatModel: true
        },
        changeModel: component.changeModel
      };

      component.writeValueModel.call(fakeThis, '');

      fixture.detectChanges();

      expect(component.inputEl.nativeElement.value).toBe('');
    });

    it('should set value in input, formatted with mask and model formatted', () => {
      const fakeThis = {
        inputEl: component.inputEl,
        mask: '(999)',
        objMask: {
          controlFormatting: value => value + '999',
          formatModel: true
        },
        changeModel: component.changeModel,
        onChangePropagate: component.onChangePropagate
      };

      spyOn(fakeThis, 'onChangePropagate');

      component.writeValueModel.call(fakeThis, '100');

      expect(component.inputEl.nativeElement.value).toBe('100999');
      expect(fakeThis.onChangePropagate).toHaveBeenCalled();
    });
  });
});
