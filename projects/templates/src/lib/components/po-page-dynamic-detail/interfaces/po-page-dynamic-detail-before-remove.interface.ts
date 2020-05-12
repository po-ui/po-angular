/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeRemove`.
 */
export interface PoPageDynamicDetailBeforeRemove {
  /**
   * Nova rota para navegação que substituirá a definida anteriormente em `remove`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de exclusão (*remove*)
   */
  allowAction?: boolean;
}
