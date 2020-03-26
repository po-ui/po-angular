import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoDynamicModule, PoModalModule, PoPageModule, PoWidgetModule } from '@po-ui/ng-components';

import { PoPageDynamicDetailComponent } from './po-page-dynamic-detail.component';
import { PoPageDynamicModule } from '../../services/po-page-dynamic/po-page-dynamic.module';

/**
 * @description
 *
 * Módulo do template do po-page-dynamic-detail.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoDynamicModule,
    PoModalModule,
    PoPageModule,
    PoWidgetModule,
    PoPageDynamicModule
  ],
  declarations: [PoPageDynamicDetailComponent],
  exports: [PoPageDynamicDetailComponent]
})
export class PoPageDynamicDetailModule {}
