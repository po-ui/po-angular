import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTableColumnLabelComponent implements OnInit {
  @Input('p-value') value: PoTableColumnLabel;

  ngOnInit(): void {
    this.checkValueHasLabel();
  }

  checkValueHasLabel() {
    return this.value?.label?.trim() ? true : false;
  }
}
