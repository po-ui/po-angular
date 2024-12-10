import { PoModalBaseComponent } from './po-modal-base.component';

import { PoLanguageService, PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues, expectSettersMethod } from './../../util-test/util-expect.spec';

describe('PoModalBaseComponent:', () => {
  let component: PoModalBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);
    component = new PoModalBaseComponent(new PoLanguageService(), poThemeServiceMock);
  });

  it('should create component hidden', () => {
    expect(component instanceof PoModalBaseComponent).toBeTruthy();
    expect(component['isHidden']).toBeTruthy();
  });

  it('should be call open method', () => {
    component.open();
    expect(component['isHidden']).toBeFalsy();
  });

  it('should be call close method', () => {
    component.close();
    expect(component['isHidden']).toBeTruthy();
  });

  it('should update property `p-size` with valid values', () => {
    const validValues = ['sm', 'md', 'lg', 'xl', 'auto'];

    expectPropertiesValues(component, 'size', validValues, validValues);
  });

  it('should update property `p-size` with `md` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    expectPropertiesValues(component, 'size', invalidValues, 'md');
  });

  it('should be update property p-click-out', () => {
    expectSettersMethod(component, 'setClickOut', undefined, 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', '', 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', false, 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', true, 'clickOut', true);
    expectSettersMethod(component, 'setClickOut', 'true', 'clickOut', true);
    expectSettersMethod(component, 'setClickOut', 'false', 'clickOut', false);
  });

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

  it('should emit `onClosedX` if xClosed is true', () => {
    spyOn(component.onXClosed, 'emit');

    component.close(true);

    expect(component.onXClosed.emit).toHaveBeenCalled();
  });

  it('should not emit `onClosedX` if xClosed is false', () => {
    spyOn(component.onXClosed, 'emit');

    component.close(false);

    expect(component.onXClosed.emit).not.toHaveBeenCalled();
  });

  it('should complete primaryAction when is incomplete in validPrimaryAction', () => {
    component.primaryAction = {
      action: undefined,
      label: undefined
    };

    component.validPrimaryAction();

    expect(component.primaryAction.label).toBe(component.literals.close);
    expect(component.primaryAction.action).not.toBeUndefined();

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should complete primaryAction when is undefined in validPrimaryAction', () => {
    component.primaryAction = undefined;
    component.validPrimaryAction();
    expect(component.primaryAction.label).toBe(component.literals.close);
    expect(component.primaryAction.action).not.toBeUndefined();

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should keep values in primaryAction when is complete', () => {
    component.primaryAction = {
      action: () => 'value',
      label: 'Confirm'
    };
    component.validPrimaryAction();
    expect(component.primaryAction.label).toBe('Confirm');
    expect(component.primaryAction.action()).toBe('value');
  });

  describe('Properties:', () => {
    const invalidValues = [0, 2018, 'string', false, null, undefined];
    const validValues = [true, '', 1];

    it('p-hide-close: should update when set valid values.', () => {
      expectPropertiesValues(component, 'hideClose', validValues, true);
    });

    it('p-hide-close: shouldn´t update when set invalid values.', () => {
      expectPropertiesValues(component, 'hideClose', invalidValues, false);
    });
  });
});
