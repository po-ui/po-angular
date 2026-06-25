import { PoSearchAiColumn } from './po-search-ai-column.interface';

/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Enum que define os tipos de resposta suportados pelo endpoint de IA.
 *
 * - `filter` — resposta contendo um filtro estruturado (ex: OData).
 * - `chat` — resposta conversacional em linguagem natural.
 * - `custom` — payload genérico definido pelo consumidor.
 */
export enum PoSearchAiResponseType {
  filter = 'filter',
  chat = 'chat',
  custom = 'custom'
}

/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Interface que define o payload enviado ao endpoint de IA configurado via `p-url`.
 *
 * O componente é **agnóstico ao provedor de IA**: o backend (proxy) recebe este payload,
 * encaminha para a LLM e retorna um `PoSearchAiResponse`.
 */
export interface PoSearchAiRequest {
  /** Texto em linguagem natural digitado pelo usuário. */
  query: string;

  /** Metadados dos campos disponíveis para a busca (ver `PoSearchAiColumn`). */
  columns: Array<PoSearchAiColumn>;
}

/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Interface que define a resposta esperada do endpoint de IA configurado via `p-url`.
 */
export interface PoSearchAiResponse {
  /**
   * Tipo da resposta retornada pela IA.
   *
   * Quando omitido, o componente infere `'filter'` se `filter` estiver presente,
   * caso contrário assume `'custom'`.
   *
   * @default `'filter'`
   */
  type?: PoSearchAiResponseType;

  /**
   * Filtro gerado pela IA, normalmente no padrão OData
   * (ex: `age gt 30 and city eq 'São Paulo'`).
   *
   * Utilizado quando `type` é `'filter'`.
   */
  filter?: string;

  /** Descrição legível, em linguagem natural, da resposta. */
  description?: string;

  /**
   * Nível de confiança da interpretação da IA, em um intervalo de `0.0` a `1.0`.
   *
   * Utilizado em conjunto com `p-min-confidence` para decidir se o resultado é confiável.
   */
  confidence?: number;

  /**
   * Payload genérico da resposta da IA (mensagem de chat, ações, dados customizados, etc.).
   *
   * Utilizado quando `type` é `'chat'` ou `'custom'`.
   */
  data?: Record<string, any>;
}

/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Interface que define o objeto emitido pelos eventos `p-result` e `p-low-confidence`.
 */
export interface PoSearchAiResult {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Tipo da resposta retornada pela IA. */
  type: PoSearchAiResponseType;

  /** Filtro retornado pela IA (ex: filtro OData). Presente quando `type` é `'filter'`. */
  filter?: string;

  /** Descrição legível da resposta. */
  description?: string;

  /** Nível de confiança da interpretação (`0.0` a `1.0`). */
  confidence?: number;

  /** Payload genérico da resposta (chat, ações, dados customizados, etc.). */
  data?: Record<string, any>;
}

/**
 * @usedBy PoSearchAiComponent
 *
 * @description
 *
 * Interface que define o objeto emitido pelo evento `p-error` quando a chamada à
 * API de IA falha (erro HTTP, timeout, resposta inválida, etc.).
 */
export interface PoSearchAiError {
  /** Texto original digitado pelo usuário. */
  query: string;

  /** Código HTTP do erro (ex: `500`, `408` para timeout). */
  statusCode: number;

  /** Mensagem de erro. */
  message: string;
}
