import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoDividerComponent } from './po-divider.component';

/**
 * @description
 *
 * Módulo do componente po-divider.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoDividerComponent],
  exports: [PoDividerComponent]
})
export class PoDividerModule {}
