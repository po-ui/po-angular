/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define uma coluna enviada ao Built-in AI para contextualizar a busca.
 */
export interface PoTableAiSearchColumn {
  /** Nome da propriedade da coluna. */
  property: string;

  /** Label exibido ao usuário. */
  label: string;

  /** Tipo da coluna (string, number, date, currency, boolean, etc.). */
  type: string;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define o resultado emitido pelo evento `p-ai-search-result`.
 */
export interface PoTableAiSearchResult {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Filtro OData retornado pela IA. */
  filter: string;

  /** Descrição legível do filtro. */
  description: string;

  /** Nível de confiança da interpretação. */
  confidence: number;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define o erro emitido pelo evento `p-ai-search-error`.
 */
export interface PoTableAiSearchError {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Código do erro (ex: 500, 408). */
  statusCode: number;

  /** Mensagem de erro. */
  message: string;
}
