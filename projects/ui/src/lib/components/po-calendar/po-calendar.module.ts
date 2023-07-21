import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';

import { PoButtonModule } from '../../components/po-button/po-button.module';
import { PoSelectModule } from '../../components/po-field/po-select/po-select.module';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule, PoButtonModule, PoSelectModule],
  declarations: [PoCalendarComponent, PoCalendarHeaderComponent, PoCalendarWrapperComponent],
  exports: [PoCalendarComponent]
})
export class PoCalendarModule {}
