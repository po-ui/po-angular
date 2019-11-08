/**
 * @usedBy PoTreeViewComponent
 *
 * @description
 *
 * Interface para definição dos itens do componente `po-tree-view`.
 */
export interface PoTreeViewItem {

  /** Texto de exibição do item. */
  label: string;

  /** Valor do item que poderá ser utilizado como referência para sua identificação. */
  value: string | number;

  /** Define se o item estará aberto (expandido) */
  expanded?: boolean;

  /** Lista de itens do próximo nível, e assim consecutivamente até que se atinja o quarto nível. */
  subItems?: Array<PoTreeViewItem>;

}
