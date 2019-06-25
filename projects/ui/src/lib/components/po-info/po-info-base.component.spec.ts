import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoInfoBaseComponent } from './po-info-base.component';
import { PoInfoOrientation } from './po-info-orietation.enum';

describe('PoInfoBaseComponent:', () => {
  const component = new PoInfoBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoInfoBaseComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-orientation: should update property with valid values', () => {
      const validValues = (<any>Object).values(PoInfoOrientation);

      expectPropertiesValues(component, 'orientation', validValues, validValues);
    });

    it('p-orientation: should update property with `PoInfoOrientation.vertical` when invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'orientation', invalidValues, PoInfoOrientation.Vertical);
    });

    it('p-label-size: should update property with valid values', () => {
      const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      expectPropertiesValues(component, 'labelSize', validValues, validValues);
    });

    it('p-label-size: should update property with `undefined` when invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, -1, 12, 15, 'aa', [], {}];

      expectPropertiesValues(component, 'labelSize', invalidValues, undefined);
    });
  });
});
