import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoIconModule } from './../po-icon/po-icon.module';
import { PoModalComponent } from './po-modal.component';
import { PoModalFooterComponent } from './po-modal-footer/po-modal-footer.component';

/**
 * @description
 * Módulo do componente po-modal
 */
@NgModule({
  imports: [CommonModule, PoButtonModule, PoIconModule],
  declarations: [PoModalComponent, PoModalFooterComponent],
  exports: [PoModalComponent, PoModalFooterComponent]
})
export class PoModalModule {}
