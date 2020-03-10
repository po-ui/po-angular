/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-table`.
 */
export interface PoTableLiterals {
  /** Texto do **Gerenciador de colunas** localizado no canto superior direito da tabela. */
  columnsManager?: string;

  /** Título da modal 'Legenda completa' que aparece ao clicar no botão 'Ver legenda completa'. */
  completeSubtitle?: string;

  /** Texto exibido quando não existem colunas definidas para a tabela. */
  noColumns?: string;

  /** Texto exibido quando não existem itens para serem exibidos na tabela. */
  noData?: string;

  /** Texto exibido quando não existem colunas visíveis para a tabela. */
  noVisibleColumn?: string;

  /** Texto exibido enquanto uma requisição está sendo executada para carregar dados na tabela. */
  loadingData?: string;

  /** Texto do botão de **Carregar mais resultados** localizado no rodapé da tabela. */
  loadMoreData?: string;

  /** Texto do botão **Ver legenda completa** que aparece quando o rodapé de legendas é maior que a tabela. */
  seeCompleteSubtitle?: string;
}
