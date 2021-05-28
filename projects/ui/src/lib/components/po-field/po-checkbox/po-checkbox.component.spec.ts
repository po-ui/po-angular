import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCheckboxComponent } from './po-checkbox.component';

describe('PoCheckboxComponent:', () => {
  let changeDetector: any;
  let component: PoCheckboxComponent;
  let fixture: ComponentFixture<PoCheckboxComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoCheckboxComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCheckboxComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
    changeDetector.detectChanges();
  });

  it('should be created.', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of checkbox.', () => {
      const spyOnFocus = spyOn(component.checkboxLabel.nativeElement, 'focus');
      changeDetector.detectChanges();
      component.focus();
      expect(spyOnFocus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of checkbox if option is `disabled`.', () => {
      component.disabled = true;
      changeDetector.detectChanges();

      const spyOnFocus = spyOn(component.checkboxLabel.nativeElement, 'focus');
      component.focus();

      expect(spyOnFocus).not.toHaveBeenCalled();
    });

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

    describe('onKeyDown:', () => {
      let fakeEvent: any;

      beforeEach(() => {
        fakeEvent = {
          which: 32,
          keyCode: 32,
          preventDefault: () => {}
        };
      });

      it('should call `checkOption` and `preventDefault` if event `which` from spacebar.', () => {
        const spyOnCheckOption = spyOn(component, 'checkOption');
        const spyOnPreventDefault = spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).toHaveBeenCalledWith(component.checkboxValue);
        expect(spyOnPreventDefault).toHaveBeenCalled();
      });

      it('shouldn`t call `checkOption` and `preventDefault` if event `which` or `keyCode` from tab.', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        const spyOnCheckOption = spyOn(component, 'checkOption');
        const spyOnPreventDefault = spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).not.toHaveBeenCalled();
        expect(spyOnPreventDefault).not.toHaveBeenCalled();
      });

      it('should call `checkOption` and `preventDefault` when event keyCode from spacebar key and event which undefined.', () => {
        fakeEvent.which = undefined;

        const spyOnCheckOption = spyOn(component, 'checkOption');
        const spyOnPreventDefault = spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).toHaveBeenCalledWith(component.checkboxValue);
        expect(spyOnPreventDefault).toHaveBeenCalled();
      });
    });

    it('changeModelValue: should update `changeModelValue` with property values', () => {
      const items = [
        { value: true, expectedValue: true },
        { value: false, expectedValue: false },
        { value: null, expectedValue: null },
        { value: 'false', expectedValue: false },
        { value: 'true', expectedValue: false },
        { value: 'anotherValue', expectedValue: false }
      ];

      items.forEach(item => {
        component['changeModelValue'](<any>item.value);
        expect(component.checkboxValue).toBe(item.expectedValue);
      });
    });

    it('changeModelValue: should call `this.changeDetector.detectChanges`', () => {
      spyOn(component['changeDetector'], 'detectChanges');

      component['changeModelValue'](true);

      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
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
      expect(nativeElement.querySelector('.po-checkbox .po-checkbox-label')).toBeTruthy();
      expect(nativeElement.querySelector('.po-checkbox .po-checkbox-label').innerText).toContain(newLabel);
    });

    it('should be disabled.', () => {
      component.disabled = true;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('input[type="checkbox"]:disabled+label')).toBeTruthy();
    });

    it('should be indeterminated.', () => {
      component.checkboxValue = null;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-input-indeterminate+label')).toBeTruthy();
    });

    it('should set tabindex to -1 when checkbox is disabled.', () => {
      component.disabled = true;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label[tabindex="-1"]')).toBeTruthy();
    });

    it('should set tabindex to 0 when checkbox disabled is false.', () => {
      component.disabled = false;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label[tabindex="0"]')).toBeTruthy();
    });

    it('should have `po-clickable` class if `disabled` is false.', () => {
      component.disabled = false;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label.po-clickable')).toBeTruthy();
    });

    it('shouldn´t have `po-clickable` class if `disabled` is true.', () => {
      component.disabled = true;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label.po-clickable')).toBeFalsy();
    });

    it('should have `po-clickable` class if `disabled` is false.', () => {
      component.disabled = false;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label.po-clickable')).toBeTruthy();
    });

    it('shouldn´t have `po-clickable` class if `disabled` is true.', () => {
      component.disabled = true;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label.po-clickable')).toBeFalsy();
    });

    it('should have `po-checkbox-input-checked` class if `checkboxValue` is true.', () => {
      component.checkboxValue = true;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-input-checked')).toBeTruthy();
    });

    it('shouldn´t have `po-checkbox-input-checked` class if `checkboxValue` is false.', () => {
      component.checkboxValue = false;
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-input-checked')).toBeFalsy();
    });
  });
});
