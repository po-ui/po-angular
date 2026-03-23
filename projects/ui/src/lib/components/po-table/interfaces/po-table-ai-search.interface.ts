/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define uma coluna enviada ao endpoint de IA para contextualizar a busca.
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
 * Interface que define o payload enviado ao endpoint de IA configurado via `p-ai-search-url`.
 */
export interface PoTableAiSearchRequest {
  /** Texto em linguagem natural digitado pelo usuário. */
  query: string;

  /** Metadados das colunas visíveis da tabela (exceto as marcadas com `aiSearchIgnore`). */
  columns: Array<PoTableAiSearchColumn>;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define a resposta esperada do endpoint de IA.
 */
export interface PoTableAiSearchResponse {
  /** Filtro OData gerado pela IA (ex: `age gt 30 and city eq 'São Paulo'`). */
  filter: string;

  /** Descrição legível do filtro aplicado. */
  description: string;

  /** Nível de confiança da interpretação (0.0 a 1.0). */
  confidence: number;
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

  /** Código HTTP do erro (ex: 500, 408). */
  statusCode: number;

  /** Mensagem de erro. */
  message: string;
}
