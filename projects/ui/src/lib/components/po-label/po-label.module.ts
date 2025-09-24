import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoLabelComponent } from './po-label.component';
import { PoHelperModule } from '../po-helper';

@NgModule({
  declarations: [PoLabelComponent],
  exports: [PoLabelComponent],
  imports: [CommonModule, PoHelperModule]
})
export class PoLabelModule {}
