import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoButtonModule } from '../po-button';
import { PoModalModule } from '../po-modal';
import { PoPopupModule } from '../po-popup';
import { PoTableModule } from '../po-table';
import { PoChartComponent } from './po-chart.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule, PoButtonModule, PoModalModule, PoTableModule, PoPopupModule],
  declarations: [PoChartComponent],
  exports: [PoChartComponent],
  providers: [DecimalPipe, CurrencyPipe]
})
export class PoChartModule {}
