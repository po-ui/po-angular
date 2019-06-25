import { Component, OnInit } from '@angular/core';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagItem } from './interfaces/po-tag-item.interface';

/**
 * @docsExtends PoTagBaseComponent
 *
 * @example
 *
 * <example name="po-tag-basic" title="Portinari Tag Basic">
 *  <file name="sample-po-tag-basic/sample-po-tag-basic.component.html"> </file>
 *  <file name="sample-po-tag-basic/sample-po-tag-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tag-labs" title="Portinari Tag Labs">
 *  <file name="sample-po-tag-labs/sample-po-tag-labs.component.html"> </file>
 *  <file name="sample-po-tag-labs/sample-po-tag-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tag-bank-account" title="Portinari Tag - Bank Account">
 *  <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.html"> </file>
 *  <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-tag',
  templateUrl: './po-tag.component.html'
})
export class PoTagComponent extends PoTagBaseComponent implements OnInit {

  isClickable: boolean;

  ngOnInit() {
    this.isClickable = this.click.observers.length > 0;
  }

  onClick() {
    const submittedTagItem: PoTagItem = { value: this.value, type: this.type };

    this.click.emit(submittedTagItem);
  }
}
