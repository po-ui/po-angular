import { Observable } from 'rxjs';

import { PoMenuItemFiltered } from '../po-menu-item/po-menu-item-filtered.interface';

/**
 * @usedBy PoMenuComponent
 *
 * @description
 *
 * Interface do serviço utilizado no componente `po-menu`.
 */
export interface PoMenuFilter {
  /**
   * Método responsável por retornar um *Observable* que retorne uma lista de objetos que seguem a interface `PoMenuItemFiltered`.
   * Será informado por parâmetro o valor a ser pesquisado e as informações adicionais preenchidas através da propriedade `p-params`.
   *
   * @param {string} search Valor informado no campo de busca dos itens de menus.
   * @param {any} params Valor informado através da propriedade `p-params`.
   */
  getFilteredData(search: string, params?: any): Observable<Array<PoMenuItemFiltered>>;
}
