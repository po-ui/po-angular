import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoSwitchComponent } from './po-switch.component';
import { PoIconModule } from '../../po-icon';
import { PoLabelModule } from '../../po-label';

import { PoFieldContainerModule } from './../po-field-container/po-field-container.module';
@NgModule({
  declarations: [PoSwitchComponent],
  exports: [PoSwitchComponent],
  imports: [CommonModule, FormsModule, PoFieldContainerModule, PoLabelModule, PoIconModule]
})
export class PoSwitchModule {}
