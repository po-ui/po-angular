import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoRadioComponent } from './po-radio.component';
import { PoLabelModule } from '../../po-label/po-label.module';

@NgModule({
  declarations: [PoRadioComponent],
  exports: [PoRadioComponent],
  imports: [CommonModule, FormsModule, PoLabelModule]
})
export class PoRadioModule {}
