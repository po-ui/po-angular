import { PoMenuPanelItem } from './po-menu-panel-item.interface';

/**
 * @docsPrivate
 *
 * @usedBy PoMenuPanelItem
 *
 * @description
 *
 * Interface para os itens de menu internos do componente `po-menu-panel`.
 *
 */
export interface PoMenuPanelItemInternal extends PoMenuPanelItem {
  // Identificador do item.
  id: string;

  // Indica o tipo de item, como 'internalLink', 'noLink' e 'externalLink'.
  type: string;

  // Indica se o item está selecionado.
  isSelected?: boolean;
}
