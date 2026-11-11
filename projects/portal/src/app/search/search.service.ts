import { Injectable, inject, signal } from '@angular/core';

import type MiniSearch from 'minisearch';

import { SearchAnalyticsService } from './search-analytics.service';
import { buildExcerpt, normalizeText, queryTerms, tokenize } from './search-text';
import {
  SEARCH_TYPE_COLOR,
  SEARCH_TYPE_LABEL,
  SearchChunk,
  SearchChunkName,
  SearchDoc,
  SearchDocType,
  SearchManifest,
  SearchResult,
  SearchStatus
} from './search.model';

export type SearchVariant = 'popover' | 'modal';

type SearchCategory = 'componente' | 'guia' | 'api' | 'outros' | 'icone';

const CATEGORY: Record<SearchDocType, SearchCategory> = {
  componente: 'componente',
  servico: 'outros',
  interface: 'outros',
  enum: 'outros',
  pagina: 'outros',
  guia: 'guia',
  propriedade: 'api',
  evento: 'api',
  metodo: 'api',
  icone: 'icone'
};

/** Boost por tipo: componente/página/guia vencem propriedade ("kind" existe em dezenas de componentes). */
const TYPE_BOOST: Record<SearchDocType, number> = {
  componente: 3,
  pagina: 2.5,
  servico: 2,
  guia: 2,
  interface: 1.5,
  enum: 1.5,
  metodo: 1.2,
  evento: 1.2,
  propriedade: 1,
  icone: 0.8
};

/** Limites do resultado: total e por categoria (evita que as propriedades afoguem o resto). */
const LIMITS: Record<SearchVariant, { max: number; perCategory: Record<SearchCategory, number> }> = {
  popover: { max: 8, perCategory: { componente: 3, guia: 3, api: 4, outros: 2, icone: 2 } },
  modal: { max: 20, perCategory: { componente: 6, guia: 6, api: 8, outros: 4, icone: 4 } }
};

/** Ícones só aparecem com 3+ caracteres: "a" ou "ar" casariam centenas deles. */
const MIN_ICON_QUERY = 3;
const MIN_QUERY = 2;
const CHUNK_SIZE = 250;

/**
 * Índice da busca global: baixa o manifest (sempre revalidado) e os chunks com hash no nome
 * (cache longo), monta o MiniSearch e consulta. O motor é carregado sob demanda (chunk lazy).
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly analytics = inject(SearchAnalyticsService);

  /** `ready` já permite buscar (resultados parciais enquanto `pending`). */
  readonly status = signal<SearchStatus>('idle');
  /** Ainda há chunks carregando; os resultados podem estar incompletos. */
  readonly pending = signal(false);
  /** Incrementa a cada chunk indexado, para quem exibe resultados recalcular. */
  readonly revision = signal(0);

  private miniSearch?: MiniSearch<SearchDoc>;
  private manifest?: SearchManifest;
  private readonly docs = new Map<string, SearchDoc>();
  private readonly chunks = new Map<SearchChunkName, Promise<void>>();
  private starting?: Promise<void>;

  /** Começa o carregamento (idempotente). Falhas ficam em `status = 'error'`; `retry()` tenta de novo. */
  load(): Promise<void> {
    this.starting ??= this.start();

    return this.starting;
  }

  retry(): Promise<void> {
    this.starting = undefined;
    this.chunks.clear();
    this.miniSearch = undefined;
    this.docs.clear();

    return this.load();
  }

  /** Ícones são carregados só quando a consulta pede (3+ caracteres). */
  loadIcons(): Promise<void> {
    return this.miniSearch ? this.loadChunk('icons').catch(() => undefined) : Promise.resolve();
  }

  search(query: string, variant: SearchVariant = 'popover'): Array<SearchResult> {
    const text = (query || '').trim();

    if (!this.miniSearch || text.length < MIN_QUERY) return [];

    const normalizedQuery = normalizeText(text);
    const withIcons = text.length >= MIN_ICON_QUERY;
    const terms = queryTerms(text);

    if (withIcons && this.manifest?.chunks.icons && !this.chunks.has('icons')) {
      void this.loadIcons();
    }

    const hits = this.miniSearch.search(text, {
      prefix: true,
      fuzzy: term => (term.length > 4 ? 0.2 : false),
      combineWith: 'AND',
      boost: { title: 4, component: 2.5, section: 1.5, text: 1 },
      boostDocument: (_id, _term, stored) => TYPE_BOOST[stored?.['type'] as SearchDocType] ?? 1,
      filter: result => withIcons || result['type'] !== 'icone'
    });

    const ranked = hits
      .map(hit => ({
        doc: this.docs.get(hit.id),
        score: hit.score * (this.isExactName(hit.id, normalizedQuery) ? 3 : 1)
      }))
      .filter((item): item is { doc: SearchDoc; score: number } => !!item.doc)
      .sort((a, b) => b.score - a.score);

    return this.limit(ranked, variant).map(({ doc, score }) => ({
      id: doc.id,
      type: doc.type,
      typeLabel: SEARCH_TYPE_LABEL[doc.type],
      typeColor: SEARCH_TYPE_COLOR[doc.type],
      title: doc.title,
      page: doc.page,
      section: doc.section,
      url: doc.url,
      fragment: doc.fragment,
      excerpt: buildExcerpt(doc.text, terms),
      score
    }));
  }

  /** Consulta igual ao nome do componente (`po-button`, `PoButton`) sobe o componente ao topo. */
  private isExactName(id: string, normalizedQuery: string): boolean {
    const doc = this.docs.get(id);

    return (
      !!doc &&
      (normalizeText(doc.title) === normalizedQuery ||
        (!doc.fragment && doc.id === normalizedQuery) ||
        (!!doc.fragment && normalizeText(doc.fragment) === normalizedQuery))
    );
  }

  private limit(items: Array<{ doc: SearchDoc; score: number }>, variant: SearchVariant) {
    const { max, perCategory } = LIMITS[variant];
    const used: Partial<Record<SearchCategory, number>> = {};
    const result: Array<{ doc: SearchDoc; score: number }> = [];

    for (const item of items) {
      const category = CATEGORY[item.doc.type];

      if ((used[category] ?? 0) >= perCategory[category]) continue;
      used[category] = (used[category] ?? 0) + 1;
      result.push(item);
      if (result.length >= max) break;
    }

    return result;
  }

  private async start(): Promise<void> {
    this.status.set('loading');

    try {
      const [{ default: MiniSearchClass }, manifest] = await Promise.all([
        import('minisearch'),
        // O manifest é o único arquivo sem hash: sempre revalida; os chunks (com hash) ficam em cache.
        this.fetchJson<SearchManifest>('assets/json/search-manifest.json', 'no-cache')
      ]);

      this.manifest = manifest;
      this.miniSearch = new MiniSearchClass<SearchDoc>({
        fields: ['title', 'component', 'section', 'text'],
        storeFields: ['type'],
        tokenize,
        processTerm: term => normalizeText(term)
      });

      await this.loadChunk('core');
      this.status.set('ready');
    } catch (error) {
      this.fail('core', error);

      return;
    }

    this.pending.set(true);
    await this.loadChunk('api').catch(() => undefined);
    this.pending.set(false);
  }

  private loadChunk(name: SearchChunkName): Promise<void> {
    const cached = this.chunks.get(name);

    if (cached) return cached;

    const entry = this.manifest?.chunks[name];
    const promise = entry
      ? this.fetchJson<SearchChunk>(`assets/json/${entry.file}`).then(chunk => this.index(chunk))
      : Promise.resolve();

    this.chunks.set(
      name,
      promise.catch(error => {
        this.chunks.delete(name);
        this.fail(name, error, name === 'core');
        throw error;
      })
    );

    return this.chunks.get(name);
  }

  private async index(chunk: SearchChunk): Promise<void> {
    const docs = chunk.docs.map(raw => {
      const page = chunk.pages[raw.page];

      return {
        id: raw.id,
        type: raw.type,
        title: raw.title,
        page: page.name,
        url: page.url,
        component: page.component ?? '',
        section: raw.section ?? '',
        fragment: raw.fragment,
        text: raw.text
      };
    });

    docs.forEach(doc => this.docs.set(doc.id, doc));
    await this.miniSearch.addAllAsync(docs, { chunkSize: CHUNK_SIZE });
    this.revision.update(value => value + 1);
  }

  private async fetchJson<T>(url: string, cache: RequestCache = 'default'): Promise<T> {
    const response = await fetch(url, { cache });

    if (!response.ok) {
      throw Object.assign(new Error(`${url}: HTTP ${response.status}`), { status: response.status });
    }

    return response.json();
  }

  private fail(chunk: string, error: unknown, fatal = true): void {
    this.analytics.track({ name: 'search_index_error', chunk, status: (error as { status?: number })?.status });
    if (fatal) {
      this.status.set('error');
      this.pending.set(false);
    }
  }
}
