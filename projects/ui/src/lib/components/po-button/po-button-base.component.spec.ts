import { PoButtonBaseComponent } from './po-button-base.component';

import { PoThemeA11yEnum, PoThemeService } from '../../services';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonKind } from './enums/po-button-kind.enum';

describe('PoButtonBaseComponent', () => {
  let component: PoButtonBaseComponent;
  let poThemeServiceMock: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeServiceMock = jasmine.createSpyObj('PoThemeService', ['getA11yLevel', 'getA11yDefaultSize']);

    component = new PoButtonBaseComponent(poThemeServiceMock);
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

  describe('p-size', () => {
    it('should set property with valid values for accessibility level is AA', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

      component.size = 'small';
      expect(component.size).toBe('small');

      component.size = 'medium';
      expect(component.size).toBe('medium');

      component.size = 'large';
      expect(component.size).toBe('large');
    });

    it('should set property with valid values for accessibility level is AAA', () => {
      poThemeServiceMock.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

      component.size = 'small';
      expect(component.size).toBe('medium');

      component.size = 'medium';
      expect(component.size).toBe('medium');

      component.size = 'large';
      expect(component.size).toBe('large');
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
