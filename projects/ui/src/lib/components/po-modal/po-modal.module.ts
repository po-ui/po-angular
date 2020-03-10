import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoModalComponent } from './po-modal.component';
import { PoModalService } from './po-modal-service';

/**
 * @description
 * Módulo do componente po-modal
 */
@NgModule({
  imports: [CommonModule, PoButtonModule],
  declarations: [PoModalComponent],
  exports: [PoModalComponent],
  providers: [PoModalService]
})
export class PoModalModule {}
