import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoFieldModule } from '../po-field/po-field.module';
import { PoMenuPanelComponent } from './po-menu-panel.component';
import { PoMenuPanelItemComponent } from './po-menu-panel-item/po-menu-panel-item.component';
import { PoMenuPanelItemsService } from './services/po-menu-panel-items.service';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

/**
 * @description
 *
 * Módulo do componente po-menu-panel.
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoFieldModule, PoTooltipModule],
  declarations: [PoMenuPanelComponent, PoMenuPanelItemComponent],
  exports: [PoMenuPanelComponent],
  providers: [PoMenuPanelItemsService]
})
export class PoMenuPanelModule {}
