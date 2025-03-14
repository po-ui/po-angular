/**
 * @usedBy PoThemeService
 *
 * @description
 * Enum para configurar o nível de acessibilidade dos componentes através do serviço de tema.
 *
 * ```
 * import { PoThemeA11yEnum } from '@po-ui/theme';
 *
 * // Definindo o nível de acessibilidade ao configurar as cores e o tipo do tema (light | dark)
 * themeService.setTheme(...theme, ...type, PoThemeA11yEnum.AA);
 *
 * // Definindo o nível de acessibilidade ao configurar apenas as cores do tema
 * themeService.setThemeA11y(...theme, PoThemeA11yEnum.AAA);
 *
 * // Alterando o nível de acessibilidade com as cores do tema já definidas
 * themeService.setCurrentThemeA11y(PoThemeA11yEnum.AAA);
 * ```
 */
export enum PoThemeA11yEnum {
  /** Nível de acessibilidade AA.
   * - Define a espessura do `outline` para **2px**.
   * - Disponibiliza o tamanho `small` para componentes de formulário (buttons, inputs, checkboxes, radios e switches)
   * conforme suas documentações.
   */
  AA = 'AA',

  /** Nível de acessibilidade AAA.
   * - Define a espessura do `outline` para **4px**.
   * - Não disponibiliza o tamanho `small` para componentes de formulário.
   */
  AAA = 'AAA'
}
