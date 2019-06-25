/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-table`.
 */
export interface PoTableLiterals {

  /** Texto exibido quando não existem colunas definidas para a tabela. */
  noColumns?: string;

  /** Texto exibido quando não existem itens para serem exibidos na tabela. */
  noData?: string;

  /** Texto exibido enquanto uma requisição está sendo executada para carregar dados na tabela. */
  loadingData?: string;

  /** Label do `button` que deve carregar mais resultados, ou seja, exibir mais itens. */
  loadMoreData?: string;

  /** Texto do botão 'Ver legenda completa' que aparece quando o rodapé de legendas é maior que a tabela. */
  seeCompleteSubtitle?: string;

  /** Título da modal 'Legenda completa' que aparece ao clicar no botão 'Ver legenda completa'. */
  completeSubtitle?: string;

}
