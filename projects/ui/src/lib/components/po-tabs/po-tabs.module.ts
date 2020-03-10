import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopoverModule } from '../po-popover/po-popover.module';

import { PoTabButtonComponent } from './po-tab-button/po-tab-button.component';
import { PoTabComponent } from './po-tab/po-tab.component';
import { PoTabDropdownComponent } from './po-tab-dropdown/po-tab-dropdown.component';
import { PoTabsComponent } from './po-tabs.component';

/**
 * @description
 * Módulo do componente po-tabs
 */
@NgModule({
  imports: [CommonModule, PoPopoverModule],
  declarations: [PoTabButtonComponent, PoTabComponent, PoTabDropdownComponent, PoTabsComponent],
  exports: [PoTabComponent, PoTabsComponent]
})
export class PoTabsModule {}
