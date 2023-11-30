/**
 * @usedBy PoSearchComponent
 *
 * @description
 *
 * Define o tipo de busca usado no po-search.
 */
export enum PoSearchFilterMode {
  /** Verifica se o texto *inicia* com o valor pesquisado. */
  startsWith,
  /** Verifica se o texto *contém* o valor pesquisado. */
  contains,
  /** Verifica se o texto *finaliza* com o valor pesquisado. */
  endsWith
}
