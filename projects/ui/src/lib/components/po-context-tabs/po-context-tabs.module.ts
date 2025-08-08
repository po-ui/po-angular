import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopoverModule } from '../po-popover/po-popover.module';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoDropdownModule } from '../po-dropdown/po-dropdown.module';
import { PoIconModule } from '../po-icon';
import { PoListBoxModule } from '../po-listbox/po-listbox.module';
import { PoTabsModule } from '../po-tabs';
import { PoContextTabButtonComponent } from './po-context-tab-button/po-context-tab-button.component';
import { PoContextTabsComponent } from './po-context-tabs.component';

/**
 * @description
 * Módulo do componente po-context-tabs
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoTooltipModule, PoTabsModule],
  declarations: [PoContextTabsComponent, PoContextTabButtonComponent],
  exports: [PoContextTabsComponent]
})
export class PoContextTabsModule {}
