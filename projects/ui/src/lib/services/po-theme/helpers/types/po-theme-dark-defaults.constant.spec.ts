import { poThemeDefaultDarkValues } from './po-theme-dark-defaults.constant';
import { poThemeDefaultDarkValuesAA } from './po-theme-dark-defaults-AA.constant';
import { poThemeDefaultDarkValues as poThemeDefaultDarkValuesDeprecated } from '../deprecated/types/po-theme-dark-defaults.constant';
import { poThemeDefaultDarkValuesAA as poThemeDefaultDarkValuesAADeprecated } from '../deprecated/types/po-theme-dark-defaults-AA.constant';

describe('poThemeDefaultDarkValues:', () => {
  const themes = [
    { name: 'default', values: poThemeDefaultDarkValues },
    { name: 'default AA', values: poThemeDefaultDarkValuesAA },
    { name: 'deprecated', values: poThemeDefaultDarkValuesDeprecated },
    { name: 'deprecated AA', values: poThemeDefaultDarkValuesAADeprecated }
  ];

  themes.forEach(({ name, values }) => {
    it(`should keep the glow button light colors light in the ${name} dark theme`, () => {
      expect(values.perComponent['po-button']).toEqual({
        '--color-glow-ring': 'var(--color-neutral-dark-95)'
      });
    });
  });
});
