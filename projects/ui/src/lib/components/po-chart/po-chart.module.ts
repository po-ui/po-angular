import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoChartComponent } from './po-chart.component';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PoChartComponent,
    PoChartPieComponent,
  ],
  entryComponents: [
    PoChartPieComponent
  ],
  exports: [
    PoChartComponent,
  ]
})
export class PoChartModule { }
