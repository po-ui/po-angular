import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir as legendas dos *steps*.
 */
@Component({
  selector: 'po-stepper-label',
  templateUrl: './po-stepper-label.component.html'
})
export class PoStepperLabelComponent implements AfterViewInit, OnChanges {
  // Conteúdo da label.
  @Input('p-content') content: string;
  @Input() isVerticalOrientation: boolean;
  @Input() status: string;

  @ViewChild('labelElement') labelElement: ElementRef;

  tooltipContent: string;

  private maxLabelLength: number = 100;

  constructor(
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.updateLabel();
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] || changes['isVerticalOrientation']) {
      this.updateLabel();
      this.changeDetectorRef.detectChanges();
    }
  }

  private updateLabel(): void {
    if (!this.labelElement) return;

    const element = this.labelElement.nativeElement;
    const originalContent = this.content;
    let displayedContent = originalContent;

    if (this.isVerticalOrientation && originalContent.length > this.maxLabelLength) {
      displayedContent = originalContent.substring(0, this.maxLabelLength) + '...';
    }

    this.renderer.setProperty(element, 'innerText', displayedContent);

    const isTextOverflowing = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;

    this.tooltipContent =
      isTextOverflowing || (this.isVerticalOrientation && originalContent.length > this.maxLabelLength)
        ? originalContent
        : null;
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.updateTooltip();
    this.renderer.addClass(this.labelElement.nativeElement, 'hovered');
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.renderer.removeClass(this.labelElement.nativeElement, 'hovered');
  }

  private updateTooltip(): void {
    if (this.labelElement) {
      const element = this.labelElement.nativeElement;
      const isTextOverflowing =
        element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
      const isTextTooLong = this.isVerticalOrientation && this.content.length > this.maxLabelLength;

      this.tooltipContent = isTextOverflowing || isTextTooLong ? this.content : null;
    }
  }
}
