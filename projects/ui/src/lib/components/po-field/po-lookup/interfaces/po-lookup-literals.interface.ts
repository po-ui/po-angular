/**
 * @usedBy PoLookupComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-lookup`.
 */
export interface PoLookupLiterals {
  /** Texto exibido no label do botão de ação primária da modal. */
  modalPrimaryActionLabel?: string;

  /** Texto exibido no label do botão de ação secundária da modal. */
  modalSecondaryActionLabel?: string;

  /** Texto exibido no placeholder do input da modal. */
  modalPlaceholder?: string;

  /** Texto exibido quando não existem colunas definidas para a tabela. */
  modalTableNoColumns?: string;

  /** Texto exibido quando não existem itens para serem exibidos na tabela. */
  modalTableNoData?: string;

  /** Texto exibido enquanto uma requisição está sendo executada para carregar dados na tabela. */
  modalTableLoadingData?: string;

  /** Label do `button` que deve carregar mais resultados na tabela, ou seja, exibir mais itens. */
  modalTableLoadMoreData?: string;

  /** Texto exibido no título da modal. */
  modalTitle?: string;

  /**
   * Texto do link de busca avançada.
   *
   * Importante
   * Caso seja passado uma literal muito comprida poderá quebrar o layout.
   */
  modalAdvancedSearch?: string;

  /** Texto exibido no título da modal de busca avançada. */
  modalAdvancedSearchTitle?: string;

  /** Texto exibido no label do botão de ação primária da modal de busca avançada. */
  modalAdvancedSearchPrimaryActionLabel?: string;

  /** Texto exibido no label do botão de ação secundária da modal de busca avançada. */
  modalAdvancedSearchSecondaryActionLabel?: string;

  /** Texto exibido no título do disclaimer. */
  modalDisclaimerGroupTitle?: string;
}
