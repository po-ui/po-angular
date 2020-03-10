import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipDirective } from './po-tooltip.directive';

/**
 * @description
 *
 * Módulo da diretiva Po-Tooltip.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoTooltipDirective],
  exports: [PoTooltipDirective]
})
export class PoTooltipModule {}
