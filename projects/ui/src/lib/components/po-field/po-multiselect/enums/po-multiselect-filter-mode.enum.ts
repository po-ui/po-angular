/**
 * @usedBy PoMultiselectComponent
 *
 * @description
 *
 * Define o tipo de busca usado no po-multiselect.
 */
export enum PoMultiselectFilterMode {
  /** Verifica se o texto *inicia* com o valor pesquisado. */
  startsWith,
  /** Verifica se o texto *contém* o valor pesquisado. */
  contains,
  /** Verifica se o texto *finaliza* com o valor pesquisado. */
  endsWith
}
