import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopoverComponent } from './po-popover.component';

/**
 * @description
 * Módulo do componente po-popover.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoPopoverComponent],
  exports: [PoPopoverComponent]
})
export class PoPopoverModule {}
