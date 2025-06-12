import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoGaugeComponent } from './po-gauge.component';

import { PoChartModule } from '../po-chart/po-chart.module';

/**
 * @description
 * Módulo do componente po-gauge.
 */
@NgModule({
  imports: [CommonModule, PoChartModule],
  declarations: [PoGaugeComponent],
  exports: [PoGaugeComponent]
})
export class PoGaugeModule {}
