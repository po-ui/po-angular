import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poThemeDefaultActionsDark,
  poThemeDefaultBrandsDark,
  poThemeDefaultFeedbackDark,
  poThemeDefaultNeutralsDark
} from './po-theme-dark-defaults.constant';
import {
  poThemeDefaultActions,
  poThemeDefaultBrands,
  poThemeDefaultFeedback,
  poThemeDefaultNeutrals
} from './po-theme-light-defaults.constant';

/**
 * Tokens de tema padrão para temas claros.
 */
const poThemeDefaultLight: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrands,
    action: poThemeDefaultActions,
    neutral: poThemeDefaultNeutrals,
    feedback: poThemeDefaultFeedback
  },
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
  },
};

/**
 * Tema padrão.
 */
const poThemeDefault: PoTheme = {
  name: 'default',
  type: {
    light: poThemeDefaultLight,
    dark: poThemeDefaultDark
  },
  active: PoThemeTypeEnum.light
};

export { poThemeDefault, poThemeDefaultDark, poThemeDefaultLight };

