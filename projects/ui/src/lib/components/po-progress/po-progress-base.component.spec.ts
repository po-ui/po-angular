import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoProgressBaseComponent } from './po-progress-base.component';

describe('PoProgressBaseComponent:', () => {
  const component = new PoProgressBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoProgressBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-indeterminate: should update property with `true` if valid values', () => {
      const validValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'indeterminate', validValues, true);
    });

    it('p-indeterminate: should update property with `false` if invalid values', () => {
      const invalidValues = [10, 0.5, 'test', undefined];

      expectPropertiesValues(component, 'indeterminate', invalidValues, false);
    });

    it('p-value: should update property with valid values', () => {
      const validValues = ['1', 25, 100, '50'];
      const expectedValues = [1, 25, 100, 50];

      expectPropertiesValues(component, 'value', validValues, expectedValues);
    });

    it('p-value: should update property with `0` if invalid values', () => {
      const validValues = [150, 'test', -1, 1000];

      expectPropertiesValues(component, 'value', validValues, 0);
    });
  });

  describe('Methods:', () => {
    it(`isProgressRangeValue: should be 'true' if 'value' is greater than 0`, () => {
      const value = 20;
      expect(component['isProgressRangeValue'](value)).toBeTruthy();
    });

    it(`isProgressRangeValue: should be 'true' if 'value' equals 0`, () => {
      const value = 0;
      expect(component['isProgressRangeValue'](value)).toBeTruthy();
    });

    it(`isProgressRangeValue: should be 'true' if 'value' equals 100`, () => {
      const value = 100;
      expect(component['isProgressRangeValue'](value)).toBeTruthy();
    });

    it(`isProgressRangeValue: should be 'false' if 'value' is less than 0`, () => {
      const value = -2;
      expect(component['isProgressRangeValue'](value)).toBeFalsy();
    });

    it(`isProgressRangeValue: should be 'false' if 'value' is greater than 100`, () => {
      const value = 120;
      expect(component['isProgressRangeValue'](value)).toBeFalsy();
    });
  });
});
