import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { PoChartSerie } from '../po-chart';
import { PoGaugeBaseComponent } from './po-gauge-base.component';

/**
 * @docsExtends PoGaugeBaseComponent
 *
 * @example
 *
 * <example name="po-gauge-basic" title="PO Gauge Basic">
 *  <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.html"> </file>
 *  <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.ts"> </file>
 * </example>
 * <example name="po-gauge-labs" title="PO Gauge Labs">
 *  <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.html"> </file>
 *  <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.ts"> </file>
 * </example>
 * <example name="po-gauge-summary" title="PO Gauge Summary">
 *  <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.html"> </file>
 *  <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.ts"> </file>
 * </example>
 *
 * @deprecated v22.x.x
 * Utilize o `po-chart` com `type="gauge"` como alternativa recomendada.
 */
@Component({
  selector: 'po-gauge',
  templateUrl: './po-gauge.component.html',
  standalone: false
})
export class PoGaugeComponent extends PoGaugeBaseComponent implements OnChanges, OnInit {
  series: Array<PoChartSerie> = [];
  valuesMultiple: number;

  ngOnInit(): void {
    if (this.options?.showContainerGauge !== false) {
      this.options = { ...this.options, showContainerGauge: true };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { description, ranges, value, options } = changes;
    if (description || options) {
      this.options = {
        ...this.options,
        showContainerGauge: this.options?.showContainerGauge !== false,
        descriptionChart: this.description || options?.currentValue?.descriptionChart
      };
    }
    if (ranges || value) {
      if (this.ranges?.length) {
        this.series = [...this.ranges];
        this.valuesMultiple = this.value;
      } else if (value?.currentValue) {
        this.series = [{ data: this.value }];
      } else {
        this.series = [];
      }
    }
  }
}
