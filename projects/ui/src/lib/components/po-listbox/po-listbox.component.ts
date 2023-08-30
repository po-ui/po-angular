import { AfterViewInit, Component, ElementRef, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoListBoxBaseComponent } from './po-listbox-base.component';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, isTypeof, openExternalLink } from '../../utils/util';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html'
})
export class PoListBoxComponent extends PoListBoxBaseComponent implements AfterViewInit, OnChanges {
  @ViewChild('listbox', { static: true }) listbox: ElementRef;
  @ViewChild('listboxItemList', { static: false }) listboxItemList: ElementRef;
  @ViewChild('searchElement') searchElement: PoSearchListComponent;

  constructor(private renderer: Renderer2, languageService: PoLanguageService, private router: Router) {
    super(languageService);
  }

  ngAfterViewInit(): void {
    this.setListBoxMaxHeight();
    this.listboxItemList?.nativeElement.focus();
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.items) {
      this.setListBoxMaxHeight();
    }
  }

  onSelectItem(itemListAction: PoItemListOption | PoItemListOptionGroup | any) {
    const isDisabled =
      itemListAction.hasOwnProperty('disabled') &&
      itemListAction.disabled !== null &&
      itemListAction.disabled !== undefined
        ? this.returnBooleanValue(itemListAction, 'disabled')
        : false;
    const isVisible =
      itemListAction.hasOwnProperty('visible') &&
      itemListAction.visible !== null &&
      itemListAction.visible !== undefined
        ? this.returnBooleanValue(itemListAction, 'visible')
        : true;

    if (itemListAction && itemListAction.action && !isDisabled && isVisible) {
      itemListAction.action(this.param || itemListAction);
    }

    if (itemListAction && itemListAction.url && !isDisabled && isVisible) {
      return this.openUrl(itemListAction.url);
    }
  }

  onKeyDown(itemListAction: PoItemListOption | PoItemListOptionGroup | any, event?: KeyboardEvent) {
    event.preventDefault();
    if ((event && event.code === 'Enter') || event.code === 'Space') {
      if (this.type !== 'check') {
        this.onSelectItem(itemListAction);
      } else {
        this.onSelectCheckBoxItem(itemListAction);
      }
    }

    if (event && event.code === 'Escape') {
      this.closeEvent.emit();
    }
  }

  checkboxClicked({ option, selected }) {
    if (this.type === 'check') {
      this.change.emit({ selected, option });
    }
  }

  onSelectCheckBoxItem(option) {
    const selected = !this.isSelectedItem(option);
    this.checkboxClicked({ option, selected });
  }

  isSelectedItem(option) {
    return this.selectedOptions.some(selectedItem => selectedItem[this.fieldValue] === option[this.fieldValue]);
  }

  changeAllEmit(event: KeyboardEvent) {
    if ((event && event.code === 'Enter') || event.code === 'Space') {
      this.changeAll.emit();
    }
  }

  callChangeSearch(event) {
    this.changeSearch.emit(event);
  }

  protected returnBooleanValue(itemListAction: any, property: string) {
    return isTypeof(itemListAction[property], 'function')
      ? itemListAction[property](this.param || itemListAction)
      : itemListAction[property];
  }

  private setListBoxMaxHeight(): void {
    const itemsLength = this.items.length;
    if (itemsLength > 6) {
      if (this.type === 'check' && !this.hideSearch) {
        this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3 + 60}px`);
      } else {
        this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
      }
    }
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
