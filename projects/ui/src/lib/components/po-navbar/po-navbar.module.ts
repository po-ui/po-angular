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
 * @description
 *
 * Módulo do componente `po-navbar`.
 *
 * > Para o correto funcionamento do componente `po-navbar`, deve ser importado o módulo `BrowserAnimationsModule` no
 * > módulo principal da sua aplicação.
 *
 * Módulo da aplicação:
 * ```
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { PoModule } from '@po-ui/ng-components';
 * ...
 *
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     PoModule
 *   ],
 *   declarations: [
 *     AppComponent,
 *     ...
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
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
