import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoContainerModule } from '../po-container/po-container.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoIconModule } from '../po-icon/po-icon.module';

import { PoTreeViewComponent } from './po-tree-view.component';
import { PoTreeViewItemComponent } from './po-tree-view-item/po-tree-view-item.component';
import { PoTreeViewItemHeaderComponent } from './po-tree-view-item-header/po-tree-view-item-header.component';

/**
 * @description
 *
 * Módulo do componente `po-tree-view`.
 *
 * > Para o correto funcionamento do componente `po-tree-view`, deve ser importado o módulo `BrowserAnimationsModule` no
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
 *
 * Em aplicações Standalone, utilize a seguinte configuração para o bootstrap:
 *
 * ```
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { AppComponent } from './app.component';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [importProvidersFrom(BrowserAnimationsModule)]
 * }).catch(err => console.error(err));
 * ```
 */
@NgModule({
  declarations: [PoTreeViewComponent, PoTreeViewItemComponent, PoTreeViewItemHeaderComponent],
  exports: [PoTreeViewComponent],
  imports: [CommonModule, FormsModule, PoContainerModule, PoFieldModule, PoIconModule]
})
export class PoTreeViewModule {}
