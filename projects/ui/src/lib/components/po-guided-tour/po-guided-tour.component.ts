import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PoPopoverComponent } from '../po-popover';

/**
 * Interface para definir os passos do tour guiado
 */
export interface PoGuidedTourStep {
  /** Identificador único do passo */
  id: string;
  /** Seletor CSS do elemento a destacar */
  element: string;
  /** Título do passo */
  title: string;
  /** Descrição ou conteúdo do passo */
  description: string;
  /** Posição do popover em relação ao elemento */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Se deve bloquear interações com outros elementos */
  blockInteraction?: boolean;
  /** Callback executado ao entrar no passo */
  onEnter?: () => void;
  /** Callback executado ao sair do passo */
  onLeave?: () => void;
}

/**
 * Interface para configuração do tour
 */
export interface PoGuidedTourConfig {
  /** Lista de passos do tour */
  steps: PoGuidedTourStep[];
  /** Título geral do tour */
  title?: string;
  /** Permitir fechar o tour */
  allowClose?: boolean;
  /** Marcar como "não mostrar novamente" */
  allowSkip?: boolean;
  /** Chave de localStorage para armazenar status de conclusão */
  storageKey?: string;
  /** Z-index do overlay */
  zIndex?: number;
  /** Callback quando o tour termina */
  onComplete?: () => void;
  /** Callback quando o tour é cancelado */
  onCancel?: () => void;
}

/**
 * Componente po-guided-tour
 *
 * Componente que oferece um tour interativo guiado pela aplicação,
 * com destaque de elementos, popover explicativo e controles de navegação.
 *
 * **Recursos:**
 * - Destaca elementos da página com foco escurecido
 * - Exibe popover com explicações
 * - Permite navegação entre passos (próximo, anterior)
 * - Bloqueia interações quando necessário
 * - Persiste estado de "não mostrar novamente" em localStorage
 * - Totalmente responsivo e acessível
 *
 * **Não faz:** Não gerencia automaticamente a ordem dos passos ou padrões de UI complexos.
 * Utilize componentes específicos como `po-modal` para essas necessidades.
 *
 * ```typescript
 * import { PoGuidedTourComponent, PoGuidedTourStep } from '@po-ui/ng-components';
 *
 * export class AppComponent {
 *   tourSteps: PoGuidedTourStep[] = [
 *     {
 *       id: 'step-1',
 *       element: '.welcome-btn',
 *       title: 'Welcome',
 *       description: 'Click here to get started',
 *       position: 'bottom',
 *       blockInteraction: false
 *     }
 *   ];
 *
 *   startTour() {
 *     this.guidedTour.start(this.tourSteps);
 *   }
 * }
 * ```
 *
 * @example
 *
 * **PO Guided Tour - Básico**
 *
 * ```html
 * <po-guided-tour
 *   [p-steps]="tourSteps"
 *   [p-allow-close]="true"
 *   (p-on-complete)="onTourComplete()"
 * ></po-guided-tour>
 * ```
 */
@Component({
  selector: 'po-guided-tour',
  templateUrl: './po-guided-tour.component.html',
  styleUrls: ['./po-guided-tour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoGuidedTourComponent implements OnInit, OnDestroy {

  @ViewChild(PoPopoverComponent) popover: PoPopoverComponent;

  private _steps: PoGuidedTourStep[] = [];
  private _allowClose = true;
  private _allowSkip = true;
  private _storageKey = 'po-guided-tour-completed';
  private _zIndex = 9999;

  currentStep = 0;
  isActive = false;
  highlightedElement: HTMLElement;
  overlay: HTMLElement;

  private destroy$ = new Subject<void>();

  /**
   * Lista de passos do tour guiado
   * @default []
   */
  @Input('p-steps')
  set steps(value: PoGuidedTourStep[]) {
    this._steps = value;
  }
  get steps(): PoGuidedTourStep[] {
    return this._steps;
  }

  /**
   * Permite fechar o tour
   * @default true
   */
  @Input('p-allow-close')
  set allowClose(value: boolean) {
    this._allowClose = value;
  }
  get allowClose(): boolean {
    return this._allowClose;
  }

  /**
   * Permite marcar como "não mostrar novamente"
   * @default true
   */
  @Input('p-allow-skip')
  set allowSkip(value: boolean) {
    this._allowSkip = value;
  }
  get allowSkip(): boolean {
    return this._allowSkip;
  }

  /**
   * Chave de localStorage para armazenar status
   * @default 'po-guided-tour-completed'
   */
  @Input('p-storage-key')
  set storageKey(value: string) {
    this._storageKey = value || 'po-guided-tour-completed';
  }
  get storageKey(): string {
    return this._storageKey;
  }

  /**
   * Z-index do overlay
   * @default 9999
   */
  @Input('p-z-index')
  set zIndex(value: number) {
    this._zIndex = value || 9999;
  }
  get zIndex(): number {
    return this._zIndex;
  }

  /** Emitido quando o tour é completado */
  @Output('p-on-complete') onComplete = new EventEmitter<void>();

  /** Emitido quando o tour é cancelado */
  @Output('p-on-cancel') onCancel = new EventEmitter<void>();

  /** Emitido ao mudar de passo */
  @Output('p-on-step-change') onStepChange = new EventEmitter<number>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadStorageState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  /**
   * Inicia o tour guiado
   */
  start(): void {
    if (this.isAlreadyCompleted()) {
      return;
    }

    this.isActive = true;
    this.currentStep = 0;
    this.changeDetectorRef.markForCheck();
    this.goToStep(0);
  }

  /**
   * Vai para o próximo passo
   */
  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.complete();
    }
  }

  /**
   * Volta para o passo anterior
   */
  previous(): void {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  /**
   * Vai para um passo específico
   */
  goToStep(stepIndex: number): void {
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      return;
    }

    const previousStep = this.steps[this.currentStep];
    if (previousStep && previousStep.onLeave) {
      previousStep.onLeave();
    }

    this.currentStep = stepIndex;
    const step = this.steps[stepIndex];

    if (step.onEnter) {
      step.onEnter();
    }

    this.highlightElement(step.element);
    this.onStepChange.emit(stepIndex);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Completa o tour
   */
  complete(): void {
    this.saveToStorage();
    this.isActive = false;
    this.cleanup();
    this.onComplete.emit();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Cancela o tour sem marcar como completo
   */
  cancel(): void {
    this.isActive = false;
    this.cleanup();
    this.onCancel.emit();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Marca como "não mostrar novamente"
   */
  skipTour(): void {
    this.complete();
  }

  /**
   * Obtém o passo atual
   */
  getCurrentStep(): PoGuidedTourStep {
    return this.steps[this.currentStep];
  }

  /**
   * Verifica se é o primeiro passo
   */
  isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  /**
   * Verifica se é o último passo
   */
  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  /**
   * Obtém progresso do tour
   */
  getProgress(): number {
    return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
  }

  private highlightElement(selector: string): void {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`[PoGuidedTour] Elemento não encontrado: ${selector}`);
      return;
    }

    this.highlightedElement = element as HTMLElement;
    this.createOverlay();
    this.scrollToElement(element);
  }

  private createOverlay(): void {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = this.renderer.createElement('div');
    this.renderer.addClass(this.overlay, 'po-guided-tour-overlay');
    this.renderer.setStyle(this.overlay, 'z-index', this._zIndex.toString());
    this.renderer.appendChild(document.body, this.overlay);

    const rect = this.highlightedElement.getBoundingClientRect();
    const spotlightCircle = this.renderer.createElement('div');
    this.renderer.addClass(spotlightCircle, 'po-guided-tour-spotlight');
    this.renderer.setStyle(spotlightCircle, 'left', `${window.scrollX + rect.left}px`);
    this.renderer.setStyle(spotlightCircle, 'top', `${window.scrollY + rect.top}px`);
    this.renderer.setStyle(spotlightCircle, 'width', `${rect.width}px`);
    this.renderer.setStyle(spotlightCircle, 'height', `${rect.height}px`);
    this.renderer.appendChild(this.overlay, spotlightCircle);
  }

  private scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  private isAlreadyCompleted(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, 'true');
  }

  private loadStorageState(): void {
    // Carrega qualquer estado necessário do localStorage
  }

  private cleanup(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.highlightedElement = null;
  }
}
