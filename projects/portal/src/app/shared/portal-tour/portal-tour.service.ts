import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, InjectionToken, NgZone, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

import { PoUserGuideEndEvent, PoUserGuideLiterals, PoUserGuideService, PoUserGuideStep } from '@po-ui/ng-components';

import {
  ComponentMode,
  PORTAL_TOURS,
  PortalTour,
  PortalTourStep,
  firstVisible,
  isVisible,
  pageTourFor
} from './portal-tour.steps';

/**
 * Liga a abertura automática dos tours. Desligada em navegador automatizado (e2e, Playwright:
 * `navigator.webdriver`); os specs também fornecem `false`.
 */
export const PORTAL_TOUR_AUTO_START = new InjectionToken<boolean>('PORTAL_TOUR_AUTO_START', {
  providedIn: 'root',
  factory: () => typeof navigator === 'undefined' || !navigator.webdriver
});

/** Chave do "já visto" no localStorage, com a versão do tour. */
/** Mesmo prefixo das outras chaves do portal (ex.: `@po-ui/portal/documentation-list-view-mode`). */
const PORTAL_STORAGE_PREFIX = '@po-ui/portal/';

/** Ex.: `@po-ui/portal/tour-portal-v22.0.0`. */
export const tourSeenKey = (tour: PortalTour): string => `${PORTAL_STORAGE_PREFIX}tour-${tour.id}-v${tour.version}`;

/** Quanto tempo esperar os alvos obrigatórios (conteúdo assíncrono: listagem, páginas geradas, menu). */
export const READY_TIMEOUT_MS = 10000;
const READY_POLL_MS = 250;

/** Textos dos botões do tour. */
export const TOUR_LITERALS: PoUserGuideLiterals = {
  next: 'Próximo',
  previous: 'Anterior',
  done: 'Concluir',
  close: 'Fechar',
  progressTemplate: '{{current}} de {{total}}'
};

/**
 * Tour visto até o fim. Clicar em "Concluir" no último passo encerra pelo driver e o `PoUserGuideService`
 * emite `reason: 'closed'` (só `next()` do serviço marca 'completed'); por isso chegar ao último passo também conta.
 */
export const tourCompleted = (end: PoUserGuideEndEvent): boolean =>
  end.reason === 'completed' || end.lastIndex === end.totalSteps - 1;

/**
 * Tours do portal com o `PoUserGuideService`.
 *
 * - Na 1ª visita, abre sozinho uma vez por versão: primeiro o do portal (header). Se ele for concluído,
 *   o da página entra em seguida; se for fechado, o da página fica para a próxima visita a ela.
 * - Fechar (Esc ou X) conta como visto: o "visto" é gravado quando o tour abre.
 * - Os passos dependem só da página e da largura (`media`): o tour espera cada alvo obrigatório
 *   aparecer; passo `optional` só entra se o alvo existe (ex.: modo da página). Sem passo, não abre.
 * - Link com `#âncora` não abre tour sozinho: a pessoa veio para um ponto exato da página.
 * - Página do componente: um "visto" por modo (`component-web`, `component-doc`). Os passos comuns só entram
 *   no 1º modo visto; trocar de modo (navegação com `?view=`) abre o tour do novo modo uma vez.
 * - "Fazer tour" (ação do header) reabre o tour completo da página atual, ou o do portal.
 */
@Injectable({ providedIn: 'root' })
export class PortalTourService {
  private readonly guide = inject(PoUserGuideService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly autoStart = inject(PORTAL_TOUR_AUTO_START);
  private readonly destroyRef = inject(DestroyRef);

  /** Cancela a espera do alvo quando a pessoa navega antes do tour abrir. */
  private waitId = 0;
  private started = false;

  /** Começa a ouvir a navegação. Chamar uma vez (AppComponent). */
  start(): void {
    if (this.started) return;
    this.started = true;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => this.onNavigation(event.urlAfterRedirects));

    // a 1ª navegação pode ter terminado antes de o AppComponent chamar start()
    if (this.router.navigated) this.onNavigation(this.router.url);
  }

  /** "Fazer tour": tour completo da página atual (no componente, comuns + os do modo atual); sem tour, o do portal. */
  startForCurrentPage(): Promise<boolean> {
    const tour = pageTourFor(this.router.url) ?? PORTAL_TOURS.portal;

    return this.open(tour, undefined, { full: true });
  }

  /** Modo da página do componente que está na tela agora (`data-tour-mode` visível), ou `null`. */
  currentMode(): ComponentMode | null {
    return (firstVisible(this.doc, '[data-tour-mode]')?.dataset['tourMode'] as ComponentMode) ?? null;
  }

  /**
   * Tour do componente para um modo: os passos daquele modo e, se `withCommon`, os comuns aos dois.
   * O id (`component-web` / `component-doc`) dá a chave do "visto" daquele modo.
   */
  componentTour(mode: ComponentMode, withCommon: boolean): PortalTour {
    const tour = PORTAL_TOURS.component;

    return {
      ...tour,
      id: `component-${mode}`,
      steps: tour.steps.filter(step => (step.mode ? step.mode === mode : withCommon))
    };
  }

  /** Passos do tour nesta largura (`media`), na ordem do tour. Não depende do que já renderizou. */
  plannedSteps(tour: PortalTour): Array<PortalTourStep> {
    const view = this.doc.defaultView;

    return tour.steps.filter(step => !step.media || !!view?.matchMedia?.(step.media).matches);
  }

  /**
   * Passos prontos para o `PoUserGuideService`: os obrigatórios com o alvo resolvido, os opcionais só se o alvo
   * existe, os sem alvo no centro. `null` enquanto falta um alvo obrigatório.
   */
  resolveSteps(tour: PortalTour): Array<PoUserGuideStep> | null {
    const steps: Array<PoUserGuideStep> = [];

    for (const step of this.plannedSteps(tour)) {
      const element = this.resolve(step.target);

      if (step.target !== undefined && !element) {
        if (step.optional) continue;

        return null;
      }

      steps.push({
        element: element ?? undefined,
        title: step.title,
        content: step.content,
        position: step.position,
        onBeforeHighlight: step.beforeHighlight ? () => step.beforeHighlight(this.doc) : undefined
      });
    }

    return steps;
  }

  hasSeen(tour: PortalTour): boolean {
    try {
      return this.doc.defaultView?.localStorage.getItem(tourSeenKey(tour)) === '1';
    } catch {
      return true; // sem localStorage (modo privado/bloqueado): não insiste em abrir
    }
  }

  private markSeen(tour: PortalTour): void {
    try {
      this.doc.defaultView?.localStorage.setItem(tourSeenKey(tour), '1');
    } catch {
      // ignora: sem storage o tour só não fica marcado
    }
  }

  private onNavigation(url: string): void {
    const id = ++this.waitId;

    if (!this.autoStart || url.includes('#') || this.guide.isActive()) return;

    const page = pageTourFor(url);
    const portal = PORTAL_TOURS.portal;

    if (!this.hasSeen(portal)) {
      void this.open(portal, id).then(opened => {
        if (!opened || !page) return;

        this.guide.tourEnd$
          .pipe(take(1))
          .subscribe(end => tourCompleted(end) && id === this.waitId && void this.open(page, id, { unseenOnly: true }));
      });
    } else if (page) {
      // a troca de modo do componente (?view=web|doc) também chega aqui: cada modo tem o seu "visto"
      void this.open(page, id, { unseenOnly: true });
    }
  }

  /**
   * Espera os alvos obrigatórios e abre. `false` quando não abriu (navegou, já visto, sem passos, outro tour aberto).
   * - `unseenOnly`: abertura automática, só se ainda não foi visto (no componente, o modo atual);
   * - `full`: "Fazer tour", com os passos comuns mesmo que o outro modo já tenha sido visto.
   */
  private async open(
    tour: PortalTour,
    waitId?: number,
    { unseenOnly = false, full = false }: { unseenOnly?: boolean; full?: boolean } = {}
  ): Promise<boolean> {
    if (tour.id === 'component') {
      const mode = await this.whenMode(waitId);

      if (!mode) return false;

      const other: ComponentMode = mode === 'web' ? 'doc' : 'web';

      tour = this.componentTour(mode, full || !this.hasSeen(this.componentTour(other, false)));
    }

    if (unseenOnly && this.hasSeen(tour)) return false;
    if (!this.plannedSteps(tour).some(step => step.target !== undefined)) return false;

    const steps = await this.whenReady(tour, waitId);

    // modo sem nenhum passo visível (ex.: documentação sem subcomponentes): não abre e não grava o visto
    if (!steps?.some(step => step.element)) return false;
    if (this.guide.isActive() || (waitId !== undefined && waitId !== this.waitId)) return false;

    this.markSeen(tour);
    this.guide.setSteps(steps).setOptions({
      showProgress: true,
      allowClose: true,
      keyboardControl: true,
      // não trava a rolagem da página
      allowScroll: true,
      // o portal é em português, qualquer que seja o idioma do navegador
      literals: TOUR_LITERALS
    });
    await this.guide.start();

    return true;
  }

  /**
   * Espera o modo da página do componente aparecer na tela. Se a URL pede um modo (`?view=`), espera ele:
   * logo depois da navegação o modo anterior ainda está visível. Sem `view`, ou se o modo pedido não existe
   * na página (componente sem exemplos e `view=web`), vale o que está na tela (o padrão do gerador).
   */
  private whenMode(waitId?: number): Promise<ComponentMode | null> {
    const deadline = Date.now() + READY_TIMEOUT_MS;
    const view = this.router.parseUrl(this.router.url).queryParams['view'];
    const wanted = view === 'web' || view === 'doc' ? (view as ComponentMode) : null;

    return new Promise(resolve =>
      this.zone.runOutsideAngular(() => {
        const check = () => {
          if (waitId !== undefined && waitId !== this.waitId) return resolve(null);

          const mode = this.currentMode();
          const wantedExists = !!wanted && !!this.doc.querySelector(`[data-tour-mode="${wanted}"]`);

          if (mode && (!wantedExists || mode === wanted)) return this.zone.run(() => resolve(mode));
          if (Date.now() > deadline) return resolve(null);
          setTimeout(check, READY_POLL_MS);
        };

        check();
      })
    );
  }

  /**
   * Espera todos os alvos obrigatórios do tour ficarem visíveis (sem travar a página: setTimeout fora do Angular).
   * Passou do tempo: não abre, para nunca mostrar um tour pela metade.
   */
  private whenReady(tour: PortalTour, waitId?: number): Promise<Array<PoUserGuideStep> | null> {
    const deadline = Date.now() + READY_TIMEOUT_MS;

    return new Promise(resolve =>
      this.zone.runOutsideAngular(() => {
        const check = () => {
          if (waitId !== undefined && waitId !== this.waitId) return resolve(null);

          const steps = this.resolveSteps(tour);

          if (steps) return this.zone.run(() => resolve(steps));
          if (Date.now() > deadline) return resolve(null);
          setTimeout(check, READY_POLL_MS);
        };

        check();
      })
    );
  }

  private resolve(target: PortalTourStep['target']): HTMLElement | null {
    if (target === undefined) return null;

    const element = typeof target === 'string' ? firstVisible(this.doc, target) : target(this.doc);

    return isVisible(element) ? element : null;
  }
}
