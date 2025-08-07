import { Directive, Input, TemplateRef } from '@angular/core';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBrand } from './interfaces/po-header-brand.interface';
import { PoHeaderActionTool } from './interfaces/po-header-action-tool.interface';
import { PoHeaderUser } from './interfaces/po-header-user.interface';

@Directive()
export abstract class PoHeaderBaseComponent {
  private _menuItems: Array<PoHeaderActions> = [];

  /**
   * @optional
   *
   * @description
   *
   * Número de itens dentro do botão "mais".
   *
   */
  @Input('p-amount-more') amountMore?: number;

  @Input('p-template') template!: TemplateRef<any>;

  @Input('p-brand') brand: PoHeaderBrand;

  @Input('p-actions-tools') actionsTools: Array<PoHeaderActionTool> = [];

  @Input('p-header-user') headerUser: PoHeaderUser;

  @Input('p-menu-items') set menuItems(items: Array<PoHeaderActions>) {
    this._menuItems = (items || []).map(item => ({
      ...item,
      id: item.id || this.generateRandomId()
    }));
  }

  get menuItems(): Array<PoHeaderActions> {
    return this._menuItems;
  }

  private generateRandomId(): string {
    return String(Math.floor(Math.random() * 999 + 1));
  }
}
