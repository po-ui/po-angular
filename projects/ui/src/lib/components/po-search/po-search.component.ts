import { PoFilterMode } from './po-search-filter-mode.enum';

import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoSearchLiterals } from './literals/po-search-literals';
import { PoSearchBaseComponent } from './po-search-base.component';

export const poSearchLiteralsDefault = {
  en: <PoSearchLiterals>{ search: 'Search' },
  es: <PoSearchLiterals>{ search: 'Buscar' },
  pt: <PoSearchLiterals>{ search: 'Pesquisar' },
  ru: <PoSearchLiterals>{ search: 'Поиск' }
};

@Component({
  selector: 'po-search',
  templateUrl: './po-search.component.html'
})
export class PoSearchComponent extends PoSearchBaseComponent implements OnInit {
  @ViewChild('poSearchInput', { read: ElementRef, static: true }) poSearchInput: ElementRef;

  filteredItems: Array<any> = [];

  public literals?: any;

  constructor(public languageService: PoLanguageService, private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.literals = {
      ...poSearchLiteralsDefault[this.languageService?.getLanguageDefault()],
      ...poSearchLiteralsDefault[this.languageService?.getShortLanguage()]
    };

    this.filteredItems = this.items;
  }

  clearSearch(): void {
    this.poSearchInput.nativeElement.value = '';
    this.onSearchChange('');
    this.filteredItemsChange.emit(this.items);
  }

  onBlur(): void {
    this.renderer.removeClass(this.poSearchInput.nativeElement.parentElement, 'po-search-focused');
  }

  onFocus(): void {
    this.renderer.addClass(this.poSearchInput.nativeElement.parentElement, 'po-search-focused');
  }

  onSearchChange(searchText: string): void {
    searchText = searchText.toLowerCase();

    if (this.items && this.items.length > 0) {
      this.filteredItems = this.items.filter(item =>
        this.filterKeys.some(key => {
          let value = item[key];

          if (typeof value !== 'string') {
            value = value != null ? value.toString() : null;
          }

          value = value != null ? value.toLowerCase() : null;

          if (this.filterType === PoFilterMode.startsWith) {
            return value != null && value.startsWith(searchText);
          } else if (this.filterType === PoFilterMode.contains) {
            return value != null && value.includes(searchText);
          } else if (this.filterType === PoFilterMode.endsWith) {
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
  }
}
