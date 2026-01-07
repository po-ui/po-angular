import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { PoControlPositionService } from './../../services/po-control-position/po-control-position.service';
import { PoPopoverBaseComponent } from './po-popover-base.component';

/**
 *
 * @docsExtends PoPopoverBaseComponent
 *
 * @example
 *
 * <example name="po-popover-basic" title="PO Popover Basic">
 *   <file name="sample-po-popover-basic/sample-po-popover-basic.component.html"> </file>
 *   <file name="sample-po-popover-basic/sample-po-popover-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-popover-labs" title="PO Popover Labs">
 *   <file name="sample-po-popover-labs/sample-po-popover-labs.component.html"> </file>
 *   <file name="sample-po-popover-labs/sample-po-popover-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-popover-credit-card" title="PO Popover - Credit Card">
 *   <file name="sample-po-popover-credit-card/sample-po-popover-credit-card.component.html"> </file>
 *   <file name="sample-po-popover-credit-card/sample-po-popover-credit-card.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-popover',
  templateUrl: './po-popover.component.html',
  providers: [PoControlPositionService],
  standalone: false
})
export class PoPopoverComponent extends PoPopoverBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('popoverElement', { read: ElementRef, static: false }) popoverElement: ElementRef;

  arrowDirection = 'left';
  timeoutResize;
  targetElement;
  afterViewInitWasCalled = false;
  private keydownTargetListener?: () => void;
  private keydownPopoverListener?: () => void;
  eventListenerFunction: () => void;
  private readonly tabbableSelector = [
    'a[href]:not([tabindex="-1"])',
    'area[href]:not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'iframe:not([tabindex="-1"])',
    '[contenteditable="true"]:not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  constructor(
    private renderer: Renderer2,
    private readonly poControlPosition: PoControlPositionService,
    private readonly cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appendBox']) {
      this.cd.detectChanges();
      this.attachPopoverKeydown();
    }
    if (this.afterViewInitWasCalled && changes['target']) {
      this.removeListeners();
      this.initEvents();
    }
  }

  ngAfterViewInit(): void {
    this.initEvents();
    this.afterViewInitWasCalled = true;
  }

  initEvents() {
    this.targetElement = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
    this.initEventListenerFunction();

    this.setElementsControlPosition();

    this.setRendererListenInit();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  close(): void {
    this.isHidden = true;
    this.closePopover.emit();
    this.cd.detectChanges();
  }

  debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.setPopoverPosition();
    }, 200);
  }

  open(): void {
    this.addScrollEventListener();
    this.setOpacity(0);
    this.isHidden = false;
    setTimeout(() => {
      this.setElementsControlPosition();
      this.setPopoverPosition();
      this.setOpacity(1);
      this.openPopover.emit();
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }

  public ensurePopoverPosition(): void {
    setTimeout(() => {
      this.setElementsControlPosition();
      this.setPopoverPosition();
      this.cd.detectChanges();
    });
  }

  setOpacity(value: number): void {
    this.popoverElement.nativeElement.style.opacity = value;
  }

  setPopoverPosition() {
    this.poControlPosition.adjustPosition(this.position);
    this.arrowDirection = this.poControlPosition.getArrowDirection();
  }

  setRendererListenInit() {
    this.resizeListener = this.renderer.listen('window', 'resize', (event: Event) => {
      if (!this.isHidden) {
        this.debounceResize();
      }
    });

    if (this.trigger === 'hover') {
      this.mouseEnterListener = this.renderer.listen(this.targetElement, 'mouseenter', (event: MouseEvent) => {
        this.open();
      });

      this.mouseLeaveListener = this.renderer.listen(this.targetElement, 'mouseleave', (event: MouseEvent) => {
        this.close();
      });
    } else {
      this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
        this.togglePopup(event);
      });
    }

    if (this.targetElement) {
      this.keydownTargetListener = this.renderer.listen(this.targetElement, 'keydown', (event: KeyboardEvent) => {
        if (this.appendBox && !this.isHidden && event.key === 'Tab') {
          event.preventDefault();

          if (event.shiftKey) {
            this.focusPrevBeforeTarget();
          } else {
            this.focusOnFirstFocusable();
          }
        }
      });
    }

    this.attachPopoverKeydown();
  }

  togglePopup(event): void {
    if (
      !this.isHidden &&
      !this.popoverElement.nativeElement.contains(event.target) &&
      !this.targetElement?.contains(event.target)
    ) {
      if (!this.appendBox) {
        this.close();
      }
    } else if (this.targetElement?.contains(event.target)) {
      this.popoverElement.nativeElement.hidden ? this.open() : this.close();
    }
  }

  private addScrollEventListener() {
    window.addEventListener('scroll', this.eventListenerFunction, true);
  }

  private initEventListenerFunction() {
    this.eventListenerFunction = () => {
      this.setPopoverPosition();
    };
  }

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }
    if (this.mouseEnterListener) {
      this.mouseEnterListener();
    }
    if (this.mouseLeaveListener) {
      this.mouseLeaveListener();
    }

    this.resizeListener();

    window.removeEventListener('scroll', this.eventListenerFunction, true);
    this.keydownTargetListener?.();
    this.keydownPopoverListener?.();
  }

  private setElementsControlPosition() {
    const popoverOffset = 8;
    this.poControlPosition.setElements(this.popoverElement.nativeElement, popoverOffset, this.target);
  }

  private focusOnTarget(): void {
    const el = this.targetElement as HTMLElement | undefined;
    el?.focus?.();
  }

  private focusOnFirstFocusable(): void {
    const host = this.popoverElement?.nativeElement as HTMLElement | undefined;
    if (!host) {
      this.focusOnTarget();
      return;
    }

    const action = host.querySelector<HTMLElement>('.po-helper-footer-action-link button');
    if (action) {
      action.focus();
      return;
    }

    const dialog = host.querySelector<HTMLElement>('[role="dialog"]');
    if (dialog) {
      this.close();
      this.focusNextAfterTarget();
      return;
    }

    const hadTabindex = host.hasAttribute('tabindex');
    if (!hadTabindex) host.setAttribute('tabindex', '-1');
    host.focus();
    if (!hadTabindex) {
      host?.addEventListener('blur', () => host.removeAttribute('tabindex'), { once: true });
    }
  }

  private attachPopoverKeydown(): void {
    this.keydownPopoverListener?.();

    const host = this.popoverElement?.nativeElement as HTMLElement | undefined;
    if (!host) return;

    this.keydownPopoverListener = this.renderer.listen(host, 'keydown', (event: KeyboardEvent) => {
      if (this.appendBox) {
        if (event.key !== 'Tab') return;
        const innerTabbables = this.getTabbablesIn(host);
        const first = innerTabbables[0];
        const last = innerTabbables[innerTabbables.length - 1];

        const isShift = event.shiftKey;
        const active = document.activeElement as HTMLElement | null;
        if (isShift && (!active || active === first)) {
          event.preventDefault();
          this.focusOnTarget();
          return;
        }

        if ((!isShift && (!active || active === last)) || active.id.includes('popover-content')) {
          event.preventDefault();
          this.focusNextAfterTarget();
          return;
        }
      }
    });
  }

  private isVisible(element: HTMLElement): boolean {
    const cs = window.getComputedStyle(element);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      const style = window.getComputedStyle(currentElement);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      currentElement = currentElement.parentElement;
    }
    const rect = element.getBoundingClientRect();
    return !!(rect.width || rect.height || element.getClientRects().length);
  }

  private getTabbablesIn(container: HTMLElement): Array<HTMLElement> {
    return Array.from(container.querySelectorAll<HTMLElement>(this.tabbableSelector)).filter(
      el => this.isVisible(el) && !el.hasAttribute('disabled')
    );
  }

  private getDocumentTabbables(): Array<HTMLElement> {
    const all = Array.from(document.querySelectorAll<HTMLElement>(this.tabbableSelector));
    return all.filter(el => this.isVisible(el) && !el.hasAttribute('disabled'));
  }

  private focusNextAfterTarget(): void {
    const docTabs = this.getDocumentTabbables();
    if (!docTabs.length) return;

    const target = this.targetElement as HTMLElement | null;
    let startIndex = target ? docTabs.indexOf(target) : -1;

    if (startIndex < 0 && this.popoverElement?.nativeElement) {
      const inner = this.getTabbablesIn(this.popoverElement.nativeElement);
      if (inner.length) {
        const idxByInner = docTabs.indexOf(inner[inner.length - 1]);
        if (idxByInner >= 0) startIndex = idxByInner;
      }
    }
    const next = docTabs[startIndex + 1] || docTabs[0];
    next?.focus?.();
  }

  private focusPrevBeforeTarget(): void {
    const docTabs = this.getDocumentTabbables();
    if (!docTabs.length) return;

    const target = this.targetElement as HTMLElement | null;
    const idx = target ? docTabs.indexOf(target) : -1;
    const prev = docTabs[idx - 1] || docTabs[docTabs.length - 1];
    prev?.focus?.();
  }
}
