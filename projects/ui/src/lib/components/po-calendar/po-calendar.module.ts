import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoCalendarService } from './services/po-calendar.service';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoCalendarComponent],
  exports: [PoCalendarComponent],
  providers: [PoCalendarLangService, PoCalendarService]
})
export class PoCalendarModule {}
