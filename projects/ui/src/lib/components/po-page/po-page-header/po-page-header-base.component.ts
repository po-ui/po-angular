import { Input, Directive } from '@angular/core';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * O componente **po-page-header** é responsável pelo título da página e container dos botões de ações dos componentes
 * po-page-list e po-page-base.
 */
@Directive()
export class PoPageHeaderBaseComponent {
  private _breadcrumb: PoBreadcrumb;

  /** Objeto com propriedades do breadcrumb. */

  @Input('p-breadcrumb') set breadcrumb(value: PoBreadcrumb) {
    this._breadcrumb = value;
  }
  get breadcrumb(): PoBreadcrumb {
    return this._breadcrumb;
  }

  /** Título da página. */
  @Input('p-title') title: string;
}
