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
 * import { PoThemeA11yEnum } from '@po-ui/theme';
 *
 * // Definindo o nível de acessibilidade ao setar o tema junto com o tipo
 * themeService.setTheme(...theme, ...type, PoThemeA11yEnum.AA);
 *
 * // Definir o tema junto com o nível de acessibilidade
 * themeService.setThemeA11y(...theme, PoThemeA11yEnum.AAA);
 *
 * // Definir o nível de acessibilidade de um tema já aplicado
 * themeService.setCurrentThemeA11y(PoThemeA11yEnum.AAA);
 * ```
 */
export enum PoThemeA11yEnum {
  /** Nível de acessibilidade duplo A (AA) */
  AA = 'AA',

  /** Nível de acessibilidade triplo A (AAA) */
  AAA = 'AAA'
}
