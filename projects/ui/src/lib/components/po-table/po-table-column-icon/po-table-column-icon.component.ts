import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { PoTableColumnIcon } from './po-table-column-icon.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por exibir ícones nas colunas.
 */
@Component({
  selector: 'po-table-column-icon',
  templateUrl: './po-table-column-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PoTableColumnIconComponent {

  private _icons: Array<PoTableColumnIcon> = [];

  /** Lista de colunas com ícones. */
  @Input('p-icons') set icons(icons: Array<PoTableColumnIcon>) {
    this._icons = icons || [];
  }

  get icons() {
    return this._icons;
  }

  /** Dados da linha da tabela. */
  @Input('p-row') row: any;

  click(column: PoTableColumnIcon): void {
    column.action(this.row, column);
  }

  getColor(column: PoTableColumnIcon): string {
    const color =  typeof column.color === 'function' ? column.color(this.row, column) : column.color;

    if (color) {
      return `po-text-${color}`;
    }
  }

  getIcon(column: PoTableColumnIcon) {
    return column.icon || column.value;
  }

  isClickable(column: PoTableColumnIcon): boolean {
    return column.action && !this.isDisabled(column);
  }

  isDisabled(column: PoTableColumnIcon): boolean {
    return column.disabled ? column.disabled(this.row) : false;
  }

  trackByFunction(index) {
    return index;
  }

}
