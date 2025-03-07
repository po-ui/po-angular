import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoButtonModule } from '../po-button';
import { PoModalModule } from '../po-modal';
import { PoPopupModule } from '../po-popup';
import { PoTableModule } from '../po-table';
import { PoChartNewComponent } from './po-chart-new.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule, PoButtonModule, PoModalModule, PoTableModule, PoPopupModule],
  declarations: [PoChartNewComponent],
  exports: [PoChartNewComponent],
  providers: [DecimalPipe, CurrencyPipe]
})
export class PoChartNewModule {}
