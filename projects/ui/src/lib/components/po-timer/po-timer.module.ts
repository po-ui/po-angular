import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTimerComponent } from './po-timer.component';

/**
 * @description
 * Módulo do componente `po-timer`.
 */
@NgModule({
  imports: [CommonModule, DecimalPipe],
  declarations: [PoTimerComponent],
  exports: [PoTimerComponent]
})
export class PoTimerModule {}
