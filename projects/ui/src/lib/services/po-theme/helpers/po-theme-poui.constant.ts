import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poThemeDefaultActions,
  poThemeDefaultBrands,
  poThemeDefaultFeedback,
  poThemeDefaultNeutrals
} from './types/po-theme-light-defaults.constant';
import {
  poThemeDefaultActionsDark,
  poThemeDefaultBrandsDark,
  poThemeDefaultFeedbackDark,
  poThemeDefaultNeutralsDark
} from './types/po-theme-dark-defaults.constant';

/**
 * Tokens de tema padrão para temas claros.
 */
const poThemeDefaultLight: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrands,
    action: poThemeDefaultActions,
    neutral: poThemeDefaultNeutrals,
    feedback: poThemeDefaultFeedback
  }
};

/**
 * Tokens de tema padrão para o tema escuro.
 */
const poThemeDefaultDark: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrandsDark,
    action: poThemeDefaultActionsDark,
    neutral: poThemeDefaultNeutralsDark,
    feedback: poThemeDefaultFeedbackDark
  }
};

/**
 * Tema padrão.
 */
const poThemeDefault: PoTheme = {
  name: 'default',
  type: [
    {
      light: poThemeDefaultLight,
      dark: poThemeDefaultDark,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: poThemeDefaultLight,
      dark: poThemeDefaultDark,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};

export { poThemeDefault, poThemeDefaultDark, poThemeDefaultLight };
