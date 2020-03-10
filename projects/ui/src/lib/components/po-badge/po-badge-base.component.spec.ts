import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoBadgeBaseComponent } from './po-badge-base.component';

describe('PoBadgeBaseComponent:', () => {
  const component = new PoBadgeBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoBadgeBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-color: should update with valid values', () => {
      const validValues = ['color-01', 'color-02', 'color-03', 'color-04', 'color-12', 'color-08'];

      expectPropertiesValues(component, 'color', validValues, validValues);
    });

    it('p-color: should update with invalid values', () => {
      const invalidValues = [true, false, undefined, 'color-13', 'color-100', 'color-8', [], {}, null, 0];

      expectPropertiesValues(component, 'color', invalidValues, 'color-07');
    });

    it('p-value: should update with valid values and call `setBadgeValue`', () => {
      const validValues = [10, 200, 50, 0, 999];

      spyOn(component, <any>'setBadgeValue');

      expectPropertiesValues(component, 'value', validValues, validValues);
      expect(component['setBadgeValue']).toHaveBeenCalled();
    });

    it('p-value: should update with invalid values and call `setBadgeValue`', () => {
      const invalidValues = [true, false, undefined, 'string', [], {}, null];

      spyOn(component, <any>'setBadgeValue');

      expectPropertiesValues(component, 'value', invalidValues, undefined);
      expect(component['setBadgeValue']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it(`setBadgeValue: should set 'badgeValue' with 'undefined' if value is 'undefined'`, () => {
      component['setBadgeValue'](undefined);

      expect(component.badgeValue).toBe(undefined);
    });

    it(`setBadgeValue: should set 'badgeValue' with '99+' if value is greater than '99'`, () => {
      component['setBadgeValue'](100);

      expect(component.badgeValue).toBe('99+');
    });

    it(`setBadgeValue: should set 'badgeValue' with '55' if value is '55'`, () => {
      component['setBadgeValue'](55);

      expect(component.badgeValue).toBe('55');
    });

    it(`setBadgeValue: should set 'badgeValue' with '0' if value is '0'`, () => {
      component['setBadgeValue'](0);

      expect(component.badgeValue).toBe('0');
    });

    it(`setBadgeValue: should set 'badgeValue' with '99' if value is '99'`, () => {
      component['setBadgeValue'](99);

      expect(component.badgeValue).toBe('99');
    });
  });
});
