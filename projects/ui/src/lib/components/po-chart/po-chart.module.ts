import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoChartComponent } from './po-chart.component';
import { PoChartDonutComponent } from './po-chart-types/po-chart-donut/po-chart-donut.component';
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
    PoChartDonutComponent,
    PoChartPieComponent
  ],
  entryComponents: [
    PoChartDonutComponent,
    PoChartPieComponent
  ],
  exports: [
    PoChartComponent,
  ]
})
export class PoChartModule { }
