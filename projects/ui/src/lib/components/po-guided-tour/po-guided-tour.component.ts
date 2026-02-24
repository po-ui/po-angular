import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PoPopoverModule } from '../po-popover/po-popover.module';

export interface PoGuidedTourStep {
  id: string;
  element: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  blockInteraction?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export interface PoGuidedTourConfig {
  steps: PoGuidedTourStep[];
  title?: string;
  allowClose?: boolean;
  allowSkip?: boolean;
  storageKey?: string;
  zIndex?: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

@Component({
  selector: 'po-guided-tour',
    templateUrl: './po-guided-tour.component.html',
    styleUrls: ['./po-guided-tour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoGuidedTourComponent implements OnInit, OnDestroy {
  @ViewChild('popover') popover: any;

  private _steps: PoGuidedTourStep[] = [];
  private _allowClose = true;
  private _allowSkip = true;
  private _storageKey = 'po-guided-tour-completed';
  private _zIndex = 9999;

  currentStep = 0;
  isActive = false;
  highlightedElement: HTMLElement | null = null;
  overlay: HTMLElement | null = null;

  private destroy$ = new Subject<void>();

  @Input('p-steps') set steps(value: PoGuidedTourStep[]) {
    this._steps = value || [];
  }
  get steps(): PoGuidedTourStep[] {
    return this._steps;
  }

  @Input('p-allow-close') set allowClose(value: boolean) {
    this._allowClose = value !== false;
  }
  get allowClose(): boolean {
    return this._allowClose;
  }

  @Input('p-allow-skip') set allowSkip(value: boolean) {
    this._allowSkip = value !== false;
  }
  
  get allowSkip(): boolean {
    return this._allowSkip;
  }

  @Input('p-storage-key') set storageKey(value: string) {
    this._storageKey = value || 'po-guided-tour-completed';
  }
  get storageKey(): string {
    return this._storageKey;
  }

  @Input('p-z-index') set zIndex(value: number) {
    this._zIndex = value || 9999;
  }
  get zIndex(): number {
    return this._zIndex;
  }

  @Output('p-on-complete') onComplete = new EventEmitter<void>();
  @Output('p-on-cancel') onCancel = new EventEmitter<void>();
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

  start(): void {
    if (this.isAlreadyCompleted()) {
      return;
    }
    this.isActive = true;
    this.currentStep = 0;
    this.changeDetectorRef.markForCheck();
    this.goToStep(0);
  }

  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.complete();
    }
  }

  previous(): void {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

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

  complete(): void {
    this.saveToStorage();
    this.isActive = false;
    this.cleanup();
    this.onComplete.emit();
    this.changeDetectorRef.markForCheck();
  }

  cancel(): void {
    this.isActive = false;
    this.cleanup();
    this.onCancel.emit();
    this.changeDetectorRef.markForCheck();
  }

  skipTour(): void {
    this.complete();
  }

  getCurrentStep(): PoGuidedTourStep {
    return this.steps[this.currentStep];
  }

  isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

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
    this.scrollToElement(this.highlightedElement);
  }

  private createOverlay(): void {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = this.renderer.createElement('div');
    this.renderer.addClass(this.overlay, 'po-guided-tour-overlay');
    this.renderer.setStyle(this.overlay, 'z-index', this._zIndex.toString());
    this.renderer.appendChild(document.body, this.overlay);

    if (this.highlightedElement && this.overlay) {
      const rect = this.highlightedElement.getBoundingClientRect();
      const spotlightCircle = this.renderer.createElement('div');
      this.renderer.addClass(spotlightCircle, 'po-guided-tour-spotlight');
      this.renderer.setStyle(spotlightCircle, 'left', `${window.scrollX + rect.left}px`);
      this.renderer.setStyle(spotlightCircle, 'top', `${window.scrollY + rect.top}px`);
      this.renderer.setStyle(spotlightCircle, 'width', `${rect.width}px`);
      this.renderer.setStyle(spotlightCircle, 'height', `${rect.height}px`);
      this.renderer.appendChild(this.overlay, spotlightCircle);
    }
  }

  private scrollToElement(element: HTMLElement): void {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  private isAlreadyCompleted(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, 'true');
  }

  private loadStorageState(): void {
  }

  private cleanup(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.highlightedElement = null;
  }
}
