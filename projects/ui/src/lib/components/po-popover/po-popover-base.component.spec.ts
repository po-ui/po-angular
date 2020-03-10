import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoPopoverBaseComponent } from './po-popover-base.component';

describe('PoPopoverBaseComponent:', () => {
  const component = new PoPopoverBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoPopoverBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('hideArrow: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];
      const expectedReturn = true;

      expectPropertiesValues(component, 'hideArrow', booleanValidTrueValues, expectedReturn);
    });

    it('hideArrow: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN];
      const expectedReturn = false;

      expectPropertiesValues(component, 'hideArrow', booleanInvalidValues, expectedReturn);
    });

    it('should set trigger click when pass value different from hover', () => {
      const otherValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'trigger', otherValues, 'click');
    });

    it('should update property `p-trigger` with valid values', () => {
      const otherValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];
      const defaultTrigger = 'click';

      expectPropertiesValues(component, 'trigger', otherValues, defaultTrigger);
    });

    it('should return default value.', () => {
      const validValues = ['click', 'hover'];

      expectPropertiesValues(component, 'trigger', validValues, validValues);
    });

    it('should set position right when pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'position', invalidValues, 'right');
    });

    it('should update property `p-position` with valid values', () => {
      const validValues = [
        'right',
        'right-top',
        'right-bottom',
        'top',
        'top-left',
        'top-right',
        'left',
        'left-top',
        'left-bottom',
        'bottom',
        'bottom-left',
        'bottom-right'
      ];

      expectPropertiesValues(component, 'position', validValues, validValues);
    });
  });
});
