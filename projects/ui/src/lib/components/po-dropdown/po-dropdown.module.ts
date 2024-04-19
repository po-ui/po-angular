import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPopupModule } from '../po-popup/po-popup.module';

import { PoDropdownComponent } from './po-dropdown.component';
import { PoIconModule } from '../po-icon';
/**
 * @description
 * Módulo do componente po-dropdown.
 */
@NgModule({
  imports: [CommonModule, PoPopupModule, PoIconModule],
  declarations: [PoDropdownComponent],
  exports: [PoDropdownComponent]
})
export class PoDropdownModule {}
