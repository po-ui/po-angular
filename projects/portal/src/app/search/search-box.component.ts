import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';

import { PoPopoverComponent, PoSearchComponent } from '@po-ui/ng-components';

import { SearchAnalyticsService } from './search-analytics.service';
import { SearchLauncherService } from './search-launcher.service';
import { SearchNavigationService } from './search-navigation.service';
import { SearchResultsComponent } from './search-results.component';
import { SearchResult } from './search.model';
import { shortcutLabel } from './search-shortcut';

export const SEARCH_DEBOUNCE_MS = 150;

/**
 * Campo de busca do header (à esquerda do botão Github) com popover de resultados.
 * Em telas pequenas vira um ícone que abre o modal.
 */
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SearchBoxComponent implements OnDestroy {
  private readonly navigation = inject(SearchNavigationService);
  private readonly analytics = inject(SearchAnalyticsService);
  private readonly launcher = inject(SearchLauncherService);

  @ViewChild('field', { static: true }) field!: ElementRef<HTMLElement>;
  @ViewChild('poSearch', { static: true }) poSearch!: PoSearchComponent;
  @ViewChild('popover', { static: true }) popover!: PoPopoverComponent;
  @ViewChild(SearchResultsComponent) results?: SearchResultsComponent;

  readonly hint = shortcutLabel();
  readonly listId = 'app-search-box-results';

  /** Consulta com debounce, enviada ao painel de resultados. */
  readonly query = signal('');
  readonly raw = signal('');
  readonly focused = signal(false);

  private popoverOpen = false;
  private timer?: ReturnType<typeof setTimeout>;
  private selected = false;

  readonly literals = { search: 'Buscar no portal' };

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  onChange(value: string): void {
    const text = value ?? '';

    this.raw.set(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.query.set(text), SEARCH_DEBOUNCE_MS);

    if (text.trim().length >= 2) {
      this.selected = false;
      this.open();
    } else {
      this.close();
    }
  }

  onFocus(): void {
    this.focused.set(true);
    this.analytics.track({ name: 'search_open', via: 'header', surface: 'popover' });

    if (this.raw().trim().length >= 2) {
      this.open();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && this.popoverOpen) {
      event.preventDefault();
      this.results?.focusFirst();
    } else if (event.key === 'Escape' && this.popoverOpen) {
      event.stopPropagation();
      this.close('esc');
    }
  }

  /** Esc com o foco em um item da lista. */
  onHostKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.popoverOpen) {
      this.close('esc');
      this.focusInput();
    }
  }

  /** O foco saiu do campo e do popover (Tab). */
  onFocusOut(event: FocusEvent, host: HTMLElement): void {
    const next = event.relatedTarget as Node | null;

    if (next && host.contains(next)) return;

    this.focused.set(false);
    if (next) {
      this.close('outside');
    }
  }

  focusInput(): void {
    this.poSearch.poSearchInput.nativeElement.focus();
  }

  openModal(): void {
    this.launcher.open({ via: 'icon_mobile' });
  }

  async onSelect(result: SearchResult): Promise<void> {
    this.selected = true;
    this.close();
    await this.navigation.navigate(result);
  }

  /** Clique fora: o popover fecha sozinho, aqui só registramos a desistência. */
  onPopoverClosed(): void {
    if (this.popoverOpen) {
      this.popoverOpen = false;
      this.trackAbandon('outside');
    }
  }

  private open(): void {
    if (this.popoverOpen) return;

    this.popoverOpen = true;
    this.popover.open();
  }

  private close(reason: 'esc' | 'outside' | null = null): void {
    if (!this.popoverOpen) return;

    this.popoverOpen = false;
    this.popover.close();
    if (reason) this.trackAbandon(reason);
  }

  private trackAbandon(reason: 'esc' | 'outside'): void {
    const term = this.raw().trim();

    if (!this.selected && term.length >= 2) {
      this.analytics.track({
        name: 'search_abandon',
        termLength: term.length,
        resultsCount: this.results?.resultsCount ?? 0,
        reason
      });
    }
  }
}
