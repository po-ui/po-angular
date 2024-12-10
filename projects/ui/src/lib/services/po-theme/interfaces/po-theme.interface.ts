import { PoThemeA11yEnum } from '../enum/po-theme-a11y.enum';
import { PoThemeTypeEnum } from '../enum/po-theme-type.enum';
import { PoThemeTokens } from './po-theme-tokens.interface';

/**
 * @usedBy PoThemeService
 *
 * @description
 * Interface para o método `setTheme()`.
 */
export interface PoTheme {
  /** Nome para o tema:
   * Ex.: default, totvs, sunset... */
  name: string;

  /** Tipo de tema:
   * - light
   * - dark */
  type: PoThemeType | Array<PoThemeType>;

  /** Tipo e nível de acessibilidade de tema ativo */
  active?: PoThemeTypeEnum | PoThemeActive;
}

/**
 * @docsPrivate
 * @description
 * Interface para os tipos de tema ('light' | 'dark').
 */
export interface PoThemeType {
  /** Tema claro */
  light?: PoThemeTokens;

  /** Tema escuro */
  dark?: PoThemeTokens;

  /** Nível de acessibilidade dos componentes:
   * - AA
   * - AAA */
  a11y?: PoThemeA11yEnum;
}

/**
 * @docsPrivate
 * @description
 * Interface para o tema ativo.
 */
export interface PoThemeActive {
  /** Tipo de tema:
   * - light
   * - dark */
  type?: PoThemeTypeEnum;

  /** Nível de acessibilidade dos componentes:
   * - AA
   * - AAA */
  a11y?: PoThemeA11yEnum;
}
