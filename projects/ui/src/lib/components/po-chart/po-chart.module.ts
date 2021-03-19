import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoChartAreaComponent } from './po-chart-container/po-chart-line/po-chart-area/po-chart-area.component';
import { PoChartAxisComponent } from './po-chart-container/po-chart-axis/po-chart-axis.component';
import { PoChartAxisPathComponent } from './po-chart-container/po-chart-axis/po-chart-axis-path/po-chart-axis-path.component';
import { PoChartAxisLabelComponent } from './po-chart-container/po-chart-axis/po-chart-axis-label/po-chart-axis-label.component';
import { PoChartBarComponent } from './po-chart-container/po-chart-bar/po-chart-bar.component';
import { PoChartColumnComponent } from './po-chart-container/po-chart-bar/po-chart-column/po-chart-column.component';
import { PoChartComponent } from './po-chart.component';
import { PoChartContainerComponent } from './po-chart-container/po-chart-container.component';
import { PoChartGaugeComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge.component';
import { PoChartGaugeTextContentComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge-text-content/po-chart-gauge-text-content.component';
import { PoChartLegendComponent } from './po-chart-legend/po-chart-legend.component';
import { PoChartLineComponent } from './po-chart-container/po-chart-line/po-chart-line.component';
import { PoChartBarPathComponent } from './po-chart-container/po-chart-bar/po-chart-bar-path/po-chart-bar-path.component';
import { PoChartPathComponent } from './po-chart-container/po-chart-line/po-chart-path/po-chart-path.component';
import { PoChartSeriesPointComponent } from './po-chart-container/po-chart-line/po-chart-series-point/po-chart-series-point.component';
import { PoChartPieComponent } from './po-chart-container/po-chart-circular/po-chart-pie/po-chart-pie.component';
import { PoChartDonutComponent } from './po-chart-container/po-chart-circular/po-chart-donut/po-chart-donut.component';
import { PoChartCircularLabelComponent } from './po-chart-container/po-chart-circular/po-chart-circular-label/po-chart-circular-label.component';
import { PoChartCircularPathComponent } from './po-chart-container/po-chart-circular/po-chart-circular-path/po-chart-circular-path.component';
import { PoChartTooltipDirective } from './po-chart-container/po-chart-circular/po-chart-circular-path/po-chart-tooltip.directive';
import { PoResizeObserverDirective } from './directives/po-resize-observer.directive';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [
    PoChartAreaComponent,
    PoChartAxisComponent,
    PoChartAxisPathComponent,
    PoChartAxisLabelComponent,
    PoChartComponent,
    PoChartContainerComponent,
    PoChartGaugeComponent,
    PoChartGaugeTextContentComponent,
    PoChartLegendComponent,
    PoChartLineComponent,
    PoChartPathComponent,
    PoChartPieComponent,
    PoChartDonutComponent,
    PoChartSeriesPointComponent,
    PoChartBarComponent,
    PoChartColumnComponent,
    PoChartBarPathComponent,
    PoChartCircularPathComponent,
    PoChartCircularLabelComponent,
    PoChartTooltipDirective,
    PoResizeObserverDirective
  ],
  exports: [PoChartComponent]
})
export class PoChartModule {}
