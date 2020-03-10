/**
 * @usedBy PoQueryBuilder
 *
 * @description
 *
 * Interface que representa a estrutura de resposta de uma coleção de itens.
 *
 */
export interface PoResponseApi {
  /** Lista de itens retornados. */
  items: Array<object>;

  /** Indica se existe uma próxima página com mais registros para aquela coleção de itens. */
  hasNext: boolean;
}
