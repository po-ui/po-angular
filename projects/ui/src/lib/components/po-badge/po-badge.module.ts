import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoBadgeComponent } from './po-badge.component';
import { PoIconModule } from '../po-icon';

/**
 * @description
 *
 * Módulo do componente po-badge.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  declarations: [PoBadgeComponent],
  exports: [PoBadgeComponent]
})
export class PoBadgeModule {}
