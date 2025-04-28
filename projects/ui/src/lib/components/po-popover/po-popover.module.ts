import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { PoPopoverComponent } from './po-popover.component';

/**
 * @description
 * Módulo do componente po-popover.
 */
@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [PoPopoverComponent],
  exports: [PoPopoverComponent]
})
export class PoPopoverModule {}
