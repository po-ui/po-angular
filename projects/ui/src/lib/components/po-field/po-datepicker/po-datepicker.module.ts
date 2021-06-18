import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoCleanModule } from '../po-clean/po-clean.module';

import { PoCalendarComponent } from './po-calendar/po-calendar.component';
import { PoDatepickerComponent } from './po-datepicker.component';

/**
 * @description
 *
 * Módulo do componente `po-datepicker`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldContainerModule, PoCleanModule],
  exports: [PoDatepickerComponent],
  declarations: [PoDatepickerComponent, PoCalendarComponent]
})
export class PoDatepickerModule {}
