import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PoLinkBaseComponent } from './po-link-base.component';

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
export class PoLinkComponent extends PoLinkBaseComponent implements OnInit {
  @ViewChild('inputEl', { read: ElementRef, static: true }) inputEl: ElementRef;
  protected isActionUsed = false;

  ngOnInit(): void {
    this.isActionUsed = this.action.observed;
  }

  onClick() {
    if (this.url) {
      return;
    } else {
      this.action.emit(null);
    }
  }
}
