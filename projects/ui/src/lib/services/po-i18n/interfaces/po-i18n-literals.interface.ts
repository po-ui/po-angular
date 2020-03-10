/**
 * @description
 *
 * Interface para o método `getLiterals()` do serviço PoI18nService.
 *
 * @usedBy PoI18nService
 */
export interface PoI18nLiterals {
  /** Contexto utilizado na busca das literais. */
  context?: string;

  /** Idioma a ser buscado. */
  language?: string;

  /** Lista das literais. */
  literals?: Array<string>;
}
