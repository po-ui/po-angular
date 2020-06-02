/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeEdit`.
 */
export interface PoPageDynamicTableBeforeEdit {
  /**
   * Nova rota para navegação que substituirá a definida anteriormente em `edit`.
   *
   * > Se for uma url literal, será feito o navigate direto ex: `/edit/22`.
   *
   * > Se a url tiver o coringa `:id` esse id será substituído pela chave do recurso ex: `/edit/:id` será convertido para `/edit/22`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de edição (*edit*)
   */
  allowAction?: boolean;
}
