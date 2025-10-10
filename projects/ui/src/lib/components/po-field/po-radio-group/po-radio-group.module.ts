import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoRadioGroupComponent } from './po-radio-group.component';
import { PoRadioModule } from '../po-radio/po-radio.module';
import { PoHelperModule } from '../../po-helper';

/**
 * @description
 *
 * Módulo do componente `po-radio-group`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldContainerModule, PoRadioModule, PoHelperModule],
  exports: [PoRadioGroupComponent],
  declarations: [PoRadioGroupComponent]
})
export class PoRadioGroupModule {}
