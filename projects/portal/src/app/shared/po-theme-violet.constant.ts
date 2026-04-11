import {
  PoThemeA11yEnum,
  poThemeDefaultActions,
  poThemeDefaultActionsDark,
  poThemeDefaultDarkValues,
  poThemeDefaultDarkValuesAA,
  poThemeDefaultFeedback,
  poThemeDefaultFeedbackDark,
  poThemeDefaultLightValues,
  poThemeDefaultLightValuesAA,
  poThemeDefaultNeutrals,
  PoThemeTypeEnum
} from '../../../../ui/src/lib';

/*------------------------------------*\
  TEMA AURA — Paleta de cores
  Brand 01: Indigo (primária)
  Brand 02: Ciano (secundária)
  Brand 03: Lavanda (destaque)
  Neutrals: Slate
\*------------------------------------*/

const colorsAura = {
  brand: {
    '01': {
      lightest: '#EEF2FF',
      lighter: '#C7D2FE',
      light: '#818CF8',
      base: '#4F46E5',
      dark: '#4338CA',
      darker: '#3730A3',
      darkest: '#312E81'
    },
    '02': {
      base: '#0891B2'
    },
    '03': {
      base: '#A855F7'
    }
  },
  action: {
    ...poThemeDefaultActions,
    disabled: 'var(--color-neutral-mid-40)'
  },
  feedback: {
    ...poThemeDefaultFeedback,
    info: {
      ...poThemeDefaultFeedback.info,
      base: '#0079b8'
    }
  },
  neutral: {
    light: {
      '00': '#FFFFFF',
      '05': '#F8FAFC',
      '10': '#F1F5F9',
      '20': '#E2E8F0',
      '30': '#CBD5E1'
    },
    mid: {
      '40': '#94A3B8',
      '60': '#64748B'
    },
    dark: {
      '70': '#475569',
      '80': '#334155',
      '90': '#1E293B',
      '95': '#0F172A'
    }
  }
};

const colorsDarkAura = {
  brand: {
    '01': {
      darkest: '#EEF2FF',
      darker: '#E0E7FF',
      dark: '#C7D2FE',
      base: '#818CF8',
      light: '#4F46E5',
      lighter: '#3730A3',
      lightest: '#1E1B4B'
    },
    '02': {
      base: '#67E8F9'
    },
    '03': {
      base: '#D8B4FE'
    }
  },
  action: {
    ...poThemeDefaultActionsDark,
    disabled: 'var(--color-neutral-mid-40)'
  },
  feedback: {
    ...poThemeDefaultFeedbackDark,
    info: {
      ...poThemeDefaultFeedbackDark.info,
      base: '#0079b8'
    }
  },
  neutral: {
    light: {
      '00': '#0F172A',
      '05': '#131B2E',
      '10': '#1E293B',
      '20': '#334155',
      '30': '#475569'
    },
    mid: {
      '40': '#64748B',
      '60': '#94A3B8'
    },
    dark: {
      '70': '#CBD5E1',
      '80': '#E2E8F0',
      '90': '#F1F5F9',
      '95': '#F8FAFC'
    }
  }
};

export const poThemeVioletConstant = {
  name: 'po-theme-aura',
  type: [
    {
      light: {
        color: colorsAura,
        onRoot: {
          ...poThemeDefaultLightValues.onRoot,
          '--color-page-background-color-page': 'var(--color-neutral-light-05)'
        },
        perComponent: {
          ...poThemeDefaultLightValues.perComponent
        }
      },
      dark: {
        color: colorsDarkAura,
        onRoot: {
          ...poThemeDefaultDarkValues.onRoot,
          '--color-page-background-color-page': 'var(--color-neutral-light-05)'
        },
        perComponent: {
          ...poThemeDefaultDarkValues.perComponent
        }
      },
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: {
        color: colorsAura,
        onRoot: {
          ...poThemeDefaultLightValuesAA.onRoot,
          '--color-page-background-color-page': 'var(--color-neutral-light-05)'
        },
        perComponent: {
          ...poThemeDefaultLightValuesAA.perComponent
        }
      },
      dark: {
        color: colorsDarkAura,
        onRoot: {
          ...poThemeDefaultDarkValuesAA.onRoot,
          '--color-page-background-color-page': 'var(--color-neutral-light-05)'
        },
        perComponent: {
          ...poThemeDefaultDarkValuesAA.perComponent
        }
      },
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};
