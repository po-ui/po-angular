import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopoverModule } from '../po-popover/po-popover.module';

import { PoTabButtonComponent } from './po-tab-button/po-tab-button.component';
import { PoTabComponent } from './po-tab/po-tab.component';
import { PoTabDropdownComponent } from './po-tab-dropdown/po-tab-dropdown.component';
import { PoTabsComponent } from './po-tabs.component';
import { PoDropdownModule } from '../po-dropdown/po-dropdown.module';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoListBoxModule } from '../po-listbox/po-listbox.module';
import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';
import { PoTabsService } from './po-tabs.service';

/**
 * @description
 * Módulo do componente po-tabs
 */
@NgModule({
  imports: [CommonModule, PoPopoverModule, PoDropdownModule, PoTooltipModule, PoButtonModule, PoListBoxModule],
  declarations: [PoTabButtonComponent, PoTabComponent, PoTabDropdownComponent, PoTabsComponent],
  exports: [PoTabComponent, PoTabsComponent],
  providers: [PoTabsService]
})
export class PoTabsModule {}
