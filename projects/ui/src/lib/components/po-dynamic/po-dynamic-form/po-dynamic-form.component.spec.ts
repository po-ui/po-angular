import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { Observable, of, throwError } from 'rxjs';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormComponent } from './po-dynamic-form.component';
import { PoDynamicModule } from '../po-dynamic.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PoDynamicFormComponent:', () => {
  let component: PoDynamicFormComponent;
  let fixture: ComponentFixture<PoDynamicFormComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDynamicModule],
      providers: [NgForm, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

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
      vi.spyOn(component as any, 'emitForm');

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

      vi.spyOn(fakeThis.formOutput as any, 'emit');

      component['emitForm'].call(fakeThis);

      expect(fakeThis.formOutput.emit).toHaveBeenCalled();
    });

    it('emitForm: shouldn`t call `formOutput.emit` if `formOutput.observers.length` is falsy', () => {
      const fakeThis = { formOutput: { observers: [], emit: () => {} } };

      vi.spyOn(fakeThis.formOutput as any, 'emit');

      component['emitForm'].call(fakeThis);

      expect(fakeThis.formOutput.emit).not.toHaveBeenCalled();
    });

    it('focus: should call `fieldsComponent.focus`.', () => {
      const spyFieldsComponentFocus = vi.spyOn(component.fieldsComponent as any, 'focus');

      component.focus('field');

      expect(spyFieldsComponentFocus).toHaveBeenCalled();
    });

    it('showAdditionalHelp: should call `fieldsComponent.showAdditionalHelp` with the given property', () => {
      const property = 'name';
      vi.spyOn(component.fieldsComponent as any, 'showAdditionalHelp');

      component.showAdditionalHelp(property);

      expect(component.fieldsComponent.showAdditionalHelp).toHaveBeenCalledWith(property);
    });

    it('validateForm: should call sendFormChange with validate, field and value', () => {
      const updatedField = { property: 'test', disabled: true };
      component.validate = 'http://fakeUrlPo.com';
      component.value = { test: 'new value' };

      component.fields = [{ property: 'test' }];

      vi.spyOn(component as any, 'disableForm');
      vi.spyOn(component['validationService'] as any, 'sendFormChange').mockReturnValue(of());

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

      vi.spyOn(component as any, 'disableForm');

      vi.spyOn(component['validationService'] as any, 'sendFormChange').mockReturnValue(throwError('error'));

      vi.spyOn(component as any, 'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('validateForm: should call disabledForm with true on subcribe of observable', () => {
      const updatedField = { property: 'test', disabled: true };
      const updatedFormField = { fields: [{ property: 'test', disabled: true }] };

      component.fields = [{ property: 'test' }];

      vi.spyOn(component as any, 'disableForm');

      vi.spyOn(component['validationService'] as any, 'sendFormChange').mockReturnValue(of(updatedFormField));

      vi.spyOn(component as any, 'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['disableForm']).toHaveBeenCalledWith(true);
    });

    it('validateForm: should call applyFormValidation', () => {
      const updatedField = { property: 'test', disabled: true };

      component.fields = [{ property: 'test' }];

      vi.spyOn(component as any, 'disableForm');
      vi.spyOn(component['validationService'] as any, 'sendFormChange').mockReturnValue(of());
      vi.spyOn(component as any, 'applyFormValidation');

      component['validateForm'](updatedField);

      expect(component['applyFormValidation']).toHaveBeenCalled();
    });

    it('applyFormValidation: should call setFocusOnFieldByProperty with property and previousFocusElement', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelWithValidation');
      vi.spyOn(component as any, 'disableForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['setFocusOnFieldByProperty']).toHaveBeenCalledWith(validatedFields.focus, previousFocusElement);
    });

    it('applyFormValidation: should call disableForm with false', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelWithValidation');
      vi.spyOn(component as any, 'disableForm');

      component['applyFormValidation'](previousFocusElement)(validatedFields);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('applyFormValidation: should call updateModelWithValidation with validatedFields', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelWithValidation');
      vi.spyOn(component as any, 'disableForm');

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

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component['validationService'] as any, 'updateFieldsForm').mockReturnValue(expectedFields);
      vi.spyOn(component.fieldsComponent as any, 'updatePreviousValue').mockReturnValue(undefined);

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

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component['validationService'] as any, 'updateFieldsForm');

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
      vi.spyOn(component['changes'] as any, 'detectChanges');

      component['disableForm'](false);

      expect(component['changes'].detectChanges).toHaveBeenCalled();
    });

    it('setFocusOnFieldByProperty: should call focus if property is defined', fakeAsync(() => {
      const property = 'name';
      const previousFocusElement = document.activeElement;

      vi.spyOn(component as any, 'focus');

      component['setFocusOnFieldByProperty'](property, previousFocusElement);
      tick();

      expect(component.focus).toHaveBeenCalledWith(property);
    }));

    it('setFocusOnFieldByProperty: should call previousElement.focus if property is undefined', () => {
      const property = undefined;
      const previousFocusElement = document.activeElement;

      vi.spyOn(previousFocusElement as any, 'focus');

      component['setFocusOnFieldByProperty'](property, previousFocusElement);

      expect(previousFocusElement['focus']).toHaveBeenCalled();
    });

    it('ngOnInit: should call `loadDataOnInitialize` if `load` is truthy', () => {
      component.load = 'http://service/api';

      const spyLoadDataOnInitialize = vi.spyOn(component, <any>`loadDataOnInitialize`);

      component.ngOnInit();

      expect(spyLoadDataOnInitialize).toHaveBeenCalled();
    });

    it('ngOnInit: shouldn`t call `loadDataOnInitialize` if `load` is falsy', () => {
      component.load = undefined;

      const spyLoadDataOnInitialize = vi.spyOn(component, <any>`loadDataOnInitialize`);

      component.ngOnInit();

      expect(spyLoadDataOnInitialize).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should call `removeListeners`', () => {
      const spyRemoveListeners = vi.spyOn(component, <any>`removeListeners`);

      component.ngOnDestroy();

      expect(spyRemoveListeners).toHaveBeenCalled();
    });

    it(`removeListeners: should call 'onLoadSubscription.unsubscribe' and 'spySendFormSubscription.unsubscribe' if
      they are truthy`, () => {
      component['onLoadSubscription'] = <any>{ unsubscribe: () => {} };
      component['sendFormSubscription'] = <any>{ unsubscribe: () => {} };

      const spyOnLoadSubscription = vi.spyOn(component['onLoadSubscription'] as any, 'unsubscribe');
      const spySendFormSubscription = vi.spyOn(component['sendFormSubscription'] as any, 'unsubscribe');

      component['removeListeners']();

      expect(spyOnLoadSubscription).toHaveBeenCalled();
      expect(spySendFormSubscription).toHaveBeenCalled();
    });

    it(`removeListeners: shouldn't call 'onLoadSubscription.unsubscribe' and 'spySendFormSubscription.unsubscribe'
      if they are falsy`, () => {
      component['onLoadSubscription'] = <any>{ unsubscribe: () => {} };
      component['sendFormSubscription'] = <any>{ unsubscribe: () => {} };

      const spyOnLoadSubscription = vi.spyOn(component['onLoadSubscription'] as any, 'unsubscribe');
      const spySendFormSubscription = vi.spyOn(component['sendFormSubscription'] as any, 'unsubscribe');

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

      const spyCreateAndUpdateFieldsForm = vi.spyOn(component['loadService'] as any, 'createAndUpdateFieldsForm');

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

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component['loadService'] as any, 'createAndUpdateFieldsForm');

      component['updateModelOnLoad'](loadedFormData);

      expect(component.value).toEqual(expectedValue);
    });

    it('applyFormUpdatesOnLoad: should call setFocusOnFieldByProperty with property and previousFocusElement', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelOnLoad');
      vi.spyOn(component as any, 'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(validatedFields);

      expect(component['setFocusOnFieldByProperty']).toHaveBeenCalledWith(validatedFields.focus, previousFocusElement);
    });

    it('applyFormUpdatesOnLoad: should call disableForm with false', () => {
      const previousFocusElement = document.activeElement;

      const validatedFields = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelOnLoad');
      vi.spyOn(component as any, 'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(validatedFields);

      expect(component['disableForm']).toHaveBeenCalledWith(false);
    });

    it('applyFormUpdatesOnLoad: should call updateModelOnLoad with loadedFormData', () => {
      const previousFocusElement = document.activeElement;

      const loadedFormData = { value: undefined, focus: 'test1' };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      vi.spyOn(component as any, 'setFocusOnFieldByProperty');
      vi.spyOn(component as any, 'updateModelOnLoad');
      vi.spyOn(component as any, 'disableForm');

      component['applyFormUpdatesOnLoad'](previousFocusElement)(loadedFormData);

      expect(component['updateModelOnLoad']).toHaveBeenCalledWith(loadedFormData);
    });

    it('loadDataOnInitialize: should call executeLoad with load and value', () => {
      component.load = 'http://fakeUrlPo.com';
      component.value = { test: 'new value' };

      vi.spyOn(component as any, 'disableForm');
      const spyExecuteLoad = vi.spyOn(component['loadService'] as any, 'executeLoad').mockReturnValue(of());

      component['loadDataOnInitialize']();

      expect(spyExecuteLoad).toHaveBeenCalledWith(component.load, component.value);
    });

    it('loadDataOnInitialize: should call disabledForm with false if observable returns an error', () => {
      component.fields = [{ property: 'test' }];
      component.disabledForm = true;

      vi.spyOn(component['loadService'] as any, 'executeLoad').mockReturnValue(throwError('error'));
      vi.spyOn(component as any, 'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(component.disabledForm).toBe(false);
    });

    it('loadDataOnInitialize: should call disabledForm with true on subcribe of observable', () => {
      const loadedFormData = { fields: [{ property: 'test', disabled: true }] };

      component.fields = [{ property: 'test' }];

      vi.spyOn(component['loadService'] as any, 'executeLoad').mockReturnValue(of(loadedFormData));
      vi.spyOn(component as any, 'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(component.disabledForm).toBe(true);
    });

    it('loadDataOnInitialize: should call applyFormUpdatesOnLoad', () => {
      component.fields = [{ property: 'test' }];

      vi.spyOn(component['loadService'] as any, 'executeLoad').mockReturnValue(of());
      const spyApplyFormUpdatesOnLoad = vi.spyOn(component as any, 'applyFormUpdatesOnLoad');

      component['loadDataOnInitialize']();

      expect(spyApplyFormUpdatesOnLoad).toHaveBeenCalled();
    });

    it('getObjectValue: should call comboOptionSubject.asObservable', () => {
      const spyComboOptionSubjectObservable = vi.spyOn(component['comboOptionSubject'] as any, 'asObservable');

      component.getObjectValue();

      expect(spyComboOptionSubjectObservable).toHaveBeenCalled();
    });

    it('getObjectValue: should return  an instanceof Observable', () => {
      const result = component.getObjectValue();

      expect(result instanceof Observable).toBeTruthy();
    });

    it('sendObjectValue: should call comboOptionSubject.next with value', () => {
      const value = 'test';

      const spyComboOptionSubjectNext = vi.spyOn(component['comboOptionSubject'] as any, 'next');

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

    it('should render lookup fields with correct values when `getObjectByValue` returns an object or an array', fakeAsync(() => {
      const mockServiceObject = {
        getObjectByValue: () =>
          new Observable(observer => {
            observer.next({ id: 1, name: 'Tony Stark' });
            observer.complete();
          }),
        getFilteredItems: null
      };
      const mockServiceArray = {
        getObjectByValue: () =>
          new Observable(observer => {
            observer.next([{ id: 1, name: 'Tony Stark' }]);
            observer.complete();
          }),
        getFilteredItems: null
      };
      component.fields = [
        { property: 'heroeObject', searchService: mockServiceObject, fieldValue: 'id', fieldLabel: 'name' },
        { property: 'heroeArray', searchService: mockServiceArray, fieldValue: 'id', fieldLabel: 'name' }
      ];
      component.value = {
        heroeObject: 1,
        heroeArray: [1]
      };

      tick();
      fixture.detectChanges();

      (nativeElement.querySelectorAll('.po-lookup-input')[0] as HTMLElement).blur();
      (nativeElement.querySelectorAll('.po-lookup-input')[1] as HTMLElement).blur();

      tick();
      fixture.detectChanges();

      expect(nativeElement.querySelector('form')).toBeTruthy();
      expect(nativeElement.querySelector('po-dynamic-form-fields')).toBeTruthy();
      expect(nativeElement.querySelectorAll('.po-lookup-input')[0].value).toBe('Tony Stark');
      expect(nativeElement.querySelectorAll('.po-lookup-input')[1].value).toBe('Tony Stark');
    }));
  });
});
