import { PoRequestType } from '../../../models/po-request-type.enum';
import { PoSchemaUtil } from './po-schema-util.model';
import { PoSyncSchema } from '../../po-sync/interfaces/po-sync-schema.interface';

describe('PoSchemaUtil:', () => {
  let schemas: Array<PoSyncSchema>;

  const mySchema: PoSyncSchema = {
    getUrlApi: 'http://poservices.po-ui.com.br/customer-api/api/v1/customers',
    diffUrlApi: 'http://poservices.po-ui.com.br/customer-api/api/v1/customers/diff',
    name: 'Customers',
    fields: [
      'id',
      'name',
      {
        name: 'status1',
        local: true
      },
      {
        name: 'status2',
        local: false
      }
    ],
    pageSize: 20,
    deletedField: 'deleted',
    idField: 'id'
  };

  const currentDate = new Date();

  schemas = [
    {
      getUrlApi: 'url',
      diffUrlApi: 'urldiff',
      fields: [],
      idField: 'id',
      name: 'Users',
      pageSize: 20,
      deletedField: 'deleted',
      lastSync: currentDate.toISOString()
    },
    {
      getUrlApi: 'url',
      diffUrlApi: 'urldiff',
      fields: [],
      idField: 'id',
      name: 'Products',
      pageSize: 20,
      deletedField: 'deleted'
    }
  ];

  describe('Methods:', () => {
    describe('containsLocalFields:', () => {
      it('should return true if schema contains local fields', () => {
        const schema = { ...schemas[0] };

        schema.fields = ['field1', { name: 'field2', local: true }];

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeTruthy();

        schema.fields = [
          { name: 'field1', local: true },
          { name: 'field2', local: true }
        ];

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeTruthy();

        schema.fields = [
          { name: 'field1', local: true },
          { name: 'field2', local: false }
        ];

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeTruthy();
      });

      it('should return false if schema not contains local fields', () => {
        const schema = { ...schemas[0] };
        schema.fields = ['field1', 'field2'];

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeFalsy();

        schema.fields = [
          { name: 'field1', local: false },
          { name: 'field2', local: false }
        ];

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeFalsy();

        schema.fields = undefined;

        expect(PoSchemaUtil.containsLocalFields(schema)).toBeFalsy();
      });
    });

    it('getRecordId: should return record id with record id value if record have a field name equal to idField value', () => {
      const record = { id: 'id1' };
      const getRecordId = PoSchemaUtil.getRecordId(record, mySchema);
      const result = 'id1';

      expect(getRecordId).toBe(result);
    });

    it(`getRecordId: should return record Id with syncInternalIdFieldName value if record not have a field name equal to
      idField value`, () => {
      const record = { [PoSchemaUtil.syncInternalIdFieldName]: 'id2' };
      const getRecordId = PoSchemaUtil.getRecordId(record, mySchema);
      const result = 'id2';

      expect(getRecordId).toBe(result);
    });

    it('getUrl: should returns getUrlApi property value when called with PoRequestType.GET', () => {
      const url = PoSchemaUtil.getUrl(mySchema, PoRequestType.GET);

      expect(url).toEqual(mySchema.getUrlApi);
    });

    it('getUrl: should returns undefined when called with PoRequestType.POST and postUrlApi is not defined', () => {
      const url = PoSchemaUtil.getUrl(mySchema, PoRequestType.POST);

      expect(url).toBeUndefined();
    });

    it('getLastSync: should returns same lastSync setted on schema', () => {
      const lastSync = PoSchemaUtil.getLastSync(schemas, 'Users');

      expect(lastSync).toEqual(currentDate.toISOString());
    });

    it('getLastSync: should returns default lastSync if not setted on schema ', () => {
      const lastSync = PoSchemaUtil.getLastSync(schemas, 'Products');

      expect(lastSync).toEqual(PoSchemaUtil.defaultLastSync);
    });

    it('getLastSync: should returns default lastSync if schemas is null', () => {
      const lastSync = PoSchemaUtil.getLastSync(null, 'Products');

      expect(lastSync).toEqual(PoSchemaUtil.defaultLastSync);
    });

    describe('getLocalFieldNames:', () => {
      it('should returns just local fields', () => {
        const localFields: Array<string> = PoSchemaUtil.getLocalFieldNames(mySchema);

        expect(localFields.length).toEqual(1);
        expect(localFields).toEqual(['status1']);
      });

      it('should not returns just local fields is schema is undefined', () => {
        const mySchemaTest = <any>{ fields: undefined };
        const localFields: Array<string> = PoSchemaUtil.getLocalFieldNames(mySchemaTest);

        expect(localFields).toBeFalsy();
      });
    });

    describe('getLocalFieldNames:', () => {
      it('should returns just fields that are not local', () => {
        const nonLocalFields: Array<string> = PoSchemaUtil.getNonLocalFieldNames(mySchema);

        expect(nonLocalFields.length).toEqual(3);
        expect(nonLocalFields).toEqual(['id', 'name', 'status2']);
      });
      it('should not returns just fields if schema is undefined', () => {
        const mySchemaTest = <any>{ fields: undefined };
        const nonLocalFields: Array<string> = PoSchemaUtil.getNonLocalFieldNames(mySchemaTest);

        expect(nonLocalFields).toBeFalsy();
      });
    });

    describe('isModelsEqual:', () => {
      it('should returns true if objects are equal', () => {
        const obj1 = { id: 1, name: 'Nome' };
        const obj2 = { id: 1, name: 'Nome' };

        const isEqual: boolean = PoSchemaUtil.isModelsEqual(['id', 'name'], obj1, obj2);

        expect(isEqual).toBeTruthy();
      });

      it('should returns false if objects are not equal', () => {
        const obj1 = { id: 2, name: 'Nomes' };
        const obj2 = { id: 1, name: 'Nome' };

        const isEqual: boolean = PoSchemaUtil.isModelsEqual(['id', 'name'], obj1, obj2);

        expect(isEqual).toBeFalsy();

        const isNotEqual: boolean = PoSchemaUtil.isModelsEqual(null, obj1, obj2);
        expect(isNotEqual).toBeFalsy();
      });
    });

    it('separateSchemaFields: should separate local fields to server fields.', () => {
      const schema = { ...schemas[0] };
      const localFields = ['field2'];
      const record = { field1: 'value1', field2: 'value2', field3: 'value3' };
      const result = {
        'serverRecord': { field1: 'value1', field3: 'value3' },
        'localRecord': { field2: 'value2' }
      };

      spyOn(PoSchemaUtil, 'getLocalFieldNames').and.returnValue(localFields);

      const separate = PoSchemaUtil.separateSchemaFields(schema, record);

      expect(separate).toEqual(result);
    });
  });
});
