import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoIconModule } from '../po-icon';
import { PoContainerModule } from '../po-container/index';
import { PoWidgetComponent } from './po-widget.component';
import { PoTagModule } from '../po-tag';
import { PoButtonModule } from '../po-button';
import { PoPopupModule } from '../po-popup';
import { PoTooltipModule } from '../../directives';

/**
 * @description
 *
 * Módulo do componente po-widget
 */
@NgModule({
  imports: [CommonModule, PoContainerModule, PoIconModule, PoTagModule, PoButtonModule, PoPopupModule, PoTooltipModule],
  exports: [PoWidgetComponent],
  declarations: [PoWidgetComponent]
})
export class PoWidgetModule {}
