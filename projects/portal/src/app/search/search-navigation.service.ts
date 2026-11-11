import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { DeepLinkScrollService } from '../shared/deep-link-scroll.service';
import { SearchResult } from './search.model';

/** Abre a página do resultado; o `DeepLinkScrollService` leva até o `id` quando a navegação termina. */
@Injectable({ providedIn: 'root' })
export class SearchNavigationService {
  private readonly router = inject(Router);
  private readonly deepLink = inject(DeepLinkScrollService);

  async navigate(result: Pick<SearchResult, 'url' | 'fragment'>): Promise<boolean> {
    const tree = this.router.parseUrl(result.url);

    tree.fragment = result.fragment ?? null;

    // Mesma URL: o router ignora a navegação, então rola daqui.
    if (this.router.serializeUrl(tree) === this.router.url) {
      if (result.fragment) this.deepLink.scrollTo(result.fragment);

      return true;
    }

    return this.router.navigateByUrl(tree);
  }
}
