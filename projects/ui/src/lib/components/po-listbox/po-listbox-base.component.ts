import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { PoItemListAction } from './po-item-list/interfaces/po-item-list-action.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';

import { InputBoolean } from '../../decorators';
import { PoItemListType } from './enums/po-item-list-type.enum';

@Directive()
export class PoListboxBaseComponent {
  private _items: Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any> = [];
  private _type!: PoItemListType;

  @Input('p-visible') @InputBoolean() visible: boolean = false;

  @Input('p-type') set type(value: PoItemListType) {
    this._type = PoItemListType[value];
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-items') set items(items: Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any>) {
    this._items = Array.isArray(items) ? items : [];
  }

  get items(): Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any> {
    return this._items;
  }

  // @Output('p-click-item') clickItem = new EventEmitter<PoItemListAction | any>();
  @Output('p-select-item') selectItem = new EventEmitter<PoItemListOption | PoItemListOptionGroup | any>();

  // onClickItem(value: PoItemListAction | any): void {
  //   console.group('onClickItem');
  //   console.log('value in PoListbox', value);
  //   this.clickItem.emit(value);
  //   console.groupEnd();
  // }

  constructor() {
    setTimeout(() => console.log({ items: this.items }));
  }

  onSelectItem(value: PoItemListOption | PoItemListOptionGroup | any): void {
    console.group('onSelectItem');
    console.log('value in PoListbox', value);
    this.selectItem.emit(value);
    console.groupEnd();
  }
}
