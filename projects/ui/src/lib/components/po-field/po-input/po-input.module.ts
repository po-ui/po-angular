import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoInputComponent } from './po-input.component';
import { PoCleanModule } from '../po-clean/po-clean.module';

/**
 * @description
 *
 * Módulo do componente `po-url`.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoCleanModule,
    PoFieldContainerModule
  ],
  exports: [
    PoInputComponent
  ],
  declarations: [
    PoInputComponent
  ]
})
export class PoInputModule { }
