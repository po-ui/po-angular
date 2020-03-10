import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SimpleChange } from '@angular/core';

import { of } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDynamicModule } from '../po-dynamic.module';
import { PoDynamicViewComponent } from './po-dynamic-view.component';
import { PoDynamicViewService } from './po-dynamic-view.service';

describe('PoDynamicViewComponent:', () => {
  let component: PoDynamicViewComponent;
  let fixture: ComponentFixture<PoDynamicViewComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoDynamicModule],
      providers: [HttpClient, HttpHandler, PoDynamicViewService]
    });
  });

  beforeEach(() => {
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
    });

    it('ngOnInit: should call `updateValuesAndFieldsOnLoad` if typeof `load` is truthy', () => {
      component.load = 'teste';

      spyOn(component, <any>'updateValuesAndFieldsOnLoad');

      component.ngOnInit();

      expect(component['updateValuesAndFieldsOnLoad']).toHaveBeenCalled();
    });

    it(`getValuesAndFieldsFromLoad: should call 'dynamicViewService.onLoad' if 'component.load' is string`, async () => {
      const expectedValue = { value: { name: 'teste 2' }, fields: [{ property: 'name', tag: true, inverse: true }] };

      component.load = 'teste';

      spyOn(component['dynamicViewService'], 'onLoad').and.returnValue(of(expectedValue).toPromise());

      expect(await component['getValuesAndFieldsFromLoad']()).toEqual(expectedValue);
      expect(component['dynamicViewService'].onLoad).toHaveBeenCalled();
    });

    it(`getValuesAndFieldsFromLoad: should call 'component.load' if 'component.load' is function`, async () => {
      const expectedValue = { value: { rg: '6.111' } };

      component.load = () => {
        return expectedValue;
      };

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
      const fakeFieldOnLoad = { ...field, inverse: true };

      component.fields = [{ ...field }];

      const expectedValue = <any>{ property: 'name', tag: true, inverse: true };

      component['setFieldOnLoad'](fakeFieldOnLoad);

      expect(component.fields[0]).toEqual(expectedValue);
    });

    it(`setFieldOnLoad: should update 'fields' with field param if it is a new field`, () => {
      component.value = { name: 'teste' };
      component.fields = [{ property: 'name' }];

      const fakeFieldOnLoad = {
        property: 'age',
        tag: true,
        inverse: true
      };

      const expectedFields = [{ property: 'name' }, { ...fakeFieldOnLoad }];

      component['setFieldOnLoad'](fakeFieldOnLoad);

      expect(component.fields).toEqual(expectedFields);
    });

    it(`setFieldsOnLoad: should call 'setFieldOnLoad' if 'fields' is array`, () => {
      const fakeField = { property: 'name', tag: true, inverse: true };
      const fakeFieldsOnLoad = [{ ...fakeField }];

      spyOn(component, <any>'setFieldOnLoad');

      component['setFieldsOnLoad'](fakeFieldsOnLoad);

      expect(component['setFieldOnLoad']).toHaveBeenCalledWith(fakeField);
    });

    it(`setFieldsOnLoad: shouldn't call 'setFieldOnLoad' if 'fields' is undefined`, () => {
      const fakeFieldsOnLoad = undefined;
      const fakeField = { property: 'name', tag: true, inverse: true };

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
      const fakeDataOnLoad = { value: { name: 'teste 2' }, fields: [{ property: 'name', tag: true, inverse: true }] };
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

    it(`should create 'po-info' if haven't a 'tag' property`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF' }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
    });

    it(`should create 'po-info' and 'po-tag' if have a one or more items with 'tag' property and one or more items
    without 'tag' property`, () => {
      component.fields = [
        { property: 'cpf', label: 'CPF' },
        { property: 'name', label: 'NAME', tag: true },
        { property: 'rg', label: 'RG' },
        { property: 'address', label: 'ADDRESS', tag: true }
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-info')).toBeTruthy();
      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
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

      component.fields = [...fieldsDivider, ...fieldsTag, ...fieldsInfo];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      const infoElement = nativeElement.querySelectorAll('po-info');
      const tagElement = nativeElement.querySelectorAll('po-tag');
      const dividerElement = nativeElement.querySelectorAll('po-divider');

      expect(infoElement.length).toBe(fieldsInfo.length + fieldsDivider.length);
      expect(dividerElement.length).toBe(fieldsDivider.length);
      expect(tagElement.length).toBe(fieldsTag.length);
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

    it(`should create 'po-tag-inverse' with custom and inverse colors if 'color', 'tag' and 'inverse' properties contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, color: 'color-07', inverse: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-inverse')).toBeTruthy();
      expect(nativeElement.querySelector('.po-text-color-07')).toBeTruthy();
    });

    it(`should create 'po-tag' with a custom color and without 'inverse' if only 'tag' and 'color' contain values.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, color: 'color-07', inverse: false }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-inverse')).toBeFalsy();
      expect(nativeElement.querySelector('.po-text-color-07')).toBeFalsy();
      expect(nativeElement.querySelector('.po-color-07')).toBeTruthy();
    });

    it(`should create 'po-tag-inverse' if 'tag' is 'default' and 'inverse'.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, inverse: true }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-inverse')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-info-inverse')).toBeTruthy();
    });

    it(`shouldn't create 'po-tag-inverse' if 'tag' is 'default' and 'inverse' is false.`, () => {
      component.fields = [{ property: 'cpf', label: 'CPF', tag: true, inverse: false }];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tag-inverse')).toBeFalsy();
      expect(nativeElement.querySelector('.po-tag-info-inverse')).toBeFalsy();
      expect(nativeElement.querySelector('.po-tag-info')).toBeTruthy();
    });
  });
});
