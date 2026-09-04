import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoButtonModule } from '../po-button/po-button.module';
import { PoIconModule } from '../po-icon/po-icon.module';
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
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PoButtonModule,
    PoIconModule,
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
