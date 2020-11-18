import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  Renderer2,
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
  providers: [PoControlPositionService]
})
export class PoPopoverComponent extends PoPopoverBaseComponent implements AfterViewInit, OnDestroy {
  arrowDirection = 'left';
  timeoutResize;
  targetElement;
  eventListenerFunction: () => void;

  @ViewChild('popoverElement', { read: ElementRef, static: true }) popoverElement: ElementRef;

  constructor(private renderer: Renderer2, private poControlPosition: PoControlPositionService) {
    super();
  }

  ngAfterViewInit(): void {
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
  }

  debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.setPopoverPosition();
    }, 200);
  }

  open(): void {
    this.addScrollEventListener();

    this.isHidden = false;
    this.setOpacity(0);

    setTimeout(() => {
      this.setElementsControlPosition();
      this.setPopoverPosition();
      this.setOpacity(1);
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
  }

  togglePopup(event): void {
    if (
      !this.isHidden &&
      !this.popoverElement.nativeElement.contains(event.target) &&
      !this.targetElement.contains(event.target)
    ) {
      this.close();
    } else if (this.targetElement.contains(event.target)) {
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
  }

  private setElementsControlPosition() {
    const popoverOffset = 8;
    this.poControlPosition.setElements(this.popoverElement.nativeElement, popoverOffset, this.target);
  }
}
