/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeEdit`.
 */
export interface PoPageDynamicDetailBeforeEdit {
  /**
   * Nova rota para navegação que substituirá a definida anteriormente em `edit`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de edição (*edit*)
   */
  allowAction?: boolean;
}
