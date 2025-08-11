import { NgModule } from '@angular/core';
import { PoHeaderComponent } from './po-header.component';
import { CommonModule } from '@angular/common';
import { PoDropdownModule } from '../po-dropdown';
import { PoIconModule } from '../po-icon';
import { PoButtonModule } from '../po-button';
import { PoBadgeModule } from '../po-badge';
import { PoAvatarModule } from '../po-avatar';
import { PoPopoverModule } from '../po-popover';
import { PoHeaderbrandComponent } from './po-header-brand/po-header-brand.component';
import { PoHeaderMenuItemComponent } from './po-header-menu-item/po-header-menu-item.component';
import { PoHeaderToolsComponent } from './po-header-tools/po-header-tools.component';
import { PoHeaderCustomerComponent } from './po-header-customer/po-header-customer.component';
import { PoTooltipModule } from '../../directives';
import { PoPopupModule } from '../po-popup';

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
    PoPopupModule
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
