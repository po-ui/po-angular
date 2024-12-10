import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { PoLinkModule } from '../po-link';
import { PoInfoComponent } from './po-info.component';
/**
 * @description
 *
 * Módulo do componente po-info.
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoLinkModule],
  declarations: [PoInfoComponent],
  exports: [PoInfoComponent],
  providers: [],
  schemas: []
})
export class PoInfoModule {}
