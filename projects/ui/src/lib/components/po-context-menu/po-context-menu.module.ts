import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconModule } from '../po-icon/po-icon.module';
import { PoTooltipModule } from '../../directives';

import { PoContextMenuComponent } from './po-context-menu.component';

/**
 * @description
 *
 * Modulo do componente po-context-menu.
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoTooltipModule],
  declarations: [PoContextMenuComponent],
  exports: [PoContextMenuComponent]
})
export class PoContextMenuModule {}
