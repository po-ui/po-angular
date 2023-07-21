import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoSelectComponent } from './po-select.component';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

@NgModule({
  declarations: [PoSelectComponent],
  imports: [CommonModule, PoFieldContainerModule],
  exports: [PoSelectComponent]
})
export class PoSelectModule {}
