import { Directive, Input } from '@angular/core';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoHelperOptions } from '../../po-helper/interfaces/po-helper.interface';

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
  /** Título da página. */
  @Input('p-title') title: string;

  /** Define o tamanho dos componentes no header. */
  @Input('p-size') size: string;

  /** Subtítulo da página. */
  @Input('p-subtitle') subtitle: string;

  /** Define o tipo de header: `primary`, `secondary` ou `tertiary`. */
  @Input('p-type') type: string = 'primary';

  /**
   * @optional
   *
   * @description
   *
   * Define o conteúdo do po-helper informativo exibido ao lado do subtítulo.
   *
   * Quando não houver subtítulo (`p-subtitle`), o po-helper será exibido logo abaixo do título.
   *
   * Aceita uma string simples ou um objeto do tipo `PoHelperOptions`.
   */
  @Input('p-helper') helper: PoHelperOptions | string;

  private _breadcrumb: PoBreadcrumb;

  /** Objeto com propriedades do breadcrumb. */

  @Input('p-breadcrumb') set breadcrumb(value: PoBreadcrumb) {
    this._breadcrumb = value;
  }
  get breadcrumb(): PoBreadcrumb {
    return this._breadcrumb;
  }
}
