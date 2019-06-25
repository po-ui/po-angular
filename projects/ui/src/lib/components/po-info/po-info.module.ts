import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoInfoComponent } from './po-info.component';
/**
 * @description
 *
 * Módulo do componente po-info.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PoInfoComponent
  ],
  exports: [PoInfoComponent],
  providers: [],
  schemas: []
})
export class PoInfoModule { }
