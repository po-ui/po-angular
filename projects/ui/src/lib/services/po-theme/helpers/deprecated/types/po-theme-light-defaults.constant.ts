import {
  PoThemeColorAction,
  PoThemeColorCategorical,
  PoThemeColorFeedback,
  PoThemeColorNeutral,
  poThemeColorBrand
} from '../../../interfaces/po-theme-color.interface';

/**
 * @deprecated v24.x.x use `poThemeDefaultActions`
 *
 * Define as cores de ação padrão para temas claros.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultActions`, do novo tema padrão.
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
 * @deprecated v24.x.x use `poThemeDefaultNeutrals`
 *
 * Define as cores neutras padrão para temas claros.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultNeutrals`, do novo tema padrão.
 */
const poThemeDefaultNeutrals: PoThemeColorNeutral = {
  /** Tons de cinza claro. */
  light: {
    '00': '#ffffff',
    '05': '#fbfbfb',
    '10': '#eceeee',
    '20': '#dadedf',
    '30': '#b6bdbf'
  },
  /** Tons de cinza intermediários. */
  mid: {
    '40': '#9da7a9',
    '60': '#6e7c7f'
  },
  /** Tons de cinza escuro. */
  dark: {
    '70': '#4a5c60',
    '80': '#2c3739',
    '90': '#1d2426',
    '95': '#0b0e0e'
  }
};

/**
 * @deprecated v24.x.x use `poThemeDefaultFeedback`
 *
 * Define as cores de feedback padrão para temas claros.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultFeedback`, do novo tema padrão.
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
 * @deprecated v24.x.x use `poThemeDefaultBrands`
 *
 * Define as cores da Brand padrão para temas claros.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultBrands`, do novo tema padrão.
 */
const poThemeDefaultBrands: poThemeColorBrand = {
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

/**
 * @deprecated v24.x.x use `poThemeDefaultCategoricals`
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultCategoricals`, do novo tema padrão.
 */
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

/**
 * @deprecated v24.x.x use `poThemeDefaultOverlayCategoricals`
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultOverlayCategoricals`, do novo tema padrão.
 */
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
 * @deprecated v24.x.x use `poThemeDefaultLightValues`
 *
 * Define estilos específicos por componente e onRoot para temas claros para AAA.
 *
 * > Essa constante pertence ao tema padrão anterior, está **depreciada** e será removida na versão `24.x.x`. Recomendamos utilizar `poThemeDefaultLightValues`, do novo tema padrão.
 */
const poThemeDefaultLightValues = {
  perComponent: {},
  onRoot: {
    /* FONTS LEGADAS */
    '--font-family': 'Roboto',
    '--font-family-theme': 'Roboto',
    '--font-family-theme-bold': 'Roboto-Bold',
    '--font-family-theme-extra-light': 'Roboto-Condensed-Light',
    '--font-family-heading': 'Roboto',
    '--font-family-code': 'Monospace',

    /* PAGE  */
    '--color-page-background-color-page': 'var(--color-neutral-light-05)',

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
