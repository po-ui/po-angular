import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';

import { PoDynamicViewBaseComponent } from './po-dynamic-view-base.component';

/**
 * @docsExtends PoDynamicViewBaseComponent
 *
 * @example
 *
 * <example name="po-dynamic-view-basic" title="Portinari Dynamic View Basic">
 *  <file name="sample-po-dynamic-view-basic/sample-po-dynamic-view-basic.component.html"> </file>
 *  <file name="sample-po-dynamic-view-basic/sample-po-dynamic-view-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dynamic-view-employee" title="Portinari Dynamic View - Employee">
 *  <file name="sample-po-dynamic-view-employee/sample-po-dynamic-view-employee.component.html"> </file>
 *  <file name="sample-po-dynamic-view-employee/sample-po-dynamic-view-employee.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-dynamic-view',
  templateUrl: './po-dynamic-view.component.html'
})
export class PoDynamicViewComponent extends PoDynamicViewBaseComponent implements OnChanges {

  constructor(
    currencyPipe: CurrencyPipe,
    datePipe: DatePipe,
    decimalPipe: DecimalPipe,
    timePipe: PoTimePipe,
    titleCasePipe: TitleCasePipe) {

    super(currencyPipe, datePipe, decimalPipe, timePipe, titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields || changes.value || changes.showAllValue) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  private getVisibleFields() {
    if (this.showAllValue) {
      return this.getMergedFields();
    }

    return this.value && this.fields.length ? this.getConfiguredFields() : this.getValueFields();
  }

}
