import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoNavbarActionComponent } from './po-navbar-action/po-navbar-action.component';
import { PoNavbarActionPopupComponent } from './po-navbar-action-popup/po-navbar-action-popup.component';
import { PoNavbarActionsComponent } from './po-navbar-actions.component';
import { PoPopupModule } from '../../po-popup/po-popup.module';
import { PoTooltipModule } from '../../../directives/po-tooltip/po-tooltip.module';
import { PoIconModule } from './../../po-icon/po-icon.module';

@NgModule({
  imports: [CommonModule, PoPopupModule, PoTooltipModule, PoIconModule],
  declarations: [PoNavbarActionComponent, PoNavbarActionPopupComponent, PoNavbarActionsComponent],
  exports: [PoNavbarActionsComponent]
})
export class PoNavbarActionsModule {}
