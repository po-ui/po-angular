import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoAccordionComponent } from './po-accordion.component';
import { PoAccordionItemBodyComponent } from './po-accordion-item-body/po-accordion-item-body.component';
import { PoAccordionItemComponent } from './po-accordion-item/po-accordion-item.component';
import { PoAccordionItemHeaderComponent } from './po-accordion-item-header/po-accordion-item-header.component';

/**
 * @description
 *
 * Módulo do componente `po-accordion`.
 *
 * > Para o correto funcionamento do componente `po-accordion`, deve ser importado o módulo `BrowserAnimationsModule` no
 * > módulo principal da sua aplicação.
 *
 * Módulo da aplicação:
 * ```
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { PoModule } from '@po-ui/ng-components';
 * ...
 *
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     PoModule
 *   ],
 *   declarations: [
 *     AppComponent,
 *     ...
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 */
@NgModule({
  imports: [CommonModule],
  declarations: [
    PoAccordionComponent,
    PoAccordionItemBodyComponent,
    PoAccordionItemComponent,
    PoAccordionItemHeaderComponent
  ],
  exports: [PoAccordionComponent, PoAccordionItemComponent]
})
export class PoAccordionModule {}
