import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoListBoxModule } from '../po-listbox/po-listbox.module';

import { PoPopupComponent } from './po-popup.component';

/**
 * @description
 *
 * Módulo do componente po-popup.
 */
@NgModule({
  imports: [CommonModule, PoListBoxModule],
  declarations: [PoPopupComponent],
  exports: [PoPopupComponent],
  providers: [],
  schemas: []
})
export class PoPopupModule {}
