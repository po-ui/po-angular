import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconComponent } from './po-icon.component';

/**
 * @description
 *
 * Módulo do componente Po-Icon.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoIconComponent],
  exports: [PoIconComponent]
})
export class PoIconModule {}
