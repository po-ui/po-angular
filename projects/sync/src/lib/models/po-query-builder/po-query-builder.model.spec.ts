import { PoStorageService } from '@po-ui/ng-storage';
import * as utilsFunctions from '../../utils/utils';

import { PoQueryBuilder } from './po-query-builder.model';
import { PoSchemaDefinitionService, PoSchemaService } from '../../services/po-schema';
import { PoSyncSchema } from '../../services/po-sync/interfaces/po-sync-schema.interface';

describe('PoQueryBuilder:', () => {
  let poQueryBuilder: PoQueryBuilder;

  const poSyncSchemaMock: PoSyncSchema = {
    idField: 'id',
    getUrlApi: 'getUrlApi',
    diffUrlApi: 'diffUrlApi',
    name: 'Model name',
    fields: [],
    pageSize: 0,
    deletedField: 'deletedField'
  };

  beforeEach(() => {
    const poStorageMock = new PoStorageService();
    const poSchemaDefinitionMock = new PoSchemaDefinitionService(poStorageMock);
    const poSchemaMock = new PoSchemaService(poSchemaDefinitionMock, poStorageMock);

    poQueryBuilder = new PoQueryBuilder(poSchemaMock, poSyncSchemaMock);
  });

  it('should be created', () => {
    expect(poQueryBuilder instanceof PoQueryBuilder).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('exec:', () => {
      beforeEach(() => {
        poQueryBuilder['_limit'] = undefined;
        poQueryBuilder['filters'] = {};
        poQueryBuilder['fields'] = undefined;
        poQueryBuilder['_sort'] = undefined;
        poQueryBuilder['_page'] = undefined;
        poQueryBuilder['_pageSize'] = undefined;
      });

      it('should return empty items and hasNext false if poSchemaService.getAll return undefined', async () => {
        spyOn(poQueryBuilder['poSchemaService'], 'getAll');

        const data = await poQueryBuilder.exec();

        expect(poQueryBuilder['poSchemaService']['getAll']).toHaveBeenCalled();
        expect(data).toEqual({ hasNext: false, items: [] });
      });

      it('should return empty items and hasNext false if poSchemaService.getAll is empty', async () => {
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>[]);

        const data = await poQueryBuilder.exec();

        expect(poQueryBuilder['poSchemaService']['getAll']).toHaveBeenCalled();
        expect(data).toEqual({ hasNext: false, items: [] });
      });

      it('should return 1 record and not call `paginate` if limit is defined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['_limit'] = 1;

        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);
        spyOn(poQueryBuilder, <any>'paginate');

        const data = await poQueryBuilder.exec();

        expect(data).toEqual(objectA);
        expect(poQueryBuilder['paginate']).not.toHaveBeenCalled();
      });

      it('should call `paginate` if this._limit is undefined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];
        const expectDataPaginated = { hasNext: false, items: [{ pages: 2, data: storageData }] };

        poQueryBuilder['_limit'] = undefined;

        spyOn(poQueryBuilder, <any>'paginate').and.returnValue(expectDataPaginated);
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        const result = await poQueryBuilder.exec();

        expect(poQueryBuilder['paginate']).toHaveBeenCalledWith(storageData);

        expect(result).toEqual(expectDataPaginated);
      });

      it('should call applyFilters if this.filters has keys', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['filters'] = { key: 'value' };

        spyOn(poQueryBuilder, <any>'applyFilters');
        spyOn(poQueryBuilder, <any>'paginate');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['applyFilters']).toHaveBeenCalledWith(storageData);
      });

      it('should not call applyFilters if this.filters not have keys', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['filters'] = {};

        spyOn(poQueryBuilder, <any>'applyFilters');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['applyFilters']).not.toHaveBeenCalled();
      });

      it('should call applyFields if fields is defined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['fields'] = 'field';

        spyOn(poQueryBuilder, <any>'applyFields');
        spyOn(poQueryBuilder, <any>'paginate');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['applyFields']).toHaveBeenCalledWith(poSyncSchemaMock.fields, storageData);
      });

      it('should not call applyFields if fields is undefined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['fields'] = undefined;

        spyOn(poQueryBuilder, <any>'applyFields');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['applyFields']).not.toHaveBeenCalled();
      });

      it('should call order if this._sort is defined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['_sort'] = 'field';

        spyOn(poQueryBuilder, <any>'order');
        spyOn(poQueryBuilder, <any>'paginate');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['order']).toHaveBeenCalledWith(storageData, poQueryBuilder['_sort']);
      });

      it('should not call order if this._sort is undefined', async () => {
        const objectA = { id: 1, field: jasmine.anything() };
        const objectB = { id: 2, field: jasmine.anything() };
        const storageData = [objectA, objectB];

        poQueryBuilder['_sort'] = undefined;

        spyOn(poQueryBuilder, <any>'order');
        spyOn(poQueryBuilder['poSchemaService'], 'getAll').and.returnValue(<any>storageData);

        await poQueryBuilder.exec();

        expect(poQueryBuilder['order']).not.toHaveBeenCalled();
      });
    });

    it('filter: should set this.filter with o the filter param', () => {
      const filter = { 1: 'A', 2: 'B' };
      poQueryBuilder['filters'] = {};

      poQueryBuilder.filter(filter);

      expect(poQueryBuilder['filters']).toEqual(filter);
    });

    it('filter: should add filter param in this.filter', () => {
      const filter = { 2: 'B', 3: 'C' };
      poQueryBuilder['filters'] = { 1: 'A' };

      poQueryBuilder.filter(filter);

      expect(poQueryBuilder['filters']).toEqual({ ...poQueryBuilder['filters'], ...filter });
    });

    it('filter: should return throw error when filter is undefined', () => {
      const result = () => poQueryBuilder.filter();

      expect(result).toThrowError('Filter must be an object');
    });

    it('filter: should return throw error when filter not is object', () => {
      const result = () => poQueryBuilder.filter(<any>0);

      expect(result).toThrowError('Filter must be an object');
    });

    it('filter: should add an empty filter and return the starter filter in filters', () => {
      const starterFilter = { 1: 'A' };
      const result = poQueryBuilder.filter(starterFilter).filter({});

      expect(result['filters']).toEqual(starterFilter);
    });

    it('filter: should return PoQueryBuilder when filter is empty', () => {
      const result = poQueryBuilder.filter({});

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('filter: should return PoQueryBuilder', () => {
      const filter = { 2: 'B' };
      const result = poQueryBuilder.filter(filter);

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('limit: should set this._limit with limit param', () => {
      const limit = 1;
      poQueryBuilder['_limit'] = undefined;

      poQueryBuilder.limit(limit);

      expect(poQueryBuilder['_limit']).toBe(limit);
    });

    it('limit: should return PoQueryBuilder', () => {
      const result = poQueryBuilder.limit(0);

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('page: should call validateParameter with with `page` inside an object and set this._page with page param', () => {
      const page = 1;
      poQueryBuilder['_page'] = undefined;

      spyOn(utilsFunctions, 'validateParameter');

      poQueryBuilder.page(page);

      expect(poQueryBuilder['_page']).toBe(page);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ page });
    });

    it('page: should return PoQueryBuilder', () => {
      spyOn(utilsFunctions, 'validateParameter');

      const result = poQueryBuilder.page(0);

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it(`pageSize: should call validateParameter with with 'pageSize' inside an object and set this._pageSize with
      pageSize param`, () => {
      const pageSize = 1;
      poQueryBuilder['_pageSize'] = undefined;

      spyOn(utilsFunctions, 'validateParameter');

      poQueryBuilder.pageSize(pageSize);

      expect(poQueryBuilder['_pageSize']).toBe(pageSize);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ pageSize });
    });

    it('pageSize: should return PoQueryBuilder', () => {
      spyOn(utilsFunctions, 'validateParameter');

      const result = poQueryBuilder.pageSize(0);

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it(`select: should call validateParameter with with 'fields' inside an object and set this.fields with
      select param`, () => {
      const fields = 'field';
      poQueryBuilder['fields'] = undefined;

      spyOn(utilsFunctions, 'validateParameter');

      poQueryBuilder.select(fields);

      expect(poQueryBuilder['fields']).toBe(fields);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ fields });
    });

    it('select: should return PoQueryBuilder', () => {
      spyOn(utilsFunctions, 'validateParameter');

      const result = poQueryBuilder.select('field');

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('sort: should call validateParameter with with `field` inside an object and set this._sort with sort param', () => {
      const field = 'field';
      poQueryBuilder['_sort'] = undefined;

      spyOn(utilsFunctions, 'validateParameter');

      poQueryBuilder.sort(field);

      expect(poQueryBuilder['_sort']).toBe(field);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ field });
    });

    it('sort: should return PoQueryBuilder', () => {
      const result = poQueryBuilder.sort('');

      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('where: should call filter with filter param', () => {
      const filter = jasmine.any(Object);
      spyOn(poQueryBuilder, 'filter');

      poQueryBuilder.where(filter);

      expect(poQueryBuilder.filter).toHaveBeenCalledWith(filter);
    });

    it('where: should return the value of this.filter(param)', () => {
      const filter = jasmine.any(Object);
      const returnFilter = jasmine.anything();

      spyOn(poQueryBuilder, 'filter').and.returnValue(<any>returnFilter);

      const result = poQueryBuilder.where(filter);

      expect(result).toEqual(returnFilter);
    });

    it('applyFields: should call groupFields with fields.split for white space', () => {
      poQueryBuilder['fields'] = 'field1 field2 field3';
      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([[], []]);

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['groupFields']).toHaveBeenCalledWith(['field1', 'field2', 'field3']);
    });

    it(`applyFields: should call removeFieldsData with selectedFields when selectedFields and
      restrictedFields is empty`, () => {
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([[], []]);
      spyOn(poQueryBuilder, <any>'removeFieldsData');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeFieldsData']).toHaveBeenCalledWith([], []);
    });

    it(`applyFields: should call removeFieldsData with selectedFields when selectedFields is filled and
      restrictedFields is empty`, () => {
      const selectedFields = ['field1', 'field2'];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([selectedFields, []]);
      spyOn(poQueryBuilder, <any>'removeFieldsData');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeFieldsData']).toHaveBeenCalledWith([], selectedFields);
    });

    it(`applyFields: should call removeFieldsData with selectedFields when selectedFields and restrictedFields is filled`, () => {
      const selectedFields = ['field1', 'field2'];
      const restrictedFields = ['field3', 'field4'];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([selectedFields, restrictedFields]);
      spyOn(poQueryBuilder, <any>'removeFieldsData');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeFieldsData']).toHaveBeenCalledWith([], selectedFields);
    });

    it(`applyFields: should call removeFieldsData with schemaFields when selectedFields is empty and
      restrictedFields is filled`, () => {
      const schemaFields = ['field1', 'field2'];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([[], ['field3', 'field4']]);
      spyOn(poQueryBuilder, <any>'removeFieldsData');

      poQueryBuilder['applyFields'](schemaFields, []);

      expect(poQueryBuilder['removeFieldsData']).toHaveBeenCalledWith([], schemaFields);
    });

    it(`applyFields: should call removeRestrictedFields with restrictedFields and selectedFields when restrictedFields
      is filled`, () => {
      const selectedFields = ['field1', 'field2'];
      const restrictedFields = ['field3', 'field4'];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([selectedFields, restrictedFields]);
      spyOn(poQueryBuilder, <any>'removeRestrictedFields');
      spyOn(poQueryBuilder, <any>'removeDuplicate');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeRestrictedFields']).toHaveBeenCalledWith(restrictedFields, selectedFields);
    });

    it(`applyFields: should call removeDuplicate with selectedFields`, () => {
      const selectedFields = ['field1', 'field2'];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([selectedFields, []]);
      spyOn(poQueryBuilder, <any>'removeDuplicate');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeDuplicate']).toHaveBeenCalledWith(selectedFields);
    });

    it(`applyFields: should not call removeRestrictedFields when restrictedFields is empty`, () => {
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([[], []]);
      spyOn(poQueryBuilder, <any>'removeRestrictedFields');

      poQueryBuilder['applyFields']([], []);

      expect(poQueryBuilder['removeRestrictedFields']).not.toHaveBeenCalled();
    });

    it(`applyFields: should call removeFieldsData with data and selectedFields`, () => {
      const selectedFields = ['field1', 'field2'];
      const data = [{ 1: 'data mock' }];
      poQueryBuilder['fields'] = 'field1 field2 field3';

      spyOn(poQueryBuilder, <any>'groupFields').and.returnValue([selectedFields, []]);
      spyOn(poQueryBuilder, <any>'removeFieldsData');

      poQueryBuilder['applyFields']([], data);

      expect(poQueryBuilder['removeFieldsData']).toHaveBeenCalledWith(data, selectedFields);
    });

    it('applyFilters: should return data with applied filter', () => {
      poQueryBuilder['filters'] = { '1': 'a', '2': 'b' };
      const filteredData = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
      const data = [filteredData, { '1': 'a' }, { '3': 'c' }, { '4': 'd' }, { '5': 'f' }, {}];

      const result = poQueryBuilder['applyFilters'](data);

      expect(result).toEqual([filteredData]);
    });

    it('groupFields: should return group by selectedFields and restrictedFields', () => {
      const selectedFields = ['field1', 'field2'];
      const restrictedFields = ['field3', 'field4'];
      const fields = ['field1', 'field2', '-field3', '-field4'];

      const result = poQueryBuilder['groupFields'](fields);

      expect(result).toEqual([selectedFields, restrictedFields]);
    });

    it('paginate: should return object with page 1 and hasNext true if _page is 1 and _pageSize is 2', () => {
      const page1 = [{ 1: 1 }, { 2: 2 }];
      const data = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, { 5: 5 }];
      const expectedResult = { hasNext: true, items: page1 };

      poQueryBuilder['_page'] = 1;
      poQueryBuilder['_pageSize'] = 2;

      const result = poQueryBuilder['paginate'](data);

      expect(result).toEqual(expectedResult);
    });

    it('paginate: should return object with data and hasNext false if _page is 1 and _pageSize is undefined', () => {
      const data = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, { 5: 5 }];
      const expectedResult = { hasNext: false, items: data };

      poQueryBuilder['_page'] = 1;
      poQueryBuilder['_pageSize'] = undefined;

      const result = poQueryBuilder['paginate'](data);

      expect(result).toEqual(expectedResult);
    });

    it('paginate: should return object with page 3 and hasNext false if _page is 3 and _pageSize is 2', () => {
      const page3 = [{ 5: 5 }];
      const data = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, { 5: 5 }];
      const expectedResult = { hasNext: false, items: page3 };

      poQueryBuilder['_page'] = 3;
      poQueryBuilder['_pageSize'] = 2;

      const result = poQueryBuilder['paginate'](data);

      expect(result).toEqual(expectedResult);
    });

    it('paginate: should return object with data empty and hasNext false if _page and _pageSize is undefined', () => {
      const data = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, { 5: 5 }];
      const expectedResult = { hasNext: false, items: [] };

      poQueryBuilder['_page'] = undefined;
      poQueryBuilder['_pageSize'] = undefined;

      const result = poQueryBuilder['paginate'](data);

      expect(result).toEqual(expectedResult);
    });

    it('order: should return data ordenate for field (ascending)', () => {
      const data = [
        { 'sortingField': 'd7' },
        { 'sortingField': 'a6' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'c4' },
        { 'sortingField': 'b1' }
      ];

      const dataSorted = [
        { 'sortingField': 'a6' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'c4' },
        { 'sortingField': 'd7' }
      ];

      const result = poQueryBuilder['order'](data, 'sortingField');

      expect(result).toEqual(dataSorted);
    });

    it('order: should return data ordenate for field (descending )', () => {
      const data = [
        { 'sortingField': 'd7' },
        { 'sortingField': 'a6' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'c4' },
        { 'sortingField': 'b1' }
      ];

      const dataSorted = [
        { 'sortingField': 'd7' },
        { 'sortingField': 'c4' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'b1' },
        { 'sortingField': 'a6' }
      ];

      const result = poQueryBuilder['order'](data, '-sortingField');

      expect(result).toEqual(dataSorted);
    });

    it('removeDuplicate: should return fields with non-duplicate fields', () => {
      const fields = ['field1', 'field2', 'field1', 'field3', 'field4', 'field1', 'field2'];
      const nonDuplicateFields = ['field1', 'field2', 'field3', 'field4'];

      const result = poQueryBuilder['removeDuplicate'](fields);

      expect(result).toEqual(nonDuplicateFields);
    });

    it('removeFieldsData: should return data with the chosen fields', () => {
      const data = [{ '1': 'value 1' }, { '2': 'value 2' }, { '3': 'value 3' }];
      const chosenFields = ['1', '2'];

      const result = poQueryBuilder['removeFieldsData'](data, chosenFields);

      expect(result).toEqual([{ '1': 'value 1' }, { '2': 'value 2' }, {}]);
    });

    it('removeRestrictedFields: should return fields without restrictedFields', () => {
      const fields = ['field1', '-field2', 'field3', '-field4'];
      const restrictedFields = ['-field2', '-field4'];

      const result = poQueryBuilder['removeRestrictedFields'](restrictedFields, fields);

      expect(result).toEqual(['field1', 'field3']);
    });

    it('removeRestrictedFields: should return fields when restrictedFields is empty', () => {
      const fields = ['field1', 'field2', 'field3', 'field4'];
      const restrictedFields = [];

      const result = poQueryBuilder['removeRestrictedFields'](restrictedFields, fields);

      expect(result).toEqual(fields);
    });
  });
});
