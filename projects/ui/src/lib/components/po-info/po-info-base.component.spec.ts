import { PoThemeA11yEnum } from '../../services';
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

    describe('p-size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set property with valid values for accessibility level is AA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });
  });
});
