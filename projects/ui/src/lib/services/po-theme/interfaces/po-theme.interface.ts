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
  type: PoThemeType;

  /** Tipo de tema ativo */
  active?: PoThemeTypeEnum;
}

/**
 * @docsPrivate
 * @description
 * Interface para os tipos de tema ('light' e 'dark').
 */
interface PoThemeType {
  /** Tipo de tipo 'light' */
  light?: PoThemeTokens;

  /** Tipo de tipo 'dark' */
  dark?: PoThemeTokens;
}
