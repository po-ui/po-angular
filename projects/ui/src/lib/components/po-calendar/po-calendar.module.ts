import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconModule } from '../po-icon';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  declarations: [PoCalendarComponent, PoCalendarHeaderComponent, PoCalendarWrapperComponent],
  exports: [PoCalendarComponent]
})
export class PoCalendarModule {}
