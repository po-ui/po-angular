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

  // Informa o status da etapa.
  @Input('p-status') status: string;

  // Informa se a orientação do stepper é vertical.
  @Input('p-vertical-orientation') isVerticalOrientation: boolean;

  @ViewChild('labelElement') labelElement: ElementRef;

  displayedContent: string;
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

  @HostListener('mouseover')
  onMouseOver() {
    this.updateTooltip();
    this.renderer.addClass(this.labelElement.nativeElement, 'hovered');
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.renderer.removeClass(this.labelElement.nativeElement, 'hovered');
  }

  private updateLabel(): void {
    if (!this.labelElement) return;

    const originalContent = this.content;
    let displayedContent = originalContent;

    if (this.isVerticalOrientation && originalContent.length > this.maxLabelLength) {
      displayedContent = originalContent.substring(0, this.maxLabelLength) + '...';
    }

    this.displayedContent = displayedContent;

    this.updateTooltip();
  }

  private updateTooltip(): void {
    if (this.labelElement) {
      const element = this.labelElement.nativeElement;
      const isTextOverflowing = element.scrollWidth > element.clientWidth;
      const isTextTooLong = this.isVerticalOrientation && this.content.length > this.maxLabelLength;

      this.tooltipContent = isTextOverflowing || isTextTooLong ? this.content : null;
    }
  }
}
