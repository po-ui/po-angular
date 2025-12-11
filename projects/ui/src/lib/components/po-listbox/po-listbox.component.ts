import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import { PoListBoxBaseComponent } from './po-listbox-base.component';
import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isTypeof, PoUtils } from '../../utils/util';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';
import { PoDropdownAction } from '../po-dropdown/po-dropdown-action.interface';
import { Observable, Subscription, debounceTime, fromEvent } from 'rxjs';
import { PoFieldSize } from '../../enums/po-field-size.enum';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html',
  standalone: false
})
export class PoListBoxComponent extends PoListBoxBaseComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  element = inject(ElementRef);
  public currentItems: Array<PoDropdownAction> = [];
  public currentGroup: PoDropdownAction | null = null;

  private readonly navigationStack: Array<{ group: PoDropdownAction | null; items: Array<PoDropdownAction> }> = [];
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @ViewChild('listbox', { static: true }) listbox: ElementRef;
  @ViewChild('listboxItemList', { static: false }) listboxItemList: ElementRef;
  @ViewChild('listboxGroupHeader') listboxGroupHeader: ElementRef;
  @ViewChild('searchElement') searchElement: PoSearchListComponent;
  @ViewChild('popupHeaderContainer') popupHeaderContainer: ElementRef;
  @ViewChildren('listboxItem') listboxItems!: QueryList<ElementRef>;

  private scrollEvent$: Observable<any>;
  private subscriptionScrollEvent: Subscription;

  constructor() {
    const languageService = inject(PoLanguageService);

    super(languageService);
  }

  ngOnInit(): void {
    if (this.listboxSubitems) {
      this.currentItems = this.items;
    }
  }

  ngAfterViewInit(): void {
    this.setListBoxMaxHeight();
    this.setListBoxWidth();
    this.listboxItemList?.nativeElement.focus();
    if (this.listboxSubitems) {
      requestAnimationFrame(() => {
        const firstItem = this.listboxItems?.first.nativeElement;
        if (firstItem) {
          firstItem.focus();

          setTimeout(() => {
            firstItem.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
          }, 0);
        }
      });
    }
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.items) {
      this.setListBoxMaxHeight();
      this.setListBoxWidth();
    }

    if (this.visible && this.infiniteScroll) {
      this.checkInfiniteScroll();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionScrollEvent?.unsubscribe) {
      this.subscriptionScrollEvent.unsubscribe();
    }
  }

  public openGroup(group: PoDropdownAction, event?: MouseEvent | KeyboardEvent): void {
    event?.stopPropagation();

    this.navigationStack.push({
      group: this.currentGroup,
      items: this.currentItems
    });

    this.currentGroup = group;
    this.currentItems = group.subItems || [];

    requestAnimationFrame(() => {
      const firstItem = this.listboxGroupHeader?.nativeElement;
      if (firstItem) {
        firstItem.focus();

        setTimeout(() => {
          firstItem.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        }, 0);
      }
    });
  }

  public goBack(event: MouseEvent | KeyboardEvent): void {
    event?.stopPropagation();

    const previous = this.navigationStack.pop();

    if (previous) {
      this.currentGroup = previous.group;
      this.currentItems = previous.items;
    } else {
      this.currentGroup = null;
      this.currentItems = this.items;
    }

    this.clickItem.emit({ goBack: true });

    requestAnimationFrame(() => {
      const firstItem = this.listboxItems?.first?.nativeElement;
      if (firstItem) {
        firstItem.focus();

        setTimeout(() => {
          firstItem.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        }, 0);
      }
    });
  }

  public onKeydownGoBack(event: KeyboardEvent, currentGroup?: PoDropdownAction): void {
    if (event.key === 'Enter') {
      this.goBack(event);
    }

    if (event?.code === 'Escape' || event.code === 'Tab') {
      if (event.code === 'Tab' && !event.shiftKey && currentGroup?.$subItemTemplate) {
        return;
      }
      this.closeEvent.emit();
    }
  }

  protected onKeydownTemplate(event: KeyboardEvent): void {
    if (event.code === 'Tab') {
      if ((event.target as HTMLElement)?.closest('.po-listbox-dropdown')) {
        event.stopPropagation();
        return;
      }
      this.closeEvent.emit();
    }
  }

  onSelectItem(itemListAction: PoItemListOption | PoItemListOptionGroup | any, event?: MouseEvent | KeyboardEvent) {
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

    if (this.isTabs && !itemListAction.disabled && !itemListAction.hide) {
      this.onClickTabs(itemListAction);
    }

    if (itemListAction?.action && !isDisabled && isVisible) {
      itemListAction.action(this.param || itemListAction);
    }

    if (itemListAction?.url && !isDisabled && isVisible) {
      return this.openUrl(itemListAction.url);
    }

    if (itemListAction?.subItems?.length || itemListAction?.$subItemTemplate) {
      this.openGroup(itemListAction, event);
    } else if (this.listboxSubitems) {
      this.closeEvent.emit();
    }

    if (!isDisabled) {
      this.clickItem.emit(itemListAction);
    }
  }

  onSelectAllCheckboxKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      this.closeEvent.emit();
    }
  }

  onKeyDown(itemListAction: PoItemListOption | PoItemListOptionGroup | any, event?: KeyboardEvent) {
    event?.preventDefault();

    if ((event && event.code === 'Enter') || event.code === 'Space') {
      if (itemListAction.type === 'footerAction') {
        this.handleFooterActionListbox();
        return;
      }

      // Cenário em que o `Po-Search` (com listbox) tem nos items ação ou url
      if (this.type === 'option' && (itemListAction?.action || itemListAction?.url)) {
        this.onSelectItem(itemListAction);
        this.optionClicked(itemListAction);
        return;
      }

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

  onSelectTabs(tab) {
    if (this.isTabs && tab) {
      this.changeStateTabs.emit(tab);
    }
  }

  onActivatedTabs(tab) {
    this.activatedTab.emit(tab);
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
    this.listboxItemList?.nativeElement?.focus();
  }

  protected checkInfiniteScroll(): void {
    if (this.hasInfiniteScroll()) {
      this.includeInfiniteScroll();
    }
  }

  protected getSizeLoading() {
    const width = this.listbox.nativeElement.offsetWidth || this.containerWidth;

    if (width > 180 && this.size !== PoFieldSize.Small) {
      return 'md';
    } else if (width >= 140 || this.size === PoFieldSize.Small) {
      return 'sm';
    } else {
      return 'xs';
    }
  }

  protected getTextLoading() {
    const width = this.listbox.nativeElement.offsetWidth || this.containerWidth;

    return width < 140 ? ' ' : '';
  }

  private hasInfiniteScroll(): boolean {
    this.changeDetector.detectChanges();
    return this.infiniteScroll && this.listboxItemList?.nativeElement.scrollHeight;
  }

  checkTemplate() {
    if (this.cache || this.infiniteScroll) {
      return this.items.length;
    } else if (!this.items.length && this.footerActionListbox) {
      return true;
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
    const dropdownMaxHeight = 400;
    const itemsLength = this.items.length;
    const hasPopupHeaderContainer = this.popupHeaderContainer?.nativeElement?.children?.length > 0;

    if (!this.listboxSubitems && itemsLength > 6) {
      if (this.type === 'check' && !this.hideSearch) {
        this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3 + 60}px`);
      } else if (hasPopupHeaderContainer) {
        this.renderer.setStyle(
          this.listbox.nativeElement.querySelector('ul[role=listbox]'),
          'maxHeight',
          `${44 * 6 - 44 / 3}px`
        );
        this.renderer.removeStyle(this.listbox.nativeElement, 'maxHeight');
      } else {
        this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
      }
    }

    if (this.listboxSubitems) {
      this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${dropdownMaxHeight}px`);
    }
  }

  private setListBoxWidth(): void {
    const dropdownMinWidth = 240;
    const dropdownMaxWidth = 340;

    if (this.listboxSubitems && this.items) {
      this.renderer.setStyle(this.listbox.nativeElement, 'minWidth', `${dropdownMinWidth}px`);
      this.renderer.setStyle(this.listbox.nativeElement, 'maxWidth', `${dropdownMaxWidth}px`);
    }
  }

  private openUrl(url: string) {
    if (PoUtils.isExternalLink(url)) {
      return PoUtils.openExternalLink(url);
    }

    if (url) {
      return this.router.navigate([url]);
    }
  }

  onClickTabs(tab) {
    if (!tab.disabled) {
      this.clickTab.emit(tab);
    }
  }

  formatItemList(item: any): string {
    if (this.isTabs) {
      return item.id;
    } else {
      try {
        return JSON.stringify(item);
      } catch (error) {
        return item;
      }
    }
  }

  handleFooterActionListbox() {
    this.footerActionListboxEvent.emit();
    this.closeEvent.emit();
  }
}
