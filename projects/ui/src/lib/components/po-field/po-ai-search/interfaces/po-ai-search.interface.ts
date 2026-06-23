import { PoAiSearchColumn } from './po-ai-search-column.interface';

/**
 * @usedBy PoAiSearchComponent
 *
 * @description
 *
 * Interface que define o payload enviado ao endpoint de IA configurado via `p-url`.
 *
 * O componente é **agnóstico ao provedor de IA**: o backend (proxy) recebe este payload,
 * encaminha para a LLM e retorna um `PoAiSearchResponse`.
 */
export interface PoAiSearchRequest {
  /** Texto em linguagem natural digitado pelo usuário. */
  query: string;

  /** Metadados dos campos disponíveis para a busca (ver `PoAiSearchColumn`). */
  columns: Array<PoAiSearchColumn>;
}

/**
 * @usedBy PoAiSearchComponent
 *
 * @description
 *
 * Interface que define a resposta esperada do endpoint de IA configurado via `p-url`.
 */
export interface PoAiSearchResponse {
  /**
   * Filtro gerado pela IA, normalmente no padrão OData
   * (ex: `age gt 30 and city eq 'São Paulo'`).
   */
  filter: string;

  /** Descrição legível, em linguagem natural, do filtro aplicado. */
  description?: string;

  /**
   * Nível de confiança da interpretação da IA, em um intervalo de `0.0` a `1.0`.
   *
   * Utilizado em conjunto com `p-min-confidence` para decidir se o resultado é confiável.
   */
  confidence?: number;
}

/**
 * @usedBy PoAiSearchComponent
 *
 * @description
 *
 * Interface que define o objeto emitido pelos eventos `p-result` e `p-low-confidence`.
 */
export interface PoAiSearchResult {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Filtro retornado pela IA (ex: filtro OData). */
  filter: string;

  /** Descrição legível do filtro. */
  description?: string;

  /** Nível de confiança da interpretação (`0.0` a `1.0`). */
  confidence?: number;
}

/**
 * @usedBy PoAiSearchComponent
 *
 * @description
 *
 * Interface que define o objeto emitido pelo evento `p-error` quando a chamada à
 * API de IA falha (erro HTTP, timeout, resposta inválida, etc.).
 */
export interface PoAiSearchError {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Código HTTP do erro (ex: `500`, `408` para timeout). */
  statusCode: number;

  /** Mensagem de erro. */
  message: string;
}
