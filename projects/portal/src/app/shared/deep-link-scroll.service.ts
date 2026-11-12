import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const HIGHLIGHT_CLASS = 'search-target-highlight';
const HIGHLIGHT_MS = 2500;
/**
 * Prefixos dos ids por tipo de alvo (gerados por `docs/processors/helpers/anchors.js`; `sample-` vem do template de samples).
 * Links antigos sem prefixo (`#p-kind`) ainda abrem: se o id exato não existe, tenta com cada prefixo.
 */
export const ANCHOR_PREFIXES = ['prop-', 'event-', 'method-', 'interface-', 'enum-', 'class-'];

/** A página e a aba do alvo são lazy: espera o `id` aparecer por até este tempo. */
const WAIT_TIMEOUT_MS = 6000;
const WAIT_STEP_MS = 100;
/** Folga entre o topo da área de rolagem e o alvo. */
const TOP_GAP_PX = 16;

/**
 * Leva até o `id` do fragmento da URL (`...#p-kind`, `...#sample-po-button-labs`).
 *
 * Substitui o `anchorScrolling` do router: ele usa `scrollIntoView`, que rola TODOS os ancestrais, inclusive o
 * `.po-wrapper` (rolável por causa do header fixo). Isso empurrava o título do `po-page-default` para baixo do header.
 * Aqui rola só a área de rolagem mais próxima do alvo.
 */
@Injectable({ providedIn: 'root' })
export class DeepLinkScrollService {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private started = false;
  private run = 0;

  /** Passa a reagir a cada navegação com fragmento. Chamar uma vez, no AppComponent. */
  start(): void {
    if (this.started) return;
    this.started = true;

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      const fragment = this.router.parseUrl(this.router.url).fragment;

      if (fragment) this.scrollTo(fragment);
    });
  }

  /** Espera o elemento existir e estar visível; uma chamada nova cancela a anterior. */
  scrollTo(fragment: string): void {
    const current = ++this.run;
    const started = Date.now();

    const attempt = () => {
      if (current !== this.run) return;

      const element = this.findElement(fragment);

      if (element) {
        this.scrollNearest(element);
        element.classList.add(HIGHLIGHT_CLASS);
        setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_MS);
      } else if (Date.now() - started < WAIT_TIMEOUT_MS) {
        setTimeout(attempt, WAIT_STEP_MS);
      }
    };

    attempt();
  }

  private findElement(fragment: string): HTMLElement | null {
    const candidates = [fragment, ...ANCHOR_PREFIXES.map(prefix => `${prefix}${fragment}`)];

    for (const id of candidates) {
      const element = this.doc.getElementById(id);

      if (element?.getClientRects().length) return element;
    }

    return null;
  }

  private scrollNearest(element: HTMLElement): void {
    const scroller = this.nearestScroller(element);

    if (!scroller) return;

    const delta = element.getBoundingClientRect().top - scroller.getBoundingClientRect().top - TOP_GAP_PX;

    scroller.scrollTop += delta;
  }

  private nearestScroller(element: HTMLElement): HTMLElement | null {
    for (let node = element.parentElement; node && node !== this.doc.body; node = node.parentElement) {
      const overflow = getComputedStyle(node).overflowY;

      if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) {
        return node;
      }
    }

    return null;
  }
}
