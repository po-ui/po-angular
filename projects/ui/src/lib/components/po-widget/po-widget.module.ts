import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PoTooltipModule } from '../../directives';
import { PoAvatarModule } from '../po-avatar';
import { PoButtonModule } from '../po-button';
import { PoContainerModule } from '../po-container/index';
import { PoCheckboxModule } from '../po-field/po-checkbox/po-checkbox.module';
import { PoRadioModule } from '../po-field/po-radio/po-radio.module';
import { PoIconModule } from '../po-icon';
import { PoPopupModule } from '../po-popup';
import { PoTagModule } from '../po-tag';

import { PoWidgetComponent } from './po-widget.component';

/**
 * @description
 *
 * Módulo do componente po-widget
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoAvatarModule,
    PoButtonModule,
    PoCheckboxModule,
    PoContainerModule,
    PoIconModule,
    PoPopupModule,
    PoRadioModule,
    PoTagModule,
    PoTooltipModule
  ],
  exports: [PoWidgetComponent],
  declarations: [PoWidgetComponent]
})
export class PoWidgetModule {}
