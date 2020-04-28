import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { PoTableColumn } from '../interfaces/po-table-column.interface';
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

  /** Definição da coluna que utiliza os icones. */
  @Input('p-column') column: PoTableColumn;

  /** Lista de colunas com ícones. */
  @Input('p-icons') set icons(icons: Array<PoTableColumnIcon> | Array<string> | string) {
    this._icons = this.convertToColumnIcon(icons);
  }

  get icons() {
    return this._icons;
  }

  /** Dados da linha da tabela. */
  @Input('p-row') row: any;

  click(columnIcon: PoTableColumnIcon, event): void {
    const isAbleAction = !this.isDisabled(columnIcon);

    if (isAbleAction) {
      if (columnIcon.action) {
        columnIcon.action(this.row, columnIcon);
      } else if (this.column.action) {
        this.column.action(this.row, columnIcon);
      }
      event.stopPropagation();
    }
  }

  getColor(column: PoTableColumnIcon): string {
    const color = typeof column.color === 'function' ? column.color(this.row, column) : column.color;

    if (color) {
      return `po-text-${color}`;
    }
  }

  getIcon(column: PoTableColumnIcon) {
    return column.icon || column.value;
  }

  isClickable(columnIcon: PoTableColumnIcon): boolean {
    return !!(!this.isDisabled(columnIcon) && (columnIcon.action || this.column.action));
  }

  isDisabled(column: PoTableColumnIcon): boolean {
    return column.disabled ? column.disabled(this.row) : false;
  }

  trackByFunction(index) {
    return index;
  }

  private convertToColumnIcon(rowIcons: Array<PoTableColumnIcon> | Array<string> | string): Array<PoTableColumnIcon> {
    if (Array.isArray(rowIcons)) {
      return (<any>rowIcons).map(rowIcon => (typeof rowIcon === 'string' ? { value: rowIcon } : rowIcon));
    }

    if (typeof rowIcons === 'string') {
      return [{ value: rowIcons }];
    }

    return [];
  }
}
