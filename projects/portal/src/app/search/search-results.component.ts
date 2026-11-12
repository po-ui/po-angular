import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output
} from '@angular/core';

import { PoListViewFieldProperties, PoSkeletonAnimation } from '@po-ui/ng-components';

import { SearchAnalyticsService } from './search-analytics.service';
import { SearchDocType, SearchResult } from './search.model';
import { SEARCH_MODAL_PAGE_SIZE, SearchService, SearchVariant } from './search.service';

const ITEM_SELECTOR = '.po-list-view-item-wrapper[tabindex="0"]';
/** Consulta "estável" para analytics: sem digitar por este tempo. */
const STABLE_QUERY_MS = 600;

/**
 * Painel de resultados da busca (usado no popover do header e no modal).
 * Lista com `po-list-view`; o foco passa do campo para os itens com ↓ e volta com ↑ no primeiro.
 */
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SearchResultsComponent {
  readonly service = inject(SearchService);
  private readonly analytics = inject(SearchAnalyticsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Consulta já com debounce (quem digita controla). */
  readonly query = input('');
  readonly variant = input<SearchVariant>('popover');
  /** O usuário ainda está digitando: a consulta acima está atrasada (debounce) e o skeleton aparece. */
  readonly typing = input(false);
  /** Filtro de tipos do modal (vazio = todos). Muda a lista na hora, sem esperar o debounce. */
  readonly types = input<ReadonlyArray<SearchDocType>>([]);
  /** `id` da lista, para `aria-controls` do campo. */
  readonly listId = input('search-results');

  readonly resultSelected = output<SearchResult>();
  /** ↑ no primeiro item: devolver o foco ao campo. */
  readonly focusInput = output<void>();
  /** "Ver todos" no rodapé do popover: abrir o modal com a mesma consulta. */
  readonly viewAll = output<void>();
  /** Quantos resultados há por tipo para a consulta atual (alimenta o filtro do modal). */
  readonly countsChange = output<Partial<Record<SearchDocType, number>>>();

  /** Sem animação para quem pediu menos movimento no sistema. */
  readonly skeletonAnimation = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? PoSkeletonAnimation.none
    : PoSkeletonAnimation.shimmer;
  readonly skeletonRows = [0, 1, 2];

  readonly fieldProperties: PoListViewFieldProperties = {
    title: 'title',
    tag: { value: 'typeLabel', type: 'typeColor' }
  };

  readonly trimmed = computed(() => this.query().trim());

  /** Quantos resultados o modal mostra agora; volta ao tamanho de página a cada consulta nova. */
  readonly shown = linkedSignal(() => {
    this.trimmed();

    return SEARCH_MODAL_PAGE_SIZE;
  });

  private readonly outcome = computed(() => {
    this.service.revision();

    return this.service.search(this.trimmed(), this.variant(), this.shown(), this.types());
  });

  readonly results = computed(() => this.outcome().results);
  readonly total = computed(() => this.outcome().total);
  /** Resultados que casaram mas não estão na lista (popover: prévia; modal: ainda não mostrados). */
  readonly hidden = computed(() => this.total() - this.results().length);

  readonly state = computed<'short' | 'loading' | 'error' | 'empty' | 'results'>(() => {
    const status = this.service.status();

    if (status === 'error') return 'error';
    if (this.typing()) return 'loading';
    if (this.trimmed().length < 2) return 'short';
    if (status !== 'ready') return 'loading';

    return this.results().length ? 'results' : 'empty';
  });

  /** Texto para leitor de tela (aria-live). */
  readonly liveMessage = computed(() => {
    switch (this.state()) {
      case 'results':
        return this.hidden() > 0
          ? `${this.results().length} de ${this.total()} resultados`
          : `${this.results().length} resultados`;
      case 'empty':
        return `Nenhum resultado para ${this.trimmed()}${this.types().length ? ' nos tipos escolhidos' : ''}`;
      case 'loading':
        return 'Buscando';
      case 'error':
        return 'Não foi possível carregar a busca';
      default:
        return '';
    }
  });

  private queryStartedAt = 0;
  private lastInput: 'mouse' | 'keyboard' = 'mouse';

  constructor() {
    // Começa a baixar o índice assim que alguém usa a busca.
    effect(() => {
      if (this.trimmed().length >= 1) {
        void this.service.load();
      }
    });

    // Tipos escolhidos podem morar em chunks lazy (ícones, API, samples): carrega e a lista se atualiza sozinha.
    effect(() => {
      void this.service.ensureTypes(this.types());
    });

    effect(() => {
      this.countsChange.emit(this.outcome().counts);
    });

    effect(onCleanup => {
      const term = this.trimmed();
      const state = this.state();

      if (term.length < 2) {
        this.queryStartedAt = 0;

        return;
      }
      this.queryStartedAt ||= Date.now();

      if (state !== 'results' && state !== 'empty') return;

      const count = this.results().length;
      const timer = setTimeout(() => {
        this.analytics.track({ name: 'search_query', term, resultsCount: count });
        if (!count) this.analytics.track({ name: 'search_no_results', term });
      }, STABLE_QUERY_MS);

      onCleanup(() => clearTimeout(timer));
    });
  }

  get resultsCount(): number {
    return this.results().length;
  }

  select(item: { id: string }, input: 'mouse' | 'keyboard' = 'mouse'): void {
    const result = this.results().find(r => r.id === item.id);

    if (!result) return;

    const position = this.results().indexOf(result) + 1;

    this.analytics.track({
      name: 'search_result_click',
      term: this.trimmed(),
      position,
      resultType: result.type,
      resultId: result.id,
      input: this.lastInput === 'keyboard' ? 'keyboard' : input,
      msToClick: this.queryStartedAt ? Date.now() - this.queryStartedAt : 0
    });
    this.resultSelected.emit(result);
  }

  showMore(): void {
    this.shown.update(value => value + SEARCH_MODAL_PAGE_SIZE);
  }

  retry(): void {
    void this.service.retry();
  }

  /** Move o foco para o primeiro item (↓ no campo). */
  focusFirst(): void {
    this.items()[0]?.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.lastInput = 'keyboard';
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const items = this.items();
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (index === -1) return;
    event.preventDefault();

    if (event.key === 'ArrowDown') {
      items[Math.min(index + 1, items.length - 1)].focus();
    } else if (index === 0) {
      this.focusInput.emit();
    } else {
      items[index - 1].focus();
    }
  }

  onClick(): void {
    this.lastInput = 'mouse';
  }

  private items(): Array<HTMLElement> {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
  }
}
