import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
  forwardRef
} from '@angular/core';
import { Router } from '@angular/router';

import { PoListBoxBaseComponent } from './po-listbox-base.component';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, isTypeof, openExternalLink } from '../../utils/util';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';
import { Observable, Subscription, debounceTime, fromEvent, merge } from 'rxjs';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html'
})
export class PoListBoxComponent extends PoListBoxBaseComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('listbox', { static: true }) listbox: ElementRef;
  @ViewChild('listboxItemList', { static: false }) listboxItemList: ElementRef;
  @ViewChild('searchElement') searchElement: PoSearchListComponent;

  private scrollEvent$: Observable<any>;
  private subscriptionScrollEvent: Subscription;

  constructor(
    public element: ElementRef,
    private renderer: Renderer2,
    languageService: PoLanguageService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
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

    if (this.visible && this.infiniteScroll) {
      this.checkInfiniteScroll();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionScrollEvent && this.subscriptionScrollEvent.unsubscribe) {
      this.subscriptionScrollEvent.unsubscribe();
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
      switch (this.type) {
        case 'check':
          this.onSelectCheckBoxItem(itemListAction);
          break;
        case 'option':
          this.optionClicked(itemListAction);
          break;
        case 'action':
          this.onSelectItem(itemListAction);
          break;
      }
    }

    if ((event && event.code === 'Escape') || event.code === 'Tab') {
      this.closeEvent.emit();
    }
  }

  checkboxClicked({ option, selected }) {
    if (this.type === 'check') {
      this.change.emit({ selected, option });
    }
  }

  optionClicked(option: any) {
    if (this.type === 'option') {
      this.items.filter(item =>
        item[this.fieldValue] === option[this.fieldValue] ? (item['selected'] = true) : (item['selected'] = false)
      );
      this.selectCombo.emit({ ...option });
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

  showMoreInfiniteScroll({ target }): void {
    const scrollPosition = target.offsetHeight + target.scrollTop;
    if (scrollPosition >= target.scrollHeight * (this.infiniteScrollDistance / 110)) {
      this.UpdateInfiniteScroll.emit();
    }
  }

  scrollListener(componentListner: HTMLElement): Observable<any> {
    return fromEvent(componentListner, 'scroll').pipe(debounceTime(100));
  }

  setFocus() {
    this.listboxItemList.nativeElement.focus();
  }

  protected checkInfiniteScroll(): void {
    if (this.hasInfiniteScroll()) {
      this.includeInfiniteScroll();
    }
  }

  private hasInfiniteScroll(): boolean {
    this.changeDetector.detectChanges();
    return this.infiniteScroll && this.listboxItemList?.nativeElement.scrollHeight;
  }

  checkTemplate() {
    if (this.cache || this.infiniteScroll) {
      return this.items.length;
    } else {
      return !this.isServerSearching && this.items.length;
    }
  }

  private includeInfiniteScroll(): void {
    this.scrollEvent$ = this.scrollListener(this.listboxItemList?.nativeElement);

    this.subscriptionScrollEvent = this.scrollEvent$.subscribe(event => {
      this.showMoreInfiniteScroll(event);
    });
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
