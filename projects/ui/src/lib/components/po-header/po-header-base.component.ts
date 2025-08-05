import { Directive, Input, TemplateRef } from '@angular/core';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBrand } from './interfaces/po-header-logo.interface';

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
