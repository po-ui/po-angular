import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoAvatarModule } from '../po-avatar';
import { PoIconModule } from '../po-icon';
import { PoButtonModule } from '../po-button';
import { PoContainerModule } from '../po-container/index';
import { PoPopupModule } from '../po-popup';
import { PoTagModule } from '../po-tag';
import { PoTooltipModule } from '../../directives';

import { PoWidgetComponent } from './po-widget.component';

/**
 * @description
 *
 * Módulo do componente po-widget
 */
@NgModule({
  imports: [
    CommonModule,
    PoAvatarModule,
    PoButtonModule,
    PoContainerModule,
    PoIconModule,
    PoPopupModule,
    PoTagModule,
    PoTooltipModule
  ],
  exports: [PoWidgetComponent],
  declarations: [PoWidgetComponent]
})
export class PoWidgetModule {}
