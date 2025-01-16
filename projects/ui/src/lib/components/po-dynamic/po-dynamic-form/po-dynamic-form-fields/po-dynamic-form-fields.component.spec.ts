import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

import { of } from 'rxjs';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormFieldsComponent } from './po-dynamic-form-fields.component';
import { PoDynamicModule } from '../../po-dynamic.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

describe('PoDynamicFormFieldsComponent: ', () => {
  let component: PoDynamicFormFieldsComponent;
  let fixture: ComponentFixture<PoDynamicFormFieldsComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, PoDynamicModule, HttpClientTestingModule],
      providers: [{ provide: NgForm, useValue: new NgForm(null, null) }]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDynamicFormFieldsComponent);
    component = fixture.componentInstance;
    component['form'] = <any>{ dirty: true };

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoDynamicFormFieldsBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnChanges: should call `getVisibileFields` and set `visibileFields` if `changes.fields` is defined', () => {
      const fields = [{ property: 'name' }];
      component.visibleFields = [];

      spyOn(component, <any>'getVisibleFields').and.returnValue(fields);

      component.ngOnChanges(<any>{ fields });

      expect(component['getVisibleFields']).toHaveBeenCalled();
      expect(component.visibleFields).toEqual(fields);
    });

    it('ngOnChanges: shouldn`t call `getVisibileFields` if `changes.fields` is undefined', () => {
      component.visibleFields = [];

      spyOn(component, <any>'getVisibleFields');

      component.ngOnChanges({});

      expect(component['getVisibleFields']).not.toHaveBeenCalled();
      expect(component.visibleFields).toEqual([]);
    });

    it('ngOnChanges: should call `hasChangeContainer` if has container and `fields.previousValue`', () => {
      const fieldsChange: any = {
        fields: {
          previousValue: [{ property: 'test', visible: false }],
          currentValue: [{ property: 'test', visible: true }]
        }
      };

      const fields = [{ property: 'name' }];
      spyOn(component, <any>'hasContainer').and.returnValue(true);
      spyOn(component, <any>'getVisibleFields').and.returnValue(fields);

      spyOn(component, <any>'hasChangeContainer');

      component.ngOnChanges(fieldsChange);

      expect(component['hasChangeContainer']).toHaveBeenCalled();
    });

    it('trackBy: should return index', () => {
      const index = 1;
      expect(component.trackBy(index)).toBe(index);
    });

    it('focus: should call `fieldComponent.focus` if find field by property param.', () => {
      const fieldComponent = { focus: () => {}, name: 'newField' };
      component.components = <any>[fieldComponent];

      const spyOnFocus = spyOn(fieldComponent, 'focus');
      component.focus('newField');

      expect(spyOnFocus).toHaveBeenCalled();
    });

    it('focus: shouldn´t call `fieldsComponent.focus` if not find field by property param.', () => {
      const fieldComponent = { focus: () => {}, name: 'newField' };
      component.components = <any>[fieldComponent];

      const spyOnFocus = spyOn(fieldComponent, 'focus');
      component.focus('otherField');

      expect(spyOnFocus).not.toHaveBeenCalled();
    });

    describe('onChangeField', () => {
      const changedFieldIndex = 0;

      it('should call `getField` with `propertyOfVisibleFields` if field type boolean', () => {
        const fakeVisibleField = { property: 'test1', validate: 'teste', type: 'boolean' };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        const field = { changedField: fakeVisibleField, changedFieldIndex };
        component['form'] = <any>{ touched: false };

        spyOn(component, <any>'getField').and.returnValue(field);
        component.onChangeField(fakeVisibleField);

        expect(component['getField']).toHaveBeenCalledWith(fakeVisibleField.property);
      });

      it(`shouldn't call 'getField' with 'propertyOfVisibleFields' if field type not boolean and 'form.touched' is false`, () => {
        const fakeVisibleField = { property: 'test1', validate: 'teste' };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        const field = { changedField: fakeVisibleField, changedFieldIndex };
        component['form'] = <any>{ touched: false };

        spyOn(component, <any>'getField').and.returnValue(field);
        component.onChangeField(fakeVisibleField);

        expect(component['getField']).not.toHaveBeenCalledWith(fakeVisibleField.property);
      });

      it('should call `getField` with `propertyOfVisibleFields` if field value changed', () => {
        const fakeVisibleField = { property: 'test1', validate: 'teste' };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        const field = { changedField: fakeVisibleField, changedFieldIndex };

        spyOn(component, <any>'getField').and.returnValue(field);
        component.onChangeField(fakeVisibleField);

        expect(component['getField']).toHaveBeenCalledWith(fakeVisibleField.property);
      });

      it('should call `validateField` if `changedField.validate` has value and field value changed', async () => {
        const fakeVisibleField = { property: 'test1', validate: 'teste' };

        const field = { changedField: fakeVisibleField, changedFieldIndex };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        spyOn(component, <any>'getField').and.returnValue(field);
        spyOn(component, <any>'validateField');

        await component.onChangeField(fakeVisibleField);

        expect(component['validateField']).toHaveBeenCalledWith(fakeVisibleField, changedFieldIndex, fakeVisibleField);
      });

      it('should call `triggerValidationOnForm` if field value changed', async () => {
        const fakeVisibleField = { property: 'test1' };

        const field = { changedField: { property: 'test1' }, changedFieldIndex: 0 };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        spyOn(component, <any>'triggerValidationOnForm');
        spyOn(component, <any>'getField').and.returnValue(field);

        await component.onChangeField(fakeVisibleField);

        expect(component['triggerValidationOnForm']).toHaveBeenCalledWith(field.changedFieldIndex);
      });

      it('shouldn`t call `triggerValidationOnForm` and `getField` if field value not changed', async () => {
        const fakeVisibleField = { property: 'test1' };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'value';

        spyOn(component, <any>'triggerValidationOnForm');
        spyOn(component, <any>'getField');

        await component.onChangeField(fakeVisibleField);

        expect(component['triggerValidationOnForm']).not.toHaveBeenCalled();
        expect(component['getField']).not.toHaveBeenCalled();
      });

      it('should update all previous value with new value', async () => {
        const fakeVisibleField = { property: 'test1' };
        const previousValue = { test1: 'value1' };
        const newValue = { test1: 'new value1', test2: 'value2' };

        component['previousValue'] = previousValue;
        component['value'] = newValue;

        spyOn(component, <any>'triggerValidationOnForm');
        spyOn(component, <any>'getField').and.returnValue({ changedField: {} });
        spyOn(component, 'updatePreviousValue').and.callThrough();

        await component.onChangeField(fakeVisibleField);

        expect(component.updatePreviousValue).toHaveBeenCalled();
        expect(component['previousValue']).toEqual(newValue);
      });

      it('should emit `formValidate` if the changed field is included in `validateFields`', async () => {
        const fakeVisibleField = { property: 'test1' };
        const field = { changedField: { property: 'test1' }, changedFieldIndex: 0 };

        component.formValidate.observers.length = 1;
        component.validate = 'http://fakeUrlPo.com';
        component.fields = [{ property: 'test1', validate: 'teste' }];
        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';
        component.validateFields = ['test1'];

        spyOn(component, <any>'getField').and.returnValue(field);
        const spyEmit = spyOn(component.formValidate, 'emit');

        await component.onChangeField(fakeVisibleField);

        expect(spyEmit).toHaveBeenCalledWith(component.fields[0]);
      });

      it('should emit `formValidate` if `validateFields` isn`t defined', async () => {
        const fakeVisibleField = { property: 'test1' };
        const field = { changedField: { property: 'test1' }, changedFieldIndex: 0 };

        component.formValidate.observers.length = 1;
        component.validate = 'http://fakeUrlPo.com';
        component.fields = [{ property: 'test1', validate: 'teste' }];
        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        spyOn(component, <any>'getField').and.returnValue(field);
        const spyEmit = spyOn(component.formValidate, 'emit');

        await component.onChangeField(fakeVisibleField);

        expect(spyEmit).toHaveBeenCalledWith(component.fields[0]);
      });

      it('shouldn`t emit `formValidate` if the changed field isn`t included in `validateFields`', async () => {
        const fakeVisibleField = { property: 'test1' };
        const field = { changedField: { property: 'test1' }, changedFieldIndex: 0 };

        component.formValidate.observers.length = 1;
        component.validate = 'http://fakeUrlPo.com';
        component.fields = [{ property: 'test1', validate: 'teste' }];
        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';
        component.validateFields = ['test2', 'test3'];

        spyOn(component, <any>'getField').and.returnValue(field);
        const spyEmit = spyOn(component.formValidate, 'emit');

        await component.onChangeField(fakeVisibleField);

        expect(spyEmit).not.toHaveBeenCalled();
      });

      it('shouldn`t call `validateField` if `changedField.validate` doesn`t have value', async () => {
        const fakeVisibleField = { property: 'test1' };

        component.fields = [{ property: 'test1' }];

        const field = { changedField: fakeVisibleField, changedFieldIndex };

        component['previousValue']['test1'] = 'value';
        component['value']['test1'] = 'new value';

        spyOn(component, <any>'getField').and.returnValue(field);
        spyOn(component, <any>'validateField');

        await component.onChangeField(fakeVisibleField);

        expect(component['validateField']).not.toHaveBeenCalledWith(
          fakeVisibleField,
          changedFieldIndex,
          fakeVisibleField
        );
      });

      it('should emit `objectValue` if `visibleField` has `optionsService` property', async () => {
        const fakeVisibleField = { property: 'test1', optionsService: 'url.com' };
        const objectValue = { label: 'Vancouver', value: 12343 };

        const spyObjectValue = spyOn(component.objectValue, 'emit');

        await component.onChangeField(fakeVisibleField, objectValue);

        expect(spyObjectValue).toHaveBeenCalledWith(objectValue);
      });

      it('shouldn`t emit `objectValue` if `visibleField` doesn`t have the `optionsService` property', async () => {
        const fakeVisibleField = { property: 'test1' };
        const objectValue = { label: 'Vancouver', value: 12343 };

        const spyObjectValue = spyOn(component.objectValue, 'emit');

        await component.onChangeField(fakeVisibleField, objectValue);

        expect(spyObjectValue).not.toHaveBeenCalled();
      });

      it('shouldn`t call `triggerValidationOnForm` if form.touched is false', async () => {
        const fakeVisibleField = { property: 'test1' };

        component['previousValue']['test1'] = undefined;
        component['value']['test1'] = 'value';
        component['form'] = <any>{ touched: false };

        spyOn(component, <any>'triggerValidationOnForm');

        await component.onChangeField(fakeVisibleField);

        expect(component['triggerValidationOnForm']).not.toHaveBeenCalled();
      });
    });

    describe('onChangeFieldModel', () => {
      it('should call `triggerValidationOnForm` if validateOnInput is true', () => {
        const fakeVisibleField = { property: 'test1' };
        const field = { changedField: { property: 'test1' }, changedFieldIndex: 0 };

        component.validateOnInput = true;

        spyOn(component, <any>'getField').and.returnValue(field);
        spyOn(component, <any>'triggerValidationOnForm');

        component.onChangeFieldModel(fakeVisibleField);

        expect(component['triggerValidationOnForm']).toHaveBeenCalled();
      });

      it('shouldn`t call `triggerValidationOnForm` if validateOnInput is false', () => {
        const fakeVisibleField = { property: 'test1' };

        component.validateOnInput = false;

        spyOn(component, <any>'triggerValidationOnForm');

        component.onChangeFieldModel(fakeVisibleField);

        expect(component['triggerValidationOnForm']).not.toHaveBeenCalled();
      });
    });

    it('applyFieldValidation: should merge fields and validatedFields and apply new value to `fields` and `value``', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value' };
      const expectedField = { property: 'test2', required: false, visible: true, help: 'test help' };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' }
      ];

      component['applyFieldValidation'](index, validatedField);

      expect(component.fields[index]).toEqual(expectedField);
      expect(component.value[component.fields[index].property]).toEqual(validatedField.value);
    });

    it('applyFieldValidation: shouldn`t merge values if validatedFields not has value property', () => {
      const index = 0;
      const validatedField = { field: { property: 'test2', required: false, visible: true } };

      component.fields = [{ property: 'test1', required: true, visible: true }];

      const value = { test1: 'value' };
      component.value = value;

      component['applyFieldValidation'](index, validatedField);

      expect(component.value).toEqual(value);
    });

    it('applyFieldValidation: should call `detectChanges`', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value' };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' }
      ];

      const spyChanges = spyOn(component['changes'], 'detectChanges');

      component['applyFieldValidation'](index, validatedField);

      expect(spyChanges).toHaveBeenCalled();
    });

    it('applyFieldValidation: should call `focus` if `validatedFIeld` has `focus` property', () => {
      const index = 1;
      const validatedField = {
        field: { property: 'test2', required: false, visible: true },
        value: 'expected value',
        focus: true
      };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' }
      ];

      const spyFocus = spyOn(component, 'focus');

      component['applyFieldValidation'](index, validatedField);

      expect(spyFocus).toHaveBeenCalled();
    });

    it('applyFieldValidation: shouldn`t call `focus` if `validatedFIeld` not has `focus` property', () => {
      const index = 1;
      const validatedField = {
        field: { property: 'test2', required: false, visible: true },
        value: 'expected value',
        focus: false
      };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' }
      ];

      const spyFocus = spyOn(component, 'focus');

      component['applyFieldValidation'](index, validatedField);

      expect(spyFocus).not.toHaveBeenCalled();
    });

    it('applyFieldValidation: should call updateFields', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true } };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' }
      ];

      const spyUpdateFields = spyOn(component, <any>'updateFields');

      component['applyFieldValidation'](index, validatedField);

      expect(spyUpdateFields).toHaveBeenCalled();
    });

    it('getField: should return `changedField` and `changedFieldIndex`', () => {
      const fakeProperty = 'test1';
      const changedFieldIndex = 0;
      const fakeVisibleField = { property: 'test1', validate: 'teste' };
      const expectedReturn = { changedField: fakeVisibleField, changedFieldIndex };

      component.fields = [{ property: 'test1', validate: 'teste' }];

      const spyGetFields = component['getField'](fakeProperty);

      expect(spyGetFields).toEqual(expectedReturn);
    });

    it(`triggerValidationOnForm: should emit 'formValidate' if 'validate' has value and 'formValidate.observers'
      has length`, () => {
      component.formValidate.observers.length = 1;
      component.validate = 'http://fakeUrlPo.com';
      component.fields = [{ property: 'test1', validate: 'teste' }];

      const spyEmit = spyOn(component.formValidate, 'emit');
      const fieldIndex = 0;

      component['triggerValidationOnForm'](fieldIndex);

      expect(spyEmit).toHaveBeenCalledWith(component.fields[0]);
    });

    it('triggerValidationOnForm: shouldn`t emit `formValidate` if `validate` has value but `formValidate.observers` length is 0', () => {
      component.formValidate.observers.length = 0;
      component.fields = [{ property: 'test1', validate: 'teste' }];

      const spyEmit = spyOn(component.formValidate, 'emit');
      const fieldIndex = 0;

      component['triggerValidationOnForm'](fieldIndex);

      expect(spyEmit).not.toHaveBeenCalled();
    });

    it('updateFields: should emit fields', () => {
      const fields = [{ property: 'test1', validate: 'teste' }];
      component.fields = fields;

      spyOn(component.fieldsChange, 'emit');
      spyOn(component, <any>'getVisibleFields');

      component['updateFields']();

      expect(component.fieldsChange.emit).toHaveBeenCalledWith(fields);
    });

    it('updateFields: should call getVisibleFields to set visibleFields', () => {
      component.visibleFields = [];
      const visibleFields = [{ property: 'Teste 1' }];

      spyOn(component, <any>'getVisibleFields').and.returnValue(visibleFields);

      component.fields = [{ property: 'Teste 1' }, { property: 'Teste 2', visible: false }];

      component['updateFields']();

      expect(component.visibleFields).toEqual(visibleFields);
    });

    it(`validateField: should set 'disabled' with true to 'visibleField'
    and call 'detectChanges', 'validationService.sendFieldChange' and 'applyFieldValidation'`, async () => {
      const field = { property: 'name', required: true, visible: true, disabled: false };
      const index = 0;
      const fakeVisibleField = { property: 'test1', validate: 'teste' };

      component.value = [{ name: 'user 1' }, { age: 'user 2' }, { rg: 'user 3' }];

      const spySendFieldChange = spyOn(component['validationService'], 'sendFieldChange').and.returnValue(of(field));
      const spyChanges = spyOn(component['changes'], 'detectChanges');
      const spyApplyFieldValidation = spyOn(component, <any>'applyFieldValidation');

      await component['validateField'](field, index, fakeVisibleField);

      expect(spySendFieldChange).toHaveBeenCalledWith(field, component.value[field.property]);
      expect(spyChanges).toHaveBeenCalled();
      expect(spyApplyFieldValidation).toHaveBeenCalledWith(index, field);
    });

    it(`validateField: should not call 'applyFieldValidation'`, async () => {
      const field = { property: 'name', required: true, visible: true, disabled: false };
      const index = 0;
      const fakeVisibleField = { property: 'test1', validate: 'teste' };

      component.value = [{ name: 'user 1' }, { age: 'user 2' }, { rg: 'user 3' }];

      const spySendFieldChange = spyOn(component['validationService'], 'sendFieldChange').and.throwError('Error');
      const spyApplyFieldValidation = spyOn(component, <any>'applyFieldValidation');

      await component['validateField'](field, index, fakeVisibleField);

      expect(spySendFieldChange).toHaveBeenCalledWith(field, component.value[field.property]);
      expect(spyApplyFieldValidation).not.toHaveBeenCalled();
    });

    it('hasChangeContainer: should call `setContainerFields` if there is a change in the container size', () => {
      const fieldPrevious: Array<PoDynamicFormField> = [
        {
          property: 'campo 1',
          container: 'container 1'
        },
        {
          property: 'campo 2'
        },
        {
          property: 'campo 3'
        }
      ];

      const fieldCurrent: Array<PoDynamicFormField> = [
        {
          property: 'campo 1',
          container: 'container 1'
        },
        {
          property: 'campo 2',
          container: 'container 2'
        },
        {
          property: 'campo 3'
        }
      ];

      component.visibleFields = fieldCurrent;

      spyOn(component, <any>'setContainerFields');

      component['hasChangeContainer'](fieldPrevious, fieldCurrent);

      expect(component['setContainerFields']).toHaveBeenCalled();
    });

    it('hasChangeContainer: should not call `setContainerFields` if container changed it value', () => {
      const fieldPrevious: Array<PoDynamicFormField> = [
        {
          property: 'campo 1',
          container: 'container 1'
        },
        {
          property: 'campo 2'
        },
        {
          property: 'campo 3'
        }
      ];

      const fieldCurrent: Array<PoDynamicFormField> = [
        {
          property: 'campo 1',
          container: 'container 11'
        },
        {
          property: 'campo 2'
        },
        {
          property: 'campo 3'
        }
      ];

      component.fields = fieldCurrent;

      spyOn(component, <any>'setContainerFields');

      component['hasChangeContainer'](fieldPrevious, fieldCurrent);

      expect(component['setContainerFields']).not.toHaveBeenCalled();
    });

    it('hasChangeContainer: should not call `setContainerFields` if container changed its value', () => {
      const previous: Array<PoDynamicFormField> = [
        { property: 'property1', container: 'container1' },
        { property: 'property2', container: 'container2' }
      ];

      const current: Array<PoDynamicFormField> = [
        { property: 'property1', container: 'container1-modificado', clean: true }, // mudança de container
        { property: 'property2', container: 'container2' }
      ];
      spyOn(component, <any>'diffObjectsArray').and.returnValue(current);
      spyOn(component, <any>'updateFieldContainer').and.returnValue([current]);
      component.fields = current;
      component.containerFields = [previous];

      component['hasChangeContainer'](previous, current);

      expect(component.containerFields[0][0].container).toBe('container1-modificado');
    });

    it('hasChangeContainer: should call `setContainerFields` if order was added', () => {
      const previous: Array<PoDynamicFormField> = [{ property: 'property1' }, { property: 'property2' }];

      const current: Array<PoDynamicFormField> = [{ property: 'property1', order: 1 }, { property: 'property2' }];
      spyOn(component, <any>'diffObjectsArray').and.returnValue(current);
      spyOn(component, <any>'updateFieldContainer').and.returnValue([current]);

      spyOn(component, <any>'setContainerFields');
      component['hasChangeContainer'](previous, current);

      component.fields = current;
      component.containerFields = [previous];

      expect(component.setContainerFields).toHaveBeenCalled();
    });

    it('hasChangeContainer: should call `setContainerFields` if there is a change in hidden fields', () => {
      const fieldPrevious: Array<PoDynamicFormField> = [
        { property: 'campo 1', visible: false },
        { property: 'campo 2' }
      ];
      const fieldCurrent: Array<PoDynamicFormField> = [{ property: 'campo 1', visible: true }, { property: 'campo 2' }];

      component.visibleFields = fieldCurrent;

      spyOn(component, <any>'setContainerFields');

      component['hasChangeContainer'](fieldPrevious, fieldCurrent);

      expect(component['setContainerFields']).toHaveBeenCalled();
    });

    it('hasChangeContainer: if there is a change in the visible fields', () => {
      const fieldPrevious: Array<PoDynamicFormField> = [{ property: 'campo 1' }, { property: 'campo 2' }];
      const fieldCurrent: Array<PoDynamicFormField> = [
        { property: 'campo 1' },
        { property: 'campo 2' },
        { property: 'campo 3', visible: false }
      ];

      component.visibleFields = fieldCurrent.filter(x => x.visible === false);

      spyOn(component, <any>'setContainerFields');

      component['hasChangeContainer'](fieldPrevious, fieldCurrent);

      expect(component['setContainerFields']).toHaveBeenCalled();
    });

    it('hasChangeContainer: should call "handleChange Container" if there is a change of fields to visible', () => {
      const fieldPrevious: Array<PoDynamicFormField> = [
        { property: 'campo 1', visible: true },
        { property: 'campo 2', visible: false }
      ];
      const fieldCurrent: Array<PoDynamicFormField> = [
        { property: 'campo 1', visible: false },
        { property: 'campo 2', visible: true }
      ];

      spyOn(component, <any>'getVisibleFields').and.returnValue(fieldCurrent.filter(x => x.visible === true));
      spyOn(component, <any>'handleChangesContainer');

      component['hasChangeContainer'](fieldPrevious, fieldCurrent);

      expect(component['handleChangesContainer']).toHaveBeenCalled();
    });

    it('handleChangesContainer: should not call `setContainerFields` if order had its value changed', () => {
      const previous: Array<PoDynamicFormField> = [{ property: 'property1', order: 1 }, { property: 'property2' }];

      const current: Array<PoDynamicFormField> = [{ property: 'property1', order: 2 }, { property: 'property2' }];

      spyOn(component, <any>'setContainerFields');
      component['handleChangesContainer'](previous, current, 'order');

      expect(component.setContainerFields).toHaveBeenCalled();
    });

    it('handleChangesContainer: should not call `setContainerFields` if order and property have changed', () => {
      const previous = [{ property: 'property1', order: 1, index: 0 }, { property: 'property2' }];

      const current = [{ property: 'property3', order: 2, index: 1 }, { property: 'property2' }];

      spyOn(component, <any>'setContainerFields');
      component['handleChangesContainer'](previous, current, 'order');

      expect(component.setContainerFields).toHaveBeenCalled();
    });

    it('hasChangeContainer: should not call `setContainerFields` if order was changed to other object', () => {
      const previous: Array<PoDynamicFormField> = [{ property: 'property1', order: 1 }, { property: 'property2' }];

      const current: Array<PoDynamicFormField> = [{ property: 'property1' }, { property: 'property2', order: 1 }];
      spyOn(component, <any>'diffObjectsArray').and.returnValue(current);
      spyOn(component, <any>'getVisibleFields').and.returnValue(current);
      spyOn(component, <any>'updateFieldContainer').and.returnValue([current]);

      spyOn(component, <any>'setContainerFields');
      component['hasChangeContainer'](previous, current);

      component.fields = current;
      component.containerFields = [previous];

      expect(component.setContainerFields).toHaveBeenCalled();
    });

    it('updateFieldContainer: should update array the with the new values', () => {
      const changes = [
        { property: 'property1', container: 'updatedContainer1' },
        { property: 'property3', container: 'updatedContainer3' }
      ];

      const containerFields = [
        [{ property: 'property1', container: 'container1' }],
        [{ property: 'property2', container: 'container2' }],
        [{ property: 'property3', container: 'container3' }]
      ];

      const updatedFields = component['updateFieldContainer'](changes, containerFields);

      expect(updatedFields[0][0].container).toBe('updatedContainer1');
      expect(updatedFields[1][0].container).toBe('container2');
      expect(updatedFields[2][0].container).toBe('updatedContainer3');
    });

    it('diffObjectsArray: should return the complete object if it is new in the array', () => {
      const oldArray = [{ property: 'property1', container: 'container1' }];
      const newArray = [
        { property: 'property1', container: 'container1' },
        { property: 'property2', container: 'container2' }
      ];

      const result = component['diffObjectsArray'](oldArray, newArray);

      expect(result).toEqual([{ property: 'property2', container: 'container2' }]);
    });

    it('diffObjectsArray: should only return changed properties for existing objects', () => {
      const oldArray = [{ property: 'property1', container: 'container1' }];
      const newArray = [{ property: 'property1', container: 'newContainer1' }];

      const result = component['diffObjectsArray'](oldArray, newArray);

      expect(result).toEqual([{ property: 'property1', container: 'newContainer1' }]);
    });

    it('hasContainer: should return true if has container', () => {
      component.visibleFields = [{ property: 'test 1', container: 'container 1' }, { property: 'test 2' }];

      expect(component['hasContainer']()).toBeTruthy();
    });

    it('hasContainer: should return false if has not container', () => {
      component.visibleFields = [{ property: 'test 1' }, { property: 'test 2' }];

      expect(component['hasContainer']()).toBeFalsy();
    });
  });

  describe('Templates: ', () => {
    it('should create a `div` with `po-row` class if visibleFields.length greater than 0', () => {
      component.fields = [{ property: 'name' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-row')).toBeTruthy();
    });

    it('shouldn`t create a `div` with `po-row` class if `visibleFields.length` is 0', () => {
      component.fields = [{ property: 'name', visible: false }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-row')).toBeFalsy();
    });

    it('shouldn`t create a `div` with `po-row` class if `fields` is undefined', () => {
      component.fields = undefined;

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-row')).toBeFalsy();
    });

    it('should create a `po-input` component if type is `undefined`', () => {
      component.fields = [{ property: 'name' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-input')).toBeTruthy();
    });

    it('should create a `po-number` component if type is `number`', () => {
      component.fields = [{ property: 'age', type: 'number' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-number')).toBeTruthy();
    });

    it('should create a `po-datepicker` component if type is `date`', () => {
      component.fields = [{ property: 'age', type: 'date' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-datepicker')).toBeTruthy();
    });

    it('should create a `po-datepicker` component if type is `datetime`', () => {
      component.fields = [{ property: 'age', type: 'datetime' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-datepicker')).toBeTruthy();
    });

    it('should create a `po-input` component if type is `time`', () => {
      component.fields = [{ property: 'age', type: 'time' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-input')).toBeTruthy();
    });

    it('should create a `po-decimal` component if type is `currency`', () => {
      component.fields = [{ property: 'age', type: 'currency' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-decimal')).toBeTruthy();
    });

    it('should create a `po-combo` component if have a `optionsService`', () => {
      component.fields = [
        { property: 'hero', label: 'Herois', optionsService: 'https://po-ui.io/sample/api/comboOption/heroes' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-combo')).toBeTruthy();
    });

    it('should create a `po-select` component if have more than 3 options', () => {
      component.fields = [
        {
          property: 'state',
          label: 'Estados',
          options: [
            { label: 'Santa Catarina', value: 1 },
            { label: 'São Paulo', value: 2 },
            { label: 'Rio de Janeiro', value: 3 },
            { label: 'Minas Gerais', value: 4 }
          ]
        }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-select')).toBeTruthy();
    });

    it('should create a `po-radio-group` component if have less than 4 options', () => {
      component.fields = [
        {
          property: 'state',
          label: 'Estados',
          options: [
            { label: 'Santa Catarina', value: 1 },
            { label: 'São Paulo', value: 2 }
          ]
        }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-radio-group')).toBeTruthy();
    });

    it('should create a `po-switch` component if type is `boolean`', () => {
      component.fields = [{ property: 'hired', type: 'boolean', divider: 'Info' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-divider')).toBeTruthy();
      expect(nativeElement.querySelector('po-switch')).toBeTruthy();
    });

    it('should create a `po-textarea` component if rows is 3', () => {
      component.fields = [{ property: 'hired', rows: 3 }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeTruthy();
    });

    it('should create a `po-textarea` component if rows is greater than 3', () => {
      component.fields = [{ property: 'hired', rows: 8 }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeTruthy();
    });

    it('shouldn`t create a `po-textarea` component if rows is less than 3', () => {
      component.fields = [{ property: 'hired', rows: 2 }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeNull();
    });

    it('should create a `po-password` component if `secret`', () => {
      component.fields = [{ property: 'pass', secret: true }];

      component.ngOnChanges({ fields: new SimpleChange(null, component.fields, true) });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-password')).toBeTruthy();
    });

    it('shouldn`t create a `po-password` component if `secret` is false', () => {
      component.fields = [{ property: 'pass', rows: 2 }];

      component.ngOnChanges({ fields: new SimpleChange(null, component.fields, true) });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-password')).toBeNull();
    });

    it('should create all components in form', () => {
      component.fields = [
        { property: 'name', divider: 'Personal data' },
        { property: 'cpf', label: 'CPF' },
        { property: 'birthday', label: 'Aniversario', type: 'date' },
        { property: 'description', label: 'Description', rows: 5 },
        { property: 'address_number', type: 'number' },
        { property: 'wage', label: 'Salario', type: 'currency', divider: 'Outros dados' },
        { property: 'hired', type: 'boolean' },
        { property: 'hour', label: 'Horario', type: 'time' },
        {
          property: 'city',
          label: 'Cidade',
          options: [
            { label: 'Joinville', value: 1 },
            { label: 'Curitiba', value: 2 },
            { label: 'São Paulo', value: 3 }
          ]
        },
        {
          property: 'state',
          label: 'Estados',
          options: [
            { label: 'Santa Catarina', value: 1 },
            { label: 'São Paulo', value: 2 },
            { label: 'Rio de Janeiro', value: 3 },
            { label: 'Minas Gerais', value: 4 }
          ]
        },
        { property: 'hero', label: 'Herois', optionsService: 'https://po-ui.io/sample/api/comboOption/heroes' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('po-divider').length).toBe(2);
      expect(nativeElement.querySelectorAll('po-switch').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-decimal').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-input').length).toBe(3);
      expect(nativeElement.querySelectorAll('po-datepicker').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-number').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-combo').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-select').length).toBe(1);
      expect(nativeElement.querySelectorAll('po-textarea').length).toBe(1);
    });
  });

  describe('Integration:', () => {
    describe('onChangeField:', () => {
      beforeEach(() => {
        component.fields = [{ property: 'name' }];
        component.value['name'] = 'name';

        component.ngOnChanges({
          fields: new SimpleChange(null, component.fields, true)
        });

        fixture.detectChanges();
      });

      it('should update field of visibleFields with disabled true', async () => {
        const validate = () => ({
          field: { disabled: true }
        });

        component.fields[0].validate = validate;
        spyOn(component['validationService'], 'sendFieldChange').and.returnValue(of(validate()));

        await component.onChangeField(component.visibleFields[0]);

        expect(component.visibleFields[0].disabled).toBe(true);
      });

      it('should update field of visibleFields with help', async () => {
        const validate = () => ({
          field: { help: 'new help' }
        });

        component.fields[0].validate = validate;

        spyOn(component['validationService'], 'sendFieldChange').and.returnValue(of(validate()));

        await component.onChangeField(component.visibleFields[0]);

        expect(component.visibleFields[0].help).toBe('new help');
      });

      it('should update field value', async () => {
        const expectedValue = 'new value';

        const validate = () => ({
          value: expectedValue,
          field: { help: 'new help' }
        });

        component.fields[0].validate = validate;

        spyOn(component['validationService'], 'sendFieldChange').and.returnValue(of(validate()));
        await component.onChangeField(component.visibleFields[0]);

        expect(component.value.name).toBe(expectedValue);
      });
    });
  });
});
