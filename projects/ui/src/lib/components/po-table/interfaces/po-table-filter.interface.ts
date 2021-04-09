import { Observable } from 'rxjs';
import { PoTableFilteredItemsParams } from './po-table-filtered-items-params.interface';
import { PoTableResponseApi } from './po-table-response-api.interface';

/**
 * @description
 *
 * Define o tipo de busca utilizado no po-table.
 */
export interface PoTableFilter {
  /**
   * Método que será disparado ao filtrar a lista de itens ou carregar mais resultados no componente, deve-se retornar um *Observable* com a resposta da API no formato da interface `PoTableResponseApi`.
   *
   * @param { PoTableFilteredItemsParams } params objeto enviado por parâmetro que implementa a interface `PoTableFilteredItemsParams`
   */
  getFilteredItems(params: PoTableFilteredItemsParams): Observable<PoTableResponseApi>;
}
