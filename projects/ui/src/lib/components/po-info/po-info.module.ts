import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoInfoComponent } from './po-info.component';
import { RouterModule } from '@angular/router';
/**
 * @description
 *
 * Módulo do componente po-info.
 */
@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [PoInfoComponent],
  exports: [PoInfoComponent],
  providers: [],
  schemas: []
})
export class PoInfoModule {}
