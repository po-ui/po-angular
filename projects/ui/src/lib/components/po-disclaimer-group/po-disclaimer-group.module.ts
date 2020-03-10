import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoDisclaimerModule } from '../po-disclaimer/po-disclaimer.module';

import { PoDisclaimerGroupComponent } from './po-disclaimer-group.component';
import { PoDisclaimerRemoveComponent } from './po-disclaimer-remove/po-disclaimer-remove.component';

/**
 * @description
 *
 * Módulo do componente po-disclaimer-group.
 */
@NgModule({
  imports: [CommonModule, PoDisclaimerModule],
  declarations: [PoDisclaimerGroupComponent, PoDisclaimerRemoveComponent],
  exports: [PoDisclaimerGroupComponent]
})
export class PoDisclaimerGroupModule {}
