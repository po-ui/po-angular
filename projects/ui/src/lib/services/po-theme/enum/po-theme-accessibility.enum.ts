/**
 * Enum para definir os níveis de acessibilidade suportados pelo serviço de temas.
 *
 * @usedBy PoThemeService
 *
 * @example
 *
 * Em um serviço de tema, você pode usar este enum de acessibilidade para alternar entre os níveis de temas suportados.
 *
 * ```
 * import { PoThemeAccessibilityEnum } from '@po-ui/theme';
 *
 * // Definindo o nível de acessibilidade ao setar o tema junto com o tipo
 * themeService.setTheme(...theme, ...type, PoThemeAccessibilityEnum.AA);
 *
 * // Definir o tema junto com o nível de acessibilidade
 * themeService.setThemeAccessibility(...theme, PoThemeAccessibilityEnum.AAA);
 *
 * // Definir o nível de acessibilidade de um tema já aplicado
 * themeService.setCurrentThemeAccessibility(PoThemeAccessibilityEnum.AAA);
 * ```
 */
export enum PoThemeAccessibilityEnum {
  /** Nível de acessibilidade duplo A (AA) */
  AA = 'AA',

  /** Nível de acessibilidade triplo A (AAA) */
  AAA = 'AAA'
}
