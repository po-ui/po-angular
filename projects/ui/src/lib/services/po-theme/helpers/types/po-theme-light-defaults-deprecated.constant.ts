import {
  PoThemeColorAction,
  PoThemeColorFeedback,
  PoThemeColorNeutral,
  poThemeColorBrand
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação do tema padrão legado (deprecated) para temas claros.
 */
const poThemeDefaultActionsDeprecated: PoThemeColorAction = {
  default: 'var(--color-brand-01-base)',
  hover: 'var(--color-brand-01-dark)',
  pressed: 'var(--color-brand-01-darker)',
  disabled: 'var(--color-neutral-light-30)',
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras do tema padrão legado (deprecated) para temas claros.
 */
const poThemeDefaultNeutralsDeprecated: PoThemeColorNeutral = {
  light: {
    '00': '#ffffff',
    '05': '#fbfbfb',
    '10': '#eceeee',
    '20': '#dadedf',
    '30': '#b6bdbf'
  },
  mid: {
    '40': '#9da7a9',
    '60': '#6e7c7f'
  },
  dark: {
    '70': '#4a5c60',
    '80': '#2c3739',
    '90': '#1d2426',
    '95': '#0b0e0e'
  }
};

/**
 * Define as cores de feedback do tema padrão legado (deprecated) para temas claros.
 */
const poThemeDefaultFeedbackDeprecated: PoThemeColorFeedback = {
  negative: {
    lightest: '#f6e6e5',
    lighter: '#e3aeab',
    light: '#d58581',
    base: '#be3e37',
    dark: '#9b2d27',
    darker: '#72211d',
    darkest: '#4a1512'
  },
  info: {
    lightest: '#e3e9f7',
    lighter: '#b0c1e8',
    light: '#7996d7',
    base: '#23489f',
    dark: '#173782',
    darker: '#0f2557',
    darkest: '#081536'
  },
  positive: {
    lightest: '#def7ed',
    lighter: '#7ecead',
    light: '#41b483',
    base: '#107048',
    dark: '#0f5236',
    darker: '#083a25',
    darkest: '#002415'
  },
  warning: {
    lightest: '#fcf6e3',
    lighter: '#f7dd97',
    light: '#f1cd6a',
    base: '#efba2a',
    dark: '#d8a20e',
    darker: '#705200',
    darkest: '#473400'
  }
};

/**
 * Define as cores da Brand do tema padrão legado (deprecated) para temas claros.
 */
const poThemeDefaultBrandsDeprecated: poThemeColorBrand = {
  '01': {
    lightest: '#f2eaf6',
    lighter: '#d9c2e5',
    light: '#bd94d1',
    base: '#753399',
    dark: '#5b1c7d',
    darker: '#400e58',
    darkest: '#260538'
  },
  '02': {
    base: '#b92f72'
  },
  '03': {
    base: '#ffd464'
  }
};

export {
  poThemeDefaultBrandsDeprecated,
  poThemeDefaultActionsDeprecated,
  poThemeDefaultFeedbackDeprecated,
  poThemeDefaultNeutralsDeprecated
};
