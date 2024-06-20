import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from '../../components/po-button/po-button.module';
import { PoIconModule } from '../../components/po-icon/po-icon.module';
import { PoToasterModule } from '../../components/po-toaster/po-toaster.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, PoButtonModule, PoIconModule, PoToasterModule],
  exports: [],
  providers: [],
  bootstrap: []
})
export class PoNotificationModule {}
