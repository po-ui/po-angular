import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoToasterComponent } from './po-toaster/po-toaster.component';

@NgModule({
  declarations: [
    PoToasterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
  ],
  entryComponents: [
    PoToasterComponent
  ],
  providers: [],
  bootstrap: []
})
export class PoNotificationModule { }
