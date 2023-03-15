import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PoTableColumnLabel } from './po-table-column-label.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para a criação da representação da legenda, em formato de texto .
 */

@Component({
  selector: 'po-table-column-label',
  templateUrl: './po-table-column-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTableColumnLabelComponent {
  @Input('p-value') value: PoTableColumnLabel;
}
