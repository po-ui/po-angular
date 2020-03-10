import { Input, ViewChild, Directive } from '@angular/core';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageAction } from '../po-page-action.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';

/**
 * @description
 *
 * O componente `po-page-default` é utilizado como o container principal para as telas sem um template definido.
 */
@Directive()
export abstract class PoPageDefaultBaseComponent {
  private _actions?: Array<PoPageAction> = [];
  private _title: string;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /**
   * @optional
   *
   * @description
   *
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`.
   */
  @Input('p-actions') set actions(actions: Array<PoPageAction>) {
    this._actions = Array.isArray(actions) ? actions : [];
    this.setDropdownActions();
  }

  get actions(): Array<PoPageAction> {
    return this._actions;
  }

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

  /** Título da página. */
  @Input('p-title') set title(title: string) {
    this._title = title;
    setTimeout(() => this.poPageContent.recalculateHeaderSize());
  }

  get title() {
    return this._title;
  }

  // Seta a lista de ações no dropdown.
  abstract setDropdownActions();
}
