import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoTabsBaseComponent } from './po-tabs-base.component';

describe('PoTabsBaseComponent:', () => {
  const component = new PoTabsBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoTabsBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('small: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];
      const expectedReturn = true;

      expectPropertiesValues(component, 'small', booleanValidTrueValues, expectedReturn);
    });

    it('small: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];
      const expectedReturn = false;

      expectPropertiesValues(component, 'small', booleanInvalidValues, expectedReturn);
    });
  });
});
