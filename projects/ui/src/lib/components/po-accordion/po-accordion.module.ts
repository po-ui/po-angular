import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoDividerModule } from '../po-divider';
import { PoIconModule } from '../po-icon';
import { PoTagModule } from '../po-tag';
import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoAccordionItemBodyComponent } from './po-accordion-item-body/po-accordion-item-body.component';
import { PoAccordionItemHeaderComponent } from './po-accordion-item-header/po-accordion-item-header.component';
import { PoAccordionItemComponent } from './po-accordion-item/po-accordion-item.component';
import { PoAccordionManagerComponent } from './po-accordion-manager/po-accordion-manager.component';
import { PoAccordionComponent } from './po-accordion.component';

/**
 * @description
 *
 * Módulo do componente `po-accordion`.
 */
@NgModule({
  imports: [CommonModule, PoTagModule, PoIconModule, PoDividerModule, PoTooltipModule],
  declarations: [
    PoAccordionComponent,
    PoAccordionItemBodyComponent,
    PoAccordionItemComponent,
    PoAccordionItemHeaderComponent,
    PoAccordionManagerComponent
  ],
  exports: [PoAccordionComponent, PoAccordionItemComponent]
})
export class PoAccordionModule {}
