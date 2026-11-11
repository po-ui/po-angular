import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResult } from './search.model';

const HIGHLIGHT_CLASS = 'search-target-highlight';
const SCROLL_TIMEOUT_MS = 3000;
const SCROLL_STEP_MS = 100;

/** Abre a página do resultado e leva até o `id` (a aba/conteúdo da página pode aparecer depois da rota). */
@Injectable({ providedIn: 'root' })
export class SearchNavigationService {
  private readonly router = inject(Router);

  async navigate(result: Pick<SearchResult, 'url' | 'fragment'>): Promise<boolean> {
    const tree = this.router.parseUrl(result.url);

    tree.fragment = result.fragment ?? null;

    const done = await this.router.navigateByUrl(tree);

    if (result.fragment) {
      this.scrollToFragment(result.fragment);
    }

    return done;
  }

  /** Espera o elemento existir e estar visível (o `anchorScrolling` do router roda antes do conteúdo lazy). */
  scrollToFragment(fragment: string, doc: Document = document): void {
    const started = Date.now();

    const attempt = () => {
      const element = doc.getElementById(fragment);

      if (element?.getClientRects().length) {
        element.scrollIntoView({ block: 'start' });
        element.classList.add(HIGHLIGHT_CLASS);
        setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), 2500);
      } else if (Date.now() - started < SCROLL_TIMEOUT_MS) {
        setTimeout(attempt, SCROLL_STEP_MS);
      }
    };

    attempt();
  }
}
