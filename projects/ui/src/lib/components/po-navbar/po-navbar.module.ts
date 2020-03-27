import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoMenuModule } from '../po-menu/po-menu.module';
import { PoNavbarActionsModule } from './po-navbar-actions/po-navbar-actions.module';
import { PoNavbarComponent } from './po-navbar.component';
import { PoNavbarItemsModule } from './po-navbar-items/po-navbar-items.module';
import { PoNavbarLogoComponent } from './po-navbar-logo/po-navbar-logo.component';
import { PoNavbarItemNavigationModule } from './po-navbar-item-navigation/po-navbar-item-navigation.module';

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
  imports: [CommonModule, PoNavbarActionsModule, PoNavbarItemsModule, PoNavbarItemNavigationModule, PoMenuModule],
  declarations: [PoNavbarComponent, PoNavbarLogoComponent],
  exports: [PoNavbarComponent]
})
export class PoNavbarModule {}
