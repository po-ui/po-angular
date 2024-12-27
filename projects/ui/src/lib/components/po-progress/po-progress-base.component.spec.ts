import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { convertToBoolean } from '../../utils/util';

import { PoProgressBaseComponent } from './po-progress-base.component';

describe('PoProgressBaseComponent:', () => {
  const component = new PoProgressBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoProgressBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-disabled-cancel: should update property with `true` if valid values', () => {
      component.disabledCancel = convertToBoolean(1);

      expect(component.disabledCancel).toBe(true);
    });

    it('p-disabled-cancel: should update property with `false` if invalid values', () => {
      component.disabledCancel = convertToBoolean(3);

      expect(component.disabledCancel).toBe(false);
    });

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

    it('should update property `p-size` with valid values', () => {
      const validValues = ['large', 'medium'];

      expectPropertiesValues(component, 'size', validValues, validValues);
    });

    it('should update property `p-size` with large if has not valid values', () => {
      const invalidValues = ['extrasmall', 'huge', 'extralarge'];

      expectPropertiesValues(component, 'size', invalidValues, 'large');
    });

    describe('p-custom-action:', () => {
      it('should accept a valid PoProgressAction', () => {
        const validCustomAction = {
          label: 'Download',
          icon: 'ph ph-download',
          type: 'default',
          visible: true,
          disabled: false
        };

        component.customAction = validCustomAction;

        expect(component.customAction).toEqual(validCustomAction);
      });

      it('should handle undefined or null values for customAction', () => {
        const invalidValues = [null, undefined];

        invalidValues.forEach(value => {
          component.customAction = value;
          expect(component.customAction).toBeFalsy();
        });
      });

      it('should respect the visible property when it is a boolean', () => {
        component.customAction = { label: 'Download', visible: true };

        expect(component.customAction.visible).toBeTrue();
      });

      it('should respect the visible property when it is a function', () => {
        component.customAction = { label: 'Download', visible: () => false };

        const isVisible = (component.customAction.visible as Function)();

        expect(isVisible).toBeFalse();
      });

      it('should respect the disabled property when it is a boolean', () => {
        component.customAction = { label: 'Download', disabled: true };

        expect(component.customAction.disabled).toBeTrue();
      });

      it('should respect the disabled property when it is a function', () => {
        component.customAction = { label: 'Download', disabled: () => true };

        const isDisabled = (component.customAction.disabled as Function)();

        expect(isDisabled).toBeTrue();
      });
    });
    describe('p-custom-action-click:', () => {
      it('should emit when the event is triggered', () => {
        spyOn(component.customActionClick, 'emit');

        const mockFile = { name: 'example.txt' };
        component.customActionClick.emit(mockFile);

        expect(component.customActionClick.emit).toHaveBeenCalledWith(mockFile);
      });
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
