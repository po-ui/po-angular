import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { isTypeof } from '../../utils/util';
import { PoProgressStatus } from './enums/po-progress-status.enum';
import { poProgressLiterals } from './literals/po-progress.literals';
import { PoProgressBaseComponent } from './po-progress-base.component';

/**
 * @docsExtends PoProgressBaseComponent
 *
 * @example
 * <example name="po-progress-basic" title="PO Progress Basic">
 *   <file name="sample-po-progress-basic/sample-po-progress-basic.component.html"> </file>
 *   <file name="sample-po-progress-basic/sample-po-progress-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-progress-labs" title="PO Progress Labs">
 *   <file name="sample-po-progress-labs/sample-po-progress-labs.component.html"> </file>
 *   <file name="sample-po-progress-labs/sample-po-progress-labs.component.ts"> </file>
 *   <file name="sample-po-progress-labs/sample-po-progress-labs.component.css"> </file>
 * </example>
 *
 * <example name="po-progress-publication" title="PO Progress - Publication">
 *   <file name="sample-po-progress-publication/sample-po-progress-publication.component.html"> </file>
 *   <file name="sample-po-progress-publication/sample-po-progress-publication.component.ts"> </file>
 * </example>
 *
 * <example name="po-progress-circle" title="PO Progress Circle">
 *   <file name="sample-po-progress-circle/sample-po-progress-circle.component.html"> </file>
 *   <file name="sample-po-progress-circle/sample-po-progress-circle.component.ts"> </file>
 *  <file name="sample-po-progress-circle/sample-po-progress-circle.component.css"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-progress',
  templateUrl: './po-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoProgressComponent extends PoProgressBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  language;
  literals;
  private readonly elementRef = inject(ElementRef);
  private resizeObserver?: ResizeObserver;
  private observeTarget: HTMLElement | null = null;

  get isAllowCancel(): boolean {
    return !!this.cancel.observers.length && this.status !== PoProgressStatus.Success;
  }

  get isAllowInfoError(): boolean {
    return !!(!this.infoIcon && this.info && this.status === PoProgressStatus.Error);
  }

  get isAllowRetry(): boolean {
    return !!this.retry.observers.length && this.status === PoProgressStatus.Error;
  }

  get statusClass(): string {
    if (this.status === PoProgressStatus.Success) {
      return 'po-progress-success';
    }

    if (this.status === PoProgressStatus.Error) {
      return 'po-progress-error';
    }

    return 'po-progress-default';
  }

  private readonly poLanguageService = inject(PoLanguageService);
  private readonly router = inject(Router);

  parentSize = signal<number>(0);

  ngOnInit(): void {
    this.language = this.poLanguageService.getShortLanguage();

    this.literals = {
      ...poProgressLiterals[this.language]
    };

    if (this.shape() === 'circle') {
      const parent = this.elementRef.nativeElement.parentElement;
      if (parent) {
        if (this.hasAllocatedHeight(parent)) {
          this.measureAndSetParentSize(parent);
          this.observeTarget = parent;
        } else {
          const constrained = this.findConstrainedAncestor(parent);
          if (this.hasExplicitHeight(constrained)) {
            this.measureAndSetParentSize(constrained);
            this.observeTarget = constrained;
          }
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.shape() !== 'circle' || !this.observeTarget) {
      return;
    }

    this.resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width, height);
      if (size > 0) {
        this.parentSize.set(size);
      }
    });

    this.resizeObserver.observe(this.observeTarget);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  emitCancellation() {
    this.cancel.emit(this.status);
  }

  emitRetry() {
    this.retry.emit();
  }

  actionIsDisabled(action: any) {
    return isTypeof(action.disabled, 'function') ? action.disabled(action) : action.disabled;
  }

  callAction(): void {
    this.customActionClick.emit();
  }

  isActionVisible(action: any) {
    if (action && (action.label || action.icon)) {
      return action.visible !== undefined
        ? isTypeof(action.visible, 'function')
          ? action.visible()
          : !!action.visible
        : true;
    }
  }

  private hasExplicitHeight(element: HTMLElement): boolean {
    const h = element.style.height;
    return !!h;
  }

  private hasAllocatedHeight(element: HTMLElement): boolean {
    const parent = element.parentElement;
    if (!parent) {
      return false;
    }

    return this.hasExplicitHeight(parent);
  }

  private measureAndSetParentSize(element: HTMLElement): void {
    const computedStyle = getComputedStyle(element);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

    const width = element.clientWidth - paddingLeft - paddingRight;
    const height = element.clientHeight - paddingTop - paddingBottom;

    const size = Math.min(width, height);
    if (size > 0) {
      this.parentSize.set(size);
    }
  }

  private findConstrainedAncestor(start: HTMLElement): HTMLElement {
    let element: HTMLElement | null = start;
    let depth = 0;

    while (element && depth < 10) {
      if (this.hasExplicitHeight(element)) {
        return element;
      }
      if (!element.parentElement) {
        break;
      }
      element = element.parentElement;
      depth++;
    }

    return start;
  }
}
