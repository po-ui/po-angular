import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconModule } from '../po-icon/po-icon.module';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoTagComponent } from './po-tag.component';

/**
 * @description
 *
 * Módulo do componente `po-tag`.
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoTooltipModule],
  declarations: [PoTagComponent],
  exports: [PoTagComponent],
  providers: [],
  schemas: []
})
export class PoTagModule {}
