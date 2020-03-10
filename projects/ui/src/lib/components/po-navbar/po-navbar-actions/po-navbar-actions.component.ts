import { Component, Input } from '@angular/core';

import { PoNavbarIconAction } from '../interfaces/po-navbar-icon-action.interface';

@Component({
  selector: 'po-navbar-actions',
  templateUrl: './po-navbar-actions.component.html'
})
export class PoNavbarActionsComponent {
  private _iconActions: Array<PoNavbarIconAction>;

  @Input('p-icon-actions') set iconActions(actions: Array<PoNavbarIconAction>) {
    this._iconActions = actions.map(action => ({ ...action, separator: true, url: action.link }));
  }

  get iconActions() {
    return this._iconActions;
  }
}
