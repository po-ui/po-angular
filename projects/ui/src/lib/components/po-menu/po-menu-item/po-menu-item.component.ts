import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { convertToInt, convertToBoolean } from '../../../utils/util';

import { PoMenuItem } from '../po-menu-item.interface';
import { PoMenuItemsService } from '../services/po-menu-items.service';

// valor para que caibam 3 linhas de `label`
const poMenuItemSubItemSize = 98;

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que implementa cada item do po-menu.
 */
@Component({
  selector: 'po-menu-item',
  templateUrl: './po-menu-item.component.html'
})
export class PoMenuItemComponent implements OnDestroy, OnInit {
  private _badgeValue: number;
  private _isSelected: boolean = false;
  private _isSubItem: boolean = false;
  private _subItems: Array<PoMenuItem>;

  isSelectedSubItem;
  maxHeight: number = 0;

  private itemSubscription: Subscription;

  // Ação que será chamada ao clicar no item.
  @Input('p-action') action: Function;

  // Indica se contém algum item filho com o badge.
  @Input('p-badge-alert') badgeAlert: boolean;

  // Cor do badge.
  @Input('p-badge-color') badgeColor: string;

  // Valor do badge.
  @Input('p-badge-value') set badgeValue(badgeValue: number) {
    this._badgeValue = convertToInt(badgeValue);
  }

  get badgeValue() {
    return this._badgeValue;
  }

  // Indica se o menu está colapsado
  @Input('p-collapsed-menu') collapsedMenu: boolean;

  // Ícone de menu
  @Input('p-icon') icon: string;

  // Identificador do item.
  @Input('p-id') id: string;

  // Indica se o item está aberto (menu agrupado)
  @Input('p-is-opened') isOpened: boolean;

  // Indica se o item está selecionado.
  @Input('p-is-selected') set isSelected(value: boolean) {
    this._isSelected = convertToBoolean(value);

    this.isSelectedSubItem = this.isSelected && this.isSubItem;
  }
  get isSelected() {
    return this._isSelected;
  }

  // Indica se o item é um sub item
  @Input('p-is-sub-item') set isSubItem(value: boolean) {
    this._isSubItem = convertToBoolean(value);
  }

  get isSubItem() {
    return this._isSubItem;
  }

  // Texto que aparecerá representando o item.
  @Input('p-label') label: string;

  // Indica qual em nível do po-menu encontra-se.
  @Input('p-level') level: number;

  // Link do item.
  @Input('p-link') link?: string;

  // Texto que aparecerá representando o item.
  @Input('p-short-label') shortLabel: string;

  // Lista de sub-items.
  @Input('p-sub-items') set subItems(subitems: Array<PoMenuItem>) {
    this._subItems = subitems;
    if (this.isOpened) {
      this.calcMenuSubItemsMaxHeight();
    }
  }

  get subItems() {
    return this._subItems;
  }

  // Indica o tipo de item, como 'internalLink' ou 'subItems'.
  @Input('p-type') type: string;

  @ViewChild('menuSubItems') menuSubItems: ElementRef;

  get canShowBadge() {
    return this.type !== 'subItems' && (this.badgeValue || this.badgeValue === 0) && this.badgeValue >= 0;
  }

  constructor(private menuItemsService: PoMenuItemsService) {}

  ngOnDestroy(): void {
    this.itemSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // subscribe to menu component messages
    this.itemSubscription = this.menuItemsService.receiveFromParentMenuClicked().subscribe(menu => {
      this.processMenuItem(menu);
    });
  }

  clickMenuItem(event): void {
    if (!(event.ctrlKey || event.metaKey)) {
      event.preventDefault();

      // Emmit to parent
      this.menuItemsService.sendToParentMenuClicked({
        link: this.link,
        action: this.action,
        id: this.id,
        icon: this.icon,
        label: this.label,
        level: this.level,
        subItems: this.subItems,
        isSelected: this.isSelected,
        isOpened: this.isOpened,
        shortLabel: this.shortLabel,
        type: this.type
      });
    }
  }

  private accordionAnimation(
    menuActive: PoMenuItem,
    menuOpened: PoMenuItem,
    hasSubItemOpened: boolean,
    activatedByRoute: boolean
  ) {
    if (this.id === menuOpened['id']) {
      this.maxHeight = this.subItems.length * poMenuItemSubItemSize;
    }

    if (hasSubItemOpened) {
      this.maxHeight = menuOpened['isOpened']
        ? this.maxHeight + menuOpened.subItems.length * poMenuItemSubItemSize
        : this.maxHeight - menuOpened.subItems.length * poMenuItemSubItemSize;

      if (activatedByRoute) {
        this.maxHeight = this.getMinimumHeight(0, this, menuActive);
      }
    }
  }

  private activateMenu(menu: any): void {
    this.isSelected = menu && this.id === menu.id;
  }

  private calcMenuSubItemsMaxHeight() {
    setTimeout(() => {
      const subItems = Array.from(this.menuSubItems.nativeElement.querySelectorAll('.po-menu-item'));
      subItems.forEach((menuItem: any) => (this.maxHeight += menuItem.offsetHeight));
    });
  }

  private getMinimumHeight(minimumHeight: number, menuItem: PoMenuItem, menuActive: PoMenuItem) {
    minimumHeight += poMenuItemSubItemSize;

    if (menuItem.subItems && this.hasSubItem(menuItem.subItems, menuActive['id'])) {
      for (let index = 0; index < menuItem.subItems.length; index++) {
        minimumHeight = this.getMinimumHeight(minimumHeight, menuItem.subItems[index], menuActive);
      }
    }

    return minimumHeight;
  }

  private groupedMenu(menuActive: PoMenuItem, menuOpened: PoMenuItem, activatedByRoute: boolean = false): void {
    const hasSubItemOpened =
      menuOpened && this.id !== menuOpened['id'] ? this.hasSubItem(this.subItems, menuOpened['id']) : false;

    this.isOpened = this.isMenuOpened(menuOpened, hasSubItemOpened);

    this.isSelected = menuActive && !this.isOpened ? this.hasSubItem(this.subItems, menuActive['id']) : false;

    if (!this.isOpened) {
      this.maxHeight = 0;
      return;
    }
    this.accordionAnimation(menuActive, menuOpened, hasSubItemOpened, activatedByRoute);
  }

  private hasSubItem(subItems: Array<PoMenuItem>, id: string): boolean {
    if (subItems) {
      return subItems.some(item => {
        return item['id'] === id ? true : this.hasSubItem(item.subItems, id);
      });
    }
  }

  private isMenuOpened(menuOpened: PoMenuItem, hasSubItemOpened: boolean): boolean {
    if (menuOpened) {
      return this.id === menuOpened['id'] ? menuOpened['isOpened'] : hasSubItemOpened;
    }

    return false;
  }

  private processMenuItem(menu) {
    if (this.type === 'internalLink') {
      this.activateMenu(menu.active);
      return;
    }

    if (this.type === 'subItems') {
      this.groupedMenu(menu.active, menu.grouped, menu.activatedByRoute);
      return;
    }
  }
}
