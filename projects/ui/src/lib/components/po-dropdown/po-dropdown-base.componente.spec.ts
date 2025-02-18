import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

describe('PoDropdownBaseComponent:', () => {
  let component: PoDropdownBaseComponent;
  let poThemeService: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeService = jasmine.createSpyObj('PoThemeService', ['getA11yDefaultSize', 'getA11yLevel']);
    component = new PoDropdownBaseComponent(poThemeService);
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

    describe('p-size:', () => {
      it('should update size with valid values', () => {
        const validValues = ['medium'];

        expectPropertiesValues(component, 'size', validValues, validValues);
      });

      it('should update size to `medium` with invalid values', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        const invalidValues = ['extraSmall', 'extraLarge'];

        expectPropertiesValues(component, 'size', invalidValues, 'medium');
      });

      it('should use default size when size is not set', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        component.size = undefined;
        expect(component.size).toBe('small');
      });

      it('should return `p-size` if it is defined', () => {
        component['_size'] = 'large';
        expect(component.size).toBe('large');
      });

      it('should call `getDefaultSize` and return its value if `p-size` is null or undefined', () => {
        spyOn(component as any, 'getDefaultSize').and.returnValue('medium');

        component['_size'] = null;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalled();

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Methods: ', () => {
    describe('validateSize:', () => {
      it('should return the same size if valid and accessibility level allows it', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        expect(component['validateSize']('small')).toBe('small');
        expect(component['validateSize']('medium')).toBe('medium');
      });

      it('should return `medium` if p-size is `small` and accessibility level is not `AA`', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        expect(component['validateSize']('small')).toBe('medium');
      });

      it('should return default size from getA11yDefaultSize if value is invalid', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['validateSize']('invalid')).toBe('small');
      });

      it('should return `medium` if default size is `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['validateSize']('invalid')).toBe('medium');
      });
    });

    describe('getDefaultSize:', () => {
      it('should return `small` if getA11yDefaultSize returns `small`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['getDefaultSize']()).toBe('small');
      });

      it('should return `medium` if getA11yDefaultSize returns `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['getDefaultSize']()).toBe('medium');
      });
    });
  });
});
