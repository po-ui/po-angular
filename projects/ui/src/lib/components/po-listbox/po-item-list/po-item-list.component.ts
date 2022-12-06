import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { isExternalLink, isTypeof, openExternalLink } from '../../../utils/util';

import { PoItemListAction } from './interfaces/po-item-list-action.interface';
import { PoItemListOptionGroup } from './interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';
import { PoItemListBaseComponent } from './po-item-list-base.component';

@Component({
  selector: 'po-item-list',
  templateUrl: './po-item-list.component.html'
})
export class PoItemListComponent extends PoItemListBaseComponent {
  @ViewChild('itemList', { static: true }) itemList: ElementRef;

  selectedView: PoItemListOption;

  protected param;
  protected clickListener: () => void;

  constructor(private router: Router) {
    super();
  }

  onSelectItem(itemListOption: PoItemListOption | PoItemListOptionGroup | any): void {
    this.selectedView = itemListOption;
    this.selectItem.emit(itemListOption);
  }
}
