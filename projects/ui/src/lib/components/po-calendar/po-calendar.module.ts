import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoIconModule } from '../po-icon';
import { PoComboModule } from '../po-field/po-combo/po-combo.module';
import { PoButtonModule } from './../po-button/po-button.module';
import { PoCalendarComponent } from './po-calendar.component';
import { PoCalendarFooterComponent } from './po-calendar-footer/po-calendar-footer.component';
import { PoCalendarHeaderComponent } from './po-calendar-header/po-calendar-header.component';
import { PoCalendarPresetListComponent } from './po-calendar-preset-list/po-calendar-preset-list.component';
import { PoCalendarWrapperComponent } from './po-calendar-wrapper/po-calendar-wrapper.component';

/**
 * @description
 * Módulo do componente `po-calendar`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoIconModule, PoComboModule, PoButtonModule],
  declarations: [PoCalendarComponent, PoCalendarFooterComponent, PoCalendarHeaderComponent, PoCalendarPresetListComponent, PoCalendarWrapperComponent],
  exports: [PoCalendarComponent]
})
export class PoCalendarModule {}
