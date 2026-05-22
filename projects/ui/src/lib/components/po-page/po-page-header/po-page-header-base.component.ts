import { Directive, Input, input } from '@angular/core';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoHelperOptions } from '../../po-helper/interfaces/po-helper.interface';
import { parseSafeText, PoFormattingTag, PoTextFragment } from '../../../utils/safe-text-parser';

/** Tags aceitas pelo subtítulo do po-page-header. */
const PAGE_SUBTITLE_ALLOWED_TAGS: Array<PoFormattingTag> = ['b', 'i', 'u', 'strong', 'em'];

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

  /** Define o conteúdo do po-helper. */
  helper = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /** Define o tamanho dos componentes no header. */
  @Input('p-size') size: string;

  /** Define o tipo de header: `primary`, `secondary` ou `tertiary`. */
  @Input('p-type') type: string = 'primary';

  private _breadcrumb: PoBreadcrumb;
  private _subtitle: string;
  private _subtitleFragments: Array<PoTextFragment> = [];

  /** Objeto com propriedades do breadcrumb. */

  @Input('p-breadcrumb') set breadcrumb(value: PoBreadcrumb) {
    this._breadcrumb = value;
  }
  get breadcrumb(): PoBreadcrumb {
    return this._breadcrumb;
  }

  /** Subtítulo da página. */
  @Input('p-subtitle') set subtitle(value: string) {
    this._subtitle = value;
    this._subtitleFragments = parseSafeText(value, PAGE_SUBTITLE_ALLOWED_TAGS);
  }

  get subtitle(): string {
    return this._subtitle;
  }

  get subtitleFragments(): Array<PoTextFragment> {
    return this._subtitleFragments;
  }
}
