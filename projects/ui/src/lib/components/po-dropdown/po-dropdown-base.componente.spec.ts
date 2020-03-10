import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

describe('PoDropdownBaseComponent:', () => {
  const component = new PoDropdownBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoDropdownBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('actions: should set actions to `[]` if pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('actions: should update property `p-actions` with valid value', () => {
      const validValue = [[{ label: 'action1', action: () => {} }], [{ label: 'action2' }]];

      expectPropertiesValues(component, 'actions', validValue, validValue);
    });

    it('disabled: should update property with true if valid values', () => {
      const validValues = [true, '', 'true'];

      expectPropertiesValues(component, 'disabled', validValues, true);
    });

    it('disabled: should update property with false if invalid values', () => {
      const invalidValues = [false, 'po', null, undefined, NaN];

      expectPropertiesValues(component, 'disabled', invalidValues, false);
    });
  });
});
