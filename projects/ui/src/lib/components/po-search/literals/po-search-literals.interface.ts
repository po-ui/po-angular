/**
 * @usedBy PoSearchComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-search`.
 */
export interface PoSearchLiterals {
  /** Texto exibido como *placeholder* no campo de busca. */
  search?: string;

  /** Texto alternativo (aria-label) para o botão de limpar o campo de busca, usado por leitores de tela. */
  clean?: string;

  /**
   * Texto exibido no dropdown de tipo de filtro, representando todos os tipos disponíveis.
   *
   * > Exibido apenas quando a propriedade `p-filter-select` estiver habilitada.
   */
  all?: string;

  /**
   * Texto alternativo (aria-label) para a palavra "de" no contador de resultados (ex: "Resultado 1 de 4").
   *
   * > Exibido apenas quando a propriedade `p-filter-locate` estiver habilitada.
   * */
  of?: string;

  /**
   * Texto alternativo (aria-label) para navegação até o próximo resultado da busca.
   *
   * > Exibido apenas quando a propriedade `p-filter-locate` estiver habilitada.
   */
  next?: string;

  /**
   * Texto alternativo (aria-label) para navegação até o resultado anterior da busca.
   *
   * > Exibido apenas quando a propriedade `p-filter-locate` estiver habilitada.
   */
  previous?: string;

  /**
   * Texto alternativo (aria-label) para a label "Resultado" que acompanha o contador.
   *
   * > Exibido apenas quando a propriedade `p-filter-locate` estiver habilitada.
   */
  result?: string;

  /**
   * Texto exibido na ação do rodapé da lista de resultados.
   */
  footerActionListbox?: string;

  /**
   * Texto exibido como *placeholder* na lista de resultados.
   */
  placeholderListbox?: string;
}
