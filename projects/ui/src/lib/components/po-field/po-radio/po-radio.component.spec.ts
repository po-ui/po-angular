import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoRadioComponent } from './po-radio.component';

describe('PoRadioComponent', () => {
  let changeDetector: any;
  let component: PoRadioComponent;
  let fixture: ComponentFixture<PoRadioComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoRadioComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRadioComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of radio.', () => {
      const spyOnFocus = spyOn(component.radioLabel.nativeElement, 'focus');
      component.focus();

      expect(spyOnFocus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of radio if options is `disabled`.', () => {
      component.disabled = true;
      const spyOnFocus = spyOn(component.radioLabel.nativeElement, 'focus');
      component.focus();

      expect(spyOnFocus).not.toHaveBeenCalled();
    });

    describe('onKeyDown:', () => {
      let fakeEvent: any;

      beforeEach(() => {
        fakeEvent = {
          which: 32,
          keyCode: 32,
          preventDefault: () => {}
        };
      });

      it('should call `checkOption` and `preventDefault` if event `which` from spacebar', () => {
        const spyOnCheckOption = spyOn(component, 'checkOption');
        const spyOnPreventDefault = spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, component.radioValue);

        expect(spyOnCheckOption).toHaveBeenCalledWith(component.radioValue);
        expect(spyOnPreventDefault).toHaveBeenCalled();
      });

      it('shouldn`t call `checkOption` and `preventDefault` if event `which` or `keyCode` from tab.', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        const spyOnCheckOption = spyOn(component, 'checkOption');
        const spyOnPreventDefault = spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, component.radioValue);

        expect(spyOnCheckOption).not.toHaveBeenCalled();
        expect(spyOnPreventDefault).not.toHaveBeenCalled();
      });
    });

    it('changeModelValue: should update `changeModelValue` with property values', () => {
      const items = [
        { value: true, expectedValue: true },
        { value: false, expectedValue: false },
        { value: 'false', expectedValue: false },
        { value: 'true', expectedValue: false },
        { value: 'anotherValue', expectedValue: false }
      ];

      items.forEach(item => {
        component['changeModelValue'](item.value);
        expect(component.radioValue).toEqual(item.expectedValue);
      });
    });

    it('onBlur: should call `onTouched` on blur', () => {
      component.onTouched = value => {};

      spyOn(component, 'onTouched');
      component.onBlur();

      expect(component.onTouched).toHaveBeenCalledWith();
    });

    it('onBlur: shouldn´t throw error if onTouched is falsy', () => {
      component['onTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });
  });

  describe('Templates:', () => {
    it('should have label.', () => {
      const newLabel = 'PO';
      component.label = newLabel;

      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-radio-label')).toBeTruthy();
    });

    it('should set tabindex to -1 when radio is disabled.', () => {
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-radio-label[tabindex="-1"]')).toBeTruthy();
    });

    it('aria-checked should be true if radio is true', () => {
      component.radioValue = true;
      changeDetector.detectChanges();
      const spanRadio = nativeElement.querySelector('.po-radio');

      expect(spanRadio.getAttribute('aria-checked')).toBe('true');
    });

    it('aria-checked should be null if radio is null', () => {
      component.radioValue = null;
      changeDetector.detectChanges();
      const spanRadio = nativeElement.querySelector('.po-radio');

      expect(spanRadio.getAttribute('aria-checked')).toBeNull();
    });

    it('aria-checked should be false if radio is false', () => {
      component.radioValue = false;
      changeDetector.detectChanges();
      const spanRadio = nativeElement.querySelector('.po-radio');

      expect(spanRadio.getAttribute('aria-checked')).toBe('false');
    });
  });
});
