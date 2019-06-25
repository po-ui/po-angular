import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoDynamicModule, PoModalModule, PoPageModule, PoWidgetModule } from '@portinari/portinari-ui';

import { PoPageDynamicDetailComponent } from './po-page-dynamic-detail.component';

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
    PoWidgetModule
  ],
  declarations: [
    PoPageDynamicDetailComponent
  ],
  exports: [
    PoPageDynamicDetailComponent
  ]
})
export class PoPageDynamicDetailModule { }
