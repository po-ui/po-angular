import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { expectPropertiesValues, expectArraysSameOrdering } from '../../../util-test/util-expect.spec';
import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';

import * as PoDynamicUtil from '../po-dynamic.util';
import { PoDynamicViewBaseComponent } from './po-dynamic-view-base.component';
import { PoDynamicViewService } from './po-dynamic-view.service';
import { PoDynamicViewField } from './po-dynamic-view-field.interface';

describe('PoDynamicViewBaseComponent:', () => {
  let component: PoDynamicViewBaseComponent;

  let titleCase;
  let datePipe;
  let decimalPipe;
  let timePipe;
  let currencyPipe;
  let dynamicViewService;

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
        HttpHandler
      ]
    });

    titleCase = TestBed.inject(TitleCasePipe);
    decimalPipe = TestBed.inject(DecimalPipe);
    datePipe = TestBed.inject(DatePipe);
    timePipe = TestBed.inject(PoTimePipe);
    currencyPipe = TestBed.inject(CurrencyPipe);
    dynamicViewService = TestBed.inject(PoDynamicViewService);

    component = new PoDynamicViewBaseComponent(
      titleCase,
      decimalPipe,
      currencyPipe,
      datePipe,
      timePipe,
      dynamicViewService
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
    });

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
