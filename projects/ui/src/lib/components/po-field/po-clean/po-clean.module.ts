import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoCleanComponent } from './po-clean.component';
import { PoIconModule } from '../../po-icon';

/**
 * @description
 *
 * Módulo do componente `po-clean`.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  exports: [PoCleanComponent],
  declarations: [PoCleanComponent]
})
export class PoCleanModule {}
