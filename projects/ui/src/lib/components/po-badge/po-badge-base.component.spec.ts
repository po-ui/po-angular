import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoBadgeBaseComponent } from './po-badge-base.component';

describe('PoBadgeBaseComponent:', () => {
  const component = new PoBadgeBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoBadgeBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-aria-label: set ariaLabel with empty when value equals undefined', () => {
      component.ariaLabel = undefined;

      expect(component.ariaLabel).toBe(undefined);
    });

    it('p-aria-label: set ariaLabel with value passed', () => {
      component.ariaLabel = 'Notification';

      expect(component.ariaLabel).toBe('Notification');
    });

    it('p-color: should update with valid values', () => {
      component.color = 'color-09';

      expect(component['_color']).toBe('color-09');
    });

    it('p-color: should update with invalid values and set value default `color-07`', () => {
      component.color = 'color-13';

      expect(component['_color']).toBe('color-07');
    });

    it('customColor: should update with valid values', () => {
      const validValues = ['#ffffff', 'red', 'rgb(201, 53, 125)'];

      expectPropertiesValues(component, 'customColor', validValues, validValues);
    });

    it('customColor: should update with valid values and HEX', () => {
      component.color = '#fff';

      expect(component.customColor).toBe('#fff');
    });

    it('p-value: should update with valid values', () => {
      const validValues = [10, 200, 50, 0, 999];

      expectPropertiesValues(component, 'value', validValues, validValues);
    });

    it('p-value: should update with invalid values', () => {
      const validValues = [-1, -20, -30];

      expectPropertiesValues(component, 'value', validValues, 0);
    });

    it('p-icon: should set icon when value if isnt null', () => {
      const iconFake = 'po-icon-minus';
      component.icon = iconFake;
      expect(component.icon).toBe(iconFake);
    });

    it('p-icon: should set icon undefined when  value if null', () => {
      const iconFake = undefined;
      component.icon = iconFake;
      expect(component.icon).toBe(undefined);
    });

    it(`setSize: should set 'size' with 'large' if value is 'large'`, () => {
      const newSize = 'large';

      component.size = newSize;

      expect(component['size']).toBe(newSize);
    });
  });
});
