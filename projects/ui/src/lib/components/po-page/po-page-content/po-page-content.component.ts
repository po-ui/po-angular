import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, Renderer2, inject } from '@angular/core';

import { PoPageContentBaseComponent } from './po-page-content-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoPageContentBaseComponent
 */
@Component({
  selector: 'po-page-content',
  templateUrl: './po-page-content.component.html',
  standalone: false
})
export class PoPageContentComponent extends PoPageContentBaseComponent implements AfterViewInit, OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  contentOpacity: number = 0;

  height: string = '90%';

  constructor() {
    super();
    this.initializeListeners();
  }

  ngAfterViewInit(): void {
    this.recalculateHeaderSize();
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }

  /**
   * Recalcula a altura do po-page-content.
   * Chamado internamente pelo po-page-default quando inputs que afetam
   * o tamanho do header mudam (title, subtitle, breadcrumb, headerType, theme).
   */
  recalculateHeaderSize(): void {
    setTimeout(() => {
      this.setHeightContent();
      this.contentOpacity = 1;
    });
  }

  private setHeightContent(): void {
    const poPageDiv: HTMLElement = this.elementRef.nativeElement.closest('.po-page');
    const contentHost: HTMLElement = this.elementRef.nativeElement;

    if (!poPageDiv) {
      const contentTop = contentHost.getBoundingClientRect().top;
      const newHeight = window.innerHeight - contentTop;
      this.height = newHeight > 0 ? `${newHeight}px` : '90%';
      return;
    }

    // Page nested (dentro de outro po-page-content): height controlado externamente.
    if (poPageDiv.closest('.po-page-content')) {
      this.height = 'auto';
      return;
    }

    const pageHeader: HTMLElement = poPageDiv.querySelector(':scope > po-page-header');
    const gap = parseFloat(getComputedStyle(poPageDiv).gap) || 0;

    let contentTop: number;

    if (pageHeader) {
      contentTop = pageHeader.getBoundingClientRect().bottom + gap;
    } else {
      contentTop = poPageDiv.getBoundingClientRect().top;
    }

    const newHeight = window.innerHeight - contentTop;
    this.height = newHeight > 0 ? `${newHeight}px` : '90%';
  }

  private initializeListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeListener = this.renderer.listen('window', 'resize', () => {
        this.ngZone.run(() => this.recalculateHeaderSize());
      });
    });
  }

  private removeListeners(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }
}
