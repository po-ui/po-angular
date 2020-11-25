import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { expectSettersMethod, configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoNumberComponent } from './po-number.component';

describe('PoNumberComponent:', () => {
  let component: PoNumberComponent;
  let fixture: ComponentFixture<PoNumberComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNumberComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNumberComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create button clean', () => {
    expect(nativeElement.querySelector('po-clean')).not.toBeNull();
  });

  it('should have a Label', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have a Help', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should be max and min', () => {
    expectSettersMethod(component, 'setMax', '', 'max', '');
    expectSettersMethod(component, 'setMax', 10, 'max', 10);

    expectSettersMethod(component, 'setMin', '', 'min', '');
    expectSettersMethod(component, 'setMin', 10, 'min', 10);
  });

  it('should call minFailed', () => {
    component.min = 4;

    expect(component.validate(new FormControl('2'))).not.toBeNull();
  });

  it('should call maxFailed', () => {
    component.max = 5;

    expect(component.validate(new FormControl('10'))).not.toBeNull();
  });

  describe('Methods: ', () => {
    it('extraValidation: should invalidate number if invalidInputValueOnBlur is true and set errorPattern with a defined value', () => {
      component['invalidInputValueOnBlur'] = true;
      component.errorPattern = 'errorPattern';

      const expectedReturn = { number: { valid: false } };
      const result = component.validate(new FormControl('2e'));

      expect(result).toEqual(expectedReturn);
      expect(component.errorPattern).toBe('errorPattern');
    });

    it('extraValidation: should invalidate number if invalidInputValueOnBlur is true and set errorPattern with default value', () => {
      component['invalidInputValueOnBlur'] = true;
      component.errorPattern = 'Valor Inválido';

      const expectedReturn = { number: { valid: false } };
      const result = component.validate(new FormControl('2e'));

      expect(result).toEqual(expectedReturn);
      expect(component.errorPattern).toBe('Valor Inválido');
    });

    it('extraValidation: should return null in extraValidation()', () => {
      component.min = 0;
      component.max = 0;
      component['invalidInputValueOnBlur'] = false;

      expect(component.extraValidation(new FormControl(null))).toBeNull();
    });

    it('should return null stating that there is no validation error in the value between max and min in format decimal', () => {
      component.min = 0.6;
      component.max = 0.9;
      expect(component.validate(new FormControl(0.7))).toBeNull();
    });

    it('should not return null stating that there is a validation error in the value between max and min in decimal format', () => {
      component.min = 1.6;
      component.max = 3.9;
      expect(component.validate(new FormControl(5))).not.toBeNull();
    });

    describe('getErrorPatternMessage: ', () => {
      it('should return errorPattern value if errorPattern has value and containsInvalidClass returns true and show the properly message in template', () => {
        component.el.nativeElement.value = '1e';
        component.errorPattern = 'erro';
        component.el.nativeElement.classList.add('ng-invalid');
        component.el.nativeElement.classList.add('ng-dirty');
        component['invalidInputValueOnBlur'] = true;

        const expectedResult = component.getErrorPatternMessage();

        expect(expectedResult).toBe('erro');

        fixture.detectChanges();
        const content = fixture.debugElement.nativeElement
          .querySelector('.po-field-container-bottom-text-error')
          .innerHTML.toString();

        expect(content.indexOf('erro') > -1).toBeTruthy();
      });

      it('should return empty string if errorPattern is empty', () => {
        component.errorPattern = '';

        const expectedResult = component.getErrorPatternMessage();

        expect(expectedResult).toBe('');
        expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error')).toBeNull();
      });

      it('should return empty string if errorPattern has value but containsInvalidClass returns false', () => {
        component.el.nativeElement.value = '';
        component.errorPattern = 'error';
        component.el.nativeElement.classList.add('ng-invalid');
        component.el.nativeElement.classList.add('ng-dirty');
        component['invalidInputValueOnBlur'] = false;

        const expectedResult = component.getErrorPatternMessage();

        expect(expectedResult).toBe('');
        expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error')).toBeNull();
      });
    });
  });

  describe('Templates: ', () => {
    it('tabindex: should set tabindex to -1 when `po-number` is disabled.', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input:disabled[tabindex="-1"]')).toBeTruthy();
    });

    it('tabindex: should set tabindex to 0 when `po-number` is enabled.', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input[tabindex="0"]')).toBeTruthy();
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
