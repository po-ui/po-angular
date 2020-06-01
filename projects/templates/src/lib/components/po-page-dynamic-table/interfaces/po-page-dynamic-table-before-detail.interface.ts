/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeDetail`.
 */
export interface PoPageDynamicTableBeforeDetail {
  /**
   * Nova rota para abrir o detalhe, deve substituir a função ou rota definida anteriormente
   * > Se for uma url literal, será feito o navigate direto ex: `/view/22`.
   *
   * > Se a url ter o coringa `:id` esse id será substituído pela chave do recurso ex: `/view/:id` será convertido para `/view/22`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de ir para o detalhe
   */
  allowAction?: boolean;
}
