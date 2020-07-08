import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poMenuFilterLiterals } from './po-menu-filter.interface';

export const poMenuFilterLiteralsDefault = {
  en: <poMenuFilterLiterals>{ search: 'Search' },
  es: <poMenuFilterLiterals>{ search: 'Buscar' },
  pt: <poMenuFilterLiterals>{ search: 'Pesquisar' },
  ru: <poMenuFilterLiterals>{ search: 'Поиск' }
};

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que apresenta o campo de pesquisa no po-menu.
 */
@Component({
  selector: 'po-menu-filter',
  templateUrl: './po-menu-filter.component.html'
})
export class PoMenuFilterComponent {
  // Variável necessária para o po-clean identificar que deve ser criado.
  readonly clean = true;
  public literals = {
    ...poMenuFilterLiteralsDefault[this.languageService.getLanguageDefault()],
    ...poMenuFilterLiteralsDefault[this.languageService.getShortLanguage()]
  };

  @Input('p-loading') loading: boolean;

  // utilizado para repassar ao po-clean
  @ViewChild('inputFilter', { read: ElementRef, static: true }) inputFilterElement: ElementRef;

  @Output('p-filter') filter = new EventEmitter();
  constructor(public languageService: PoLanguageService) {}
  filterItems(search: string) {
    this.filter.emit(search);
  }
}
