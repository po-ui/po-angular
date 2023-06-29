import { AfterViewInit, Component, ElementRef, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoListBoxBaseComponent } from './po-listbox-base.component';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, isTypeof, openExternalLink } from '../../utils/util';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html'
})
export class PoListBoxComponent extends PoListBoxBaseComponent implements AfterViewInit, OnChanges {
  @ViewChild('listbox', { static: true }) listbox: ElementRef;
  @ViewChild('listboxItemList', { static: true }) listboxItemList: ElementRef;
  @ViewChild('searchElement') searchElement: PoSearchListComponent;

  constructor(private renderer: Renderer2, languageService: PoLanguageService, private router: Router) {
    super(languageService);
  }

  ngAfterViewInit(): void {
    this.setListBoxMaxHeight();
    this.listboxItemList.nativeElement.focus();
  }

  ngOnChanges(changes?: SimpleChanges): void {
    this.searchElement.setFocus();
    this.searchElement.clean();

    if (changes?.items) {
      this.setListBoxMaxHeight();
    }
  }

  onSelectItem(itemListAction: any) {
    if (this.type !== 'check' && !itemListAction.disabled) {
      const actionNoDisabled = itemListAction && !this.returnBooleanValue(itemListAction, 'disabled');

      if (itemListAction && itemListAction.action && actionNoDisabled) {
        itemListAction.action(this.param || itemListAction);
      }

      if (itemListAction && itemListAction.url && actionNoDisabled) {
        return this.openUrl(itemListAction.url);
      }

      // this.checkboxValue.emit(itemListAction);
    } else if (this.type === 'option') {
      this.checkboxValue.emit(itemListAction);
    }
  }
  onKeydown(itemListAction: any, event?: KeyboardEvent) {
    event.preventDefault();
    if ((event && event.code === 'Enter') || event.code === 'Space') {
      console.log(itemListAction);
      if (this.type !== 'check') {
        this.onSelectItem(itemListAction);
      } else {
        this.onSelectCheckBoxItem(itemListAction);
      }
    }
  }

  returnBooleanValue(itemListAction: any, property: string) {
    return isTypeof(itemListAction[property], 'function')
      ? itemListAction[property](this.param || itemListAction)
      : itemListAction[property];
  }

  checkboxClicked({ option, selected }) {
    if (this.type === 'check') {
      console.log('aki');
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
      console.log('akisss');
      this.changeAll.emit();
    }
  }

  callChangeSearch(event) {
    console.log(event);
    this.changeSearch.emit(event);
  }

  private setListBoxMaxHeight(): void {
    const itemsLength = this.items.length;
    if (itemsLength > 6) {
      // this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
      this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
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
