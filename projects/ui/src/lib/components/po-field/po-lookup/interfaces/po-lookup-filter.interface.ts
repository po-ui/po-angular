import { Observable } from 'rxjs';

import { PoLookupFilteredItemsParams } from './po-lookup-filtered-items-params.interface';
import { PoLookupResponseApi } from './po-lookup-response-api.interface';

/**
 * @usedBy PoLookupComponent
 *
 * @description
 *
 * Define o tipo de busca utilizado no po-lookup.
 */
export interface PoLookupFilter {
  /**
   * Método que será disparado ao filtrar a lista de itens ou carregar mais resultados no componente, deve-se retornar
   * um *Observable* com a resposta da API no formato da interface `PoLookupResponseApi`.
   *
   * @param {PoLookupFilteredItemsParams} params Objeto enviado por parâmetro que implementa a interface `PoLookupFilteredItemsParams`.
   */
  getFilteredItems?(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi>;

  /**
   * Método responsável por enviar um valor que será buscado no serviço.
   *
   * @param {string} value Valor único a ser buscado na fonte de dados.
   * @param {any} filterParams Valor informado através da propriedade `p-filter-params`.
   */
  getObjectByValue(value: string, filterParams?: any): Observable<any>;
}
