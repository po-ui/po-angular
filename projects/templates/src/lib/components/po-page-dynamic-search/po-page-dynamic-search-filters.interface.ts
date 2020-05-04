import { PoDynamicFormField } from '@po-ui/ng-components';

/**
 * @usedBy PoPageDynamicSearchComponent
 *
 * @description
 *
 * Interface para a customização de uma página dinâmica que permite atribuir valores iniciais aos filtros de busca avançada.
 */
export interface PoPageDynamicSearchFilters extends PoDynamicFormField {
  /**
   * Define um valor inicial para um filtro de busca avançada.
   */
  initValue?: any;
}
