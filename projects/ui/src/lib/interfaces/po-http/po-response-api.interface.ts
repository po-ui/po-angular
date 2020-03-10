/**
 * @description
 *
 * Interface que representa a estrutura de uma resposta de sucesso HTTP.
 *
 * > Utilizada apenas quando a resposta incluir uma coleção de itens.
 */
export interface PoResponseApi {
  /** Lista de itens retornados. */
  items: Array<any>;

  /** Indica se existe uma próxima página com mais registros para aquela coleção de itens. */
  hasNext: boolean;
}
