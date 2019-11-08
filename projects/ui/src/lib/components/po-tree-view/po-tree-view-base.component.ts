import { EventEmitter, Input, Output } from '@angular/core';

import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';

const poTreeViewMaxLevel = 4;

/**
 * @description
 *
 * O componente fornece um modelo de visualização em árvore, possibilitando a visualização das informações de maneira
 * hierárquica, desta forma sendo possível utilizar até 4 níveis.
 *
 * Nele é possível navegar entre os itens através da tecla *tab*, permitindo expandir ou colapsar o item em foco
 * por meio das teclas
 * *enter* e *space*.
 */
export class PoTreeViewBaseComponent {

  private _items: Array<PoTreeViewItem> = [];

  /**
   * Lista de itens do tipo `PoTreeViewItem` que será renderizada pelo componente.
   */
  @Input('p-items') set items(value: Array<PoTreeViewItem>) {
    this._items = Array.isArray(value) ? this.getItemsByMaxLevel(value) : [];
  }

  get items() {
    return this._items;
  }

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao expandir um item.
   *
   * > Como parâmetro o componente passará o objeto que originou o disparo.
   */
  @Output('p-collapsed') collapsed = new EventEmitter<PoTreeViewItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao colapsar um item.
   *
   * > Como parâmetro o componente passará o objeto que originou o disparo.
   */
  @Output('p-expanded') expanded = new EventEmitter<PoTreeViewItem>();

  protected emitEvent(treeViewItem: PoTreeViewItem) {
    const event = treeViewItem.expanded ? 'expanded' : 'collapsed';

    this[event].emit({ ...treeViewItem });
  }

  private addChildItemInParent(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (!parentItem.subItems) {
      parentItem.subItems = [];
    }

    parentItem.subItems.push(childItem);
  }

  private addItem(items: Array<PoTreeViewItem>, childItem: PoTreeViewItem, parentItem?: PoTreeViewItem) {

    if (parentItem) {
      this.expandParentItem(childItem, parentItem);
      this.addChildItemInParent(childItem, parentItem);

      items.push(parentItem);
    } else {
      items.push(childItem);
    }

  }

  // expande o item pai caso o filho estiver expandido.
  private expandParentItem(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (childItem.expanded) {
      parentItem.expanded = true;
    }
  }

  private getItemsByMaxLevel(items: Array<PoTreeViewItem> = [], level: number = 0, parentItem?: PoTreeViewItem, newItems = []) {
    items.forEach(item => {
      const { subItems, ...currentItem } = item;

      if (level === poTreeViewMaxLevel) {
        return;
      }

      if (Array.isArray(item.subItems)) {
        this.getItemsByMaxLevel(item.subItems, ++level, currentItem);
        --level;
      }

      this.addItem(newItems, currentItem, parentItem);
    });

    return newItems;
  }

}
