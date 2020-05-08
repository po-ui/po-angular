/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeNew`.
 */
export interface PoPageDynamicTableBeforeNew {
  /**
   * Nova rota para salvar o recurso, que substituirá a rota definida anteriormente em `new`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de inserção (new)
   */
  allowAction?: boolean;
}
