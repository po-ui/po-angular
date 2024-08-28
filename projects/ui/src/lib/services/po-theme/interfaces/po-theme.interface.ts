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
  /** Nome do tema: 'default', 'totvs', 'sunset', etc. */
  name: string;

  /** Tipos de tema: 'light' e 'dark' */
  type: PoThemeType | Array<PoThemeType>;

  /** Tipo e nivel de acessibilidade de tema ativo */
  active?: PoThemeTypeEnum | PoThemeActive;
}

/**
 * @docsPrivate
 * @description
 * Interface para os tipos de tema ('light' e 'dark').
 */
export interface PoThemeType {
  /** Tipo de tipo 'light' */
  light?: PoThemeTokens;

  /** Tipo de tipo 'dark' */
  dark?: PoThemeTokens;

  /** Nivel de Acessibilidade */
  a11y?: PoThemeA11yEnum;
}

/**
 * @docsPrivate
 * @description
 * Interface para o tipo de tema ativo.
 */
export interface PoThemeActive {
  /** Tipo de tema ativo */
  type?: PoThemeTypeEnum;

  /** Nivel de Acessibilidade */
  a11y?: PoThemeA11yEnum;
}
