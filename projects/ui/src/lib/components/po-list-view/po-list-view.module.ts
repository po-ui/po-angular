import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoButtonModule } from '../po-button/po-button.module';
import { PoPopupModule } from '../po-popup/po-popup.module';
import { PoCheckboxModule } from './../po-field/po-checkbox/po-checkbox.module';

import { PoListViewComponent } from './po-list-view.component';
import { PoListViewContentTemplateDirective } from './po-list-view-content-template/po-list-view-content-template.directive';
import { PoListViewDetailTemplateDirective } from './po-list-view-detail-template/po-list-view-detail-template.directive';
import { PoContainerModule } from '../po-container/po-container.module';

/**
 * @description
 *
 * Módulo do componente `po-list-view`.
 *
 * > Para o correto funcionamento do componente `po-list-view`, deve ser importado o módulo `BrowserAnimationsModule` no
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
    FormsModule,
    RouterModule,
    PoButtonModule,
    PoPopupModule,
    PoCheckboxModule,
    PoContainerModule
  ],
  declarations: [PoListViewComponent, PoListViewContentTemplateDirective, PoListViewDetailTemplateDirective],
  exports: [PoListViewComponent, PoListViewContentTemplateDirective, PoListViewDetailTemplateDirective],
  providers: [],
  schemas: []
})
export class PoListViewModule {}
