import { driver, Driver, DriveStep } from 'driver.js';
import DOMPurify from 'dompurify';

import {
  PoUserGuideEndEvent,
  PoUserGuideOptions,
  PoUserGuideStartEvent,
  PoUserGuideStep,
  PoUserGuideStepChangeEvent
} from './interfaces';

/**
 * Versão standalone (vanilla) do `PoUserGuide`, distribuída via CDN no pacote `@po-ui/user-guide`.
 *
 * A classe expõe uma API encadeável e mínima para criação de tours guiados, sem dependência de
 * Angular. Internamente usa `driver.js` (embutido no bundle) para a renderização do popover e
 * `DOMPurify` (também embutido) para sanitização de conteúdo HTML.
 *
 * @example
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.iife.js"></script>
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.css" />
 * <script>
 *   PoUserGuide.create()
 *     .setSteps([{ element: '#hello', title: 'Olá', content: 'Bem-vindo!' }])
 *     .start();
 * </script>
 * ```
 */
export class PoUserGuide {
  private static readonly STYLES_FLAG = 'data-po-user-guide-styles';

  private steps: Array<PoUserGuideStep> = [];
  private options: PoUserGuideOptions = {};
  private driverInstance: Driver | null = null;
  private currentIndex = -1;
  private pendingEndReason: 'completed' | 'closed' | null = null;

  /** Cria uma nova instância do `PoUserGuide`. */
  static create(): PoUserGuide {
    return new PoUserGuide();
  }

  /** Configura a lista de passos do tour. */
  setSteps(steps: Array<PoUserGuideStep>): this {
    this.validateSteps(steps);
    this.steps = [...steps];
    return this;
  }

  /** Configura as opções globais do tour. */
  setOptions(options?: PoUserGuideOptions): this {
    this.options = this.resolveOptions(options);
    return this;
  }

  /**
   * Inicia o tour a partir do passo informado em `startIndex` (padrão `0`).
   *
   * Se um tour já estiver em execução, ele é encerrado antes do novo iniciar.
   *
   * @throws Erro se a lista de passos não tiver sido configurada ou `startIndex` for inválido.
   */
  start(startIndex = 0): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (!Array.isArray(this.steps) || this.steps.length === 0) {
      throw new Error('PoUserGuide: a lista de passos não foi configurada. Chame setSteps() antes de start().');
    }

    if (
      typeof startIndex !== 'number' ||
      !Number.isInteger(startIndex) ||
      startIndex < 0 ||
      startIndex >= this.steps.length
    ) {
      throw new Error(`PoUserGuide: startIndex (${startIndex}) está fora do intervalo [0, ${this.steps.length - 1}].`);
    }

    if (this.driverInstance !== null) {
      this.close();
    }

    if (Object.keys(this.options).length === 0) {
      this.options = this.resolveOptions();
    }

    this.injectStyles();

    const config = this.buildDriverConfig();
    this.driverInstance = driver(config);

    if (typeof this.options.onTourStart === 'function') {
      const event: PoUserGuideStartEvent = {
        totalSteps: this.steps.length,
        startIndex,
        timestamp: Date.now()
      };
      this.options.onTourStart(event);
    }

    this.driverInstance.drive(startIndex);
  }

  /** Avança para o próximo passo. */
  next(): void {
    if (this.driverInstance === null) {
      return;
    }
    if (this.currentIndex === this.steps.length - 1) {
      this.pendingEndReason = 'completed';
      this.driverInstance.destroy();
      return;
    }
    this.driverInstance.moveNext();
  }

  /** Retrocede para o passo anterior. */
  previous(): void {
    if (this.driverInstance === null || this.currentIndex <= 0) {
      return;
    }
    this.driverInstance.movePrevious();
  }

  /** Move o tour para o passo identificado por `index`. */
  goTo(index: number): void {
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= this.steps.length) {
      throw new Error(`PoUserGuide: goTo(${index}) está fora do intervalo [0, ${this.steps.length - 1}].`);
    }
    if (this.driverInstance === null) {
      this.start(index);
      return;
    }
    this.driverInstance.moveTo(index);
  }

  /** Encerra o tour em execução. */
  close(): void {
    if (this.driverInstance === null) {
      return;
    }
    this.pendingEndReason = this.pendingEndReason ?? 'closed';
    this.driverInstance.destroy();
  }

  /** Indica se há um tour em execução. */
  isActive(): boolean {
    return this.driverInstance !== null && this.currentIndex >= 0;
  }

  /** Retorna o passo ativo, ou `null` se não houver tour em execução. */
  getCurrentStep(): PoUserGuideStep | null {
    return this.isActive() ? this.steps[this.currentIndex] : null;
  }

  /** Retorna o índice do passo ativo, ou `-1` se não houver tour em execução. */
  getCurrentIndex(): number {
    return this.isActive() ? this.currentIndex : -1;
  }

  // -------------------------------------------------------------------------
  // Internos
  // -------------------------------------------------------------------------

  private validateSteps(steps: Array<PoUserGuideStep>): void {
    if (steps === null || steps === undefined) {
      throw new Error('PoUserGuide: a lista de passos é obrigatória.');
    }
    if (!Array.isArray(steps)) {
      throw new Error('PoUserGuide: a lista de passos deve ser um array.');
    }
    if (steps.length === 0) {
      throw new Error('PoUserGuide: a lista de passos não pode ser vazia.');
    }

    const isBrowser = typeof document !== 'undefined';

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step === null || step === undefined || typeof step !== 'object') {
        throw new Error(`PoUserGuide: passo no índice ${i} é inválido.`);
      }
      if (step.content === null || step.content === undefined || step.content.trim() === '') {
        throw new Error(`PoUserGuide: o passo no índice ${i} precisa ter a propriedade 'content' definida.`);
      }
      if (typeof step.element === 'string' && isBrowser) {
        try {
          document.querySelector(step.element);
        } catch {
          throw new Error(`PoUserGuide: seletor CSS inválido no passo no índice ${i}: "${step.element}".`);
        }
      }
    }
  }

  private resolveOptions(options?: PoUserGuideOptions): PoUserGuideOptions {
    const defaults: PoUserGuideOptions = {
      allowClose: true,
      allowScroll: false,
      showProgress: true,
      keyboardControl: true,
      overlayOpacity: 0.7,
      nextLabel: 'Próximo',
      previousLabel: 'Anterior',
      doneLabel: 'Finalizar',
      closeLabel: 'Fechar',
      progressTemplate: '{{current}} de {{total}}'
    };

    const resolved: PoUserGuideOptions = { ...defaults, ...(options ?? {}) };

    if (typeof resolved.overlayOpacity !== 'number' || !Number.isFinite(resolved.overlayOpacity)) {
      resolved.overlayOpacity = defaults.overlayOpacity;
    } else {
      resolved.overlayOpacity = Math.min(1, Math.max(0, resolved.overlayOpacity));
    }

    return resolved;
  }

  private sanitize(value: string | undefined): string | undefined {
    if (typeof value !== 'string') {
      return value;
    }
    return DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });
  }

  private injectStyles(): void {
    if (typeof document === 'undefined') {
      return;
    }
    const existing = document.head.querySelector(`style[${PoUserGuide.STYLES_FLAG}="true"]`);
    if (existing !== null) {
      return;
    }
    const style = document.createElement('style');
    style.setAttribute(PoUserGuide.STYLES_FLAG, 'true');
    style.textContent = `.po-user-guide-popover { font-family: var(--font-family-theme, system-ui, -apple-system, sans-serif); }`;
    document.head.appendChild(style);
  }

  private buildDriverConfig(): any {
    const opts = this.options;

    return {
      steps: this.mapSteps(),
      allowClose: opts.allowClose,
      showProgress: opts.showProgress,
      allowKeyboardControl: opts.keyboardControl,
      overlayOpacity: opts.overlayOpacity,
      overlayColor: 'var(--color-po-user-guide-overlay, rgb(0, 0, 0))',
      nextBtnText: this.sanitize(opts.nextLabel),
      prevBtnText: this.sanitize(opts.previousLabel),
      doneBtnText: this.sanitize(opts.doneLabel),
      progressText: this.sanitize(opts.progressTemplate),
      popoverClass: ['po-user-guide-popover', opts.popoverClass].filter(Boolean).join(' '),
      stagePadding: 6,
      onHighlightStarted: (_el: Element | undefined, _step: DriveStep, ctx: any) => this.handleHighlight(ctx),
      onDestroyed: () => this.handleDestroyed(),
      onCloseClick: () => this.handleCloseClick()
    };
  }

  private mapSteps(): Array<DriveStep> {
    const opts = this.options;

    return this.steps.map((step, index) => ({
      element: step.element as any,
      popover: {
        title: this.sanitize(step.title),
        description: this.sanitize(step.content),
        side: step.position && step.position !== 'auto' ? step.position : undefined,
        align: step.align ?? undefined,
        nextBtnText: this.sanitize(step.nextLabel ?? opts.nextLabel),
        prevBtnText: this.sanitize(step.previousLabel ?? opts.previousLabel),
        doneBtnText: this.sanitize(step.doneLabel ?? opts.doneLabel),
        popoverClass: ['po-user-guide-popover', opts.popoverClass].filter(Boolean).join(' '),
        showButtons: this.resolveShowButtons(step) as any,
        onPopoverRender: (popoverDom: any) => this.renderPopover(popoverDom, step, index)
      }
    }));
  }

  private resolveShowButtons(step: PoUserGuideStep): Array<string> | undefined {
    const showButtons = step.showButtons;
    if (this.options.allowClose === false && Array.isArray(showButtons)) {
      return showButtons.filter(button => button !== 'close');
    }
    if (this.options.allowClose === false) {
      return ['next', 'previous'];
    }
    return showButtons;
  }

  private renderPopover(popoverDom: any, step: PoUserGuideStep, index: number): void {
    if (!popoverDom?.wrapper) {
      return;
    }

    popoverDom.wrapper.setAttribute('role', 'dialog');
    const ariaLabel = typeof step.title === 'string' && step.title.length > 0 ? step.title : step.content.slice(0, 100);
    popoverDom.wrapper.setAttribute('aria-label', ariaLabel);

    const totalSteps = this.steps.length;
    const isLast = index === totalSteps - 1;

    const previousButton = popoverDom.previousButton as HTMLButtonElement | undefined;
    const nextButton = popoverDom.nextButton as HTMLButtonElement | undefined;
    const closeButton = popoverDom.closeButton as HTMLButtonElement | undefined;

    if (previousButton) {
      previousButton.classList.add('po-user-guide-button', 'po-user-guide-button-tertiary');
      previousButton.setAttribute('type', 'button');
    }

    if (nextButton) {
      nextButton.classList.add('po-user-guide-button', 'po-user-guide-button-primary');
      nextButton.setAttribute('type', 'button');

      if (isLast) {
        const doneLabel = step.doneLabel ?? this.options.doneLabel;
        if (typeof doneLabel === 'string' && doneLabel.length > 0) {
          nextButton.textContent = doneLabel;
          nextButton.setAttribute('aria-label', doneLabel);
        }
      }
    }

    if (closeButton) {
      closeButton.classList.add('po-user-guide-button-close');
      closeButton.setAttribute('type', 'button');
      const closeLabel = this.options.closeLabel ?? 'Fechar';
      closeButton.setAttribute('aria-label', closeLabel);
    }
  }

  private handleHighlight(ctx: any): void {
    let newIndex: number | null = null;

    if (ctx?.state && typeof ctx.state.activeIndex === 'number') {
      newIndex = ctx.state.activeIndex;
    } else if (this.driverInstance && typeof this.driverInstance.getActiveIndex === 'function') {
      try {
        const idx = this.driverInstance.getActiveIndex();
        if (typeof idx === 'number') {
          newIndex = idx;
        }
      } catch {
        /* ignore */
      }
    }

    if (newIndex === null || newIndex < 0 || newIndex >= this.steps.length) {
      return;
    }

    const previousIndex = this.currentIndex;
    let direction: PoUserGuideStepChangeEvent['direction'];
    if (previousIndex === -1) {
      direction = 'start';
    } else if (newIndex === previousIndex + 1) {
      direction = 'next';
    } else if (newIndex === previousIndex - 1) {
      direction = 'previous';
    } else {
      direction = 'goto';
    }

    this.currentIndex = newIndex;

    if (typeof this.options.onStepChange === 'function') {
      const event: PoUserGuideStepChangeEvent = {
        step: this.steps[newIndex],
        index: newIndex,
        direction,
        totalSteps: this.steps.length
      };
      this.options.onStepChange(event);
    }
  }

  private handleDestroyed(): void {
    if (this.driverInstance === null && this.currentIndex === -1) {
      return;
    }

    const reason = this.pendingEndReason ?? 'closed';
    const lastIndex = this.currentIndex >= 0 ? this.currentIndex : 0;
    const totalSteps = this.steps.length;

    this.driverInstance = null;
    this.currentIndex = -1;
    this.pendingEndReason = null;

    if (typeof this.options.onTourEnd === 'function') {
      const event: PoUserGuideEndEvent = { reason, lastIndex, totalSteps };
      this.options.onTourEnd(event);
    }
  }

  private handleCloseClick(): void {
    if (this.options.allowClose === false) {
      return;
    }
    this.pendingEndReason = 'closed';
    if (this.driverInstance !== null) {
      this.driverInstance.destroy();
    }
  }
}
