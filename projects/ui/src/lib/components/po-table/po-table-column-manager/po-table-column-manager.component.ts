import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { browserLanguage, capitalizeFirstLetter, convertToInt, poLocaleDefault } from '../../../utils/util';
import { PoCheckboxGroupOption } from '../../po-field/po-checkbox-group/interfaces/po-checkbox-group-option.interface';

import { PoTableColumn } from '../interfaces/po-table-column.interface';

const PoTableColumnManagerMaxColumnsDefault = 99999;

export const poTableColumnManagerLiteralsDefault = {
  en: {
    columnsManager: 'Columns manager',
    restoreDefault: 'Restore default'
  },
  es: {
    columnsManager: 'Gerente de columna',
    restoreDefault: 'Restaurar por defecto'
  },
  pt: {
    columnsManager: 'Gerenciador de colunas',
    restoreDefault: 'Restaurar padrão'
  },
  ru: {
    columnsManager: 'менеджер колонок',
    restoreDefault: 'сброс настроек'
  }
};

@Component({
  selector: 'po-table-column-manager',
  templateUrl: './po-table-column-manager.component.html'
})
export class PoTableColumnManagerComponent implements OnInit, OnChanges {

  private _maxColumns: number = PoTableColumnManagerMaxColumnsDefault;

  columnsOptions: Array<PoCheckboxGroupOption> = [];
  literals = {
    ...poTableColumnManagerLiteralsDefault[poLocaleDefault],
    ...poTableColumnManagerLiteralsDefault[browserLanguage()]
  };
  visibleColumns: Array<string> = [];

  private defaultColumns: Array<PoTableColumn> = [];

  @Input('p-target') target: ElementRef;

  @Input('p-columns') columns: Array<PoTableColumn>;

  @Input('p-max-columns') set maxColumns(value: number) {
    this._maxColumns = convertToInt(value, PoTableColumnManagerMaxColumnsDefault);
  }

  get maxColumns() {
    return this._maxColumns;
  }

  @Output('p-visible-columns-change') visibleColumnsChange = new EventEmitter<Array<PoTableColumn>>();

  ngOnInit() {
    this.updateColumnsOptions(this.columns);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { columns } = changes;

    if (columns) {
      const { firstChange, currentValue } = columns;

      // atualizara o defaultColumns, quando for a primeira vez, quando não tiver defaultColumns e o currentValue possuir valor
      // ou quando o defaultColumns for diferente do currentValue
      if (((firstChange || !this.defaultColumns.length) && currentValue && currentValue.length) ||
        (this.defaultColumns.length !== currentValue.length)) {
        this.defaultColumns = currentValue;
      }

      this.visibleColumns = this.getVisibleColumns(currentValue);
      this.columnsOptions = this.mapTableColumnsToCheckboxOptions(currentValue);
    }
  }

  onChangeColumns(checkedColumns: Array<string>) {
    this.disabledColumns(this.columnsOptions);

    const visibleColumns = this.getVisibleTableColumns(checkedColumns);

    this.visibleColumnsChange.emit(visibleColumns);
  }

  restore() {
    this.updateColumnsOptions(this.defaultColumns);
  }

  /** desabilitará as colunas, que não estiverem selecionadas, após exeder o numero maximo de colunas. */
  private disabledColumns(columns: Array<PoCheckboxGroupOption>) {
    // necessario timeout para que seja possivel atualizar os columnsOptions apos a mudança do model
    setTimeout(() => {
      this.columnsOptions = columns.map(column => ({
        ...column,
        disabled: this.visibleColumns.length >= this.maxColumns ? !this.visibleColumns.includes(column.value) : false
      }));
    });
  }

  private getColumnTitleLabel(column: PoTableColumn) {
    return column.label || capitalizeFirstLetter(column.property);
  }

  /** Retorna um Array de column.property das colunas que são visiveis. */
  private getVisibleColumns(columns: Array<PoTableColumn>): Array<string> {
    const visibleColumns = [];

    columns.forEach(column => {
      if (column.visible !== false && visibleColumns.length < this.maxColumns) {

        visibleColumns.push(column.property);
      }
    });

    return visibleColumns;
  }

  /** Retorna um Array PoTableColumn a partir das colunas visiveis no gerenciador de colunas. */
  private getVisibleTableColumns(visibleColumns: Array<string>): Array<PoTableColumn> {
    return this.columns.map(column => ({
      ...column,
      visible: visibleColumns.includes(column.property) || column.type === 'detail'
    }));
  }

  private mapTableColumnsToCheckboxOptions(columns: Array<PoTableColumn> = []) {
    const columnsOptions = [];

    columns.forEach(column => {
      if (column.type !== 'detail') {
        columnsOptions.push({
          value: column.property,
          label: this.getColumnTitleLabel(column),
          disabled: this.visibleColumns.length >= this.maxColumns ? !this.visibleColumns.includes(column.property) : false
        });
      }

    });

    return columnsOptions;
  }

  private updateColumnsOptions(columns: Array<PoTableColumn>) {
    this.visibleColumns = this.getVisibleColumns(columns);
    this.columnsOptions = this.mapTableColumnsToCheckboxOptions(columns);

    this.onChangeColumns(this.visibleColumns);
  }

}
