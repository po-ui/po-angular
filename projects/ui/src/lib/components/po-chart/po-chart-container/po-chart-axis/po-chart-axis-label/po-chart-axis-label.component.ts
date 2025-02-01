import { Component, Input } from '@angular/core';

import { PoChartType } from '../../../enums/po-chart-type.enum';
import { PoChartLabelCoordinates } from '../../../interfaces/po-chart-label-coordinates.interface';
import { PoChartAxisOptions } from '../../../interfaces/po-chart-axis-options.interface';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PoChartLabelFormat } from '../../../enums/po-chart-label-format.enum';

@Component({
  selector: '[po-chart-axis-label]',
  templateUrl: './po-chart-axis-label.component.svg',
  standalone: false
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

    if (isCategoryAxisValue) {
      return label;
    }

    if (this.axisOptions?.labelType === PoChartLabelFormat.Currency) {
      return this.currencyPipe.transform(label, null, 'symbol', '1.2-2');
    }

    if (this.axisOptions?.labelType === PoChartLabelFormat.Number) {
      return this.decimalPipe.transform(label, '1.2-2');
    }

    return label;
  }
}
