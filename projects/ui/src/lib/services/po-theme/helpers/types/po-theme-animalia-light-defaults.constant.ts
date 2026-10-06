import {
  PoThemeColorAction,
  PoThemeColorCategorical,
  PoThemeColorFeedback,
  PoThemeColorNeutral,
  poThemeColorBrand
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação do tema Animalia para temas claros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaActions: PoThemeColorAction = {
  default: 'var(--color-brand-01-base)',
  hover: 'var(--color-brand-01-dark)',
  pressed: 'var(--color-brand-01-darker)',
  disabled: 'var(--color-neutral-light-30)',
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras do tema Animalia para temas claros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaNeutrals: PoThemeColorNeutral = {
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
 * Define as cores de feedback do tema Animalia para temas claros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaFeedback: PoThemeColorFeedback = {
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
 * Define as cores da Brand do tema Animalia para temas claros.
 * TODO: valores fornecidos pelo usuário (placeholders = default).
 */
const poAnimaliaBrands: poThemeColorBrand = {
  '01': {
    lightest: '#e3eefb',
    lighter: '#9cc6ef',
    light: '#5fa3e0',
    base: '#1a73c7',
    dark: '#145089',
    darker: '#0d3c6b',
    darkest: '#082a4d'
  },
  '02': {
    base: '#0a66c2'
  },
  '03': {
    base: '#64b5f6'
  }
};

const poAnimaliaCategoricals: PoThemeColorCategorical = {
  '01': '#003DCC',
  '02': '#669900',
  '03': '#6626A6',
  '04': '#D44E2A',
  '05': '#008599',
  '06': '#B17F00',
  '07': '#AC2076',
  '08': '#9F0712'
};

const poAnimaliaOverlayCategoricals: PoThemeColorCategorical = {
  '01': '#99B8FF',
  '02': '#DDFF99',
  '03': '#CCACEC',
  '04': '#EEB9AA',
  '05': '#99F1FF',
  '06': '#FFE299',
  '07': '#EFA9D4',
  '08': '#FB9DA3'
};

/**
 * Define estilos onRoot do tema Animalia para temas claros (AAA).
 */
const poAnimaliaLightValues = {
  perComponent: {},
  onRoot: {
    /* CATEGORICAL COLORS */
    '--color-caption-categorical-01': '#003DCC',
    '--color-caption-categorical-02': '#669900',
    '--color-caption-categorical-03': '#6626A6',
    '--color-caption-categorical-04': '#D44E2A',
    '--color-caption-categorical-05': '#008599',
    '--color-caption-categorical-06': '#B17F00',
    '--color-caption-categorical-07': '#AC2076',
    '--color-caption-categorical-08': '#9F0712',
    /* CATEGORICAL OVERLAY COLORS */
    '--color-caption-categorical-overlay-01': '#99B8FF',
    '--color-caption-categorical-overlay-02': '#DDFF99',
    '--color-caption-categorical-overlay-03': '#CCACEC',
    '--color-caption-categorical-overlay-04': '#EEB9AA',
    '--color-caption-categorical-overlay-05': '#99F1FF',
    '--color-caption-categorical-overlay-06': '#FFE299',
    '--color-caption-categorical-overlay-07': '#EFA9D4',
    '--color-caption-categorical-overlay-08': '#FB9DA3'
  }
};

export {
  poAnimaliaBrands,
  poAnimaliaActions,
  poAnimaliaFeedback,
  poAnimaliaNeutrals,
  poAnimaliaLightValues,
  poAnimaliaCategoricals,
  poAnimaliaOverlayCategoricals
};
