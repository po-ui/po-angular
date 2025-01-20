import { Component, Input } from '@angular/core';

import { PoChartType } from '../../../enums/po-chart-type.enum';
import { PoChartLabelCoordinates } from '../../../interfaces/po-chart-label-coordinates.interface';
import { PoChartAxisOptions } from '../../../interfaces/po-chart-axis-options.interface';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: '[po-chart-axis-label]',
  templateUrl: './po-chart-axis-label.component.svg'
})
export class PoChartAxisLabelComponent {
  @Input('p-align-by-the-corners') alignByTheCorners: boolean = false;

  @Input('p-axis-x-label-coordinates') axisXLabelCoordinates: Array<PoChartLabelCoordinates>;

  @Input('p-axis-y-label-coordinates') axisYLabelCoordinates: Array<PoChartLabelCoordinates>;

  @Input('p-type') type: PoChartType;

  @Input('p-options') axisOptions: PoChartAxisOptions;

  constructor(
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ) {}

  trackBy(index) {
    return index;
  }

  formatValueAxis(label: string, axis: string): string {
    const isCategoryAxisValue: boolean =
      (this.type === PoChartType.Bar && axis === 'x') || (this.type !== PoChartType.Bar && axis === 'y');
    if (!this.axisOptions?.format || isCategoryAxisValue) {
      return label;
    }

    if (this.axisOptions?.labelType === 'currency')
      return this.currencyPipe.transform(label, this.axisOptions?.format, 'symbol', '1.2-2');

    return this.decimalPipe.transform(label, this.axisOptions?.format);
  }
}
