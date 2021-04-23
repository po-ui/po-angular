import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { Observable, of, throwError } from 'rxjs';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormComponent } from './po-dynamic-form.component';
import { PoDynamicModule } from '../po-dynamic.module';

describe('PoDynamicFormComponent:', () => {
  let component: PoDynamicFormComponent;
  let fixture: ComponentFixture<PoDynamicFormComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoDynamicModule],
      providers: [NgForm]
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
      spyOn(component, <any>'emitForm');

      component.form = new NgForm(null, null);

      tick();

      expect(component['emitForm']).toHaveBeenCalled();
      expect(component.form instanceof NgForm).toBeTruthy();
    }));

    it('form: should return empty object', fakeAsync(() => {
      expect(component.form).toEqual(<any>{});
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

    it('validateForm: should call sendFormChange with validate, field and value', () => {
      const updatedField = { property: 'test', disabled: true };
      component.validate = 'http://fakeUrlPo.com';
      component.value = { test: 'new value' };

      component.fields = [{ property: 'test' }];

      spyOn(component, <any>'disableForm');
      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of());

      component['validateForm'](updatedField);

      expect(component['validationService'].sendFormChange).toHaveBeenCalledWith(
        component.validate,
        updatedField,
        component.value
      );
    });

    it('validateForm: should call disabledForm with false if observable returns an error', () => {
      const updatedField = { property: 'test', disabled: true };

      component.fields = [{ property: 'test' }];

      spyOn(component, <any>'disableForm');

      spyOn(component['validationService'], 'sendFormChange').and.returnValue(throwError('error'));

      spyOn(component, <any>'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('validateForm: should call disabledForm with true on subcribe of observable', () => {
      const updatedField = { property: 'test', disabled: true };
      const updatedFormField = { fields: [{ property: 'test', disabled: true }] };

      component.fields = [{ property: 'test' }];

      spyOn(component, <any>'disableForm');

      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of(updatedFormField));

      spyOn(component, <any>'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['disableForm']).toHaveBeenCalledWith(true);
    });

    it('validateForm: should call applyFormValidation', () => {
      const updatedField = { property: 'test', disabled: true };

      component.fields = [{ property: 'test' }];

      spyOn(component, <any>'disableForm');
      spyOn(component['validationService'], 'sendFormChange').and.returnValue(of());
      spyOn(component, <any>'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['applyFormValidation']).toHaveBeenCalled();
    });

    it('applyFormValidation: should call setFocusOnFieldByProperty with property and previousFocusElement', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelWithValidation');
      spyOn(component, <any>'disableForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['setFocusOnFieldByProperty']).toHaveBeenCalledWith(validatedFields.focus, previousFocusElement);
    });

    it('applyFormValidation: should call disableForm with false', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelWithValidation');
      spyOn(component, <any>'disableForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('applyFormValidation: should call updateModelWithValidation with validatedFields', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelWithValidation');
      spyOn(component, <any>'disableForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['updateModelWithValidation']).toHaveBeenCalledWith(validatedFields);
    });

    it('updateModelWithValidation: should call updateFieldsForm to set fields and updatePreviousValue', () => {
      const validatedFields = { value: {}, fields: undefined };

      const fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true }
      ];

      component.value = {};
      component.fields = [...fields];

      const expectedFields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true, help: 'test help' },
        { property: 'test5', required: true }
      ];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component['validationService'], 'updateFieldsForm').and.returnValue(expectedFields);
      spyOn(component.fieldsComponent, 'updatePreviousValue').and.returnValue();

      component['updateModelWithValidation'](validatedFields);

      expect(component.fields).toEqual(expectedFields);
      expect(component.fieldsComponent.updatePreviousValue).toHaveBeenCalled();
      expect(component['validationService'].updateFieldsForm).toHaveBeenCalledWith(validatedFields.fields, fields);
    });

    it('updateModelWithValidation: should merge value with validatedFields.value', () => {
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

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component['validationService'], 'updateFieldsForm');

      component['updateModelWithValidation'](validatedFields);

      expect(component.value).toEqual(expectedValue);
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

    it('setFocusOnFieldByProperty: should call focus if property is defined', fakeAsync(() => {
      const property = 'name';
      const previousFocusElement = document.activeElement;

      spyOn(component, 'focus');

      component['setFocusOnFieldByProperty'](property, previousFocusElement);
      tick();

      expect(component.focus).toHaveBeenCalledWith(property);
    }));

    it('setFocusOnFieldByProperty: should call previousElement.focus if property is undefined', () => {
      const property = undefined;
      const previousFocusElement = document.activeElement;

      spyOn(previousFocusElement, <any>'focus');

      component['setFocusOnFieldByProperty'](property, previousFocusElement);

      expect(previousFocusElement['focus']).toHaveBeenCalled();
    });

    it('ngOnInit: should call `loadDataOnInitialize` if `load` is truthy', () => {
      component.load = 'http://service/api';

      const spyLoadDataOnInitialize = spyOn(component, <any>`loadDataOnInitialize`);

      component.ngOnInit();

      expect(spyLoadDataOnInitialize).toHaveBeenCalled();
    });

    it('ngOnInit: shouldn`t call `loadDataOnInitialize` if `load` is falsy', () => {
      component.load = undefined;

      const spyLoadDataOnInitialize = spyOn(component, <any>`loadDataOnInitialize`);

      component.ngOnInit();

      expect(spyLoadDataOnInitialize).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should call `removeListeners`', () => {
      const spyRemoveListeners = spyOn(component, <any>`removeListeners`);

      component.ngOnDestroy();

      expect(spyRemoveListeners).toHaveBeenCalled();
    });

    it(`removeListeners: should call 'onLoadSubscription.unsubscribe' and 'spySendFormSubscription.unsubscribe' if
      they are truthy`, () => {
      component['onLoadSubscription'] = <any>{ unsubscribe: () => {} };
      component['sendFormSubscription'] = <any>{ unsubscribe: () => {} };

      const spyOnLoadSubscription = spyOn(component['onLoadSubscription'], <any>'unsubscribe');
      const spySendFormSubscription = spyOn(component['sendFormSubscription'], <any>'unsubscribe');

      component['removeListeners']();

      expect(spyOnLoadSubscription).toHaveBeenCalled();
      expect(spySendFormSubscription).toHaveBeenCalled();
    });

    it(`removeListeners: shouldn't call 'onLoadSubscription.unsubscribe' and 'spySendFormSubscription.unsubscribe'
      if they are falsy`, () => {
      component['onLoadSubscription'] = <any>{ unsubscribe: () => {} };
      component['sendFormSubscription'] = <any>{ unsubscribe: () => {} };

      const spyOnLoadSubscription = spyOn(component['onLoadSubscription'], <any>'unsubscribe');
      const spySendFormSubscription = spyOn(component['sendFormSubscription'], <any>'unsubscribe');

      component['onLoadSubscription'] = undefined;
      component['sendFormSubscription'] = undefined;

      component['removeListeners']();

      expect(spyOnLoadSubscription).not.toHaveBeenCalled();
      expect(spySendFormSubscription).not.toHaveBeenCalled();
    });

    it('updateModelOnLoad: should call `createAndUpdateFieldsForm` to set fields', () => {
      const loadedFormData = {
        value: {},
        fields: [
          { property: 'test1', required: false, visible: false, label: 'TESTE' },
          { property: 'cpf', required: true }
        ]
      };

      const fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true }
      ];

      component.value = {};
      component.fields = [...fields];

      const expectedFields = [
        { property: 'test1', required: false, visible: false, label: 'TESTE' },
        { property: 'test2', required: false, visible: true },
        { property: 'cpf', required: true }
      ];

      const spyCreateAndUpdateFieldsForm = spyOn(
        component['loadService'],
        'createAndUpdateFieldsForm'
      ).and.callThrough();

      component['updateModelOnLoad'](loadedFormData);

      expect(component.fields).toEqual(expectedFields);
      expect(spyCreateAndUpdateFieldsForm).toHaveBeenCalledWith(loadedFormData.fields, fields);
    });

    it('updateModelOnLoad: should merge value with loadedFormData.value', () => {
      const loadedFormData = {
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

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component['loadService'], 'createAndUpdateFieldsForm');

      component['updateModelOnLoad'](loadedFormData);

      expect(component.value).toEqual(expectedValue);
    });

    it('applyFormUpdatesOnLoad: should call setFocusOnFieldByProperty with property and previousFocusElement', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelOnLoad');
      spyOn(component, <any>'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(validatedFields);

      expect(component['setFocusOnFieldByProperty']).toHaveBeenCalledWith(validatedFields.focus, previousFocusElement);
    });

    it('applyFormUpdatesOnLoad: should call disableForm with false', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelOnLoad');
      spyOn(component, <any>'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(validatedFields);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('applyFormUpdatesOnLoad: should call updateModelOnLoad with loadedFormData', () => {
      const previousFocusElement = document.activeElement;

      const loadedFormData = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      spyOn(component, <any>'setFocusOnFieldByProperty');
      spyOn(component, <any>'updateModelOnLoad');
      spyOn(component, <any>'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(loadedFormData);

      expect(component['updateModelOnLoad']).toHaveBeenCalledWith(loadedFormData);
    });

    it('loadDataOnInitialize: should call executeLoad with load and value', () => {
      component.load = 'http://fakeUrlPo.com';
      component.value = { test: 'new value' };

      spyOn(component, <any>'disableForm');
      const spyExecuteLoad = spyOn(component['loadService'], 'executeLoad').and.returnValue(of());

      component['loadDataOnInitialize']();

      expect(spyExecuteLoad).toHaveBeenCalledWith(component.load, component.value);
    });

    it('loadDataOnInitialize: should call disabledForm with false if observable returns an error', () => {
      component.fields = [{ property: 'test' }];
      component.disabledForm = true;

      spyOn(component['loadService'], 'executeLoad').and.returnValue(throwError('error'));
      spyOn(component, <any>'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(component.disabledForm).toBe(false);
    });

    it('loadDataOnInitialize: should call disabledForm with true on subcribe of observable', () => {
      const loadedFormData = { fields: [{ property: 'test', disabled: true }] };

      component.fields = [{ property: 'test' }];

      spyOn(component['loadService'], 'executeLoad').and.returnValue(of(loadedFormData));
      spyOn(component, <any>'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(component.disabledForm).toBe(true);
    });

    it('loadDataOnInitialize: should call applyFormUpdatesOnLoad', () => {
      component.fields = [{ property: 'test' }];

      spyOn(component['loadService'], 'executeLoad').and.returnValue(of());
      const spyApplyFormUpdatesOnLoad = spyOn(component, <any>'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(spyApplyFormUpdatesOnLoad).toHaveBeenCalled();
    });

    it('getObjectValue: should call comboOptionSubject.asObservable', () => {
      const spyComboOptionSubjectObservable = spyOn(component['comboOptionSubject'], 'asObservable');

      component.getObjectValue();

      expect(spyComboOptionSubjectObservable).toHaveBeenCalled();
    });

    it('getObjectValue: should return  an instanceof Observable', () => {
      const result = component.getObjectValue();

      expect(result instanceof Observable).toBeTruthy();
    });

    it('sendObjectValue: should call comboOptionSubject.next with value', () => {
      const value = 'test';

      const spyComboOptionSubjectNext = spyOn(component['comboOptionSubject'], 'next');

      component.sendObjectValue('test');

      expect(spyComboOptionSubjectNext).toHaveBeenCalledWith(value);
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
