/**
 * @usedBy PoPageDynamicSearchComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-page-dynamic-search`.
 */
export interface PoPageDynamicSearchLiterals {
  /** Título do grupo de *disclaimers* que será exibido após realizar alguma busca. */
  disclaimerGroupTitle?: string;

  /** Texto exibido no botão para cancelamento da busca avaçanda. */
  filterCancelLabel?: string;

  /** Texto exibido no botão para confirmação da busca avaçanda. */
  filterConfirmLabel?: string;

  /** Título da busca avançada. */
  filterTitle?: string;

  /** Texto do *disclaimer* que será exibido em conjunto com o valor preenchido no campo de busca rápida. */
  quickSearchLabel?: string;

  /** Mensagem que aparecerá enquanto o campo de busca rápida não estiver preenchido. */
  searchPlaceholder?: string;
}
