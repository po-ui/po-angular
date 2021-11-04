import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoPopupComponent } from './po-popup.component';

/**
 * @description
 *
 * Módulo do componente po-popup.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  declarations: [PoPopupComponent],
  exports: [PoPopupComponent],
  providers: [],
  schemas: []
})
export class PoPopupModule {}
