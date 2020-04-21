import { TestBed } from '@angular/core/testing';

import { handleThrowError } from '../util-test/util';
import * as LocalForage from 'localforage';

import { PoStorageConfig } from './po-storage-config.interface';
import { PoStorageService, PO_STORAGE_CONFIG_TOKEN } from './po-storage.service';

describe('PoStorageService:', () => {
  let poStorageService: PoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoStorageService, { provide: PO_STORAGE_CONFIG_TOKEN, useValue: PoStorageService.getDefaultConfig() }]
    });

    poStorageService = TestBed.inject(PoStorageService);
  });

  it('should be created', () => {
    expect(poStorageService instanceof PoStorageService).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('getDefaultConfig: should return the PoStorageConfig default ', () => {
      const configDefault = {
        name: '_postorage',
        storeName: '_pokv',
        driverOrder: ['websql', 'indexeddb', 'localstorage', 'lokijs']
      };

      expect(PoStorageService.getDefaultConfig()).toEqual(configDefault);
    });

    it('providePoStorage: should create a PoStorageService object', () => {
      const result = PoStorageService.providePoStorage();

      expect(result instanceof PoStorageService).toBeTruthy();
    });

    it('providePoStorage: should call getConfig with parameter', () => {
      const storageConfig = {
        name: '_testName',
        storeName: '_storeNameTest',
        driverOrder: ['websql', 'indexeddb', 'localstorage']
      };

      spyOn(PoStorageService, <any>'getConfig');

      PoStorageService.providePoStorage(storageConfig);

      expect(PoStorageService['getConfig']).toHaveBeenCalledWith(storageConfig);
    });

    it('providePoStorage: should call getConfig with undefined', () => {
      spyOn(PoStorageService, <any>'getConfig');

      PoStorageService.providePoStorage();

      expect(PoStorageService['getConfig']).toHaveBeenCalledWith(undefined);
    });

    it('getConfig: should return storage config parameter', () => {
      const storageConfig = {
        name: '_testName',
        storeName: '_storeNameTest',
        driverOrder: ['websql', 'indexeddb', 'localstorage']
      };

      expect(PoStorageService['getConfig'](storageConfig)).toEqual(storageConfig);
    });

    it('getConfig: should call and return getDefaultConfig', () => {
      const configDefault = {
        name: '_postorage',
        storeName: '_pokv',
        driverOrder: ['websql', 'indexeddb', 'localstorage', 'lokijs']
      };

      spyOn(PoStorageService, 'getDefaultConfig').and.returnValue(configDefault);

      expect(PoStorageService['getConfig']()).toEqual(configDefault);
    });

    it('constructor: should call setStoragePromise with config', () => {
      let storageService: PoStorageService;

      spyOn(PoStorageService.prototype, <any>'setStoragePromise');

      storageService = new PoStorageService(getConfigMock());

      expect(storageService['setStoragePromise']).toHaveBeenCalledWith(getConfigMock());
    });

    it('appendArrayToArray: should call poStorageService.set with key and array concatenated', async () => {
      const valueMock = ['value 2'];
      const oldArray = ['value 1'];
      const keyMock = 'key';

      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve(oldArray));
      spyOn(poStorageService, 'set');

      await poStorageService.appendArrayToArray(keyMock, valueMock);

      expect(poStorageService.set).toHaveBeenCalledWith(keyMock, [...oldArray, ...valueMock]);
    });

    it('appendArrayToArray: should call poStorageService.getArrayOfStorage with key', async () => {
      const keyMock = 'key';

      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve([]));

      await poStorageService.appendArrayToArray(keyMock, []);

      expect(poStorageService['getArrayOfStorage']).toHaveBeenCalledWith(keyMock);
    });

    it('appendItemToArray: should call poStorageService.set with key and the new array', async () => {
      const valueMock = 'value 2';
      const keyMock = 'key';

      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve(['value 1']));
      spyOn(poStorageService, 'set');

      await poStorageService.appendItemToArray(keyMock, valueMock);

      expect(poStorageService.set).toHaveBeenCalledWith(keyMock, ['value 1', valueMock]);
    });

    it('appendItemToArray: should call poStorageService.getArrayOfStorage with key', async () => {
      const keyMock = 'key';

      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve([]));

      await poStorageService.appendItemToArray(keyMock, '');

      expect(poStorageService['getArrayOfStorage']).toHaveBeenCalledWith(keyMock);
    });

    it('clear: should call clear of LocalStorage', async () => {
      const clearSpy = jasmine.createSpy('clear');

      const fakeThis = {
        storagePromise: Promise.resolve({ clear: clearSpy })
      };

      await poStorageService.clear.apply(fakeThis);

      expect(clearSpy).toHaveBeenCalled();
    });

    it('exists: should return true when get return a value', async () => {
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve('value'));

      const isExists = await poStorageService.exists('key');

      expect(isExists).toBeTruthy();
    });

    it('exists: should return false when get return a value equal the null', async () => {
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve(null));

      const isExists = await poStorageService.exists('key');

      expect(isExists).toBeFalsy();
    });

    it('exists: should call get with key parameter', async () => {
      const key = 'key';
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve());

      await poStorageService.exists(key);

      expect(poStorageService.get).toHaveBeenCalledWith(key);
    });

    it('forEach: should call iterate with iteratorCallback', async () => {
      const iterateSpy = jasmine.createSpy('iterate');
      const iteratorCallback = () => 'value';

      const fakeThis = {
        storagePromise: Promise.resolve({ iterate: iterateSpy })
      };

      await poStorageService.forEach.apply(fakeThis, [iteratorCallback]);

      expect(iterateSpy).toHaveBeenCalledWith(iteratorCallback);
    });

    it(`get: should call getImmutableItem of LocalStorage with keyStorage and not call requestIdlePromise and wrapCall
      if lock is false`, async () => {
      const keyStorage = 'key';

      const fakeThis = {
        requestIdlePromise: () => {},
        getImmutableItem: arg => {},
        idleQueue: {
          wrapCall: () => {}
        }
      };

      spyOn(fakeThis, 'requestIdlePromise');
      spyOn(fakeThis, 'getImmutableItem');
      spyOn(fakeThis.idleQueue, 'wrapCall');

      await poStorageService.get.apply(fakeThis, [keyStorage]);

      expect(fakeThis.requestIdlePromise).not.toHaveBeenCalled();
      expect(fakeThis.idleQueue.wrapCall).not.toHaveBeenCalled();
      expect(fakeThis.getImmutableItem).toHaveBeenCalledWith(keyStorage);
    });

    it('get: should call getImmutableItem with keyStorage, requestIdlePromise and wrapCall if lock is true', async () => {
      const keyStorage = 'key';
      const lock = true;

      const fakeThis: any = {
        requestIdlePromise: () => {},
        getImmutableItem: () => {},
        idleQueue: {
          wrapCall: () => {}
        }
      };

      spyOn(fakeThis, 'requestIdlePromise');
      spyOn(fakeThis, 'getImmutableItem');
      spyOn(fakeThis.idleQueue, 'wrapCall').and.callFake(callback => callback());

      await poStorageService.get.apply(fakeThis, [keyStorage, lock]);

      expect(fakeThis.requestIdlePromise).toHaveBeenCalled();
      expect(fakeThis.idleQueue.wrapCall).toHaveBeenCalled();
      expect(fakeThis.getImmutableItem).toHaveBeenCalledWith(keyStorage);
    });

    it('getDriver: should return poStorageService.driver', () => {
      poStorageService['driver'] = 'driver name';

      expect(poStorageService.getDriver()).toBe('driver name');
    });

    it('getDriverOrder: should return driver order with LocalForage driver and replace the other string for undefined', () => {
      const driverOrder = ['websql', 'indexeddb', 'localstorage', 'lokijs'];
      const driverOrderLocalForage = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE, 'lokijs'];

      expect(poStorageService['getDriverOrder'](driverOrder)).toEqual(driverOrderLocalForage);
    });

    it('getDriverOrder: should return driver order com LocalForage driver', () => {
      const driverOrder = ['websql', 'indexeddb', 'localstorage'];
      const driverOrderLocalForage = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];

      expect(poStorageService['getDriverOrder'](driverOrder)).toEqual(driverOrderLocalForage);
    });

    it('getFirstItem: should return the first item of storage array', async () => {
      const firstItem = 'first item';
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve([firstItem, 'second item', 'third item']));

      expect(await poStorageService.getFirstItem('key')).toBe(firstItem);
    });

    it('getFirstItem: should return null when "get" return the falsy value', async () => {
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve());

      expect(await poStorageService.getFirstItem('key')).toBeNull();
    });

    it('getFirstItem: should call "get" with key', async () => {
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve());

      await poStorageService.getFirstItem('key');

      expect(poStorageService.get).toHaveBeenCalledWith('key');
    });

    it('getItemAndRemove: should return first item and call "set" without the first item of array', async () => {
      const firstItem = 'first item';
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve([firstItem, 'second item', 'third item']));
      spyOn(poStorageService, 'set').and.returnValue(Promise.resolve());

      const result = await poStorageService.getItemAndRemove('key');

      expect(poStorageService.set).toHaveBeenCalledWith('key', ['second item', 'third item']);
      expect(result).toBe(firstItem);
    });

    it('getItemAndRemove: should return null when "get" return null in Promise', async () => {
      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve(null));

      expect(await poStorageService.getItemAndRemove('key')).toBeNull();
    });

    it('getItemByField: should return value by field of the storage key', async () => {
      const array = [{ key: 'value 1' }, { key2: 'value 1' }];

      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve(array));

      const result = await poStorageService.getItemByField('keyStorage', 'key2', 'value 1');

      expect(result).toEqual({ key2: 'value 1' });
    });

    it('getItemByField: should return null when value not found', async () => {
      const array = [{ key: 'value 1' }, { key2: 'value 1' }];

      spyOn(poStorageService, 'get').and.returnValue(Promise.resolve(array));

      const result = await poStorageService.getItemByField('keyStorage', 'key2', 'non-existent value');

      expect(result).toBeNull();
    });

    it('keys: should call keys of LocalStorage', async () => {
      const keysSpy = jasmine.createSpy('keys');

      const fakeThis = {
        storagePromise: Promise.resolve({ keys: keysSpy })
      };

      await poStorageService.keys.apply(fakeThis);

      expect(keysSpy).toHaveBeenCalled();
    });

    it('length: should call length of LocalStorage', async () => {
      const lengthSpy = jasmine.createSpy('length');

      const fakeThis = {
        storagePromise: Promise.resolve({ length: lengthSpy })
      };

      await poStorageService.length.apply(fakeThis);

      expect(lengthSpy).toHaveBeenCalled();
    });

    it('limitedCallWrap: should call requestIdlePromise and wrapCall and return value of wrapCall', async () => {
      const fakefunction = () => {};
      const wrapCallReturn = 'value';

      spyOn(poStorageService, 'requestIdlePromise');
      spyOn(poStorageService['idleQueue'], 'wrapCall').and.returnValue(<any>wrapCallReturn);

      const result = await poStorageService.limitedCallWrap(fakefunction);

      expect(poStorageService.requestIdlePromise).toHaveBeenCalled();
      expect(poStorageService['idleQueue'].wrapCall).toHaveBeenCalledWith(fakefunction);
      expect(result).toBe(wrapCallReturn);
    });

    it('lock: should call idleQueue.lock', () => {
      spyOn(poStorageService['idleQueue'], 'lock');

      poStorageService.lock();

      expect(poStorageService['idleQueue'].lock).toHaveBeenCalled();
    });

    it('ready: should return storagePromise', async () => {
      const storage = await poStorageService['storagePromise'];

      expect(await poStorageService.ready()).toEqual(storage);
    });

    it('remove: should call removeItem of LocalStorage', async () => {
      const removeItemSpy = jasmine.createSpy('removeItem');

      const fakeThis = {
        storagePromise: Promise.resolve({ removeItem: removeItemSpy })
      };

      await poStorageService.remove.apply(fakeThis, ['key']);

      expect(removeItemSpy).toHaveBeenCalledWith('key');
    });

    it('removeIndexFromObject: should call "set" with keyStorage and testObject without key2', async () => {
      const testObject = { key1: 'value 1', key2: 'value 2' };

      spyOn(poStorageService, <any>'getObjectOfStorage').and.returnValue(Promise.resolve(testObject));
      spyOn(poStorageService, 'set');

      await poStorageService.removeIndexFromObject('keyStorage', 'key2');
      expect(poStorageService.set).toHaveBeenCalledWith('keyStorage', { key1: 'value 1' });
    });

    it('removeIndexFromObject: should call "getObjectOfStorage" with keyStorage', async () => {
      spyOn(poStorageService, <any>'getObjectOfStorage').and.returnValue(Promise.resolve({}));

      await poStorageService.removeIndexFromObject('keyStorage', 'field');
      expect(poStorageService['getObjectOfStorage']).toHaveBeenCalledWith('keyStorage');
    });

    it('removeItemFromArray: should call "set" with keyStorage and testArray without key2 object', async () => {
      const testArray = [{ key1: 'value 1' }, { key2: 'value 2' }];

      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve(testArray));
      spyOn(poStorageService, 'set');

      await poStorageService.removeItemFromArray('keyStorage', 'key2', 'value 2');
      expect(poStorageService.set).toHaveBeenCalledWith('keyStorage', [{ key1: 'value 1' }]);
    });

    it('removeItemFromArray: should call "getObjectOfStorage" with keyStorage', async () => {
      spyOn(poStorageService, <any>'getArrayOfStorage').and.returnValue(Promise.resolve([]));

      await poStorageService.removeItemFromArray('keyStorage', 'field', 'value');
      expect(poStorageService['getArrayOfStorage']).toHaveBeenCalledWith('keyStorage');
    });

    it('requestIdlePromise: should call idleQueue.requestIdlePromise', async () => {
      spyOn(poStorageService['idleQueue'], 'requestIdlePromise');

      await poStorageService.requestIdlePromise();

      expect(poStorageService['idleQueue'].requestIdlePromise).toHaveBeenCalled();
    });

    it(`set: should call setItem of LocalStorage with key and value and not call requestIdlePromise and wrapCall
      if lock is false`, async () => {
      const key = 'key';
      const lock = false;
      const setItemSpy = jasmine.createSpy('setItem');
      const value = 'value';

      const fakeThis = {
        storagePromise: Promise.resolve({ setItem: setItemSpy }),
        requestIdlePromise: () => {},
        idleQueue: {
          wrapCall: () => {}
        }
      };

      spyOn(fakeThis, 'requestIdlePromise');
      spyOn(fakeThis.idleQueue, 'wrapCall');

      await poStorageService.set.apply(fakeThis, [key, value, lock]);

      expect(fakeThis.requestIdlePromise).not.toHaveBeenCalled();
      expect(fakeThis.idleQueue.wrapCall).not.toHaveBeenCalled();
      expect(setItemSpy).toHaveBeenCalledWith(key, value);
    });

    it('set: should call setItem with key and value, requestIdlePromise and wrapCall if lock is true', async () => {
      const key = 'key';
      const lock = true;
      const setItemSpy = jasmine.createSpy('setItem');
      const value = 'value';

      const fakeThis: any = {
        storagePromise: Promise.resolve({ setItem: setItemSpy }),
        requestIdlePromise: () => {},
        idleQueue: {
          wrapCall: () => {}
        }
      };

      spyOn(fakeThis, 'requestIdlePromise');
      spyOn(fakeThis.idleQueue, 'wrapCall').and.callFake(callback => callback());

      await poStorageService.set.apply(fakeThis, [key, value, lock]);

      expect(fakeThis.requestIdlePromise).toHaveBeenCalled();
      expect(fakeThis.idleQueue.wrapCall).toHaveBeenCalled();
      expect(setItemSpy).toHaveBeenCalledWith(key, value);
    });

    it('setIndexToObject: should call "set" with keyStorage and new object', async () => {
      const oldObject = { key1: 'value 1' };
      const newObject = { key1: 'value 1', key2: 'value 2' };

      spyOn(poStorageService, <any>'getObjectOfStorage').and.returnValue(Promise.resolve(oldObject));
      spyOn(poStorageService, 'set');

      await poStorageService.setIndexToObject('keyStorage', 'key2', 'value 2');
      expect(poStorageService.set).toHaveBeenCalledWith('keyStorage', newObject);
    });

    it('setIndexToObject: should call "getObjectOfStorage" with keyStorage', async () => {
      spyOn(poStorageService, <any>'getObjectOfStorage').and.returnValue(Promise.resolve({}));

      await poStorageService.setIndexToObject('keyStorage', 'key', 'value');
      expect(poStorageService['getObjectOfStorage']).toHaveBeenCalledWith('keyStorage');
    });

    it('unlock: should call idleQueue.unlock', () => {
      spyOn(poStorageService['idleQueue'], 'unlock');

      poStorageService.unlock();

      expect(poStorageService['idleQueue'].unlock).toHaveBeenCalled();
    });

    it('getArrayOfStorage: should return the value of "get"', async () => {
      spyOn(poStorageService, 'get').and.returnValue(<any>['value']);

      expect(await poStorageService['getArrayOfStorage']('keyStorage')).toEqual(['value']);
    });

    it('getArrayOfStorage: should return a empty object when "get" return undefined', async () => {
      spyOn(poStorageService, 'get').and.returnValue(undefined);

      expect(await poStorageService['getArrayOfStorage']('keyStorage')).toEqual([]);
    });

    it('getImmutableItem: should call getItem with key and return a new reference of items', async () => {
      const item = { value: 'value' };
      const getItemSpy = jasmine.createSpy('getItem').and.returnValue(item);
      const keyStorage = 'key';

      const fakeThis = {
        storagePromise: Promise.resolve({ getItem: getItemSpy })
      };

      const getImmutable = await poStorageService['getImmutableItem'].call(fakeThis, keyStorage);

      expect(getItemSpy).toHaveBeenCalledWith(keyStorage);
      expect(getImmutable === item).toBe(false);
    });

    it('getImmutableItem: should return null if does`t have item', async () => {
      const item = undefined;
      const getItemSpy = jasmine.createSpy('getItem').and.returnValue(item);
      const keyStorage = 'key';

      const fakeThis = {
        storagePromise: Promise.resolve({ getItem: getItemSpy })
      };

      const getImmutable = await poStorageService['getImmutableItem'].call(fakeThis, keyStorage);

      expect(getImmutable).toBeNull();
    });

    it(`defineLocalForageDriver: should call setDriver with localForage and driverOrder and call defineDriver with
    lokijs.getDriver return`, async () => {
      const localForageMock: LocalForage = createLocalForageInstance();
      const driverOrder = ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE', 'lokijs'];

      spyOn(localForageMock, 'defineDriver');
      spyOn(poStorageService, <any>'setDriver');
      spyOn(poStorageService['lokijsDriver'], 'getDriver').and.returnValue('lokijs');

      await poStorageService['defineLocalForageDriver'](localForageMock, driverOrder);

      expect(localForageMock.defineDriver).toHaveBeenCalledWith(<any>'lokijs');
      expect(poStorageService['setDriver']).toHaveBeenCalledWith(localForageMock, driverOrder);
    });

    it('getObjectOfStorage: should return the value of "get"', async () => {
      spyOn(poStorageService, 'get').and.returnValue(<any>{ key: 'value' });

      expect(await poStorageService['getObjectOfStorage']('keyStorage')).toEqual({ key: 'value' });
    });

    it('getObjectOfStorage: should return a empty object when "get" return undefined', async () => {
      spyOn(poStorageService, 'get').and.returnValue(undefined);

      expect(await poStorageService['getObjectOfStorage']('keyStorage')).toEqual({});
    });

    it('should call setDriver of LocalStorage with driver order', async () => {
      const driverOrder = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];
      const localForageMock: LocalForage = createLocalForageInstance();

      spyOn(poStorageService, <any>'getDriverOrder').and.returnValue(driverOrder);
      spyOn(localForageMock, 'setDriver').and.returnValue(Promise.resolve());

      await poStorageService['setDriver'](localForageMock, ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE']);

      expect(localForageMock.setDriver).toHaveBeenCalledWith(driverOrder);
    });

    it('should call getDriverOrder with driver order parameter', async () => {
      const driverOrder = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];
      const localForageMock: LocalForage = createLocalForageInstance();

      const driverOrderParameter = ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE'];

      spyOn(poStorageService, <any>'getDriverOrder').and.returnValue(driverOrder);
      spyOn(localForageMock, 'setDriver').and.returnValue(Promise.resolve());

      await poStorageService['setDriver'](localForageMock, driverOrderParameter);

      expect(poStorageService['getDriverOrder']).toHaveBeenCalledWith(driverOrderParameter);
    });

    it('should call driver of LocalStorage', async () => {
      const driverOrder = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];
      const localForageMock: LocalForage = createLocalForageInstance();

      spyOn(poStorageService, <any>'getDriverOrder').and.returnValue(driverOrder);
      spyOn(localForageMock, 'setDriver').and.returnValue(Promise.resolve());
      spyOn(localForageMock, 'driver');

      await poStorageService['setDriver'](localForageMock, ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE']);

      expect(localForageMock.driver).toHaveBeenCalled();
    });

    it('should set poStorage.driver with driver of LocalForage', async () => {
      const driverOrder = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];
      const localForageMock: LocalForage = createLocalForageInstance();

      const fakeThis = {
        driver: undefined,
        getDriverOrder: () => driverOrder
      };

      spyOn(localForageMock, 'setDriver').and.returnValue(Promise.resolve());
      spyOn(localForageMock, 'driver').and.returnValue('driverLocalForage');

      await poStorageService['setDriver'].apply(fakeThis, [localForageMock, ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE']]);

      expect(fakeThis.driver).toBe('driverLocalForage');
    });

    it('setStoragePromise: should call getStorageInstance with configMock', () => {
      const driverOrder = [LocalForage.WEBSQL, LocalForage.INDEXEDDB, LocalForage.LOCALSTORAGE];

      const configMock: PoStorageConfig = {
        driverOrder: driverOrder,
        name: 'baseName',
        storeName: 'storeName'
      };

      spyOn(poStorageService, <any>'getStorageInstance');

      poStorageService['setStoragePromise'](configMock);

      expect(poStorageService['getStorageInstance']).toHaveBeenCalledWith(configMock);
    });

    it('setStoragePromise: should set storagePromise with return of the getStorageInstance', () => {
      const fakeThis = {
        getStorageInstance: () => 'localStorage',
        storagePromise: undefined
      };

      poStorageService['setStoragePromise'].apply(fakeThis, []);

      expect(fakeThis.storagePromise).toBe('localStorage');
    });

    it('getStorageInstance: should call getDefaultConfig', async () => {
      spyOn(PoStorageService, 'getDefaultConfig').and.returnValue({});
      spyOn(poStorageService, <any>'setDriver');

      await poStorageService['getStorageInstance'](getConfigMock());

      expect(PoStorageService.getDefaultConfig).toHaveBeenCalled();
    });

    it('getStorageInstance: should return throw Error when setDriver return a exception', async () => {
      const driverOrder = ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE', 'lokijs'];
      const localForageMock: LocalForage = createLocalForageInstance();

      spyOn(LocalForage, 'createInstance').and.returnValue(localForageMock);
      spyOn(PoStorageService, 'getDefaultConfig').and.returnValue({});
      spyOn(poStorageService, <any>'defineLocalForageDriver').and.returnValue(Promise.reject(''));

      expect(await handleThrowError(poStorageService['getStorageInstance'](getConfigMock()))).toThrowError(
        `Cannot use this drivers: ${driverOrder.join(', ')}.`
      );
    });

    it('getStorageInstance: should return localForage instance', async () => {
      const localForageMock: LocalForage = createLocalForageInstance();

      spyOn(LocalForage, 'createInstance').and.returnValue(localForageMock);
      spyOn(PoStorageService, 'getDefaultConfig').and.returnValue({});
      spyOn(poStorageService, <any>'setDriver').and.returnValue(Promise.resolve());

      expect(await poStorageService['getStorageInstance'](getConfigMock())).toEqual(localForageMock);
    });
  });
});

function createLocalForageInstance() {
  return LocalForage.createInstance(getConfigMock());
}

function getConfigMock() {
  return {
    driverOrder: ['WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE', 'lokijs'],
    name: 'baseName',
    storeName: 'storeName'
  };
}
