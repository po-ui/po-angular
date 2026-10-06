import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poThemeDefaultActionsDarkDeprecated,
  poThemeDefaultBrandsDarkDeprecated,
  poThemeDefaultFeedbackDarkDeprecated,
  poThemeDefaultNeutralsDarkDeprecated
} from './types/po-theme-dark-defaults-deprecated.constant';
import {
  poThemeDefaultCategoricalsDarkAA,
  poThemeDefaultCategoricalsOverlayDarkAA
} from './types/po-theme-dark-defaults-AA.constant';
import { poThemeDefaultCategoricalsDark, poThemeDefaultCategoricalsOverlayDark } from './types/po-theme-dark-defaults.constant';
import {
  poThemeDefaultActionsDeprecated,
  poThemeDefaultBrandsDeprecated,
  poThemeDefaultFeedbackDeprecated,
  poThemeDefaultNeutralsDeprecated
} from './types/po-theme-light-defaults-deprecated.constant';
import {
  poThemeDefaultCategoricalsAA,
  poThemeDefaultOverlayCategoricalsAA
} from './types/po-theme-light-defaults-AA.constant';
import { poThemeDefaultCategoricals, poThemeDefaultOverlayCategoricals } from './types/po-theme-light-defaults.constant';

/**
 * Tokens do tema padrão legado (deprecated) para temas claros (AAA).
 */
const poThemeDefaultLightDeprecated: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrandsDeprecated,
    action: poThemeDefaultActionsDeprecated,
    neutral: poThemeDefaultNeutralsDeprecated,
    feedback: poThemeDefaultFeedbackDeprecated,
    categorical: poThemeDefaultCategoricals,
    'categorical-overlay': poThemeDefaultOverlayCategoricals
  }
};

/**
 * Tokens do tema padrão legado (deprecated) para temas claros (AA).
 */
const poThemeDefaultLightAADeprecated: PoThemeTokens = {
  color: {
    ...poThemeDefaultLightDeprecated.color,
    categorical: poThemeDefaultCategoricalsAA,
    'categorical-overlay': poThemeDefaultOverlayCategoricalsAA
  }
};

/**
 * Tokens do tema padrão legado (deprecated) para temas escuros (AAA).
 */
const poThemeDefaultDarkDeprecated: PoThemeTokens = {
  color: {
    brand: poThemeDefaultBrandsDarkDeprecated,
    action: poThemeDefaultActionsDarkDeprecated,
    neutral: poThemeDefaultNeutralsDarkDeprecated,
    feedback: poThemeDefaultFeedbackDarkDeprecated,
    categorical: poThemeDefaultCategoricalsDark,
    'categorical-overlay': poThemeDefaultCategoricalsOverlayDark
  }
};

/**
 * Tokens do tema padrão legado (deprecated) para temas escuros (AA).
 */
const poThemeDefaultDarkAADeprecated: PoThemeTokens = {
  color: {
    ...poThemeDefaultDarkDeprecated.color,
    categorical: poThemeDefaultCategoricalsDarkAA,
    'categorical-overlay': poThemeDefaultCategoricalsOverlayDarkAA
  }
};

/**
 * Tema padrão legado (deprecated).
 *
 * Preserva o esquema de cores anterior do PO UI. Para continuar utilizando as cores
 * antigas, aplique este tema via `PoThemeService.setTheme(poThemeDefaultDeprecated, ...)`.
 */
const poThemeDefaultDeprecated: PoTheme = {
  name: 'pothemedeprecated',
  type: [
    {
      light: poThemeDefaultLightDeprecated,
      dark: poThemeDefaultDarkDeprecated,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: poThemeDefaultLightAADeprecated,
      dark: poThemeDefaultDarkAADeprecated,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};

export { poThemeDefaultDeprecated, poThemeDefaultDarkDeprecated, poThemeDefaultLightDeprecated };
