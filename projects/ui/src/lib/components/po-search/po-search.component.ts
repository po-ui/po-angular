import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoDropdownAction } from '../po-dropdown';
import { PoListBoxComponent } from '../po-listbox';
import { PoKeyCodeEnum } from './../../enums/po-key-code.enum';
import { PoSearchFilterMode } from './enums/po-search-filter-mode.enum';
import { PoSearchFilterSelect } from './interfaces/po-search-filter-select.interface';
import { PoSearchOption } from './interfaces/po-search-option.interface';
import { PoSearchBaseComponent } from './po-search-base.component';

const poSearchContainerOffset = 8;
const poSearchContainerPositionDefault = 'bottom';
const ID_SEARCH_BUTTON_CLEAN = 'search-button-clean';

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
 * <example name="po-search-filter-select" title="PO Search With Filter Select + Listbox">
 *  <file name="sample-po-search-filter-select/sample-po-search-filter-select.component.html"> </file>
 *  <file name="sample-po-search-filter-select/sample-po-search-filter-select.component.ts"> </file>
 * </example>
 *
 * <example name="po-search-execute" title="PO Search Form Fields with Execute">
 *  <file name="sample-po-search-execute/sample-po-search-execute.component.html"> </file>
 *  <file name="sample-po-search-execute/sample-po-search-execute.component.ts"> </file>
 * </example>
 *
 * <example name="po-search-fields-locate" title="PO Search Form Fields with Locate">
 *  <file name="sample-po-search-fields-locate/sample-po-search-fields-locate.component.html"> </file>
 *  <file name="sample-po-search-fields-locate/sample-po-search-fields-locate.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-search',
  templateUrl: './po-search.component.html',
  providers: [PoControlPositionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoSearchComponent extends PoSearchBaseComponent implements OnInit, OnDestroy, OnChanges {
  languageService: PoLanguageService;
  protected renderer = inject(Renderer2);
  protected changeDetector = inject(ChangeDetectorRef);
  private controlPosition = inject(PoControlPositionService);

  private clickoutListener: () => void;
  private eventResizeListener: () => void;
  private _locateCounter: ElementRef;

  @ViewChild('locateCounter', { static: false }) set locateCounter(element: ElementRef) {
    this._locateCounter = element;

    this.locateCounterResize = new ResizeObserver(() => {
      this.updatePaddingRightLocate(false);
    });

    if (this._locateCounter) {
      this.locateCounterResize.observe(this._locateCounter.nativeElement);
    }
  }

  get locateCounter() {
    return this._locateCounter;
  }

  @ViewChild('poSearchInput', { read: ElementRef, static: true }) poSearchInput: ElementRef;
  @ViewChild('poListboxContainerElement', { read: ElementRef }) poListboxContainerElement: ElementRef;
  @ViewChild('poListboxElement', { read: ElementRef }) poListboxElement: ElementRef;
  @ViewChild('poListbox') poListbox: PoListBoxComponent;

  basePaddingRightSmall: number = 122;
  basePaddingRightMedium: number = 158;
  dynamicPaddingRight: number;
  listboxFilteredItems: Array<any> = [];
  filteredItems: Array<any> = [];
  listboxOpen: boolean = false;
  shouldMarkLetters: boolean = true;
  isFiltering: boolean = false;
  isInputFocused: boolean = false;
  listboxItemclicked: boolean = false;
  showSearchLocateControls: boolean = false;
  showNoResults: boolean = false;
  locateCounterResize: ResizeObserver;
  searchFilter = {};

  searchFilterSelectLabel: string;
  searchFilterSelectActions: Array<PoDropdownAction>;

  idSearchButtonClean = ID_SEARCH_BUTTON_CLEAN;
  protected showFooterActionListbox: boolean = false;
  protected showSeparator: boolean = false;
  protected placeholderListbox!: string | null;
  protected modelSelected: string;

  constructor() {
    const languageService = inject(PoLanguageService);
    super(languageService);
    this.languageService = languageService;
  }

  ngOnInit(): void {
    this.filteredItems = this.items;
    if (this.showListbox) {
      this.listboxFilteredItems = this.keysLabel.length === 0 ? this.listboxItems : this.items;
    }
    if (this.filterSelect) {
      this.createDropdownFilterSelect();
    }

    this.showFooterActionListbox = this.footerAction.observed;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSelect?.currentValue) {
      this.createDropdownFilterSelect();
    }

    if (changes.type || changes.disabled) {
      this.updateShowSearchLocateControls();
      this.updatePaddingRightLocate(true);
    }

    if (changes.keysLabel) {
      this.showSeparator = this.keysLabel.length > 1;
    }

    this.configureSearchModeExecute(changes);
  }

  private configureSearchModeExecute(changes: SimpleChanges) {
    if (changes.type?.currentValue === 'execute') {
      this.showListbox = true;

      if (!this.keysLabel.length && this.filterKeys?.length) {
        this.keysLabel = [...this.filterKeys.slice(0, 3)];
      }
    }
  }

  ngOnDestroy() {
    this.removeListeners();
    if (this.locateCounterResize?.disconnect) {
      this.locateCounterResize.disconnect();
    }
  }

  clearSearch(): void {
    this.poSearchInput.nativeElement.value = '';
    this.onSearchChange('', true);
    this.adjustContainerPosition();
    this.changeDetector.detectChanges();
    if (!this.showFooterActionListbox) {
      this.onCloseListbox();
    }
  }

  onCleanKeydown(event: KeyboardEvent) {
    const isEsc = event.key === 'Escape';

    if (isEsc && this.type === 'locate') {
      this.clearSearch();
      this.poSearchInput.nativeElement.focus();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onEnterKey(event: any) {
    if (this.type !== 'locate') {
      if (this.listboxOpen) {
        if (!this.showFooterActionListbox) {
          this.closeListbox();
        }
      } else {
        this.onSearchChange(event.target.value, this.type === 'trigger', true);
        this.closeListbox();
      }
    }
  }

  onSearchChange(searchText: string, activated: boolean, buttonClick?: boolean): void {
    const searchTextInitial = searchText;

    if (this.type === 'locate' && this.changeModel.observed) {
      this.changeModel.emit(searchTextInitial);
      this.modelSelected = searchTextInitial;
      return;
    }

    if (searchText !== undefined) {
      searchText = searchText.toLowerCase();
    }
    this.isFiltering = true;

    if (activated && !this.listboxItemclicked) {
      this.updateFilteredItems(searchText);
      this.filteredItemsChange.emit(this.filteredItems);

      if (this.filterSelect) {
        this.searchFilter = {
          ...this.searchFilter,
          value: searchTextInitial
        };
      } else {
        this.searchFilter = {
          filter: this.filterKeys,
          value: searchTextInitial
        };
      }
      this.filter.emit(this.searchFilter);

      this.changeModel.emit(searchText);
      this.modelSelected = searchTextInitial;
    }

    if (this.showListbox && !buttonClick && (searchText.length > 0 || this.showFooterActionListbox)) {
      this.openListbox();
      this.listboxFilteredItems = this.getListboxFilteredItems(searchText);
      this.handlerPlaceholderListbox();
    } else {
      if (searchText.length === 0) {
        this.listboxFilteredItems = this.keysLabel.length === 0 ? this.listboxItems : this.items;
      }
    }

    if (this.listboxItemclicked) {
      this.listboxItemclicked = false;
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

  getListboxFilteredItems(searchText: string) {
    if (this.keysLabel.length > 0) {
      return searchText.length ? this.filteredItems : [];
    }

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
      .map(value => ({ label: value, value }))
      .filter((obj, index, self) => index === self.findIndex(o => o.label === obj.label && o.value === obj.value));
  }

  onCloseListbox() {
    this.poSearchInput.nativeElement.focus();
    this.closeListbox();
    this.isFiltering = false;
  }

  onListboxClick(option: PoSearchOption | any, event?: any) {
    if (event) {
      event.stopPropagation();
    }

    if (!event || event.code === 'Enter') {
      this.listboxItemclicked = true;
    }

    let value = option.value;
    if (this.keysLabel.length) {
      value = option[this.keysLabel[0]];
    }

    this.poSearchInput.nativeElement.value = value;
    this.listboxOnClick.emit(value);

    if (this.keysLabel.length) {
      this.items.forEach(item => delete item.selected);
    }

    this.onCloseListbox();
    if (this.type === 'action') {
      this.listboxItemclicked = false;
      this.onSearchChange(value.toString(), true, true);
    }
  }

  onBlur() {
    this.isInputFocused = false;

    if (this.type === 'locate') {
      this.updateShowSearchLocateControls();
      this.updatePaddingRightLocate(true);
    }

    if (this.blur.observed) {
      this.blur.emit();
    }

    if (this.listboxOpen && !this.showFooterActionListbox) {
      if (!this.poListbox.items.length) {
        this.closeListbox();
      } else {
        this.focusItem();
      }
    }
  }

  onFocus() {
    this.isInputFocused = true;

    if (this.type === 'locate') {
      this.updateShowSearchLocateControls();
      this.updatePaddingRightLocate(false);
    }

    this.openListboxFooterAction();
  }

  onInputHandler(value: string) {
    if (this.type === 'locate') {
      this.onSearchChange(value, false);
      this.updateShowSearchLocateControls();
      this.updatePaddingRightLocate(false);
    } else {
      this.onSearchChange(value, false);
      this.onSearchChange(value, ['action', 'execute'].includes(this.type));
      this.adjustContainerPosition();
      this.changeDetector.detectChanges();
    }
  }

  onKeyDown(event?: KeyboardEvent) {
    const key = event.keyCode;

    if (event.shiftKey && key === PoKeyCodeEnum.tab) {
      this.closeListbox();
      return;
    }

    if (key === PoKeyCodeEnum.tab) {
      this.closeListbox();
      return;
    }

    if (key === PoKeyCodeEnum.arrowDown) {
      event.preventDefault();

      if (!this.listboxOpen) {
        return;
      }

      this.focusItem();
      this.openListbox();
      return;
    }

    if (key === PoKeyCodeEnum.esc) {
      this.closeListbox();
      this.poSearchInput.nativeElement.focus();
      return;
    }

    if (key === PoKeyCodeEnum.enter && this.listboxOpen) {
      this.closeListbox();
      this.isFiltering = false;
    }
  }

  private focusItem() {
    const listboxItemList = this.poListboxElement?.nativeElement?.querySelectorAll('.po-listbox-item');
    setTimeout(() => {
      Array.from(listboxItemList).forEach((el: HTMLElement) => {
        el.tabIndex = -1;
        el.classList.remove('cdk-option-active');
      });

      const firstOption = listboxItemList[0] as HTMLElement;
      firstOption.focus();
      firstOption.classList.add('cdk-option-active');
    });
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

  private openListbox() {
    if (!this.listboxOpen) {
      this.listboxOpen = true;
      this.changeDetector.detectChanges();
      this.initializeListeners();
      this.poSearchInput.nativeElement.focus();
      this.setContainerPosition();
    }
  }

  closeListbox() {
    this.listboxOpen = false;
    this.changeDetector.detectChanges();
    this.removeListeners();
  }

  clickedOutsideInput(event: MouseEvent): void {
    if (
      this.listboxOpen &&
      !this.poSearchInput?.nativeElement?.contains(event.target) &&
      !this.poListboxElement?.nativeElement?.contains(event.target) &&
      !(this.showFooterActionListbox && (event.target as HTMLElement).closest(`#${this.idSearchButtonClean}`))
    ) {
      this.closeListbox();
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

  private updatePaddingRightLocate(noValue: boolean) {
    const basePadding = this.size === PoFieldSize.Medium ? this.basePaddingRightMedium : this.basePaddingRightSmall;
    const hasValue = !!this.poSearchInput.nativeElement.value;

    if (this.type === 'locate') {
      if (hasValue && this.locateCounter?.nativeElement) {
        const counterWidth = this.locateCounter.nativeElement.offsetWidth;
        const extraSpace = 8;
        this.dynamicPaddingRight = basePadding + counterWidth + extraSpace;
      } else {
        this.dynamicPaddingRight = noValue || this.disabled ? null : basePadding;
      }
    } else {
      this.dynamicPaddingRight = null;
    }

    this.changeDetector.detectChanges();
  }

  private updateShowSearchLocateControls() {
    this.showSearchLocateControls = !!(
      this.type === 'locate' &&
      (this.isInputFocused || this.poSearchInput?.nativeElement?.value) &&
      !this.disabled
    );
  }

  private readonly onScroll = (): void => {
    this.adjustContainerPosition();
  };

  getInputValue() {
    return this.poSearchInput?.nativeElement?.value ?? '';
  }

  createDropdownFilterSelect(): void {
    this.searchFilterSelectActions = [];
    if (!this.filterSelect) {
      return;
    }
    this.filterSelect.forEach(filterOption => {
      const selectOption: PoDropdownAction = {
        label: filterOption.label,
        action: () => this.changeFilterSelect(filterOption),
        selected: this.isSelected(filterOption)
      };
      this.searchFilterSelectActions.push(selectOption);
    });

    this.changeFilterSelect(this.filterSelect[0]);
  }

  isSelected(filterOption: PoSearchFilterSelect): boolean {
    return this.searchFilterSelectLabel === filterOption.label;
  }

  changeFilterSelect(filterOption: PoSearchFilterSelect) {
    this.searchFilterSelectLabel = filterOption.label;
    this.filterKeys = Array.isArray(filterOption.value) ? [...filterOption.value] : [filterOption.value];

    if (!this.searchFilterSelectActions) {
      return;
    }

    this.searchFilterSelectActions.forEach(action => (action.selected = false));
    const selectAction = this.searchFilterSelectActions.find(action => action.label === this.searchFilterSelectLabel);
    selectAction.selected = true;

    this.searchFilter = {
      filter: filterOption.label === this.literals.all ? ['all'] : filterOption.value
    };

    if (this.poSearchInput?.nativeElement) {
      this.poSearchInput.nativeElement.focus();
    }
    if (this.type === 'action') {
      this.onSearchChange(this.getInputValue(), true);
    }
  }

  handlerFooterActionListbox() {
    this.footerAction.emit();
    this.closeListbox();
  }

  private openListboxFooterAction() {
    if (this.showFooterActionListbox && this.showListbox && !this.modelSelected) {
      this.listboxFilteredItems = [];
      this.handlerPlaceholderListbox();
      this.openListbox();
    }
  }

  private handlerPlaceholderListbox() {
    if (this.showFooterActionListbox && !this.listboxFilteredItems.length && this.getInputValue().length == 0) {
      this.placeholderListbox = this.literals.placeholderListbox;
      return;
    }

    this.placeholderListbox = null;
  }
}
