import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoMenuModule } from '../po-menu/po-menu.module';
import { PoNavbarActionsModule } from './po-navbar-actions/po-navbar-actions.module';
import { PoNavbarComponent } from './po-navbar.component';
import { PoNavbarItemsModule } from './po-navbar-items/po-navbar-items.module';
import { PoNavbarItemNavigationComponent } from './po-navbar-item-navigation/po-navbar-item-navigation.component';
import { PoNavbarLogoComponent } from './po-navbar-logo/po-navbar-logo.component';

@NgModule({
  imports: [
    CommonModule,
    PoNavbarActionsModule,
    PoNavbarItemsModule,
    PoMenuModule
  ],
  declarations: [
    PoNavbarComponent,
    PoNavbarItemNavigationComponent,
    PoNavbarLogoComponent
  ],
  exports: [
    PoNavbarComponent
  ]
})
export class PoNavbarModule { }
