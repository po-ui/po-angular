import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoStorageService } from '@po-ui/ng-storage';

import { PoSchemaDefinitionService } from './po-schema-definition.service';
import { PoSchemaUtil } from './../po-schema-util/po-schema-util.model';
import { PoSyncSchema } from './../../po-sync/interfaces/po-sync-schema.interface';

@Injectable()
class PoStorageServiceMock extends PoStorageService {
  constructor() {
    super();
  }
}

describe('PoSchemaDefinitionService:', () => {
  let poSchemaDefinitionService: PoSchemaDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoSchemaDefinitionService, { provide: PoStorageService, useClass: PoStorageServiceMock }]
    });

    poSchemaDefinitionService = TestBed.inject(PoSchemaDefinitionService);
  });

  it('should be created', () => {
    expect(poSchemaDefinitionService instanceof PoSchemaDefinitionService).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`destroy: should call poStorage.remove with PoSchemaUtil.syncSchemasName`, async () => {
      spyOn(poSchemaDefinitionService['poStorage'], 'remove');

      await poSchemaDefinitionService.destroy();

      expect(poSchemaDefinitionService['poStorage'].remove).toHaveBeenCalledWith(PoSchemaUtil.syncSchemasName);
    });

    it('get: should call poStorage.getItemByField with PoSchemaUtil.syncSchemasName, field name and schema name', async () => {
      const schemaName = 'schema name';

      spyOn(poSchemaDefinitionService['poStorage'], 'getItemByField');

      await poSchemaDefinitionService.get(schemaName);

      expect(poSchemaDefinitionService['poStorage'].getItemByField).toHaveBeenCalledWith(
        PoSchemaUtil.syncSchemasName,
        'name',
        schemaName
      );
    });

    it(`getAll: should call poStorage.get with PoSchemaUtil.syncSchemasName`, async () => {
      spyOn(poSchemaDefinitionService['poStorage'], 'get');

      await poSchemaDefinitionService.getAll();

      expect(poSchemaDefinitionService['poStorage'].get).toHaveBeenCalledWith(PoSchemaUtil.syncSchemasName);
    });

    it(`saveAll: should call poStorage.set with PoSchemaUtil.syncSchemasName and schemas`, async () => {
      const schema: PoSyncSchema = {
        getUrlApi: '',
        diffUrlApi: '',
        deletedField: 'deleted',
        fields: ['field1', 'field2', 'field3'],
        idField: 'id',
        name: 'schemaName',
        pageSize: 1
      };

      const schemas = [schema];
      spyOn(poSchemaDefinitionService['poStorage'], 'set');

      await poSchemaDefinitionService.saveAll(schemas);

      expect(poSchemaDefinitionService['poStorage'].set).toHaveBeenCalledWith(PoSchemaUtil.syncSchemasName, schemas);
    });

    it('update: should call getAll and saveAll with updated schemas', async () => {
      const schema1 = {
        idField: 'id',
        getUrlApi: 'http://url/api/v1/user',
        diffUrlApi: 'http://url/api/v1/user/diff',
        name: 'Schema 1',
        deletedField: 'deleted',
        fields: ['id', 'name'],
        pageSize: 10
      };

      const schemas = [
        { ...schema1 },
        {
          idField: 'id',
          getUrlApi: 'http://url/api/v1/user',
          diffUrlApi: 'http://url/api/v1/user/diff',
          name: 'Schema 2',
          deletedField: 'deleted',
          fields: ['id', 'name'],
          pageSize: 10
        }
      ];

      const schemaUpdated: PoSyncSchema = {
        idField: 'id',
        getUrlApi: 'http://url/api/v1/customers',
        diffUrlApi: 'http://url/api/v1/customers/diff',
        deleteUrlApi: 'http://url/api/v1/customers/delete',
        name: 'Schema 2',
        lastSync: '2018-08-20',
        deletedField: 'deleted',
        fields: ['id', 'name'],
        pageSize: 20
      };

      const schemasUpdated = [schema1, schemaUpdated];

      spyOn(poSchemaDefinitionService, 'getAll').and.returnValue(<any>schemas);
      spyOn(poSchemaDefinitionService, 'saveAll');

      await poSchemaDefinitionService.update(schemaUpdated);

      expect(poSchemaDefinitionService.getAll).toHaveBeenCalled();
      expect(poSchemaDefinitionService.saveAll).toHaveBeenCalledWith(schemasUpdated);
    });
  });
});
