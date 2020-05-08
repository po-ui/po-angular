/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeBack`.
 */
export interface PoPageDynamicDetailBeforeBack {
  /**
   * Nova rota para salvar o recurso, que substituirá a rota definida anteriormente em `back`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de inserção (*back*)
   */
  allowAction?: boolean;
}
