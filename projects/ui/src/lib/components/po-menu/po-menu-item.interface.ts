import { PoMenuItemBadge } from './po-menu-item/po-menu-item-badge.interface';

/**
 * @usedBy PoMenuComponent
 *
 * @description
 *
 * Interface para os itens de menu do componente po-menu.
 *
 */
export interface PoMenuItem {
  /**
   * @optional
   *
   * @description
   *
   * Badge do item de menu.
   *
   * Ao adicioná-lo em um subitem (filho) todos os itens ascendentes (pai) serão marcados com um ponto vermelho.
   *
   * > O `po-badge` só será exibido caso o item do menu não possua `subItems` e seu valor seja maior ou igual a 0.
   */
  badge?: PoMenuItemBadge;

  /** Texto do item de menu. */
  label: string;

  /** Link para redirecionamento no click do item do menu, podendo ser um link interno ou externo. */
  link?: string;

  /** Ação personalizada para clique do item de menu. */
  action?: Function;

  /**
   * Ícone para o item de menu, os [ícones aceitos](/guides/icons) são os definidos no guia de estilo da PO.
   * São exibidos apenas no primeiro nível de menu e serão visíveis apenas se todos os itens de primeiro nível possuírem ícones.
   * O menu colapsado também aparecerá somente se todos os itens de primeiro nível de menu possuírem ícones e textos curtos.
   */
  icon?: string;

  /**
   * Texto curto para o item que aparece quando o menu estiver colapsado.
   * Se colapsado, aparecerá somente se todos os itens de primeiro nível de menu que possuírem ícones e textos curtos.
   */
  shortLabel?: string;

  /** Lista de sub-items, criando novos níveis dentro do menu. O número máximo de níveis do menu é igual a 4. */
  subItems?: Array<PoMenuItem>;

  // Identificador do Item;
  id?: string;
}
