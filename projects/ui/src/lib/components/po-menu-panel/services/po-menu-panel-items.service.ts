import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço que implementa a comunicação entre os items do po-menu-panel.
 */
@Injectable()
export class PoMenuPanelItemsService {
  private subjectChild = new Subject<any>();
  private subjectParent = new Subject<any>();

  // Recebe do po-menu-panel-item sua informação de click.
  receiveFromChildMenuClicked() {
    return this.subjectChild.asObservable();
  }

  // Recebe do po-menu-panel as informações processadas do click de um po-menu-panel-item.
  receiveFromParentMenuClicked(): Observable<any> {
    return this.subjectParent.asObservable();
  }

  // Envia informações do click do po-menu-panel-item para o po-menu
  sendToParentMenuClicked(menu: object) {
    this.subjectChild.next(menu);
  }

  // Envia para os po-menu-panel-item a resposta do processamento de click de um po-menu-panel-item.
  sendToChildMenuClicked(menu: object) {
    this.subjectParent.next(menu);
  }
}
