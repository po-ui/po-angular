import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoDisclaimerComponent } from './po-disclaimer.component';

/**
 * @description
 * Módulo do componente po-disclaimer.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoDisclaimerComponent],
  exports: [PoDisclaimerComponent]
})
export class PoDisclaimerModule {}
