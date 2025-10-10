import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoCheckboxGroupComponent } from './po-checkbox-group.component';
import { PoCheckboxModule } from '../po-checkbox/po-checkbox.module';
import { PoHelperModule } from '../../po-helper';

/**
 * @description
 *
 * Módulo do componente `po-checkbox-group`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldContainerModule, PoCheckboxModule, PoHelperModule],
  exports: [PoCheckboxGroupComponent],
  declarations: [PoCheckboxGroupComponent]
})
export class PoCheckboxGroupModule {}
