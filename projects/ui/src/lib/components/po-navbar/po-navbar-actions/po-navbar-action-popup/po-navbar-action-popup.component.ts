import { Component, Input } from '@angular/core';

import { PoNavbarIconAction } from '../../interfaces/po-navbar-icon-action.interface';

@Component({
  selector: 'po-navbar-action-popup',
  templateUrl: './po-navbar-action-popup.component.html'
})
export class PoNavbarActionPopupComponent {
  @Input('p-icon-actions') iconActions: Array<PoNavbarIconAction>;

  getLastIconAction() {
    if (this.iconActions && this.iconActions.length) {
      return this.iconActions[this.iconActions.length - 1].icon;
    }
  }
}
