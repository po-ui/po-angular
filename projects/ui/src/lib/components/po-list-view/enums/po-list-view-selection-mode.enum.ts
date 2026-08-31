/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Define o modo de seleção dos itens do `po-list-view` quando a seleção está habilitada
 * através da propriedade `p-select`.
 */
export enum PoListViewSelectionMode {
  /** Permite selecionar apenas um item por vez (seleção única). */
  Single = 'single',

  /** Permite selecionar um ou mais itens simultaneamente (seleção múltipla). É o valor padrão. */
  Multiple = 'multiple'
}
