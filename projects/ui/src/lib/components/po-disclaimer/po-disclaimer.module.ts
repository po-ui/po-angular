import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoIconModule } from '../po-icon';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoDisclaimerComponent } from './po-disclaimer.component';

/**
 * @description
 * Módulo do componente po-disclaimer.
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoTooltipModule],
  declarations: [PoDisclaimerComponent],
  exports: [PoDisclaimerComponent]
})
export class PoDisclaimerModule {}
