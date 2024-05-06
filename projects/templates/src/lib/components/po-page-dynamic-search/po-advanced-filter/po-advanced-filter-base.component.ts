import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import {
  PoComboOption,
  PoDynamicFormField,
  PoLanguageService,
  PoModalAction,
  PoModalComponent,
  poLocaleDefault
} from '@po-ui/ng-components';

import { convertToBoolean } from '../../../utils/util';
import { PoPageDynamicSearchFilters } from '../po-page-dynamic-search-filters.interface';
import { PoAdvancedFilterLiterals } from './po-advanced-filter-literals.interface';

export const poAdvancedFiltersLiteralsDefault = {
  en: <PoAdvancedFilterLiterals>{
    title: 'Advanced search',
    cancelLabel: 'Cancel',
    confirmLabel: 'Apply filters'
  },
  es: <PoAdvancedFilterLiterals>{
    title: 'Búsqueda avanzada',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Aplicar filtros'
  },
  pt: <PoAdvancedFilterLiterals>{
    title: 'Busca avançada',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Aplicar filtros'
  },
  ru: <PoAdvancedFilterLiterals>{
    title: 'Расширенный поиск',
    cancelLabel: 'отменить',
    confirmLabel: 'Применить фильтры'
  }
};

/**
 * @docsPrivate
 *
 * @description
 *
 * Filtro de busca avançada criado a partir de um formulário dinâmico.
 * Componente de uso interno.
 */
@Directive()
export class PoAdvancedFilterBaseComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  /**
   * Mantém na modal de busca avançada os valores preenchidos do último filtro realizado pelo usuário.
   */
  @Input({ alias: 'p-keep-filters', transform: convertToBoolean }) keepFilters: boolean = false;

  /** Função que será disparada e receberá os valores do formulário ao ser clicado no botão buscar. */
  @Output('p-search-event') searchEvent = new EventEmitter<any>();

  filter = {};
  language: string = poLocaleDefault;

  primaryAction: PoModalAction = {
    action: () => {
      const models = this.getValuesFromForm();

      this.searchEvent.emit(models);
      this.poModal.close();
    },
    label: this.literals.confirmLabel
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: this.literals.cancelLabel
  };

  protected optionsServiceChosenOptions: Array<PoComboOption> = [];

  private _filters: Array<PoDynamicFormField> = [];
  private _literals: PoAdvancedFilterLiterals;

  /**
   * Coleção de objetos que implementam a interface PoPageDynamicSearchFilters, para definição dos campos que serão criados
   * dinamicamente.
   */
  @Input('p-filters') set filters(filters: Array<PoPageDynamicSearchFilters>) {
    this._filters = Array.isArray(filters) ? [...filters] : [];
  }

  get filters(): Array<PoPageDynamicSearchFilters> {
    return this._filters;
  }

  /** Objeto com as literais usadas no `po-advanced-filter`. */
  @Input('p-literals') set literals(value: PoAdvancedFilterLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poAdvancedFiltersLiteralsDefault[poLocaleDefault],
        ...poAdvancedFiltersLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poAdvancedFiltersLiteralsDefault[this.language];
    }

    this.primaryAction.label = this.literals.confirmLabel;
    this.secondaryAction.label = this.literals.cancelLabel;
  }

  get literals() {
    return this._literals || poAdvancedFiltersLiteralsDefault[this.language];
  }

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  // Retorna os models dos campos preenchidos
  private getValuesFromForm() {
    let optionServiceOptions: Array<PoComboOption>;

    Object.keys(this.filter).forEach(property => {
      if (this.filter[property] === undefined || this.filter[property] === '') {
        delete this.filter[property];
      }
    });

    if (this.optionsServiceChosenOptions.length) {
      optionServiceOptions = this.optionsServiceChosenOptions.filter((optionItem: PoComboOption) =>
        Object.values(this.filter).includes(optionItem.value)
      );
    }

    return { filter: this.filter, optionsService: optionServiceOptions };
  }
}
