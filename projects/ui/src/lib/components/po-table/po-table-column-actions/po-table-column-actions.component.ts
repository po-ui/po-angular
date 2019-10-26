import { Component, Input } from '@angular/core';
import { PoTableColumnAction } from './po-table-column-action.interface'

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir ações para uma determinada linha na tabela.
 */
@Component({
  selector: 'po-table-column-actions',
  templateUrl: './po-table-column-actions.component.html'
})
export class PoTableColumnActionsComponent {

  /** Ações que devem ser exibidas para uma determinada linha da tabela. */
  private _actions: Array<PoTableColumnAction>;
  @Input('p-actions') set actions(actions: Array<PoTableColumnAction>) {
    this._actions = actions ? actions : new Array<PoTableColumnAction>();
  }

  get actions(): Array<PoTableColumnAction> {
    return this._actions;
  }

  constructor() { }

}
