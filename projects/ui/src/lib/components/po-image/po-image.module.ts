import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoImageComponent } from './po-image.component';
import { PoContainerModule } from '../po-container';

/**
 * @description
 *
 * Módulo do componente po-image
 */
@NgModule({
  declarations: [PoImageComponent],
  imports: [CommonModule, PoContainerModule],
  exports: [PoImageComponent]
})
export class PoImageModule {}
