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
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de ir para o detalhe
   */
  allowAction?: boolean;
}
