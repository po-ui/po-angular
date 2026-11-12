/** Tipos de documento do índice (ver `projects/portal/docs/processors/search`). */
export type SearchDocType =
  | 'componente'
  | 'servico'
  | 'interface'
  | 'enum'
  | 'guia'
  | 'pagina'
  | 'propriedade'
  | 'evento'
  | 'metodo'
  | 'icone'
  | 'sample';

export type SearchChunkName = 'core' | 'api' | 'icons' | 'samples';

export interface SearchManifest {
  version: number;
  chunks: Partial<Record<SearchChunkName, { file: string; count: number; bytes: number }>>;
}

export interface SearchPage {
  name: string;
  url: string;
  component?: string;
  package?: string;
}

/** Documento como gravado no chunk: `page` é o índice na tabela `pages` do chunk. */
export interface SearchChunkDoc {
  id: string;
  type: SearchDocType;
  title: string;
  page: number;
  section?: string;
  fragment?: string;
  text: string;
}

export interface SearchChunk {
  pages: Array<SearchPage>;
  docs: Array<SearchChunkDoc>;
}

/** Documento expandido, indexado no MiniSearch. */
export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  page: string;
  url: string;
  component: string;
  section: string;
  fragment?: string;
  text: string;
}

export interface SearchExcerptPart {
  text: string;
  mark: boolean;
}

export interface SearchResult {
  id: string;
  type: SearchDocType;
  typeLabel: string;
  /** Cor do `po-tag` da lista. */
  typeColor: string;
  title: string;
  /** Página onde o conteúdo está. */
  page: string;
  section: string;
  url: string;
  fragment?: string;
  /** Trecho do texto onde o termo aparece, em partes (as marcadas viram `<mark>`). */
  excerpt: Array<SearchExcerptPart>;
  score: number;
}

/**
 * Tempo parado de digitação antes de a busca executar (ms). Enquanto isso o painel mostra o skeleton.
 * Ajuste aqui: mais alto = menos buscas no meio da digitação; mais baixo = resposta mais rápida.
 */
export const SEARCH_DEBOUNCE_MS = 350;

export type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';

export const SEARCH_TYPE_LABEL: Record<SearchDocType, string> = {
  componente: 'Componente',
  servico: 'Serviço',
  interface: 'Interface',
  enum: 'Enum',
  guia: 'Guia',
  pagina: 'Página',
  propriedade: 'Propriedade',
  evento: 'Evento',
  metodo: 'Método',
  icone: 'Ícone',
  sample: 'Exemplo'
};

export const SEARCH_TYPE_COLOR: Record<SearchDocType, string> = {
  componente: 'success',
  servico: 'neutral',
  interface: 'warning',
  enum: 'warning',
  guia: 'info',
  pagina: 'info',
  propriedade: 'neutral',
  evento: 'neutral',
  metodo: 'neutral',
  icone: 'neutral',
  sample: 'info'
};
