import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoIconModule } from '../../po-icon';
import { PoLabelModule } from '../../po-label';
import { PoTooltipModule } from '../../../directives/po-tooltip/index';

import { PoFieldContainerBottomComponent } from './po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from './po-field-container.component';

/**
 * @description
 *
 * Módulo do componente `po-field-container`.
 */
@NgModule({
  imports: [CommonModule, PoLabelModule, PoIconModule, PoTooltipModule],
  exports: [PoFieldContainerBottomComponent, PoFieldContainerComponent],
  declarations: [PoFieldContainerBottomComponent, PoFieldContainerComponent]
})
export class PoFieldContainerModule {}
