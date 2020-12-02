import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoTimelineComponent } from './po-timeline.component';

/**
 * @description
 *
 * Módulo do componente `po-container`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  exports: [PoTimelineComponent],
  declarations: [PoTimelineComponent]
})
export class PoTimelineModule {}
