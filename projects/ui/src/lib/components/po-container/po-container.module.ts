import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoContainerComponent } from './po-container.component';

/**
 * @description
 *
 * Módulo do componente `po-container`.
 */
@NgModule({
  imports: [CommonModule],
  exports: [PoContainerComponent],
  declarations: [PoContainerComponent]
})
export class PoContainerModule {}
