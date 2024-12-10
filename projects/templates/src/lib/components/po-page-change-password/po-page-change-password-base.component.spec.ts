import { Directive } from '@angular/core';

import { PoPageChangePasswordBaseComponent } from './po-page-change-password-base.component';

import { PoThemeA11yEnum, PoThemeService } from '@po-ui/ng-components';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';

@Directive()
class PoPageChangePasswordComponent extends PoPageChangePasswordBaseComponent {
  modalAction = { label: 'modal', action: undefined };
  navigateTo(url: string): void {}
}

describe('PoPageChangePasswordBaseComponent:', () => {
  let component: PoPageChangePasswordComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoPageChangePasswordComponent(poThemeServiceMock);
  });

  it('should be created', () => {
    expect(component instanceof PoPageChangePasswordBaseComponent).toBeTruthy();
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

    it('p-hide-current-password: should update property with valid values.', () => {
      const validValues = [false, true, '', 'false', 'true'];
      const expectedValues = [false, true, true, false, true];

      expectPropertiesValues(component, 'hideCurrentPassword', validValues, expectedValues);
    });

    it('p-hide-current-password: should update property with `false` if values are invalid.', () => {
      const invalidValues = [0, null, undefined, 'undefined', 'null'];

      expectPropertiesValues(component, 'hideCurrentPassword', invalidValues, false);
    });

    it('p-url-home: should set action for `modalAction`', () => {
      const url = '/po';
      component.urlHome = url;

      expect(typeof component.modalAction.action).toBe('function');
    });

    it('p-requirements: should set `passwordRequirements` and set `showPasswordRequirements` to true', () => {
      const requirements = [{ requirement: 'requirement', status: false }];
      component.requirements = requirements;

      expect(component.requirements).toBe(requirements);
      expect(component.showRequirements).toBe(true);
    });

    it('p-requirements: should set `requirements` and set `showRequirements` to false', () => {
      const requirements = undefined;
      const expectedValue = [];
      component.requirements = requirements;

      expect(component.requirements).toEqual(expectedValue);
      expect(component.showRequirements).toBe(false);
    });

    it('p-recovery: should set recoveryUrlType to `externalLink` if value type is string', () => {
      const url = 'http://www.po-ui.com';
      component.recovery = url;

      expect(component.recovery).toBe(url);
      expect(component.recoveryUrlType).toBe('externalLink');
    });

    it('p-recovery: should set `recoveryUrlType` to `internalLink if value type is string`', () => {
      const url = '/po';
      component.recovery = url;

      expect(component.recovery).toBe(url);
      expect(component.recoveryUrlType).toBe('internalLink');
    });

    it('p-recovery: shouldn`t set `recoveryUrlType` if value type is different from string`', () => {
      const url = { url: 'url' };
      component.recovery = url;
      component.recoveryUrlType = undefined;

      expect(component.recovery).toBe(url);
      expect(component.recoveryUrlType).toBe(undefined);
    });
  });
});
