import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoProgressBarComponent } from './po-progress-bar/po-progress-bar.component';
import { PoProgressComponent } from './po-progress.component';

/**
 * @description
 *
 * Módulo do componente `po-progress`.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    PoProgressComponent
  ],
  declarations: [
    PoProgressBarComponent,
    PoProgressComponent
  ]
})
export class PoProgressModule {}
