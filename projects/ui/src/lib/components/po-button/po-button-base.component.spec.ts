import { PoButtonBaseComponent } from './po-button-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonKind } from './enums/po-button-kind.enum';
import { PoThemeA11yEnum, PoThemeService } from '../../services';

describe('PoButtonBaseComponent', () => {
  let component: PoButtonBaseComponent;
  let poThemeService: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeService = jasmine.createSpyObj('PoThemeService', ['getA11yDefaultSize', 'getA11yLevel']);
    component = new PoButtonBaseComponent(poThemeService);
  });

  const booleanValidTrueValues = [true, 'true', 1, ''];
  const booleanValidFalseValues = [false, 'false', 0];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  it('should be created', () => {
    expect(component instanceof PoButtonBaseComponent).toBeTruthy();
  });

  it('should update property `p-disabled` with valid values', () => {
    expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
    expectPropertiesValues(component, 'disabled', booleanValidFalseValues, false);
  });

  it('should update property `p-disabled` with `false` when invalid values', () => {
    expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
  });

  it('should update property `p-kind` with valid values', () => {
    component.danger = false;
    const validValues = ['primary', 'secondary', 'tertiary'];

    expectPropertiesValues(component, 'kind', validValues, validValues);
  });

  it('should update property `p-kind` with `secondary` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    expectPropertiesValues(component, 'kind', invalidValues, 'secondary');
  });

  it('should set `p-danger` with false if `p-kind` is tertiary', () => {
    component.kind = PoButtonKind.tertiary;
    component.danger = true;
    expect(component.danger).toBe(false);
  });

  it('should set `p-danger` with true if `p-kind` is not tertiary', () => {
    component.kind = PoButtonKind.primary;
    component.danger = true;
    expect(component.danger).toBe(true);
  });

  describe('p-size:', () => {
    it('should update size with valid values', () => {
      const validValues = ['medium', 'large'];

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

  describe('validateSize:', () => {
    it('should return the same size if valid and accessibility level allows it', () => {
      poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

      expect(component['validateSize']('small')).toBe('small');
      expect(component['validateSize']('medium')).toBe('medium');
      expect(component['validateSize']('large')).toBe('large');
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
