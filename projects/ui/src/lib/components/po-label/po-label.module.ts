import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoLabelComponent } from './po-label.component';

@NgModule({
  declarations: [PoLabelComponent],
  exports: [PoLabelComponent],
  imports: [CommonModule]
})
export class PoLabelModule {}
