import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of, Subscriber } from 'rxjs';
import { PoStorageService } from '@po-ui/ng-storage';

import * as utilsFunctions from '../../utils/utils';

import { PoDataMessage, PoDataTransform } from '../../models';
import { PoEventSourcingErrorResponse } from '../../models/po-event-sourcing-error-response.model';
import { PoEventSourcingItem } from './interfaces/po-event-sourcing-item.interface';
import { PoEventSourcingOperation } from './enums/po-event-sourcing-operation.enum';
import { PoEventSourcingService } from './po-event-sourcing.service';
import { PoHttpClientService } from '../po-http-client/po-http-client.service';
import { PoHttpRequestData } from './../po-http-client/interfaces/po-http-request-data.interface';
import { PoHttpRequestType } from '../po-http-client/po-http-request-type.enum';
import { PoNetworkType } from './../../models/po-network-type.enum';
import { PoRequestType } from '../../models/po-request-type.enum';
import { PoSchemaDefinitionService } from './../po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './../po-schema/po-schema.service';
import { PoSchemaUtil } from './../po-schema/po-schema-util/po-schema-util.model';
import { PoSyncResponse } from '../po-sync/interfaces/po-sync-response.interface';
import { PoSyncSchema } from './../po-sync/interfaces/po-sync-schema.interface';

const EVENT_SOURCING_NAME: string = PoEventSourcingService['event_sourcing_name'];

@Injectable()
class StorageServiceMock extends PoStorageService {
  constructor() {
    super();
  }
}

@Injectable()
class PoDataTransformMock extends PoDataTransform {
  getDateFieldName(): string {
    return undefined;
  }
  getItemsFieldName(): string {
    return undefined;
  }
  getPageParamName(): string {
    return undefined;
  }
  getPageSizeParamName(): string {
    return undefined;
  }
  hasNext(): boolean {
    return undefined;
  }
}

describe('PoEventSourcingService:', () => {
  let eventSourcingService: PoEventSourcingService;
  let poHttpClientMock;
  let storageServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PoEventSourcingService,
        { provide: PoStorageService, useClass: StorageServiceMock },
        { provide: PoSchemaService, useClass: PoSchemaService },
        { provide: PoSchemaDefinitionService, useClass: PoSchemaDefinitionService },
        { provide: PoHttpClientService, useClass: PoHttpClientService }
      ]
    });

    eventSourcingService = TestBed.inject(PoEventSourcingService);
    storageServiceMock = TestBed.inject(PoStorageService);
    poHttpClientMock = TestBed.inject(PoHttpClientService);
  });

  it('should be created', () => {
    expect(eventSourcingService instanceof PoEventSourcingService).toBeTruthy();
  });

  describe('Methods:', () => {
    let schemaCustumerMock: PoSyncSchema;
    let schemaUserMock: PoSyncSchema;
    let eventSourcingItem: PoEventSourcingItem;
    let schemas;

    beforeEach(() => {
      schemaCustumerMock = {
        idField: 'id',
        getUrlApi: 'http://url/api/v1/customers',
        diffUrlApi: 'http://url/api/v1/customers/diff',
        deleteUrlApi: 'http://url/api/v1/customers',
        name: 'Customer',
        lastSync: '2018-08-03',
        deletedField: 'deleted',
        fields: ['id', 'name'],
        pageSize: 20
      };

      schemaUserMock = {
        idField: 'id',
        getUrlApi: 'http://url/api/v1/user',
        diffUrlApi: 'http://url/api/v1/user/diff',
        name: 'User',
        deletedField: 'deleted',
        fields: ['id', 'name'],
        pageSize: 10
      };

      eventSourcingItem = {
        dateTime: new Date().getTime(),
        id: new Date().getTime(),
        operation: PoEventSourcingOperation.Insert,
        record: { id: 1, name: 'Client name' },
        schema: schemaCustumerMock.name
      };

      schemas = [schemaCustumerMock, schemaUserMock];
    });

    it('create: should call createEventSourcingItem and insertEventSourcingQueue with the valid params', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));

      await eventSourcingService.create(schemaCustumerMock.name, item);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Insert,
        item,
        schemaCustumerMock.name,
        undefined
      );
      expect(eventSourcingService['insertEventSourcingQueue']).toHaveBeenCalledWith(eventSourcingItemMock);
    });

    it('create: should call createEventSourcingItem with customRequestId', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };
      const customRequestId: string = '123';

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);

      await eventSourcingService.create(schemaCustumerMock.name, item, customRequestId);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Insert,
        item,
        schemaCustumerMock.name,
        customRequestId
      );
    });

    it('createBatchEvents: should call `createEventSourcingList` according to received parameters', async () => {
      const summaryEventList = [
        { record: { customer: '1' }, operation: PoEventSourcingOperation.Insert, customRequestId: 'id' },
        { record: { customer: '2' }, operation: PoEventSourcingOperation.Update, customRequestId: 'id' }
      ];

      spyOn(eventSourcingService, <any>'createEventSourcingList');
      spyOn(storageServiceMock, 'appendArrayToArray');
      spyOn(eventSourcingService, <any>'notifyEventCreation');

      await eventSourcingService.createBatchEvents(schemaCustumerMock.name, summaryEventList);

      expect(eventSourcingService['createEventSourcingList']).toHaveBeenCalledWith(
        schemaCustumerMock.name,
        summaryEventList
      );
    });

    it(`createBatchEvents: should call 'appendArrayToArray' with 'EVENT_SOURCING_NAME' and with the return of
      'createEventSourcingList'`, async () => {
      const eventSourcingList = [
        { record: { value: '1' }, operation: PoEventSourcingOperation.Insert, customRequestId: 'id', date: 'date' },
        { record: { value: '2' }, operation: PoEventSourcingOperation.Update, customRequestId: 'id', date: 'date' }
      ];

      spyOn(eventSourcingService, <any>'createEventSourcingList').and.returnValue(eventSourcingList);
      spyOn(storageServiceMock, 'appendArrayToArray');
      spyOn(eventSourcingService, <any>'notifyEventCreation');

      await eventSourcingService.createBatchEvents(schemaCustumerMock.name, []);

      expect(storageServiceMock.appendArrayToArray).toHaveBeenCalledWith(EVENT_SOURCING_NAME, eventSourcingList);
    });

    it('createBatchEvents: should call `notifyEventCreation`', async () => {
      spyOn(eventSourcingService, <any>'createEventSourcingList');
      spyOn(storageServiceMock, 'appendArrayToArray');
      spyOn(eventSourcingService, <any>'notifyEventCreation');

      await eventSourcingService.createBatchEvents(schemaCustumerMock.name, []);

      expect(eventSourcingService['notifyEventCreation']).toHaveBeenCalled();
    });

    it('destroyEventSourcingQueue: should call poStorage.remove with event_sourcing_name', async () => {
      spyOn(eventSourcingService['poStorage'], 'remove');

      await eventSourcingService.destroyEventSourcingQueue();

      expect(eventSourcingService['poStorage'].remove).toHaveBeenCalledWith(EVENT_SOURCING_NAME);
    });

    it('httpCommand: should call createEventSourcingItem and insertEventSourcingQueue with the valid params', async () => {
      const httpOperationDataMock: PoHttpRequestData = { url: 'url-request', method: PoHttpRequestType.GET };
      const serializeResult = {
        url: 'url-request',
        method: 'GET',
        body: undefined,
        mimeType: undefined,
        bodyType: undefined,
        fileName: undefined
      };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));
      spyOn(eventSourcingService, <any>'serializeBody').and.returnValue(Promise.resolve(serializeResult));

      await eventSourcingService.httpCommand(httpOperationDataMock);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Http,
        serializeResult,
        undefined,
        undefined
      );

      expect(eventSourcingService['insertEventSourcingQueue']).toHaveBeenCalledWith(eventSourcingItemMock);
      expect(eventSourcingService['serializeBody']).toHaveBeenCalledWith(httpOperationDataMock);
    });

    it('httpCommand: should call createEventSourcingItem with customRequestId', async () => {
      const httpOperationDataMock: PoHttpRequestData = { url: 'url-request', method: PoHttpRequestType.GET };
      const serializeResult = {
        url: 'url-request',
        method: 'GET',
        body: undefined,
        mimeType: undefined,
        bodyType: undefined,
        fileName: undefined
      };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };
      const customRequestId: string = '123';

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));
      spyOn(eventSourcingService, <any>'serializeBody').and.returnValue(Promise.resolve(serializeResult));

      await eventSourcingService.httpCommand(httpOperationDataMock, customRequestId);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Http,
        serializeResult,
        undefined,
        customRequestId
      );
    });

    it('serializeBody: should return a string base64 if body is an instance of File', async () => {
      const file = new File([''], 'filename', { type: 'text/html' });
      const httpOperationDataMock: PoHttpRequestData = {
        url: 'url-request',
        method: PoHttpRequestType.GET,
        body: file
      };
      const newRequestData: PoHttpRequestData = {
        url: 'url-request',
        method: PoHttpRequestType.GET,
        body: 'data:',
        mimeType: 'text/html',
        bodyType: 'File',
        fileName: 'filename'
      };

      const result = await eventSourcingService['serializeBody'](httpOperationDataMock);

      expect(typeof result.body).toBe('string');
      expect(result).toEqual(newRequestData);
    });

    it('serializeBody: shouldn`t return a string base64 if body isn`t an instance of File', async () => {
      const body = {};
      const httpOperationDataMock: PoHttpRequestData = { url: 'url-request', method: PoHttpRequestType.GET, body };
      const newRequestData: PoHttpRequestData = {
        url: 'url-request',
        method: PoHttpRequestType.GET,
        body,
        mimeType: undefined,
        bodyType: undefined,
        fileName: undefined
      };

      const result = await eventSourcingService['serializeBody'](httpOperationDataMock);

      expect(typeof result.body).toBe('object');
      expect(result).toEqual(newRequestData);
    });

    it('onSaveData: should return eventSub and do not call Observable.create if eventSub is defined', done => {
      eventSourcingService['eventSub'] = of(null);
      spyOn(Observable, 'create');

      eventSourcingService.onSaveData().subscribe(saveDataResult => {
        expect(saveDataResult).toBeNull();
        expect(Observable.create).not.toHaveBeenCalled();
        done();
      });
    });

    it('onSaveData: emitter should be an instance of Subscriber', () => {
      eventSourcingService['emitter'] = null;

      eventSourcingService.onSaveData().subscribe(() => {});

      expect(eventSourcingService['emitter'] instanceof Subscriber).toBeTruthy();
    });

    it('remove: should call createEventSourcingItem with the valid params', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));

      await eventSourcingService.remove(schemaCustumerMock.name, item);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Delete,
        item,
        schemaCustumerMock.name,
        undefined
      );

      expect(eventSourcingService['insertEventSourcingQueue']).toHaveBeenCalledWith(eventSourcingItemMock);
    });

    it('remove: should call createEventSourcingItem with customRequestId', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };
      const customRequestId: string = '123';

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));

      await eventSourcingService.remove(schemaCustumerMock.name, item, customRequestId);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Delete,
        item,
        schemaCustumerMock.name,
        customRequestId
      );
    });

    it('removeEventSourcingItem: should call removeItemFromArray', async () => {
      const idEventSourcing = jasmine.any(Number);
      spyOn(storageServiceMock, 'removeItemFromArray');

      await eventSourcingService['removeEventSourcingItem'](idEventSourcing);

      expect(storageServiceMock.removeItemFromArray).toHaveBeenCalledWith(EVENT_SOURCING_NAME, 'id', idEventSourcing);
    });

    it('syncGet: should call poSchemaDefinition.getAll()', async () => {
      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(eventSourcingService, <any>'updateStorageSchemas').and.returnValue([]);
      spyOn(eventSourcingService['poSchemaDefinition'], 'getAll').and.returnValue(<any>Promise.resolve());

      await eventSourcingService.syncGet();

      expect(eventSourcingService['poSchemaDefinition']['getAll']).toHaveBeenCalled();
    });

    it('syncGet: should call updateStorageSchemas with schemaMock', async () => {
      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(eventSourcingService['poSchemaDefinition'], 'getAll').and.returnValue(Promise.resolve(schemas));
      spyOn(eventSourcingService, <any>'updateStorageSchemas').and.returnValue([]);

      await eventSourcingService.syncGet();
      expect(eventSourcingService['updateStorageSchemas']).toHaveBeenCalledWith(schemas);
    });

    it('syncGet: should return schemasPromises in syncGet', async () => {
      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());
      spyOn(eventSourcingService['poSchemaDefinition'], 'getAll').and.returnValue(Promise.resolve(schemas));

      spyOn(eventSourcingService, <any>'updateStorageSchemas').and.returnValue(schemas);

      const result = await eventSourcingService.syncGet();
      expect(result).toEqual(schemas);
    });

    it('syncGet: should call poSchemaService.limitedCallWrap and return its value', async () => {
      const limitedCallWrapReturn = 'limitedCallWrap return';

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await eventSourcingService.syncGet();

      expect(eventSourcingService['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('syncSend: should call poStorage.getFirstItem with EVENT_SOURCING_NAME', async () => {
      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(storageServiceMock, 'getFirstItem').and.returnValue(Promise.resolve());

      await eventSourcingService.syncSend();

      expect(storageServiceMock.getFirstItem).toHaveBeenCalledWith(EVENT_SOURCING_NAME);
    });

    it('syncSend: should call poSchemaService.limitedCallWrap and return its value', async () => {
      const limitedCallWrapReturn = 'limitedCallWrap return';

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await eventSourcingService.syncSend();

      expect(eventSourcingService['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('syncSend: should call selectOperation if itemOfQueue is defined', async () => {
      const fakeItem = { dateTime: 12, id: 1, operation: PoEventSourcingOperation.Delete, record: {} };

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(storageServiceMock, 'getFirstItem').and.returnValues(Promise.resolve(fakeItem), Promise.resolve(undefined));
      spyOn(eventSourcingService, <any>'selectOperation');

      await eventSourcingService.syncSend();

      expect(eventSourcingService['selectOperation']).toHaveBeenCalledWith(fakeItem);
    });

    it('syncSend: should not call selectOperation if itemOfQueue is falsy', async () => {
      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(storageServiceMock, 'getFirstItem').and.returnValues(Promise.resolve(undefined));

      spyOn(eventSourcingService, <any>'selectOperation');

      await eventSourcingService.syncSend();

      expect(eventSourcingService['selectOperation']).not.toHaveBeenCalled();
    });

    it('syncSend: should call getFirstItem 2 times if stoppedQueueEventSourcing is falsy and itemOfQueue is true', async () => {
      spyOn(eventSourcingService['poStorage'], 'getFirstItem').and.returnValues(<any>{ item: 'test' });
      spyOn(eventSourcingService, <any>'selectOperation');

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => {
        return callback();
      });

      eventSourcingService.stoppedQueueEventSourcing = false;

      await eventSourcingService.syncSend();

      expect(eventSourcingService['poStorage'].getFirstItem).toHaveBeenCalledTimes(2);
      expect(eventSourcingService.stoppedQueueEventSourcing).toBeFalsy();
    });

    it('syncSend: should call getFirstItem 1 time if stoppedQueueEventSourcing is true and itemOfQueue is falsy', async () => {
      spyOn(eventSourcingService['poStorage'], 'getFirstItem').and.returnValue(undefined);
      spyOn(eventSourcingService, <any>'selectOperation');

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => {
        return callback();
      });

      eventSourcingService.stoppedQueueEventSourcing = true;

      await eventSourcingService.syncSend();

      expect(eventSourcingService['poStorage'].getFirstItem).toHaveBeenCalledTimes(1);
      expect(eventSourcingService.stoppedQueueEventSourcing).toBeFalsy();
    });

    it('syncSend: should call getFirstItem 1 time if stoppedQueueEventSourcing and itemOfQueue is true', async () => {
      spyOn(eventSourcingService['poStorage'], 'getFirstItem').and.returnValues(<any>{ item: 'test' });
      spyOn(eventSourcingService, <any>'selectOperation');

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => {
        return callback();
      });

      eventSourcingService.stoppedQueueEventSourcing = true;

      await eventSourcingService.syncSend();

      expect(eventSourcingService['poStorage'].getFirstItem).toHaveBeenCalledTimes(1);
      expect(eventSourcingService.stoppedQueueEventSourcing).toBeFalsy();
    });

    it('syncSend: should call getFirstItem 1 time if stoppedQueueEventSourcing and itemOfQueue is falsy', async () => {
      spyOn(eventSourcingService['poStorage'], 'getFirstItem').and.returnValues(undefined);
      spyOn(eventSourcingService, <any>'selectOperation');

      spyOn(eventSourcingService['poSchemaService'], 'limitedCallWrap').and.callFake(callback => {
        return callback();
      });

      eventSourcingService.stoppedQueueEventSourcing = false;

      await eventSourcingService.syncSend();

      expect(eventSourcingService['poStorage'].getFirstItem).toHaveBeenCalledTimes(1);
      expect(eventSourcingService.stoppedQueueEventSourcing).toBeFalsy();
    });

    it('update: should call createEventSourcingItem with the valid params', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));

      await eventSourcingService.update(schemaCustumerMock.name, item);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Update,
        item,
        schemaCustumerMock.name,
        undefined
      );

      expect(eventSourcingService['insertEventSourcingQueue']).toHaveBeenCalledWith(eventSourcingItemMock);
    });

    it('update: should call createEventSourcingItem with customRequestId', async () => {
      const item = { customer: 'Customer name' };
      const eventSourcingItemMock = { value: 'PoEventSourcingItem' };
      const customRequestId: string = '123';

      spyOn(eventSourcingService, <any>'createEventSourcingItem').and.returnValue(eventSourcingItemMock);
      spyOn(eventSourcingService, <any>'insertEventSourcingQueue').and.returnValue(Promise.resolve(null));

      await eventSourcingService.update(schemaCustumerMock.name, item, customRequestId);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
        PoEventSourcingOperation.Update,
        item,
        schemaCustumerMock.name,
        customRequestId
      );
    });

    it('buildUrlParams: should return url with the pageSize and page params defined', () => {
      const base = 'http://fakeUrlPo.com';
      const page = 2;

      const fakeThis = {
        config: { dataTransform: { getPageSizeParamName: () => 'pageSize', getPageParamName: () => 'page' } }
      };

      const result = eventSourcingService['buildUrlParams'].call(fakeThis, schemaCustumerMock, base, page);

      expect(result).toBe('http://fakeUrlPo.com?pageSize=20&page=2');
    });

    it('checkRecordIdExists: should return throw with a PoEventSourcingErrorResponse if recordId is falsy', () => {
      const result = () => eventSourcingService['checkRecordIdExists'](undefined, PoEventSourcingOperation.Delete);

      const error = {
        message: 'Identifier not defined',
        operation: PoEventSourcingOperation.Delete
      };

      expect(result).toThrow(new PoEventSourcingErrorResponse(error));
    });

    it('checkRecordIdExists: should not return throw if recordId is defined', () => {
      const result = () =>
        eventSourcingService['checkRecordIdExists'](jasmine.anything(), PoEventSourcingOperation.Delete);

      expect(result).not.toThrow();
    });

    it('concatPageItems: should return the page current and the next concatenated', () => {
      eventSourcingService.config = {
        type: PoNetworkType.wifi,
        period: 10,
        dataTransform: new PoDataMessage()
      };

      const requestBody = {
        items: [
          { id: 3, item: 'test 3' },
          { id: 4, item: 'test 4' }
        ]
      };
      const pageData = [
        { id: 1, item: 'test 1' },
        { id: 2, item: 'test 2' }
      ];
      const pages = { entity: schemaCustumerMock.name, data: pageData };

      const result = eventSourcingService['concatPageItems'](pages, requestBody);

      expect(result.data).toEqual([...pageData, ...requestBody.items]);
    });

    it('concatPageItems: should not concatenate the page if request.body("items") is not found', () => {
      eventSourcingService.config = {
        type: PoNetworkType.wifi,
        period: 10,
        dataTransform: new PoDataMessage()
      };

      const pageData = [
        { id: 1, item: 'test 1' },
        { id: 2, item: 'test 2' }
      ];
      const pages = { entity: schemaCustumerMock.name, data: pageData };

      const result = eventSourcingService['concatPageItems'](pages, {});

      expect(result.data).toEqual(pageData);
    });

    describe('deleteOperation: ', () => {
      beforeEach(() => {
        eventSourcingItem.operation = PoEventSourcingOperation.Delete;
      });

      it('should call checkRecordIdExists with record id and PoEventSourcingOperation.Delete', async () => {
        const idField = schemaCustumerMock.idField;

        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'checkRecordIdExists');

        spyOn(eventSourcingService, <any>'sendServerItem');
        spyOn(eventSourcingService, <any>'sendResponseSubject');
        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['checkRecordIdExists']).toHaveBeenCalledWith(
          eventSourcingItem.record[idField],
          eventSourcingItem.operation
        );
      });

      it(`should call sendResponseSubject with Error if checkRecordIdExists return a throw`, async () => {
        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'checkRecordIdExists').and.throwError('Error');

        spyOn(eventSourcingService, <any>'sendResponseSubject');

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
          eventSourcingItem,
          <any>new Error('Error'),
          true
        );
      });

      it(`should call sendResponseSubject with new Error if sendServerItem return a error and not call removeEventSourcingValidItem`, async () => {
        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'sendServerItem').and.throwError('error');
        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');
        spyOn(eventSourcingService, <any>'sendResponseSubject').and.returnValue(Promise.resolve());

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
          eventSourcingItem,
          <any>new Error('error'),
          true
        );

        expect(eventSourcingService['removeEventSourcingValidItem']).not.toHaveBeenCalled();
      });

      it('should call sendResponseSubject without new Error if deleteOperation works correctly', async () => {
        const response = { status: 200 };

        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'sendServerItem').and.returnValue(response);
        spyOn(eventSourcingService, <any>'sendResponseSubject').and.returnValue(Promise.resolve());
        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(eventSourcingItem, <any>response);
      });

      it('should call removeEventSourcingValidItem with response.status and item', async () => {
        const response = { status: 200 };

        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'sendServerItem').and.returnValue(response);
        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['removeEventSourcingValidItem']).toHaveBeenCalledWith(
          response.status,
          eventSourcingItem
        );
      });

      it('should call sendServerItem in poStorage.getItemByField return ', async () => {
        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(eventSourcingService, <any>'sendServerItem').and.returnValue(Promise.resolve({ status: 200 }));

        await eventSourcingService['deleteOperation'](eventSourcingItem);

        expect(eventSourcingService['sendServerItem']).toHaveBeenCalledWith(
          schemaCustumerMock.getUrlApi + '/' + eventSourcingItem.record.id,
          PoHttpRequestType.DELETE
        );
      });
    });

    it('sendServerItem: should call poHttpClient.createRequest with poHttpRequestData', async () => {
      const poHttpRequestData: PoHttpRequestData = {
        url: 'http://url.com/customers',
        method: PoHttpRequestType.POST,
        body: { data: 'value' }
      };

      spyOn(eventSourcingService, <any>'createPoHttpRequestData').and.returnValue(Promise.resolve(poHttpRequestData));
      spyOn(eventSourcingService['poHttpClient'], 'createRequest').and.returnValue(<any>of({}));

      await eventSourcingService['sendServerItem'](
        poHttpRequestData.url,
        poHttpRequestData.method,
        poHttpRequestData.body
      );

      expect(eventSourcingService['poHttpClient']['createRequest']).toHaveBeenCalledWith(poHttpRequestData);
    });

    it('createPoHttpRequestData: should return newRequestData', async () => {
      const poHttpRequestData: PoHttpRequestData = {
        url: 'http://url.com/customers',
        method: PoHttpRequestType.POST,
        headers: [{ name: 'test', value: 'teste1' }],
        body: {}
      };

      spyOn(eventSourcingService, <any>'createFormData');

      const result = await eventSourcingService['createPoHttpRequestData'](
        poHttpRequestData.url,
        poHttpRequestData.method,
        poHttpRequestData,
        poHttpRequestData.headers
      );

      expect(result).toEqual(poHttpRequestData);
      expect(eventSourcingService['createFormData']).not.toHaveBeenCalled();
    });

    it('createPoHttpRequestData: should call createFormData if record.bodyType is `File`', async () => {
      const poHttpRequestData: PoHttpRequestData = {
        url: 'http://url.com/customers',
        method: PoHttpRequestType.POST,
        headers: [{ name: 'test', value: 'teste1' }],
        body: new File([''], 'filename', { type: 'text/html' }),
        bodyType: 'File'
      };

      const body = new FormData();

      const expectedValue: PoHttpRequestData = {
        url: 'http://url.com/customers',
        method: PoHttpRequestType.POST,
        headers: [{ name: 'test', value: 'teste1' }],
        body
      };

      spyOn(eventSourcingService, <any>'createFormData').and.returnValue(Promise.resolve(body));

      const result = await eventSourcingService['createPoHttpRequestData'](
        poHttpRequestData.url,
        poHttpRequestData.method,
        poHttpRequestData,
        poHttpRequestData.headers
      );

      expect(result).toEqual(expectedValue);
    });

    it('createFormData: should return a FormData', async () => {
      const file = new File([''], 'filename', { type: 'text/html' });
      const body = 'Data: ';
      const expectedValue: FormData = new FormData();
      expectedValue.append('file', file, 'fileName');

      spyOn(utilsFunctions, <any>'toFile').and.returnValue(Promise.resolve(file));

      const result = await eventSourcingService['createFormData'](body, 'filename', 'text/html');

      expect(result).toEqual(expectedValue);
    });

    it('createFormData: should return a FormData', async () => {
      const file = new File([''], 'filename', { type: 'text/html' });
      const body = 'Data: ';
      const expectedValue: FormData = new FormData();
      expectedValue.append('file_field', file, 'fileName');

      spyOn(utilsFunctions, <any>'toFile').and.returnValue(Promise.resolve(file));

      const result = await eventSourcingService['createFormData'](body, 'filename', 'text/html', 'file_field');

      expect(result).toEqual(expectedValue);
    });

    it('diffServerItems: should call poHttpClient.get with schemasSyncConfig.schemaName.currentUrlDiff', done => {
      const url = 'http://url/api/v1/customers/diff/2018-04-18T20:42:55.081Z?pageSize=20&page=2';

      spyOn(poHttpClientMock, 'get').and.returnValue(of({}));

      eventSourcingService['diffServerItems'](url).subscribe(() => {
        expect(poHttpClientMock.get).toHaveBeenCalledWith(url);
        done();
      });
    });

    describe('getBodyAndDate:', () => {
      it('should return response.body and set responseDate with "po_sync_date"', () => {
        const date = jasmine.any(Date);

        eventSourcingService.config = {
          type: PoNetworkType.none,
          period: 0,
          dataTransform: new PoDataTransformMock()
        };

        eventSourcingService.config.dataTransform.getDateFieldName = () => 'po_sync_date';
        eventSourcingService['createSchemaSyncConfig'](schemaCustumerMock.name);

        const response = {
          body: { 'po_sync_date': date }
        };

        expect(eventSourcingService['getBodyAndDate'](schemaCustumerMock.name, response)).toEqual(response.body);
        expect(eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['responseDate']).toBe(date);
      });
    });

    it(`getServerDiffRecords: should return value of pageReduce.data and call diffServerItems, getBodyAndDate,
    paginateSchemaData and concatPageItems`, async () => {
      const baseUrl = 'http://url/api/v1/customers/diff/2018-08-03';
      const responseDiffServer = { body: { id: 1, value: 'value response' } };
      const pageReduce = { entity: schemaCustumerMock.name, data: [responseDiffServer.body] };

      spyOn(eventSourcingService, <any>'diffServerItems').and.returnValue(of(responseDiffServer));
      spyOn(eventSourcingService, <any>'getBodyAndDate').and.returnValue(responseDiffServer);
      spyOn(eventSourcingService, <any>'paginateSchemaData').and.returnValue(of());
      spyOn(eventSourcingService, <any>'concatPageItems').and.returnValue(pageReduce);
      eventSourcingService['createSchemaSyncConfig'](schemaCustumerMock.name);

      const result = await eventSourcingService['getServerDiffRecords'](schemaCustumerMock, baseUrl);

      expect(eventSourcingService['diffServerItems']).toHaveBeenCalled();
      expect(eventSourcingService['getBodyAndDate']).toHaveBeenCalledWith(schemaCustumerMock.name, responseDiffServer);

      expect(eventSourcingService['paginateSchemaData']).toHaveBeenCalledWith(
        responseDiffServer,
        schemaCustumerMock,
        baseUrl
      );

      expect(eventSourcingService['concatPageItems']).toHaveBeenCalledWith(
        { entity: schemaCustumerMock.name, data: [] },
        responseDiffServer
      );

      expect(result).toBe(pageReduce.data);
    });

    describe('getUrl: ', () => {
      let defaultUrlApi;
      let paramsPoSyncSchema;

      beforeEach(() => {
        eventSourcingItem.operation = PoEventSourcingOperation.Delete;

        defaultUrlApi = `${schemaCustumerMock.getUrlApi}/${eventSourcingItem.record.id}`;

        paramsPoSyncSchema = {
          idField: 'id',
          getUrlApi: 'http://url/api/v1/customers',
          diffUrlApi: 'http://url/api/v1/customers/diff',
          deleteUrlApi: undefined,
          patchUrlApi: undefined,
          postUrlApi: undefined,
          name: 'Customer',
          deletedField: 'deleted',
          fields: ['id', 'name'],
          pageSize: 20
        };
      });

      it('should return getUrlApi', () => {
        paramsPoSyncSchema.deleteUrlApi = undefined;
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.GET);

        expect(result).toBe(paramsPoSyncSchema.getUrlApi);
      });

      it('should return undefined if request type is undefined', () => {
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, undefined);

        expect(result).toBeUndefined();
      });

      it('should return defaultUrlApi if postUrlApi is undefined', () => {
        paramsPoSyncSchema.postUrlApi = undefined;
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.POST);

        expect(result).toBe(paramsPoSyncSchema.getUrlApi);
      });

      it('should return postUrlApi if it is defined', () => {
        paramsPoSyncSchema.postUrlApi = 'http://url/api/v1/customers/post';
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.POST);

        expect(result).toBe(paramsPoSyncSchema.postUrlApi);
      });

      it('should return defaultUrlApi if patchUrlApi is undefined', () => {
        paramsPoSyncSchema.patchUrlApi = undefined;
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.PATCH);

        expect(result).toBe(defaultUrlApi);
      });

      it('should return patchUrlApi if it is defined', () => {
        paramsPoSyncSchema.patchUrlApi = 'http://url/api/v1/customers/patch';
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.PATCH);

        expect(result).toBe(paramsPoSyncSchema.patchUrlApi + '/' + eventSourcingItem.record.id);
      });

      it('should return defaultUrlApi if deleteUrlApi is undefined', () => {
        paramsPoSyncSchema.deleteUrlApi = undefined;
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.DELETE);

        expect(result).toBe(defaultUrlApi);
      });

      it('should return deleteUrlApi if it is defined', () => {
        paramsPoSyncSchema.deleteUrlApi = 'http://url/api/v1/customers/delete';
        const schemaCustumerMockUrl: PoSyncSchema = paramsPoSyncSchema;

        const result = PoEventSourcingService['getUrl'](eventSourcingItem, schemaCustumerMockUrl, PoRequestType.DELETE);

        expect(result).toBe(schemaCustumerMockUrl.deleteUrlApi + '/' + eventSourcingItem.record.id);
      });
    });

    it('httpOperation: should create httpOperation correctly', async () => {
      const httpOperationData: PoHttpRequestData = { url: 'http://url-test.com', method: PoHttpRequestType.GET };
      const requestData: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.GET,
        body: undefined,
        headers: undefined
      };
      const itemEvent: PoEventSourcingItem = {
        id: 123,
        operation: PoEventSourcingOperation.Http,
        record: httpOperationData,
        dateTime: 0
      };

      const response = new HttpResponse({ body: { data: 'value' }, status: 200 });
      const poHttpCommandResponse: PoSyncResponse = {
        id: 123,
        customRequestId: undefined,
        request: itemEvent.record,
        response: response
      };

      spyOn(poHttpClientMock, 'createRequest').and.returnValue(of(response));
      spyOn(eventSourcingService['responseSubject'], <any>'next');
      spyOn(eventSourcingService, <any>'removeEventSourcingValidItem').and.returnValue(Promise.resolve());
      spyOn(eventSourcingService, <any>'createPoHttpRequestData').and.returnValue(Promise.resolve(requestData));

      await eventSourcingService['httpOperation'](itemEvent);

      expect(poHttpClientMock.createRequest).toHaveBeenCalledWith(requestData);
      expect(eventSourcingService['responseSubject']['next']).toHaveBeenCalledWith(poHttpCommandResponse);
      expect(eventSourcingService['removeEventSourcingValidItem']).toHaveBeenCalledWith(response.status, itemEvent);
      expect(eventSourcingService['createPoHttpRequestData']).toHaveBeenCalledWith(
        itemEvent.record.url,
        itemEvent.record.method,
        itemEvent.record,
        itemEvent.record.headers
      );
    });

    it(`httpOperation: should call sendResponseSubject if createRequest return a error and not
    call removeEventSourcingValidItem`, async () => {
      const itemEvent: PoEventSourcingItem = {
        record: { url: 'http://url-test.com', method: PoHttpRequestType.GET },
        dateTime: new Date().getTime(),
        id: 0,
        operation: PoEventSourcingOperation.Http
      };

      spyOn(poHttpClientMock, 'createRequest').and.throwError('error');
      spyOn(eventSourcingService, <any>'sendResponseSubject').and.returnValue(Promise.resolve());
      spyOn(eventSourcingService['responseSubject'], <any>'next');
      spyOn(eventSourcingService, <any>'removeEventSourcingValidItem').and.returnValue(Promise.resolve());

      await eventSourcingService['httpOperation'](itemEvent);

      expect(eventSourcingService['responseSubject']['next']).not.toHaveBeenCalled();
      expect(eventSourcingService['removeEventSourcingValidItem']).not.toHaveBeenCalled();
      expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
        itemEvent,
        <any>new Error('error'),
        true
      );
    });

    describe('insertEventSourcingQueue:', () => {
      let itemEvent: PoEventSourcingItem;

      beforeEach(() => {
        itemEvent = {
          operation: PoEventSourcingOperation.Insert,
          record: { id: 1, value: 'New customer item' },
          id: 0,
          dateTime: 0
        };
      });

      it('should call storageServiceMock.appendItemToArray with the new item', () => {
        spyOn(storageServiceMock, 'appendItemToArray').and.returnValue(Promise.resolve());

        eventSourcingService['insertEventSourcingQueue'](itemEvent);

        expect(storageServiceMock.appendItemToArray).toHaveBeenCalledWith(EVENT_SOURCING_NAME, itemEvent);
      });

      it('should call `notifyEventCreation`', async () => {
        spyOn(eventSourcingService, <any>'notifyEventCreation');

        await eventSourcingService['insertEventSourcingQueue'](itemEvent);

        expect(eventSourcingService['notifyEventCreation']).toHaveBeenCalled();
      });

      it('should return the same value of the poStorage.appendItemToArray', async () => {
        const poEventItem: PoEventSourcingItem = {
          id: 123,
          operation: PoEventSourcingOperation.Insert,
          record: { value: 'test' },
          dateTime: 0
        };

        spyOn(storageServiceMock, 'appendItemToArray').and.returnValue(Promise.resolve([poEventItem]));

        const result = await eventSourcingService['insertEventSourcingQueue'](itemEvent);

        expect(result).toEqual([poEventItem]);
      });
    });

    describe('insertOperation:', () => {
      let eventSourcingItemMock;

      beforeEach(() => {
        eventSourcingItemMock = {
          dateTime: new Date().getTime(),
          id: new Date().getTime(),
          operation: PoEventSourcingOperation.Insert,
          record: { [PoSchemaUtil.syncInternalIdFieldName]: 1, name: 'Client name' },
          schema: schemaCustumerMock.name
        };
      });

      it('should call the methods correctly to insert new item', async () => {
        const url = 'http://fakeUrlPo.com';

        const schemaData = [
          { name: 'Customer name 1', [PoSchemaUtil.syncInternalIdFieldName]: '12345' },
          { name: 'Customer name 2', [PoSchemaUtil.syncInternalIdFieldName]: '6789' },
          { name: 'Customer name 3', [PoSchemaUtil.syncInternalIdFieldName]: '101112' }
        ];

        const eventSourcingItems = [
          { schema: 'Customer', record: schemaData[0] },
          { schema: 'Customer', record: schemaData[1] },
          { schema: 'Customer', record: schemaData[2] }
        ];

        const response = { status: 200, body: 'value' };

        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
        spyOn(PoEventSourcingService, <any>'getUrl').and.returnValue(url);
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService, <any>'sendServerItem').and.returnValue(response);
        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem').and.returnValue(Promise.resolve());
        spyOn(storageServiceMock, <any>'get').and.returnValue(eventSourcingItems);
        spyOn(eventSourcingService, <any>'updatePendingEventSourcing').and.returnValue(Promise.resolve());
        spyOn(eventSourcingService, <any>'sendResponseSubject').and.returnValue(Promise.resolve());

        await eventSourcingService['insertOperation'](eventSourcingItemMock);

        expect(eventSourcingService['poSchemaDefinition']['get']).toHaveBeenCalledWith(eventSourcingItemMock.schema);

        expect(PoEventSourcingService['getUrl']).toHaveBeenCalledWith(
          eventSourcingItemMock,
          schemaCustumerMock,
          PoRequestType.POST
        );

        expect(eventSourcingService['poSchemaService']['update']).toHaveBeenCalledWith(
          schemaCustumerMock,
          <any>response.body,
          eventSourcingItemMock.record[PoSchemaUtil.syncInternalIdFieldName]
        );

        expect(eventSourcingService['sendServerItem']).toHaveBeenCalledWith(
          url,
          PoHttpRequestType.POST,
          eventSourcingItemMock.record
        );

        expect(eventSourcingService['removeEventSourcingValidItem']).toHaveBeenCalledWith(
          response.status,
          eventSourcingItemMock
        );
        expect(storageServiceMock.get).toHaveBeenCalledWith(EVENT_SOURCING_NAME);

        expect(eventSourcingService['updatePendingEventSourcing']).toHaveBeenCalledWith(
          eventSourcingItemMock,
          schemaCustumerMock.idField,
          <any>'value',
          <any>eventSourcingItems
        );

        expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(eventSourcingItemMock, <any>response);
      });

      it(`should call sendResponseSubject if sendServerItem returns an error and does not call
        the methods that come after sendServerItem`, async () => {
        spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>'');
        spyOn(PoEventSourcingService, <any>'getUrl').and.returnValue('');
        spyOn(eventSourcingService, <any>'sendServerItem').and.throwError('error');

        spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');
        spyOn(storageServiceMock, <any>'get');
        spyOn(eventSourcingService, <any>'updatePendingEventSourcing');
        spyOn(eventSourcingService, <any>'sendResponseSubject');

        await eventSourcingService['insertOperation'](eventSourcingItemMock);

        expect(eventSourcingService['removeEventSourcingValidItem']).not.toHaveBeenCalled();
        expect(storageServiceMock.get).not.toHaveBeenCalled();

        expect(eventSourcingService['updatePendingEventSourcing']).not.toHaveBeenCalled();

        expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
          eventSourcingItemMock,
          <any>new Error('error'),
          true
        );
      });
    });

    it('notifyEventCreation: should call `emitter.next` if `emitter` is defined', () => {
      eventSourcingService['emitter'] = { next: () => {} };
      spyOn(eventSourcingService['emitter'], 'next');

      eventSourcingService['notifyEventCreation']();

      expect(eventSourcingService['emitter']['next']).toHaveBeenCalled();
    });

    describe('paginateSchemaData: ', () => {
      const baseUrl = 'http://url/api/v1/customers/diff/2018-04-18T20:42:55.081Z';
      const url = `${baseUrl}?pageSize=20&page=2`;

      let data;
      let date;
      let response;

      beforeEach(() => {
        eventSourcingService.config = {
          type: PoNetworkType.wifi,
          period: 10,
          dataTransform: new PoDataTransformMock()
        };

        data = { id: 1, customer: 'Test' };
        date = new Date().getTime();

        response = {
          body: 'value',
          headers: {
            get: param => {
              if (param === 'Date') {
                return date;
              }
            }
          }
        };
      });

      it('should call config.data Transform.transform with correctly param (register)', async () => {
        spyOn(eventSourcingService.config.dataTransform, 'transform');
        spyOn(eventSourcingService, <any>'diffServerItems').and.returnValue(of(response));
        spyOn(eventSourcingService, <any>'getBodyAndDate').and.returnValue(response.body);

        await eventSourcingService['paginateSchemaData'](data, schemaCustumerMock, baseUrl).toPromise();

        expect(eventSourcingService.config.dataTransform.transform).toHaveBeenCalledWith(data);
      });

      it('should set schemasSyncConfig.schemaName.currentUrlDiff and call diffServerItems if hasNext is true', async () => {
        const schemaName = schemaCustumerMock.name;
        eventSourcingService['createSchemaSyncConfig'](schemaName);

        eventSourcingService.config.dataTransform.hasNext = () => true;
        eventSourcingService.config.dataTransform.getPageSizeParamName = () => 'pageSize';
        eventSourcingService.config.dataTransform.getPageParamName = () => 'page';
        eventSourcingService['schemasSyncConfig'][schemaName]['currentUrlDiff'] = undefined;
        eventSourcingService['schemasSyncConfig'][schemaName]['page'] = 1;

        spyOn(eventSourcingService, <any>'diffServerItems').and.returnValue(of(response));
        spyOn(eventSourcingService, <any>'getBodyAndDate').and.returnValue(response.body);

        await eventSourcingService['paginateSchemaData'](data, schemaCustumerMock, baseUrl).toPromise();

        expect(eventSourcingService['schemasSyncConfig'][schemaName]['currentUrlDiff']).toBe(url);
        expect(eventSourcingService['diffServerItems']).toHaveBeenCalled();
      });

      it('should not set schemasSyncConfig.schemaName.currentUrlDiff and do not call diffServerItems if hasNext is falsy', async () => {
        eventSourcingService['createSchemaSyncConfig'](schemaCustumerMock.name);
        eventSourcingService.config.dataTransform.hasNext = () => false;
        eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['currentUrlDiff'] = undefined;

        spyOn(eventSourcingService, <any>'diffServerItems');

        await eventSourcingService['paginateSchemaData'](data, schemaCustumerMock, baseUrl).toPromise();

        expect(eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['currentUrlDiff']).toBeUndefined();
        expect(eventSourcingService['diffServerItems']).not.toHaveBeenCalled();
      });
    });

    it('removeEventSourcingValidItem: should call removeEventSourcingItem if status is 200 and isValidStatus is true', async () => {
      spyOn(eventSourcingService, 'removeEventSourcingItem');
      spyOn(eventSourcingService, <any>'isValidStatus').and.returnValue(true);

      await eventSourcingService['removeEventSourcingValidItem'](200, eventSourcingItem);

      expect(eventSourcingService.removeEventSourcingItem).toHaveBeenCalledWith(eventSourcingItem.id);
    });

    it(`removeEventSourcingValidItem: should call removeEventSourcingItem if status different of 200 and isValidStatus
      is false`, async () => {
      spyOn(eventSourcingService, 'removeEventSourcingItem');
      spyOn(eventSourcingService, <any>'isValidStatus').and.returnValue(false);

      await eventSourcingService['removeEventSourcingValidItem'](404, eventSourcingItem);

      expect(eventSourcingService.removeEventSourcingItem).not.toHaveBeenCalled();
    });

    it('removeEventSourcingValidItem: should call removeEventSourcingItem if operation equal HTTP_OPERATION and isValidStatus is false', async () => {
      const eventSourcingItemMock: PoEventSourcingItem = {
        dateTime: new Date().getTime(),
        id: new Date().getTime(),
        operation: PoEventSourcingOperation.Http,
        record: { id: 1, name: 'Client name' },
        schema: schemaCustumerMock.name
      };

      spyOn(eventSourcingService, 'removeEventSourcingItem');
      spyOn(eventSourcingService, <any>'isValidStatus').and.returnValue(false);

      await eventSourcingService['removeEventSourcingValidItem'](404, eventSourcingItemMock);

      expect(eventSourcingService.removeEventSourcingItem).toHaveBeenCalled();
    });

    it('httpCommandResponses: should returns a valid Observable', () => {
      const obs: Observable<PoSyncResponse> = eventSourcingService.responsesSubject();
      expect(obs instanceof Observable).toBeTruthy();
    });

    describe('createEventSourcingItem: ', () => {
      const baseTime = new Date(2018, 9, 23);
      jasmine.clock().mockDate(baseTime);

      let newItem;
      let itemEvent: PoEventSourcingItem;

      beforeEach(() => {
        newItem = { id: 1, value: 'New customer item' };

        itemEvent = {
          id: new Date().getTime() + 1,
          dateTime: new Date().getTime() + 1,
          schema: schemaCustumerMock.name,
          operation: PoEventSourcingOperation.Insert,
          record: newItem,
          customRequestId: undefined
        };
      });

      it('should return eventSourcingItem equal the `itemEvent`', () => {
        const result = eventSourcingService['createEventSourcingItem'](
          PoEventSourcingOperation.Insert,
          newItem,
          schemaCustumerMock.name
        );

        const itemEventResult = Object.assign({}, itemEvent);
        delete itemEventResult.id;
        delete itemEventResult.dateTime;

        expect(result).toEqual(jasmine.objectContaining(itemEventResult));
      });

      it('should return eventSourcingItem equal the `itemEvent`', () => {
        const customRequestId: string = '123';
        const result = eventSourcingService['createEventSourcingItem'](
          PoEventSourcingOperation.Insert,
          newItem,
          schemaCustumerMock.name,
          customRequestId
        );

        expect(result.customRequestId).toEqual(customRequestId);
      });

      it('should return throw Error if schema is undefined and operation is different from HTTP_OPERATION', () => {
        const result = () => eventSourcingService['createEventSourcingItem'](PoEventSourcingOperation.Insert, newItem);

        expect(result).toThrowError(Error, 'PoSyncSchema is not defined.');
      });

      it('should return the object with the `id` passed by parameter', () => {
        const customRequestId = 'sync';
        const id = 2;
        const result = eventSourcingService['createEventSourcingItem'](
          PoEventSourcingOperation.Insert,
          newItem,
          schemaCustumerMock.name,
          customRequestId,
          id
        );

        const itemEventResult = {
          id: id,
          schema: schemaCustumerMock.name,
          operation: PoEventSourcingOperation.Insert,
          record: newItem,
          customRequestId: customRequestId
        };

        expect(result).toEqual(jasmine.objectContaining(itemEventResult));
      });
    });

    it(`createEventSourcingList: should call 'createEventSourcingItem' according to quantity of items
      of summaryEventList`, () => {
      const summaryEventList = [
        { record: { customer: '1' }, operation: PoEventSourcingOperation.Insert, customRequestId: 'id' },
        { record: { customer: '2' }, operation: PoEventSourcingOperation.Update, customRequestId: 'id' }
      ];

      spyOn(eventSourcingService, <any>'createEventSourcingItem');

      eventSourcingService['createEventSourcingList'](schemaCustumerMock.name, summaryEventList);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledTimes(summaryEventList.length);
    });

    it(`createEventSourcingList: should call 'createEventSourcingItem' with the corrects ids`, () => {
      const dateTime = 12;

      const summaryEventList = [
        { record: { customer: '1' }, operation: PoEventSourcingOperation.Insert, customRequestId: 'id' },
        { record: { customer: '2' }, operation: PoEventSourcingOperation.Update, customRequestId: 'id' }
      ];

      spyOn(eventSourcingService, <any>'createEventSourcingItem');
      spyOn(Date.prototype, 'getTime').and.returnValue(<any>dateTime);

      eventSourcingService['createEventSourcingList'](schemaCustumerMock.name, summaryEventList);

      summaryEventList.forEach((eventSummary, index) => {
        expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledWith(
          eventSummary.operation,
          eventSummary.record,
          schemaCustumerMock.name,
          eventSummary.customRequestId,
          dateTime + index
        );
      });
    });

    it(`createEventSourcingList: should call 'createEventSourcingItem' according to quantity of items
      and customRequestId is string`, () => {
      const summaryEventList = [
        { record: { customer: '1' }, operation: PoEventSourcingOperation.Insert, customRequestId: 'id' },
        { record: { customer: '2' }, operation: PoEventSourcingOperation.Update, customRequestId: 'id' }
      ];

      spyOn(eventSourcingService, <any>'createEventSourcingItem');

      eventSourcingService['createEventSourcingList'](schemaCustumerMock.name, summaryEventList);

      expect(eventSourcingService['createEventSourcingItem']).toHaveBeenCalledTimes(summaryEventList.length);
    });

    it(`createSchemaSyncConfig: should create schemasSyncConfig["schema"] with page, currentUrlDiff and responseDate with
      undefined value`, () => {
      eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name] = undefined;

      eventSourcingService['createSchemaSyncConfig'](schemaCustumerMock.name);

      expect(eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]).toEqual({
        page: undefined,
        currentUrlDiff: undefined,
        responseDate: undefined
      });
    });

    describe('selectOperation: ', () => {
      let itemQueue: PoEventSourcingItem;

      beforeEach(() => {
        itemQueue = {
          dateTime: new Date().getTime(),
          id: new Date().getTime(),
          operation: undefined,
          record: { value: 'record' },
          schema: undefined
        };
      });

      it('should call insertOperation if item.operation is INSERT_OPERATION', async () => {
        itemQueue.operation = PoEventSourcingOperation.Insert;
        spyOn(eventSourcingService, <any>'insertOperation');

        await eventSourcingService['selectOperation'](itemQueue);
        expect(eventSourcingService['insertOperation']).toHaveBeenCalledWith(itemQueue);
      });

      it('should call updateOperation if item.operation is UPDATE_OPERATION', async () => {
        itemQueue.operation = PoEventSourcingOperation.Update;
        spyOn(eventSourcingService, <any>'updateOperation');

        await eventSourcingService['selectOperation'](itemQueue);
        expect(eventSourcingService['updateOperation']).toHaveBeenCalledWith(itemQueue);
      });

      it('should call httpOperation if item.operation is HTTP_OPERATION', async () => {
        itemQueue.operation = PoEventSourcingOperation.Http;
        spyOn(eventSourcingService, <any>'httpOperation');

        await eventSourcingService['selectOperation'](itemQueue);
        expect(eventSourcingService['httpOperation']).toHaveBeenCalledWith(itemQueue);
      });

      it('should call deleteOperation if item.operation is DELETE_OPERATION', async () => {
        itemQueue.operation = PoEventSourcingOperation.Delete;
        spyOn(eventSourcingService, <any>'deleteOperation');

        await eventSourcingService['selectOperation'](itemQueue);
        expect(eventSourcingService['deleteOperation']).toHaveBeenCalledWith(itemQueue);
      });
    });

    describe('sendResponseSubject: ', () => {
      let response: HttpResponse<any>;
      let responseNext: PoSyncResponse;

      beforeEach(() => {
        response = new HttpResponse();
        responseNext = {
          id: eventSourcingItem.id,
          customRequestId: undefined,
          request: eventSourcingItem.record,
          response: response
        };
      });

      it(`sendResponseSubject: should set stoppedQueueEventSourcing with falsy and call responseSubject.next correctly`, async () => {
        eventSourcingService['stoppedQueueEventSourcing'] = true;

        spyOn(eventSourcingService['responseSubject'], <any>'next');

        await eventSourcingService['sendResponseSubject'](eventSourcingItem, response);

        expect(eventSourcingService['stoppedQueueEventSourcing']).toBeFalsy();
        expect(eventSourcingService['responseSubject']['next']).toHaveBeenCalledWith(responseNext);
      });

      it(`sendResponseSubject: should set stoppedQueueEventSourcing with true and call responseSubject.next correctly`, async () => {
        eventSourcingService['stoppedQueueEventSourcing'] = false;

        spyOn(eventSourcingService['responseSubject'], <any>'next');

        await eventSourcingService['sendResponseSubject'](eventSourcingItem, response, true);

        expect(eventSourcingService['stoppedQueueEventSourcing']).toBeTruthy();
        expect(eventSourcingService['responseSubject']['next']).toHaveBeenCalledWith(responseNext);
      });
    });

    it('updateOperation: should call checkRecordIdExists with record id and PoEventSourcingOperation.Update', async () => {
      const idField = schemaCustumerMock.idField;

      spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
      spyOn(eventSourcingService, <any>'checkRecordIdExists');

      spyOn(eventSourcingService, <any>'sendServerItem');
      spyOn(eventSourcingService, <any>'sendResponseSubject');
      spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');

      await eventSourcingService['updateOperation'](eventSourcingItem);

      expect(eventSourcingService['checkRecordIdExists']).toHaveBeenCalledWith(
        eventSourcingItem.record[idField],
        PoEventSourcingOperation.Update
      );
    });

    it(`updateOperation: should call sendResponseSubject with Error if checkRecordIdExists return a
      throw`, async () => {
      spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>'');
      spyOn(PoEventSourcingService, <any>['getUrl']);
      spyOn(eventSourcingService, <any>'checkRecordIdExists').and.throwError('Error');

      spyOn(eventSourcingService, <any>'sendResponseSubject');

      await eventSourcingService['updateOperation'](eventSourcingItem);

      expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
        eventSourcingItem,
        <any>new Error('Error'),
        true
      );
    });

    it(`updateOperation: should call poSchemaDefinition.get, sendServerItem, sendResponseSubject, removeEventSourcingValidItem
      and updateStorage`, async () => {
      const response = { status: 200 };

      spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>schemaCustumerMock);
      spyOn(eventSourcingService, <any>'sendServerItem').and.returnValue(Promise.resolve(response));
      spyOn(eventSourcingService, <any>'removeEventSourcingValidItem').and.returnValue(Promise.resolve());
      spyOn(eventSourcingService, <any>'sendResponseSubject').and.returnValue(Promise.resolve([]));

      await eventSourcingService['updateOperation'](eventSourcingItem);

      expect(eventSourcingService['poSchemaDefinition']['get']).toHaveBeenCalledWith(eventSourcingItem.schema);

      expect(eventSourcingService['sendServerItem']).toHaveBeenCalledWith(
        schemaCustumerMock.getUrlApi + '/' + eventSourcingItem.record.id,
        PoHttpRequestType.PUT,
        eventSourcingItem.record
      );

      expect(eventSourcingService['removeEventSourcingValidItem']).toHaveBeenCalledWith(200, eventSourcingItem);

      expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(eventSourcingItem, <any>response);
    });

    it(`updateOperation: should call sendResponseSubject with error if sendServerItem return a error
    and does not call removeEventSourcingValidItem`, async () => {
      spyOn(eventSourcingService['poSchemaDefinition'], 'get').and.returnValue(<any>'');
      spyOn(PoEventSourcingService, <any>'getUrl').and.returnValue('');
      spyOn(eventSourcingService, <any>'checkRecordIdExists');
      spyOn(eventSourcingService, <any>'sendServerItem').and.throwError('error');

      spyOn(eventSourcingService, <any>'removeEventSourcingValidItem');
      spyOn(eventSourcingService, <any>'sendResponseSubject');

      await eventSourcingService['updateOperation'](eventSourcingItem);

      expect(eventSourcingService['removeEventSourcingValidItem']).not.toHaveBeenCalled();
      expect(eventSourcingService['sendResponseSubject']).toHaveBeenCalledWith(
        eventSourcingItem,
        <any>new Error('error'),
        true
      );
    });

    it(`updatePendingEventSourcing: should not call storageServiceMock.set if
    currentEventSourcingItem.record.SyncInternalId is falsy`, async () => {
      const currentEventSourcingItem: PoEventSourcingItem = {
        id: 1,
        dateTime: 12,
        operation: PoEventSourcingOperation.Insert,
        record: { SyncInternalId: undefined }
      };
      spyOn(storageServiceMock, 'set');

      await eventSourcingService['updatePendingEventSourcing'](
        currentEventSourcingItem,
        undefined,
        undefined,
        undefined
      );

      expect(storageServiceMock.set).not.toHaveBeenCalled();
    });

    it(`updatePendingEventSourcing: should call storageServiceMock.set if eventSourcingItems updated`, async () => {
      const idFieldSchema = 'id';
      const idInserted = 'ABC';
      const schemaData = { name: 'Customer name 2', SyncInternalId: '12345' };
      const currentEventSourcingItem: PoEventSourcingItem = {
        id: 1,
        dateTime: 12,
        operation: PoEventSourcingOperation.Insert,
        record: { SyncInternalId: '12345' }
      };
      const inserted = Object.assign(schemaData, { id: idInserted });
      const eventSourcingItems: Array<PoEventSourcingItem> = [
        { dateTime: 1, id: 1, operation: PoEventSourcingOperation.Update, record: schemaData }
      ];
      const eventSourcingItemsUpdated = [
        { dateTime: 1, id: 1, operation: PoEventSourcingOperation.Update, record: inserted }
      ];

      spyOn(storageServiceMock, 'set');

      await eventSourcingService['updatePendingEventSourcing'](
        currentEventSourcingItem,
        idFieldSchema,
        inserted,
        eventSourcingItems
      );

      expect(storageServiceMock.set).toHaveBeenCalledWith(EVENT_SOURCING_NAME, eventSourcingItemsUpdated);
    });

    it(`updatePendingEventSourcing: should update all pending items in eventSourcing if the id is equal`, async () => {
      const idFieldSchema = 'id';
      const idInserted = 'ABC';
      const records = [
        { name: 'Customer name 1', SyncInternalId: '12345' },
        { name: 'Customer name 1,2', SyncInternalId: '12345' },
        { name: 'Customer name 1,2,3', SyncInternalId: '12345' },
        { name: 'Customer name 4', SyncInternalId: '456' }
      ];

      const currentEventSourcingItem: PoEventSourcingItem = {
        id: 1,
        dateTime: 1,
        operation: PoEventSourcingOperation.Insert,
        record: records[0]
      };

      const inserted = Object.assign({ id: idInserted }, records[0]);
      const eventSourcingItems: Array<PoEventSourcingItem> = [
        { dateTime: 1, id: 1, operation: PoEventSourcingOperation.Insert, record: records[0] },
        { dateTime: 2, id: 2, operation: PoEventSourcingOperation.Update, record: records[1] },
        { dateTime: 3, id: 3, operation: PoEventSourcingOperation.Update, record: records[2] },
        { dateTime: 4, id: 4, operation: PoEventSourcingOperation.Update, record: records[3] }
      ];
      const eventSourcingItemsUpdated: Array<PoEventSourcingItem> = [
        {
          dateTime: 1,
          id: 1,
          operation: PoEventSourcingOperation.Insert,
          record: Object.assign({ id: idInserted }, records[0])
        },
        {
          dateTime: 2,
          id: 2,
          operation: PoEventSourcingOperation.Update,
          record: Object.assign({ id: idInserted }, records[1])
        },
        {
          dateTime: 3,
          id: 3,
          operation: PoEventSourcingOperation.Update,
          record: Object.assign({ id: idInserted }, records[2])
        },
        { dateTime: 4, id: 4, operation: PoEventSourcingOperation.Update, record: records[3] }
      ];

      spyOn(storageServiceMock, 'set');
      await eventSourcingService['updatePendingEventSourcing'](
        currentEventSourcingItem,
        idFieldSchema,
        inserted,
        eventSourcingItems
      );

      expect(storageServiceMock.set).toHaveBeenCalledWith(EVENT_SOURCING_NAME, eventSourcingItemsUpdated);
    });

    it('isValidStatus: should return true if status contains in VALID_STATUS array', () => {
      const isValid = eventSourcingService['isValidStatus'](203);
      expect(isValid).toBeTruthy();
    });

    it('isValidStatus: should return false if status not contains in VALID_STATUS array', () => {
      const isValid = eventSourcingService['isValidStatus'](150);
      expect(isValid).toBeFalsy();
    });

    it('updateRecords: should update storageRecords with new items and without items deleted', async () => {
      const serverRecords = [
        { id: 1, value: 'Value 1', deleted: false },
        { id: 2, value: 'Value 2', deleted: true }
      ];

      spyOn(eventSourcingService, <any>'updateRecordByServerRecord');

      await eventSourcingService['updateRecords'](serverRecords, schemaCustumerMock);

      expect(eventSourcingService['updateRecordByServerRecord']).toHaveBeenCalledTimes(serverRecords.length);

      expect(eventSourcingService['updateRecordByServerRecord']).toHaveBeenCalledWith(
        serverRecords[0],
        schemaCustumerMock
      );
      expect(eventSourcingService['updateRecordByServerRecord']).toHaveBeenCalledWith(
        serverRecords[1],
        schemaCustumerMock
      );
    });

    describe('updateRecordByServerRecord:', () => {
      it(`should call poSchemaService.remove if record already exists in storage and
        the server record was deleted`, async () => {
        const serverRecord = { id: 1, value: 'Value 1', deleted: true };
        const storageRecord = { id: 1, value: 'Value 1', deleted: false };

        spyOn(eventSourcingService['poSchemaService'], 'get').and.returnValue(<any>storageRecord);
        spyOn(eventSourcingService['poSchemaService'], 'remove');
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService['poSchemaService'], 'create');

        await eventSourcingService['updateRecordByServerRecord'](serverRecord, schemaCustumerMock);

        expect(eventSourcingService['poSchemaService']['remove']).toHaveBeenCalledWith(
          schemaCustumerMock.name,
          serverRecord.id
        );

        expect(eventSourcingService['poSchemaService']['update']).not.toHaveBeenCalled();
        expect(eventSourcingService['poSchemaService']['create']).not.toHaveBeenCalled();
      });

      it(`should call poSchemaService.create if record not exists in storage
        and record.deleted not true`, async () => {
        const serverRecord = { id: 1, value: 'Value 1', deleted: false };

        spyOn(eventSourcingService['poSchemaService'], 'get').and.returnValue(<any>{});
        spyOn(eventSourcingService['poSchemaService'], 'remove');
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService['poSchemaService'], 'create');

        await eventSourcingService['updateRecordByServerRecord'](serverRecord, schemaCustumerMock);

        expect(eventSourcingService['poSchemaService']['create']).toHaveBeenCalledWith(
          schemaCustumerMock,
          serverRecord
        );

        expect(eventSourcingService['poSchemaService']['update']).not.toHaveBeenCalled();
        expect(eventSourcingService['poSchemaService']['remove']).not.toHaveBeenCalled();
      });

      it(`should not call poSchemaService if record not exists in storage
        and record.deleted true`, async () => {
        const serverRecord = { id: 1, value: 'Value 1', deleted: true };

        spyOn(eventSourcingService['poSchemaService'], 'get').and.returnValue(<any>{});
        spyOn(eventSourcingService['poSchemaService'], 'remove');
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService['poSchemaService'], 'create');

        await eventSourcingService['updateRecordByServerRecord'](serverRecord, schemaCustumerMock);

        expect(eventSourcingService['poSchemaService']['create']).not.toHaveBeenCalledWith(
          schemaCustumerMock,
          serverRecord
        );

        expect(eventSourcingService['poSchemaService']['update']).not.toHaveBeenCalled();
        expect(eventSourcingService['poSchemaService']['remove']).not.toHaveBeenCalled();
      });

      it(`should call poSchemaService.create if record not exists in storage
        and record.deleted not true`, async () => {
        const serverRecord = { id: 1, value: 'Value 1', deleted: false };

        spyOn(eventSourcingService['poSchemaService'], 'get').and.returnValue(<any>{});
        spyOn(eventSourcingService['poSchemaService'], 'remove');
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService['poSchemaService'], 'create');

        await eventSourcingService['updateRecordByServerRecord'](serverRecord, schemaCustumerMock);

        expect(eventSourcingService['poSchemaService']['create']).toHaveBeenCalledWith(
          schemaCustumerMock,
          serverRecord
        );

        expect(eventSourcingService['poSchemaService']['update']).not.toHaveBeenCalled();
        expect(eventSourcingService['poSchemaService']['remove']).not.toHaveBeenCalled();
      });

      it(`should call poSchemaService.update if record exists in storage
        and record.deleted not true`, async () => {
        const serverRecord = { id: 1, value: 'Value 2', deleted: false };
        const storageRecord = { id: 1, value: 'Value 1', deleted: false };

        spyOn(eventSourcingService['poSchemaService'], 'get').and.returnValue(<any>storageRecord);
        spyOn(eventSourcingService['poSchemaService'], 'remove');
        spyOn(eventSourcingService['poSchemaService'], 'update');
        spyOn(eventSourcingService['poSchemaService'], 'create');

        await eventSourcingService['updateRecordByServerRecord'](serverRecord, schemaCustumerMock);

        expect(eventSourcingService['poSchemaService']['update']).toHaveBeenCalledWith(
          schemaCustumerMock,
          serverRecord
        );

        expect(eventSourcingService['poSchemaService']['create']).not.toHaveBeenCalled();
        expect(eventSourcingService['poSchemaService']['remove']).not.toHaveBeenCalled();
      });
    });

    it('updateStorageBySchema: should call buildUrlParams and set its value in currentUrlDiff and set page to be 1', async () => {
      const baseUrl = `http://url/api/v1/customers/diff/${schemaCustumerMock.lastSync}`;
      const currentUrl = 'current.url.com';

      spyOn(eventSourcingService, <any>'getServerDiffRecords');
      spyOn(eventSourcingService, <any>'updateRecords');
      spyOn(eventSourcingService['poSchemaDefinition'], 'update');

      spyOn(eventSourcingService, <any>'buildUrlParams').and.returnValue(currentUrl);

      await eventSourcingService['updateStorageBySchema'](schemaCustumerMock);

      expect(eventSourcingService['buildUrlParams']).toHaveBeenCalledWith(
        schemaCustumerMock,
        baseUrl,
        eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['page']
      );

      expect(eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['page']).toBe(1);

      expect(eventSourcingService['schemasSyncConfig'][schemaCustumerMock.name]['currentUrlDiff']).toBe(currentUrl);
    });

    it('updateStorageBySchema: should call getServerDiffRecords, updateRecords and poSchemaDefinition.update', async () => {
      const differRecords = [{ record: '1' }, { record: '2' }];

      const baseUrl = `http://url/api/v1/customers/diff/${schemaCustumerMock.lastSync}`;

      spyOn(eventSourcingService, <any>'getServerDiffRecords').and.returnValue(differRecords);
      spyOn(eventSourcingService, <any>'updateRecords');
      spyOn(eventSourcingService, <any>'buildUrlParams');
      spyOn(eventSourcingService['poSchemaDefinition'], 'update');

      await eventSourcingService['updateStorageBySchema'](schemaCustumerMock);

      expect(eventSourcingService['getServerDiffRecords']).toHaveBeenCalledWith(schemaCustumerMock, baseUrl);

      expect(eventSourcingService['updateRecords']).toHaveBeenCalledWith(differRecords, schemaCustumerMock);
      expect(eventSourcingService['poSchemaDefinition']['update']).toHaveBeenCalledWith(schemaCustumerMock);
    });

    it('updateStorageSchemas: should call updateStorageBySchema twice', () => {
      spyOn(eventSourcingService, <any>'updateStorageBySchema');

      eventSourcingService['updateStorageSchemas'](schemas);
      expect(eventSourcingService['updateStorageBySchema']).toHaveBeenCalledTimes(2);
    });

    it('updateStorageSchemas: should return a Array of Promises', () => {
      spyOn(eventSourcingService, <any>'updateStorageBySchema').and.returnValues(
        Promise.resolve(['test']),
        Promise.resolve(['test2'])
      );
      const result = eventSourcingService['updateStorageSchemas'](schemas);

      expect(result instanceof Array).toBeTruthy();
      expect(result[0].then instanceof Function);
      expect(result[0].catch instanceof Function);
      expect(result[0]['finally'] instanceof Function);
    });
  });
});
