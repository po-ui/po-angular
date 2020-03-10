import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoCheckboxGroupComponent } from './po-checkbox-group.component';

/**
 * @description
 *
 * Módulo do componente `po-checkbox-group`.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldContainerModule],
  exports: [PoCheckboxGroupComponent],
  declarations: [PoCheckboxGroupComponent]
})
export class PoCheckboxGroupModule {}
