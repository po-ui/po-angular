import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PoModalComponent, PoMultiselectComponent, PoMultiselectOption, PoSearchComponent } from '@po-ui/ng-components';

import { SearchAnalyticsService } from './search-analytics.service';
import { SearchLauncherService, SearchOpenRequest } from './search-launcher.service';
import { SearchNavigationService } from './search-navigation.service';
import { SearchResultsComponent } from './search-results.component';
import { SearchResult } from './search.model';
import { shortcutLabel } from './search-shortcut';
import { SEARCH_DEBOUNCE_MS, SEARCH_TYPES, SEARCH_TYPE_LABEL, SearchDocType } from './search.model';
import { SearchService } from './search.service';

/** Modal de busca (Ctrl/Cmd+K e ícone no mobile). Esc fecha; o `po-modal` devolve o foco a quem o tinha. */
@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SearchModalComponent {
  private readonly navigation = inject(SearchNavigationService);
  private readonly analytics = inject(SearchAnalyticsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(SearchService);

  @ViewChild('modal', { static: true }) modal!: PoModalComponent;
  @ViewChild('poSearch') poSearch?: PoSearchComponent;
  @ViewChild('typesFilter') typesFilter?: PoMultiselectComponent;
  @ViewChild(SearchResultsComponent) results?: SearchResultsComponent;
  @ViewChild('body') body?: ElementRef<HTMLElement>;

  readonly hint = shortcutLabel();
  readonly listId = 'app-search-modal-results';
  readonly literals = { search: 'Buscar no portal' };
  readonly query = signal('');
  readonly raw = signal('');
  /** Tipos escolhidos no filtro (vazio = todos). Não persiste ao reabrir: cada abertura é uma busca nova. */
  readonly types = signal<Array<SearchDocType>>([]);
  /** Resultados por tipo para a consulta atual, mostrados nas opções do filtro. */
  readonly counts = signal<Partial<Record<SearchDocType, number>>>({});
  /**
   * Opções fixas do filtro: a lista não muda de rótulo enquanto a pessoa escolhe; a contagem por tipo
   * vai numa linha à parte (`countsSummary`).
   */
  readonly typeOptions: Array<PoMultiselectOption> = SEARCH_TYPES.map(type => ({
    value: type,
    label: SEARCH_TYPE_LABEL[type]
  }));
  /** "Propriedade 6 · Guia 4": resultados por tipo da consulta atual (sem o filtro). */
  readonly countsSummary = computed(() =>
    SEARCH_TYPES.filter(type => this.counts()[type])
      .map(type => `${SEARCH_TYPE_LABEL[type]} ${this.counts()[type]}`)
      .join(' · ')
  );
  readonly typing = computed(() => this.raw().trim().length >= 2 && this.raw().trim() !== this.query().trim());

  isOpen = false;
  private selected = false;
  private typesOpenOnEscape = false;
  private typesBoxBound?: HTMLElement;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(SearchLauncherService)
      .requests$.pipe(takeUntilDestroyed())
      .subscribe(request => this.open(request));
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  open(request: SearchOpenRequest): void {
    if (this.isOpen) {
      // Segundo Ctrl+K com o modal aberto: só devolve o foco ao campo.
      this.focusInput();

      return;
    }

    this.isOpen = true;
    this.selected = false;
    const initial = request.query?.trim() ?? '';

    this.raw.set(initial);
    this.types.set([]);
    this.counts.set({});
    this.query.set(initial);
    void this.service.load();
    this.analytics.track({
      name: 'search_open',
      via: request.via,
      surface: 'modal',
      shortcutKey: request.shortcutKey
    });
    this.modal.open();
    // A abertura vem do teclado (fora do template): o OnPush precisa ser avisado.
    this.cdr.detectChanges();
    // O `po-modal` renderiza o conteúdo depois do open(): foca o campo no próximo ciclo.
    setTimeout(() => {
      if (initial && this.poSearch) {
        this.poSearch.poSearchInput.nativeElement.value = initial;
      }
      this.focusInput();
      this.cdr.detectChanges();
    });
  }

  onChange(value: string): void {
    const text = value ?? '';

    this.raw.set(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.query.set(text), SEARCH_DEBOUNCE_MS);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.results?.focusFirst();
    }
  }

  /** Esc com a lista de tipos aberta fecha só a lista; sem ela, fecha o modal. */

  /** Fase de captura: guarda se a lista estava aberta ANTES de o multiselect tratar o Esc. */
  private readonly onTypesKeydownCapture = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.typesOpenOnEscape = !!this.typesFilter?.dropdownOpen;
    }
  };

  /** O conteúdo do `po-modal` só existe depois do open(): liga o listener de captura quando o elemento aparece. */
  @ViewChild('typesBox') set typesBox(ref: ElementRef<HTMLElement> | undefined) {
    if (ref && ref.nativeElement !== this.typesBoxBound) {
      this.typesBoxBound = ref.nativeElement;
      ref.nativeElement.addEventListener('keydown', this.onTypesKeydownCapture, true);
    }
  }

  onTypesEscape(event: Event): void {
    if (this.typesOpenOnEscape) {
      event.stopPropagation(); // o po-modal escuta o mesmo Esc mais acima
    }
    this.typesOpenOnEscape = false;
  }

  focusInput(): void {
    this.poSearch?.poSearchInput?.nativeElement.focus();
  }

  async onSelect(result: SearchResult): Promise<void> {
    this.selected = true;
    this.modal.close();
    await this.navigation.navigate(result);
  }

  /** Fecha por Esc, X ou clique fora. */
  onClose(): void {
    const term = this.raw().trim();

    if (this.isOpen && !this.selected && term.length >= 2) {
      this.analytics.track({
        name: 'search_abandon',
        termLength: term.length,
        resultsCount: this.results?.resultsCount ?? 0,
        reason: 'esc'
      });
    }
    this.isOpen = false;
  }
}
