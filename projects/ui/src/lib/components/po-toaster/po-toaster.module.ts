import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoToasterComponent } from './po-toaster.component';
import { PoIconModule } from '../po-icon';
import { PoButtonModule } from '../po-button';

/**
 * @description
 *
 * Módulo do componente po-toaster.
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoButtonModule],
  declarations: [PoToasterComponent],
  exports: [PoToasterComponent]
})
export class PoToasterModule {}
