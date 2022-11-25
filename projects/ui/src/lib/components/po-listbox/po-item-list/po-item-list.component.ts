import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { isExternalLink, isTypeof, openExternalLink } from '../../../utils/util';
import { PoItemListType } from '../enums/po-item-list-type.enum';
import { PoItemListAction } from './interfaces/po-item-list-action.interface';
import { PoItemListOptionGroup } from './interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';
import { PoItemListBaseComponent } from './po-item-list-base.component';

@Component({
  selector: 'po-item-list',
  templateUrl: './po-item-list.component.html',
  styleUrls: ['./po-item-list.component.css']
})
export class PoItemListComponent extends PoItemListBaseComponent {
  @ViewChild('itemList', { static: true }) itemList: ElementRef;

  selectedView: PoItemListOption;

  protected param;
  protected clickoutListener: () => void;

  constructor(private router: Router) {
    super();
    console.log(this.items);
  }

  /**
   * Método para o evento de clique ao interagir com o item da lista do tipo `Action`.
   *
   * @param itemListAction
   * @returns
   */
  onClickItem(itemListAction: PoItemListAction) {
    console.group('onClickItem');
    console.log('value in PoItemList', itemListAction);

    const actionNoDisabled = itemListAction && !this.returnBooleanValue(itemListAction, 'disabled');

    if (itemListAction && itemListAction.action && actionNoDisabled) {
      itemListAction.action(this.param || itemListAction);
    }

    if (itemListAction && itemListAction.url && actionNoDisabled) {
      return this.openUrl(itemListAction.url);
    }

    console.groupEnd();
  }

  onSelectItem(itemListOption: PoItemListOption | PoItemListOptionGroup | any): void {
    console.group('onSelectItem');
    console.log('itemListOption in PoItemList', itemListOption);
    this.selectedView = itemListOption;
    this.selectItem.emit(itemListOption);
    console.groupEnd();
  }

  returnBooleanValue(itemListAction: any, property: string) {
    return isTypeof(itemListAction[property], 'function')
      ? itemListAction[property](this.param || itemListAction)
      : itemListAction[property];
  }

  private openUrl(url: string) {
    if (isExternalLink(url)) {
      return openExternalLink(url);
    }

    if (url) {
      return this.router.navigate([url]);
    }
  }
}
