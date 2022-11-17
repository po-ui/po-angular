import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoDisclaimerComponent } from './po-disclaimer.component';

/**
 * @description
 * Módulo do componente po-disclaimer.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [PoDisclaimerComponent],
  exports: [PoDisclaimerComponent]
})
export class PoDisclaimerModule {}
