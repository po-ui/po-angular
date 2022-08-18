import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from '../../components/po-button/po-button.module';
import { PoIconModule } from '../../components/po-icon/po-icon.module';

import { PoToasterComponent } from './po-toaster/po-toaster.component';

@NgModule({
  declarations: [PoToasterComponent],
  imports: [CommonModule, PoButtonModule, PoIconModule],
  exports: [],
  providers: [],
  bootstrap: []
})
export class PoNotificationModule {}
