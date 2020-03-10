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

  it('should call keyup from mask with keyCode different 229', () => {
    const fakeThis = {
      isMobile: () => false,
      mask: '(999)',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {},
      eventOnBlur: e => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis.objMask, 'keyup');
    spyOn(fakeThis, 'eventOnBlur');

    component.onKeyup.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalled();
    expect(fakeThis.objMask.keyup).toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).toHaveBeenCalled();
  });

  it('shouldn`t call keyup from mask with keyCode equal to 229', () => {
    const fakeThis = {
      isMobile: () => true,
      mask: '(999)',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {},
      eventOnBlur: e => {}
    };

    const fakeEventLocal = {
      target: {
        value: '',
        keyCode: 229
      }
    };

    spyOn(fakeThis.objMask, 'keyup');
    spyOn(fakeThis, 'eventOnBlur');

    component.onKeyup.call(fakeThis, fakeEventLocal);

    expect(fakeThis.objMask.keyup).not.toHaveBeenCalled();
    expect(fakeThis.eventOnBlur).not.toHaveBeenCalled();
  });

  it('should not call keyup when the mask is empty and keyCode is different of 229', () => {
    const fakeThis = {
      mask: '',
      objMask: {
        keyup: (value: any) => {},
        valueToModel: ''
      },
      callOnChange: () => {}
    };

    spyOn(fakeThis, 'callOnChange');
    spyOn(fakeThis.objMask, 'keyup');

    component.onKeyup.call(fakeThis, event);

    expect(fakeThis.callOnChange).not.toHaveBeenCalled();
    expect(fakeThis.objMask.keyup).not.toHaveBeenCalled();
  });

  it('should call "callOnChange" eventOnInput without mask', () => {
    fakeEvent.target.value = '1234567890';
    const fakeThis = {
      mask: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      maxlength: 5,
      formatNumber: component['formatNumber'],
      inputEl: component.inputEl,
      isEndWithDot: () => {}
    };

    spyOn(fakeThis, 'callOnChange');

    component.eventOnInput.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalledWith(12345);
    expect(fakeThis.inputEl.nativeElement.value).toBe('12345');
  });

  it('should call "callOnChange" eventOnInput without mask and maxlength', () => {
    fakeEvent.target.value = '12345';
    const fakeThis = {
      mask: false,
      callOnChange: (v: any) => {},
      validMaxLength: component.validMaxLength,
      formatNumber: component['formatNumber'],
      inputEl: component.inputEl,
      isEndWithDot: () => {}
    };

    spyOn(fakeThis, 'callOnChange');

    component.eventOnInput.call(fakeThis, fakeEvent);

    expect(fakeThis.callOnChange).toHaveBeenCalledWith(12345);
  });

  it('should not call "callOnChange" on eventOnInput with mask', () => {
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
