import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoIconModule } from '../po-icon';
import { PoComboModule } from '../po-field/po-combo/po-combo.module';
import { PoButtonModule } from './../po-button/po-button.module';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';
import { PoTimerModule } from '../po-timer';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoIconModule, PoComboModule, PoButtonModule, PoTimerModule],
  declarations: [PoCalendarComponent, PoCalendarHeaderComponent, PoCalendarWrapperComponent],
  exports: [PoCalendarComponent]
})
export class PoCalendarModule {}
