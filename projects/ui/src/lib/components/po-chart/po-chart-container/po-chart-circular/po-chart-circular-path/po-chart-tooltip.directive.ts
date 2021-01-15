import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[p-chart-tooltip]'
})
export class PoChartTooltipDirective {
  private lastTooltipText: string;
  private tooltipElement;
  private tooltipText;
  private tooltipTextContent;

  @Input('p-chart-tooltip') tooltip: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
    this.tooltipElement ? this.showTooltip() : this.createTooltip();
    this.tooltipPosition(event);
    this.lastTooltipText = this.tooltip;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    this.tooltipPosition(event);
  }

  private calculateTooltipPosition(event: MouseEvent) {
    const displacement: number = 12;

    return {
      left: event.clientX - this.tooltipElement.offsetWidth / 2,
      top: event.clientY - this.tooltipElement.offsetHeight - displacement
    };
  }

  private createTooltip() {
    const chartWrapper = this.elementRef.nativeElement.closest('.po-chart-wrapper');

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'po-chart-tooltip');
    this.renderer.addClass(this.tooltipElement, 'po-tooltip');

    const divArrow = this.renderer.createElement('div');
    this.renderer.addClass(divArrow, 'po-tooltip-arrow');
    this.renderer.addClass(divArrow, 'po-arrow-bottom');

    this.tooltipText = this.renderer.createElement('p');
    this.renderer.addClass(this.tooltipText, 'po-tooltip-content');

    this.tooltipTextContent = this.renderer.createText(this.tooltip);

    this.renderer.appendChild(this.tooltipText, this.tooltipTextContent);
    this.renderer.appendChild(this.tooltipElement, divArrow);
    this.renderer.appendChild(this.tooltipElement, this.tooltipText);

    this.renderer.appendChild(chartWrapper, this.tooltipElement);
  }

  private hideTooltip() {
    this.renderer.addClass(this.tooltipElement, 'po-invisible');
  }

  private showTooltip() {
    this.renderer.removeClass(this.tooltipElement, 'po-invisible');
    this.updatetooltipTextContent();
  }

  private tooltipPosition(event: MouseEvent) {
    const tooltipPositions = this.calculateTooltipPosition(event);

    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipPositions.left}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPositions.top}px`);
  }

  private updatetooltipTextContent() {
    if (this.lastTooltipText !== this.tooltip) {
      this.renderer.removeChild(this.tooltipText, this.tooltipTextContent);
      this.tooltipTextContent = this.renderer.createText(this.tooltip);
      this.renderer.appendChild(this.tooltipText, this.tooltipTextContent);
    }
  }
}
