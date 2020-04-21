import { PoStorageService } from '@po-ui/ng-storage';
import * as utilsFunctions from '../../utils/utils';

import { PoEntity } from './po-entity.model';
import { PoEventSourcingOperation, PoEventSourcingService } from './../../services/po-event-sourcing';
import { PoHttpClientService } from '../../services/po-http-client/po-http-client.service';
import { PoQueryBuilder } from './../po-query-builder/po-query-builder.model';
import { PoSchemaDefinitionService, PoSchemaService, PoSchemaUtil } from '../../services/po-schema/';
import { PoSyncSchema } from '../../services/po-sync/interfaces/po-sync-schema.interface';

describe('PoEntity:', () => {
  let poEntity: PoEntity;
  let poSyncSchemaMock: PoSyncSchema;

  beforeEach(() => {
    poSyncSchemaMock = {
      idField: 'code',
      getUrlApi: 'getUrlApi',
      diffUrlApi: 'diffUrlApi',
      name: 'Model name',
      fields: [],
      pageSize: 0,
      deletedField: 'deletedField'
    };

    const poStorageMock = new PoStorageService();
    const poSchemaDefinitionMock = new PoSchemaDefinitionService(poStorageMock);
    const poSchemaMock = new PoSchemaService(poSchemaDefinitionMock, poStorageMock);
    const httpClientMock = new PoHttpClientService(null);

    const poEventSourcingMock = new PoEventSourcingService(
      poSchemaDefinitionMock,
      poSchemaMock,
      poStorageMock,
      httpClientMock
    );

    poEntity = new PoEntity(poEventSourcingMock, poSyncSchemaMock, poSchemaMock);
  });

  it('should be created', () => {
    expect(poEntity instanceof PoEntity).toBeTruthy();
  });

  describe('Methods:', () => {
    it('find: should call select of PoQueryBuilder and return PoQueryBuilder object', () => {
      const fields = 'fields';
      spyOn(PoQueryBuilder.prototype, 'select');

      const result = poEntity.find(jasmine.any(Object), fields);

      expect(PoQueryBuilder.prototype.select).toHaveBeenCalledWith(fields);
      expect(result instanceof PoQueryBuilder).toBeTruthy();
    });

    it('find: should not call select of PoQueryBuilder if fields is undefined', () => {
      spyOn(PoQueryBuilder.prototype, 'select');

      poEntity.find(jasmine.any(Object));

      expect(PoQueryBuilder.prototype.select).not.toHaveBeenCalled();
    });

    it('find: should call filter of PoQueryBuilder when filter is defined', () => {
      const filter = jasmine.anything();
      spyOn(PoQueryBuilder.prototype, 'filter');

      poEntity.find(filter);

      expect(PoQueryBuilder.prototype.filter).toHaveBeenCalledWith(filter);
    });

    it('find: should not call filter of PoQueryBuilder when filter is undefined', () => {
      spyOn(PoQueryBuilder.prototype, 'filter');

      poEntity.find();

      expect(PoQueryBuilder.prototype.filter).not.toHaveBeenCalled();
    });

    it('findById: should call findOne with object { schema.idField: idValue } and return its value', () => {
      const fields = 'fields';
      const idMock = jasmine.anything();
      const returnFindOne = jasmine.any(Object);

      spyOn(poEntity, 'findOne').and.returnValue(<any>returnFindOne);

      const result = poEntity.findById(idMock, fields);

      expect(poEntity.findOne).toHaveBeenCalledWith({ code: idMock }, fields);
      expect(result).toEqual(returnFindOne);
    });

    it('findById: should call findOne with object { schema.idField: idValue } and fields undefined', () => {
      const idMock = jasmine.anything();
      spyOn(poEntity, 'findOne');

      poEntity.findById(idMock);

      expect(poEntity.findOne).toHaveBeenCalledWith({ code: idMock }, undefined);
    });

    it('findOne: should call find with filter and fields', () => {
      const queryBuilderMock = { limit: param => {} };
      const filter = jasmine.anything();
      const fields = 'fields';

      spyOn(poEntity, 'find').and.returnValue(<any>queryBuilderMock);
      spyOn(queryBuilderMock, 'limit');

      poEntity.findOne(filter, fields);

      expect(poEntity.find).toHaveBeenCalledWith(filter, fields);
      expect(queryBuilderMock.limit).toHaveBeenCalledWith(1);
    });

    it('findOne: should call find with filter and fields undefineds', () => {
      const queryBuilderMock = { limit: param => {} };

      spyOn(poEntity, 'find').and.returnValue(<any>queryBuilderMock);
      spyOn(queryBuilderMock, 'limit');

      poEntity.findOne();

      expect(poEntity.find).toHaveBeenCalledWith(undefined, undefined);
      expect(queryBuilderMock.limit).toHaveBeenCalledWith(1);
    });

    it('save: should call selectSaveType.bind, poSchemaService.limitedCallWrap and return its value', async () => {
      const modelMock = jasmine.anything();
      const customRequestId = 'id';
      const sendToEventSourcing = true;
      const limitedCallWrapReturn = 'limitedCallWrap return';

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);
      spyOn(poEntity['selectSaveType'], <never>'bind');

      const result = await poEntity.save(modelMock, customRequestId);

      expect(poEntity['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(poEntity['selectSaveType'].bind).toHaveBeenCalledWith(
        poEntity,
        modelMock,
        sendToEventSourcing,
        customRequestId
      );
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('save: should call validateParameter with `record` inside an object', async () => {
      const modelMock = jasmine.anything();

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap');
      spyOn(utilsFunctions, 'validateParameter');

      await poEntity.save(modelMock);

      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ record: modelMock });
    });

    it('saveAll: should call poSchemaService.limitedCallWrap and return its value', async () => {
      const limitedCallWrapReturn = 'limitedCallWrap return';

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await poEntity.saveAll([]);

      expect(poEntity['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('saveAll: should call validateParameter with `record` inside an object', async () => {
      const modelMock = [jasmine.anything()];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap');
      spyOn(utilsFunctions, 'validateParameter');

      await poEntity.saveAll(modelMock);

      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ records: modelMock });
    });

    it(`saveAll: should call isNonLocalRecordChanged and selectSaveType with correct parameters and
      call them records.length times`, async () => {
      const sendToEventSourcing = false;
      const records = [{ value: 1 }, { value: 2 }];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(poEntity['eventSourcing'], 'createBatchEvents');
      spyOn(poEntity, <any>'isNonLocalRecordChanged');
      spyOn(poEntity, <any>'selectSaveType');

      await poEntity['saveAll'](records);

      expect(poEntity['isNonLocalRecordChanged']).toHaveBeenCalledTimes(records.length);
      expect(poEntity['selectSaveType']).toHaveBeenCalledTimes(records.length);

      expect(poEntity['selectSaveType']).toHaveBeenCalledWith(records[0], sendToEventSourcing);
      expect(poEntity['isNonLocalRecordChanged']).toHaveBeenCalledWith(records[0]);

      expect(poEntity['selectSaveType']).toHaveBeenCalledWith(records[1], sendToEventSourcing);
      expect(poEntity['isNonLocalRecordChanged']).toHaveBeenCalledWith(records[1]);
    });

    it(`saveAll: should call createBatchEvents with batchEvents empty if isNonLocalRecordChanged is always false`, async () => {
      const batchEvents = [];
      const isNonLocalRecordChanged = false;

      const records = [{ value: 1 }, { value: 2 }];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(poEntity['eventSourcing'], 'createBatchEvents');
      spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(isNonLocalRecordChanged);
      spyOn(poEntity, <any>'selectSaveType');

      await poEntity['saveAll'](records);

      expect(poEntity['eventSourcing']['createBatchEvents']).toHaveBeenCalledWith(poEntity['schema'].name, batchEvents);
    });

    it(`saveAll: should call isNonLocalRecordChanged before selectSaveType`, async () => {
      const records = [{ value: 1 }];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(poEntity['eventSourcing'], 'createBatchEvents');
      spyOn(poEntity, <any>'isNonLocalRecordChanged');
      const selectSaveTypeSpy = spyOn(poEntity, <any>'selectSaveType');

      await poEntity['saveAll'](records);

      expect(poEntity['isNonLocalRecordChanged']).toHaveBeenCalledBefore(selectSaveTypeSpy);
    });

    it(`saveAll: should call createEventOperation with record, updatedRecord and customRequestId
      if isNonLocalRecordChanged is true and call createBatchEvents with batchEvents`, async () => {
      const batchEvents = [{ event: '1' }, { event2: '2' }];
      const isNonLocalRecordChanged = [true, false, true];
      const customRequestIds = ['id1', 'id2'];

      const records = [{ value1: 1 }, { value2: 2 }, { value3: 3 }];

      const updatedRecords = [{ updatedValue1: 1 }, { updatedValue2: 2 }, { updatedValue3: 3 }];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(poEntity['eventSourcing'], 'createBatchEvents');
      spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValues(...isNonLocalRecordChanged);
      spyOn(poEntity, <any>'selectSaveType').and.returnValues(...updatedRecords);
      spyOn(poEntity, <any>'createEventOperation').and.returnValues(...batchEvents);

      await poEntity['saveAll'](records, customRequestIds);

      expect(poEntity['eventSourcing']['createBatchEvents']).toHaveBeenCalledWith(
        poEntity['schema'].name,
        <any>batchEvents
      );
      expect(poEntity['createEventOperation']).toHaveBeenCalledWith(records[0], updatedRecords[0], customRequestIds[0]);
      expect(poEntity['createEventOperation']).toHaveBeenCalledWith(records[2], updatedRecords[2], customRequestIds[2]);
    });

    it(`saveAll: should call createEventOperation with record, updatedRecord and unique customRequestId`, async () => {
      const customRequestId = 'id';
      const isNonLocalRecordChanged = true;
      const records = [{ value: 1 }, { value: 2 }];

      const updatedRecords = [{ value: 1 }, { value: 2 }];

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(poEntity['eventSourcing'], 'createBatchEvents');
      spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(isNonLocalRecordChanged);
      spyOn(poEntity, <any>'selectSaveType').and.returnValues(...updatedRecords);
      spyOn(poEntity, <any>'createEventOperation');

      await poEntity['saveAll'](records, customRequestId);

      expect(poEntity['createEventOperation']).toHaveBeenCalledWith(records[0], updatedRecords[0], customRequestId);
      expect(poEntity['createEventOperation']).toHaveBeenCalledWith(records[1], updatedRecords[1], customRequestId);
    });

    it(`remove: should call eventSourcing.remove with customRequestId`, async () => {
      const modelMock = { id: jasmine.anything() };
      const customRequestId: string = '123';

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ 'serverRecord': modelMock });

      spyOn(poEntity['eventSourcing'], 'remove');

      await poEntity.remove(modelMock, customRequestId);

      expect(poEntity['eventSourcing']['remove']).toHaveBeenCalledWith(
        poSyncSchemaMock.name,
        modelMock,
        customRequestId
      );
    });

    it(`remove: should call separateSchemaFields with schema and record`, async () => {
      const record = {};

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord: '' });

      spyOn(poEntity['eventSourcing'], 'remove');

      await poEntity.remove(record);

      expect(PoSchemaUtil['separateSchemaFields']).toHaveBeenCalledWith(poSyncSchemaMock, record);
    });

    it(`remove: should call poSchemaService.remove with schema name and id`, async () => {
      const id = 123;
      const record = { [poSyncSchemaMock.idField]: id };

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord: '' });
      spyOn(poEntity['eventSourcing'], 'remove');

      spyOn(poEntity['poSchemaService'], 'remove');

      await poEntity.remove(record);

      expect(poEntity['poSchemaService']['remove']).toHaveBeenCalledWith(poSyncSchemaMock.name, id);
    });

    it(`remove: should call poSchemaService.remove with schema name and syncInternalIdFieldName`, async () => {
      const id = 123;
      const record = { [PoSchemaUtil.syncInternalIdFieldName]: id };

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord: '' });
      spyOn(poEntity['eventSourcing'], 'remove');

      spyOn(poEntity['poSchemaService'], 'remove');

      await poEntity.remove(record);

      expect(poEntity['poSchemaService']['remove']).toHaveBeenCalledWith(poSyncSchemaMock.name, id);
    });

    it('remove: should call poSchemaService.limitedCallWrap and return its value', async () => {
      const modelMock = jasmine.anything();
      const limitedCallWrapReturn = 'limitedCallWrap return';

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await poEntity.remove(modelMock);

      expect(poEntity['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('remove: should call validateParameter with `record` inside an object', async () => {
      const modelMock = jasmine.anything();

      spyOn(poEntity['poSchemaService'], 'limitedCallWrap');
      spyOn(utilsFunctions, 'validateParameter');

      await poEntity.remove(modelMock);

      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ record: modelMock });
    });

    it(`create: should call eventSourcing.create with schema name, new record and customRequestId
      if sendToEventSourcing is true`, async () => {
      const customRequestId: string = '123';
      const newRecord = { id: jasmine.anything() };
      const sendToEventSourcing = true;

      spyOn(Date.prototype, 'getTime').and.returnValue(12345);

      const time = new Date().getTime();

      const record = {
        ...newRecord,
        [PoSchemaUtil.syncInternalIdFieldName]: time,
        SyncInsertedDateTime: time,
        SyncUpdatedDateTime: null,
        SyncExclusionDateTime: null,
        SyncDeleted: false,
        SyncStatus: 0
      };

      spyOn(poEntity['poSchemaService'], 'create');
      spyOn(poEntity['eventSourcing'], 'create');

      await poEntity['create'](newRecord, sendToEventSourcing, customRequestId);

      expect(poEntity['eventSourcing']['create']).toHaveBeenCalledWith(poSyncSchemaMock.name, record, customRequestId);
    });

    it(`create: should not call eventSourcing.create if sendToEventSourcing is false`, async () => {
      const newRecord = { id: jasmine.anything() };
      const sendToEventSourcing = false;

      spyOn(poEntity['poSchemaService'], 'create');
      spyOn(poEntity['eventSourcing'], 'create');

      await poEntity['create'](newRecord, sendToEventSourcing);

      expect(poEntity['eventSourcing']['create']).not.toHaveBeenCalled();
    });

    it(`create: should call poSchemaService.create with schema and new record and return its value`, async () => {
      const newRecord = { id: jasmine.anything() };
      const createReturn = 'create return';
      const sendToEventSourcing = false;

      spyOn(Date.prototype, 'getTime').and.returnValue(12345);

      const time = new Date().getTime();

      const record = {
        ...newRecord,
        [PoSchemaUtil.syncInternalIdFieldName]: time,
        SyncInsertedDateTime: time,
        SyncUpdatedDateTime: null,
        SyncExclusionDateTime: null,
        SyncDeleted: false,
        SyncStatus: 0
      };

      spyOn(poEntity['poSchemaService'], 'create').and.returnValue(<any>createReturn);

      const result = await poEntity['create'](newRecord, sendToEventSourcing);

      expect(poEntity['poSchemaService']['create']).toHaveBeenCalledWith(poSyncSchemaMock, record);
      expect(result).toBe(createReturn);
    });

    it(`createEventOperation: should call PoSchemaUtil.getRecordId and PoSchemaUtil.separateSchemaFields`, () => {
      const record = { value: '1' };
      const updatedRecord = { value: '1 updated' };
      const customRequestId = 'id';
      const serverRecord = { field: 'server' };

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord });

      poEntity['createEventOperation'](record, updatedRecord, customRequestId);

      expect(PoSchemaUtil.getRecordId).toHaveBeenCalledWith(record, poEntity['schema']);
      expect(PoSchemaUtil.separateSchemaFields).toHaveBeenCalledWith(poEntity['schema'], updatedRecord);
    });

    it(`createEventOperation: should return poEventSourcingSummaryItem with PoEventSourcingOperation.Insert
      if the record does not have id`, () => {
      const record = { value: '1' };
      const updatedRecord = { value: '1 updated' };
      const customRequestId = 'id';
      const serverRecord = { field: 'server' };

      const poEventSourcingSummaryItem = {
        record: serverRecord,
        operation: PoEventSourcingOperation.Insert,
        customRequestId: customRequestId
      };

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord });

      const result = poEntity['createEventOperation'](record, updatedRecord, customRequestId);

      expect(result).toEqual(poEventSourcingSummaryItem);
    });

    it(`createEventOperation: should call PoSchemaUtil.getRecordId and PoSchemaUtil.separateSchemaFields
      if the record does not have id`, () => {
      const record = { value: '1' };
      const updatedRecord = { value: '1 updated' };
      const customRequestId = 'id';
      const serverRecord = { field: 'server' };

      const poEventSourcingSummaryItem = {
        record: serverRecord,
        operation: PoEventSourcingOperation.Update,
        customRequestId: customRequestId
      };

      spyOn(PoSchemaUtil, 'getRecordId').and.returnValue('recordId');
      spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>{ serverRecord });

      const result = poEntity['createEventOperation'](record, updatedRecord, customRequestId);

      expect(result).toEqual(poEventSourcingSummaryItem);
    });

    it(`isNonLocalRecordChanged: should call PoSchemaUtil.getNonLocalFieldNames, poSchemaService.get and PoSchemaUtil.isModelsEqual`, async () => {
      const record = {
        field1: 'value 1',
        field2: 'value 2'
      };

      const updatedRecord = {
        [poSyncSchemaMock.idField]: '123',
        field1: 'value 1',
        field2: 'value 2 updated'
      };

      const nonLocalFieldNames = ['field1', 'field2'];

      spyOn(PoSchemaUtil, 'getNonLocalFieldNames').and.returnValue(nonLocalFieldNames);
      spyOn(poEntity['poSchemaService'], 'get').and.returnValue(<any>record);
      spyOn(PoSchemaUtil, 'isModelsEqual');

      await poEntity['isNonLocalRecordChanged'](updatedRecord);

      expect(PoSchemaUtil.getNonLocalFieldNames).toHaveBeenCalledWith(poSyncSchemaMock);

      expect(poEntity['poSchemaService']['get']).toHaveBeenCalledWith(
        poSyncSchemaMock.name,
        updatedRecord[poSyncSchemaMock.idField]
      );

      expect(PoSchemaUtil.isModelsEqual).toHaveBeenCalledWith(nonLocalFieldNames, record, updatedRecord);
    });

    it('isNonLocalRecordChanged: should return true if PoSchemaUtil.isModelsEqual return false', async () => {
      const updatedRecord = {
        [poSyncSchemaMock.idField]: '123'
      };

      const isModelsEqual = false;

      spyOn(PoSchemaUtil, 'getNonLocalFieldNames');
      spyOn(poEntity['poSchemaService'], 'get');
      spyOn(PoSchemaUtil, 'isModelsEqual').and.returnValue(isModelsEqual);

      const result = await poEntity['isNonLocalRecordChanged'](updatedRecord);

      expect(result).toBeTruthy();
    });

    it('isNonLocalRecordChanged: should return false if PoSchemaUtil.isModelsEqual return true', async () => {
      const updatedRecord = {
        [poSyncSchemaMock.idField]: '123'
      };

      const isModelsEqual = true;

      spyOn(PoSchemaUtil, 'getNonLocalFieldNames');
      spyOn(poEntity['poSchemaService'], 'get');
      spyOn(PoSchemaUtil, 'isModelsEqual').and.returnValue(isModelsEqual);

      const result = await poEntity['isNonLocalRecordChanged'](updatedRecord);

      expect(result).toBeFalsy();
    });

    it('selectSaveType: should call create with customRequestId undefined if PoSchemaUtil.getRecordId not return id', async () => {
      const customRequestId = undefined;
      const sendToEventSourcing = true;
      const modelMock = jasmine.anything();

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(poEntity, <any>'create');

      await poEntity['selectSaveType'](modelMock, sendToEventSourcing);

      expect(poEntity['create']).toHaveBeenCalledWith(modelMock, sendToEventSourcing, customRequestId);
    });

    it('selectSaveType: should call create with customRequestId value if PoSchemaUtil.getRecordId not return id', async () => {
      const customRequestId: string = '123';
      const sendToEventSourcing = true;
      const modelMock = jasmine.anything();

      spyOn(PoSchemaUtil, 'getRecordId');
      spyOn(poEntity, <any>'create');

      await poEntity['selectSaveType'](modelMock, sendToEventSourcing, customRequestId);

      expect(poEntity['create']).toHaveBeenCalledWith(modelMock, sendToEventSourcing, customRequestId);
    });

    it('selectSaveType: should call update with id parameter if PoSchemaUtil.getRecordId return id', async () => {
      const modelMock = { id: jasmine.anything() };
      const sendToEventSourcing = true;
      const customRequestId = undefined;

      spyOn(PoSchemaUtil, 'getRecordId').and.returnValue('id');
      spyOn(poEntity, <any>'update');

      await poEntity['selectSaveType'](modelMock, sendToEventSourcing);

      expect(poEntity['update']).toHaveBeenCalledWith(modelMock, sendToEventSourcing, customRequestId);
    });

    describe('update:', () => {
      let time;
      let updatedRecord;
      let record;

      beforeEach(() => {
        time = '12345';
        updatedRecord = {
          [poSyncSchemaMock.idField]: '123',
          field1: 'value 1',
          field2: 'value 2 updated'
        };

        record = {
          ...updatedRecord,
          SyncUpdatedDateTime: time,
          SyncStatus: 0
        };

        spyOn(Date.prototype, 'getTime').and.returnValue(time);
      });

      it('should call isNonLocalRecordChanged and poSchemaService.update and return poSchemaService.update value', async () => {
        const updateReturn = { field: 'update return' };
        const sendToEventSourcing = false;

        spyOn(poEntity, <any>'isNonLocalRecordChanged');
        spyOn(poEntity['poSchemaService'], 'update').and.returnValue(<any>updateReturn);

        const result = await poEntity['update']({ ...updatedRecord }, sendToEventSourcing);

        expect(poEntity['isNonLocalRecordChanged']).toHaveBeenCalledWith(record);
        expect(poEntity['poSchemaService']['update']).toHaveBeenCalledWith(poSyncSchemaMock, record);

        expect(result).toBe(updateReturn);
      });

      it(`should not call separateSchemaFields and eventSourcing.update if isNonLocalRecordChanged and
        sendToEventSourcing is false`, async () => {
        const sendToEventSourcing = false;

        spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(false);
        spyOn(poEntity['poSchemaService'], 'update');

        spyOn(poEntity['eventSourcing'], 'update');
        spyOn(PoSchemaUtil, 'separateSchemaFields');

        await poEntity['update']({ ...updatedRecord }, sendToEventSourcing);

        expect(PoSchemaUtil.separateSchemaFields).not.toHaveBeenCalled();
        expect(poEntity['eventSourcing']['update']).not.toHaveBeenCalled();
      });

      it(`should not call separateSchemaFields and eventSourcing.update if isNonLocalRecordChanged is true and
        sendToEventSourcing is false`, async () => {
        const sendToEventSourcing = false;

        spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(true);
        spyOn(poEntity['poSchemaService'], 'update');

        spyOn(poEntity['eventSourcing'], 'update');
        spyOn(PoSchemaUtil, 'separateSchemaFields');

        await poEntity['update']({ ...updatedRecord }, sendToEventSourcing);

        expect(PoSchemaUtil.separateSchemaFields).not.toHaveBeenCalled();
        expect(poEntity['eventSourcing']['update']).not.toHaveBeenCalled();
      });

      it(`should not call separateSchemaFields and eventSourcing.update if isNonLocalRecordChanged is false and
        sendToEventSourcing is true`, async () => {
        const sendToEventSourcing = true;

        spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(false);
        spyOn(poEntity['poSchemaService'], 'update');

        spyOn(poEntity['eventSourcing'], 'update');
        spyOn(PoSchemaUtil, 'separateSchemaFields');

        await poEntity['update']({ ...updatedRecord }, sendToEventSourcing);

        expect(PoSchemaUtil.separateSchemaFields).not.toHaveBeenCalled();
        expect(poEntity['eventSourcing']['update']).not.toHaveBeenCalled();
      });

      it(`should call separateSchemaFields and eventSourcing.update if isNonLocalRecordChanged and sendToEventSourcing
        is true`, async () => {
        const sendToEventSourcing = true;
        const fields = { serverRecord: {} };
        const customRequestId = '123';

        spyOn(poEntity, <any>'isNonLocalRecordChanged').and.returnValue(true);
        spyOn(poEntity['poSchemaService'], 'update');

        spyOn(poEntity['eventSourcing'], 'update');
        spyOn(PoSchemaUtil, 'separateSchemaFields').and.returnValue(<any>fields);

        await poEntity['update']({ ...updatedRecord }, sendToEventSourcing, customRequestId);

        expect(PoSchemaUtil.separateSchemaFields).toHaveBeenCalledWith(poSyncSchemaMock, record);
        expect(poEntity['eventSourcing']['update']).toHaveBeenCalledWith(
          poSyncSchemaMock.name,
          fields['serverRecord'],
          customRequestId
        );
      });
    });
  });
});
