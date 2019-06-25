import { PoPageDynamicSearchBaseComponent } from './po-page-dynamic-search-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoPageDynamicSearchBaseComponent', () => {
  const component = new PoPageDynamicSearchBaseComponent();

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {

    it('filters: should set `filters` to `[]` if not Array value' , () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', {}];

      expectPropertiesValues(component, 'filters', invalidValues, []);
    });

    it('filters: should update property `p-filters` with valid values', () => {
      const validValues = [ [{ property: 'Teste 1' }], [{ property: 'Teste 2' }] ];

      expectPropertiesValues(component, 'filters', validValues, validValues);
    });

  });

});
