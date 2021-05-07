import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconModule } from '../po-icon/po-icon.module';

import { PoTagComponent } from './po-tag.component';

/**
 * @description
 *
 * Módulo do componente `po-tag`.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  declarations: [PoTagComponent],
  exports: [PoTagComponent],
  providers: [],
  schemas: []
})
export class PoTagModule {}
