import { Injectable } from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoUserGuideBaseService } from './po-user-guide-base.service';
import { PoUserGuideOptions, PoUserGuideStep, PoUserGuideStepChangeEvent } from './interfaces';

type DriverFactory = (config: any) => any;

/**
 * @docsExtends PoUserGuideBaseService
 *
 * @example
 *
 * <example name="po-user-guide-basic" title="PO User Guide Basic">
 *  <file name="sample-po-user-guide-basic/sample-po-user-guide-basic.component.html"> </file>
 *  <file name="sample-po-user-guide-basic/sample-po-user-guide-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-user-guide-labs" title="PO User Guide Labs">
 *  <file name="sample-po-user-guide-labs/sample-po-user-guide-labs.component.html"> </file>
 *  <file name="sample-po-user-guide-labs/sample-po-user-guide-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-user-guide-onboarding" title="PO User Guide - Onboarding">
 *  <file name="sample-po-user-guide-onboarding/sample-po-user-guide-onboarding.component.html"> </file>
 *  <file name="sample-po-user-guide-onboarding/sample-po-user-guide-onboarding.component.ts"> </file>
 * </example>
 */
@Injectable({
  providedIn: 'root'
})
export class PoUserGuideService extends PoUserGuideBaseService {
  private driverFactoryCache: DriverFactory | null = null;

  private driverInstance: any = null;

  private pendingEndReason: 'completed' | 'closed' | null = null;

  private static stylesInjected = false;

  constructor(languageService: PoLanguageService) {
    super(languageService);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  protected importDriver(): Promise<any> {
    return import('driver.js');
  }

  private async loadDriverFactory(): Promise<DriverFactory> {
    if (this.driverFactoryCache !== null) {
      return this.driverFactoryCache;
    }

    try {
      const mod = await this.importDriver();

      this.driverFactoryCache = mod.driver;
      return this.driverFactoryCache;
    } catch (error) {
      console.log(
        `PoUserGuideService: falha ao carregar driver.js - ${error instanceof Error ? error.message : String(error)}`
      );

      throw new Error(
        'PoUserGuideService: não foi possível carregar driver.js. Verifique se a dependência está instalada.'
      );
    }
  }

  private injectStyles(): void {
    if (!this.isBrowser()) {
      return;
    }

    if (PoUserGuideService.stylesInjected === true) {
      return;
    }

    const existingStyle = document.head.querySelector('style[data-po-user-guide-styles="true"]');
    if (existingStyle !== null) {
      PoUserGuideService.stylesInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.dataset['poUserGuideStyles'] = 'true';
    style.textContent = `.po-user-guide-popover { font-family: var(--font-family-theme, system-ui, -apple-system, sans-serif); }`;
    document.head.appendChild(style);

    PoUserGuideService.stylesInjected = true;
  }

  private mapStepsToDriveSteps(steps: Array<PoUserGuideStep>, options: PoUserGuideOptions): Array<any> {
    return steps.map((step, index) => {
      const popover: any = {
        title: step.title,
        description: step.content,
        side: step.position && step.position !== 'auto' ? step.position : undefined,
        align: step.align ?? undefined,
        nextBtnText: step.nextLabel ?? options.nextLabel,
        prevBtnText: step.previousLabel ?? options.previousLabel,
        doneBtnText: step.doneLabel ?? options.doneLabel,
        popoverClass: ['po-user-guide-popover', options.popoverClass].filter(Boolean).join(' '),
        showButtons: this.resolveShowButtons(step, options),
        onPopoverRender: (popoverDom: any) => this.handlePopoverRender(popoverDom, step, index, steps.length, options)
      };

      return {
        element: step.element,
        popover,
        onHighlightStarted:
          step.onBeforeHighlight !== undefined ? () => step.onBeforeHighlight(step, index) : undefined,
        onHighlighted: step.onHighlighted !== undefined ? () => step.onHighlighted(step, index) : undefined,
        onDeselected: step.onDeselected !== undefined ? () => step.onDeselected(step, index) : undefined
      };
    });
  }

  private handlePopoverRender(
    popoverDom: any,
    step: PoUserGuideStep,
    index: number,
    totalSteps: number,
    options: PoUserGuideOptions
  ): void {
    if (popoverDom !== null && popoverDom !== undefined && popoverDom.wrapper) {
      popoverDom.wrapper.setAttribute('role', 'dialog');

      const ariaLabel =
        typeof step.title === 'string' && step.title.length > 0 ? step.title : step.content.slice(0, 100);

      popoverDom.wrapper.setAttribute('aria-label', ariaLabel);

      this.applyPoButtonStyles(popoverDom);
      this.applyDoneButtonLabel(popoverDom, step, index, totalSteps, options);
      this.focusPopoverDescription(popoverDom);
    }
  }

  private focusPopoverDescription(popoverDom: any): void {
    const description = popoverDom.description as HTMLElement | undefined;

    if (!description) {
      return;
    }

    description.setAttribute('tabindex', '-1');

    window.requestAnimationFrame(() => {
      description.focus({ preventScroll: true });
    });
  }

  private applyDoneButtonLabel(
    popoverDom: any,
    step: PoUserGuideStep,
    index: number,
    totalSteps: number,
    options: PoUserGuideOptions
  ): void {
    const nextButton = popoverDom.nextButton as HTMLButtonElement | undefined;

    if (!nextButton || index !== totalSteps - 1) {
      return;
    }

    const doneLabel = step.doneLabel ?? options.doneLabel;

    if (doneLabel) {
      nextButton.textContent = doneLabel;
      nextButton.setAttribute('aria-label', doneLabel);
    }
  }

  private applyPoButtonStyles(popoverDom: any): void {
    const previousButton = popoverDom.previousButton as HTMLButtonElement | undefined;
    const nextButton = popoverDom.nextButton as HTMLButtonElement | undefined;
    const closeButton = popoverDom.closeButton as HTMLButtonElement | undefined;

    if (previousButton) {
      previousButton.classList.add('po-user-guide-button', 'po-user-guide-button-secondary');
      previousButton.setAttribute('type', 'button');
    }

    if (nextButton) {
      nextButton.classList.add('po-user-guide-button', 'po-user-guide-button-primary');
      nextButton.setAttribute('type', 'button');
    }

    if (closeButton) {
      closeButton.classList.add('po-user-guide-button-close');
      closeButton.setAttribute('type', 'button');
      closeButton.setAttribute('aria-label', this.literals.close);
    }
  }

  private buildDriverConfig(_startIndex: number): any {
    const opts = this.options;

    return {
      steps: this.mapStepsToDriveSteps(this.steps, opts),
      allowClose: opts.allowClose,
      showProgress: opts.showProgress,
      keyboardControl: opts.keyboardControl,
      overlayOpacity: opts.overlayOpacity,
      nextBtnText: opts.nextLabel,
      prevBtnText: opts.previousLabel,
      doneBtnText: opts.doneLabel,
      progressText: opts.progressTemplate,
      popoverClass: ['po-user-guide-popover', opts.popoverClass].filter(Boolean).join(' '),
      onHighlightStarted: (element: any, step: any, options: any) =>
        this.handleHighlightStarted(element, step, options),
      onDestroyed: () => this.handleDestroyed(),
      onCloseClick: () => this.handleCloseClick()
    };
  }

  private handleHighlightStarted(_element: any, _step: any, options: any): void {
    const newIndex = this.resolveActiveIndex(options);
    if (newIndex === null) {
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

    const event: PoUserGuideStepChangeEvent = {
      step: this.steps[newIndex],
      index: newIndex,
      direction,
      totalSteps: this.steps.length
    };

    if (typeof this.options.onStepChange === 'function') {
      this.options.onStepChange(event);
    }

    this._stepChange.next(event);
  }

  private resolveActiveIndex(options: any): number | null {
    const candidates: Array<unknown> = [];

    if (options !== null && options !== undefined && options.state !== null && options.state !== undefined) {
      candidates.push(options.state.activeIndex);
    }

    if (this.driverInstance !== null && typeof this.driverInstance.getActiveIndex === 'function') {
      try {
        candidates.push(this.driverInstance.getActiveIndex());
      } catch {
        // Em algumas versões do Driver.js, getActiveIndex pode lançar erro se chamado fora do contexto de um passo ativo.
        // catch evita falhas silenciosas do typescript;
      }
    }

    for (const candidate of candidates) {
      if (
        typeof candidate === 'number' &&
        Number.isInteger(candidate) &&
        candidate >= 0 &&
        candidate < this.steps.length
      ) {
        return candidate;
      }
    }

    return null;
  }

  private resolveShowButtons(step: PoUserGuideStep, options: PoUserGuideOptions): Array<string> | undefined {
    const showButtons = step.showButtons;

    if (options.allowClose === false && Array.isArray(showButtons)) {
      return showButtons.filter(button => button !== 'close');
    }

    if (options.allowClose === false) {
      return ['next', 'previous'];
    }

    return showButtons ?? undefined;
  }

  private handleDestroyed(): void {
    if (this.driverInstance === null && this.currentIndex === -1) {
      return;
    }

    const reason: 'completed' | 'closed' = this.pendingEndReason ?? 'closed';
    const lastIndex = this.currentIndex >= 0 ? this.currentIndex : 0;
    const totalSteps = this.steps.length;

    this.driverInstance = null;
    this.currentIndex = -1;
    this.pendingEndReason = null;

    this._tourEnd.next({ reason, lastIndex, totalSteps });
  }

  private handleCloseClick(): void {
    if (this.options.allowClose === false) {
      return;
    }

    this.pendingEndReason = 'closed';

    if (this.driverInstance !== null && typeof this.driverInstance.destroy === 'function') {
      this.driverInstance.destroy();
    }
  }

  /**
   * @description
   *
   * Configura a lista de passos que serão exibidos durante a execução do tour guiado.
   *
   * @param {Array<PoUserGuideStep>} steps Lista de passos do tour a ser configurada. Deve conter ao menos um
   * passo válido com a propriedade `content` definida.
   *
   * @returns {this} A própria instância do serviço, possibilitando o encadeamento fluente de chamadas.
   *
   * @throws {Error} Quando `steps` é `null`, `undefined`, não é um `Array`, está vazio, contém um passo
   * inválido, contém um passo sem a propriedade `content` definida ou contém um passo cujo `element` é
   * uma string com sintaxe de seletor CSS inválida.
   */
  setSteps(steps: Array<PoUserGuideStep>): this {
    this.validateSteps(steps);
    this.steps = [...steps];
    return this;
  }

  /**
   * @description
   *
   * Configura as opções globais que serão aplicadas durante a execução do tour guiado.
   *
   * @param {PoUserGuideOptions} [options] Objeto com as opções globais do tour a ser configurado. Quando
   * omitido ou `undefined`, apenas os valores padrão do PO UI são aplicados.
   *
   * @returns {this} A própria instância do serviço, possibilitando o encadeamento fluente de chamadas.
   */
  setOptions(options?: PoUserGuideOptions): this {
    this.options = this.resolveOptions(options);
    return this;
  }

  /**
   * @description
   *
   * Inicia a execução do tour previamente configurado por meio de `setSteps` e, opcionalmente, `setOptions`.
   *
   * @override
   *
   * @param {number} [startIndex=0] Índice, com base zero, do passo a partir do qual o tour deve iniciar.
   * Deve ser um inteiro contido no intervalo `[0, steps.length - 1]`.
   *
   * @throws {Error} Quando a lista de passos ainda não foi configurada via `setSteps` ou está vazia.
   * @throws {Error} Quando `startIndex` não é um número inteiro contido em `[0, steps.length - 1]`.
   *
   */
  override start(startIndex: number = 0): void {
    if (!this.isBrowser()) {
      // eslint-disable-next-line no-console
      console.warn('PoUserGuideService: start() está disponível apenas em ambiente de browser.');
      return;
    }

    if (this.steps === null || this.steps === undefined || this.steps.length === 0) {
      throw new Error('PoUserGuideService: a lista de passos não foi configurada. Chame setSteps() antes de start().');
    }

    if (
      typeof startIndex !== 'number' ||
      !Number.isInteger(startIndex) ||
      startIndex < 0 ||
      startIndex >= this.steps.length
    ) {
      throw new Error(
        `PoUserGuideService: startIndex (${startIndex}) está fora do intervalo [0, ${this.steps.length - 1}].`
      );
    }

    if (this.driverInstance !== null) {
      this.close();
    }

    if (this.options === null || this.options === undefined || Object.keys(this.options).length === 0) {
      this.options = this.resolveOptions();
    }

    this.injectStyles();

    this.loadDriverFactory()
      .then(factory => {
        const config = this.buildDriverConfig(startIndex);
        this.driverInstance = factory(config);
        this._tourStart.next({
          totalSteps: this.steps.length,
          startIndex,
          timestamp: Date.now()
        });
        this.driverInstance.drive(startIndex);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        throw error;
      });
  }

  /**
   * @description
   *
   * Encerra o tour em execução, disparando, em sequência, o ciclo de limpeza de estado e a emissão de
   * `tourEnd$`.
   *
   * @override
   */
  close(): void {
    if (this.driverInstance === null) {
      return;
    }

    this.pendingEndReason = 'closed';
    this.driverInstance.destroy();
  }

  /**
   * @description
   *
   * Encerra o tour em execução.
   *
   * @override
   */
  exit(): void {
    this.close();
  }

  /**
   * @description
   *
   * Avança o tour em execução para o próximo passo.
   *
   * @override
   */
  override next(): void {
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

  /**
   * @description
   *
   * Retrocede o tour em execução para o passo anterior.
   *
   * @override
   */
  override previous(): void {
    if (this.driverInstance === null || this.currentIndex <= 0) {
      return;
    }

    this.driverInstance.movePrevious();
  }

  /**
   * @description
   *
   * Move o tour diretamente para o passo identificado pelo `index` informado, que deve ser um número inteiro contido em `[0, steps.length - 1]`. Se o tour ainda não estiver em execução, o método inicia o tour a partir do passo indicado por `index`.
   *
   * @override
   *
   * @param {number} index Índice, com base zero, do passo de destino. Deve ser um inteiro contido
   * em `[0, steps.length - 1]`.
   *
   * @throws {Error} Quando `index` não é um número inteiro contido em `[0, steps.length - 1]`.
   */
  override goTo(index: number): void {
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= this.steps.length) {
      throw new Error(`PoUserGuideService: goTo(${index}) está fora do intervalo [0, ${this.steps.length - 1}].`);
    }
    if (this.driverInstance === null) {
      this.start(index);
      return;
    }
    this.driverInstance.moveTo(index);
  }

  /**
   * @description
   *
   * Indica se há um tour em execução no momento da consulta.
   *
   * @returns {boolean} `true` quando existe um tour em execução; `false` em qualquer outro caso (antes do primeiro `start()`,
   * após `close()`/`exit()` ou após o encerramento natural do tour).
   */
  isActive(): boolean {
    return this.driverInstance !== null && this.currentIndex >= 0;
  }

  /**
   * @description
   *
   * Retorna o `PoUserGuideStep` correspondente ao passo ativo no momento da consulta.
   *
   * @returns {PoUserGuideStep | null} O passo ativo, quando há um tour em execução; `null` em qualquer
   * outro caso.
   */
  getCurrentStep(): PoUserGuideStep | null {
    return this.isActive() ? this.steps[this.currentIndex] : null;
  }

  /**
   * @description
   *
   * Retorna o índice, com base zero, do passo ativo no momento da consulta.
   *
   * @returns {number} O índice, com base zero, do passo ativo, contido em `[0, steps.length - 1]`,
   * quando há um tour em execução; `-1` em qualquer outro caso.
   */
  getCurrentIndex(): number {
    return this.isActive() ? this.currentIndex : -1;
  }
}
