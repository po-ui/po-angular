import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';

import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';
import { expectArraysSameOrdering, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { Observable, of } from 'rxjs';
import * as PoDynamicUtil from '../po-dynamic.util';
import { PoDynamicViewRequest } from './interfaces/po-dynamic-view-request.interface';
import { PoDynamicViewBaseComponent } from './po-dynamic-view-base.component';
import { PoDynamicViewField } from './po-dynamic-view-field.interface';
import { PoDynamicViewService } from './services/po-dynamic-view.service';
import { PoComboFilterService } from '../../po-field/po-combo/po-combo-filter.service';
import { PoMultiselectFilterService } from '../../po-field/po-multiselect/po-multiselect-filter.service';
import { PoComboFilter } from '../../po-field/po-combo/interfaces/po-combo-filter.interface';
import { PoMultiselectFilter } from '../../po-field/po-multiselect/po-multiselect-filter.interface';
import { PoComboOption } from '../../po-field';

class DynamicViewService implements PoDynamicViewRequest {
  getObjectByValue(id: string): Observable<any> {
    return of({ value: 123, label: 'teste' });
  }
}

class TestService implements PoDynamicViewRequest {
  getObjectByValue(id: string): Observable<any> {
    return of({ value: 123, label: 'teste' });
  }
}

class TestComboService implements PoComboFilter {
  getFilteredData(params: any, filterParams?: any): Observable<Array<PoComboOption>> {
    return of([{ value: 123, label: 'Teste' }]);
  }

  getObjectByValue(value: string | number): Observable<PoComboOption> {
    return of({ value: 123, label: 'Teste' });
  }
}

class TestMultiselectService implements PoMultiselectFilter {
  getFilteredData(params: { property: string; value: string }): Observable<Array<any>> {
    return of([
      { value: 123, label: 'teste' },
      { value: 456, label: 'teste' }
    ]);
  }
  getObjectsByValues(values: Array<string | number>): Observable<Array<any>> {
    return of([
      { value: 123, label: 'teste' },
      { value: 456, label: 'teste' }
    ]);
  }
  getObjectByValue(id: string): Observable<any> {
    return of({ value: 123, label: 'teste' });
  }
}

describe('PoDynamicViewBaseComponent:', () => {
  let component: PoDynamicViewBaseComponent;

  let titleCase;
  let datePipe;
  let decimalPipe;
  let timePipe;
  let currencyPipe;
  let dynamicViewService;
  let comboFilterService;
  let multiselectFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TitleCasePipe,
        DatePipe,
        DecimalPipe,
        CurrencyPipe,
        PoTimePipe,
        PoDynamicViewService,
        HttpClient,
        HttpHandler,
        DynamicViewService,
        PoComboFilterService,
        PoMultiselectFilterService
      ]
    });

    titleCase = TestBed.inject(TitleCasePipe);
    decimalPipe = TestBed.inject(DecimalPipe);
    datePipe = TestBed.inject(DatePipe);
    timePipe = TestBed.inject(PoTimePipe);
    currencyPipe = TestBed.inject(CurrencyPipe);
    dynamicViewService = TestBed.inject(PoDynamicViewService);
    comboFilterService = TestBed.inject(PoComboFilterService);
    multiselectFilterService = TestBed.inject(PoMultiselectFilterService);

    component = new PoDynamicViewBaseComponent(
      titleCase,
      decimalPipe,
      currencyPipe,
      datePipe,
      timePipe,
      dynamicViewService,
      comboFilterService,
      multiselectFilterService
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('fields: should set `fields` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'fields', invalidValues, []);
    });

    it('fields: should update property `p-fields` with valid values', () => {
      const validValues = [[{ property: 'Teste 1' }], [{ property: 'Teste 2' }]];

      expectPropertiesValues(component, 'fields', validValues, validValues);
    });

    it('value: should set `value` to `{}` if not object value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'value', invalidValues, {});
    });

    it('value: should update property `p-value` with valid values', () => {
      const validValues = [{}, { name: 'po' }];

      expectPropertiesValues(component, 'value', validValues, validValues);
    });

    it('showAllValue: should update with `true` with valid values.', () => {
      const validValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'showAllValue', validValues, true);
    });

    it('showAllValue: should update with `false` value if invalid values', () => {
      const invalidValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'showAllValue', invalidValues, false);
    });
  });

  describe('Methods: ', () => {
    describe('getConfiguredFields: ', () => {
      it('should call `isVisibleField` and return an configured array', () => {
        component.fields = [{ property: 'name' }, { property: 'age' }];

        spyOn(PoDynamicUtil, <any>'isVisibleField').and.returnValue(true);

        const configuredFields = component['getConfiguredFields']();

        expect(PoDynamicUtil.isVisibleField).toHaveBeenCalled();
        expect(configuredFields.length === component.fields.length).toBe(true);
      });

      it('shouldn`t call `createField` if method `isVisibleField` return false and return empty array', () => {
        component.fields = [{ property: 'name', visible: false }];

        spyOn(component, <any>'createField');

        const configuredFields = component['getConfiguredFields']();

        expect(component['createField']).not.toHaveBeenCalled();
        expect(configuredFields.length !== component.fields.length).toBe(true);
        expect(configuredFields.length).toBe(0);
      });

      it('should return the ordered fields', () => {
        const fields: Array<PoDynamicViewField> = [
          { property: 'test 1', order: 2 },
          { property: 'test 2', order: 1 },
          { property: 'test 3', order: 4 },
          { property: 'test 4', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 2' },
          { property: 'test 1' },
          { property: 'test 4' },
          { property: 'test 3' }
        ];

        component.fields = [...fields];

        const newFields = component['getConfiguredFields']();

        expectArraysSameOrdering(newFields, expectedFields);
      });

      it('should return ordering fields with value default', () => {
        const fields: Array<PoDynamicViewField> = [
          { property: 'test 1' },
          { property: 'test 2', order: 2 },
          { property: 'test 3', order: 1 },
          { property: 'test 4', order: -1 },
          { property: 'test 5', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 3' },
          { property: 'test 2' },
          { property: 'test 5' },
          { property: 'test 1' },
          { property: 'test 4' }
        ];

        component.fields = [...fields];

        const newFields = component['getConfiguredFields']();

        expectArraysSameOrdering(newFields, expectedFields);
      });

      it('should return ordering fields with zero as default value', () => {
        const fields: Array<PoDynamicViewField> = [
          { property: 'test 1' },
          { property: 'test 0', order: 0 },
          { property: 'test 2', order: 2 },
          { property: 'test 3', order: 1 },
          { property: 'test 4', order: -1 },
          { property: 'test 5', order: 3 }
        ];

        const expectedFields = [
          { property: 'test 3' },
          { property: 'test 2' },
          { property: 'test 5' },
          { property: 'test 1' },
          { property: 'test 0' },
          { property: 'test 4' }
        ];

        component.fields = [...fields];

        const newFields = component['getConfiguredFields']();

        expectArraysSameOrdering(newFields, expectedFields);
      });

      it('should return ordering fields with property searchService', fakeAsync(
        inject([DynamicViewService], (dynamicService: DynamicViewService) => {
          component.service = dynamicService;
          const fields: Array<PoDynamicViewField> = [
            { property: 'test 1', order: 6 },
            { property: 'test 0', order: 2, searchService: 'url.test.com', fieldLabel: 'name', fieldValue: 'id' },
            { property: 'test 2', order: 3 },
            { property: 'test 3', order: 1 },
            { property: 'test 4', order: 5 },
            { property: 'test 5', order: 4 }
          ];
          component.value[fields[1].property] = '123';
          spyOn(component.service, 'getObjectByValue').and.returnValue(of([{ id: 1, name: 'po' }]));
          spyOn(component, <any>'searchById').and.returnValue(of([{ id: 1, name: 'po' }]));

          const expectedFields = [
            { property: 'test 3' },
            { property: 'test 0', value: 'po' },
            { property: 'test 2' },
            { property: 'test 5' },
            { property: 'test 4' },
            { property: 'test 1' }
          ];

          component.fields = [...fields];

          const newFields = component['getConfiguredFields']();
          tick(500);
          console.log(newFields);

          expectArraysSameOrdering(newFields, expectedFields);
        })
      ));

      it('should return ordering fields with property searchService using service type', fakeAsync(
        inject([DynamicViewService], (dynamicService: DynamicViewService) => {
          component.service = dynamicService;
          const fields: Array<PoDynamicViewField> = [
            { property: 'test 1' },
            { property: 'test 0', searchService: new TestService(), fieldLabel: 'name', fieldValue: 'id' },
            { property: 'test 2', searchService: 'url.com' },
            { property: 'test 3', searchService: 'url.com' },
            { property: 'test 4' },
            { property: 'test 5' }
          ];
          component.value[fields[1].property] = '123';
          component.value[fields[2].property] = [{ test: 123 }];
          component.value[fields[3].property] = { test: 123 };

          spyOn(component.service, 'getObjectByValue').and.returnValue(of([{ id: 1, name: 'po' }]));

          const expectedFields = [
            { property: 'test 1', value: undefined },
            { property: 'test 0', value: 'teste' },
            { property: 'test 2', value: null },
            { property: 'test 3', value: null },
            { property: 'test 4' },
            { property: 'test 5' }
          ];

          component.fields = [...fields];

          const newFields = component['getConfiguredFields']();
          tick(500);
          console.log(newFields);

          expectArraysSameOrdering(newFields, expectedFields);
        })
      ));

      it('should return ordering fields with property optionsService using service type', fakeAsync(
        inject([PoComboFilterService], (comboService: PoComboFilterService) => {
          component.service = comboService;
          const fields: Array<PoDynamicViewField> = [
            { property: 'test 1' },
            { property: 'test 0', optionsService: new TestComboService(), fieldLabel: 'name', fieldValue: 'id' },
            { property: 'test 2', optionsService: 'url.com' },
            { property: 'test 3', optionsService: 'url.com' },
            { property: 'test 4' },
            { property: 'test 5' }
          ];
          component.value[fields[1].property] = '123';
          component.value[fields[2].property] = [{ test: 123 }];
          component.value[fields[3].property] = { test: 123 };

          spyOn(component.service, 'getObjectByValue').and.returnValue(of([{ id: 1, name: 'po' }]));

          const expectedFields = [
            { property: 'test 1', value: undefined },
            { property: 'test 0', value: 'teste' },
            { property: 'test 2', value: null },
            { property: 'test 3', value: null },
            { property: 'test 4' },
            { property: 'test 5' }
          ];

          component.fields = [...fields];

          const newFields = component['getConfiguredFields']();
          tick(500);
          console.log(newFields);

          expectArraysSameOrdering(newFields, expectedFields);
        })
      ));

      it('should return ordering fields with property optionsService and optionsMulti using service type', fakeAsync(
        inject([PoMultiselectFilterService], (multiselectService: PoMultiselectFilter) => {
          component.service = multiselectService;
          const fields: Array<PoDynamicViewField> = [
            { property: 'test 1' },
            {
              property: 'test 0',
              optionsService: new TestMultiselectService(),
              fieldLabel: 'name',
              fieldValue: 'id',
              optionsMulti: true
            },
            { property: 'test 2', optionsService: 'url.com', optionsMulti: true },
            { property: 'test 3', optionsService: 'url.com', optionsMulti: true },
            { property: 'test 4' },
            { property: 'test 5' }
          ];
          component.value[fields[1].property] = '123';
          component.value[fields[2].property] = [{ test: 123 }];
          component.value[fields[3].property] = { test: 123 };

          spyOn(component.service, 'getObjectsByValues').and.returnValue(of([{ id: 1, name: 'po' }]));

          const expectedFields = [
            { property: 'test 1', value: undefined },
            { property: 'test 0', value: 'teste' },
            { property: 'test 2', value: null },
            { property: 'test 3', value: null },
            { property: 'test 4' },
            { property: 'test 5' }
          ];

          component.fields = [...fields];

          const newFields = component['getConfiguredFields']();
          tick(500);
          console.log(newFields);

          expectArraysSameOrdering(newFields, expectedFields);
        })
      ));

      it('should process fields with optionsService', () => {
        component.fields = [{ property: 'category', optionsService: 'url.optionsService.com' }];
        component.value = { 'category': '123' };
        spyOn(component, <any>'createFieldWithService').and.callThrough();
        const configuredFields = component['getConfiguredFields']();
        expect(component['createFieldWithService']).toHaveBeenCalled();
        expect(configuredFields.length).toBeGreaterThan(0);
      });

      it('should process fields with optionsMulti', () => {
        component.fields = [{ property: 'tags', optionsMulti: true, optionsService: 'url.optionsMultiService.com' }];
        component.value = { 'tags': ['tag1', 'tag2'] };
        spyOn(component, <any>'createFieldWithService').and.callThrough();
        const configuredFields = component['getConfiguredFields']();
        expect(component['createFieldWithService']).toHaveBeenCalled();
        expect(configuredFields.length).toBeGreaterThan(0);
      });

      it('should not process fields with optionsService when there is no value', () => {
        component.fields = [{ property: 'category', optionsService: 'url.optionsService.com' }];
        component.value = { 'category': null };
        spyOn(component, <any>'createFieldWithService');
        const configuredFields = component['getConfiguredFields']();
        expect(component['createFieldWithService']).not.toHaveBeenCalled();
        expect(configuredFields.length).toBe(0);
      });

      it('should handle fields with empty array values correctly', () => {
        component.fields = [{ property: 'emptyArray', optionsMulti: true }];
        component.value = { 'emptyArray': [] };
        spyOn(component, <any>'createField');
        const configuredFields = component['getConfiguredFields']();
        expect(component['createField']).toHaveBeenCalled();
        expect(configuredFields.length).toBeGreaterThan(0);
      });

      it('should handle fields without defined values correctly', () => {
        component.fields = [{ property: 'undefinedValue' }];
        component.value = {};
        spyOn(component, <any>'createField');
        const configuredFields = component['getConfiguredFields']();
        expect(component['createField']).toHaveBeenCalled();
        expect(configuredFields.length).toBeGreaterThan(0);
      });
    });

    it('searchById: should return null if value is empty', done => {
      const value = '';
      const field: any = { property: 'test' };

      component['searchById'](value, field).subscribe(result => {
        expect(result).toBeNull(); // Verifique se o resultado é nulo
        done();
      });
    });

    it('createFieldWithService: should call searchById and update newFields correctly', fakeAsync(() => {
      const field = { property: 'test' };
      const newFields = [];
      const index = 0;

      const valueToSearch = '123';
      const expectedResult = 'transformedValue';

      const mockSearchById = spyOn(component, <any>'searchById').and.returnValue(of(expectedResult));

      component.value[field.property] = valueToSearch;
      component['createFieldWithService'](field, newFields, index);

      tick();

      expect(mockSearchById).toHaveBeenCalledWith(valueToSearch, field);
      expect(newFields[index].value).toBe(expectedResult);
    }));

    it('getMergedFields: should return a merged array between configuredFields and valueFields', () => {
      const configuredFields = [{ property: 'name', value: 'po' }];
      const valueFields = [{ property: 'email' }];

      spyOn(component, <any>'getConfiguredFields').and.returnValue(configuredFields);
      spyOn(component, <any>'getValueFields').and.returnValue(valueFields);

      const mergedFields = component['getMergedFields']();

      expect(component['getConfiguredFields']).toHaveBeenCalled();
      expect(component['getValueFields']).toHaveBeenCalled();
      expect(mergedFields.length === [...valueFields, ...configuredFields].length).toBe(true);
    });

    it('getMergedFields: should return the same array if properties in valueFields already exists in configuredFields', () => {
      const configuredFields = [{ property: 'name', value: 'po' }];
      const valueFields = [{ property: 'name' }];

      spyOn(component, <any>'getConfiguredFields').and.returnValue(configuredFields);
      spyOn(component, <any>'getValueFields').and.returnValue(valueFields);
      spyOn(component, <any>'createField');

      const mergedFields = component['getMergedFields']();

      expect(component['getConfiguredFields']).toHaveBeenCalled();
      expect(component['getValueFields']).toHaveBeenCalled();
      expect(component['createField']).not.toHaveBeenCalled();
      expect(mergedFields.length !== [...valueFields, ...configuredFields].length).toBe(true);
    });

    it(`createField: should call 'transformValue' and return an
    object that overrides the values of the same properties`, () => {
      const field = { property: 'name', label: 'Nome' };

      spyOn(component['titleCasePipe'], 'transform').and.returnValue('Name');
      spyOn(component, <any>'transformValue');

      const newField = component['createField'](field);

      expect(typeof newField === 'object').toBe(true);
      expect(newField.label).toBe(field.label);

      expect(component['transformValue']).toHaveBeenCalled();
    });

    it(`createField: should call 'transformArrayValue', return a
    object and value is a label property`, () => {
      const field = { property: 'name', label: 'Nome', isArrayOrObject: true };
      component.value = { name: { label: 'Test1', value: 123 } };

      const newField = component['createField'](field);

      expect(newField.value).toBe('Test1');
    });

    it(`createField: should call 'transformArrayValue', return a
    list and value is a title property`, () => {
      const field = {
        property: 'name',
        label: 'Nome',
        isArrayOrObject: true,
        concatLabelValue: true,
        fieldLabel: 'title',
        fieldValue: 'id'
      };
      component.value = {
        name: [
          { title: 'Test1', id: 123 },
          { title: 'Test2', id: 321 }
        ]
      };

      const newField = component['createField'](field);

      expect(newField.value).toBe('Test1 - 123, Test2 - 321');
    });

    it(`createField: should call 'transformArrayValue' and return a empty value if fieldLabel is a property invalid`, () => {
      const field = { property: 'name', label: 'Nome', isArrayOrObject: true, fieldLabel: 'item', fieldValue: 'other' };
      const listName = [
        { title: 'Test1', id: 123 },
        { title: 'Test2', id: 321 }
      ];
      component.value = {
        name: listName
      };

      const newField = component['createField'](field);

      expect(newField.value).toEqual(listName);
    });

    it('transformArrayValue: should return a concatenated string of multiple properties from an array of objects', () => {
      const inputArray = [
        { id: 1, name: 'Company1', ssn: '261-81-7609' },
        { id: 2, name: 'Company2', ssn: '527-84-6773' }
      ];
      const field = {
        property: 'company',
        label: 'Company',
        fieldLabel: 'name',
        fieldValue: 'id',
        format: ['id', 'name', 'ssn']
      };

      const result = component['transformArrayValue'](inputArray, field);

      expect(result).toBe('1 - Company1 - 261-81-7609, 2 - Company2 - 527-84-6773');
    });

    it('transformArrayValue: should return a concatenated string of properties from a single object', () => {
      const inputArray = [{ id: 1, name: 'Company1', ssn: '261-81-7609' }];
      const field = {
        property: 'company',
        label: 'Company',
        fieldLabel: 'name',
        fieldValue: 'id',
        format: ['id', 'name', 'ssn']
      };

      const result = component['transformArrayValue'](inputArray, field);

      expect(result).toBe('1 - Company1 - 261-81-7609');
    });

    it(`createField: should call 'transformFieldLabel' and return a fieldLabel property`, () => {
      const field = { property: 'name', label: 'Nome', fieldLabel: 'title', fieldValue: 'id' };
      component.value = { name: 'Test Name', title: 'Title Test', id: 123 };

      const newField = component['createField'](field);

      expect(newField.value).toBe('Title Test');
    });

    it('createField: should call `transformFieldLabel`, return a `fieldLabel` and `fieldValue` property if `concatLabelValue` is true', () => {
      const field = {
        property: 'name',
        label: 'Nome',
        fieldLabel: 'title',
        fieldValue: 'id',
        concatLabelValue: true,
        type: 'currency'
      };
      component.value = { name: 'Test Name', title: 'Test Title', id: 123 };

      const newField = component['createField'](field);

      expect(newField.value).toBe('Test Title - 123');
    });

    it('getValueFields: should return an array converting the value object', () => {
      component.value = { name: 'Po' };

      spyOn(component, <any>'createField');

      const valueFields = component['getValueFields']();

      expect(component['createField']).toHaveBeenCalled();
      expect(valueFields.length).toBe(1);
      expect(valueFields instanceof Array).toBe(true);
    });

    it('getValueFields: shouldn`t call `createField` and return an empty array if value is an empty object', () => {
      component.value = {};

      spyOn(component, <any>'createField');

      const valueFields = component['getValueFields']();

      expect(component['createField']).not.toHaveBeenCalled();
      expect(valueFields.length).toBe(0);
      expect(valueFields instanceof Array).toBe(true);
    });

    describe('transformValue: ', () => {
      it('transformValue: should apply `currencyPipe.transform` case `type` is `currency`', () => {
        const type = 'currency';
        const value = 1244.5;
        const format = 'CAD';

        spyOn(component['currencyPipe'], 'transform');

        component['transformValue'](type, value, format);

        expect(component['currencyPipe'].transform).toHaveBeenCalledWith(value, format, 'symbol', '1.2-2');
      });

      it('should apply `currencyPipe.transform` with default format case `type` is `currency`', () => {
        const type = 'currency';
        const value = 1244.5;
        const defaultFormat = 'BRL';

        spyOn(component['currencyPipe'], 'transform');

        component['transformValue'](type, value, undefined);

        expect(component['currencyPipe'].transform).toHaveBeenCalledWith(value, defaultFormat, 'symbol', '1.2-2');
      });

      it('should apply `datePipe.transform` with default format case `type` is `date`', () => {
        const type = 'date';
        const value = new Date();
        const defaultFormat = 'dd/MM/yyyy';

        spyOn(component['datePipe'], 'transform');

        component['transformValue'](type, value, undefined);

        expect(component['datePipe'].transform).toHaveBeenCalledWith(value, defaultFormat);
      });

      it('should apply `datePipe.transform` with format case `type` is `date`', () => {
        const type = 'date';
        const value = new Date();
        const format = 'MM/dd/yyyy';

        spyOn(component['datePipe'], 'transform');

        component['transformValue'](type, value, format);

        expect(component['datePipe'].transform).toHaveBeenCalledWith(value, format);
      });

      it('should apply `datePipe.transform` with default format case `type` is `dateTime`', () => {
        const type = 'dateTime';
        const value = new Date();
        const defaultFormat = 'dd/MM/yyyy HH:mm:ss';

        spyOn(component['datePipe'], 'transform');

        component['transformValue'](type, value, undefined);

        expect(component['datePipe'].transform).toHaveBeenCalledWith(value, defaultFormat);
      });

      it('should apply `datePipe.transform` with format case `type` is `dateTime`', () => {
        const type = 'dateTime';
        const value = new Date();
        const format = 'MM/dd/yyyy HH:mm:ss';

        spyOn(component['datePipe'], 'transform');

        component['transformValue'](type, value, format);

        expect(component['datePipe'].transform).toHaveBeenCalledWith(value, format);
      });

      it('should apply `decimalPipe.transform` case `type` is number', () => {
        const type = 'number';
        const value = 150;
        const format = '1.2-2';

        spyOn(component['decimalPipe'], 'transform');

        component['transformValue'](type, value, format);

        expect(component['decimalPipe'].transform).toHaveBeenCalledWith(value, format);
      });

      it('should apply `timePipe.transform` with default format case `type` is time', () => {
        const type = 'time';
        const value = '150';
        const defaultFormat = 'HH:mm:ss.ffffff';

        spyOn(component['timePipe'], 'transform');

        component['transformValue'](type, value, undefined);

        expect(component['timePipe'].transform).toHaveBeenCalledWith(value, defaultFormat);
      });

      it('should apply `timePipe.transform` with format case `type` is time', () => {
        const type = 'time';
        const value = '150';
        const format = 'HH:mm:ss';

        spyOn(component['timePipe'], 'transform');

        component['transformValue'](type, value, format);

        expect(component['timePipe'].transform).toHaveBeenCalledWith(value, format);
      });

      it('shouldn`t apply pipes case `type` is invalid', () => {
        const type = '';
        const value = 150;

        spyOn(component['currencyPipe'], 'transform');
        spyOn(component['datePipe'], 'transform');
        spyOn(component['decimalPipe'], 'transform');
        spyOn(component['timePipe'], 'transform');

        const transformedValue = component['transformValue'](type, value, '');

        expect(component['currencyPipe'].transform).not.toHaveBeenCalled();
        expect(component['datePipe'].transform).not.toHaveBeenCalled();
        expect(component['decimalPipe'].transform).not.toHaveBeenCalled();
        expect(component['timePipe'].transform).not.toHaveBeenCalled();

        expect(transformedValue).toBe(value);
      });
    });
  });
});
