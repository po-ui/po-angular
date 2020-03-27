import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoContainerModule } from '../po-container/po-container.module';
import { PoFieldModule } from '../po-field/po-field.module';

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
 */
@NgModule({
  declarations: [PoTreeViewComponent, PoTreeViewItemComponent, PoTreeViewItemHeaderComponent],
  exports: [PoTreeViewComponent],
  imports: [CommonModule, FormsModule, PoContainerModule, PoFieldModule]
})
export class PoTreeViewModule {}
