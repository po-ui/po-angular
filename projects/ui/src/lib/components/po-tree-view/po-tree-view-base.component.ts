import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

import { PoTreeViewItem } from './po-tree-view-item/po-tree-view-item.interface';

const poTreeViewMaxLevel = 4;

/**
 * @description
 *
 * O componente fornece um modelo de visualização em árvore, possibilitando a visualização das informações de maneira
 * hierárquica, desta forma sendo possível utilizar até 4 níveis.
 *
 * Nele é possível navegar entre os itens através da tecla *tab*, permitindo expandir ou colapsar o item em foco
 * por meio das teclas *enter* e *space*.
 *
 * Além da navegação, o componente possibilita também a seleção dos itens do primeiro ao último nível, tanto de forma parcial como completa.
 *
 * O componente também possui eventos disparados ao marcar/desmarcar e expandir/colapsar os itens.
 */
@Directive()
export class PoTreeViewBaseComponent {
  private _items: Array<PoTreeViewItem> = [];
  private _selectable: boolean = false;

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
   * Habilita uma caixa de seleção para selecionar e/ou desmarcar um item da lista.
   *
   * @default false
   */
  @Input('p-selectable') set selectable(value: boolean) {
    this._selectable = convertToBoolean(value);
  }

  get selectable() {
    return this._selectable;
  }

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao colapsar um item.
   *
   * > Como parâmetro o componente envia o item colapsado.
   */
  @Output('p-collapsed') collapsed = new EventEmitter<PoTreeViewItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao expandir um item.
   *
   * > Como parâmetro o componente envia o item expandido.
   */
  @Output('p-expanded') expanded = new EventEmitter<PoTreeViewItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao selecionar um item.
   *
   * > Como parâmetro o componente envia o item selecionado.
   */
  @Output('p-selected') selected = new EventEmitter<PoTreeViewItem>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será disparada ao desfazer a seleção de um item.
   *
   * > Como parâmetro o componente envia o item que foi desmarcado.
   */
  @Output('p-unselected') unselected = new EventEmitter<PoTreeViewItem>();

  protected emitExpanded(treeViewItem: PoTreeViewItem) {
    const event = treeViewItem.expanded ? 'expanded' : 'collapsed';

    this[event].emit({ ...treeViewItem });
  }

  protected emitSelected(treeViewItem: PoTreeViewItem) {
    const event = treeViewItem.selected ? 'selected' : 'unselected';

    this.updateItemsOnSelect(treeViewItem);

    this[event].emit({ ...treeViewItem });
  }

  private addChildItemInParent(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (!parentItem.subItems) {
      parentItem.subItems = [];
    }

    parentItem.subItems.push(childItem);
  }

  // caso houver parentItem:
  //  - expande o parentItem caso o filho estiver expandido;
  //  - adiciona o childItem no parentItem;
  //  - marca o parentItem caso conter subItems marcodos ou nulos;
  // Se não conter parentItem, adiciona o childItem no items.
  private addItem(items: Array<PoTreeViewItem>, childItem: PoTreeViewItem, parentItem?: PoTreeViewItem) {
    if (parentItem) {
      this.expandParentItem(childItem, parentItem);
      this.addChildItemInParent(childItem, parentItem);
      this.selectItemBySubItems(parentItem);

      items.push(parentItem);
    } else {
      items.push(childItem);
    }
  }

  private selectAllItems(items: Array<PoTreeViewItem>, isSelected: boolean) {
    items.forEach(item => {
      if (item.subItems) {
        this.selectAllItems(item.subItems, isSelected);
      }

      item.selected = isSelected;
    });
  }

  private selectItemBySubItems(item: PoTreeViewItem) {
    item.selected = this.everyItemSelected(item.subItems);
  }

  // retornará:
  //  - true: se todos os items estiverem marcados;
  //  - null: se no minimo um item esteja marcado ou nullo (indeterminate)
  //  - false: caso não corresponda em nenhuma das opções acima, no caso, nenhum marcado ou nulo;
  private everyItemSelected(items: Array<PoTreeViewItem> = []): boolean | null {
    const itemsLength = items.length;

    const lengthCheckedItems = items.filter(item => item.selected).length;

    if (itemsLength && itemsLength === lengthCheckedItems) {
      return true;
    }

    const hasIndeterminateItems = items.filter(item => item.selected || item.selected === null).length;

    if (hasIndeterminateItems) {
      return null;
    }

    return false;
  }

  // expande o item pai caso o filho estiver expandido.
  private expandParentItem(childItem: PoTreeViewItem, parentItem: PoTreeViewItem) {
    if (childItem.expanded) {
      parentItem.expanded = true;
    }
  }

  private getItemsByMaxLevel(
    items: Array<PoTreeViewItem> = [],
    level: number = 0,
    parentItem?: PoTreeViewItem,
    newItems = []
  ) {
    items.forEach(item => {
      const { subItems, ...currentItem } = item;

      if (level === poTreeViewMaxLevel) {
        return;
      }

      if (Array.isArray(subItems)) {
        // caso um item pai iniciar selecionado, deve selecionar os filhos.
        if (currentItem.selected) {
          this.selectAllItems(subItems, currentItem.selected);
        }

        this.getItemsByMaxLevel(subItems, ++level, currentItem);
        --level;
      }

      this.addItem(newItems, currentItem, parentItem);
    });

    return newItems;
  }

  private getItemsWithParentSelected(items: Array<PoTreeViewItem> = [], parentItem?: PoTreeViewItem, newItems = []) {
    items.forEach(item => {
      const { subItems, ...currentItem } = item;

      if (Array.isArray(subItems)) {
        this.getItemsWithParentSelected(subItems, currentItem);
      }

      this.addItem(newItems, currentItem, parentItem);
    });

    return newItems;
  }

  private updateItemsOnSelect(selectedItem: PoTreeViewItem) {
    if (selectedItem.subItems) {
      this.selectAllItems(selectedItem.subItems, selectedItem.selected);
    }

    this._items = this.getItemsWithParentSelected(this.items);
  }
}
