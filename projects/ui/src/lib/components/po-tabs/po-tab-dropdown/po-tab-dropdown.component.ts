import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoPopoverComponent } from '../../po-popover/po-popover.component';
import { PoTabComponent } from '../po-tab/po-tab.component';
import { PoButtonComponent } from '../../po-button/po-button.component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para agrupamento de componentes `po-tab-button` que os rendereiza em uma um caixa de diálogo
 * no formato de lista.
 */
@Component({
  selector: 'po-tab-dropdown',
  templateUrl: './po-tab-dropdown.component.html'
})
export class PoTabDropdownComponent {
  @ViewChild('popover', { static: true }) popover: PoPopoverComponent;

  @ViewChild(PoButtonComponent, { static: true }) button: PoButtonComponent;

  // Rótulo do `po-tab-button`
  @Input('p-label') label: string;

  // Diminui o tamanho do botão
  @Input('p-small') small: boolean;

  // Lista de abas
  @Input('p-tabs') tabs: Array<PoTabComponent> = [];

  // Evento que será emitido ao ativar uma aba
  @Output('p-activated') activated = new EventEmitter<any>();

  // Evento que será emitido a aba for desabilitada ou ocultada
  @Output('p-change-state') changeState = new EventEmitter<any>();

  // Evento de click
  @Output('p-click') click = new EventEmitter<any>();

  closeAndReturnToButtom() {
    this.popover.close();
    this.button.focus();
  }

  get buttonElement() {
    return this.button.buttonElement;
  }
}
