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
} from '@portinari/portinari-ui';

import { PoPageDynamicEditComponent } from './po-page-dynamic-edit.component';

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
    PoWidgetModule
  ],
  declarations: [
    PoPageDynamicEditComponent
  ],
  exports: [
    PoPageDynamicEditComponent
  ]
})
export class PoPageDynamicEditModule { }
