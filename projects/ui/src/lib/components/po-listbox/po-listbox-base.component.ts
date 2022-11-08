import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';

import { InputBoolean } from '../../decorators';
import { PoItemListType } from './enums/po-item-list-type.enum';

@Directive()
export class PoListboxBaseComponent {
  protected comboOptionsList: Array<any> = [];

  private _options: Array<PoItemListOption | PoItemListOptionGroup | any> = [];
  private _type!: PoItemListType;

  @Input('p-visible') @InputBoolean() visible: boolean = false;

  @Input('p-type') set type(value: PoItemListType) {
    this._type = PoItemListType[value];
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-options') set options(options: Array<PoItemListOption | PoItemListOptionGroup | any>) {
    this._options = Array.isArray(options) ? options : [];
  }

  get options(): Array<PoItemListOption | PoItemListOptionGroup | any> {
    return this._options;
  }

  @Output() selectedOption = new EventEmitter<PoItemListOption>();

  setOptionValue(value: PoItemListOption): void {
    console.log('setOptionValue in PoListbox', value);

    this.selectedOption.emit(value);
  }
}
