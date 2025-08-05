import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoTooltipModule } from '../../directives';
import { PoAvatarModule } from '../po-avatar';
import { PoBadgeModule } from '../po-badge';
import { PoButtonModule } from '../po-button';
import { PoDropdownModule } from '../po-dropdown';
import { PoIconModule } from '../po-icon';
import { PoMenuModule } from '../po-menu';
import { PoPopoverModule } from '../po-popover';
import { PoPopupModule } from '../po-popup';
import { PoHeaderbrandComponent } from './po-header-brand/po-header-brand.component';
import { PoHeaderCustomerComponent } from './po-header-customer/po-header-customer.component';
import { PoHeaderMenuItemComponent } from './po-header-menu-item/po-header-menu-item.component';
import { PoHeaderToolsComponent } from './po-header-tools/po-header-tools.component';
import { PoHeaderComponent } from './po-header.component';

/**
 * @description
 *
 * Módulo do componente `po-header`.
 */

@NgModule({
  imports: [
    CommonModule,
    PoDropdownModule,
    PoIconModule,
    PoButtonModule,
    PoBadgeModule,
    PoAvatarModule,
    PoPopoverModule,
    PoTooltipModule,
    PoPopupModule,
    PoMenuModule,
    RouterModule
  ],
  declarations: [
    PoHeaderComponent,
    PoHeaderbrandComponent,
    PoHeaderMenuItemComponent,
    PoHeaderToolsComponent,
    PoHeaderCustomerComponent
  ],
  exports: [PoHeaderComponent]
})
export class PoHeaderModule {}
