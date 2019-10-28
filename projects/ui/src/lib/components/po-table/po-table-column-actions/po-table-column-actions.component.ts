import { Component, Input } from '@angular/core';
import { PoPopupComponent } from '../../po-popup';
import { PoTableColumnAction } from './po-table-column-actions.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir ações para uma determinada linha da tabela.
 */
@Component({
  selector: 'po-table-column-actions',
  templateUrl: './po-table-column-actions.component.html'
})
export class PoTableColumnActionsComponent {

  private _actions: Array<PoTableColumnAction>;
  /** Lista de ações de uma determinada linha. */
  @Input('p-actions') public set actions(actions: Array<PoTableColumnAction>) {
    this._actions = actions || new Array<PoTableColumnAction>();
  }

  public get actions(): Array<PoTableColumnAction> {
    return this._actions;
  }

  constructor() { }

  toggle(columnPopup: PoPopupComponent) {
    columnPopup.toggle();
  }
}
