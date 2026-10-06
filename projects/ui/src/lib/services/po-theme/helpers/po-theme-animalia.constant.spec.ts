import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { poAnimaliaTheme } from './po-theme-animalia.constant';

describe('poAnimaliaTheme', () => {
  it('should have name "animalia"', () => {
    expect(poAnimaliaTheme.name).toBe('animalia');
  });

  it('should have two accessibility variants (AAA and AA)', () => {
    expect(Array.isArray(poAnimaliaTheme.type)).toBeTrue();
    const types = poAnimaliaTheme.type as Array<any>;
    expect(types.length).toBe(2);
    expect(types.map(t => t.a11y)).toEqual([PoThemeA11yEnum.AAA, PoThemeA11yEnum.AA]);
  });

  it('each variant should define light and dark tokens with colors', () => {
    const types = poAnimaliaTheme.type as Array<any>;
    types.forEach(variant => {
      expect(variant.light).toBeDefined();
      expect(variant.dark).toBeDefined();
      expect(variant.light.color).toBeDefined();
      expect(variant.dark.color).toBeDefined();
      expect(variant.light.color.brand).toBeDefined();
      expect(variant.light.color.neutral).toBeDefined();
    });
  });

  it('should be active as light / AAA by default', () => {
    expect(poAnimaliaTheme.active).toEqual({ type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA });
  });
});
