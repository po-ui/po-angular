import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { PoAccordionItemComponent } from '../po-accordion-item/po-accordion-item.component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço para poder notificar o componente `po-accordion` quando um `po-accordion-item` for
 * expandido/colapsado.
 */
@Injectable()
export class PoAccordionService {
  private subjectChild = new Subject<PoAccordionItemComponent>();

  // Recebe o accordionItem
  receiveFromChildAccordionClicked() {
    return this.subjectChild.asObservable();
  }

  // Envia accordionItem colapsado/expadido do accordion
  sendToParentAccordionItemClicked(accordionItem: PoAccordionItemComponent) {
    this.subjectChild.next(accordionItem);
  }
}
