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

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Tipo que representa o estado de disponibilidade do Built-in AI no navegador.
 *
 * - `readily`: modelo disponível e pronto para uso imediato.
 * - `after-download`: modelo precisa ser baixado antes de ser utilizado.
 * - `unavailable`: funcionalidade existe no navegador mas está desabilitada (requer configuração).
 * - `unsupported`: navegador não suporta Built-in AI.
 * - `unknown`: estado ainda não verificado.
 */
export type PoTableAiSearchAvailability = 'readily' | 'after-download' | 'unavailable' | 'unsupported' | 'unknown';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define o progresso de download do modelo de IA.
 */
export interface PoTableAiSearchDownloadProgress {
  /** Bytes já baixados. */
  loaded: number;

  /** Total de bytes a serem baixados. */
  total: number;

  /** Percentual de progresso (0 a 100). */
  percent: number;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface que define uma etapa do fluxo de configuração do Built-in AI.
 */
export interface PoTableAiSearchConfigStep {
  /** Número da etapa. */
  step: number;

  /** Título da etapa. */
  title: string;

  /** Descrição detalhada da etapa. */
  description: string;

  /** URL ou endereço para navegação (ex: chrome://flags). */
  url?: string;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Tipo que representa a fase atual do processamento da IA.
 *
 * - `idle`: nenhum processamento em andamento.
 * - `initializing`: criando sessão com o modelo de IA.
 * - `downloading`: modelo sendo baixado pela primeira vez.
 * - `generating`: modelo gerando a resposta (streaming ativo).
 * - `analyzing`: resposta gerada, analisando resultado.
 * - `done`: processamento concluído com sucesso.
 * - `error`: ocorreu um erro durante o processamento.
 */
export type PoTableAiSearchPhase = 'idle' | 'initializing' | 'downloading' | 'generating' | 'analyzing' | 'done' | 'error';
