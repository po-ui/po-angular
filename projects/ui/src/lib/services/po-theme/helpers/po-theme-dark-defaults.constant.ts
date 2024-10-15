import { PoThemeColorAction, PoThemeColorFeedback, PoThemeColorNeutral } from '../interfaces/po-theme-color.interface';

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
    '00': '#1c1c1c',
    '05': '#202020',
    '10': '#2b2b2b',
    '20': '#3b3b3b',
    '30': '#5a5a5a'
  },
  /** Tons de cinza intermediários. */
  mid: {
    '40': '#7c7c7c',
    '60': '#a1a1a1'
  },
  /** Tons de cinza escuro. */
  dark: {
    '70': '#c1c1c1',
    '80': '#d9d9d9',
    '90': '#eeeeee',
    '95': '#fbfbfb'
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
    base: '#23489f',
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

/**
 * Define estilos específicos por componente e onRoot para temas escuros.
 */
const poThemeDefaultDarkValues = {
  perComponent: {
    /** TAB */
    '.po-tab-border-active': {
      'background-color': 'var(--color)'
    },
    /** GAUGE */
    '.po-gauge-wrapper': {
      'background-color': 'var(--color-neutral-light-00)'
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
    // CHART: AXIS LABEL
    'po-chart po-chart-container > svg .po-chart-axis-x-label, .po-chart-axis-y-label': {
      'fill': 'var(--color-neutral-dark-95)'
    },
    // RICH-TEXT: color button border
    'po-rich-text-toolbar .po-button-default.po-rich-text-toolbar-color-picker-button': {
      'border-style': 'solid'
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
    // background container
    'po-container': {
      '--background': 'var(--color-neutral-light-00);'
    },
    // Background input disabled
    'div.po-lookup-filter-content input.po-input, input.po-input, po-datepicker, po-datepicker-range, po-decimal, po-email, po-input, po-login, po-lookup, po-number, po-password, po-url, po-combo, po-search, po-select, po-multiselect':
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
    'po-select': {
      '--color-hover': 'var(--color-action-hover);'
    },
    'po-select select': {
      '--color': 'var(--color-neutral-light-30);'
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
    '--color-primary-light-80': 'color-mix(in srgb, var(--color-brand-02-base) 80%, black)',
    '--color-primary-light-95': 'color-mix(in srgb, var(--color-brand-02-base) 95%, black)',
    '--color-primary-alpha-50': 'color-mix(in srgb, var(--color-brand-02-base) 50%, white)',
    '--color-primary-dark-20': 'color-mix(in srgb, var(--color-brand-02-base) 20%, white)',
    '--color-primary-dark-40': 'color-mix(in srgb, var(--color-brand-02-base) 40%, white)',
    '--color-secondary-dark-60-alpha-70': 'color-mix(in srgb, var(--color-neutral-mid-60) 70%, white)',
    '--color-tertiary-light-90': 'color-mix(in srgb, var(--color-brand-03-base) 90%, black)',
    '--color-tertiary-dark-5': 'color-mix(in srgb, var(--color-brand-03-base) 5%, white)',
    /* PO-PAGE  */
    '--color-page-background-color-page': 'var(--color-neutral-light-00)',
    /* TOOLBAR BADGE */
    '--color-toolbar-color-badge-text': 'var(--color-neutral-dark-95)',
    /* POPOVER */
    '--shadow-popover-box-shadow': '0 0 4px 0 var(--color-neutral-light-20)',
    '--shadow-popover-box-shadow-arrow': '-1px -1px 1px 0 var(--color-neutral-light-20)',
    /* CALENDAR */
    '--color-calendar-background-color-box-background-range': 'var(--color-brand-01-lightest)',
    /* STEPPER */
    '--color-stepper-circle-disabled': 'var(--color-neutral-mid-40)',
    '--color-stepper-bar-disabled': 'var(--color-neutral-mid-40)',
    /* TAB */
    '--po-tab-smart-active': 'var(--color-neutral-dark-95)',
    '--po-tab-smart-background-item-selected': 'var(--color-brand-01-lighter)',
    '--po-tab-smart-background-hover': 'var(--color-brand-01-lightest)'
  }
};

export { poThemeDefaultActionsDark, poThemeDefaultFeedbackDark, poThemeDefaultNeutralsDark, poThemeDefaultDarkValues };
