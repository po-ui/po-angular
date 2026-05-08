import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PoIconModule } from '../po-icon';
import { PoTimerModule } from '../po-timer';
import { PoCalendarComponent } from './po-calendar.component';
import { PoButtonModule } from './../po-button/po-button.module';
import { PoComboModule } from '../po-field/po-combo/po-combo.module';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarFooterComponent } from './po-calendar-footer/po-calendar-footer.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';
import { PoCalendarPresetListComponent } from './po-calendar-preset-list/po-calendar-preset-list.component';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoIconModule, PoComboModule, PoButtonModule, PoTimerModule],
  declarations: [
    PoCalendarComponent,
    PoCalendarFooterComponent,
    PoCalendarHeaderComponent,
    PoCalendarWrapperComponent,
    PoCalendarPresetListComponent
  ],
  exports: [PoCalendarComponent]
})
export class PoCalendarModule {}
