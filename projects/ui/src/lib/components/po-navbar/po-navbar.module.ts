import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoMenuModule } from '../po-menu/po-menu.module';
import { PoIconModule } from './../po-icon/po-icon.module';
import { PoLogoModule } from './../po-logo/po-logo.module';
import { PoNavbarActionsModule } from './po-navbar-actions/po-navbar-actions.module';
import { PoNavbarItemNavigationModule } from './po-navbar-item-navigation/po-navbar-item-navigation.module';
import { PoNavbarItemsModule } from './po-navbar-items/po-navbar-items.module';
import { PoNavbarLogoComponent } from './po-navbar-logo/po-navbar-logo.component';
import { PoNavbarComponent } from './po-navbar.component';

/**
 * @deprecated v23.x.x use `po-header`
 *
 * @description
 *
 * Módulo do componente `po-navbar`.
 * > Esse componente está **depreciado** e será removido na `v23.x.x`. Recomendamos utilizar o componente
 * [po-header](https://po-ui.io/documentation/po-header), que oferece compatibilidade com todas as funcionalidades do
 * `po-navbar`, além de maior flexibilidade, usabilidade e acessibilidade.
 */
@NgModule({
  imports: [
    CommonModule,
    PoIconModule,
    PoLogoModule,
    PoMenuModule,
    PoNavbarActionsModule,
    PoNavbarItemNavigationModule,
    PoNavbarItemsModule
  ],
  declarations: [PoNavbarComponent, PoNavbarLogoComponent],
  exports: [PoNavbarComponent]
})
export class PoNavbarModule {}
