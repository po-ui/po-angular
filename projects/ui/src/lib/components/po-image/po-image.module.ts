import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PoImageComponent } from './po-image.component';
import { PoContainerModule } from '../po-container';

/**
 * @description
 *
 * Módulo do componente po-image
 */
@NgModule({
  declarations: [PoImageComponent],
  imports: [CommonModule, PoContainerModule, NgOptimizedImage],
  exports: [PoImageComponent]
})
export class PoImageModule {}
