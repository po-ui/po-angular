import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';

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
  contentOpacity: number = 0;
  height: string = '90%';
  overflowY: string = 'none';

  constructor(public renderer: Renderer2) {
    super();
    this.initializeListeners();
  }

  ngAfterViewInit() {
    this.recalculateHeaderSize();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  recalculateHeaderSize() {
    setTimeout(() => {
      const pageHeaderElement: HTMLElement = document.querySelector('div.po-page-header');
      const pageElement: HTMLElement = document.querySelector('div.po-page');
      const pageComputedStyle = window.getComputedStyle(pageElement);
      const gap = pageComputedStyle.gap ? parseFloat(pageComputedStyle.gap) : 0;

      this.setHeightContent(pageHeaderElement, gap);
      this.contentOpacity = 1;
    });
  }

  setHeightContent(poPageHeader: HTMLElement, gap: number) {
    const bodyHeight = document.body.clientHeight;
    const pageHeaderHeight = poPageHeader ? poPageHeader.offsetTop + poPageHeader.offsetHeight + gap : 0;
    const newHeight = bodyHeight - pageHeaderHeight;

    this.height = `${newHeight}px`;
  }

  private initializeListeners() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.recalculateHeaderSize();
    });
  }

  private removeListeners() {
    this.resizeListener();
  }
}
