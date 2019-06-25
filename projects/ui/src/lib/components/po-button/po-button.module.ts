import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoButtonComponent } from './po-button.component';

/**
 * @description
 *
 * Módulo do componente po-button.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PoButtonComponent
  ],
  exports: [
    PoButtonComponent
  ]
})
export class PoButtonModule { }
