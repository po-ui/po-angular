import { Component, OnInit, Input } from '@angular/core';
import { PoTableColumnAction } from './po-table-column-action.interface'

@Component({
  selector: 'po-table-column-actions',
  templateUrl: './po-table-column-actions.component.html'
})
export class PoTableColumnActionsComponent {

  private _actions: Array<PoTableColumnAction>;
  @Input('p-actions') set actions(actions: Array<PoTableColumnAction>) {
    this._actions = actions ? actions : new Array<PoTableColumnAction>();
  }

  get actions(): Array<PoTableColumnAction> {
    return this._actions;
  }

  constructor() { }

}
