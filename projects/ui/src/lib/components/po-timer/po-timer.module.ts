import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTimerComponent } from './po-timer.component';

/**
 * @description
 * Módulo do componente `po-timer`.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoTimerComponent],
  exports: [PoTimerComponent]
})
export class PoTimerModule {}
