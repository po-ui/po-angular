import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, filter } from 'rxjs';

import { convertToBoolean } from '../../../utils/util';
import { PoTagType } from '../../po-tag';
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
export class PoAccordionItemComponent implements OnDestroy {
  private _type?: PoTagType;

  /** Título do item. */
  @Input('p-label') label: string;

  /**
   * @optional
   *
   * @description
   *
   * Label da Tag.
   *
   */
  @Input('p-label-tag') labelTag: string;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita item.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled', transform: convertToBoolean }) disabledItem: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo da *tag* caso ela esteja sendo exibida.
   *
   * Valores válidos:
   *  - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
   *  - `warning`: cor amarela que representa aviso ou advertência.
   *  - `danger`: cor vermelha para erro ou aviso crítico.
   *  - `info`: cor cinza escuro que caracteriza conteúdo informativo.
   *
   *
   * @default `info`
   */
  @Input('p-type-tag') set typeTag(value: PoTagType) {
    this._type = (<any>Object).values(PoTagType).includes(value) ? value : undefined;
  }

  get typeTag(): PoTagType {
    return this._type;
  }

  /** Evento disparado ao expandir o item, seja manualmente ou programaticamente. */
  @Output('p-expand') expandEvent = new EventEmitter<void>();

  /** Evento disparado ao retrair o item, seja manualmente ou programaticamente. */
  @Output('p-collapse') collapseEvent = new EventEmitter<void>();

  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;

  expanded: boolean;

  private expandSubscription: Subscription;
  private collapseSubscription: Subscription;

  constructor(private accordionService: PoAccordionService) {
    this.expandSubscription = this.accordionService
      .receiveFromChildAccordionClicked()
      .pipe(filter(poAccordionItem => poAccordionItem === this && poAccordionItem.expanded))
      .subscribe(() => {
        this.expandEvent.emit();
      });

    this.collapseSubscription = this.accordionService
      .receiveFromChildAccordionClicked()
      .pipe(filter(poAccordionItem => poAccordionItem === this && !poAccordionItem.expanded))
      .subscribe(() => {
        this.collapseEvent.emit();
      });
  }

  ngOnDestroy(): void {
    this.expandSubscription.unsubscribe();
    this.collapseSubscription.unsubscribe();
  }

  /**
   * Método para colapsar o `po-accordion-item`.
   */
  collapse() {
    if (!this.disabledItem) {
      this.expanded = false;

      this.accordionService.sendToParentAccordionItemClicked(this);
    }
  }

  /**
   * Método para expandir o `po-accordion-item`.
   */
  expand() {
    if (!this.disabledItem) {
      this.expanded = true;

      this.accordionService.sendToParentAccordionItemClicked(this);
    }
  }
}
