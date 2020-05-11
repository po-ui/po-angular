/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeRemove`.
 */
export interface PoPageDynamicTableBeforeRemove {
  /**
   * Nova rota para enviar o delete, deve substituir a função ou rota definida anteriormente
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de exclusão (delete)
   */
  allowAction?: boolean;
}
