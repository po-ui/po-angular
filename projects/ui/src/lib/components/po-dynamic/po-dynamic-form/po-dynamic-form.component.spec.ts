import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

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
