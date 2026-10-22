import * as poTheme from './index';

import {
  themeDeprecatedSymbolMap,
  themeSymbolsWithoutDeprecated
} from '../../../../schematics/ng-update/v22/theme-deprecated/changes';

describe('PoTheme deprecated exports:', () => {
  const barrel = poTheme as unknown as Record<string, unknown>;
  const entries = Object.entries(themeDeprecatedSymbolMap);

  it('should map the 25 public constants of the previous default theme', () => {
    expect(entries.length).toBe(25);
  });

  entries.forEach(([current, deprecated]) => {
    it(`should export '${deprecated}' as a different object from '${current}'`, () => {
      expect(barrel[current]).toEqual(jasmine.any(Object));
      expect(barrel[deprecated]).toEqual(jasmine.any(Object));
      expect(barrel[deprecated]).not.toBe(barrel[current]);
    });
  });

  it('should not map `poThemeSharedBase`, which is new in v22', () => {
    expect(themeSymbolsWithoutDeprecated).toContain('poThemeSharedBase');
    expect(Object.keys(themeDeprecatedSymbolMap)).not.toContain('poThemeSharedBase');
    expect(barrel['poThemeSharedBaseDeprecated']).toBeUndefined();
  });
});
