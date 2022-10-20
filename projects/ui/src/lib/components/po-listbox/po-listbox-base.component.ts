import { Directive, Input } from '@angular/core';

import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';

import { convertToBoolean } from '../../utils/util';

type PoListBoxType = 'action' | 'option' | 'check';

/**
 * @description
 */

@Directive()
export class PoListboxBaseComponent {
  visibleOptions: Array<any> = [];

  private _options: Array<PoItemListOption | PoItemListOptionGroup | any> = [];
  private _type?: PoListBoxType = 'action';
  private _visible: boolean = false;

  @Input('p-visible') set visible(value: boolean) {
    this._visible = convertToBoolean(value);
  }

  get visible(): boolean {
    return this._visible;
  }

  @Input('p-type') set type(value: PoListBoxType) {
    this._type = value;
  }

  get type(): PoListBoxType {
    return this._type;
  }

  @Input('p-options') set options(options: Array<PoItemListOption | PoItemListOptionGroup | any>) {
    this._options = Array.isArray(options) ? options : [];
  }

  get options(): Array<PoItemListOption | PoItemListOptionGroup | any> {
    return this._options;
  }
}
