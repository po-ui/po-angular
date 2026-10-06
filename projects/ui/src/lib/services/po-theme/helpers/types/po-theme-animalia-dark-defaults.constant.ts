import {
  PoThemeColorAction,
  poThemeColorBrand,
  PoThemeColorCategorical,
  PoThemeColorFeedback,
  PoThemeColorNeutral
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação do tema Animalia para temas escuros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaActionsDark: PoThemeColorAction = {
  default: 'var(--color-brand-01-dark)',
  hover: 'var(--color-brand-01-darker)',
  pressed: 'var(--color-brand-01-darkest)',
  disabled: 'var(--color-neutral-mid-40)',
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras do tema Animalia para temas escuros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaNeutralsDark: PoThemeColorNeutral = {
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
 * Define as cores de feedback do tema Animalia para temas escuros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaFeedbackDark: PoThemeColorFeedback = {
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

/**
 * Define as cores da Brand do tema Animalia para temas escuros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaBrandsDark: poThemeColorBrand = {
  '01': {
    lightest: '#082a4d',
    lighter: '#0d3c6b',
    light: '#145089',
    base: '#1a73c7',
    dark: '#5fa3e0',
    darker: '#9cc6ef',
    darkest: '#e3eefb'
  },
  '02': {
    base: '#0a66c2'
  },
  '03': {
    base: '#64b5f6'
  }
};

const poAnimaliaCategoricalsDark: PoThemeColorCategorical = {
  '01': '#003DCC',
  '02': '#669900',
  '03': '#6626A6',
  '04': '#D44E2A',
  '05': '#008599',
  '06': '#B17F00',
  '07': '#AC2076',
  '08': '#9F0712'
};

const poAnimaliaCategoricalsOverlayDark: PoThemeColorCategorical = {
  '01': '#99B8FF',
  '02': '#DDFF99',
  '03': '#CCACEC',
  '04': '#EEB9AA',
  '05': '#99F1FF',
  '06': '#FFE299',
  '07': '#EFA9D4',
  '08': '#FB9DA3'
};

export {
  poAnimaliaBrandsDark,
  poAnimaliaActionsDark,
  poAnimaliaFeedbackDark,
  poAnimaliaNeutralsDark,
  poAnimaliaCategoricalsDark,
  poAnimaliaCategoricalsOverlayDark
};
