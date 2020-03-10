import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

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
  private subjectChild = new Subject<any>();

  // Recebe o accordionItem
  receiveFromChildAccordionClicked() {
    return this.subjectChild.asObservable();
  }

  // Envia accordionItem colapsado/expadido do accordion
  sendToParentAccordionItemClicked(accordionItem: object) {
    this.subjectChild.next(accordionItem);
  }
}
