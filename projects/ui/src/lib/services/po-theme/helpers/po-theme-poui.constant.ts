import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poThemeDefaultActions,
  poThemeDefaultBrands,
  poThemeDefaultFeedback,
  poThemeDefaultLightValues,
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
  perComponent: {
    ...poThemeDefaultLightValues.perComponent
  },
  onRoot: {
    ...poThemeDefaultLightValues.onRoot
  }
};

/**
 * Tema padrão.
 */
const poThemeDefault: PoTheme = {
  name: 'default',
  type: {
    light: poThemeDefaultLight
  },
  active: PoThemeTypeEnum.light
};

export { poThemeDefault, poThemeDefaultLight };
