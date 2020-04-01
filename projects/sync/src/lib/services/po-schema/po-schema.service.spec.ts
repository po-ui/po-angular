import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoStorageService } from '@po-ui/ng-storage';

import { PoSchemaDefinitionService } from './po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './po-schema.service';
import { PoSchemaUtil } from './po-schema-util/po-schema-util.model';
import { PoSyncSchema } from './../po-sync/interfaces/po-sync-schema.interface';

@Injectable()
class PoStorageServiceMock extends PoStorageService {
  constructor() {
    super();
  }
}

@Injectable()
class PoSchemaDefinitionServiceMock extends PoSchemaDefinitionService {}

describe('PoSchemaService:', () => {
  let poSchemaService: PoSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoSchemaService,
        { provide: PoStorageService, useClass: PoStorageServiceMock },
        { provide: PoSchemaDefinitionService, useClass: PoSchemaDefinitionServiceMock }
      ]
    });

    poSchemaService = TestBed.inject(PoSchemaService);
  });

  it('should be created', () => {
    expect(poSchemaService instanceof PoSchemaService).toBeTruthy();
  });

  describe('Methods:', () => {
    let schema: PoSyncSchema;

    beforeAll(() => {
      schema = {
        getUrlApi: '',
        diffUrlApi: '',
        deletedField: 'deleted',
        fields: ['field1', 'field2', 'field3'],
        idField: 'id',
        name: 'schemaName',
        pageSize: 1
      };
    });

    it('getIdByRecordKey: should return id of schema key', () => {
      const id = '123';
      const schemaKey = `schemaKey:${id}`;

      expect(PoSchemaService['getIdByRecordKey'](schemaKey)).toBe(id);
    });

    it('getRecordKey: should return schema key', () => {
      const schemaKey = 'schemaName:1';

      expect(PoSchemaService['getRecordKey']('schemaName', '1')).toBe(schemaKey);
    });

    it('getRecordKey: should return schema local key', () => {
      const schemaKey = 'schemaName_local:1';
      const isLocal = true;

      expect(PoSchemaService['getRecordKey']('schemaName', '1', isLocal)).toBe(schemaKey);
    });

    it('isSchemaKey: should return true if data start with schema name', () => {
      const data = 'schemaName:1';

      expect(PoSchemaService['isSchemaKey'](data, 'schemaName')).toBeTruthy();
    });

    it('isSchemaKey: should return false if data not start with schema name', () => {
      const data = 'otherSchemaName:1';

      expect(PoSchemaService['isSchemaKey'](data, 'schemaName')).toBeFalsy();
    });

    it('isSchemaKey: should return false if doesn`t have data', () => {
      const data = undefined;

      expect(PoSchemaService['isSchemaKey'](data, 'schemaName')).toBeFalsy();
    });

    it('create: should call PoSchemaUtil.getRecordId and save with schema, record, id and return value of save', async () => {
      const id = 'id';
      const saveReturn = { field: 'save return' };
      const record = { field1: 'value1', id: id };

      spyOn(PoSchemaUtil, 'getRecordId').and.returnValue(record.id);
      spyOn(poSchemaService, <any>'save').and.returnValue(saveReturn);

      const result = await poSchemaService.create(schema, record);

      expect(poSchemaService['save']).toHaveBeenCalledWith(schema, record, id);
      expect(PoSchemaUtil.getRecordId).toHaveBeenCalledWith(record, schema);
      expect(result).toBe(saveReturn);
    });

    describe('destroySchemas:', () => {
      let schemas;
      let key1;
      let key2;
      let keys;
      let id;

      beforeEach(() => {
        schemas = [schema];
        key1 = 'key1';
        key2 = schema['name'];
        keys = [key1, key2];
        id = '123';
      });

      it('should call remove with schemas name and id and call getIdByRecordKey with key1', async () => {
        const returnIsSchemaKey = [false, true];
        const timesRemoveCalled = 1;

        spyOn(poSchemaService['poSchemaDefinitionService'], 'getAll').and.returnValue(schemas);
        spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(keys);
        spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValues(returnIsSchemaKey);
        spyOn(PoSchemaService, <any>'getIdByRecordKey').and.returnValue(id);
        spyOn(poSchemaService, 'remove');

        await poSchemaService.destroySchemasRecords();

        expect(PoSchemaService['getIdByRecordKey']).toHaveBeenCalledWith(key1);
        expect(poSchemaService.remove).toHaveBeenCalledTimes(timesRemoveCalled);
        expect(poSchemaService.remove).toHaveBeenCalledWith(schema.name, id);
      });

      it('should not call remove if keys not is the schema name', async () => {
        const returnIsSchemaKey = false;

        spyOn(poSchemaService['poSchemaDefinitionService'], 'getAll').and.returnValue(schemas);
        spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(keys);
        spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValues(returnIsSchemaKey);
        spyOn(PoSchemaService, <any>'getIdByRecordKey');
        spyOn(poSchemaService, 'remove');

        await poSchemaService.destroySchemasRecords();

        expect(PoSchemaService['getIdByRecordKey']).not.toHaveBeenCalled();
        expect(poSchemaService.remove).not.toHaveBeenCalled();
      });

      it('should call isSchemaKey twice times and with the parameters key1, key2 and schema.name', async () => {
        const returnIsSchemaKey = false;

        spyOn(poSchemaService['poSchemaDefinitionService'], 'getAll').and.returnValue(schemas);
        spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(keys);
        spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValue(returnIsSchemaKey);

        await poSchemaService.destroySchemasRecords();

        expect(PoSchemaService['isSchemaKey']).toHaveBeenCalledWith(key1, schema.name);
        expect(PoSchemaService['isSchemaKey']).toHaveBeenCalledWith(key2, schema.name);
        expect(PoSchemaService['isSchemaKey']).toHaveBeenCalledTimes(keys.length);
      });

      it('should call getSchemasDefinition and poStorage.keys', async () => {
        const returnIsSchemaKey = false;

        spyOn(poSchemaService['poSchemaDefinitionService'], 'getAll').and.returnValue(schemas);
        spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(keys);
        spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValue(returnIsSchemaKey);

        await poSchemaService.destroySchemasRecords();

        expect(poSchemaService['poSchemaDefinitionService'].getAll).toHaveBeenCalled();
        expect(poSchemaService['poStorage']['keys']).toHaveBeenCalled();
      });
    });

    describe('get:', () => {
      let schemaName;
      let id;
      let localRecord;
      let serverRecord;

      beforeEach(() => {
        schemaName = 'schemaName';
        id = 'id';
        localRecord = { localField: 'local value' };
        serverRecord = { serverField: 'server value' };
      });

      it('should call getRecord twice times', async () => {
        const isLocalRecord = true;

        spyOn(poSchemaService, <any>'getRecord').and.returnValue({});

        await poSchemaService.get(schemaName, id);

        expect(poSchemaService['getRecord']).toHaveBeenCalledWith(schemaName, id, isLocalRecord);
        expect(poSchemaService['getRecord']).toHaveBeenCalledWith(schemaName, id);
      });

      it('should return record with server and local fields', async () => {
        const record = { ...serverRecord, ...localRecord };

        spyOn(poSchemaService, <any>'getRecord').and.returnValues(localRecord, serverRecord);

        const result = await poSchemaService.get('schemaName', 'id');

        expect(result).toEqual(record);
      });
    });

    it('getAll: should call poStorage.keys', async () => {
      spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(<any>[]);

      await poSchemaService.getAll('schemaName');

      expect(poSchemaService['poStorage'].keys).toHaveBeenCalled();
    });

    it('getAll: should call get with schemaKey and ids and return records of schema', async () => {
      const ids = ['1', '2'];
      const keys = ['key1:id', 'schemaKey:1', 'key3:id', 'schemaKey2:2'];
      const records: any = [{ record1: 'value' }, { record2: 'value2' }];
      const isSchemaKeyReturn = [false, true, false, true];

      spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(<any>keys);
      spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValues(...isSchemaKeyReturn);
      spyOn(poSchemaService, 'get').and.returnValues(...records);

      const result = await poSchemaService.getAll('schemaKey');

      expect(poSchemaService.get).toHaveBeenCalledWith('schemaKey', ids[0]);
      expect(poSchemaService.get).toHaveBeenCalledWith('schemaKey', ids[1]);

      expect(result).toEqual(records);
    });

    it('getAll: should call isSchemaKey with keys and schema name', async () => {
      const keys = ['key1:id', 'schemaKey:1'];

      spyOn(poSchemaService['poStorage'], 'keys').and.returnValue(<any>keys);
      spyOn(PoSchemaService, <any>'isSchemaKey').and.returnValue(false);

      await poSchemaService.getAll('schemaKey');

      expect(PoSchemaService['isSchemaKey']).toHaveBeenCalledWith(keys[0], 'schemaKey');
      expect(PoSchemaService['isSchemaKey']).toHaveBeenCalledWith(keys[1], 'schemaKey');
    });

    it('limitedCallWrap: should call and return value of limitedCallWrap', async () => {
      const limitedCallWrapReturn = 'limitedCallWrap return';
      const limitedResource = jasmine.createSpy('resource');

      spyOn(poSchemaService['poStorage'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await poSchemaService['limitedCallWrap'](limitedResource);

      expect(poSchemaService['poStorage']['limitedCallWrap']).toHaveBeenCalledWith(limitedResource);
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('remove: should call getRecordKey with schema name, record id and isLocalKey', async () => {
      const schemaName = 'schemaName';
      const recordId = 'id';
      const isLocalKey = true;

      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValue('');
      spyOn(poSchemaService['poStorage'], 'remove');

      await poSchemaService.remove(schemaName, recordId);

      expect(PoSchemaService['getRecordKey']).toHaveBeenCalledWith(schemaName, recordId, isLocalKey);
      expect(PoSchemaService['getRecordKey']).toHaveBeenCalledWith(schemaName, recordId);
    });

    it('remove: should call poStorage.remove with schemaKey and localSchemaKey', async () => {
      const schemaName = 'schemaName';
      const schemaKey = 'schemaName:1';
      const localSchemaKey = 'schemaName_local:1';
      const recordId = 'id';

      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValues(schemaKey, localSchemaKey);
      spyOn(poSchemaService['poStorage'], 'remove');

      await poSchemaService.remove(schemaName, recordId);

      expect(poSchemaService['poStorage'].remove).toHaveBeenCalledWith(localSchemaKey);
      expect(poSchemaService['poStorage'].remove).toHaveBeenCalledWith(schemaKey);
    });

    it('update: should call getRecordId', async () => {
      const record = { field: 'value' };

      spyOn(PoSchemaUtil, 'getRecordId');

      await poSchemaService.update(schema, record);

      expect(PoSchemaUtil.getRecordId).toHaveBeenCalledWith(record, schema);
    });

    it('update: should call save with schema, record, id and return value of save', async () => {
      const record = { field: 'value' };
      const id = 'id';

      spyOn(PoSchemaUtil, 'getRecordId').and.returnValue(id);
      spyOn(poSchemaService, <any>'save').and.returnValue(record);

      const result = await poSchemaService.update(schema, record);

      expect(poSchemaService['save']).toHaveBeenCalledWith(schema, record, id);
      expect(result).toEqual(record);
    });

    it('update: should not call updateRecordId if recordId is undefined', async () => {
      const record = { field: 'value' };

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(poSchemaService, <any>'save');
      spyOn(poSchemaService, <any>'updateRecordId');

      await poSchemaService.update(schema, record);

      expect(poSchemaService['updateRecordId']).not.toHaveBeenCalled();
    });

    it(`update: should call updateRecordId if recordId is defined and call save with record equal the
      value returned`, async () => {
      const record = {};
      const updateRecordIdReturn = { value: 'updateRecordIdReturn' };
      const recordId = 'id';

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(poSchemaService, <any>'save');
      spyOn(poSchemaService, <any>'updateRecordId').and.returnValue(updateRecordIdReturn);

      await poSchemaService.update(schema, record, recordId);

      expect(poSchemaService['updateRecordId']).toHaveBeenCalledWith(schema.name, record, recordId);
      expect(poSchemaService['save']).toHaveBeenCalledWith(schema, updateRecordIdReturn, undefined);
    });

    it('updateAll: should call update with schema and values records and be called twice times', async () => {
      const records = [{ 'a': 'a' }, { 'b': 'b' }];

      spyOn(poSchemaService, 'update');

      await poSchemaService.updateAll(schema, records);

      expect(poSchemaService.update).toHaveBeenCalledTimes(2);
      expect(poSchemaService.update).toHaveBeenCalledWith(schema, records[0]);
      expect(poSchemaService.update).toHaveBeenCalledWith(schema, records[1]);
    });

    it('getRecord: should call getRecordKey with schemaName, id and isLocalKey', async () => {
      const recordLocalKey = 'key';
      const schemaName = 'schema name';
      const id = 'id';
      const isLocalKey = true;

      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValue(recordLocalKey);
      spyOn(poSchemaService['poStorage'], 'get');

      await poSchemaService['getRecord'](schemaName, id, isLocalKey);

      expect(PoSchemaService['getRecordKey']).toHaveBeenCalledWith(schemaName, id, isLocalKey);
    });

    it('getRecord: should call poStorage.get with local record key and return it value', async () => {
      const localRecordKey = 'key';
      const getReturn = { field: 'get return' };

      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValue(localRecordKey);
      spyOn(poSchemaService['poStorage'], 'get').and.returnValue(<any>getReturn);

      const result = await poSchemaService['getRecord']('schemaName', 'id');

      expect(poSchemaService['poStorage']['get']).toHaveBeenCalledWith(localRecordKey);
      expect(result).toBe(getReturn);
    });

    it('getRecord: should return a object empty if poStorage.get return undefined', async () => {
      spyOn(PoSchemaService, <any>'getRecordKey');
      spyOn(poSchemaService['poStorage'], 'get').and.returnValue(undefined);

      const result = await poSchemaService['getRecord']('schemaName', 'id');

      expect(result).toEqual({});
    });

    it('save: should call separateSchemaFields with schema and record', async () => {
      const record = { field: 'value' };

      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue({ serverRecord: {}, localRecord: {} });

      await poSchemaService['save'](schema, record, 'id');

      expect(PoSchemaUtil.separateSchemaFields).toHaveBeenCalledWith(schema, record);
    });

    it('save: should call getRecordKey with schema name and recordId', async () => {
      const record = { field: 'value' };

      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue({ serverRecord: {}, localRecord: {} });

      spyOn(PoSchemaService, <any>'getRecordKey');

      await poSchemaService['save'](schema, record, 'id');

      expect(PoSchemaService['getRecordKey']).toHaveBeenCalledWith(schema.name, 'id');
    });

    it(`save: should call poStorage.set with schemaKey name and serverRecord and
      call saveLocalFields with schema.name, localRecord and recordId`, async () => {
      const record = { field: 'value' };
      const schemaKey = 'schemaKey:id';
      const recordId = 'id';
      const localRecord = { localRecord: 'value' };
      const serverRecord = { serverRecord: 'value' };

      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue({ serverRecord, localRecord });
      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValue(schemaKey);

      spyOn(poSchemaService['poStorage'], 'set');
      spyOn(poSchemaService, <any>'saveLocalFields');

      await poSchemaService['save'](schema, record, recordId);

      expect(poSchemaService['poStorage']['set']).toHaveBeenCalledWith(schemaKey, serverRecord);
      expect(poSchemaService['saveLocalFields']).toHaveBeenCalledWith(schema.name, localRecord, recordId);
    });

    it('saveLocalFields: should not call getRecordKey and poStorage.set if localFields is empty ', async () => {
      const localFields = {};

      spyOn(poSchemaService['poStorage'], 'set');
      spyOn(PoSchemaService, <any>'getRecordKey');

      await poSchemaService['saveLocalFields']('schemaName', localFields, 'recordId');

      expect(poSchemaService['poStorage']['set']).not.toHaveBeenCalled();
      expect(PoSchemaService['getRecordKey']).not.toHaveBeenCalled();
    });

    it('saveLocalFields: should call getRecordKey and poStorage.set if localFields not is empty ', async () => {
      const localFields = { field1: 1, field2: 2 };
      const isLocalKey = true;
      const recordId = 'id';
      const schemaName = 'schemaName';
      const localSchemaKey = 'localSchemaKey';

      spyOn(PoSchemaService, <any>'getRecordKey').and.returnValue(localSchemaKey);
      spyOn(poSchemaService['poStorage'], 'set');

      await poSchemaService['saveLocalFields'](schemaName, localFields, recordId);

      expect(poSchemaService['poStorage']['set']).toHaveBeenCalledWith(localSchemaKey, localFields);
      expect(PoSchemaService['getRecordKey']).toHaveBeenCalledWith(schemaName, recordId, isLocalKey);
    });

    it('updateRecordId: should call getRecord and remove', async () => {
      const record = {};
      const recordId = 'id';
      const schemaName = schema.name;
      const isLocalRecord = true;

      spyOn(poSchemaService, <any>'getRecord');
      spyOn(poSchemaService, 'remove');

      await poSchemaService['updateRecordId'](schemaName, record, recordId);

      expect(poSchemaService.remove).toHaveBeenCalledWith(schemaName, recordId);
      expect(poSchemaService['getRecord']).toHaveBeenCalledWith(schemaName, recordId, isLocalRecord);
    });

    it('updateRecordId: should return merge localRecord with record', async () => {
      const record = { server: 'value' };
      const localRecord = { local: 'value' };
      const recordId = 'id';
      const schemaName = schema.name;
      const mergedRecord = Object.assign(record, localRecord);

      spyOn(poSchemaService, <any>'getRecord').and.returnValue(localRecord);
      spyOn(poSchemaService, 'remove');

      const result = await poSchemaService['updateRecordId'](schemaName, record, recordId);

      expect(result).toEqual(mergedRecord);
    });
  });
});
