import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoSearchBaseComponent } from './po-search-base.component';
import { PoSearchFilterMode } from './enum/po-search-filter-mode.enum';

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
 */
@Component({
  selector: 'po-search',
  templateUrl: './po-search.component.html'
})
export class PoSearchComponent extends PoSearchBaseComponent implements OnInit {
  @ViewChild('poSearchInput', { read: ElementRef, static: true }) poSearchInput: ElementRef;

  filteredItems: Array<any> = [];

  constructor(public languageService: PoLanguageService, private renderer: Renderer2) {
    super(languageService);
  }

  ngOnInit(): void {
    this.filteredItems = this.items;
  }

  clearSearch(): void {
    this.poSearchInput.nativeElement.value = '';
    this.onSearchChange('', true);
    this.filteredItemsChange.emit(this.items);
    this.poSearchInput.nativeElement.focus();
  }

  onSearchChange(searchText: string, activated: boolean): void {
    if (activated) {
      searchText = searchText.toLowerCase();

      if (this.items && this.items.length > 0) {
        this.filteredItems = this.items.filter(item =>
          this.filterKeys.some(key => {
            let value = item[key];

            if (typeof value !== 'string') {
              value = value != null ? value.toString() : null;
            }

            value = value != null ? value.toLowerCase() : null;

            if (this.filterType === PoSearchFilterMode.startsWith) {
              return value != null && value.startsWith(searchText);
            } else if (this.filterType === PoSearchFilterMode.contains) {
              return value != null && value.includes(searchText);
            } else if (this.filterType === PoSearchFilterMode.endsWith) {
              return value != null && value.endsWith(searchText);
            }

            return false;
          })
        );
        this.filteredItemsChange.emit(this.filteredItems);
      } else {
        this.filteredItems = [];
        this.filteredItemsChange.emit(this.filteredItems);
      }
      this.changeModel.emit(searchText);
    }
  }
}
