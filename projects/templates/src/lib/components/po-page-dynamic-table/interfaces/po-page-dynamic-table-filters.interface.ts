import { PoPageDynamicTableField } from '../../..';

/**
 * @docsExtends PoPageDynamicTableField
 *
 * @usedBy PoPageDynamicTableComponent
 *
 * @ignoreExtendedDescription
 *
 * @description
 *
 * Interface para a customização de uma página dinâmica que permite atribuir valores iniciais aos filtros de busca avançada.
 */
export interface PoPageDynamicTableFilters extends PoPageDynamicTableField {
  /**
   * Define um Valor inicial para um filtro de busca avançada.
   */
  initValue?: any;
}
