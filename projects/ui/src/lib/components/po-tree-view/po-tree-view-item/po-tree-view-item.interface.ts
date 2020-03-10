/**
 * @usedBy PoTreeViewComponent
 *
 * @description
 *
 * Interface para definição dos itens do componente `po-tree-view`.
 */
export interface PoTreeViewItem {
  /** Desabilita a selecão do item. */
  // disabled?: boolean;

  /** Texto de exibição do item. */
  label: string;

  /** Valor do item que poderá ser utilizado como referência para sua identificação. */
  value: string | number;

  /** Expande o item. */
  expanded?: boolean;

  /**
   * Marca o item como selecionado.
   *
   * > Caso o item que conter `subItems` for selecionado, os seus itens filhos serão também selecionados.
   */
  selected?: boolean | null;

  /** Lista de itens do próximo nível, e assim consecutivamente até que se atinja o quarto nível. */
  subItems?: Array<PoTreeViewItem>;
}
