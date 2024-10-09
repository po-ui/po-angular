import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { PoLinkBaseComponent } from './po-link-base.component';
import { PoThemeService } from '../../services/po-theme/po-theme.service';

/**
 * @docsExtends PoLinkBaseComponent
 *
 * @example
 *
 * <example name="po-link-basic" title="PO Link Basic" >
 *  <file name="sample-po-link-basic/sample-po-link-basic.component.html"> </file>
 *  <file name="sample-po-link-basic/sample-po-link-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-link-labs" title="PO Link Labs" >
 *  <file name="sample-po-link-labs/sample-po-link-labs.component.html"> </file>
 *  <file name="sample-po-link-labs/sample-po-link-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-link-heroes" title="PO Link Heroes" >
 *  <file name="sample-po-link-heroes/sample-po-link-heroes.component.html"> </file>
 *  <file name="sample-po-link-heroes/sample-po-link-heroes.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-link',
  templateUrl: './po-link.component.html'
})
export class PoLinkComponent extends PoLinkBaseComponent {
  constructor(
    private themeService: PoThemeService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.applyAccessibilityTokens();
  }

  private applyAccessibilityTokens(): void {
    const linkElement = this.el.nativeElement.querySelector('.po-link');
    if (linkElement) {
      this.themeService.setAccessibilityStyles(linkElement, this.size);
    } else {
      console.error(' erro teste joprge');
    }
  }

  onClick() {
    if (this.url) {
      return;
    } else {
      this.action.emit(null);
    }
  }
}
