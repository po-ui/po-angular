import {
  poThemeDefaultActions,
  poThemeDefaultActionsDark,
  poThemeDefaultDarkValues,
  poThemeDefaultFeedback,
  poThemeDefaultFeedbackDark,
  poThemeDefaultLightValues,
  poThemeDefaultNeutrals,
  PoThemeTypeEnum
} from '../../../../ui/src/lib';

export const poThemeConstant = {
  name: 'po-theme',
  type: {
    light: {
      color: {
        brand: {
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
          ...poThemeDefaultNeutrals
        }
      },
      onRoot: {
        ...poThemeDefaultLightValues.onRoot,
        '--color-page-background-color-page': 'var(--color-neutral-light-05)'
      },
      perComponent: {
        ...poThemeDefaultLightValues.perComponent
      }
    },
    dark: {
      color: {
        brand: {
          '01': {
            darkest: '#f2eaf6',
            darker: '#d9c2e5',
            dark: '#bd94d1',
            base: '#753399',
            light: '#5b1c7d',
            lighter: '#400e58',
            lightest: '#260538'
          },
          '02': {
            base: '#b92f72'
          },
          '03': {
            base: '#ffd464'
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
        }
      },
      onRoot: {
        ...poThemeDefaultDarkValues.onRoot,
        '--color-page-background-color-page': 'var(--color-neutral-light-05)'
      },
      perComponent: {
        ...poThemeDefaultDarkValues.perComponent
      }
    }
  },
  active: PoThemeTypeEnum.light
};
