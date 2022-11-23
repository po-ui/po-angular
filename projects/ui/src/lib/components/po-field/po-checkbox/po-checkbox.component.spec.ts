import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCheckboxComponent } from './po-checkbox.component';

describe('PoCheckboxComponent:', () => {
  let changeDetector: any;
  let component: PoCheckboxComponent;
  let fixture: ComponentFixture<PoCheckboxComponent>;
  let nativeElement: any;
  let labelField: any;

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

    labelField = document.getElementsByClassName('po-checkbox-label');
  });

  it('should be created.', () => {
    expect(component).toBeTruthy();
  });

  it('should create a po-label for po-checkbox', () => {
    expect(labelField).toBeTruthy();
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of checkbox.', () => {
      component.checkboxLabel = new ElementRef({ focus() {}, label: 'test' });

      const spyOnFocus = spyOn(component.checkboxLabel.nativeElement, 'focus');
      changeDetector.detectChanges();
      component.focus();
      expect(spyOnFocus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of checkbox if option is `disabled`.', () => {
      component.checkboxLabel = new ElementRef({ focus() {}, label: 'test' });
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
        { value: null, expectedValue: 'mixed' },
        { value: 'false', expectedValue: false },
        { value: 'true', expectedValue: false },
        { value: 'anotherValue', expectedValue: false }
      ];

      items.forEach(item => {
        component['changeModelValue'](item.value);
        expect(component.checkboxValue).toEqual(item.expectedValue);
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
      expect(nativeElement.querySelector('.po-checkbox-label')).toBeTruthy();
    });

    it('should set tabindex to -1 when checkbox is disabled.', () => {
      component.label = 'Test';
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label[tabindex="-1"]')).toBeTruthy();
    });

    it('aria-checked should be true if checkbox is true', () => {
      component.checkboxValue = true;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBe('true');
    });

    it('aria-checked should be null if checkbox is null', () => {
      component.checkboxValue = null;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBeNull();
    });

    it('aria-checked should be false if checkbox is false', () => {
      component.checkboxValue = false;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBe('false');
    });
  });
});
