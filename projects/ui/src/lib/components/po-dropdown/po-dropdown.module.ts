import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopupModule } from '../po-popup/po-popup.module';

import { PoDropdownComponent } from './po-dropdown.component';
/**
 * @description
 * Módulo do componente po-dropdown.
 */
@NgModule({
  imports: [CommonModule, PoPopupModule],
  declarations: [PoDropdownComponent],
  exports: [PoDropdownComponent]
})
export class PoDropdownModule {}
