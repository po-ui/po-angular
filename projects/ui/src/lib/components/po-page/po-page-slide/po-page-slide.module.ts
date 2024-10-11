import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoPageSlideComponent } from './po-page-slide.component';
import { PoButtonModule } from './../../po-button/po-button.module';
import { PoDividerModule } from '../../po-divider/po-divider.module';
import { PoPageSlideFooterComponent } from './po-page-slide-footer/po-page-slide-footer.component';

@NgModule({
  declarations: [PoPageSlideComponent, PoPageSlideFooterComponent],
  exports: [PoPageSlideComponent, PoPageSlideFooterComponent],
  imports: [CommonModule, FormsModule, PoButtonModule, PoDividerModule]
})
export class PoPageSlideModule {}
