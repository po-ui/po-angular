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

  /**
   * Define se o tema herda a identidade visual do tema padrão do PO UI.
   *
   * A identidade visual corresponde aos arredondamentos dos componentes e à cor de fundo da página definidos
   * pelo tema padrão. Os estilos estruturais (ex.: espessura de outline, adensamento e ajustes de light/dark)
   * são aplicados em qualquer caso.
   *
   * As famílias de fonte do tema padrão não são controladas por esta propriedade: elas são definidas pelo CSS
   * do `@po-ui/style`. Um tema com fontes próprias deve declará-las nos seus tokens.
   *
   * Utilize `false` quando o tema define a própria identidade visual e não deve receber a do tema padrão.
   *
   * @default `true`
   */
  inheritDefaultStyle?: boolean;
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
