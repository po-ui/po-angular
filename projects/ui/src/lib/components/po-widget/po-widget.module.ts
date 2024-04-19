import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoIconModule } from '../po-icon';
import { PoContainerModule } from '../po-container/index';
import { PoWidgetComponent } from './po-widget.component';

/**
 * @description
 *
 * Módulo do componente po-widget
 */
@NgModule({
  imports: [CommonModule, PoContainerModule, PoIconModule],
  exports: [PoWidgetComponent],
  declarations: [PoWidgetComponent]
})
export class PoWidgetModule {}
