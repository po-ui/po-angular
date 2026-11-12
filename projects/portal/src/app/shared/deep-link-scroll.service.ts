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

/** A página e a aba do alvo são lazy: tenta alinhar por até este tempo. */
const WAIT_TIMEOUT_MS = 8000;
const WAIT_STEP_MS = 100;
/** Alinhado e sem mexer por este tempo = layout estabilizado, pode parar. */
const STABLE_MS = 700;
/** Folga entre o topo da área de rolagem e o alvo. */
const TOP_GAP_PX = 16;
/** Diferença aceita (px) entre a posição atual e a ideal. */
const TOLERANCE_PX = 2;
/** Gestos do usuário que cancelam o alinhamento automático (ele assumiu o scroll). */
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'];

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

  /**
   * Alinha o alvo no topo da área de rolagem e CONTINUA alinhando até o layout estabilizar.
   *
   * Um único `scrollTop` não basta: ao vir de outra página o `id` já existe, mas a área de rolagem ainda não está
   * limitada em altura (nada a rolar) ou o conteúdo muda de altura depois (abas, realce de código). Por isso repete
   * a cada passo, corrige o desvio e só termina após `STABLE_MS` parado. Uma chamada nova cancela a anterior, e um
   * gesto do usuário (roda do mouse, toque, teclado) também.
   */
  scrollTo(fragment: string): void {
    const current = ++this.run;
    const started = Date.now();
    let stableSince = 0;
    let highlighted: HTMLElement | null = null;

    const stop = () => USER_SCROLL_EVENTS.forEach(name => this.doc.removeEventListener(name, cancel, true));
    const cancel = () => {
      this.run++;
      stop();
    };

    USER_SCROLL_EVENTS.forEach(name => this.doc.addEventListener(name, cancel, { capture: true, passive: true }));

    const attempt = () => {
      if (current !== this.run) return stop();

      const element = this.findElement(fragment);
      const scroller = element && this.nearestScroller(element);

      if (element && scroller) {
        const delta = element.getBoundingClientRect().top - scroller.getBoundingClientRect().top - TOP_GAP_PX;
        const before = scroller.scrollTop;

        if (Math.abs(delta) > TOLERANCE_PX) scroller.scrollTop += delta;

        // Moveu = ainda assentando; não moveu (alinhado, ou no limite da rolagem) = conta como estável.
        if (scroller.scrollTop !== before) {
          stableSince = 0;
        } else {
          stableSince ||= Date.now();
        }

        if (!highlighted) {
          highlighted = element;
          element.classList.add(HIGHLIGHT_CLASS);
          setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_MS);
        }
        if (stableSince && Date.now() - stableSince >= STABLE_MS) return stop();
      }

      if (Date.now() - started < WAIT_TIMEOUT_MS) {
        setTimeout(attempt, WAIT_STEP_MS);
      } else {
        stop();
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
