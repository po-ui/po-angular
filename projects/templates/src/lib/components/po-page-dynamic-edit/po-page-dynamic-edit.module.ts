import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  PoButtonModule,
  PoDividerModule,
  PoDynamicModule,
  PoGridModule,
  PoPageModule,
  PoWidgetModule
} from '@po-ui/ng-components';

import { PoPageDynamicEditComponent } from './po-page-dynamic-edit.component';
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

    PoButtonModule,
    PoDividerModule,
    PoDynamicModule,
    PoGridModule,
    PoPageModule,
    PoWidgetModule,
    PoPageDynamicModule
  ],
  declarations: [PoPageDynamicEditComponent],
  exports: [PoPageDynamicEditComponent]
})
export class PoPageDynamicEditModule {}
