import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SimpleChange } from '@angular/core';

import { of } from 'rxjs';

import { PoDynamicModule } from '../po-dynamic.module';
import { PoDynamicViewComponent } from './po-dynamic-view.component';
import { PoDynamicViewService } from './services/po-dynamic-view.service';

describe('PoDynamicViewComponent:', () => {
  let component: PoDynamicViewComponent;
  let fixture: ComponentFixture<PoDynamicViewComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDynamicModule],
      providers: [HttpClient, HttpHandler, PoDynamicViewService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDynamicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('ngOnChanges:', () => {
      const returnedValue = [{ property: 'name' }];

      it('shouldn`t call `getVisibleFields` if `changes` is an empty object', () => {
        const changes = {};
        component.visibleFields = [];

        spyOn(component, <any>'getVisibleFields');

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).not.toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(0);
      });

      it('should call `getVisibleFields` if `changes.fields` is true', () => {
        const changes = { fields: <any>{} };
        component.visibleFields = [];

        spyOn(component, <any>'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

      it('should call `getVisibleFields` if `changes.value` is true', () => {
        const changes = { value: <any>{} };
        component.visibleFields = [];

        spyOn(component, <any>'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

      it('should call `getVisibleFields` if `changes.showAllValue` is true', () => {
        const changes = { showAllValue: <any>{} };
        component.visibleFields = [];

        spyOn(component, <any>'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

      it(`should call not 'getVisibleFields' if 'load' is true and initChanges is false`, () => {
        const changes = { showAllValue: <any>{} };
        component.load = 'url.test.com';
        component.visibleFields = [];

        spyOn(component, <any>'getVisibleFields');

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).not.toHaveBeenCalled();
      });
    });

    it('ngOnInit: should call `updateValuesAndFieldsOnLoad` if typeof `load` is truthy', fakeAsync(() => {
      component.load = 'teste';

      spyOn(component, <any>'updateValuesAndFieldsOnLoad').and.returnValue(Promise.resolve());

      component.ngOnInit();

      tick();

      expect(component['updateValuesAndFieldsOnLoad']).toHaveBeenCalled();
    }));

    it(`getValuesAndFieldsFromLoad: should call 'dynamicViewService.onLoad' if 'component.load' is string`, async () => {
      const expectedValue = { value: { name: 'teste 2' }, fields: [{ property: 'name', tag: true }] };

      component.load = 'teste';

      spyOn(component['dynamicViewService'], 'onLoad').and.returnValue(of(expectedValue).toPromise());

      expect(await component['getValuesAndFieldsFromLoad']()).toEqual(expectedValue);
      expect(component['dynamicViewService'].onLoad).toHaveBeenCalled();
    });

    it(`getValuesAndFieldsFromLoad: should call 'component.load' if 'component.load' is function`, async () => {
      const expectedValue = { value: { rg: '6.111' } };

      component.load = () => expectedValue;

      expect(await component['getValuesAndFieldsFromLoad']()).toEqual(expectedValue);
    });

    it(`getValuesAndFieldsFromLoad: shouldn't call 'component.load' or 'dynamicService.onLoad' if 'component.load' isn't
      string or function`, async () => {
      component.load = <any>[];

      spyOn(component['dynamicViewService'], 'onLoad').and.returnValue(of({}).toPromise());

      expect(await component['getValuesAndFieldsFromLoad']()).toEqual({});
      expect(component['dynamicViewService'].onLoad).not.toHaveBeenCalled();
    });

    it('getVisibleFields: should return `getMergedFields` if `showAllValue` is true', () => {
      component.showAllValue = true;

      spyOn(component, <any>'getMergedFields');

      component['getVisibleFields']();

      expect(component['getMergedFields']).toHaveBeenCalled();
    });

    it('getVisibleFields: should return `getConfiguredFields` if `showAllValue` is false, `value` and `fields.length` are truthy', () => {
      component.showAllValue = false;
      component.value = { name: 'po', age: 2 };
      component.fields = [{ property: 'name' }];

      spyOn(component, <any>'getConfiguredFields');

      component['getVisibleFields']();

      expect(component['getConfiguredFields']).toHaveBeenCalled();
    });

    it(`getVisibleFields: should return 'getValueFields' if 'showAllValue' is false, 'value' is truthy and
      'fields.length' is falsy`, () => {
      component.showAllValue = false;
      component.value = { name: 'po', age: 2 };
      component.fields = [];

      spyOn(component, <any>'getValueFields');

      component['getVisibleFields']();

      expect(component['getValueFields']).toHaveBeenCalled();
    });

    it(`setFieldOnLoad: should update field value if it is an existing field`, () => {
      const field = { property: 'name', tag: true };
      const fakeFieldOnLoad = { ...field };

      component.fields = [{ ...field }];

      const expectedValue = <any>{ property: 'name', tag: true };

      component['setFieldOnLoad'](fakeFieldOnLoad);

      expect(component.fields[0]).toEqual(expectedValue);
    });

    it(`setFieldOnLoad: should update 'fields' with field param if it is a new field`, () => {
      component.value = { name: 'teste' };
      component.fields = [{ property: 'name' }];

      const fakeFieldOnLoad = {
        property: 'age',
        tag: true
      };

      const expectedFields = [{ property: 'name' }, { ...fakeFieldOnLoad }];

      component['setFieldOnLoad'](fakeFieldOnLoad);

      expect(component.fields).toEqual(expectedFields);
    });

    it(`setFieldsOnLoad: should call 'setFieldOnLoad' if 'fields' is array`, () => {
      const fakeField = { property: 'name', tag: true };
      const fakeFieldsOnLoad = [{ ...fakeField }];

      spyOn(component, <any>'setFieldOnLoad');

      component['setFieldsOnLoad'](fakeFieldsOnLoad);

      expect(component['setFieldOnLoad']).toHaveBeenCalledWith(fakeField);
    });

    it(`setFieldsOnLoad: shouldn't call 'setFieldOnLoad' if 'fields' is undefined`, () => {
      const fakeFieldsOnLoad = undefined;
      const fakeField = { property: 'name', tag: true };

      spyOn(component, <any>'setFieldOnLoad');

      component['setFieldsOnLoad'](fakeFieldsOnLoad);

      expect(component['setFieldOnLoad']).not.toHaveBeenCalledWith(fakeField);
    });

    it(`setValueOnLoad: should update 'value' with 'newValue' param`, () => {
      const fakeNewValue = { name: 'teste 2', age: '22' };
      component.value = { name: 'teste 1' };

      const expectedValue = { ...component.value, ...fakeNewValue };

      component['setValueOnLoad'](fakeNewValue);

      expect(component.value).toEqual(expectedValue);
    });

    it(`updateValuesAndFieldsOnLoad: should call 'getValuesAndFieldsFromLoad', 'setValueOnLoad', 'setFieldsOnLoad'
    and 'getVisibleFields'`, async () => {
      const fakeDataOnLoad = { value: { name: 'teste 2' }, fields: [{ property: 'name', tag: true }] };
      spyOn(component, <any>'getValuesAndFieldsFromLoad').and.returnValue(fakeDataOnLoad);
      spyOn(component, <any>'setValueOnLoad');
      spyOn(component, <any>'setFieldsOnLoad');
      spyOn(component, <any>'getVisibleFields');

      await component['updateValuesAndFieldsOnLoad']();

      expect(component['getValuesAndFieldsFromLoad']).toHaveBeenCalled();
      expect(component['setValueOnLoad']).toHaveBeenCalledWith(fakeDataOnLoad.value);
      expect(component['setFieldsOnLoad']).toHaveBeenCalledWith(fakeDataOnLoad.fields);
      expect(component['getVisibleFields']).toHaveBeenCalled();
    });

    describe('setFieldValue:', () => {
      it(`should return the labels of the selected options if options exist and a match is found`, () => {
        const field = {
          value: ['value1'],
          optionsMulti: true,
          options: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
            { value: 'value3', label: 'label3' }
          ]
        };

        field.value = ['value1', 'value2'];
        expect(component.setFieldValue(field)).toEqual(['label1', 'label2']);
      });

      it(`should return the field values if options exist but no match is found'`, () => {
        const field = {
          value: ['value1'],
          optionsMulti: true,
          options: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
            { value: 'value3', label: 'label3' }
          ]
        };

        field.value = ['value4'];
        expect(component.setFieldValue(field)).toEqual(['value4']);
      });

      it(`should return the label of the selected option if options exist and a match is found`, () => {
        const field = {
          value: 'value1',
          options: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
            { value: 'value3', label: 'label3' }
          ]
        };

        field.value = 'value2';
        expect(component.setFieldValue(field)).toEqual('label2');
      });

      it(`should return the field value if options exist but no match is found'`, () => {
        const field = {
          value: 'value1',
          options: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
            { value: 'value3', label: 'label3' }
          ]
        };

        field.value = 'value4';
        expect(component.setFieldValue(field)).toEqual('value4');
      });
      it('should return the value of booleanTrue when the field value is true', () => {
        const field = {
          property: 'active',
          type: 'boolean',
          value: true,
          booleanTrue: 'Ativo',
          booleanFalse: 'Inativo'
        };
        expect(component.setFieldValue(field)).toEqual('Ativo');
      });

      it('should return the value of booleanFalse when the field value is false', () => {
        const field = {
          property: 'active',
          type: 'boolean',
          value: false,
          booleanTrue: 'Ativo',
          booleanFalse: 'Inativo'
        };
        expect(component.setFieldValue(field)).toEqual('Inativo');
      });

      it('should return "True" when the field value is true and booleanTrue is undefined', () => {
        const field = {
          property: 'active',
          type: 'boolean',
          value: true,
          booleanFalse: 'Inativo'
        };
        expect(component.setFieldValue(field)).toEqual(true);
      });

      it('should return "False" when the field value is false and booleanFalse is undefined', () => {
        const field = {
          property: 'active',
          type: 'boolean',
          value: false,
          booleanTrue: 'Ativo'
        };
        expect(component.setFieldValue(field)).toEqual(false);
      });
    });

    it('containsLineBreak: should return true if the string contains a newline character', () => {
      const value = 'Hello\nWorld';
      expect(component['containsLineBreak'](value)).toBeTrue();
    });
  });

  describe('Templates:', () => {
    it(`should create 'po-tag' if have a 'tag' property`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
    });

    it(`should create 'po-image' if have a 'image' property`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', image: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-image')).toBeTruthy();
    });

    it(`should create 'po-info' if haven't a 'tag' property`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
    });

    it(`should create 'po-info', 'po-tag' and 'po-image if have a one or more items with 'tag' property and one or more items
    without 'tag' property`, () => {
      component.fields = [
        { property: 'cpf', label: 'CPF' },
        { property: 'name', label: 'NAME', tag: true },
        { property: 'rg', label: 'RG' },
        { property: 'address', label: 'ADDRESS', tag: true },
        { property: 'image', label: 'IMAGE', image: true }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('po-image')).toBeTruthy();
    });

    it(`should create 'po-info' and 'po-divider' if haven't tag property and have a 'divider' property`, () => {
      component.fields = [
        { property: 'name', divider: 'Personal data' },
        { property: 'cpf', label: 'CPF' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
      expect(nativeElement.querySelector('po-divider')).toBeTruthy();
    });

    it(`should create 'po-info' and 'po-divider' if haven't tag property and have a 'divider' property`, () => {
      component.fields = [
        { property: 'name', divider: 'Personal data' },
        { property: 'cpf', label: 'CPF' }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
      expect(nativeElement.querySelector('po-divider')).toBeTruthy();
    });

    it(`should create all components in form`, () => {
      const fieldsTag = [
        { property: 'rg', label: 'RG', tag: true },
        { property: 'title', label: 'TITLE', tag: true },
        { property: 'street', label: 'STREET', tag: true },
        { property: 'state', label: 'STATE', tag: true }
      ];

      const fieldsInfo = [
        { property: 'cpf', label: 'CPF' },
        { property: 'name', label: 'NAME', tag: false },
        { property: 'address', label: 'ADDRESS', tag: false }
      ];

      const fieldsDivider = [
        { property: 'name', divider: 'Personal data' },
        { property: 'address', divider: 'Address data' }
      ];

      const fieldsImage = [
        { property: 'image1', label: 'IMAGE1', image: true },
        { property: 'image2', label: 'IMAGE2', image: true },
        { property: 'image3', label: 'IMAGE3', image: true },
        { property: 'image4', label: 'IMAGE4', image: true }
      ];

      component.fields = [...fieldsDivider, ...fieldsTag, ...fieldsInfo, ...fieldsImage];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      const infoElement = nativeElement.querySelectorAll('po-info');
      const tagElement = nativeElement.querySelectorAll('po-tag');
      const dividerElement = nativeElement.querySelectorAll('po-divider');
      const imageElement = nativeElement.querySelectorAll('po-image');

      expect(infoElement.length).toBe(fieldsInfo.length + fieldsDivider.length);
      expect(dividerElement.length).toBe(fieldsDivider.length);
      expect(tagElement.length).toBe(fieldsTag.length);
      expect(imageElement.length).toBe(fieldsImage.length);
    });

    it(`should create 'po-tag' with icon if properties 'tag' and 'icon' contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, icon: 'po-icon-ok' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();
      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-ok')).toBeTruthy();
    });

    it(`should create 'po-tag' without icon if 'tag' is true but 'icon' is not defined.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-icon-ok')).toBeFalsy();
    });

    it(`should create 'po-tag' with a custom color if 'tag' and 'color' properties contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, color: 'color-07' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-color-07')).toBeTruthy();
    });

    it(`should create 'po-tag' without a customized color.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-color-07')).toBeFalsy();
    });

    it(`should create 'po-tag' with a custom color  if only 'tag' and 'color' contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, color: 'color-07' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-text-color-07')).toBeFalsy();
      expect(nativeElement.querySelector('.po-color-07')).toBeTruthy();
    });

    it(`should create 'po-tag' with a custom color and text-color if 'tag', 'color' and 'textColor' contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, color: 'color-07', textColor: 'white' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-color-07')).toBeTruthy();
      expect(nativeElement.querySelector('po-tag span[style="color: white;"]')).toBeTruthy();
    });
  });
});
