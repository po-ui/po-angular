import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoSkeletonComponent } from './po-skeleton.component';
import { PoSkeletonContainerDirective } from './po-skeleton-container/po-skeleton-container.directive';

/**
 * @description
 *
 * Módulo do componente po-skeleton e da diretiva po-skeleton-container.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoSkeletonComponent, PoSkeletonContainerDirective],
  exports: [PoSkeletonComponent, PoSkeletonContainerDirective]
})
export class PoSkeletonModule {}
