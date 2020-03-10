import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoContainerBaseComponent } from './po-container-base.component';

describe('PoContainerBaseComponent:', () => {
  const component = new PoContainerBaseComponent();

  it('should be created.', () => {
    expect(component instanceof PoContainerBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-height: should update property with valid values.', () => {
      const validValues = [0, 1500, 500, 200, 8000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('p-height: should update property with `undefined` if values are invalid.', () => {
      component.height = <any>'one';
      expect(component.height).toBeUndefined();

      component.height = <any>false;
      expect(component.height).toBeUndefined();
    });

    it('p-no-border: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'noBorder', validValues, expectedValues);
    });

    it('p-no-border: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'noBorder', invalidValues, false);
    });

    it('p-no-padding: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'noPadding', validValues, expectedValues);
    });

    it('p-no-padding: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'noPadding', invalidValues, false);
    });

    it('p-no-shadow: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'noShadow', validValues, expectedValues);
    });

    it('p-no-shadow: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'noShadow', invalidValues, false);
    });
  });
});
