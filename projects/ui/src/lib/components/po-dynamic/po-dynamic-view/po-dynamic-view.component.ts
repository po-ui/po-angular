import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';

import { PoDynamicViewField } from './../po-dynamic-view/po-dynamic-view-field.interface';
import { PoDynamicViewBaseComponent } from './po-dynamic-view-base.component';
import { PoDynamicViewService } from './po-dynamic-view.service';

/**
 * @docsExtends PoDynamicViewBaseComponent
 *
 * @example
 *
 * <example name="po-dynamic-view-basic" title="PO Dynamic View Basic">
 *  <file name="sample-po-dynamic-view-basic/sample-po-dynamic-view-basic.component.html"> </file>
 *  <file name="sample-po-dynamic-view-basic/sample-po-dynamic-view-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dynamic-view-employee" title="PO Dynamic View - Employee">
 *  <file name="sample-po-dynamic-view-employee/sample-po-dynamic-view-employee.component.html"> </file>
 *  <file name="sample-po-dynamic-view-employee/sample-po-dynamic-view-employee.component.ts"> </file>
 * </example>
 *
 * <example name="po-dynamic-view-employee-on-load" title="PO Dynamic View - Employee on load">
 *  <file name="sample-po-dynamic-view-employee-on-load/sample-po-dynamic-view-employee-on-load.component.html"> </file>
 *  <file name="sample-po-dynamic-view-employee-on-load/sample-po-dynamic-view-employee-on-load.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-dynamic-view',
  templateUrl: './po-dynamic-view.component.html'
})
export class PoDynamicViewComponent extends PoDynamicViewBaseComponent implements OnChanges, OnInit {
  constructor(
    currencyPipe: CurrencyPipe,
    datePipe: DatePipe,
    decimalPipe: DecimalPipe,
    timePipe: PoTimePipe,
    titleCasePipe: TitleCasePipe,
    dynamicViewService: PoDynamicViewService
  ) {
    super(currencyPipe, datePipe, decimalPipe, timePipe, titleCasePipe, dynamicViewService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields || changes.value || changes.showAllValue) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  ngOnInit() {
    if (this.load) {
      this.updateValuesAndFieldsOnLoad();
    }
  }

  private async getValuesAndFieldsFromLoad(): Promise<{ value?: any; fields?: Array<PoDynamicViewField> }> {
    let valueAndFieldsFromLoad;

    if (typeof this.load === 'string') {
      valueAndFieldsFromLoad = await this.dynamicViewService.onLoad(this.load, this.value);
    } else if (typeof this.load === 'function') {
      valueAndFieldsFromLoad = this.load();
    }

    return valueAndFieldsFromLoad || {};
  }

  private getVisibleFields() {
    if (this.showAllValue) {
      return this.getMergedFields();
    }

    return this.value && this.fields.length ? this.getConfiguredFields() : this.getValueFields();
  }

  private setFieldOnLoad(fieldOnLoad: PoDynamicViewField) {
    const index = this.fields.findIndex(field => field.property === fieldOnLoad.property);

    if (index >= 0) {
      this.fields[index] = { ...this.fields[index], ...fieldOnLoad };
    } else {
      this.fields.push({ ...fieldOnLoad });
    }
  }

  private setFieldsOnLoad(fields: Array<PoDynamicViewField>) {
    if (fields) {
      fields.forEach(fieldOnLoad => {
        this.setFieldOnLoad(fieldOnLoad);
      });
    }
  }

  private setValueOnLoad(newValue: any) {
    Object.assign(this.value, newValue);
  }

  private async updateValuesAndFieldsOnLoad() {
    const { value, fields } = await this.getValuesAndFieldsFromLoad();

    this.setValueOnLoad(value);
    this.setFieldsOnLoad(fields);

    this.visibleFields = this.getVisibleFields();
  }
}
