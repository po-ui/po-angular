import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoBadgeComponent } from './po-badge.component';

/**
 * @description
 *
 * Módulo do componente po-badge.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoBadgeComponent],
  exports: [PoBadgeComponent]
})
export class PoBadgeModule {}
