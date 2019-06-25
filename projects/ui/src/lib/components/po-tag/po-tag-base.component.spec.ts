import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';

describe('PoTagBaseComponent:', () => {
  const component = new PoTagBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoTagBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('icon: should update with true value.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'icon', booleanValidTrueValues, true);
    });

    it('icon: should update with false value.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN];

      expectPropertiesValues(component, 'icon', booleanInvalidValues, false);
    });

    it('orientation: should update property with valid values', () => {
      const validValues = (<any>Object).values(PoTagOrientation);

      expectPropertiesValues(component, 'orientation', validValues, validValues);
    });

    it('orientation: should update property with `PoTagOrientation.vertical` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'orientation', invalidValues, PoTagOrientation.Vertical);
    });

    it('type: should update property with valid values', () => {
      const validValues = ['danger', 'info', 'success', 'warning'];

      expectPropertiesValues(component, 'type', validValues, validValues);
    });

    it('type: should update property with `info` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, -1, 12, 15, 'aa', [], {}];

      expectPropertiesValues(component, 'type', invalidValues, 'info');
    });

    it('iconFromType: should update property with valid values', () => {
      component.type = PoTagType.Danger;
      expect(component.iconFromType).toBe(PoTagIcon.Danger);

      component.type = PoTagType.Danger;
      expect(component.iconFromType).toBe(PoTagIcon.Danger);

      component.type = PoTagType.Danger;
      expect(component.iconFromType).toBe(PoTagIcon.Danger);

      component.type = PoTagType.Danger;
      expect(component.iconFromType).toBe(PoTagIcon.Danger);
    });

  });

});
