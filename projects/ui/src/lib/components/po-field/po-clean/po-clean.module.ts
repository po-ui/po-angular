import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoCleanComponent } from './po-clean.component';

/**
 * @description
 *
 * Módulo do componente `po-clean`.
 */
@NgModule({
  imports: [CommonModule],
  exports: [PoCleanComponent],
  declarations: [PoCleanComponent]
})
export class PoCleanModule {}
