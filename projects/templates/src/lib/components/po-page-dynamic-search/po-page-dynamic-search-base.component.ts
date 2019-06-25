import { EventEmitter, Input, Output } from '@angular/core';

import { PoBreadcrumb, PoDynamicFormField, PoPageAction } from '@portinari/portinari-ui';

import { browserLanguage, poLocaleDefault } from '../../utils/util';

export const poPageDynamicSearchLiteralsDefault = {
  en: {
    disclaimerGroupTitle: 'Displaying results filtered by:',
    filterSettingsPlaceholder: 'Search',
    quickSearchLabel: 'Quick search:'
  },
  es: {
    disclaimerGroupTitle: 'Presentando resultados filtrados por:',
    filterSettingsPlaceholder: 'Buscar',
    quickSearchLabel: 'Búsqueda rápida:'
  },
  pt: {
    disclaimerGroupTitle: 'Apresentando resultados filtrados por:',
    filterSettingsPlaceholder: 'Pesquisar',
    quickSearchLabel: 'Pesquisa rápida:'
  }
};

/**
 * @description
 *
 * Componente com as ações de pesquisa já definidas, bastando que o desenvolvedor implemente apenas a chamada para as APIs
 * e exiba as informações.
 */
export class PoPageDynamicSearchBaseComponent {

  private _filters: Array<PoDynamicFormField> = [];

  literals = {
    ...poPageDynamicSearchLiteralsDefault[poLocaleDefault],
    ...poPageDynamicSearchLiteralsDefault[browserLanguage()]
  };

  /** Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`. */
  @Input('p-actions') actions?: Array<PoPageAction> = [];

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /**
   * @optional
   *
   * @description
   *
   * Lista dos campos usados na busca avançada. Caso o mesmo não seja passado a busca avançada não será exibida.
   */
  @Input('p-filters') set filters(filters: Array<PoDynamicFormField>) {
    this._filters = Array.isArray(filters) ? [...filters] : [];
  }

  get filters(): Array<PoDynamicFormField> {
    return this._filters;
  }

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * @description
   *
   * Evento disparado ao executar a pesquisa avançada, o mesmo irá repassar um objeto com os valores preenchidos no modal de pesquisa.
   *
   * > Campos não preenchidos não irão aparecer no objeto passado por parâmetro.
   */
  @Output('p-advanced-search') advancedSearch?: EventEmitter<any> = new EventEmitter();

  /** Evento disparado ao remover um ou todos os disclaimers pelo usuário. */
  @Output('p-change-disclaimers') changeDisclaimers?: EventEmitter<any> = new EventEmitter();

  /** Evento disparado ao realizar uma busca pelo campo de pesquisa rápida, o mesmo será chamado repassando o valor digitado. */
  @Output('p-quick-search') quickSearch?: EventEmitter<string> = new EventEmitter();

}
