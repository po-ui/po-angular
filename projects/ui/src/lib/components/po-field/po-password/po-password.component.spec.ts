import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoPasswordComponent } from './po-password.component';

describe('PoNumberComponent:', () => {
  let component: PoPasswordComponent;
  let fixture: ComponentFixture<PoPasswordComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoPasswordComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPasswordComponent);
    component = fixture.componentInstance;
    component.clean = true;
    component.type = 'password';
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return null in extraValidation()', () => {
    expect(component.extraValidation(null)).toBeNull();
  });

  it('should be type password', () => {
    expect(component.type === 'password').toBeTruthy();
  });

  it('should show optional property if is not `required` and have `help`, `label` and `optional` properties.', () => {
    component.optional = true;
    component.required = false;
    component.help = 'help';
    component.label = 'label';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).not.toBeNull();
  });

  it('should not show optional property when required property is true', () => {
    component.required = true;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
  });

  it('should not show optional property when required property is true and have label and help', () => {
    component.required = true;
    component.help = 'help';
    component.label = 'label';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
  });

  it('should not show optional property when not have label and help properties', () => {
    component.required = false;
    component.help = undefined;
    component.label = undefined;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
  });

  describe('Properties:', () => {
    it('p-hide-password-peek: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'hidePasswordPeek', validValues, expectedValues);
    });

    it('p-hide-password-peek: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'hidePasswordPeek', invalidValues, false);
    });

    it('p-hide-password-peek: should update `visiblePassword` with `false` if `hidePasswordPeek` is `true`.', () => {
      component.hidePasswordPeek = true;
      const expectedValue = 'password';

      expect(component.visiblePassword).toBe(false);
      expect(component.type).toEqual(expectedValue);
    });

    it('p-hide-password-peek: should update `visiblePassword` with `true` if `hidePasswordPeek` is `false`.', () => {
      component.hidePasswordPeek = false;
      component.visiblePassword = true;
      const expectedValue = 'text';
      component.type = expectedValue;

      expect(component.visiblePassword).toBe(true);
      expect(component.type).toEqual(expectedValue);
    });

    it('autocomplete: should return `new-password` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('new-password');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });
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

    it('showPassword: should update `visiblePassword` with `true`.', () => {
      component.visiblePassword = false;

      component.showPassword();

      expect(component.visiblePassword).toBe(true);
    });

    it('showPassword: should update `visiblePassword` with `false`.', () => {
      component.visiblePassword = true;

      component.showPassword();

      expect(component.visiblePassword).toBe(false);
    });

    it('showPassword: should update `type` with `text`.', () => {
      component.type = 'password';
      const expetedValue = 'text';

      component.showPassword();

      expect(component.type).toEqual(expetedValue);
    });

    it('showPassword: should update `type` with `password`.', () => {
      component.type = 'text';
      const expetedValue = 'password';

      component.showPassword();

      expect(component.type).toEqual(expetedValue);
    });
  });

  describe('Templates:', () => {
    it('should have the class `po-input-double-icon-right` if `hidePasswordPeek` is false, `clean` is true and `input` has value.', () => {
      component.hidePasswordPeek = false;
      component.clean = true;
      component.inputEl.nativeElement.value = 'SENH@!';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-double-icon-right')).toBeTruthy();
    });

    it('shouldn`t have the class `po-input-double-icon-right` if `hidePasswordPeek` is true.', () => {
      component.hidePasswordPeek = true;
      component.clean = true;
      component.inputEl.nativeElement.value = 'SENH@!';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-double-icon-right')).toBeFalsy();
    });

    it('shouldn`t have the class `po-input-double-icon-right` if `clean` is false.', () => {
      component.hidePasswordPeek = false;
      component.clean = false;
      component.inputEl.nativeElement.value = 'SENH@!';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-double-icon-right')).toBeFalsy();
    });

    it('should have class `po-input-icon-right` if `hidePasswordPeek` is false.', () => {
      component.hidePasswordPeek = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-icon-right')).toBeTruthy();
    });

    it('should have class `po-input-icon-right` if `clean` is true.', () => {
      component.clean = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-icon-right')).toBeTruthy();
    });

    it('shouldn`t have class `po-input-icon-right` if `clean` is false and `hidePasswordPeek` is true.', () => {
      component.clean = false;
      component.hidePasswordPeek = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input-icon-right')).toBeFalsy();
    });

    it('should have the icon `eye-off`.', () => {
      component.hidePasswordPeek = false;
      component.visiblePassword = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-eye')).toBeNull();
      expect(nativeElement.querySelector('.po-icon-eye-off')).toBeTruthy();
      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('should have the icon `eye`.', () => {
      component.hidePasswordPeek = false;
      component.visiblePassword = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-eye')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-eye-off')).toBeNull();
      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeNull();
    });

    it(`shouldn't have icon.`, () => {
      component.hidePasswordPeek = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-eye')).toBeNull();
      expect(nativeElement.querySelector('.po-icon-eye-off')).toBeNull();
      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeNull();
    });

    it('should hide peek password if input is disabled', () => {
      component.disabled = true;
      component.inputEl.nativeElement.value = 'SENH@!';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-eye')).toBeNull();
      expect(nativeElement.querySelector('.po-icon-eye-off')).toBeNull();
    });

    it('should update the value of type to password', () => {
      component.disabled = true;
      component.hidePasswordPeek = false;
      component.inputEl.nativeElement.value = 'SENH@!';
      const expectedValue = 'password';

      fixture.detectChanges();

      expect(component.inputEl.nativeElement.type).toBe(expectedValue);
      expect(component.visiblePassword).toBeFalsy();
      expect(nativeElement.querySelector('.po-icon-eye')).toBeNull();
      expect(nativeElement.querySelector('.po-icon-eye-off')).toBeNull();
    });

    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it('should show po-clean if `clean` is true and `disabled` and `readonly` are false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = false;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBeTruthy();
    });

    it('shouldn`t show po-clean if `clean` is true and `disabled` is true', () => {
      component.clean = true;
      component.disabled = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is true and `readonly` is true and `disabled` is false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is false', () => {
      component.clean = false;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });
  });
});
