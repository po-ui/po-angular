import { PoThemeA11yEnum } from '../../services';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

describe('PoDropdownBaseComponent:', () => {
  let component: PoDropdownBaseComponent;

  beforeEach(() => {
    component = new PoDropdownBaseComponent();
  });

  it('should be created', () => {
    expect(component instanceof PoDropdownBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('actions: should set actions to `[]` if pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'actions', invalidValues, []);
    });

    it('actions: should update property `p-actions` with valid value', () => {
      const validValue = [[{ label: 'action1', action: () => {} }], [{ label: 'action2' }]];

      expectPropertiesValues(component, 'actions', validValue, validValue);
    });

    it('disabled: should update property with true if valid values', () => {
      const validValues = [true, '', 'true'];

      expectPropertiesValues(component, 'disabled', validValues, true);
    });

    it('disabled: should update property with false if invalid values', () => {
      const invalidValues = [false, 'po', null, undefined, NaN];

      expectPropertiesValues(component, 'disabled', invalidValues, false);
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

      it('onThemeChange: should call applySizeBasedOnA11y', () => {
        spyOn<any>(component, 'applySizeBasedOnA11y');
        component['onThemeChange']();
        expect((component as any).applySizeBasedOnA11y).toHaveBeenCalled();
      });
    });

    describe('p-position:', () => {
      it('should set position to valid value', () => {
        component.position = 'bottom-right';
        expect(component.position).toBe('bottom-right');
      });

      it('should default to bottom-left with invalid value', () => {
        component.position = 'invalid';
        expect(component.position).toBe('bottom-left');
      });

      it('should default to bottom-left with empty string', () => {
        component.position = '';
        expect(component.position).toBe('bottom-left');
      });
    });

    describe('popupCustomPositions:', () => {
      it('should return bottom-right and top-right when position is bottom-right', () => {
        component.position = 'bottom-right';
        expect(component.popupCustomPositions).toEqual(['bottom-right', 'top-right']);
      });

      it('should return top-left and bottom-left when position is top-left', () => {
        component.position = 'top-left';
        expect(component.popupCustomPositions).toEqual(['top-left', 'bottom-left']);
      });

      it('should return top-right and bottom-right when position is top-right', () => {
        component.position = 'top-right';
        expect(component.popupCustomPositions).toEqual(['top-right', 'bottom-right']);
      });

      it('should return bottom-left and top-left as default', () => {
        component.position = 'bottom-left';
        expect(component.popupCustomPositions).toEqual(['bottom-left', 'top-left']);
      });
    });
  });
});
