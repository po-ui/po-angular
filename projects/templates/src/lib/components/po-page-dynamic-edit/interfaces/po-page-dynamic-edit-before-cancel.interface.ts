/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeCancel`.
 */
export interface PoPageDynamicEditBeforeCancel {
  /**
   * Nova rota para navegação que substituirá a definida anteriormente em `cancel`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de cancelamento de edição da página (cancel)
   */
  allowAction?: boolean;
}
