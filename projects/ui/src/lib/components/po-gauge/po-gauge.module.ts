import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoGaugeComponent } from './po-gauge.component';

import { PoChartNewModule } from '../po-chart-new';

/**
 * @description
 * Módulo do componente po-gauge.
 */
@NgModule({
  imports: [CommonModule, PoChartNewModule],
  declarations: [PoGaugeComponent],
  exports: [PoGaugeComponent]
})
export class PoGaugeModule {}
