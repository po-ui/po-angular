import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoCleanModule } from '../po-clean/po-clean.module';
import { PoButtonModule } from '../../po-button';

import { PoTimepickerComponent } from './po-timepicker.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PoHelperModule } from '../../po-helper';
import { PoLoadingModule } from '../../po-loading';
import { PoTimerModule } from '../../po-timer/po-timer.module';

/**
 * @description
 *
 * Módulo do componente `po-timepicker`.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoFieldContainerModule,
    OverlayModule,
    PoCleanModule,
    PoLoadingModule,
    PoTimerModule,
    PoButtonModule,
    PoHelperModule
  ],
  exports: [PoTimepickerComponent],
  declarations: [PoTimepickerComponent]
})
export class PoTimepickerModule {}
