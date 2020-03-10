import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoButtonModule } from './../po-button/index';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoButtonGroupComponent } from './po-button-group.component';

/**
 * @description
 *
 * Módulo do componente po-button-group.
 */
@NgModule({
  imports: [CommonModule, PoButtonModule, PoTooltipModule],
  declarations: [PoButtonGroupComponent],
  exports: [PoButtonGroupComponent]
})
export class PoButtonGroupModule {}
