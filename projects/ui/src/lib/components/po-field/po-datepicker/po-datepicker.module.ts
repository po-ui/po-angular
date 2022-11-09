import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoCalendarModule } from '../../po-calendar/po-calendar.module';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoCleanModule } from '../po-clean/po-clean.module';
import { PoButtonModule } from '../../po-button';

import { PoDatepickerComponent } from './po-datepicker.component';

/**
 * @description
 *
 * Módulo do componente `po-datepicker`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldContainerModule, PoCleanModule, PoCalendarModule, PoButtonModule],
  exports: [PoDatepickerComponent],
  declarations: [PoDatepickerComponent]
})
export class PoDatepickerModule {}
