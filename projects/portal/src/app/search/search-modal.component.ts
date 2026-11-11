import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PoModalComponent, PoSearchComponent } from '@po-ui/ng-components';

import { SearchAnalyticsService } from './search-analytics.service';
import { SearchLauncherService, SearchOpenRequest } from './search-launcher.service';
import { SearchNavigationService } from './search-navigation.service';
import { SearchResultsComponent } from './search-results.component';
import { SearchResult } from './search.model';
import { shortcutLabel } from './search-shortcut';

const DEBOUNCE_MS = 150;

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

  @ViewChild('modal', { static: true }) modal!: PoModalComponent;
  @ViewChild('poSearch') poSearch?: PoSearchComponent;
  @ViewChild(SearchResultsComponent) results?: SearchResultsComponent;
  @ViewChild('body') body?: ElementRef<HTMLElement>;

  readonly hint = shortcutLabel();
  readonly listId = 'app-search-modal-results';
  readonly literals = { search: 'Buscar no portal' };
  readonly query = signal('');
  readonly raw = signal('');

  isOpen = false;
  private selected = false;
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
    this.raw.set('');
    this.query.set('');
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
    setTimeout(() => this.focusInput());
  }

  onChange(value: string): void {
    const text = value ?? '';

    this.raw.set(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.query.set(text), DEBOUNCE_MS);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.results?.focusFirst();
    }
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
