import { AfterViewInit, Component, DoCheck, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

import { PoTableSubtitleColumn } from './po-table-subtitle-column.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a criação de um conjunto de legendas.
 */
@Component({
  selector: 'po-table-subtitle-footer',
  templateUrl: './po-table-subtitle-footer.component.html'
})
export class PoTableSubtitleFooterComponent implements AfterViewInit, DoCheck, OnDestroy {
  showSubtitle: boolean;

  private isVisible: boolean;
  private timeoutResize;
  protected resizeListener: () => void;

  /** Propriedade que recebe as literais definidas no `po-table`. */
  @Input('p-literals') literals;

  /** Propriedade que recebe as legendas definidas no `PoTableSubtitleCircleComponent`. */
  @Input('p-subtitles') subtitles: Array<PoTableSubtitleColumn>;

  constructor(private element: ElementRef, public renderer: Renderer2) {}

  ngAfterViewInit() {
    this.initializeResizeListener();
    this.debounceResize();
  }

  ngDoCheck() {
    if (!this.isVisible && this.getContainerSize() > 0) {
      this.toggleShowCompleteSubtitle();
      this.isVisible = true;
    }
  }

  ngOnDestroy() {
    this.removeResizeListener();
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.toggleShowCompleteSubtitle();
    });
  }

  private getContainerSize() {
    return this.element.nativeElement.querySelector('.po-table-subtitle-footer-container').offsetWidth;
  }

  private getItemsSize() {
    const items = this.element.nativeElement.querySelectorAll('.po-table-subtitle-footer');

    return Array.from(items)
      .map(item => item['offsetWidth'])
      .reduce((a, b) => a + b, 16);
  }

  private initializeResizeListener() {
    this.resizeListener = this.renderer.listen('window', 'resize', (event: MouseEvent) => {
      this.debounceResize();
    });
  }

  private removeResizeListener() {
    this.resizeListener();
  }

  private toggleShowCompleteSubtitle() {
    const containerSize = this.getContainerSize();
    const itemsSize = this.getItemsSize();

    this.showSubtitle = itemsSize > containerSize;
  }
}
