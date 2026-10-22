import { PoThemeA11yEnum } from '../../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../../enum/po-theme-type.enum';
import { PoThemeTokens } from '../../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../../interfaces/po-theme.interface';
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
import {
  poThemeDefaultCategoricalsAA,
  poThemeDefaultOverlayCategoricalsAA
} from './types/po-theme-light-defaults-AA.constant';

/**
 * @deprecated v24.x.x use `poThemeDefaultLight`
 *
 * Tokens de tema padrão para temas claros.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultLight`, do novo tema padrão.
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
 * Tokens de tema padrão para temas claros.
 */
const poThemeDefaultLightAA: PoThemeTokens = {
  color: {
    ...poThemeDefaultLight.color,
    categorical: poThemeDefaultCategoricalsAA,
    'categorical-overlay': poThemeDefaultOverlayCategoricalsAA
  }
};

/**
 * @deprecated v24.x.x use `poThemeDefaultDark`
 *
 * Tokens de tema padrão para o tema escuro.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultDark`, do novo tema padrão.
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
 * @deprecated v24.x.x use `poThemeDefault`
 *
 * Tema padrão.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefault`, do novo tema padrão.
 */
const poThemeDefault: PoTheme = {
  name: 'default-deprecated',
  type: [
    {
      light: poThemeDefaultLight,
      dark: poThemeDefaultDark,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: poThemeDefaultLightAA,
      dark: poThemeDefaultDarkAA,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};

export { poThemeDefault, poThemeDefaultDark, poThemeDefaultLight };