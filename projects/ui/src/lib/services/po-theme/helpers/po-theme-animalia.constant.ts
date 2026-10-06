import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from '../interfaces/po-theme-tokens.interface';
import { PoTheme } from '../interfaces/po-theme.interface';
import {
  poAnimaliaActions,
  poAnimaliaBrands,
  poAnimaliaCategoricals,
  poAnimaliaFeedback,
  poAnimaliaNeutrals,
  poAnimaliaOverlayCategoricals
} from './types/po-theme-animalia-light-defaults.constant';
import {
  poAnimaliaCategoricalsAA,
  poAnimaliaOverlayCategoricalsAA
} from './types/po-theme-animalia-light-defaults-AA.constant';
import {
  poAnimaliaActionsDark,
  poAnimaliaBrandsDark,
  poAnimaliaCategoricalsDark,
  poAnimaliaCategoricalsOverlayDark,
  poAnimaliaFeedbackDark,
  poAnimaliaNeutralsDark
} from './types/po-theme-animalia-dark-defaults.constant';
import {
  poAnimaliaCategoricalsDarkAA,
  poAnimaliaCategoricalsOverlayDarkAA
} from './types/po-theme-animalia-dark-defaults-AA.constant';

/**
 * Tokens do tema Animalia para temas claros (AAA).
 */
const poAnimaliaLight: PoThemeTokens = {
  color: {
    brand: poAnimaliaBrands,
    action: poAnimaliaActions,
    neutral: poAnimaliaNeutrals,
    feedback: poAnimaliaFeedback,
    categorical: poAnimaliaCategoricals,
    'categorical-overlay': poAnimaliaOverlayCategoricals
  }
};

/**
 * Tokens do tema Animalia para temas claros (AA).
 */
const poAnimaliaLightAA: PoThemeTokens = {
  color: {
    ...poAnimaliaLight.color,
    categorical: poAnimaliaCategoricalsAA,
    'categorical-overlay': poAnimaliaOverlayCategoricalsAA
  }
};

/**
 * Tokens do tema Animalia para temas escuros (AAA).
 */
const poAnimaliaDark: PoThemeTokens = {
  color: {
    brand: poAnimaliaBrandsDark,
    action: poAnimaliaActionsDark,
    neutral: poAnimaliaNeutralsDark,
    feedback: poAnimaliaFeedbackDark,
    categorical: poAnimaliaCategoricalsDark,
    'categorical-overlay': poAnimaliaCategoricalsOverlayDark
  }
};

/**
 * Tokens do tema Animalia para temas escuros (AA).
 */
const poAnimaliaDarkAA: PoThemeTokens = {
  color: {
    ...poAnimaliaDark.color,
    categorical: poAnimaliaCategoricalsDarkAA,
    'categorical-overlay': poAnimaliaCategoricalsOverlayDarkAA
  }
};

/**
 * Tema Animalia.
 */
const poAnimaliaTheme: PoTheme = {
  name: 'animalia',
  type: [
    {
      light: poAnimaliaLight,
      dark: poAnimaliaDark,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: poAnimaliaLightAA,
      dark: poAnimaliaDarkAA,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};

export { poAnimaliaTheme, poAnimaliaDark, poAnimaliaLight };
