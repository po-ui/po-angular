import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoSearchFilterMode } from './enum/po-search-filter-mode.enum';
import { PoSearchOption } from './interfaces/po-search-option.interface';
import { PoSearchBaseComponent } from './po-search-base.component';
const poSearchContainerOffset = 8;
const poSearchContainerPositionDefault = 'bottom';
/**
 * @docsExtends PoSearchBaseComponent
 *
 * @example
 *
 * <example name="po-search-basic" title="PO Search Basic">
 *  <file name="sample-po-search-basic/sample-po-search-basic.component.html"> </file>
 *  <file name="sample-po-search-basic/sample-po-search-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-search-labs" title="PO Search Labs">
 *  <file name="sample-po-search-labs/sample-po-search-labs.component.html"> </file>
 *  <file name="sample-po-search-labs/sample-po-search-labs.component.ts"> </file>
 *  <file name="sample-po-search-labs/sample-po-search-labs.service.ts"> </file>
 * </example>
 *
 * <example name="po-search-find-people" title="PO Search Find People">
 *  <file name="sample-po-search-find-people/sample-po-search-find-people.component.html"> </file>
 *  <file name="sample-po-search-find-people/sample-po-search-find-people.component.ts"> </file>
 *  <file name="sample-po-search-find-people/sample-po-search-find-people.service.ts"> </file>
 * </example>
 *
 * <example name="po-search-listbox" title="PO Search With Listbox">
 *  <file name="sample-po-search-listbox/sample-po-search-listbox.component.html"> </file>
 *  <file name="sample-po-search-listbox/sample-po-search-listbox.component.ts"> </file>
 *  <file name="sample-po-search-listbox/sample-po-search-listbox.service.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-search',
  templateUrl: './po-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PoControlPositionService]
})
export class PoSearchComponent extends PoSearchBaseComponent implements OnInit, OnDestroy {
  @ViewChild('poSearchInput', { read: ElementRef, static: true }) poSearchInput: ElementRef;
  @ViewChild('poListboxContainerElement', { read: ElementRef }) poListboxContainerElement: ElementRef;
  @ViewChild('poListboxElement', { read: ElementRef }) poListboxElement: ElementRef;

  private clickoutListener: () => void;
  private eventResizeListener: () => void;

  listboxFilteredItems: Array<any> = [];
  filteredItems: Array<any> = [];
  listboxOpen: boolean = false;

  constructor(
    public languageService: PoLanguageService,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private controlPosition: PoControlPositionService
  ) {
    super(languageService);
  }

  ngOnInit(): void {
    this.filteredItems = this.items;
    if (this.showListbox) this.listboxFilteredItems = this.listboxItems;
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  clearSearch(): void {
    this.poSearchInput.nativeElement.value = '';
    this.onSearchChange('', true);
    this.filteredItemsChange.emit(this.items);
    this.poSearchInput.nativeElement.focus();
    this.changeDetector.detectChanges();
  }

  onSearchChange(searchText: string, activated: boolean): void {
    searchText = searchText.toLowerCase();

    if (this.showListbox) {
      this.controlListboxVisibility(true);
      this.listboxFilteredItems = this.getListboxFilteredItems(searchText);
    }

    if (activated) {
      this.updateFilteredItems(searchText);
      this.filteredItemsChange.emit(this.filteredItems);
      this.changeModel.emit(searchText);
    }

    this.changeDetector.detectChanges();
  }

  private updateFilteredItems(searchText: string): void {
    if (this.items && this.items.length > 0) {
      this.filteredItems = this.getFilteredItems(searchText);
    } else {
      this.filteredItems = [];
    }
  }

  private getFilteredItems(searchText) {
    return this.items.filter(item => this.itemMatchesFilter(item, searchText));
  }

  private itemMatchesFilter(item: any, searchText: string): boolean {
    const valuesToSearch: Array<string> = this.filterKeys
      .map(key => (typeof item[key] !== 'string' ? String(item[key]) : item[key]))
      .map(value => (value ? value.toLowerCase() : ''));

    return valuesToSearch.some(value => this.filterValue(value, searchText));
  }

  getListboxFilteredItems(searchText) {
    return this.listboxItems.filter(item => this.filterValue(item.value, searchText));
  }

  private filterValue(value: string, searchText: string) {
    value = value?.toLowerCase();
    switch (this.filterType) {
      case PoSearchFilterMode.startsWith:
        return value?.startsWith(searchText);
      case PoSearchFilterMode.contains:
        return value?.includes(searchText);
      case PoSearchFilterMode.endsWith:
        return value?.endsWith(searchText);
      default:
        return false;
    }
  }

  get listboxItems() {
    return this.items
      .map(item => this.filterKeys.map(key => item[key]).map(item => (typeof item !== 'string' ? String(item) : item)))
      .flat()
      .map(value => ({ label: value, value }));
  }

  onCloseListbox() {
    this.poSearchInput.nativeElement.focus();
    this.controlListboxVisibility(false);
    this.changeDetector.detectChanges();
  }

  onListboxClick(option: PoSearchOption, event?: any) {
    if (event) {
      event.stopPropagation();
    }
    this.poSearchInput.nativeElement.value = option.value;
    this.controlListboxVisibility(false);

    this.onCloseListbox();

    if (this.type === 'action') this.onSearchChange(option.value.toString(), true);
  }

  private setContainerPosition() {
    if (this.poListboxContainerElement && this.poSearchInput) {
      this.controlPosition.setElements(
        this.poListboxContainerElement.nativeElement,
        poSearchContainerOffset,
        this.poSearchInput,
        ['top', 'bottom'],
        true
      );

      this.adjustContainerPosition();
    }
  }

  private adjustContainerPosition() {
    if (this.poListboxContainerElement && this.poSearchInput) {
      this.controlPosition.adjustPosition(poSearchContainerPositionDefault);
    }
  }

  controlListboxVisibility(toOpen: boolean) {
    toOpen ? this.openListbox() : this.closeListbox();
  }

  private openListbox() {
    this.listboxOpen = true;
    this.changeDetector.detectChanges();
    this.initializeListeners();
    this.poSearchInput.nativeElement.focus();
    this.setContainerPosition();
  }

  closeListbox() {
    this.listboxOpen = false;
    this.changeDetector.detectChanges();
    this.removeListeners();
  }

  clickedOutsideInput(event: MouseEvent): void {
    if (
      this.listboxOpen &&
      !this.poSearchInput.nativeElement.contains(event.target) &&
      (!this.poListboxElement || !this.poListboxElement.nativeElement.contains(event.target))
    ) {
      this.controlListboxVisibility(false);
    }
  }

  private initializeListeners() {
    this.removeListeners();

    this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.clickedOutsideInput(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      setTimeout(() => this.adjustContainerPosition(), 250);
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }

    if (this.eventResizeListener) {
      this.eventResizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private onScroll = (): void => {
    this.adjustContainerPosition();
  };
}
