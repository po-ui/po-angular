import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoGaugeComponent } from './po-gauge.component';
import { PoGaugeDescriptionComponent } from './po-gauge-description/po-gauge-description.component';
import { PoGaugeLegendComponent } from './po-gauge-legend/po-gauge-legend.component';
import { PoGaugePathComponent } from './po-gauge-svg/po-gauge-path/po-gauge-path.component';
import { PoGaugeSvgComponent } from './po-gauge-svg/po-gauge-svg.component';
import { PoGaugeTitleComponent } from './po-gauge-title/po-gauge-title.component';
import { PoGaugePointerComponent } from './po-gauge-svg/po-gauge-pointer/po-gauge-pointer.component';

/**
 * @description
 * Módulo do componente po-gauge.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [
    PoGaugeComponent,
    PoGaugeTitleComponent,
    PoGaugeLegendComponent,
    PoGaugeSvgComponent,
    PoGaugePathComponent,
    PoGaugeDescriptionComponent,
    PoGaugePointerComponent
  ],
  exports: [PoGaugeComponent]
})
export class PoGaugeModule {}
