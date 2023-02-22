import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoTooltipModule } from '../../directives/po-tooltip/index';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoLogoModule } from '../po-logo/po-logo.module';
import { PoMenuPanelItemComponent } from './po-menu-panel-item/po-menu-panel-item.component';
import { PoMenuPanelComponent } from './po-menu-panel.component';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';

/**
 * @description
 *
 * Módulo do componente po-menu-panel.
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoFieldModule, PoLogoModule, PoTooltipModule],
  declarations: [PoMenuPanelComponent, PoMenuPanelItemComponent],
  exports: [PoMenuPanelComponent],
  providers: [PoMenuPanelItemsService]
})
export class PoMenuPanelModule {}
