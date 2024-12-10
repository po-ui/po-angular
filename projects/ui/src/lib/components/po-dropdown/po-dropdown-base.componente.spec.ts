import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

describe('PoDropdownBaseComponent:', () => {
  let component: PoDropdownBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);
    component = new PoDropdownBaseComponent(poThemeServiceMock);
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
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });
  });
});
