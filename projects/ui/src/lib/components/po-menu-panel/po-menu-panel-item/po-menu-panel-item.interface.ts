/**
 * @usedBy PoMenuPanelComponent
 *
 * @description
 *
 * Interface para os itens de menu do componente `po-menu-panel`.
 *
 */
export interface PoMenuPanelItem {
  /** Ação personalizada para clique do item de menu. */
  action?: Function;

  /**  Ícone para o item de menu, os [ícones aceitos](/guides/icons) são os definidos no guia de estilo da PO. */
  icon: string;

  /** Texto do item de menu. */
  label: string;

  /** Link para redirecionamento no click do item do menu, podendo ser um link interno ou externo. */
  link?: string;
}
