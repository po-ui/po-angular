import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoChartNewComponent } from './po-chart-new.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [PoChartNewComponent],
  exports: [PoChartNewComponent],
  providers: [DecimalPipe, CurrencyPipe]
})
export class PoChartNewModule {}
