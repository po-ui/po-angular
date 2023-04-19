import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { isExternalLink } from '../../../utils/util';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir link nas colunas.
 */
@Component({
  selector: 'po-table-column-link',
  templateUrl: './po-table-column-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTableColumnLinkComponent {
  @Input('p-action') action: Function;

  @Input('p-disabled') disabled: boolean;

  @Input('p-link') link: string;

  @Input('p-open-new-tab') openNewTab: boolean = false;

  @Input('p-row') row;

  @Input('p-value') value: string;

  get type() {
    if (this.action) {
      return 'action';
    }

    return isExternalLink(this.link) ? 'externalLink' : 'internalLink';
  }
}
