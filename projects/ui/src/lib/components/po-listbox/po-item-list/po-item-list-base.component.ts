import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PoItemListType } from '../enums/po-item-list-type.enum';
import { PoItemListAction } from './interfaces/po-item-list-action.interface';
import { PoItemListOptionGroup } from './interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';

@Directive()
export class PoItemListBaseComponent {
  private _label: string;
  private _value: string;
  private _type!: PoItemListType;

  @HostBinding('attr.p-type')
  @Input('p-type')
  set type(value: PoItemListType) {
    this._type = value;
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-items') items: Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any> = [];

  @Input('p-label') set label(value: string) {
    this._label = value;
  }

  get label(): string {
    return this._label;
  }

  @Input('p-value') set value(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  @Output('p-click-item') clickItem = new EventEmitter<PoItemListAction | any>();
  @Output('p-select-item') selectItem = new EventEmitter<PoItemListOption | PoItemListOptionGroup | any>();

  constructor() {
    setTimeout(() => console.log({ items: this.items }));
  }
}
