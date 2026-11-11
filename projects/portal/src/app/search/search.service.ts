import { Injectable, computed, inject, signal } from '@angular/core';

import type MiniSearch from 'minisearch';

import { ANCHOR_PREFIXES } from '../shared/deep-link-scroll.service';
import { SearchAnalyticsService } from './search-analytics.service';
import { buildExcerpt, normalizeText, queryTerms, tokenize } from './search-text';
import {
  SEARCH_DEBOUNCE_MS,
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

/** `prop-p-kind` -> `p-kind`: o nome que a pessoa digita. */
const ANCHOR_PREFIX_RE = new RegExp(`^(${ANCHOR_PREFIXES.join('|')})`);

export type SearchVariant = 'popover' | 'modal';

export interface SearchOutcome {
  /** Quantos resultados há por tipo para a consulta (sem aplicar o filtro de tipos), para o filtro do modal. */
  counts: Partial<Record<SearchDocType, number>>;
  /** Resultados prontos para exibir (limitados pela variante). */
  results: Array<SearchResult>;
  /** Quantos documentos casaram, contando os que não cabem em `results`. */
  total: number;
}

type SearchCategory = 'componente' | 'guia' | 'api' | 'sample' | 'outros' | 'icone';

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
  icone: 'icone',
  sample: 'sample'
};

/** Chunk onde cada tipo mora (espelha `CHUNK_OF_TYPE` do gerador do índice). */
const SEARCH_CHUNK_OF_TYPE: Record<SearchDocType, SearchChunkName> = {
  componente: 'core',
  servico: 'core',
  interface: 'core',
  enum: 'core',
  guia: 'core',
  pagina: 'core',
  propriedade: 'api',
  evento: 'api',
  metodo: 'api',
  icone: 'icons',
  sample: 'samples'
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
  sample: 1.4,
  icone: 0.8
};

/**
 * Popover: prévia curta, equilibrada por categoria (propriedades não afogam o resto) e com o total para
 * "Ver todos". Modal: todos os resultados em ordem de relevância, mostrados aos poucos.
 */
const POPOVER_LIMITS: { max: number; perCategory: Record<SearchCategory, number> } = {
  max: 8,
  perCategory: { componente: 3, guia: 3, api: 4, sample: 2, outros: 2, icone: 2 }
};

/** Quantos resultados o modal mostra de cada vez ("Mostrar mais" acrescenta o mesmo tanto). */
export const SEARCH_MODAL_PAGE_SIZE = 50;

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
  readonly pending = computed(() => this.inflight() > 0);
  private readonly inflight = signal(0);
  /** Incrementa a cada chunk indexado, para quem exibe resultados recalcular. */
  readonly revision = signal(0);

  /**
   * Texto digitado: uma fonte só para o campo do header e o do modal (um mostra o que o outro digitou).
   * Abrir o modal (Ctrl/Cmd+K, "Ver todos", ícone) começa com este texto; fechar o modal mantém o texto;
   * limpar em qualquer um dos campos limpa os dois. O filtro de tipos do modal não é afetado.
   */
  readonly text = signal('');
  /** `text` depois do debounce: é o que a busca de fato consulta. Vazio passa na hora. */
  readonly query = signal('');
  /** Digitou algo novo e a busca ainda não rodou: os painéis mostram o skeleton. */
  readonly typing = computed(() => {
    const text = this.text().trim();

    return text.length >= 2 && text !== this.query().trim();
  });
  private textTimer?: ReturnType<typeof setTimeout>;

  private miniSearch?: MiniSearch<SearchDoc>;
  private manifest?: SearchManifest;
  private readonly docs = new Map<string, SearchDoc>();
  private readonly chunks = new Map<SearchChunkName, Promise<void>>();
  private starting?: Promise<void>;

  /** Atualiza o texto compartilhado; a consulta segue depois de `SEARCH_DEBOUNCE_MS` (limpar é imediato). */
  setText(value: string): void {
    const text = value ?? '';

    this.text.set(text);
    clearTimeout(this.textTimer);

    if (!text.trim()) {
      this.query.set(text);
    } else {
      this.textTimer = setTimeout(() => this.query.set(text), SEARCH_DEBOUNCE_MS);
    }
  }

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

  /** Garante que os chunks lazy dos tipos escolhidos estão carregados (ícones, API, samples). */
  async ensureTypes(types: ReadonlyArray<SearchDocType>): Promise<void> {
    if (!types.length) return;

    await this.load();
    await Promise.all(
      Array.from(new Set(types.map(type => SEARCH_CHUNK_OF_TYPE[type])))
        .filter(name => name !== 'core')
        .map(name => this.loadChunk(name).catch(() => undefined))
    );
  }

  /** Ícones são carregados só quando a consulta pede (3+ caracteres). */
  loadIcons(): Promise<void> {
    return this.miniSearch ? this.loadChunk('icons').catch(() => undefined) : Promise.resolve();
  }

  /**
   * @param types restringe aos tipos escolhidos (vazio = todos). Uma passada só no MiniSearch: o filtro entra depois
   *   do ranking, e assim `counts` já sai gratuito para todos os tipos.
   */
  search(
    query: string,
    variant: SearchVariant = 'popover',
    limit = SEARCH_MODAL_PAGE_SIZE,
    types: ReadonlyArray<SearchDocType> = []
  ): SearchOutcome {
    const text = (query || '').trim();

    if (!this.miniSearch || text.length < MIN_QUERY) return { results: [], total: 0, counts: {} };

    const normalizedQuery = normalizeText(text);
    // ícones só com 3+ caracteres, a não ser que a pessoa os tenha escolhido no filtro
    const withIcons = text.length >= MIN_ICON_QUERY || types.includes('icone');
    const terms = queryTerms(text);

    if (withIcons && this.manifest?.chunks.icons && !this.chunks.has('icons')) {
      // fora da leitura: `search` roda dentro de `computed`, que não pode gravar sinais (`inflight`)
      queueMicrotask(() => void this.loadIcons());
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

    const counts: SearchOutcome['counts'] = {};

    ranked.forEach(({ doc }) => (counts[doc.type] = (counts[doc.type] ?? 0) + 1));

    const filtered = types.length ? ranked.filter(({ doc }) => types.includes(doc.type)) : ranked;
    const visible = variant === 'popover' ? this.balance(filtered) : filtered.slice(0, limit);
    const results = visible.map(({ doc, score }) => ({
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

    return { results, total: filtered.length, counts };
  }

  /** Consulta igual ao nome do componente (`po-button`, `PoButton`) sobe o componente ao topo. */
  private isExactName(id: string, normalizedQuery: string): boolean {
    const doc = this.docs.get(id);

    return (
      !!doc &&
      (normalizeText(doc.title) === normalizedQuery ||
        (!doc.fragment && doc.id === normalizedQuery) ||
        (!!doc.fragment && normalizeText(doc.fragment.replace(ANCHOR_PREFIX_RE, '')) === normalizedQuery))
    );
  }

  /** Prévia do popover: respeita o limite por categoria e o total. */
  private balance(items: Array<{ doc: SearchDoc; score: number }>) {
    const used: Partial<Record<SearchCategory, number>> = {};
    const result: Array<{ doc: SearchDoc; score: number }> = [];

    for (const item of items) {
      const category = CATEGORY[item.doc.type];

      if ((used[category] ?? 0) >= POPOVER_LIMITS.perCategory[category]) continue;
      used[category] = (used[category] ?? 0) + 1;
      result.push(item);
      if (result.length >= POPOVER_LIMITS.max) break;
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

    await this.loadChunk('api').catch(() => undefined);
    // samples vêm num chunk próprio, depois da API
    await this.loadChunk('samples').catch(() => undefined);
  }

  private loadChunk(name: SearchChunkName): Promise<void> {
    const cached = this.chunks.get(name);

    if (cached) return cached;

    const entry = this.manifest?.chunks[name];
    const promise = entry
      ? this.fetchJson<SearchChunk>(`assets/json/${entry.file}`).then(chunk => this.index(chunk))
      : Promise.resolve();

    this.inflight.update(count => count + 1);
    this.chunks.set(
      name,
      promise
        .catch(error => {
          this.chunks.delete(name);
          this.fail(name, error, name === 'core');
          throw error;
        })
        .finally(() => this.inflight.update(count => count - 1))
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
    }
  }
}
