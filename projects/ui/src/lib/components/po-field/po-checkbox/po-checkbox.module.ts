import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoCheckboxComponent } from './po-checkbox.component';
import { PoLabelModule } from '../../po-label/po-label.module';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

@NgModule({
  declarations: [PoCheckboxComponent],
  exports: [PoCheckboxComponent],
  imports: [CommonModule, FormsModule, PoLabelModule, PoFieldContainerModule]
})
export class PoCheckboxModule {}
