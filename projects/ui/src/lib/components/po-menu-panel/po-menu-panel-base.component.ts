import { Input, Directive } from '@angular/core';

import { isExternalLink, uuid } from '../../utils/util';

import { PoMenuPanelItem } from './po-menu-panel-item/po-menu-panel-item.interface';
import { PoMenuPanelItemInternal } from './po-menu-panel-item/po-menu-panel-item-internal.interface';

/**
 * @description
 *
 * Este é um componente de menu lateral composto apenas por ícones e com um nível, utilizado para navegação
 * em páginas internas, externas da aplicação ou aciona uma ação.
 *
 * O componente `po-menu-panel` recebe uma lista de objetos do tipo `MenuPanelItem` com as informações dos
 * itens de menu como textos, links para redirecionamento, ações e ícones.
 */
@Directive()
export class PoMenuPanelBaseComponent {
  private _menus;

  /** Lista dos itens do `po-menu-panel`. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. */
  @Input('p-menus') set menus(menus: Array<PoMenuPanelItem>) {
    this._menus = Array.isArray(menus) ? menus : [];

    this.setMenuExtraProperties(this._menus);
    this.validateMenus(this._menus);
  }

  get menus() {
    return this._menus;
  }

  private setMenuExtraProperties(menus: Array<PoMenuPanelItem>) {
    menus.forEach(menuItem => this.setMenuItemProperties(<PoMenuPanelItemInternal>menuItem));
  }

  private setMenuItemProperties(menuItem: PoMenuPanelItemInternal) {
    menuItem.id = menuItem.id || uuid();
    menuItem.type = this.setMenuType(menuItem);
  }

  private setMenuType(menuItem: PoMenuPanelItem): string {
    if (!menuItem.link) {
      return 'noLink';
    }

    if (isExternalLink(menuItem.link)) {
      return 'externalLink';
    }

    return 'internalLink';
  }

  private validateMenu(menuItem: PoMenuPanelItem) {
    if (!menuItem.label) {
      throw new Error('O atributo PoMenuPanelItem.label não pode ser vazio.');
    }

    if (!menuItem.icon) {
      throw new Error('O atributo PoMenuPanelItem.icon não pode ser vazio.');
    }
  }

  private validateMenus(menus): void {
    menus.forEach(menu => this.validateMenu(menu));
  }
}
