import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { PoListBoxBaseComponent } from './po-listbox-base.component';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isExternalLink, isTypeof, openExternalLink } from '../../utils/util';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';
import { Observable, Subscription, debounceTime, fromEvent } from 'rxjs';
import { PoThemeService } from '../../services';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html',
  standalone: false
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
    protected poThemeService: PoThemeService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    super(languageService, poThemeService);
  }

  ngAfterViewInit(): void {
    this.setListBoxMaxHeight();
    this.listboxItemList?.nativeElement.focus();
    this.changeDetector.detectChanges();
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

    if (this.isTabs && !itemListAction.disabled && !itemListAction.hide) {
      this.onClickTabs(itemListAction);
    }

    if (itemListAction && itemListAction.action && !isDisabled && isVisible) {
      itemListAction.action(this.param || itemListAction);
    }

    if (itemListAction && itemListAction.url && !isDisabled && isVisible) {
      return this.openUrl(itemListAction.url);
    }
  }

  onSelectAllCheckboxKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      this.closeEvent.emit();
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
    this.listboxItemList.nativeElement.focus();
  }

  protected checkInfiniteScroll(): void {
    if (this.hasInfiniteScroll()) {
      this.includeInfiniteScroll();
    }
  }

  /**
   * Determina o tamanho do loading baseado nas dimensões do container
   * Considera tanto a altura quanto a largura para melhor precisão
   *
   * @returns {'xs' | 'sm' | 'md'} - Tamanho do loading
   */
  protected getSizeLoading(): 'xs' | 'sm' | 'md' {
    const height = this.listbox.nativeElement.offsetHeight;
    const width = this.listbox.nativeElement.offsetWidth || this.containerWidth;

    if ((height && height < 88) || width < 140) {
      return 'xs';
    }

    if (height && height >= 120 && width > 180) {
      return 'md';
    }

    if ((height && height >= 112 && height && height < 120) || (width >= 140 && width <= 180)) {
      return 'sm';
    }

    if (height && height >= 88 && height && height < 112) {
      return 'sm';
    }

    return 'md';
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
      const extra = this.type === 'check' && !this.hideSearch ? 60 : 0;
      this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3 + extra}px`);
    }
  }

  /**
   * Retorna a altura máxima permitida para o container da lista,
   * respeitando a propriedade `height` e calculando o espaço necessário para exibir os itens e o campo de busca.
   * Se ocorrer algum erro durante o cálculo, retorna a altura como string com 'px' (fallback).
   */
  getHeight(): string | null {
    if (!this.height) return null;

    try {
      const itemsCount = this.items.length + (this.type === 'check' ? 1 : 0);
      const itemsTotalHeight = itemsCount * this.getItemHeight();
      const contentHeight = itemsTotalHeight + this.getSearchHeight() + this.getContainerSpacing();

      return Math.min(parseInt(this.height.toString(), 10), contentHeight) + 'px';
    } catch {
      return this.height + 'px'; // Fallback seguro
    }
  }

  /**
   * Retorna a altura mínima da lista:
   * - 2 itens (caso possua mais de 1) (caso o campo de busca esteja oculto), ou
   * - 1 item + campo de busca (caso visível), ou
   * - mensagem de nenhum item + campo de busca (caso visível)
   */
  getMinHeight(): string {
    let itemHeight = this.getItemHeight();

    if (itemHeight === undefined && this.items.length <= 0) {
      itemHeight = this.listbox?.nativeElement?.querySelector('po-listbox-container-no-data')?.offsetHeight || 0;
    } else {
      itemHeight = 44;
    }

    const minHeight =
      !this.hideSearch && this.type === 'check'
        ? itemHeight + this.getSearchHeight()
        : itemHeight * (this.items.length > 1 ? 2 : 1);

    return `${Math.min(minHeight + this.getContainerSpacing(), 88)}px`;
  }

  private getItemHeight(): number | undefined {
    const listItem = this.listboxItemList?.nativeElement;
    if (!listItem) return 0;
    const liElement = listItem.querySelector('li');
    return liElement?.offsetHeight ?? 0; // Retorna 0 se não encontrar o elemento
  }

  private getContainerSpacing(): number {
    if (!this.listboxItemList?.nativeElement) return 2; // Fallback básico
    try {
      const container = this.listboxItemList.nativeElement;
      const styles = window.getComputedStyle(container);

      // Padding
      const paddingTop = parseFloat(styles.paddingTop || '0');
      const paddingBottom = parseFloat(styles.paddingBottom || '0');

      return paddingTop + paddingBottom;
    } catch {
      return 2;
    }
  }

  private getSearchHeight(): number {
    return !this.hideSearch ? this.listbox.nativeElement.querySelector('po-search-list')?.offsetHeight || 0 : 0;
  }

  private openUrl(url: string) {
    if (isExternalLink(url)) {
      return openExternalLink(url);
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
}
