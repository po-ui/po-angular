/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Interface para representar as cores do tema.
 *
 * @usedBy PoThemeService
 */
export interface PoThemeColor {
  /**
   * Cores da Brand a serem aplicadas.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand = {
   *  01: PoThemeColorTone,
   *  02: PoThemeColorTone,
   *  03: PoThemeColorTone
   * }
   * ```
   */
  'brand'?: poThemeColorBrand;

  /**
   *  Cores da Action a serem aplicadas.
   *
   * Exemplo de uso:
   * ```javascript
   * PoThemeColor.action = {
   *  default: 'var(--color-brand-01-base)',
   *  hover: 'var(--color-brand-01-dark)',
   *  pressed: 'var(--color-brand-01-darker)',
   *  disabled: 'var(--color-neutral-light-30)',
   *  focus: 'var(--color-brand-01-darkest)'
   * }
   * ```
   */
  'action'?: PoThemeColorAction;

  /**
   *  Cores Neutrals a serem aplicadas.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.neutral = {
   *  light: { '00': string, '05': string, '10': string, '20': string, '30': string },
   *  mid: { '40': string, '60': string },
   *  dark: { '70': string, '80': string, '90': string, '95': string },
   * }
   * ```
   */
  'neutral'?: PoThemeColorNeutral;

  // /**
  //  *  Cores de Feedback a serem aplicadas.
  //  *
  //  * Exemplo de uso:
  //  * ```typescript
  //  * PoThemeColor.feedback = {
  //  *  'negative'?: PoThemeColorTone;
  //  *  'info'?: PoThemeColorTone;
  //  *  'positive'?: PoThemeColorTone;
  //  *  'warning'?: PoThemeColorTone;
  //  * }
  //  * ```
  //  */
  'feedback'?: PoThemeColorFeedback;
}

/**
 * Interface para as variantes de cor da marca.
 *
 * @docsPrivate
 */
export interface poThemeColorBrand {
  /**
   *  Cores da Brand Primaria`
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  lightest: '#f2eaf6',
   *  lighter: '#d9c2e5',
   *  light: '#bd94d1',
   *  base: '#753399',
   *  dark: '#5b1c7d',
   *  darker: '#400e58',
   *  darkest: '#260538'
   * }
   * ```
   */
  '01'?: PoThemeColorTone;

  /**
   *  Cores da Brand Secundária`
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['02'] = {
   *  base: '#b92f72',
   * }
   * ```
   */
  '02'?: PoThemeColorTone;

  /**
   *  Cores da Brand Terciária`
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['03'] = {
   *  base: '#ffd464',
   * }
   * ```
   */
  '03'?: PoThemeColorTone;
}

/**
 * Interface para as cores de ação do tema.
 *
 * @usedBy PoThemeService
 */
export interface PoThemeColorAction {
  /**
   *  Cores da Action 'Default'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.action = {
   *  default: 'var(--color-brand-01-base)',
   * }
   * ```
   */
  'default'?: string;

  /**
   *  Cores da Action para 'hover'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.action = {
   *  hover: 'var(--color-brand-01-dark)',
   * }
   * ```
   */
  'hover'?: string;

  /**
   *  Cores da Action para 'pressed'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.action = {
   *  pressed: 'var(--color-brand-01-darker)',
   * }
   * ```
   */
  'pressed'?: string;

  /**
   *  Cores da Action de 'disabled'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.action = {
   *  disabled: 'var(--color-neutral-light-30)',
   * }
   * ```
   */
  'disabled'?: string;

  /**
   *  Cores da Action para 'focus'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.action = {
   *  focus: 'var(--color-brand-01-darkest)'
   * }
   * ```
   */
  'focus'?: string;
}

// /**
//  * Interface para as cores de feedback do tema.
//  *
//  * @usedBy PoThemeService
//  */
export interface PoThemeColorFeedback {
  /**
   *  Cores da Feedback para 'negative'
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.feedback.negative = {
   *  lightest: '#f6e6e5',
   *  lighter: '#e3aeab',
   *  light: '#d58581',
   *  base: '#be3e37',
   *  dark: '#9b2d27',
   *  darker: '#72211d',
   *  darkest: '#4a1512',
   * }
   * ```
   */
  'negative'?: PoThemeColorTone;

  /**
   *  Cores da Feedback para 'info'
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.feedback.info = {
   *  lightest: '#e3e9f7',
   *  lighter: '#b0c1e8',
   *  light: '#7996d7',
   *  base: '#23489f',
   *  dark: '#173782',
   *  darker: '#0f2557',
   *  darkest: '#081536',
   * }
   * ```
   */
  'info'?: PoThemeColorTone;

  /**
   *  Cores da Feedback para 'positive'
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.feedback.positive = {
   *  lightest: '#def7ed',
   *  lighter: '#7ecead',
   *  light: '#41b483',
   *  base: '#107048',
   *  dark: '#0f5236',
   *  darker: '#083a25',
   *  darkest: '#002415',
   * }
   * ```
   */
  'positive'?: PoThemeColorTone;

  /**
   *  Cores da Feedback para 'warning'
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.feedback.warning = {
   *  lightest: '#fcf6e3',
   *  lighter: '#f7dd97',
   *  light: '#f1cd6a',
   *  base: '#efba2a',
   *  dark: '#d8a20e',
   *  darker: '#705200',
   *  darkest: '#473400',
   * }
   * ```
   */
  'warning'?: PoThemeColorTone;
}

/**
 * Interface para representar as variantes de tons de cor.
 *
 * @docsPrivate
 */
interface PoThemeColorTone {
  /**
   *  Cores de Tom do tipo 'lightest'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  lightest: '#f2eaf6',
   * }
   * ```
   */
  'lightest'?: string;

  /**
   *  Cores de Tom do tipo 'lighter'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  lighter: '#d9c2e5',
   * }
   * ```
   */
  'lighter'?: string;

  /**
   *  Cores de Tom do tipo 'light'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  light: '#bd94d1',
   * }
   * ```
   */
  'light'?: string;

  /**
   *  Cores de Tom do tipo 'base'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  base: '#753399',
   * }
   * ```
   */
  'base'?: string;

  /**
   *  Cores de Tom do tipo 'dark'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  dark: '#5b1c7d',
   * }
   * ```
   */
  'dark'?: string;

  /**
   *  Cores de Tom do tipo 'darker'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  darker: '#400e58',
   * }
   * ```
   */
  'darker'?: string;

  /**
   *  Cores de Tom do tipo 'darkest'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.brand['01'] = {
   *  darkest: '#260538'
   * }
   * ```
   */
  'darkest'?: string;
}

/**
 * Interface para as cores neutras do tema.
 *
 * @usedBy PoThemeService
 */
export interface PoThemeColorNeutral {
  /**
   *  Cores Neutrals do tipo 'light'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.neutral.light = {
   *  '00': '#ffffff',
   *  '05': '#fbfbfb',
   *  '10': '#eceeee',
   *  '20': '#dadedf',
   *  '30': '#b6bdbf'
   * }
   * ```
   */
  'light'?: {
    '00'?: string;
    '05'?: string;
    '10'?: string;
    '20'?: string;
    '30'?: string;
  };

  /**
   *  Cores Neutrals do tipo 'mid'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.neutral.mid = {
   *  '40': '#9da7a9',
   *  '60': '#6e7c7f',
   * }
   * ```
   */
  'mid'?: {
    '40'?: string;
    '60'?: string;
  };

  /**
   *  Cores Neutrals do tipo 'dark'.
   *
   * Exemplo de uso:
   * ```typescript
   * PoThemeColor.neutral.dark = {
   *  '70': '#4a5c60',
   *  '80': '#2c3739',
   *  '90': '#1d2426',
   *  '95': '#0b0e0e',
   * }
   * ```
   */
  'dark'?: {
    '70'?: string;
    '80'?: string;
    '90'?: string;
    '95'?: string;
  };
}
