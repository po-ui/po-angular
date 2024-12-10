/**
 * Enum para definir os tipos de tema suportados pelo serviço de temas.
 *
 * @usedBy PoThemeService
 *
 * @example
 *
 * Em um serviço de tema, você pode usar este enum para alternar entre os tipos de temas suportados.
 *
 * ```
 * import { PoThemeTypeEnum } from '@po-ui/theme';
 *
 * // Definindo o tipo de tema para light
 * themeService.setTheme(...theme, PoThemeTypeEnum.light);
 *
 * // Definindo o tipo de tema para dark
 * themeService.setTheme(...theme, PoThemeTypeEnum.dark);
 * ```
 */
export enum PoThemeTypeEnum {
  /** Define o tema como claro. */
  light,

  /** Define o tema como escuro. */
  dark
}
