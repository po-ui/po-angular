import { Component, Input } from '@angular/core';

import { isTypeof } from '../../../utils/util';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoToolbarAction } from '../po-toolbar-action.interface';

const poToolbarActionsIconDefault = 'po-icon-more';

/**
 * @docsPrivate
 *
 * @usedBy PoToolbarComponent
 *
 * @description
 *
 * O componente `po-toolbar-actions` tem como objetivo receber uma lista de ações e um ícone que podem ser personalizados.
 */
@Component({
  selector: 'po-toolbar-actions',
  templateUrl: './po-toolbar-actions.component.html',
  providers: [PoControlPositionService]
})
export class PoToolbarActionsComponent {
  private _actionsIcon?: string = poToolbarActionsIconDefault;

  /** Define uma lista de ações. */
  @Input('p-actions') actions?: Array<PoToolbarAction>;

  /** Define o ícone das ações. */
  @Input('p-actions-icon') set actionsIcon(icon: string) {
    this._actionsIcon = isTypeof(icon, 'string') ? icon : poToolbarActionsIconDefault;
  }

  get actionsIcon() {
    return this._actionsIcon;
  }
}
