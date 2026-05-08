import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { PoCleanModule } from '../po-clean';
import { PoButtonModule } from '../../po-button';
import { PoHelperModule } from '../../po-helper';
import { PoLoadingModule } from '../../po-loading';
import { PoCalendarModule } from '../../po-calendar';
import { PoFieldContainerModule } from '../po-field-container';

import { PoDatetimepickerComponent } from './po-datetimepicker.component';

/**
 * @description
 *
 * Módulo do componente `po-datetimepicker`.
 */
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    OverlayModule,
    PoCleanModule,
    PoHelperModule,
    PoButtonModule,
    PoLoadingModule,
    PoCalendarModule,
    PoFieldContainerModule
  ],
  exports: [PoDatetimepickerComponent],
  declarations: [PoDatetimepickerComponent]
})
export class PoDatetimepickerModule {}
