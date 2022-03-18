import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoIconModule } from './../po-icon/index';
import { PoTooltipModule } from './../../directives/po-tooltip/index';
import { PoLoadingModule } from './../po-loading/index';

import { PoButtonComponent } from './po-button.component';

/**
 * @description
 *
 * Módulo do componente po-button.
 */
@NgModule({
  imports: [CommonModule, PoLoadingModule, PoIconModule, PoTooltipModule],
  declarations: [PoButtonComponent],
  exports: [PoButtonComponent]
})
export class PoButtonModule {}
