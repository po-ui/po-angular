import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoModalComponent } from './po-modal.component';

/**
 * @description
 * Módulo do componente po-modal
 */
@NgModule({
  imports: [CommonModule, PoButtonModule],
  declarations: [PoModalComponent],
  exports: [PoModalComponent]
})
export class PoModalModule {}
