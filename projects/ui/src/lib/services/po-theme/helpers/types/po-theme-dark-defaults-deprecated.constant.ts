import {
  PoThemeColorAction,
  poThemeColorBrand,
  PoThemeColorFeedback,
  PoThemeColorNeutral
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação do tema padrão legado (deprecated) para temas escuros.
 */
const poThemeDefaultActionsDarkDeprecated: PoThemeColorAction = {
  default: 'var(--color-brand-01-dark)',
  hover: 'var(--color-brand-01-darker)',
  pressed: 'var(--color-brand-01-darkest)',
  disabled: 'var(--color-neutral-mid-40)',
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras do tema padrão legado (deprecated) para temas escuros.
 */
const poThemeDefaultNeutralsDarkDeprecated: PoThemeColorNeutral = {
  light: {
    '00': '#1c1c1c',
    '05': '#202020',
    '10': '#2b2b2b',
    '20': '#3b3b3b',
    '30': '#5a5a5a'
  },
  mid: {
    '40': '#7c7c7c',
    '60': '#a1a1a1'
  },
  dark: {
    '70': '#c1c1c1',
    '80': '#d9d9d9',
    '90': '#eeeeee',
    '95': '#fbfbfb'
  }
};

/**
 * Define as cores de feedback do tema padrão legado (deprecated) para temas escuros.
 */
const poThemeDefaultFeedbackDarkDeprecated: PoThemeColorFeedback = {
  negative: {
    lightest: '#4a1512',
    lighter: '#72211d',
    light: '#9b2d27',
    base: '#be3e37',
    dark: '#d58581',
    darker: '#e3aeab',
    darkest: '#f6e6e5'
  },
  info: {
    lightest: '#081536',
    lighter: '#0f2557',
    light: '#173782',
    base: '#0079b8',
    dark: '#7996d7',
    darker: '#b0c1e8',
    darkest: '#e3e9f7'
  },
  positive: {
    lightest: '#002415',
    lighter: '#083a25',
    light: '#0f5236',
    base: '#107048',
    dark: '#41b483',
    darker: '#7ecead',
    darkest: '#def7ed'
  },
  warning: {
    lightest: '#473400',
    lighter: '#705200',
    light: '#d8a20e',
    base: '#efba2a',
    dark: '#f1cd6a',
    darker: '#f7dd97',
    darkest: '#fcf6e3'
  }
};

const poThemeDefaultBrandsDarkDeprecated: poThemeColorBrand = {
  '01': {
    lightest: '#260538',
    lighter: '#400e58',
    light: '#5b1c7d',
    base: '#753399',
    dark: '#bd94d1',
    darker: '#d9c2e5',
    darkest: '#f2eaf6'
  },
  '02': {
    base: '#b92f72'
  },
  '03': {
    base: '#ffd464'
  }
};

export {
  poThemeDefaultBrandsDarkDeprecated,
  poThemeDefaultActionsDarkDeprecated,
  poThemeDefaultFeedbackDarkDeprecated,
  poThemeDefaultNeutralsDarkDeprecated
};
