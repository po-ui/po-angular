import {
  PoThemeColorAction,
  poThemeColorBrand,
  PoThemeColorCategorical,
  PoThemeColorFeedback,
  PoThemeColorNeutral
} from '../../interfaces/po-theme-color.interface';

/**
 * Define as cores de ação padrão para temas escuros.
 */
const poThemeDefaultActionsDark: PoThemeColorAction = {
  /** Cor padrão. */
  default: 'var(--color-brand-01-dark)',
  /** Cor ao passar o mouse. */
  hover: 'var(--color-brand-01-darker)',
  /** Cor quando pressionado. */
  pressed: 'var(--color-brand-01-darkest)',
  /** Cor quando desabilitado. */
  disabled: 'var(--color-neutral-mid-40)',
  /** Cor ao focar. */
  focus: 'var(--color-brand-01-darkest)'
};

/**
 * Define as cores neutras padrão para temas escuros.
 */
const poThemeDefaultNeutralsDark: PoThemeColorNeutral = {
  /** Tons de cinza claro. */
  light: {
    '00': '#060613',
    '05': '#1D1D30',
    '10': '#36364A',
    '20': '#515162',
    '30': '#69697C'
  },
  /** Tons de cinza intermediários. */
  mid: {
    '40': '#9191A1',
    '60': '#B4B4C0'
  },
  /** Tons de cinza escuro. */
  dark: {
    '70': '#E7E5E4',
    '80': '#ECECEE',
    '90': '#F9F9FA',
    '95': '#ffffff'
  }
};

/**
 * Define as cores de feedback padrão para temas escuros.
 */
const poThemeDefaultFeedbackDark: PoThemeColorFeedback = {
  /** Cores para feedback negativo. */
  negative: {
    lightest: '#4a1512',
    lighter: '#72211d',
    light: '#9b2d27',
    base: '#be3e37',
    dark: '#d58581',
    darker: '#e3aeab',
    darkest: '#f6e6e5'
  },
  /** Cores para feedback informativo. */
  info: {
    lightest: '#081536',
    lighter: '#0f2557',
    light: '#173782',
    base: '#0079b8',
    dark: '#7996d7',
    darker: '#b0c1e8',
    darkest: '#e3e9f7'
  },
  /** Cores para feedback positivo. */
  positive: {
    lightest: '#002415',
    lighter: '#083a25',
    light: '#0f5236',
    base: '#107048',
    dark: '#41b483',
    darker: '#7ecead',
    darkest: '#def7ed'
  },
  /** Cores para feedback de aviso. */
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

const poThemeDefaultBrandsDark: poThemeColorBrand = {
  '01': {
    lightest: '#262A45',
    lighter: '#39416F',
    light: '#434C8C',
    base: '#576BB9',
    dark: '#87A1D3',
    darker: '#CFD9EE',
    darkest: '#F3F6FB'
  },
  '02': {
    lightest: '#560117',
    lighter: '#8B1031',
    light: '#BE1243',
    base: '#F94485',
    dark: '#FE68A2',
    darker: '#FECCE2',
    darkest: '#FEF1F6'
  },
  '03': {
    lightest: '#0E303E',
    lighter: '#1F596B',
    light: '#1B6C83',
    base: '#187E97',
    dark: '#37C3D9',
    darker: '#AEECF3',
    darkest: '#EEFCFD'
  }
};

const poThemeDefaultCategoricalsDark: PoThemeColorCategorical = {
  '01': '#003DCC',
  '02': '#669900',
  '03': '#6626A6',
  '04': '#D44E2A',
  '05': '#008599',
  '06': '#B17F00',
  '07': '#AC2076',
  '08': '#9F0712'
};

const poThemeDefaultCategoricalsOverlayDark: PoThemeColorCategorical = {
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
 * Define estilos específicos por componente e onRoot para temas escuros.
 */
const poThemeDefaultDarkValues = {
  perComponent: {
    /** TAB */
    '.po-tab-border-active': {
      'background-color': 'var(--color)'
    },
    /** OVERLAY */
    'po-overlay': {
      '--color-overlay': 'var(--color-neutral-light-20)'
    },
    /** MODAL */
    'po-modal': {
      '--color-overlay': 'var(--color-neutral-light-20)'
    },
    /** TOASTER */
    'po-toaster': {
      '--color-icon': 'var(--color-neutral-dark-80)',
      '--color-icon-warning': 'var(--color-neutral-light-00)'
    },
    /** BADGE */
    'po-badge': {
      '--color': 'var(--color-neutral-dark-95)'
    },
    'po-badge[p-status=warning]': {
      '--color': 'var(--color-neutral-light-00)'
    },
    /** BUTTON: brilho do estilo glow permanece claro no tema escuro */
    'po-button': {
      '--color-glow-ring': 'var(--color-neutral-dark-95)'
    },
    // LINK: item visitado
    'po-link': {
      '--text-color-visited': 'var(--color-action-default)'
    },
    // focus e outline: po-rich-text-body/ poinfo/ po-list-view/ po-stepper-circle (mudar no po-style)
    'po-rich-text-body .po-rich-text-body:focus-visible, po-info .po-info-link:focus-visible, po-list-view a.po-list-view-title-link:focus-visible, po-stepper-circle .po-stepper-circle:focus-visible':
      {
        'border-color': 'var(--color-action-default);',
        'outline-color': 'var(--color-action-focus);',
        'outline-width': 'var(--outline-width-focus-visible);',
        'outline-style': 'solid;',
        'outline-offset': '2px;'
      },
    // Background input disabled
    'div.po-lookup-filter-content input.po-input, input.po-input, po-datepicker, po-datepicker-range, po-decimal, po-email, po-input, po-login, po-lookup, po-number, po-password, po-url, po-combo, po-search, po-select, po-multiselect, po-timepicker':
      {
        '--background-disabled': 'var(--color-neutral-light-20);'
      },
    // autocomplete dos inputs (setar no po-style)
    'po-input input:-webkit-autofill, po-datepicker input:-webkit-autofill, po-datepicker-range input:-webkit-autofill, po-decimal input:-webkit-autofill, po-email input:-webkit-autofill, po-input input:-webkit-autofill, po-login input:-webkit-autofill, po-lookup input:-webkit-autofill, po-number input:-webkit-autofill, po-password input:-webkit-autofill, po-url input:-webkit-autofill, po-combo input:-webkit-autofill':
      {
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': '#ffffff',
        'transition': 'background-color 5000s ease-in-out 0s',
        'box-shadow': 'inset 0 0 20px 20px #23232329'
      },
    'po-overlay, po-page-slide': {
      '--color-overlay': 'var(--color-neutral-light-05)'
    },
    /** SELECT */
    'po-select': {
      '--color-hover': 'var(--color-action-hover);'
    },
    /** DROPDOWN */
    '.po-listbox-group-header .po-tag': {
      'color': 'var(--color-neutral-light-00);',
      'background-color': 'var(--color-action-default);'
    }
  },
  onRoot: {
    /* CORES LEGADAS */
    '--color-neutral': 'var(--color-neutral-dark-70)',
    '--color-secondary': 'var(--color-action-default)',
    '--color-secondary-light-20': 'var(--color-brand-01-lighter)',
    '--color-secondary-light-40': 'var(--color-brand-01-light)',
    '--color-secondary-dark-20': 'var(--color-brand-01-dark)',
    '--color-secondary-dark-40': 'var(--color-brand-01-darker)',
    '--color-secondary-dark-80': 'var(--color-brand-01-darkest)',
    '--color-black-alpha-10': 'rgba(255, 255, 255, 0.1)',
    '--color-black-alpha-15': 'rgba(255, 255, 255, 0.15)',
    '--color-black-alpha-30': 'rgba(255, 255, 255, 0.3)',
    '--color-po-user-guide-overlay': 'var(--color-neutral-light-20)',
    '--color-primary-light-80': 'color-mix(in srgb, var(--color-brand-02-base) 80%, black)',
    '--color-primary-light-95': 'color-mix(in srgb, var(--color-brand-02-base) 95%, black)',
    '--color-primary-alpha-50': 'color-mix(in srgb, var(--color-brand-02-base) 50%, white)',
    '--color-primary-dark-20': 'color-mix(in srgb, var(--color-brand-02-base) 20%, white)',
    '--color-primary-dark-40': 'color-mix(in srgb, var(--color-brand-02-base) 40%, white)',
    '--color-secondary-dark-60-alpha-70': 'color-mix(in srgb, var(--color-neutral-mid-60) 70%, white)',
    '--color-tertiary-light-90': 'color-mix(in srgb, var(--color-brand-03-base) 90%, black)',
    '--color-tertiary-dark-5': 'color-mix(in srgb, var(--color-brand-03-base) 5%, white)',
    /* TOOLBAR BADGE */
    '--color-toolbar-color-badge-text': 'var(--color-neutral-dark-95)',
    /* POPOVER */
    '--shadow-popover-box-shadow': '0 0 4px 0 var(--color-neutral-light-20)',
    '--shadow-popover-box-shadow-arrow': '-1px -1px 1px 0 var(--color-neutral-light-20)',
    /* CALENDAR */
    '--color-calendar-background-color-box-background-range':
      'var(--color-interval)' /*Deprecated v23.x.x utilizar --color-interval */,
    /* STEPPER */
    '--color-stepper-circle-disabled': 'var(--color-neutral-mid-40)',
    '--color-stepper-bar-disabled': 'var(--color-neutral-mid-40)',
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
  poThemeDefaultBrandsDark,
  poThemeDefaultActionsDark,
  poThemeDefaultFeedbackDark,
  poThemeDefaultNeutralsDark,
  poThemeDefaultDarkValues,
  poThemeDefaultCategoricalsDark,
  poThemeDefaultCategoricalsOverlayDark
};
