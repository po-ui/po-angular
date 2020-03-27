import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

import { PoAccordionService } from '../services/po-accordion.service';

/**
 * @description
 *
 * Componente utilizado para renderizar os itens do `po-accordion`.
 *
 * O componente `po-accordion` já faz o controle de abertura e fechamento dos itens automaticamente,
 * mas caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript, pode ser feita da seguinte forma:
 *
 * ```
 * <po-accordion>
 *   <po-accordion-item p-label="PO Accordion 1" #item1>
 *      Accordion 1
 *   </po-accordion-item>
 *
 *   <po-accordion-item p-label="PO Accordion 2">
 *      Accordion 2
 *   </po-accordion-item>
 * </po-accordion>
 * ```
 *
 * e no typescript pode-se utilizar o `@ViewChild`:
 *
 * ```
 *  @ViewChild(PoAccordionItemComponent, { static: true }) item1: PoAccordionItemComponent;
 *
 *  ngAfterContentInit() {
 *    // ou utilizar o método collapse()
 *    this.item1.expand();
 *  }
 * ```
 */
@Component({
  selector: 'po-accordion-item',
  templateUrl: 'po-accordion-item.component.html'
})
export class PoAccordionItemComponent {
  expanded: boolean;

  /** Título do item. */
  @Input('p-label') label: string;

  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;

  constructor(private accordionService: PoAccordionService) {}

  /**
   * Método para colapsar o `po-accordion-item`.
   */
  collapse() {
    this.expanded = false;

    this.accordionService.sendToParentAccordionItemClicked(this);
  }

  /**
   * Método para expandir o `po-accordion-item`.
   */
  expand() {
    this.expanded = true;

    this.accordionService.sendToParentAccordionItemClicked(this);
  }
}
