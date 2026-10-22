import {
  PoThemeColorAction,
  PoThemeColorCategorical,
  PoThemeColorFeedback,
  PoThemeColorNeutral,
  poThemeColorBrand
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação padrão para temas claros.
 */
const poThemeDefaultActions: PoThemeColorAction = {
  /** Cor padrão. */
  default: 'var(--color-brand-01-base)',
  /** Cor ao passar o mouse. */
  hover: 'var(--color-brand-01-dark)',
  /** Cor quando pressionado. */
  pressed: 'var(--color-brand-01-darker)',
  /** Cor quando desabilitado. */
  disabled: 'var(--color-neutral-light-30)',
  /** Cor ao focar. */
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras padrão para temas claros.
 */
const poThemeDefaultNeutrals: PoThemeColorNeutral = {
  /** Tons de cinza claro. */
  light: {
    '00': '#ffffff',
    '05': '#F9F9FA',
    '10': '#ECECEE',
    '20': '#E7E5E4',
    '30': '#B4B4C0'
  },
  /** Tons de cinza intermediários. */
  mid: {
    '40': '#9191A1',
    '60': '#69697C'
  },
  /** Tons de cinza escuro. */
  dark: {
    '70': '#515162',
    '80': '#36364A',
    '90': '#1D1D30',
    '95': '#060613'
  }
};

/**
 * Define as cores de feedback padrão para temas claros.
 */
const poThemeDefaultFeedback: PoThemeColorFeedback = {
  /** Cores para feedback negativo. */
  negative: {
    lightest: '#f6e6e5',
    lighter: '#e3aeab',
    light: '#d58581',
    base: '#be3e37',
    dark: '#9b2d27',
    darker: '#72211d',
    darkest: '#4a1512'
  },
  /** Cores para feedback informativo. */
  info: {
    lightest: '#e3e9f7',
    lighter: '#b0c1e8',
    light: '#7996d7',
    base: '#23489f',
    dark: '#173782',
    darker: '#0f2557',
    darkest: '#081536'
  },
  /** Cores para feedback positivo. */
  positive: {
    lightest: '#def7ed',
    lighter: '#7ecead',
    light: '#41b483',
    base: '#107048',
    dark: '#0f5236',
    darker: '#083a25',
    darkest: '#002415'
  },
  /** Cores para feedback de aviso. */
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
 * Define as cores da Brand padrão para temas claros.
 */
const poThemeDefaultBrands: poThemeColorBrand = {
  '01': {
    lightest: '#F3F6FB',
    lighter: '#CFD9EE',
    light: '#87A1D3',
    base: '#576BB9',
    dark: '#434C8C',
    darker: '#39416F',
    darkest: '#262A45'
  },
  '02': {
    lightest: '#FEF1F6',
    lighter: '#FECCE2',
    light: '#FE68A2',
    base: '#F94485',
    dark: '#BE1243',
    darker: '#8B1031',
    darkest: '#560117'
  },
  '03': {
    lightest: '#EEFCFD',
    lighter: '#AEECF3',
    light: '#37C3D9',
    base: '#187E97',
    dark: '#1B6C83',
    darker: '#1F596B',
    darkest: '#0E303E'
  }
};

const poThemeDefaultCategoricals: PoThemeColorCategorical = {
  '01': '#003DCC',
  '02': '#669900',
  '03': '#6626A6',
  '04': '#D44E2A',
  '05': '#008599',
  '06': '#B17F00',
  '07': '#AC2076',
  '08': '#9F0712'
};

const poThemeDefaultOverlayCategoricals: PoThemeColorCategorical = {
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
 * Define estilos específicos por componente e onRoot para temas claros para AAA.
 */
const poThemeDefaultLightValues = {
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
  poThemeDefaultBrands,
  poThemeDefaultActions,
  poThemeDefaultFeedback,
  poThemeDefaultNeutrals,
  poThemeDefaultLightValues,
  poThemeDefaultCategoricals,
  poThemeDefaultOverlayCategoricals
};
