import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço que implementa a comunicação entre os items do po-menu.
 */
@Injectable()
export class PoMenuItemsService {
  private subjectParent = new Subject<any>();
  private subjectChild = new Subject<any>();

  // Envia informações do click do po-menu-item para o po-menu
  sendToParentMenuClicked(menu: object) {
    this.subjectChild.next(menu);
  }

  // Recebe do po-menu-item sua informação de click.
  receiveFromChildMenuClicked() {
    return this.subjectChild.asObservable();
  }

  // Envia para os po-menu-item a resposta do processamento de click de um po-menu-item.
  sendToChildMenuClicked(menu: object) {
    this.subjectParent.next(menu);
  }

  // Recebe do po-menu as informações processadas do click de um po-menu-item.
  receiveFromParentMenuClicked(): Observable<any> {
    return this.subjectParent.asObservable();
  }
}
