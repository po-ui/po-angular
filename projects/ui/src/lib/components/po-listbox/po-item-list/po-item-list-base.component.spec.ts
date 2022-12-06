import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoItemListBaseComponent } from './po-item-list-base.component';

describe('PoListBoxBaseComponent', () => {
  const component = new PoItemListBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoItemListBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('should update property `p-type` with valid values', () => {
      const validValues = ['action', 'check', 'option'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });
    it('should update property `p-type` with invalid values', () => {
      const invalidValues = ['secondary', 'primary', 'default'];

      expectPropertiesValues(component, 'type', invalidValues, 'action');
    });
  });
});
