import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { of } from 'rxjs';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormComponent } from './po-dynamic-form.component';
import { PoDynamicModule } from '../po-dynamic.module';

describe('PoDynamicFormComponent:', () => {
  let component: PoDynamicFormComponent;
  let fixture: ComponentFixture<PoDynamicFormComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ PoDynamicModule ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDynamicFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoDynamicFormBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('form: should call `emitForm` and set property', fakeAsync(() => {
      spyOn(component, <any> 'emitForm');

      component.form = new NgForm(null, null);

      tick();

      expect(component['emitForm']).toHaveBeenCalled();
      expect(component.form instanceof NgForm).toBeTruthy();
    }));

    it('form: should return empty object', fakeAsync(() => {
      expect(component.form).toEqual(<any> {});
    }));

  });

  describe('Methods:', () => {

    it('emitForm: should call `formOutput.emit` if contains `formOutput.observers`', () => {
      const fakeThis = { formOutput: { observers: [{}], emit: () => {} } };

      spyOn(fakeThis.formOutput, 'emit');

      component['emitForm'].call(fakeThis);

      expect(fakeThis.formOutput.emit).toHaveBeenCalled();
    });

    it('emitForm: shouldn`t call `formOutput.emit` if `formOutput.observers.length` is falsy', () => {
      const fakeThis = { formOutput: { observers: [], emit: () => {} } };

      spyOn(fakeThis.formOutput, 'emit');

      component['emitForm'].call(fakeThis);

      expect(fakeThis.formOutput.emit).not.toHaveBeenCalled();
    });

    it('focus: should call `fieldsComponent.focus`.', () => {
      const spyFieldsComponentFocus = spyOn(component.fieldsComponent, 'focus');

      component.focus('field');

      expect(spyFieldsComponentFocus).toHaveBeenCalled();
    });

    it('validateForm: should update current field changed', () => {
      const updatedField = { property: 'new test', disabled: true };
      const fieldIndex = 0;

      component.fields = [ { property: 'test' } ];

      spyOn(component, <any>'disableForm');
      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of());

      component['validateForm']({ field: updatedField, fieldIndex });

      expect(component.fields).toEqual([ updatedField ]);
    });

    it('validateForm: should call disabledForm with true and false on observable finalize', () => {
      const updatedField = { property: 'test', disabled: true };
      const fieldIndex = 0;

      component.fields = [ { property: 'test' } ];

      spyOn(component, <any>'disableForm');

      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of());

      spyOn(component, <any>'applyFormValidation');

      component['validateForm']({ field: updatedField, fieldIndex });

      expect(component['disableForm']).toHaveBeenCalledWith(true);
      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('validateForm: should call applyFormValidation', () => {
      const updatedField = { property: 'test', disabled: true };
      const fieldIndex = 0;

      component.fields = [ { property: 'test' } ];

      spyOn(component, <any>'disableForm');
      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of());
      spyOn(component, <any>'applyFormValidation');

      component['validateForm']({ field: updatedField, fieldIndex });

      expect(component['applyFormValidation']).toHaveBeenCalled();
    });

    it('applyFormValidation: should merge value with validatedFields.value', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = {
        value: {
          name: 'new value'
        }
      };

      component.value = {
        name: 'value',
        age: '23'
      };

      const expectedValue = {
        name: 'new value',
        age: '23'
      };

      spyOn(component, <any>'setFocusOnValidation');
      spyOn(component['validationService'], 'updateFieldsForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component.value).toEqual(expectedValue);
    });

    it('applyFormValidation: should call updateFieldsForm to set fields', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, fields: undefined };

      const fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true },
      ];

      component.fields = [...fields];

      const expectedFields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true, help: 'test help' },
        { property: 'test5', required: true }
      ];

      spyOn(component, <any>'setFocusOnValidation');
      spyOn(component['validationService'], 'updateFieldsForm').and.returnValue(expectedFields);

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component.fields).toEqual(expectedFields);
      expect(component['validationService'].updateFieldsForm).toHaveBeenCalledWith(validatedFields.fields, fields);
    });

    it('applyFormValidation: should call setFocusOnValidation with validatedFields and previousFocusElement', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [
        { property: 'test1', required: true, visible: true }
      ];

      spyOn(component, <any>'setFocusOnValidation');
      spyOn(component['validationService'], 'updateFieldsForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['setFocusOnValidation']).toHaveBeenCalledWith(validatedFields, previousFocusElement);
    });

    it('disableForm: should update isDisableForm to true if param is true', () => {
      component.disabledForm = false;
      component['disableForm'](true);

      expect(component.disabledForm).toBe(true);
    });

    it('disableForm: should update isDisableForm to false if param is false', () => {
      component.disabledForm = true;
      component['disableForm'](false);

      expect(component.disabledForm).toBe(false);
    });

    it('disableForm: should call detectChanges', () => {
      spyOn(component['changes'], 'detectChanges');

      component['disableForm'](false);

      expect(component['changes'].detectChanges).toHaveBeenCalled();
    });

    it('setFocusOnValidation: should call focus if validatedFields.focus is defined', () => {
      const validatedFields = { focus: 'name' };
      const previousFocusElement = document.activeElement;

      spyOn(component, 'focus');

      component['setFocusOnValidation'](validatedFields, previousFocusElement);

      expect(component.focus).toHaveBeenCalledWith(validatedFields.focus);
    });

    it('setFocusOnValidation: should call previousElement.focus if validatedFields.focus is undefined', () => {
      const validatedFields = { focus: undefined };
      const previousFocusElement = document.activeElement;

      spyOn(previousFocusElement, <any>'focus');

      component['setFocusOnValidation'](validatedFields, previousFocusElement);

      expect(previousFocusElement['focus']).toHaveBeenCalled();
    });

  });

  describe('Templates:', () => {

    it('should find `form` and `po-dynamic-form-fields` tags if `groupForm` is falsy', () => {
      component.fields = [];
      component.groupForm = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('form')).toBeTruthy();
      expect(nativeElement.querySelector('po-dynamic-form-fields')).toBeTruthy();
    });

    it('shouldn`t find `form` tag but should find `po-dynamic-form-fields` tag if `groupForm` is truthy', () => {
      component.fields = [];
      component.groupForm = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('form')).toBeFalsy();
      expect(nativeElement.querySelector('po-dynamic-form-fields')).toBeTruthy();
    });

  });

});
