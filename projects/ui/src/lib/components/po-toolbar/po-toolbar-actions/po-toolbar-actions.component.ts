import { Component, Input, TemplateRef } from '@angular/core';

import { isTypeof } from '../../../utils/util';

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
  templateUrl: './po-toolbar-actions.component.html'
})
export class PoToolbarActionsComponent {
  /** Define uma lista de ações. */
  @Input('p-actions') actions?: Array<PoToolbarAction>;

  private _actionsIcon?: string | TemplateRef<void> = poToolbarActionsIconDefault;

  /** Define o ícone das ações. */
  @Input('p-actions-icon') set actionsIcon(icon: string | TemplateRef<void>) {
    this._actionsIcon = isTypeof(icon, 'string') || icon instanceof TemplateRef ? icon : poToolbarActionsIconDefault;
  }

  get actionsIcon() {
    return this._actionsIcon;
  }
}
