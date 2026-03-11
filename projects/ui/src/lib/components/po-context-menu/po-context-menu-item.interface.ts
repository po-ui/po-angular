/**
 * @usedBy PoContextMenuComponent
 *
 * @description
 *
 * Interface para os itens do componente po-context-menu.
 */
export interface PoContextMenuItem {
  /** Texto do item de menu. */
  label: string;

  /** Acao executada ao clicar no item. */
  action?: Function;

  /** Estado de selecao do item. */
  selected?: boolean;
}
