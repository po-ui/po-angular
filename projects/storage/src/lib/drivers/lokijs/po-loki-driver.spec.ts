import { PoLokiDriver } from './po-loki-driver';

import * as LocalForage from 'localforage';
import { handleThrowError } from '../../util-test/util';

describe('PoLokiDriver', () => {
  const items = [
    { id: 'item1', value: 'value1' },
    { id: 'item2', value: 'value2' },
    { id: 'item3', value: 'value3' },
    { id: 'item4', value: 'value4' },
    { id: 'item5', value: 'value5' }
  ];

  describe('Iteration methods:', () => {
    const poLokiDriver = new PoLokiDriver();

    it('should be created', () => {
      expect(poLokiDriver instanceof PoLokiDriver).toBeTruthy();
    });

    describe('constructor:', () => {
      it('should call initStorage', () => {
        spyOn(poLokiDriver, <any>'initStorage');

        poLokiDriver['driver']._initStorage(null);

        expect(poLokiDriver['initStorage']).toHaveBeenCalled();
      });

      it('should call clear', () => {
        spyOn(poLokiDriver, <any>'clear');

        poLokiDriver['driver'].clear(null);

        expect(poLokiDriver['clear']).toHaveBeenCalled();
      });

      it('should call getItem', () => {
        spyOn(poLokiDriver, <any>'getItem');

        poLokiDriver['driver'].getItem(null);

        expect(poLokiDriver['getItem']).toHaveBeenCalled();
      });

      it('should call iterate', () => {
        spyOn(poLokiDriver, <any>'iterate');

        poLokiDriver['driver'].iterate(null);

        expect(poLokiDriver['iterate']).toHaveBeenCalled();
      });

      it('should call key', () => {
        spyOn(poLokiDriver, <any>'key');

        poLokiDriver['driver'].key(null);

        expect(poLokiDriver['key']).toHaveBeenCalled();
      });

      it('should call keys', () => {
        spyOn(poLokiDriver, <any>'keys');

        poLokiDriver['driver'].keys(null);

        expect(poLokiDriver['keys']).toHaveBeenCalled();
      });

      it('should call length', () => {
        spyOn(poLokiDriver, <any>'length');

        poLokiDriver['driver'].length(null);

        expect(poLokiDriver['length']).toHaveBeenCalled();
      });

      it('should call removeItem', () => {
        spyOn(poLokiDriver, <any>'removeItem');

        poLokiDriver['driver'].removeItem(null);

        expect(poLokiDriver['removeItem']).toHaveBeenCalled();
      });

      it('should call setItem', () => {
        spyOn(poLokiDriver, <any>'setItem');

        poLokiDriver['driver'].setItem(null);

        expect(poLokiDriver['setItem']).toHaveBeenCalled();
      });
    });

    it(`clear: should call 'clearCollection' if 'hasCollectionAndDataInCollection' return 'true'`, async () => {
      const localForage = createLocalForageInstance();

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'clearCollection');

      await poLokiDriver['clear'](localForage);

      expect(poLokiDriver['clearCollection']).toHaveBeenCalled();
    });

    it(`clear: shouldn't call 'clearCollection' if 'hasCollectionAndDataInCollection' return 'false'`, async () => {
      const localForage = createLocalForageInstance();

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'clearCollection');

      await poLokiDriver['clear'](localForage);

      expect(poLokiDriver['clearCollection']).not.toHaveBeenCalled();
    });

    it(`getItem: should call 'getItemInCollectionBy' if 'hasCollectionAndDataInCollection' return 'true'`, async () => {
      const localForage = createLocalForageInstance();
      const key = 'key1';

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy');

      await poLokiDriver['getItem'](localForage, key);

      expect(poLokiDriver['getItemInCollectionBy']).toHaveBeenCalled();
    });

    it(`getItem: shouldn't call 'getItemInCollectionBy' if 'hasCollectionAndDataInCollection' return 'false'`, async () => {
      const localForage = createLocalForageInstance();
      const key = 'key1';

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy');

      await poLokiDriver['getItem'](localForage, key);

      expect(poLokiDriver['getItemInCollectionBy']).not.toHaveBeenCalled();
    });

    it(`getItem: should return item value if item is found`, async () => {
      const localForage = createLocalForageInstance();
      const key = 'key1';

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy').and.returnValue({ value: 'value1' });

      expect(await poLokiDriver['getItem'](localForage, key)).toBe('value1');
    });

    it(`getItem: should return null if item is not found`, async () => {
      const localForage = createLocalForageInstance();
      const key = 'key1';

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy').and.returnValue(undefined);

      expect(await poLokiDriver['getItem'](localForage, key)).toBeNull();
    });

    it(`getItem: should return null if hasCollectionAndDataInCollection return false`, async () => {
      const localForage = createLocalForageInstance();
      const key = 'key1';

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(false);

      expect(await poLokiDriver['getItem'](localForage, key)).toBeNull();
    });

    it('initStorage: should call `configureLokiStorage` and `databaseInitialize.bind`', () => {
      spyOn(poLokiDriver, <any>'configureLokiStorage');
      spyOn(poLokiDriver['databaseInitialize'], <never>'bind');

      poLokiDriver['initStorage'](getConfigMock());

      expect(poLokiDriver['configureLokiStorage']).toHaveBeenCalled();
      expect(poLokiDriver['databaseInitialize'].bind).toHaveBeenCalled();
    });

    it('initStorage: should return a error if configureLokiStorage return an error', async () => {
      spyOn(poLokiDriver, <any>'configureLokiStorage').and.throwError('');

      expect(await handleThrowError(poLokiDriver['initStorage'](getConfigMock()))).toThrowError(
        `Cannot configure Loki Storage`
      );
    });

    it(`iterate: should call 'iterateWithDataItem' with 'iteratorcallback' if 'hasCollectionAndDataInCollection'
    return true`, async () => {
      const localForage = createLocalForageInstance();
      const iteratorCallbackMock = () => {};

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'iterateWithDataItem');

      await poLokiDriver['iterate'](localForage, iteratorCallbackMock);

      expect(poLokiDriver['iterateWithDataItem']).toHaveBeenCalledWith(iteratorCallbackMock);
    });

    it(`iterate: shouldn't call 'iterateWithDataItem' if 'hasCollectionAndDataInCollection' return false`, async () => {
      const localForage = createLocalForageInstance();
      const iteratorCallbackMock = () => {};

      spyOn(poLokiDriver, <any>'hasCollectionAndDataInCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'iterateWithDataItem');

      await poLokiDriver['iterate'](localForage, iteratorCallbackMock);

      expect(poLokiDriver['iterateWithDataItem']).not.toHaveBeenCalled();
    });

    it(`key: should call 'getLokiMap' and return item value passed by parameter if 'hasCollection' return true`, async () => {
      const localForage = createLocalForageInstance();
      const nMock = 1;
      const getLokiMapItems = items;

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getLokiMap').and.returnValue(getLokiMapItems);

      expect(await poLokiDriver['key'](localForage, nMock)).toEqual({ id: 'item2', value: 'value2' });
      expect(poLokiDriver['getLokiMap']).toHaveBeenCalled();
    });

    it(`key: shouldn't call 'getLokiMap' and return null if 'hasCollection' return false`, async () => {
      const localForage = createLocalForageInstance();
      const nMock = 1;
      const getLokiMapItems = items;

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'getLokiMap').and.returnValue(getLokiMapItems);

      expect(await poLokiDriver['key'](localForage, nMock)).toBeNull();
      expect(poLokiDriver['getLokiMap']).not.toHaveBeenCalled();
    });

    it(`keys: should call 'getLokiMap' and return an array of keys if 'hasCollection' return true`, async () => {
      const localForage = createLocalForageInstance();
      const getAllLokiMapItems = { 1: 'key1', 2: 'key2', key: 'key3' };
      const result = ['key1', 'key2', 'key3'];

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getLokiMap').and.returnValue(getAllLokiMapItems);

      expect(await poLokiDriver['keys'](localForage)).toEqual(result);
      expect(poLokiDriver['getLokiMap']).toHaveBeenCalled();
    });

    it(`keys: shouldn't call 'getLokiMap' and return null if 'hasCollection' return false`, async () => {
      const localForage = createLocalForageInstance();

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'getLokiMap');

      expect(await poLokiDriver['keys'](localForage)).toBeNull();
      expect(poLokiDriver['getLokiMap']).not.toHaveBeenCalled();
    });

    it(`length: should call 'getNumberItensInCollection' and return a number of items in collection`, async () => {
      const localForage = createLocalForageInstance();
      const numberOfItemsInCollection = 12;

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getNumberItensInCollection').and.returnValue(numberOfItemsInCollection);

      expect(await poLokiDriver['length'](localForage)).toEqual(numberOfItemsInCollection);
      expect(poLokiDriver['getNumberItensInCollection']).toHaveBeenCalled();
    });

    it(`length: shouldn't call 'getNumberItensInCollection' and return zero if hasCollection return false`, async () => {
      const localForage = createLocalForageInstance();

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'getNumberItensInCollection');

      expect(await poLokiDriver['length'](localForage)).toBe(0);
      expect(poLokiDriver['getNumberItensInCollection']).not.toHaveBeenCalled();
    });

    it(`removeItem: should call 'findAndRemoveItem' with key parameter if hasCollection return true`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'findAndRemoveItem');

      await poLokiDriver['removeItem'](localForage, keyParameter);

      expect(poLokiDriver['findAndRemoveItem']).toHaveBeenCalledWith(keyParameter);
    });

    it(`removeItem: shouldn't call 'findAndRemoveItem' if hasCollection return false`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'findAndRemoveItem');

      await poLokiDriver['removeItem'](localForage, keyParameter);

      expect(poLokiDriver['findAndRemoveItem']).not.toHaveBeenCalled();
    });

    it(`setItem: should call 'hasDataInCollection' and 'insertOrUpdate' if 'hasCollection' return true`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection');
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      await poLokiDriver['setItem'](localForage, keyParameter, valueParameter);

      expect(poLokiDriver['hasDataInCollection']).toHaveBeenCalled();
      expect(poLokiDriver['insertOrUpdate']).toHaveBeenCalled();
    });

    it(`setItem: should call 'getItemInCollectionBy' if 'hasCollection' and 'hasDataInCollection' return true`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy');
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      await poLokiDriver['setItem'](localForage, keyParameter, valueParameter);

      expect(poLokiDriver['getItemInCollectionBy']).toHaveBeenCalled();
    });

    it(`setItem: should call 'insertOrUpdate' with 'getItemInCollectionBy' return, keyParameter and valueParameter`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';
      const getItemInCollectionByReturn = { id: 'value' };

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy').and.returnValue(getItemInCollectionByReturn);
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      await poLokiDriver['setItem'](localForage, keyParameter, valueParameter);

      expect(poLokiDriver['insertOrUpdate']).toHaveBeenCalledWith(
        getItemInCollectionByReturn,
        valueParameter,
        keyParameter
      );
    });

    it(`setItem: should resolve with valueParameter value`, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection');
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      expect(await poLokiDriver['setItem'](localForage, keyParameter, valueParameter)).toBe(valueParameter);
    });

    it(`setItem: shouldn't call 'hasDataInCollection', 'getItemInCollectionBy' and 'insertOrUpdate' if 'hasCollection'
    return false `, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'hasDataInCollection');
      spyOn(poLokiDriver, <any>'getItemInCollectionBy');
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      await poLokiDriver['setItem'](localForage, keyParameter, valueParameter);

      expect(poLokiDriver['hasDataInCollection']).not.toHaveBeenCalled();
      expect(poLokiDriver['getItemInCollectionBy']).not.toHaveBeenCalled();
      expect(poLokiDriver['insertOrUpdate']).not.toHaveBeenCalled();
    });

    it(`setItem: shouldn't call 'getItemInCollectionBy' if 'hasCollection' return true and 'hasDataInCollection'
    return false `, async () => {
      const localForage = createLocalForageInstance();
      const keyParameter = 'key1';
      const valueParameter = 'value1';

      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'getItemInCollectionBy');
      spyOn(poLokiDriver, <any>'insertOrUpdate');

      await poLokiDriver['setItem'](localForage, keyParameter, valueParameter);

      expect(poLokiDriver['getItemInCollectionBy']).not.toHaveBeenCalled();
    });
  });

  describe('Access storage methods :', () => {
    const poLokiDriver = new PoLokiDriver();

    it(`getDriver: should return driver`, () => {
      const driver = 'lokijs';

      poLokiDriver['driver'] = driver;

      expect(poLokiDriver.getDriver()).toBe(driver);
    });

    it(`addCollection: should call 'db.addCollection' with 'options.storeName' and '{ unique: ['key'] }`, () => {
      const fakeThis = {
        db: {
          addCollection: (arg1, arg2) => {}
        }
      };
      const fakeOptions = { storeName: 'store' };

      spyOn(fakeThis.db, 'addCollection');

      poLokiDriver['addCollection'].call(fakeThis, fakeOptions);

      expect(fakeThis.db.addCollection).toHaveBeenCalledWith(fakeOptions.storeName, { unique: ['key'] });
    });

    it(`clearCollection: should call 'collection.clear' with '{ removeIndices: false }'`, () => {
      const fakeThis = {
        collection: {
          clear: arg => {}
        }
      };
      spyOn(fakeThis.collection, 'clear');

      poLokiDriver['clearCollection'].call(fakeThis);

      expect(fakeThis.collection.clear).toHaveBeenCalledWith({ removeIndices: false });
    });

    it('configureLokiStorage: should set lokijs options with set up default values', () => {
      const databaseInitializedMock = function databaseInitialize() {};

      poLokiDriver['configureLokiStorage'](getConfigMock(), databaseInitializedMock);

      const dbOptions = poLokiDriver['db'].options;

      // O LokiJs cria uma instancia interna com o valor do adapter para gerenciar as configurações do adapter e em seguida
      // seta o valor do adapter para null. (pode ser verificado na linha 1011 do arquivo lokijs.js no nodeModules).
      expect(dbOptions.adapter).toBeNull();

      expect(dbOptions.autoload).toBe(true);
      expect(dbOptions.autoloadCallback).toBe(databaseInitializedMock);
      expect(dbOptions.autosave).toBe(true);
      expect(dbOptions.autosaveInterval).toBe(4000);
    });

    it(`findAndRemoveItem: should call 'collection.findAndRemove' with '{ key: <keyParameter> }'`, () => {
      const fakeThis = {
        collection: {
          findAndRemove: arg => {}
        }
      };
      const keyParameter = 'key1';

      spyOn(fakeThis.collection, 'findAndRemove');

      poLokiDriver['findAndRemoveItem'].call(fakeThis, keyParameter);

      expect(fakeThis.collection.findAndRemove).toHaveBeenCalledWith({ key: keyParameter });
    });

    it(`getCollection: should call 'db.getCollection' with 'options.storeName'`, () => {
      const fakeThis = {
        db: {
          getCollection: arg => {}
        }
      };
      const fakeOptions = { storeName: 'store' };

      spyOn(fakeThis.db, 'getCollection');

      poLokiDriver['getCollection'].call(fakeThis, fakeOptions);

      expect(fakeThis.db.getCollection).toHaveBeenCalledWith(fakeOptions.storeName);
    });

    it(`databaseInitialize: should call 'getCollection' with 'options' and call 'hasCollection'`, () => {
      const fakeThis = {
        collection: undefined,
        getCollection: arg => {},
        hasCollection: () => {},
        addCollection: () => {}
      };
      const fakeOptions = { storeName: 'store' };
      const fakeResolve = () => {};

      spyOn(fakeThis, 'getCollection');
      spyOn(fakeThis, 'hasCollection');
      spyOn(fakeThis, 'addCollection');

      poLokiDriver['databaseInitialize'].call(fakeThis, fakeOptions, fakeResolve);

      expect(fakeThis['getCollection']).toHaveBeenCalledWith(fakeOptions);
      expect(fakeThis['hasCollection']).toHaveBeenCalled();
    });

    it(`databaseInitialize: should call 'addCollection' with 'options' if 'hasCollection' return false`, () => {
      const fakeThis = {
        collection: undefined,
        getCollection: () => {},
        hasCollection: () => false,
        addCollection: arg => {}
      };
      const fakeOptions = { storeName: 'store' };
      const fakeResolve = () => {};

      spyOn(fakeThis, 'getCollection');
      spyOn(fakeThis, 'hasCollection').and.returnValue(false);
      spyOn(fakeThis, 'addCollection');

      poLokiDriver['databaseInitialize'].call(fakeThis, fakeOptions, fakeResolve);

      expect(fakeThis['addCollection']).toHaveBeenCalledWith(fakeOptions);
    });

    it(`databaseInitialize: shouldn't call 'addCollection' with 'options' if 'hasCollection' return true`, () => {
      const fakeThis = {
        collection: undefined,
        getCollection: () => {},
        hasCollection: () => true,
        addCollection: () => {}
      };
      const fakeOptions = { storeName: 'store' };
      const fakeResolve = () => {};

      spyOn(fakeThis, 'getCollection');
      spyOn(fakeThis, 'hasCollection').and.returnValue(true);
      spyOn(fakeThis, 'addCollection');

      poLokiDriver['databaseInitialize'].call(fakeThis, fakeOptions, fakeResolve);

      expect(fakeThis['addCollection']).not.toHaveBeenCalled();
    });

    it(`getItemInCollectionBy: should call 'collection.by' with 'fieldKey' and 'key' parameters`, () => {
      const fakeThis = {
        collection: {
          by: (arg1, arg2) => {}
        }
      };
      const fakeFieldKey = 'fieldKey';
      const fakeKey = 'Key';

      spyOn(fakeThis.collection, 'by');

      poLokiDriver['getItemInCollectionBy'].call(fakeThis, fakeFieldKey, fakeKey);

      expect(fakeThis.collection.by).toHaveBeenCalledWith(fakeFieldKey, fakeKey);
    });

    it(`getLokiMap: should return lokiMap`, () => {
      const fakeThis = {
        collection: {
          constraints: {
            unique: {
              key: {
                lokiMap: 'lokiMapValue'
              }
            }
          }
        }
      };

      expect(poLokiDriver['getLokiMap'].call(fakeThis)).toBe('lokiMapValue');
    });

    it(`hasCollection: should return a collection value`, () => {
      const fakeThis = {
        collection: 'collection'
      };

      expect(poLokiDriver['hasCollection'].call(fakeThis)).toBeTruthy();

      fakeThis.collection = undefined;

      expect(poLokiDriver['hasCollection'].call(fakeThis)).toBeUndefined();

      fakeThis.collection = null;

      expect(poLokiDriver['hasCollection'].call(fakeThis)).toBeNull();
    });

    it(`hasDataInCollection: should return true if has data in collection`, () => {
      const fakeThis = {
        collection: {
          data: 'value1'
        }
      };

      expect(poLokiDriver['hasDataInCollection'].call(fakeThis)).toBeTruthy();
    });

    it(`hasDataInCollection: should return false if doesn't has data in collection`, () => {
      const fakeThis = {
        collection: {
          data: undefined
        }
      };

      expect(poLokiDriver['hasDataInCollection'].call(fakeThis)).toBeFalsy();
    });

    it(`hasCollectionAndDataInCollection: should return true if 'hasCollection' and 'hasDataInCollection' return true`, () => {
      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(true);

      expect(poLokiDriver['hasCollectionAndDataInCollection']()).toBeTruthy();
    });

    it(`hasCollectionAndDataInCollection: should return false if 'hasCollection' return false`, () => {
      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(false);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(true);

      expect(poLokiDriver['hasCollectionAndDataInCollection']()).toBeFalsy();
    });

    it(`hasCollectionAndDataInCollection: should return false if 'hasDataInCollection' return false`, () => {
      spyOn(poLokiDriver, <any>'hasCollection').and.returnValue(true);
      spyOn(poLokiDriver, <any>'hasDataInCollection').and.returnValue(false);

      expect(poLokiDriver['hasCollectionAndDataInCollection']()).toBeFalsy();
    });

    it(`insertOrUpdate: should call 'update' with item with value and doesn't call 'insert' if has item parameter`, () => {
      const fakeThis = {
        collection: {
          update: arg => {},
          insert: () => {}
        }
      };
      const itemParameter = { value: 'value1' };
      const valueParameter = 'value2';
      const keyParameter = 'key';

      spyOn(fakeThis.collection, 'update');
      spyOn(fakeThis.collection, 'insert');

      poLokiDriver['insertOrUpdate'].call(fakeThis, itemParameter, valueParameter, keyParameter);

      expect(fakeThis.collection.update).toHaveBeenCalledWith({ value: valueParameter });
      expect(fakeThis.collection.insert).not.toHaveBeenCalled();
    });

    it(`insertOrUpdate: should call 'insert' with key and value and doesn't call 'insert' if doesn't have
    item parameter`, () => {
      const fakeThis = {
        collection: {
          update: () => {},
          insert: arg => {}
        }
      };
      const itemParameter = undefined;
      const valueParameter = 'value2';
      const keyParameter = 'key';

      spyOn(fakeThis.collection, 'update');
      spyOn(fakeThis.collection, 'insert');

      poLokiDriver['insertOrUpdate'].call(fakeThis, itemParameter, valueParameter, keyParameter);

      expect(fakeThis.collection.update).not.toHaveBeenCalled();
      expect(fakeThis.collection.insert).toHaveBeenCalledWith({ key: keyParameter, value: valueParameter });
    });

    it(`iterateWithDataItem: should call 'forEach'`, () => {
      const fakeThis = {
        collection: {
          data: items
        }
      };

      const iteratorParameter = {
        iteratorCallbackFunctionMock: () => {}
      };

      spyOn(iteratorParameter, 'iteratorCallbackFunctionMock');

      poLokiDriver['iterateWithDataItem'].call(fakeThis, iteratorParameter.iteratorCallbackFunctionMock);

      expect(iteratorParameter.iteratorCallbackFunctionMock).toHaveBeenCalledTimes(5);
    });

    it(`getNumberItensInCollection: should call 'collection.count'`, () => {
      const fakeThis = {
        collection: {
          count: () => {}
        }
      };

      spyOn(fakeThis.collection, 'count');

      poLokiDriver['getNumberItensInCollection'].call(fakeThis);

      expect(fakeThis.collection.count).toHaveBeenCalled();
    });
  });
});

function createLocalForageInstance() {
  return LocalForage.createInstance(getConfigMock());
}

function getConfigMock() {
  return {
    driverOrder: ['lokijs', 'WEBSQL', 'INDEXEDDB', 'LOCALSTORAGE'],
    name: 'store',
    storeName: 'storeName'
  };
}
