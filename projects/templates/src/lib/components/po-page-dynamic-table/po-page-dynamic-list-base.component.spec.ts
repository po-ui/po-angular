import { PoPageDynamicListBaseComponent } from './po-page-dynamic-list-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoPageDynamicListBaseComponent:', () => {
  const component = new PoPageDynamicListBaseComponent();
  const cityOptions = [{ label: 'São Paulo', value: 'sp' }];

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('autoRouter: should update property with valid values', () => {
      const validValuesTrue = [true, 'true', 1, ''];
      const validValuesFalse = [false, 'false', 0];

      expectPropertiesValues(component, 'autoRouter', validValuesTrue, true);
      expectPropertiesValues(component, 'autoRouter', validValuesFalse, false);
    });

    it('autoRouter: should update property with false if invalid values', () => {
      const invalidValues = [null, undefined, NaN, 'teste'];

      expectPropertiesValues(component, 'autoRouter', invalidValues, false);
    });

    it('fields: should set `fields` to `[]` if not Array value', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      spyOn(component, <any>'setFieldsProperties');

      expectPropertiesValues(component, 'fields', invalidValues, []);
      expect(component['setFieldsProperties']).toHaveBeenCalled();
    });

    it('fields: should update property `p-fields` with valid values and call `setFieldsProperties`', () => {
      const validValues = [[{ property: 'Teste 1' }], [{ property: 'Teste 2' }]];

      spyOn(component, <any>'setFieldsProperties');

      expectPropertiesValues(component, 'fields', validValues, validValues);
      expect(component['setFieldsProperties']).toHaveBeenCalled();
    });

    it('fields: should set `filters` with fields that have `filter` as true', () => {
      const newFields = [
        { property: 'name', filter: true },
        { property: 'birthdateTo', label: 'Birthdate', type: 'date', filter: true, visible: false },
        { property: 'state', options: cityOptions, visible: false },
        { property: 'address', visible: true, filter: false }
      ];

      component.fields = newFields;

      expect(component.filters).toEqual([
        { property: 'name', filter: true, visible: true },
        { property: 'birthdateTo', label: 'Birthdate', type: 'date', filter: true, visible: true }
      ]);
    });

    it('fields: should set `columns` with fields that have `allowColumnsManager` and `visible` as true', () => {
      const newFields = [
        { property: 'name', filter: true },
        { property: 'birthdate', label: 'Birthdate', type: 'date', filter: true, visible: false },
        { property: 'state', options: cityOptions, visible: false, allowColumnsManager: true },
        { property: 'address', visible: true, filter: false }
      ];

      component.fields = newFields;

      expect(component.columns).toEqual([
        { property: 'name', filter: true },
        { property: 'state', options: cityOptions, visible: false, allowColumnsManager: true },
        { property: 'address', visible: true, filter: false }
      ]);
    });

    it('columns: should return a new reference', () => {
      const columns = [
        { property: 'id', key: true },
        { property: 'name', label: 'Name', filter: true, visible: true, gridColumns: 6 }
      ];

      component.columns = columns;

      expect(component.columns).toEqual(columns);
      expect(component.columns).not.toBe(columns);
    });
  });

  describe('Methods:', () => {
    describe('setFieldsProperties:', () => {
      let fields: Array<any>;

      beforeEach(() => {
        fields = [
          { property: 'id', key: true },
          { property: 'name', label: 'Name', filter: true, visible: true, gridColumns: 6 },
          { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true },
          { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 },
          { property: 'city', label: 'City', filter: true, duplicate: true, gridColumns: 12 }
        ];
      });

      it('should set `filters` with items that have the `filter` property', () => {
        const filtersResult = [
          { property: 'name', label: 'Name', filter: true, visible: true, gridColumns: 6 },
          { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, visible: true, duplicate: true },
          { property: 'city', label: 'City', filter: true, duplicate: true, visible: true, gridColumns: 12 }
        ];

        component['setFieldsProperties'](fields);

        expect(component.filters).toEqual(filtersResult);
      });

      it('should set `filters` with visible equal false to items that have the `fixed` and `initValue` properties', () => {
        fields = [
          { property: 'id', key: true },
          { property: 'name', label: 'Name', filter: true, visible: true, gridColumns: 6 },
          { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true, fixed: true },
          { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 },
          {
            property: 'city',
            label: 'City',
            filter: true,
            duplicate: true,
            gridColumns: 12,
            fixed: true,
            initValue: 'Joinville'
          }
        ];

        const filtersResult = [
          { property: 'name', label: 'Name', filter: true, visible: true, gridColumns: 6 },
          {
            property: 'genre',
            label: 'Genre',
            filter: true,
            gridColumns: 6,
            visible: true,
            duplicate: true,
            fixed: true
          },
          {
            property: 'city',
            label: 'City',
            filter: true,
            duplicate: true,
            visible: false,
            gridColumns: 12,
            fixed: true,
            initValue: 'Joinville'
          }
        ];

        component['setFieldsProperties'](fields);

        expect(component.filters).toEqual(filtersResult);
      });

      it('should set `filters` with [] if no item has the `filter` property', () => {
        const fieldsWithoutFilter = [
          { property: 'id', key: true },
          { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 }
        ];
        const filtersResult = [];

        component['setFieldsProperties'](fieldsWithoutFilter);

        expect(component.filters).toEqual(filtersResult);
      });

      it('should set `columns` with all fields properties', () => {
        component['setFieldsProperties'](fields);

        expect(component.columns).toEqual(fields);
      });

      it('should set `columns` with [] if fields is []', () => {
        const fieldsEmpty = [];

        component['setFieldsProperties'](fieldsEmpty);

        expect(component.filters).toEqual(fieldsEmpty);
      });

      it('should set `keys` with items that have the `key` property', () => {
        const keysResult = ['id'];

        component['setFieldsProperties'](fields);

        expect(component.keys).toEqual(keysResult);
      });

      it('should set `keys` with [] if no item has the `key` property', () => {
        const fieldsWithoutKey = [
          { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 },
          { property: 'city', label: 'City', filter: true, duplicate: true, gridColumns: 12 }
        ];
        const keysResult = [];

        component['setFieldsProperties'](fieldsWithoutKey);

        expect(component.keys).toEqual(keysResult);
      });

      it('should set `duplicates` with items that have the `duplicate` property', () => {
        const duplicatesResult = ['genre', 'city'];

        component['setFieldsProperties'](fields);

        expect(component.duplicates).toEqual(duplicatesResult);
      });

      it('should set `duplicates` with [] if no item has the `duplicate` property', () => {
        const fieldsWithoutDuplicate = [
          { property: 'birthdate', label: 'Birthdate', type: 'date', gridColumns: 6 },
          { property: 'city', label: 'City', filter: true, gridColumns: 12 }
        ];
        const duplicatesResult = [];

        component['setFieldsProperties'](fieldsWithoutDuplicate);

        expect(component.duplicates).toEqual(duplicatesResult);
      });
    });
  });
  describe('setColumns:', () => {
    it('should correctly sort columns by order, placing undefined or invalid orders at the end', () => {
      const unorderedColumns = [
        { property: 'name', order: 3 },
        { property: 'birthdate', order: 1 },
        { property: 'address' }, // Sem 'order', deve ser colocado no final
        { property: 'city', order: 2 },
        { property: 'country', order: -1 } // 'order' inválido, deve ser tratado como se estivesse sem 'order'
      ];

      const orderedColumns = [
        { property: 'birthdate', order: 1 },
        { property: 'city', order: 2 },
        { property: 'name', order: 3 },
        { property: 'address' }, // Mantém a posição original entre os sem 'order'
        { property: 'country', order: -1 } // Mantém a posição original entre os sem 'order'
      ];

      // Aqui estamos testando o comportamento indiretamente através do setter `columns`
      component.columns = unorderedColumns;

      expect(component.columns).toEqual(orderedColumns);
    });
    it('should correctly handle columns with duplicate order values by maintaining their original relative order', () => {
      const duplicateOrderColumns = [
        { property: 'name', order: 2 },
        { property: 'birthdate', order: 1 },
        { property: 'city', order: 2 }, // Duplicado 'order' com 'name'
        { property: 'country', order: 1 } // Duplicado 'order' com 'birthdate'
      ];

      const expectedOrderWithDuplicates = [
        { property: 'birthdate', order: 1 },
        { property: 'country', order: 1 }, // Mantém ordem relativa original para valores de 'order' duplicados
        { property: 'name', order: 2 },
        { property: 'city', order: 2 } // Mantém ordem relativa original para valores de 'order' duplicados
      ];

      component.columns = duplicateOrderColumns;

      expect(component.columns).toEqual(expectedOrderWithDuplicates);
    });
    it('should ignore non-integer order properties and treat them as having no order', () => {
      const mixedOrderColumns = [
        { property: 'name', order: '3' }, // 'order' como string
        { property: 'birthdate', order: 1 },
        { property: 'city', order: 'two' }, // 'order' inválido como string
        { property: 'address', order: null } // 'order' como null
      ];

      const expectedOrder = [
        { property: 'birthdate', order: 1 },
        { property: 'name', order: '3' }, // Mantido como sem 'order'
        { property: 'city', order: 'two' }, // Mantido como sem 'order'
        { property: 'address', order: null } // Mantido como sem 'order'
      ];

      component.columns = mixedOrderColumns;

      expect(component.columns).toEqual(expectedOrder);
    });
    it('should maintain the original order of columns without an order property at the end', () => {
      const columnsWithoutOrder = [
        { property: 'name' },
        { property: 'birthdate' },
        { property: 'city' },
        { property: 'country' }
      ];

      component.columns = columnsWithoutOrder;

      expect(component.columns).toEqual(columnsWithoutOrder);
    });
  });
});
