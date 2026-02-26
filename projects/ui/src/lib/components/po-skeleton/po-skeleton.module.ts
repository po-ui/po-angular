import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoSkeletonComponent } from './po-skeleton.component';

/**
 * @description
 *
 * Módulo do componente po-skeleton.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoSkeletonComponent],
  exports: [PoSkeletonComponent]
})
export class PoSkeletonModule {}
