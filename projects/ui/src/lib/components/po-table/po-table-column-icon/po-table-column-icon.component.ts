import { Component, Input } from '@angular/core';

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
  templateUrl: './po-table-column-icon.component.html'
})

export class PoTableColumnIconComponent {

  tooltipText: string;

  private _icons: Array<PoTableColumnIcon>;

  @Input('p-column') column: PoTableColumn;

  /** Lista de um ou mais ícones que serão exibidos em sua respectiva coluna. */
  @Input('p-icons') set icons(value: Array<PoTableColumnIcon> | Array<string> | string) {
    this._icons = this.convertToColumnIcon(value);
  }

  get icons() {
    return this._icons;
  }

  @Input('p-row') row;

  checkDisabled(iconColumn: PoTableColumnIcon) {
    return iconColumn.disabled ? iconColumn.disabled(this.row) : false;
  }

  getIconColorClass(columnIcon: PoTableColumnIcon) {
    const color = this.getIconColor(columnIcon) || this.getIconColor(this.column);

    return color ? `po-text-${color}` : '';
  }

  onIconClick(iconColumn: PoTableColumnIcon) {
    const isAbleAction = !this.checkDisabled(iconColumn);

    if (iconColumn.action && isAbleAction) {
      iconColumn.action(this.row, iconColumn);
    } else if (this.column.action && isAbleAction) {
      this.column.action(this.row, iconColumn || this.column);
    }
  }

  tooltipMouseEnter(text: string, iconColumn: PoTableColumnIcon) {
    if (this.checkDisabled(iconColumn)) {
      this.tooltipText = undefined;
    } else {
      this.tooltipText = text;
    }
  }

  tooltipMouseLeave() {
    this.tooltipText = undefined;
  }

  private convertToColumnIcon(value: any): Array<PoTableColumnIcon> {

    if (value instanceof Array) {
      return value.map(val => {
        return typeof val === 'string' ? { value: val } : val;
      });
    }

    if (typeof value === 'string') {
      return [{ value }];
    }

    return [];
  }

  private getIconColor(column: PoTableColumnIcon | PoTableColumn) {
    return typeof column.color === 'function' ? column.color(this.row, column) : column.color;
  }

}
