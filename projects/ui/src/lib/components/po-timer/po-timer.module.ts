import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoButtonModule } from '../po-button/po-button.module';

import { PoTimerComponent } from './po-timer.component';

/**
 * @description
 * Módulo do componente `po-timer`.
 */
@NgModule({
  imports: [CommonModule, PoButtonModule],
  declarations: [PoTimerComponent],
  exports: [PoTimerComponent]
})
export class PoTimerModule {}
