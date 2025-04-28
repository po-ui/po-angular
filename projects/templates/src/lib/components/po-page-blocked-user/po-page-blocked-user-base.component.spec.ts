import { PoPageBlockedUserBaseComponent } from './po-page-blocked-user-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoThemeA11yEnum, PoThemeService } from '@po-ui/ng-components';
import { PoPageBlockedUserReasonParams } from './interfaces/po-page-blocked-user-reason-params.interface';

describe('PoPageBlockedUserBaseComponent:', () => {
  let component: PoPageBlockedUserBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoPageBlockedUserBaseComponent(poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component instanceof PoPageBlockedUserBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('p-components-size', () => {
      it('should set property with valid values for accessibility level is AA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('small');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('medium');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('small');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);
        poThemeServiceMock.getA11yDefaultSize.and.returnValue('medium');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });
    });

    it('p-params: should update property `p-params` with invalid values.', () => {
      component.params = { attempts: 5, days: 90, hours: 24 };

      const invalidParams = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'params', invalidParams, { attempts: 5, days: 90, hours: 24 });
    });

    it('p-params: should update property `p-params` with valid values.', () => {
      const validParams: PoPageBlockedUserReasonParams = { attempts: 10, days: 10, hours: 10 };

      expectPropertiesValues(component, 'params', validParams, validParams);
    });

    it('p-reason: should update property `p-reason` with valid values.', () => {
      const validValues = ['none', 'exceededAttempts', 'expiredPassword'];

      expectPropertiesValues(component, 'reason', validValues, validValues);
    });

    it('p-reason: should update property `p-reason` with invalid values.', () => {
      const invalidValues = [false, true, {}, 'invalid', []];

      expectPropertiesValues(component, 'reason', invalidValues, 'none');
    });

    it('p-url-back: should set property `p-url-back` with passed value.', () => {
      const value: string = '/home';

      expectPropertiesValues(component, 'urlBack', value, value);
    });
  });
});
