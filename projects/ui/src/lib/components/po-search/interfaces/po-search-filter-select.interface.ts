/**
 * @usedBy PoSearchComponent
 *
 * @description
 *
 * Interface que define as opções que serão exibidas no dropdown do `po-search`, ao usar a propriedade `p-filter-select`.
 */
export interface PoSearchFilterSelect {
  /**
   * @description
   *
   * Descrição exibida nas opções da lista.
   */
  label: string;

  /** Valores que serão atribuídos ao `p-filter-keys` */
  value: Array<string> | string;
}
