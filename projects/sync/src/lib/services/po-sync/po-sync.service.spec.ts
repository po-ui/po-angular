import { fakeAsync, tick } from '@angular/core/testing';
import { of, Subject, Subscriber } from 'rxjs';

import { PoNetworkType } from '../../models/po-network-type.enum';
import { PoUtils as utilsFunctions } from '../../utils/utils';
import { PoEventSourcingService } from '../po-event-sourcing/po-event-sourcing.service';
import { PoHttpRequestData } from '../po-http-client/interfaces/po-http-request-data.interface';
import { PoHttpClientService } from '../po-http-client/po-http-client.service';
import { PoHttpRequestType } from '../po-http-client/po-http-request-type.enum';
import { PoDataMessage, PoDataTransform, PoEntity, PoNetworkStatus } from './../../models';
import { PoNetworkService } from './../po-network/po-network.service';
import { PoSchemaDefinitionService } from './../po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaUtil } from './../po-schema/po-schema-util/po-schema-util.model';
import { PoSchemaService } from './../po-schema/po-schema.service';
import { PoSyncConfig } from './interfaces/po-sync-config.interface';
import { PoSyncSchema } from './interfaces/po-sync-schema.interface';
import { PoSyncService } from './po-sync.service';

class CustomDataTransform extends PoDataTransform {
  getDateFieldName(): string {
    return undefined;
  }
  getPageSizeParamName(): string {
    return 'pageSize';
  }
  getPageParamName(): string {
    return 'page';
  }
  hasNext(): boolean {
    return true;
  }
  getItemsFieldName(): string {
    return 'data';
  }
}

describe('PoSyncService:', () => {
  let poSync: PoSyncService;
  let poEventSourcing: jasmine.SpyObj<PoEventSourcingService>;
  let poSchemaDefinition: jasmine.SpyObj<PoSchemaDefinitionService>;
  let poSchemaService: jasmine.SpyObj<PoSchemaService>;
  let poNetworkServiceMock: jasmine.SpyObj<PoNetworkService>;
  let http: jasmine.SpyObj<PoHttpClientService>;

  const customerSchema: PoSyncSchema = {
    idField: 'code',
    name: 'Customers',
    getUrlApi: 'http://localhost:8200/api/v1/customers',
    diffUrlApi: 'http://localhost:8200/api/v1/customers/diff',
    fields: ['code', 'name'],
    pageSize: 2,
    deletedField: 'deleted',
    lastSync: new Date().toISOString()
  };

  const userSchema: PoSyncSchema = {
    idField: 'id',
    getUrlApi: 'http://localhost:8200/api/v1/users',
    diffUrlApi: 'http://localhost:8200/api/v1/users/diff',
    name: 'Users',
    fields: ['id', 'name', 'login'],
    pageSize: 20,
    deletedField: 'deleted'
  };

  beforeEach(() => {
    http = jasmine.createSpyObj('PoHttpClientService', ['get']);

    poEventSourcing = jasmine.createSpyObj('PoEventSourcingService', [
      'syncGet',
      'syncSend',
      'onSaveData',
      'responsesSubject',
      'httpCommand',
      'removeEventSourcingItem',
      'destroyEventSourcingQueue'
    ]);
    poEventSourcing.syncGet.and.returnValue(Promise.resolve({}));
    poEventSourcing.syncSend.and.returnValue(Promise.resolve({}));
    poEventSourcing.onSaveData.and.returnValue(of(null));

    poNetworkServiceMock = jasmine.createSpyObj('PoNetworkService', ['getConnectionStatus', 'onChange']);
    poNetworkServiceMock.onChange.and.returnValue(of({ status: undefined, type: undefined }));
    poNetworkServiceMock.getConnectionStatus.and.returnValue(new PoNetworkStatus('wifi'));

    poSchemaDefinition = jasmine.createSpyObj('PoSchemaDefinitionService', ['getAll', 'saveAll', 'destroy']);

    poSchemaService = jasmine.createSpyObj('PoSchemaService', [
      'limitedCallWrap',
      'destroySchemasRecords',
      'updateAll'
    ]);

    poSync = new PoSyncService(
      poEventSourcing as any,
      http as any,
      poNetworkServiceMock as any,
      poSchemaDefinition as any,
      poSchemaService as any
    );
  });

  it('should be created', () => {
    expect(poSync instanceof PoSyncService).toBeTruthy();
  });

  describe('Properties:', () => {
    it('syncing: should be false on init', () => {
      expect(poSync['syncing']).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it('destroy: should call poSchemaService.limitedCallWrap and return its value', async () => {
      const limitedCallWrapReturn = 'limitedCallWrap return';
      poSchemaService.limitedCallWrap.and.returnValue(limitedCallWrapReturn as any);

      const result = await poSync.destroy();

      expect(poSchemaService.limitedCallWrap).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('destroy: should call poSchemaDefinitionService.destroy, destroySchemasRecords, destroyEventSourcingQueue', async () => {
      poSchemaService.limitedCallWrap.and.callFake((callback: any) => callback());
      poSchemaDefinition.destroy.and.returnValue(Promise.resolve());
      poSchemaService.destroySchemasRecords.and.returnValue(Promise.resolve());
      poEventSourcing.destroyEventSourcingQueue.and.returnValue(Promise.resolve());

      await poSync.destroy();

      expect(poSchemaDefinition.destroy).toHaveBeenCalled();
      expect(poSchemaService.destroySchemasRecords).toHaveBeenCalled();
      expect(poEventSourcing.destroyEventSourcingQueue).toHaveBeenCalled();
    });

    it('disableSync: should set isSyncEnabled with false', () => {
      poSync['isSyncEnabled'] = true;
      poSync.disableSync();
      expect(poSync['isSyncEnabled']).toBeFalsy();
    });

    it('disableSync: should call subscription.unsubscribe if timer and subscription is defined', () => {
      const fakeThis = {
        isSyncEnabled: true,
        timer: 'mock timer',
        subscription: { unsubscribe: jasmine.createSpy('unsubscribe') }
      };

      poSync.disableSync.apply(fakeThis);

      expect(fakeThis.subscription.unsubscribe).toHaveBeenCalled();
    });

    it('disableSync: should not call subscription.unsubscribe if timer is undefined', () => {
      const fakeThis = {
        isSyncEnabled: true,
        timer: undefined,
        subscription: { unsubscribe: jasmine.createSpy('unsubscribe') }
      };

      poSync.disableSync.apply(fakeThis);

      expect(fakeThis.subscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('enableSync: should set isSyncEnabled with true and call createSubscribe', () => {
      poSync['isSyncEnabled'] = false;
      spyOn(poSync, <any>'createSubscribe');

      poSync.enableSync();

      expect(poSync['isSyncEnabled']).toBeTruthy();
      expect(poSync['createSubscribe']).toHaveBeenCalled();
    });

    it('getResponses: should call responsesSubject', done => {
      poEventSourcing.responsesSubject.and.returnValue(of({}) as any);

      poSync.getResponses().subscribe(() => {
        expect(poEventSourcing.responsesSubject).toHaveBeenCalled();
        done();
      });
    });

    it('getModel: should returns PoEntity instance', () => {
      poSync['models']['Customers'] = new PoEntity(null, customerSchema, null);
      const model = poSync.getModel('Customers');
      expect(model instanceof PoEntity).toBeTruthy();
      expect(model['schema']).toEqual(customerSchema);
    });

    it('getModel: should throw error if model not found', () => {
      const result = () => poSync.getModel('Clients');
      expect(result).toThrowError(Error, 'Model not found: Clients');
    });

    it('insertHttpCommand: should call validateParameter and httpCommand', async () => {
      const requestDataMock: PoHttpRequestData = { url: 'http://url-test.com', method: PoHttpRequestType.GET };
      spyOn(utilsFunctions, 'validateParameter');
      poEventSourcing.httpCommand.and.returnValue(Promise.resolve(1));

      await poSync.insertHttpCommand(requestDataMock);

      expect(poEventSourcing.httpCommand).toHaveBeenCalledWith(requestDataMock, undefined);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ requestData: requestDataMock });
    });

    it('insertHttpCommand: should call httpCommand with customRequestId', async () => {
      const requestDataMock: PoHttpRequestData = { url: 'http://url-test.com', method: PoHttpRequestType.GET };
      const customRequestId = '123';
      spyOn(utilsFunctions, 'validateParameter');
      poEventSourcing.httpCommand.and.returnValue(Promise.resolve(1));

      await poSync.insertHttpCommand(requestDataMock, customRequestId);

      expect(poEventSourcing.httpCommand).toHaveBeenCalledWith(requestDataMock, customRequestId);
    });

    it('loadData: should load api data', done => {
      poSync['schemas'] = [customerSchema];
      const myData = [
        { id: 1, name: 'Customer 1' },
        { id: 2, name: 'Customer 2' }
      ];
      spyOn(poSync, <any>'loadEntityData').and.returnValue(of({ entity: 'Customers', data: myData }));
      poSync.loadData().subscribe(entities => {
        expect(entities[0].entity).toBe('Customers');
        expect(entities[0].data).toEqual(myData);
        done();
      });
    });

    it('onSync: should return the same eventSub observable', done => {
      poSync['eventSub'] = of({ data: 'value' });
      poSync.onSync().subscribe(result => {
        expect(result).toEqual({ data: 'value' });
        done();
      });
    });

    it('onSync: should emitter to be a Subscriber instance', () => {
      poSync['emitter'] = null;
      poSync.onSync().subscribe(() => {});
      expect(poSync['emitter'] instanceof Subscriber).toBeTruthy();
    });

    it('prepare: should call validateArray with schemas', async () => {
      const mySchemas = [customerSchema];
      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, <any>'reactiveSync');
      spyOn(utilsFunctions, 'validateArray');
      spyOn(poSync, <any>'saveSchemas').and.returnValue(Promise.resolve());

      await poSync.prepare(mySchemas);

      expect(utilsFunctions.validateArray).toHaveBeenCalledWith({ schemas: mySchemas });
    });

    it('prepare: should prepare all configs to sync', async () => {
      const myConfig: PoSyncConfig = {
        type: PoNetworkType.wifi,
        period: 30,
        dataTransform: new CustomDataTransform()
      };
      const mySchemas = [customerSchema];

      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, <any>'reactiveSync');
      spyOn(utilsFunctions, 'validateArray');
      spyOn(poSync, <any>'saveSchemas').and.returnValue(Promise.resolve());

      await poSync.prepare(mySchemas, myConfig);

      expect(poSync['schemas']).toEqual(mySchemas);
      expect(poSync['config']).toEqual(myConfig);
      expect(poSync['poEventSourcingService']['config']).toEqual(myConfig);
      expect(poSync['startTimer']).toHaveBeenCalled();
      expect(poSync['reactiveSync']).toHaveBeenCalled();
      expect(poSync['saveSchemas']).toHaveBeenCalled();
      expect(poSync['models']['Customers'] instanceof PoEntity).toBeTruthy();
    });

    it('prepare: should set default config when no config is passed', async () => {
      const mySchemas = [customerSchema];
      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, <any>'reactiveSync');
      spyOn(poSync, <any>'saveSchemas').and.returnValue(Promise.resolve());

      await poSync.prepare(mySchemas);

      expect(poSync['config'].period).toBe(60);
      expect(poSync['config'].dataTransform instanceof PoDataMessage).toBeTruthy();
    });

    it('prepare: should set dataTransform to PoDataMessage when config has no dataTransform', async () => {
      const mySchemas = [customerSchema];
      const myConfig: PoSyncConfig = { type: PoNetworkType.wifi, period: 60 };

      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, <any>'reactiveSync');
      spyOn(poSync, <any>'saveSchemas').and.returnValue(Promise.resolve());

      await poSync.prepare(mySchemas, myConfig);

      expect(poSync['config']['dataTransform'] instanceof PoDataMessage).toBeTruthy();
    });

    it('removeItemOfSync: should call removeEventSourcingItem with id', async () => {
      poEventSourcing.removeEventSourcingItem.and.returnValue(Promise.resolve());
      await poSync.removeItemOfSync(123);
      expect(poEventSourcing.removeEventSourcingItem).toHaveBeenCalledWith(123);
    });

    it('resumeSync: should call sync when canSync is true', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, 'sync').and.returnValue(Promise.resolve());

      await poSync.resumeSync();

      expect(poSync.sync).toHaveBeenCalled();
    });

    it('resumeSync: should subscribe to finishSyncSubject when canSync is false', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(false);
      const spySync = spyOn(poSync, 'sync').and.returnValue(Promise.resolve());
      spyOn(poSync['finishSyncSubject'], 'asObservable').and.callThrough();

      await poSync.resumeSync();

      poSync['finishSyncSubject'].next(null);

      expect(poSync['finishSyncSubject'].asObservable).toHaveBeenCalledBefore(spySync);
      expect(poSync.sync).toHaveBeenCalled();
    });

    it('sync: should call startSync and finishSync when canSync returns true', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync, <any>'finishSync');

      await poSync.sync();

      expect(poSync['startSync']).toHaveBeenCalled();
      expect(poSync['finishSync']).toHaveBeenCalled();
    });

    it('sync: should not call startSync when canSync returns false', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(false);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync, <any>'finishSync');

      await poSync.sync();

      expect(poSync['startSync']).not.toHaveBeenCalled();
      expect(poSync['finishSync']).not.toHaveBeenCalled();
    });

    it('sync: should call emitter.next() when emitter is defined', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      poSync['emitter'] = { next: jasmine.createSpy('next') };

      await poSync.sync();

      expect(poSync['emitter'].next).toHaveBeenCalled();
    });

    it('sync: syncError should be called when syncGet throws error', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync, <any>'syncError');
      poEventSourcing.syncSend.and.returnValue(Promise.resolve());
      poEventSourcing.syncGet.and.returnValue(Promise.reject('Error'));

      await poSync.sync();

      expect(poSync['startSync']).toHaveBeenCalled();
      expect(poSync['syncError']).toHaveBeenCalled();
    });

    it('canSync: should return false if syncing is true', () => {
      poSync['syncing'] = true;
      poSync['isSyncEnabled'] = true;
      expect(poSync['canSync']()).toBeFalsy();
    });

    it('canSync: should return false if isSyncEnabled is false', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = false;
      expect(poSync['canSync']()).toBeFalsy();
    });

    it('canSync: should return true if network status is true and config is undefined', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = undefined;
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: true, type: undefined } as any);

      expect(poSync['canSync']()).toBeTruthy();
    });

    it('canSync: should return false if network status is false', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = undefined;
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: false, type: undefined } as any);

      expect(poSync['canSync']()).toBeFalsy();
    });

    it('canSync: should return true if network type matches config type', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: PoNetworkType.wifi };
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: true, type: PoNetworkType.wifi } as any);

      expect(poSync['canSync']()).toBeTruthy();
    });

    it('canSync: should return false if network type does not match config type', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: PoNetworkType.ethernet };
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: true, type: PoNetworkType.wifi } as any);

      expect(poSync['canSync']()).toBeFalsy();
    });

    it('canSync: should return true if config type is an array and includes current type', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: [PoNetworkType.wifi, PoNetworkType._2g] };
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: true, type: PoNetworkType.wifi } as any);

      expect(poSync['canSync']()).toBeTruthy();
    });

    it('canSync: should return false if config type is an array and does not include current type', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: [PoNetworkType.wifi, PoNetworkType._2g] };
      poNetworkServiceMock.getConnectionStatus.and.returnValue({ status: true, type: PoNetworkType.ethernet } as any);

      expect(poSync['canSync']()).toBeFalsy();
    });

    it('createSubscribe: should not call sync if timer is undefined', () => {
      poSync['timer'] = undefined;
      spyOn(poSync, 'sync');

      poSync['createSubscribe']();

      expect(poSync.sync).not.toHaveBeenCalled();
    });

    it('createSubscribe: should call sync and startTimer when timer emits', fakeAsync(() => {
      spyOn(poSync, 'sync').and.returnValue(Promise.resolve());
      spyOn(poSync, <any>'startTimer');
      poSync['timer'] = of(0);
      poSync['config'] = { type: PoNetworkType.wifi, period: 10 };

      poSync['createSubscribe']();
      tick(300);

      expect(poSync.sync).toHaveBeenCalled();
      expect(poSync['timer']).toBeNull();
      expect(poSync['subscription']).toBeNull();
      expect(poSync['startTimer']).toHaveBeenCalledWith(10);
    }));

    it('finishSync: should set syncing to false and call finishSyncSubject.next', () => {
      poSync['syncing'] = true;
      spyOn(poSync['finishSyncSubject'], 'next');

      poSync['finishSync']();

      expect(poSync['syncing']).toBeFalsy();
      expect(poSync['finishSyncSubject'].next).toHaveBeenCalled();
    });

    it('startSync: should set syncing to true', () => {
      poSync['syncing'] = false;
      poSync['startSync']();
      expect(poSync['syncing']).toBeTruthy();
    });

    it('startTimer: should call createSubscribe if period and isSyncEnabled are truthy', () => {
      poSync['isSyncEnabled'] = true;
      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](5);

      expect(poSync['createSubscribe']).toHaveBeenCalled();
      expect(poSync['timer']).toBeDefined();
    });

    it('startTimer: should not call createSubscribe if period is undefined', () => {
      poSync['isSyncEnabled'] = true;
      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](undefined);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if period is zero', () => {
      poSync['isSyncEnabled'] = true;
      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](0);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if isSyncEnabled is false', () => {
      poSync['isSyncEnabled'] = false;
      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](5);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('syncError: should call finishSync', () => {
      spyOn(poSync, <any>'finishSync');
      poSync['syncError']();
      expect(poSync['finishSync']).toHaveBeenCalled();
    });

    it('reactiveSync: should call startTimer and sync when network status is true', () => {
      const networkSubject = new Subject<any>();
      poNetworkServiceMock.onChange.and.returnValue(networkSubject.asObservable());

      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, 'sync');

      poSync['config'] = { period: 10 } as any;
      poSync['reactiveSync']();

      networkSubject.next({ status: true });

      expect(poSync['startTimer']).toHaveBeenCalledWith(10);
      expect(poSync.sync).toHaveBeenCalled();
    });

    it('reactiveSync: should call subscription.unsubscribe when network status is falsy and subscription exists', () => {
      const networkSubject = new Subject<any>();
      poNetworkServiceMock.onChange.and.returnValue(networkSubject.asObservable());

      poSync['subscription'] = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
      poSync['reactiveSync']();

      networkSubject.next({ status: false });

      expect(poSync['subscription'].unsubscribe).toHaveBeenCalled();
    });

    it('saveSchemas: should call poSchemaDefinitionService.getAll and saveAll', async () => {
      const schemasStorage: Array<PoSyncSchema> = [
        {
          idField: '',
          name: '',
          getUrlApi: '',
          diffUrlApi: 'http://localhost:8200/api/v1/customers/diff',
          fields: ['code', 'name'],
          pageSize: 20,
          deletedField: 'deleted'
        }
      ];

      poSync['schemas'] = [customerSchema, userSchema];
      poSchemaDefinition.getAll.and.returnValue(Promise.resolve(schemasStorage) as any);
      poSchemaDefinition.saveAll.and.returnValue(Promise.resolve([]) as any);
      spyOn(PoSchemaUtil, 'getLastSync');

      await poSync['saveSchemas']();

      expect(poSchemaDefinition.saveAll).toHaveBeenCalledWith([customerSchema, userSchema]);
      expect(poSchemaDefinition.getAll).toHaveBeenCalled();
    });

    describe('getOnePage:', () => {
      const myItems = [
        { id: 1, name: 'Customer Z' },
        { id: 2, name: 'Customer X' }
      ];

      it('should add sync fields to body items and call http.get with correctly url', done => {
        const response = of({ body: { hasNext: true, items: myItems } });
        http.get.and.returnValue(response as any);
        poSchemaService.updateAll.and.returnValue(Promise.resolve());
        poSync['config'] = { type: PoNetworkType.wifi, period: 10, dataTransform: new PoDataMessage() };

        poSync['getOnePage'](customerSchema).subscribe(body => {
          expect(body.items[0].SyncUpdatedDateTime).toBeNull();
          expect(body.items[0].SyncExclusionDateTime).toBeNull();
          expect(body.items[0].SyncDeleted).toBeFalsy();
          expect(body.items[0].SyncStatus).toBe(2);
          expect(http.get).toHaveBeenCalledWith('http://localhost:8200/api/v1/customers?pageSize=2&page=1');
          done();
        });
      });

      it('should call http.get with page 2', done => {
        const response = of({ body: { hasNext: true, items: myItems } });
        http.get.and.returnValue(response as any);
        poSchemaService.updateAll.and.returnValue(Promise.resolve());
        poSync['config'] = { type: PoNetworkType.wifi, period: 10, dataTransform: new PoDataMessage() };

        poSync['getOnePage'](customerSchema, 2).subscribe(() => {
          expect(http.get).toHaveBeenCalledWith('http://localhost:8200/api/v1/customers?pageSize=2&page=2');
          done();
        });
      });

      it('should call poSchemaService.updateAll', done => {
        const response = of({ body: { hasNext: true, items: myItems } });
        http.get.and.returnValue(response as any);
        poSchemaService.updateAll.and.returnValue(Promise.resolve());
        poSync['config'] = { type: PoNetworkType.wifi, period: 10, dataTransform: new PoDataMessage() };

        poSync['getOnePage'](customerSchema).subscribe(() => {
          expect(poSchemaService.updateAll).toHaveBeenCalled();
          done();
        });
      });
    });

    it('loadEntityData: should request data from schema url', done => {
      const pageOneData = [
        { id: 1, name: 'Customer 1' },
        { id: 2, name: 'Customer 2' }
      ];
      const pageTwoData = [
        { id: 3, name: 'Customer 3' },
        { id: 4, name: 'Customer 4' }
      ];

      poSync['config'] = { type: PoNetworkType.wifi, period: 10, dataTransform: new PoDataMessage() };

      spyOn(poSync, <any>'getOnePage').and.returnValues(
        of({ hasNext: true, items: pageOneData }),
        of({ hasNext: false, items: pageTwoData })
      );

      poSync['loadEntityData'](customerSchema).subscribe(entity => {
        expect(entity.entity).toBe(customerSchema.name);
        expect(entity.data).toEqual([...pageOneData, ...pageTwoData]);
        done();
      });
    });
  });
});
