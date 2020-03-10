import { fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import * as TypeMoq from 'typemoq';
import { Subscriber, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import * as utilsFunctions from '../../utils/utils';

import { PoDataMessage, PoDataTransform, PoEntity, PoNetworkStatus } from './../../models';
import { PoEventSourcingService } from '../po-event-sourcing/po-event-sourcing.service';
import { PoHttpClientService } from '../po-http-client/po-http-client.service';
import { PoHttpRequestData } from '../po-http-client/interfaces/po-http-request-data.interface';
import { PoHttpRequestType } from '../po-http-client/po-http-request-type.enum';
import { PoNetworkService } from './../po-network/po-network.service';
import { PoNetworkType } from '../../models/po-network-type.enum';
import { PoSchemaDefinitionService } from './../po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './../po-schema/po-schema.service';
import { PoSchemaUtil } from './../po-schema/po-schema-util/po-schema-util.model';
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
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  let customerSchema: PoSyncSchema;
  let userSchema: PoSyncSchema;
  let poSync: PoSyncService;
  let poNetworkServiceMock: TypeMoq.IMock<PoNetworkService>;
  let poEventSourcing: TypeMoq.IMock<PoEventSourcingService>;
  let poSchemaDefinition: TypeMoq.IMock<PoSchemaDefinitionService>;
  let poSchemaService: TypeMoq.IMock<PoSchemaService>;
  let http: TypeMoq.IMock<PoHttpClientService>;

  customerSchema = {
    idField: 'code',
    name: 'Customers',
    getUrlApi: 'http://localhost:8200/api/v1/customers',
    diffUrlApi: 'http://localhost:8200/api/v1/customers/diff',
    fields: ['code', 'name'],
    pageSize: 2,
    deletedField: 'deleted',
    lastSync: new Date().toISOString()
  };

  userSchema = {
    idField: 'id',
    getUrlApi: 'http://localhost:8200/api/v1/users',
    diffUrlApi: 'http://localhost:8200/api/v1/users/diff',
    name: 'Users',
    fields: ['id', 'name', 'login'],
    pageSize: 20,
    deletedField: 'deleted'
  };

  beforeEach(() => {
    http = TypeMoq.Mock.ofType(PoHttpClientService);

    poEventSourcing = TypeMoq.Mock.ofType(PoEventSourcingService);

    poEventSourcing.setup(e => e.syncGet()).returns(() => Promise.resolve({}));

    poEventSourcing.setup(e => e.syncSend()).returns(() => Promise.resolve({}));

    poEventSourcing.setup(e => e.onSaveData()).returns(() => of(null));

    poNetworkServiceMock = TypeMoq.Mock.ofType(PoNetworkService);

    poNetworkServiceMock.setup(e => e.onChange()).returns(() => of({ status: undefined, type: undefined }));

    poSchemaDefinition = TypeMoq.Mock.ofType(PoSchemaDefinitionService);

    poSchemaService = TypeMoq.Mock.ofType(PoSchemaService);

    poNetworkServiceMock
      .setup(e => e.getConnectionStatus())
      .returns(() => {
        return new PoNetworkStatus('wifi');
      });

    poSync = new PoSyncService(
      poEventSourcing.object,
      http.object,
      poNetworkServiceMock.object,
      poSchemaDefinition.object,
      poSchemaService.object
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

      spyOn(poSync['poSchemaService'], 'limitedCallWrap').and.returnValue(<any>limitedCallWrapReturn);

      const result = await poSync.destroy();

      expect(poSync['poSchemaService']['limitedCallWrap']).toHaveBeenCalled();
      expect(result).toBe(limitedCallWrapReturn);
    });

    it('destroy: should call poSchemaDefinitionService.destroy, destroySchemasRecords, destroyEventSourcingQueue', async () => {
      poSync['schemas'] = [customerSchema];

      spyOn(poSync['poSchemaService'], 'limitedCallWrap').and.callFake(callback => callback());

      spyOn(poSync['poSchemaDefinitionService'], 'destroy');
      spyOn(poSync['poSchemaService'], 'destroySchemasRecords');
      spyOn(poSync['poEventSourcingService'], 'destroyEventSourcingQueue');

      await poSync.destroy();

      expect(poSync['poSchemaDefinitionService'].destroy).toHaveBeenCalled();
      expect(poSync['poSchemaService'].destroySchemasRecords).toHaveBeenCalled();
      expect(poSync['poEventSourcingService'].destroyEventSourcingQueue).toHaveBeenCalled();
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
        subscription: {
          unsubscribe: () => {}
        }
      };

      spyOn(fakeThis.subscription, 'unsubscribe');

      poSync.disableSync.apply(fakeThis);

      expect(fakeThis['subscription'].unsubscribe).toHaveBeenCalled();
    });

    it('disableSync: should not call subscription.unsubscribe if timer is undefined and subscription is defined', () => {
      const fakeThis = {
        isSyncEnabled: true,
        timer: undefined,
        subscription: {
          unsubscribe: () => {}
        }
      };

      spyOn(fakeThis.subscription, 'unsubscribe');

      poSync.disableSync.apply(fakeThis);

      expect(fakeThis['subscription'].unsubscribe).not.toHaveBeenCalled();
    });

    it('enableSync: should set isSyncEnabled with true and call createSubscribe', () => {
      poSync['isSyncEnabled'] = false;

      spyOn(poSync, <any>'createSubscribe');

      poSync.enableSync();

      expect(poSync['isSyncEnabled']).toBeTruthy();
      expect(poSync['createSubscribe']).toHaveBeenCalled();
    });

    it('getResponses: should call responsesSubject', done => {
      spyOn(poSync['poEventSourcingService'], <any>'responsesSubject').and.returnValue(of({}));

      poSync.getResponses().subscribe(() => {
        expect(poSync['poEventSourcingService']['responsesSubject']).toHaveBeenCalled();
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

    it(`insertHttpCommand: should call validateParameter with records inside an object and httpCommand with PoHttpRequestData`, async () => {
      const requestDataMock: PoHttpRequestData = { url: 'http://url-test.com', method: PoHttpRequestType.GET };

      spyOn(utilsFunctions, 'validateParameter');
      spyOn(poSync['poEventSourcingService'], <any>'httpCommand').and.returnValue(Promise.resolve());

      await poSync.insertHttpCommand(requestDataMock);

      expect(poSync['poEventSourcingService']['httpCommand']).toHaveBeenCalledWith(requestDataMock, undefined);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ requestData: requestDataMock });
    });

    it(`insertHttpCommand: should should call validateParameter with records inside an object and httpCommand with
      customRequestId`, async () => {
      const requestDataMock: PoHttpRequestData = { url: 'http://url-test.com', method: PoHttpRequestType.GET };
      const customRequestId: string = '123';

      spyOn(utilsFunctions, 'validateParameter');
      spyOn(poSync['poEventSourcingService'], <any>'httpCommand').and.returnValue(Promise.resolve());

      await poSync.insertHttpCommand(requestDataMock, customRequestId);

      expect(poSync['poEventSourcingService']['httpCommand']).toHaveBeenCalledWith(requestDataMock, customRequestId);
      expect(utilsFunctions.validateParameter).toHaveBeenCalledWith({ requestData: requestDataMock });
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
      poSync.onSync().subscribe(
        result => {
          expect(result).toEqual({ data: 'value' });
          done();
        },
        err => {
          fail(err);
        }
      );
    });

    it('onSync: should emitter to be a Subscriber instance', () => {
      poSync['emitter'] = null;
      poSync.onSync().subscribe(() => {});
      expect(poSync['emitter'] instanceof Subscriber).toBeTruthy();
    });

    it('prepare: should call validateArray with mySchemas inside an object', async () => {
      const mySchemas = [customerSchema];
      const validateArrayParam = { schemas: mySchemas };

      spyOn(poSync, <any>'startTimer');
      spyOn(poSync, <any>'reactiveSync');
      spyOn(utilsFunctions, 'validateArray');
      spyOn(poSync['poEventSourcingService'], <any>'onSaveData').and.returnValue(of());
      spyOn(poSync, <any>'saveSchemas').and.returnValue({ then: () => {} });

      await poSync.prepare(mySchemas);

      expect(utilsFunctions.validateArray).toHaveBeenCalledWith(validateArrayParam);
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
      spyOn(poSync['poEventSourcingService'], <any>'onSaveData').and.returnValue(of());
      spyOn(poSync, <any>'saveSchemas').and.returnValue(Promise.resolve());

      await poSync.prepare(mySchemas, myConfig);

      expect(poSync['schemas']).toEqual(mySchemas);
      expect(poSync['config']).toEqual(myConfig);
      expect(poSync['poEventSourcingService']['config']).toEqual(myConfig);
      expect(poSync['startTimer']).toHaveBeenCalled();
      expect(poSync['reactiveSync']).toHaveBeenCalled();
      expect(poSync['poEventSourcingService']['onSaveData']).toHaveBeenCalled();
      expect(poSync['saveSchemas']).toHaveBeenCalled();
      expect(poSync['models']['Customers'] instanceof PoEntity).toBeTruthy();
      expect(poSync['models']['Customers']['schema']).toEqual(customerSchema);
    });

    it('prepare: should set default config to sync', async () => {
      const defaultConfig: PoSyncConfig = {
        type: poSync['poNetworkService']['getConnectionStatus']().type,
        period: 60,
        dataTransform: new PoDataMessage()
      };

      const mySchemas = [customerSchema];

      await poSync.prepare(mySchemas);

      expect(poSync['config']).toEqual(defaultConfig);
    });

    it('prepare: should set config without DataTransform', async () => {
      const mySchemas = [customerSchema];
      const myConfig: PoSyncConfig = {
        type: PoNetworkType.wifi,
        period: 60
      };

      await poSync.prepare(mySchemas, myConfig);

      expect(poSync['config']['dataTransform']).toEqual(new PoDataMessage());
    });

    it('removeItemOfSync: should call poEventSourcingService.removeItemEventSourcing with id', async () => {
      const idEventSourcingMock = jasmine.any(Number);
      spyOn(poSync['poEventSourcingService'], 'removeEventSourcingItem').and.returnValue(Promise.resolve());

      await poSync.removeItemOfSync(idEventSourcingMock);

      expect(poSync['poEventSourcingService']['removeEventSourcingItem']).toHaveBeenCalledWith(idEventSourcingMock);
    });

    it('resumeSync: should call sync and finishSyncSubject.asObservable when canSync is false', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(false);
      const spySync = spyOn(poSync, <any>'sync').and.returnValue(Promise.resolve());
      spyOn(poSync['finishSyncSubject'], <any>'asObservable').and.callThrough();

      await poSync.resumeSync();

      poSync['finishSyncSubject']['next']();

      expect(poSync['finishSyncSubject']['asObservable']).toHaveBeenCalledBefore(spySync);
      expect(poSync.sync).toHaveBeenCalled();
    });

    it(`resumeSync: should call sync and not call finishSyncSubject.asObservable
      when canSync is true`, async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, <any>'sync');
      spyOn(poSync['finishSyncSubject'], <any>'asObservable').and.returnValue(of());

      await poSync.resumeSync();

      expect(poSync.sync).toHaveBeenCalled();
      expect(poSync['finishSyncSubject']['asObservable']).not.toHaveBeenCalled();
    });

    it('sync: syncError should be called when syncGet error happen', done => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync['poEventSourcingService'], 'syncGet').and.throwError('Error on sync');
      spyOn(poSync, <any>'syncError');

      poSync
        .sync()
        .then(() => {
          expect(poSync['startSync']).toHaveBeenCalled();
          expect(poSync['syncError']).toHaveBeenCalled();
          done();
        })
        .catch(err => {
          fail();
        });
    });

    it('sync: should call startSync and finishSync when canSync returns true', done => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync, <any>'finishSync');
      poSync
        .sync()
        .then(() => {
          expect(poSync['startSync']).toHaveBeenCalled();
          expect(poSync['finishSync']).toHaveBeenCalled();
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it('sync: should not call startSync and finishSync when canSync returns false', done => {
      spyOn(poSync, <any>'canSync').and.returnValue(false);
      spyOn(poSync, <any>'startSync');
      spyOn(poSync, <any>'finishSync');
      poSync
        .sync()
        .then(() => {
          expect(poSync['startSync']).not.toHaveBeenCalled();
          expect(poSync['finishSync']).not.toHaveBeenCalled();
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it('sync: should call emitter.next() when emitter is defined', async () => {
      spyOn(poSync, <any>'canSync').and.returnValue(true);
      spyOn(poSync['poEventSourcingService'], 'syncGet').and.returnValue(Promise.resolve());
      spyOn(poSync['poEventSourcingService'], 'syncSend').and.returnValue(Promise.resolve());
      poSync['emitter'] = {
        next: () => {}
      };
      spyOn(poSync['emitter'], 'next');
      await poSync.sync();
      expect(poSync['emitter']['next']).toHaveBeenCalled();
    });

    it('sync: should call canSync always', done => {
      spyOn(poSync, <any>'canSync');
      poSync
        .sync()
        .then(() => {
          expect(poSync['canSync']).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it('canSync: should returns false if syncing is true and isSyncEnabled is false', () => {
      poSync['syncing'] = true;
      poSync['isSyncEnabled'] = false;

      const canSync = poSync['canSync']();

      expect(canSync).toBeFalsy();
    });

    it('canSync: should returns false if syncing is true and isSyncEnabled is true', () => {
      poSync['syncing'] = true;
      poSync['isSyncEnabled'] = true;

      const canSync = poSync['canSync']();

      expect(canSync).toBeFalsy();
    });

    it('canSync: should returns false if syncing is false and isSyncEnabled is false', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = false;

      const canSync = poSync['canSync']();

      expect(canSync).toBeFalsy();
    });

    it('canSync: should returns false if network status is false and config is undefined', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = undefined;

      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{ status: false, type: undefined });

      const canSync = poSync['canSync']();
      expect(canSync).toBeFalsy();
    });

    it('canSync: should returns true if network status is true and config is undefined', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = undefined;

      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{ status: true, type: undefined });

      const canSync = poSync['canSync']();
      expect(canSync).toBeTruthy();
    });

    it('canSync: should returns false if network status is true, network type != ethernet', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: PoNetworkType.ethernet };

      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{
        status: true,
        type: PoNetworkType.wifi
      });

      const canSync = poSync['canSync']();

      expect(canSync).toBeFalsy();
    });

    it('canSync: should returns true if network status is true, network type == wifi', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: PoNetworkType.wifi };
      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{
        status: true,
        type: PoNetworkType.wifi
      });

      const canSync = poSync['canSync']();

      expect(canSync).toBeTruthy();
    });

    it('canSync: should returns true if network status is true and isConfigIncludesType is true', () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: [PoNetworkType.wifi, PoNetworkType._2g] };

      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{
        status: true,
        type: PoNetworkType.wifi
      });

      const canSync = poSync['canSync']();

      expect(canSync).toBeTruthy();
    });

    it(`canSync: should returns false if network status is true, isConfiguredConnection and isConfigIncludesType is false`, () => {
      poSync['syncing'] = false;
      poSync['isSyncEnabled'] = true;
      poSync['config'] = { type: [PoNetworkType.wifi, PoNetworkType._2g] };

      spyOn(poSync['poNetworkService'], 'getConnectionStatus').and.returnValue(<any>{
        status: true,
        type: PoNetworkType.ethernet
      });

      const canSync = poSync['canSync']();

      expect(canSync).toBeFalsy();
    });

    it('createSubscribe: should call sync and startTimer if timer is undefined', () => {
      const fakeThis = {
        timer: undefined,
        sync: () => {},
        startTimer: () => {}
      };

      spyOn(fakeThis, 'sync');
      spyOn(fakeThis, 'startTimer');

      poSync['createSubscribe'].call(fakeThis);
      expect(fakeThis.timer).toBeUndefined();
      expect(fakeThis.sync).not.toHaveBeenCalled();
      expect(fakeThis.startTimer).not.toHaveBeenCalled();
    });

    it('createSubscribe: should call sync and startTimer', fakeAsync(() => {
      spyOn(poSync, 'sync').and.returnValue(Promise.resolve());
      spyOn(poSync, <any>'startTimer');
      poSync['timer'] = of(0);
      poSync['config'] = { type: poSync['poNetworkService']['getConnectionStatus']().type, period: 10 };

      poSync['createSubscribe']();

      tick(300);

      expect(poSync['sync']).toHaveBeenCalled();
      expect(poSync['timer']).toBeNull();
      expect(poSync['subscription']).toBeNull();
      expect(poSync['startTimer']).toHaveBeenCalledWith(10);
    }));

    it('finishSync: should set syncing to false and call finishSyncSubject.next', () => {
      poSync['syncing'] = true;
      spyOn(poSync['finishSyncSubject'], <any>'next');

      poSync['finishSync']();

      expect(poSync['syncing']).toBeFalsy();
      expect(poSync['finishSyncSubject']['next']).toHaveBeenCalled();
    });

    describe('getOnePage: ', () => {
      const myItems = [
        { id: 1, name: 'Customer Z' },
        { id: 2, name: 'Customer X' }
      ];
      const response = of(new HttpResponse({ body: { hasNext: true, items: myItems }, status: 200 }));
      const correctlyUrl = 'http://localhost:8200/api/v1/customers?pageSize=2&page=';

      it('should add sync fields to body.items and call http.get with correctly url', done => {
        spyOn(poSync['poHttpClient'], 'get').and.returnValue(response);
        poSync['config'] = {
          type: PoNetworkType.wifi,
          period: 10,
          dataTransform: new PoDataMessage()
        };

        spyOn(poSync['poSchemaService'], 'updateAll').and.returnValue(Promise.resolve());

        poSync['getOnePage'](customerSchema).subscribe(body => {
          expect(body.items[0].id).toBe(1);
          expect(body.items[0].name).toBe('Customer Z');
          expect(body.items[0].SyncUpdatedDateTime).toBeNull();
          expect(body.items[0].SyncExclusionDateTime).toBeNull();
          expect(body.items[0].SyncDeleted).toBeFalsy();
          expect(body.items[0].SyncStatus).toBe(2);
          expect(poSync['poHttpClient']['get']).toHaveBeenCalledWith(`${correctlyUrl}1`);
          done();
        });
      });

      it('should call http.get with correctly url and the page 2', done => {
        spyOn(poSync['poSchemaService'], 'updateAll').and.returnValue(Promise.resolve());
        spyOn(poSync['poHttpClient'], 'get').and.returnValue(response);
        poSync['config'] = {
          type: PoNetworkType.wifi,
          period: 10,
          dataTransform: new PoDataMessage()
        };

        poSync['getOnePage'](customerSchema, 2).subscribe(body => {
          expect(poSync['poHttpClient']['get']).toHaveBeenCalledWith(`${correctlyUrl}2`);
          done();
        });
      });

      it('should call poSchemaService.updateAll with schema', done => {
        spyOn(poSync['poHttpClient'], 'get').and.returnValue(response);
        spyOn(poSync['poSchemaService'], 'updateAll').and.returnValue(Promise.resolve());

        poSync['config'] = {
          type: PoNetworkType.wifi,
          period: 10,
          dataTransform: new PoDataMessage()
        };

        poSync['getOnePage'](customerSchema).subscribe(body => {
          expect(poSync['poSchemaService'].updateAll).toHaveBeenCalled();
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

      poSync['config'] = {
        type: PoNetworkType.wifi,
        period: 10,
        dataTransform: new PoDataMessage()
      };

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

    it('reactiveSync: should call unsubscribe when is defined and network status is undefined', () => {
      const fakeThis = {
        subscription: { unsubscribe: () => {} },
        poNetworkService: { onChange: () => of({ type: undefined }) }
      };

      spyOn(fakeThis.subscription, 'unsubscribe');

      poSync['reactiveSync'].call(fakeThis);

      expect(fakeThis.subscription.unsubscribe).toHaveBeenCalled();
    });

    it('reactiveSync: should call start, sync and not unsubscribe', () => {
      const periodConfig = jasmine.any(Number);

      const fakeThis = {
        subscription: { unsubscribe: () => {} },
        startTimer: (period: number) => {},
        config: { period: periodConfig },
        sync: () => {},
        poNetworkService: {
          onChange: () => of({ status: true })
        }
      };

      spyOn(fakeThis.subscription, 'unsubscribe');
      spyOn(fakeThis, 'startTimer');
      spyOn(fakeThis, 'sync');

      poSync['reactiveSync'].call(fakeThis);

      expect(fakeThis.subscription.unsubscribe).not.toHaveBeenCalled();
      expect(fakeThis.startTimer).toHaveBeenCalledWith(periodConfig);
      expect(fakeThis.sync).toHaveBeenCalled();
    });

    it(`reactiveSync: should not call unsubscribe, startTimer and sync when subscription and
      networkStatus is undefined`, () => {
      const fakeThis = {
        subscription: '',
        unsubscribe: () => {},
        startTimer: () => {},
        sync: () => {},
        poNetworkService: { onChange: () => of({ type: undefined }) }
      };

      spyOn(fakeThis, 'unsubscribe');
      spyOn(fakeThis, 'startTimer');
      spyOn(fakeThis, 'sync');

      poSync['reactiveSync'].call(fakeThis);

      expect(fakeThis.unsubscribe).not.toHaveBeenCalled();
      expect(fakeThis.startTimer).not.toHaveBeenCalled();
      expect(fakeThis.sync).not.toHaveBeenCalled();
    });

    it('saveSchemas: should call poSchemaDefinitionService.getAll and saveAll', async () => {
      spyOn(PoSchemaUtil, 'getLastSync');

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
      spyOn(poSync['poSchemaDefinitionService'], <any>'getAll').and.returnValue(schemasStorage);
      spyOn(poSync['poSchemaDefinitionService'], <any>'saveAll');

      await poSync['saveSchemas']();

      expect(poSync['poSchemaDefinitionService']['saveAll']).toHaveBeenCalledWith([customerSchema, userSchema]);
      expect(poSync['poSchemaDefinitionService']['getAll']).toHaveBeenCalled();
    });

    it('saveSchemas: should update lastSync of schemas and call PoSchemaUtil.getLastSync', async () => {
      const dateNow = new Date().toISOString();

      spyOn(PoSchemaUtil, 'getLastSync').and.returnValue(dateNow);

      const schemasStorage: Array<PoSyncSchema> = [
        {
          idField: '',
          name: '',
          getUrlApi: '',
          diffUrlApi: 'http://localhost:8200/api/v1/customers/diff',
          fields: ['code', 'name'],
          pageSize: 20,
          deletedField: 'deleted',
          lastSync: dateNow
        },
        {
          idField: 'code',
          name: 'Users',
          getUrlApi: 'http://localhost:8200/api/v1/users',
          diffUrlApi: 'http://localhost:8200/api/v1/users/diff',
          fields: ['code', 'name'],
          pageSize: 20,
          deletedField: 'deleted',
          lastSync: dateNow
        }
      ];

      poSync['schemas'] = [customerSchema, userSchema];

      spyOn(poSync['poSchemaDefinitionService'], <any>'getAll').and.returnValue(schemasStorage);
      spyOn(poSync['poSchemaDefinitionService'], <any>'saveAll');

      await poSync['saveSchemas']();

      expect(PoSchemaUtil.getLastSync).toHaveBeenCalledWith(schemasStorage, poSync['schemas'][0].name);
      expect(PoSchemaUtil.getLastSync).toHaveBeenCalledWith(schemasStorage, poSync['schemas'][1].name);
      expect(poSync['schemas'][0].lastSync === dateNow);
      expect(poSync['schemas'][1].lastSync === dateNow);
    });

    it('startSync: should set syncing to true', () => {
      poSync['syncing'] = false;
      poSync['startSync']();
      expect(poSync['syncing']).toBeTruthy();
    });

    it(`startTimer: should call createSubscribe and set timer with observable emitted in 5000ms if period is defined and
      isSyncEnabled is true`, () => {
      scheduler.run(helpers => {
        const { expectObservable } = helpers;
        const period = 5;
        poSync['isSyncEnabled'] = true;
        const expected = '5000ms (a|)';

        spyOn(poSync, <any>'createSubscribe');

        poSync['startTimer'](period);

        expectObservable(poSync['timer']).toBe(expected, { a: 0 });
        expect(poSync['createSubscribe']).toHaveBeenCalled();
      });
    });

    it('startTimer: should not call createSubscribe if period of syncronize is undefined and isSyncEnabled is true.', () => {
      poSync['isSyncEnabled'] = true;

      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](undefined);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if period of syncronize is undefined and isSyncEnabled is false.', () => {
      poSync['isSyncEnabled'] = false;

      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](undefined);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if period of syncronize is defined and isSyncEnabled is false.', () => {
      poSync['isSyncEnabled'] = false;
      const period = 1;

      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](period);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if period of syncronize is zero and isSyncEnabled is true.', () => {
      poSync['isSyncEnabled'] = true;

      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](0);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('startTimer: should not call createSubscribe if period of syncronize is zero and isSyncEnabled is false.', () => {
      poSync['isSyncEnabled'] = false;

      spyOn(poSync, <any>'createSubscribe');

      poSync['startTimer'](0);

      expect(poSync['createSubscribe']).not.toHaveBeenCalled();
    });

    it('syncError: should call finishSync', () => {
      spyOn(poSync, <any>'finishSync');

      poSync['syncError']();

      expect(poSync['finishSync']).toHaveBeenCalled();
    });
  });
});
