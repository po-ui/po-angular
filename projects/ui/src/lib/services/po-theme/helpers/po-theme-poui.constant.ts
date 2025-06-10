import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poThemeDefaultActions,
  poThemeDefaultBrands,
  poThemeDefaultFeedback,
  poThemeDefaultNeutrals,
  poThemeDefaultCategoricals,
  poThemeDefaultOverlayCategoricals
} from './types/po-theme-light-defaults.constant';
import {
  poThemeDefaultActionsDark,
  poThemeDefaultBrandsDark,
  poThemeDefaultCategoricalsDark,
  poThemeDefaultCategoricalsOverlayDark,
  poThemeDefaultFeedbackDark,
  poThemeDefaultNeutralsDark
} from './types/po-theme-dark-defaults.constant';
import {
  poThemeDefaultCategoricalsDarkAA,
  poThemeDefaultCategoricalsOverlayDarkAA
} from './types/po-theme-dark-defaults-AA.constant';

/**
 * Tokens de tema padrão para temas claros.
 */
const poThemeDefaultLight: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrands,
    action: poThemeDefaultActions,
    neutral: poThemeDefaultNeutrals,
    feedback: poThemeDefaultFeedback,
    categorical: poThemeDefaultCategoricals,
    'categorical-overlay': poThemeDefaultOverlayCategoricals
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
    feedback: poThemeDefaultFeedbackDark,
    categorical: poThemeDefaultCategoricalsDark,
    'categorical-overlay': poThemeDefaultCategoricalsOverlayDark
  }
};

/**
 * Tokens de tema padrão para o tema escuro.
 */
const poThemeDefaultDarkAA: PoThemeTokens = {
  color: {
    ...poThemeDefaultDark.color,
    categorical: poThemeDefaultCategoricalsDarkAA,
    'categorical-overlay': poThemeDefaultCategoricalsOverlayDarkAA
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
      dark: poThemeDefaultDarkAA,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};

export { poThemeDefault, poThemeDefaultDark, poThemeDefaultLight };
