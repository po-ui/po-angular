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

  /**
   * @optional
   *
   * @description
   *
   * Controla se o filtro será fixo, ou seja, não poderá ser alterado pelo usuário no filtro avançado.
   * Caso seja definido um valor true, o filtro não será apresentado na tela de filtro avançado, porém continuará sendo utilizado como filtro.
   * Por esse motivo deverá ser utilizado em conjunto com as propriedades `filter` e `initValue`.
   *
   * @default `false`
   */
  fixed?: boolean;
}
