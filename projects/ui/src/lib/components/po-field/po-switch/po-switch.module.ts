import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PoSwitchComponent } from './po-switch.component';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

/**
 * @description
 *
 * Módulo do componente po-switch
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoFieldContainerModule
  ],
  exports: [
    PoSwitchComponent
  ],
  declarations: [
    PoSwitchComponent
  ]
})
export class PoSwitchModule { }
