import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoLogoComponent } from './po-logo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PoLogoComponent],
  exports: [PoLogoComponent]
})
export class PoLogoModule {}
