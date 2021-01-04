import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoLoadingModule } from './../po-loading/index';

import { PoButtonComponent } from './po-button.component';

/**
 * @description
 *
 * Módulo do componente po-button.
 */
@NgModule({
  imports: [CommonModule, PoLoadingModule],
  declarations: [PoButtonComponent],
  exports: [PoButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PoButtonModule {}
