import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoHelperComponent } from './po-helper.component';

import { PoIconModule } from '../po-icon/index';
import { PoLinkModule } from '../po-link/index';
import { PoPopoverModule } from '../po-popover/index';
import { PoDividerModule } from '../po-divider/index';
import { PoButtonModule } from '@po-ui/ng-components';

/**
 * @description
 * Módulo do componente po-helper
 */
@NgModule({
  imports: [CommonModule, PoIconModule, PoPopoverModule, PoLinkModule, PoDividerModule, PoButtonModule],
  declarations: [PoHelperComponent],
  exports: [PoHelperComponent]
})
export class PoHelperModule {}
