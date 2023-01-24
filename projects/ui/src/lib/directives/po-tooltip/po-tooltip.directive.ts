import { Directive, ElementRef, HostListener, OnInit, Renderer2, OnDestroy } from '@angular/core';

import { PoTooltipBaseDirective } from './po-tooltip-base.directive';
import { PoTooltipControlPositionService } from './po-tooltip-control-position.service';

const nativeElements = ['input', 'button'];

/**
 * @docsExtends PoTooltipBaseDirective
 *
 * @example
 *
 * <example name="po-tooltip-basic" title="PO Tooltip Basic" >
 *  <file name="sample-po-tooltip-basic/sample-po-tooltip-basic.component.html"> </file>
 *  <file name="sample-po-tooltip-basic/sample-po-tooltip-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tooltip-labs" title="PO Tooltip Labs" >
 *  <file name="sample-po-tooltip-labs/sample-po-tooltip-labs.component.html"> </file>
 *  <file name="sample-po-tooltip-labs/sample-po-tooltip-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tooltip-new-user" title="PO Tooltip - New User" >
 *  <file name="sample-po-tooltip-new-user/sample-po-tooltip-new-user.component.html"> </file>
 *  <file name="sample-po-tooltip-new-user/sample-po-tooltip-new-user.component.ts"> </file>
 * </example>
 *
 */
@Directive({
  selector: '[p-tooltip]',
  providers: [PoTooltipControlPositionService]
})
export class PoTooltipDirective extends PoTooltipBaseDirective implements OnInit, OnDestroy {
  private arrowDirection: string;
  private divArrow;
  private divContent;
  private isHidden: boolean;
  private lastTooltipText: string;
  private textContent;
  private tooltipOffset: number = 8;

  private eventListenerFunction: () => void;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private poControlPosition: PoTooltipControlPositionService
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  ngOnInit() {
    this.initScrollEventListenerFunction();
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.displayTooltip) {
      this.addTooltipAction();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.displayTooltip) {
      this.removeTooltipAction();
    }
  }

  @HostListener('click') onMouseClick() {
    if (!this.displayTooltip) {
      this.removeTooltipAction();
    }
  }

  @HostListener('focusout') onFocusOut() {
    if (!this.displayTooltip) {
      this.removeTooltipAction();
    }
  }

  @HostListener('focusin') onFocusIn() {
    if (!this.displayTooltip) {
      this.addTooltipAction();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (!this.displayTooltip && (event.code === 'Escape' || event.keyCode === 27)) {
      this.removeTooltipAction();
    }
  }

  protected addTooltipAction() {
    setTimeout(() => {
      if (this.tooltip) {
        this.tooltipContent ? this.showTooltip() : this.createTooltip();

        this.removeArrow(this.arrowDirection);

        this.poControlPosition.adjustPosition(this.tooltipPosition);
        this.arrowDirection = this.poControlPosition.getArrowDirection();

        this.addArrow(this.arrowDirection);

        this.lastTooltipText = this.tooltip;
      }
    });
  }

  protected removeTooltipAction() {
    // necessita do timeout para conseguir adicionar ".po-invisible", pois quando tem alguns elementos
    // próximos com tooltips e ficar passando o mouse em cima, os mesmos não estavam ficando invisiveis.
    setTimeout(() => {
      if (this.appendInBody && this.tooltipContent) {
        this.renderer.removeChild(document.body, this.tooltipContent);
        this.tooltipContent = undefined;
      } else {
        this.hideTooltip();
      }
    });
  }

  private addArrow(arrowDirection) {
    this.renderer.addClass(this.divArrow, `po-arrow-${arrowDirection}`);
  }

  private addScrollEventListener() {
    window.addEventListener('scroll', this.eventListenerFunction, true);
  }

  // Monta a estrutura do tooltip
  private createTooltip() {
    this.tooltipContent = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipContent, 'po-tooltip');

    this.renderer.setStyle(this.tooltipContent, 'transition', 'visibility .3s, opacity .3s linear');
    this.renderer.setStyle(this.tooltipContent, 'opacity', 0.9);

    this.insertAriaLabelTooltip();

    this.divArrow = this.renderer.createElement('div');
    this.renderer.addClass(this.divArrow, 'po-tooltip-arrow');

    this.divContent = this.renderer.createElement('div');
    this.renderer.addClass(this.divContent, 'po-tooltip-content');

    this.textContent = this.renderer.createText(this.tooltip);

    this.renderer.appendChild(this.divContent, this.textContent);
    this.renderer.appendChild(this.tooltipContent, this.divArrow);
    this.renderer.appendChild(this.tooltipContent, this.divContent);

    const parentTarget = this.appendInBody ? document.body : this.elementRef.nativeElement;
    this.renderer.appendChild(parentTarget, this.tooltipContent);

    this.poControlPosition.setElements(this.tooltipContent, this.tooltipOffset, this.elementRef);

    this.addScrollEventListener();
  }

  private initScrollEventListenerFunction() {
    this.eventListenerFunction = () => {
      if (!this.isHidden) {
        setTimeout(() => {
          this.poControlPosition.adjustPosition(this.tooltipPosition);
        });
      }
    };
  }

  private hideTooltip() {
    if (this.tooltipContent) {
      this.renderer.setStyle(this.tooltipContent, 'opacity', 0);
      this.renderer.setStyle(this.tooltipContent, 'visibility', 'hidden');

      this.isHidden = true;

      this.removeScrollEventListener();
    }
  }

  private removeArrow(arrowDirection) {
    if (this.elementRef.nativeElement.querySelector(`.po-arrow-${arrowDirection}`)) {
      this.renderer.removeClass(this.divArrow, `po-arrow-${arrowDirection}`);
    }
  }

  private removeScrollEventListener() {
    window.removeEventListener('scroll', this.eventListenerFunction, true);
  }

  private showTooltip() {
    this.renderer.setStyle(this.tooltipContent, 'opacity', 0.9);
    this.renderer.setStyle(this.tooltipContent, 'visibility', 'visible');
    this.updateTextContent();
    this.isHidden = false;

    this.addScrollEventListener();
  }

  private updateTextContent() {
    const checkRepeatedText = this.tooltip.split('\n');

    if (this.lastTooltipText !== this.tooltip && checkRepeatedText[0] !== this.lastTooltipText) {
      this.renderer.removeChild(this.divContent, this.textContent);
      this.textContent = this.renderer.createText(this.tooltip);
      this.renderer.appendChild(this.divContent, this.textContent);
    }
  }

  private insertAriaLabelTooltip() {
    const nativeTextContent = this.elementRef.nativeElement.textContent;
    let targetElement = '';

    nativeElements.forEach(el => {
      if (this.elementRef.nativeElement.getElementsByTagName(el)[0] !== undefined) {
        targetElement = el;
      }
    });

    if (this.elementRef.nativeElement.getElementsByTagName(targetElement)[0] && this.tooltip) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement.getElementsByTagName(targetElement)[0],
        'aria-label',
        nativeTextContent + ' ' + this.tooltip
      );
    }
  }
}
