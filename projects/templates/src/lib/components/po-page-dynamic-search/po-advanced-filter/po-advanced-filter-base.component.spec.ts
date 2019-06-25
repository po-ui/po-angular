import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

describe('PoAdvancedFilterBaseComponent', () => {
  const component = new PoAdvancedFilterBaseComponent();

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
