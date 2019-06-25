import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDynamicModule } from '../po-dynamic.module';
import { PoDynamicViewComponent } from './po-dynamic-view.component';

describe('PoDynamicViewComponent:', () => {
  let component: PoDynamicViewComponent;
  let fixture: ComponentFixture<PoDynamicViewComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ PoDynamicModule ]
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

        spyOn(component, <any> 'getVisibleFields');

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).not.toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(0);
      });

      it('should call `getVisibleFields` if `changes.fields` is true', () => {
        const changes = { fields: <any> {} };
        component.visibleFields = [];

        spyOn(component, <any> 'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

      it('should call `getVisibleFields` if `changes.value` is true', () => {
        const changes = { value: <any> {} };
        component.visibleFields = [];

        spyOn(component, <any> 'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

      it('should call `getVisibleFields` if `changes.showAllValue` is true', () => {
        const changes = { showAllValue: <any> {} };
        component.visibleFields = [];

        spyOn(component, <any> 'getVisibleFields').and.returnValue(returnedValue);

        component.ngOnChanges(changes);

        expect(component['getVisibleFields']).toHaveBeenCalled();
        expect(component.visibleFields.length).toBe(returnedValue.length);
      });

    });

    it('getVisibleFields: should return `getMergedFields` if `showAllValue` is true', () => {
      component.showAllValue = true;

      spyOn(component, <any> 'getMergedFields');

      component['getVisibleFields']();

      expect(component['getMergedFields']).toHaveBeenCalled();
    });

    it('getVisibleFields: should return `getConfiguredFields` if `showAllValue` is false, `value` and `fields.length` are truthy', () => {
      component.showAllValue = false;
      component.value = { name: 'po', age: 2 };
      component.fields = [{ property: 'name' }];

      spyOn(component, <any> 'getConfiguredFields');

      component['getVisibleFields']();

      expect(component['getConfiguredFields']).toHaveBeenCalled();
    });

    it(`getVisibleFields: should return 'getValueFields' if 'showAllValue' is false, 'value' is truthy and
      'fields.length' is falsy`, () => {
      component.showAllValue = false;
      component.value = { name: 'po', age: 2 };
      component.fields = [];

      spyOn(component, <any> 'getValueFields');

      component['getVisibleFields']();

      expect(component['getValueFields']).toHaveBeenCalled();
    });

  });

  describe('Templates:', () => {

    it(`should create 'po-tag' if have a 'tag' property`, () => {
      component.fields = [
        { property: 'cpf', label: 'CPF', tag: true },
      ];

      component.ngOnChanges({
        fields: new SimpleChange(null, component.fields, true)
      });

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-tag')).toBeTruthy();
    });

    it(`should create 'po-info' if haven't a 'tag' property`, () => {
      component.fields = [
        { property: 'cpf', label: 'CPF' },
      ];

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
        { property: 'address', label: 'ADDRESS', tag: true },
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
        { property: 'cpf', label: 'CPF' },
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
        { property: 'cpf', label: 'CPF' },
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
        { property: 'state', label: 'STATE', tag: true },
      ];

      const fieldsInfo = [
        { property: 'cpf', label: 'CPF' },
        { property: 'name', label: 'NAME', tag: false },
        { property: 'address', label: 'ADDRESS', tag: false },
      ];

      const fieldsDivider = [
        { property: 'name', divider: 'Personal data' },
        { property: 'address', divider: 'Address data' },
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

  });

});
