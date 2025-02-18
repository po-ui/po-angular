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
  /** Nível de acessibilidade duplo A (AA).
   * Adota uma espessura de outline de 2px para todos os componentes.
   * Habilita o tamanho small (32px) para componentes de formulário, como buttons e fields, enquanto mantém o
   * tamanho padrão como medium (44px) disponível.
   */
  AA = 'AA',

  /** Nível de acessibilidade triplo A (AAA).
   * Adota uma espessura de outline de 4px para todos os componentes.
   * Mantém o tamanho padrão (44px) para todos os componentes de formulário.
   * > Caso haja tentativa de atribuir o tamanho small a um componente, ele será ignorado, permanecendo no tamanho padrão.
   */
  AAA = 'AAA'
}
