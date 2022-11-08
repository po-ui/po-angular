import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PoItemListType } from '../enums/po-item-list-type.enum';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';

@Component({
  selector: 'po-item-list',
  templateUrl: './po-item-list.component.html',
  styleUrls: ['./po-item-list.component.css']
})
export class PoItemListComponent {
  private _label: string;
  private _type!: PoItemListType;

  @Input('p-label') set label(value: string) {
    this._label = value;
  }

  get label(): string {
    return this._label;
  }

  @HostBinding('attr.p-type')
  @Input('p-type')
  set type(value: PoItemListType) {
    this._type = value;
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Output() selectedOption = new EventEmitter<any>();

  setOptionValue(value: string): void {
    console.log('setOptionValue in PoItemList', value);

    this.selectedOption.emit(value);
  }

  cliquei(event) {
    console.log('to no item-list');
    console.log(event);
    this.selectedOption.emit(event);
  }
}
