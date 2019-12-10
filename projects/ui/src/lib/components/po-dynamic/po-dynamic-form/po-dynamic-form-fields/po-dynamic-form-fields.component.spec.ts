import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormFieldsComponent } from './po-dynamic-form-fields.component';
import { PoDynamicModule } from '../../po-dynamic.module';

fdescribe('PoDynamicFormFieldsComponent: ', () => {
  let component: PoDynamicFormFieldsComponent;
  let fixture: ComponentFixture<PoDynamicFormFieldsComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PoDynamicModule ],
      providers: [
        { provide: NgForm, useValue: new NgForm(null, null) }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDynamicFormFieldsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoDynamicFormFieldsBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {

    it('ngOnChanges: should call `getVisibileFields` and set `visibileFields` if `changes.fields` is defined', () => {
      const fields = [{property: 'name'}];
      component.visibleFields = [];

      spyOn(component, <any> 'getVisibleFields').and.returnValue(fields);

      component.ngOnChanges(<any>{ fields });

      expect(component['getVisibleFields']).toHaveBeenCalled();
      expect(component.visibleFields).toEqual(fields);
    });

    it('ngOnChanges: shouldn`t call `getVisibileFields` if `changes.fields` is undefined', () => {
      component.visibleFields = [];

      spyOn(component, <any> 'getVisibleFields');

      component.ngOnChanges({});

      expect(component['getVisibleFields']).not.toHaveBeenCalled();
      expect(component.visibleFields).toEqual([]);
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
      const index = 0;

      it('should call `onChangeField` if `field.validate` has value', () => {
        const field = { property: 'test1', required: true, visible: true, validate: 'http://po.portinari.com.br/api' };

        const spyValidateField = spyOn(component, <any>'validateField');

        component.onChangeField(field, 0);

        expect(spyValidateField).toHaveBeenCalledWith(field, index);
      });

      it('shouldn`t call `onChangeField` if `field.validate` doesn`t have value', () => {
        const field = { property: 'test1', required: true, visible: true };

        const spyValidateField = spyOn(component, <any>'validateField');

        component.onChangeField(field, index);

        expect(spyValidateField).not.toHaveBeenCalled();
      });

      it('should emit `formValidate` if `validate` has value and `formValidate.observers` has length', () => {
        const field = { property: 'test1', required: true, visible: true };
        component.formValidate.observers.length = 1;
        component.validate = 'http://po.portinari.com.br/api';

        const spyEmit = spyOn(component.formValidate, 'emit');

        component.onChangeField(field, index);

        expect(spyEmit).toHaveBeenCalledWith({ field, index });
      });

      it('shouldn`t emit `formValidate` if `validate` has value but `formValidate.observers` length is 0', () => {
        const field = { property: 'test1', required: true, visible: true };
        component.formValidate.observers.length = 0;
        component.validate = 'http://po.portinari.com.br/api';

        const spyEmit = spyOn(component.formValidate, 'emit');

        component.onChangeField(field, index);

        expect(spyEmit).not.toHaveBeenCalled();
      });
    });

    it('applyFieldValidation: should merge fields and validatedFields and apply new value to `fields` and `value``', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value' };
      const expectedField = { property: 'test2', required: false, visible: true, help: 'test help' };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' },
      ];

      component['applyFieldValidation'](index, validatedField);

      expect(component.fields[index]).toEqual(expectedField);
      expect(component.value[component.fields[index].property]).toEqual(validatedField.value);
    });

    it('applyFieldValidation: should call `detectChanges`', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value' };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' },
      ];

      const spyChanges = spyOn(component['changes'], 'detectChanges');

      component['applyFieldValidation'](index, validatedField);

      expect(spyChanges).toHaveBeenCalled();
    });

    it('applyFieldValidation: should call `focus` if `validatedFIeld` has `focus` property', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value', focus: true };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' },
      ];

      const spyFocus = spyOn(component, 'focus');

      component['applyFieldValidation'](index, validatedField);

      expect(spyFocus).toHaveBeenCalled();
    });

    it('applyFieldValidation: should call `focus` if `validatedFIeld` has `focus` property', () => {
      const index = 1;
      const validatedField = { field: { property: 'test2', required: false, visible: true }, value: 'expected value', focus: false };

      component.fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: true, visible: false, help: 'test help' },
      ];

      const spyFocus = spyOn(component, 'focus');

      component['applyFieldValidation'](index, validatedField);

      expect(spyFocus).not.toHaveBeenCalled();
    });

  });

  describe('Templates: ', () => {

    it('should create a `div` with `po-row` class if visibleFields.length greater than 0', () => {
      component.fields = [
        { property: 'name' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-row')).toBeTruthy();
    });

    it('shouldn`t create a `div` with `po-row` class if `visibleFields.length` is 0', () => {
      component.fields = [
        { property: 'name', visible: false }
      ];

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
      component.fields = [
        { property: 'name' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-input')).toBeTruthy();
    });

    it('should create a `po-number` component if type is `number`', () => {
      component.fields = [
        { property: 'age', type: 'number' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-number')).toBeTruthy();
    });

    it('should create a `po-datepicker` component if type is `date`', () => {
      component.fields = [
        { property: 'age', type: 'date' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-datepicker')).toBeTruthy();
    });

    it('should create a `po-datepicker` component if type is `datetime`', () => {
      component.fields = [
        { property: 'age', type: 'datetime' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-datepicker')).toBeTruthy();
    });

    it('should create a `po-input` component if type is `time`', () => {
      component.fields = [
        { property: 'age', type: 'time' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-input')).toBeTruthy();
    });

    it('should create a `po-decimal` component if type is `currency`', () => {
      component.fields = [
        { property: 'age', type: 'currency' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-decimal')).toBeTruthy();
    });

    it('should create a `po-combo` component if have a `optionsService`', () => {
      component.fields = [
        { property: 'hero', label: 'Herois', optionsService: 'https://portinari.io/sample/api/comboOption/heroes'}
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-combo')).toBeTruthy();
    });

    it('should create a `po-select` component if have more than 3 options', () => {
      component.fields = [
        { property: 'state', label: 'Estados', options: [
          { label: 'Santa Catarina', value: 1 },
          { label: 'São Paulo', value: 2 },
          { label: 'Rio de Janeiro', value: 3 },
          { label: 'Minas Gerais', value: 4 }
        ]}
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-select')).toBeTruthy();
    });

    it('should create a `po-radio-group` component if have less than 4 options', () => {
      component.fields = [
        { property: 'state', label: 'Estados', options: [
          { label: 'Santa Catarina', value: 1 },
          { label: 'São Paulo', value: 2 }
        ]}
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-radio-group')).toBeTruthy();
    });

    it('should create a `po-switch` component if type is `boolean`', () => {
      component.fields = [
        { property: 'hired', type: 'boolean', divider: 'Info' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-divider')).toBeTruthy();
      expect(nativeElement.querySelector('po-switch')).toBeTruthy();
    });

    it('should create a `po-textarea` component if rows is 3', () => {
      component.fields = [
        { property: 'hired', rows: 3 }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeTruthy();
    });

    it('should create a `po-textarea` component if rows is greater than 3', () => {
      component.fields = [
        { property: 'hired', rows: 8 }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeTruthy();
    });

    it('shouldn`t create a `po-textarea` component if rows is less than 3', () => {
      component.fields = [
        { property: 'hired', rows: 2 }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-textarea')).toBeNull();
    });

    it('should create a `po-password` component if `secret`', () => {
      component.fields = [{ property: 'pass', secret: true }];

      component.ngOnChanges({fields: new SimpleChange(null, component.fields, true)});

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-password')).toBeTruthy();
    });

    it('shouldn`t create a `po-password` component if `secret` is false', () => {
      component.fields = [{ property: 'pass', rows: 2 }];

      component.ngOnChanges({fields: new SimpleChange(null, component.fields, true)});

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
        { property: 'city', label: 'Cidade', options: [
          { label: 'Joinville', value: 1 }, { label: 'Curitiba', value: 2 }, { label: 'São Paulo', value: 3 }
        ] },
        { property: 'state', label: 'Estados', options: [
          { label: 'Santa Catarina', value: 1 },
          { label: 'São Paulo', value: 2 },
          { label: 'Rio de Janeiro', value: 3 },
          { label: 'Minas Gerais', value: 4 }
        ]},
        { property: 'hero', label: 'Herois', optionsService: 'https://portinari.io/sample/api/comboOption/heroes'}
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

});
