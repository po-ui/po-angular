import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { PoDashboardComponent } from './po-dashboard.component';

/**
 * @description
 *
 * Módulo do componente `po-dashboard`.
 */
@NgModule({
  imports: [CommonModule, DragDropModule],
  declarations: [PoDashboardComponent],
  exports: [PoDashboardComponent]
})
export class PoDashboardModule {}
