import Loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';

const keyField = 'key';

export class PoLokiDriver {
  private collection;
  private db: any;
  private driver: any;

  constructor() {
    const self = this;
    this.driver = {
      _driver: 'lokijs',
      _initStorage: function (options: any) {
        return self.initStorage(options);
      },
      clear: function () {
        return self.clear(this);
      },
      getItem: function (key: any) {
        return self.getItem(this, key);
      },
      iterate: function (iteratorCallback: any) {
        return self.iterate(this, iteratorCallback);
      },
      key: function (n: any) {
        return self.key(this, n);
      },
      keys: function () {
        return self.keys(this);
      },
      length: function () {
        return self.length(this);
      },
      removeItem: function (key: any) {
        return self.removeItem(this, key);
      },
      setItem: function (key: any, value: any) {
        return self.setItem(this, key, value);
      }
    };
  }

  // Funções de iteração

  private clear(localforage: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollectionAndDataInCollection()) {
          this.clearCollection();
        }
        resolve(null);
      });
    });
  }

  private getItem(localforage: any, key: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollectionAndDataInCollection()) {
          const item = this.getItemInCollectionBy(keyField, key);
          if (item) {
            resolve(item.value);
          }
        }
        resolve(null);
      });
    });
  }

  private initStorage(options: any) {
    return new Promise(resolve => {
      try {
        this.configureLokiStorage(options, this.databaseInitialize.bind(this, options, resolve));
      } catch {
        throw new Error(`Cannot configure Loki Storage`);
      }
    });
  }

  private iterate(localforage: any, iteratorCallback: Function) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollectionAndDataInCollection()) {
          this.iterateWithDataItem(iteratorCallback);
        }
        resolve(null);
      });
    });
  }

  private key(localforage: any, n: string | number) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollection()) {
          const map = this.getLokiMap();
          resolve(map[n]);
        }
        resolve(null);
      });
    });
  }

  private keys(localforage: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollection()) {
          const keys = [];
          const map = this.getLokiMap();
          for (const key of Object.keys(map)) {
            keys.push(map[key]);
          }
          resolve(keys);
        }
        resolve(null);
      });
    });
  }

  private length(localforage: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollection()) {
          resolve(this.getNumberItensInCollection());
        }
        resolve(0);
      });
    });
  }

  private removeItem(localforage: any, key: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollection()) {
          this.findAndRemoveItem(key);
        }
        resolve(null);
      });
    });
  }

  private setItem(localforage: any, key: any, value: any) {
    return new Promise(resolve => {
      localforage.ready().then(() => {
        if (this.hasCollection()) {
          let item: any;
          if (this.hasDataInCollection()) {
            item = this.getItemInCollectionBy(keyField, key);
          }
          this.insertOrUpdate(item, value, key);
        }
        resolve(value);
      });
    });
  }

  // Funções de acesso ao storage

  getDriver() {
    return this.driver;
  }

  private addCollection(options: any): any {
    return this.db.addCollection(options.storeName, { unique: [keyField] });
  }

  private clearCollection() {
    this.collection.clear({ removeIndices: false });
  }

  private configureLokiStorage(options: any, databaseInitialize: any) {
    const idbAdapter = new LokiIndexedAdapter();
    this.db = new Loki(options.name, {
      adapter: idbAdapter,
      autoload: true,
      autoloadCallback: databaseInitialize,
      autosave: true,
      autosaveInterval: 4000
    });
  }

  private findAndRemoveItem(key: any) {
    this.collection.findAndRemove({ [keyField]: key });
  }

  private getCollection(options: any): any {
    return this.db.getCollection(options.storeName);
  }

  private databaseInitialize(options: any, resolve: Function) {
    this.collection = this.getCollection(options);
    if (!this.hasCollection()) {
      this.collection = this.addCollection(options);
    }
    resolve();
  }

  private getItemInCollectionBy(fieldKey: string, key: any) {
    return this.collection.by(fieldKey, key);
  }

  private getLokiMap() {
    return this.collection.constraints.unique[keyField].lokiMap;
  }

  private hasCollection() {
    return this.collection;
  }

  private hasDataInCollection() {
    return this.collection.data && this.collection.data.length;
  }

  private hasCollectionAndDataInCollection() {
    return this.hasCollection() && this.hasDataInCollection();
  }

  private insertOrUpdate(item: any, value: any, key: any) {
    if (item) {
      item.value = value;
      this.collection.update(item);
    } else {
      this.collection.insert({ [keyField]: key, value: value });
    }
  }

  private iterateWithDataItem(iteratorcallback: Function) {
    this.collection.data.forEach(element => {
      iteratorcallback(element.value, element[keyField], element.$loki);
    });
  }

  private getNumberItensInCollection(): number {
    return this.collection.count();
  }
}
