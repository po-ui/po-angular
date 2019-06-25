import { Observable } from 'rxjs';

import { PoComboOption } from './po-combo-option.interface';

/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface para os serviços que serão utilizados no po-combo.
 */
export interface PoComboFilter {

  /**
   * Método responsável por retornar um Observable que contém uma coleção de objetos que seguem a interface PoComboOption,
   * será informado por parametro o campo, de acordo com o fieldLabel, e o valor a ser pesquisado.
   *
   * @param params {any} Objeto contendo a propriedade e o valor responsável por realizar o filtro.
   * @param filterParams {any} Valor informado através da propriedade `p-filter-params`.
   */
  getFilteredData(params: any, filterParams?: any): Observable<Array<PoComboOption>>;

  /**
   * Método responsável por retornar um Observable que contém apenas o objeto filtrado que seguem a interface PoComboOption,
   * será informado por parametro valor a ser pesquisado.
   *
   * @param value {string | number} Valor responsável por realizar a busca de um único objeto.
   * @param filterParams {any} Valor informado através da propriedade `p-filter-params`.
   */
  getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption>;

}
