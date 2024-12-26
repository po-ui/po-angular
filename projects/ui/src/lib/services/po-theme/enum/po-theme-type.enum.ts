/**
 * @usedBy PoThemeService
 *
 * @description
 * Enum utilizado para configurar o tipo de tema suportado, é possível alternar entre os tipos definidos.
 *
 * ```
 * import { PoThemeTypeEnum } from '@po-ui/theme';
 *
 * // Definindo o tipo de tema como claro
 * themeService.setTheme(...theme, PoThemeTypeEnum.light);
 *
 * // Definindo o tipo de tema como escuro
 * themeService.setTheme(...theme, PoThemeTypeEnum.dark);
 *
 * // Alterando o tipo do tema para um tema já aplicado
 * themeService.setCurrentThemeType(PoThemeTypeEnum.dark);
 * ```
 */
export enum PoThemeTypeEnum {
  /** Define o tema como claro. */
  light,

  /** Define o tema como escuro. */
  dark
}
