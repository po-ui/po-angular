import { TemplateRef } from '@angular/core';
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
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-menu
   *  [p-menus]="[{ link: '/', label: 'PO ICON', icon: 'po-icon-news' }]">
   * </po-menu>
   * ```
   *
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca Font Awesome, da seguinte forma:
   * ```
   * <po-menu
   *  [p-menus]="[{ link: '/', label: 'FA ICON', icon: 'fa fa-podcast' }]">
   * </po-menu>
   * ```
   *
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * component.html:
   * ```
   * <ng-template #iconTemplate>
   *   <ion-icon name="heart"></ion-icon>
   * </ng-template>
   *
   * <po-menu [p-menus]="myProperty"></po-menu>
   * ```
   * component.ts:
   * ```
   * @ViewChild('iconTemplate', { static: true } ) iconTemplate : TemplateRef<void>;
   *
   * myProperty = [
   *  {
   *    link: '/',
   *    label: 'Icon',
   *    icon: this.iconTemplate
   *  }
   * ];
   * ```
   * > São exibidos apenas no primeiro nível de menu e serão visíveis apenas se todos os itens de primeiro nível possuírem ícones.
   * O menu colapsado também aparecerá somente se todos os itens de primeiro nível de menu possuírem ícones e textos curtos.
   */
  icon?: string | TemplateRef<void>;

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
