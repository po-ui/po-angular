import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { PoAvatarModule } from '../po-avatar';
import { PoIconModule } from '../po-icon';
import { PoButtonModule } from '../po-button';
import { PoContainerModule } from '../po-container/index';
import { PoPopupModule } from '../po-popup';
import { PoTagModule } from '../po-tag';
import { PoTooltipModule } from '../../directives';

import { PoWidgetComponent } from './po-widget.component';
import { PoWidgetDraggableDirective } from './po-widget-draggable.directive';

/**
 * @description
 *
 * Módulo do componente po-widget
 */
@NgModule({
  imports: [CommonModule, PoAvatarModule, PoButtonModule, PoContainerModule, PoIconModule, PoPopupModule, PoTagModule, PoTooltipModule, DragDropModule],
  exports: [PoWidgetComponent],
  declarations: [PoWidgetComponent, PoWidgetDraggableDirective]
})
export class PoWidgetModule {}
