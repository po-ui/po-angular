import { NgModule } from '@angular/core';

import { PoModalModule } from '../../components/po-modal/po-modal.module';
import { PoDialogComponent } from './po-dialog.component';
import { PoDialogService } from './po-dialog.service';

@NgModule({
  declarations: [PoDialogComponent],
  imports: [PoModalModule],
  exports: [PoDialogComponent],
  providers: [PoDialogService]
})
export class PoDialogModule {}
