import { EventEmitter, Input, Output } from '@angular/core';

import { PoDynamicFormField } from '@portinari/portinari-ui';

import { browserLanguage, poLocaleDefault } from '../../../utils/util';

export const poAdvancedFiltersLiteralsDefault = {
  en: {
    title: 'Advanced search',
    primaryActionLabel: 'Apply filters',
    secondaryActionLabel: 'Cancel'
  },
  es: {
    title: 'Búsqueda avanzada',
    primaryActionLabel: 'Aplicar filtros',
    secondaryActionLabel: 'Cancelar'
  },
  pt: {
    title: 'Busca avançada',
    primaryActionLabel: 'Aplicar filtros',
    secondaryActionLabel: 'Cancelar'
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
export class PoAdvancedFilterBaseComponent {

  private _filters: Array<PoDynamicFormField> = [];

  literals = {
    ...poAdvancedFiltersLiteralsDefault[poLocaleDefault],
    ...poAdvancedFiltersLiteralsDefault[browserLanguage()]
  };

  /**
   * Coleção de objetos que implementam a interface PoDynamicFormField, para definição dos campos que serão criados
   * dinamicamente.
   */
  @Input('p-filters') set filters(filters: Array<PoDynamicFormField>) {
    this._filters = Array.isArray(filters) ? [...filters] : [];
  }

  get filters() {
    return this._filters;
  }

  /** Função que será disparada e receberá os valores do formulário ao ser clicado no botão buscar. */
  @Output('p-search-event') searchEvent = new EventEmitter<any>();

}
