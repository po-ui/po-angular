import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoFieldContainerComponent } from './po-field-container.component';
import { PoFieldContainerBottomComponent } from './po-field-container-bottom/po-field-container-bottom.component';

/**
 * @description
 *
 * Módulo do componente po-field-container.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    PoFieldContainerBottomComponent,
    PoFieldContainerComponent
  ],
  declarations: [
    PoFieldContainerBottomComponent,
    PoFieldContainerComponent
  ]
})
export class PoFieldContainerModule { }
