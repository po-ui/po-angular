import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoPageSlideComponent } from './po-page-slide.component';
import { PoButtonModule } from './../../po-button/po-button.module';

@NgModule({
  declarations: [PoPageSlideComponent],
  exports: [PoPageSlideComponent],
  imports: [CommonModule, FormsModule, PoButtonModule]
})
export class PoPageSlideModule {}
