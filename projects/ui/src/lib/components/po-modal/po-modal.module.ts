import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoModalComponent } from './po-modal.component';
import { PoModalFooterComponent } from './po-modal-footer/po-modal-footer.component';

/**
 * @description
 * Módulo do componente po-modal
 */
@NgModule({
  imports: [CommonModule, PoButtonModule],
  declarations: [PoModalComponent, PoModalFooterComponent],
  exports: [PoModalComponent, PoModalFooterComponent]
})
export class PoModalModule {}
