/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Define o layout de renderização das ações de cada item do `po-list-view`.
 */
export enum PoListViewActionsLayout {
  /**
   * Layout padrão (comportamento legado): exibe até duas ações como botões *inline* e,
   * a partir de três ações, um menu de "três pontos". É o valor padrão.
   */
  Default = 'default',

  /**
   * Layout Animalia: define o tipo da ação pelo número de ações do item:
   * - **Advanced**: apenas ação de título (seta à direita).
   * - **Single**: uma única ação (botão secundário).
   * - **Multiple**: duas ou mais ações (menu de "três pontos").
   */
  Animalia = 'animalia'
}
