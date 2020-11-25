import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoLoginComponent } from './po-login.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoCleanComponent } from './../po-clean/po-clean.component';

describe('PoLoginComponent:', () => {
  let component: PoLoginComponent;
  let fixture: ComponentFixture<PoLoginComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoLoginComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLoginComponent);
    component = fixture.componentInstance;
    component.clean = true;
    component.type = 'text';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return null in extraValidation()', () => {
    expect(component.extraValidation(null)).toBeNull();
  });

  it('should be type text', () => {
    expect(component.type === 'text').toBeTruthy();
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

  it('should show optional property when not required and have help property', () => {
    component.required = false;
    component.optional = true;
    component.help = 'help';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).not.toBeNull();
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
  });

  describe('Templates:', () => {
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
