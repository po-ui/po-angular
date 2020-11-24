import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoChartAxisComponent } from './po-chart-container/po-chart-axis/po-chart-axis.component';
import { PoChartAxisPathComponent } from './po-chart-container/po-chart-axis/po-chart-axis-path/po-chart-axis-path.component';
import { PoChartAxisLabelComponent } from './po-chart-container/po-chart-axis/po-chart-axis-label/po-chart-axis-label.component';
import { PoChartBarComponent } from './po-chart-container/po-chart-bar/po-chart-bar.component';
import { PoChartColumnComponent } from './po-chart-container/po-chart-bar/po-chart-column/po-chart-column.component';
import { PoChartComponent } from './po-chart.component';
import { PoChartContainerComponent } from './po-chart-container/po-chart-container.component';
import { PoChartDonutComponent } from './po-chart-types/po-chart-donut/po-chart-donut.component';
import { PoChartGaugeComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge.component';
import { PoChartGaugeTextContentComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge-text-content/po-chart-gauge-text-content.component';
import { PoChartLegendComponent } from './po-chart-legend/po-chart-legend.component';
import { PoChartLineComponent } from './po-chart-container/po-chart-line/po-chart-line.component';
import { PoChartBarPathComponent } from './po-chart-container/po-chart-bar/po-chart-bar-path/po-chart-bar-path.component';
import { PoChartPathComponent } from './po-chart-container/po-chart-line/po-chart-path/po-chart-path.component';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';
import { PoChartSeriesPointComponent } from './po-chart-container/po-chart-line/po-chart-series-point/po-chart-series-point.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [
    PoChartAxisComponent,
    PoChartAxisPathComponent,
    PoChartAxisLabelComponent,
    PoChartComponent,
    PoChartContainerComponent,
    PoChartDonutComponent,
    PoChartGaugeComponent,
    PoChartGaugeTextContentComponent,
    PoChartLegendComponent,
    PoChartLineComponent,
    PoChartPathComponent,
    PoChartPieComponent,
    PoChartSeriesPointComponent,
    PoChartBarComponent,
    PoChartColumnComponent,
    PoChartBarPathComponent
  ],
  exports: [PoChartComponent]
})
export class PoChartModule {}
