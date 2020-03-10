import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';

import { PoPageContentBaseComponent } from './po-page-content-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoPageContentBaseComponent
 */
@Component({
  selector: 'po-page-content',
  templateUrl: './po-page-content.component.html'
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

      this.setHeightContent(pageHeaderElement);
      this.contentOpacity = 1;
    });
  }

  setHeightContent(poPageHeader: HTMLElement) {
    const bodyHeight = document.body.clientHeight;
    const pageHeaderHeight = poPageHeader ? poPageHeader.offsetTop + poPageHeader.offsetHeight : 0;
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
