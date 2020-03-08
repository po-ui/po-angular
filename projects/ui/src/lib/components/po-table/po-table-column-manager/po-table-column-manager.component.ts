import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
  Output, SimpleChange, SimpleChanges, Renderer2, ViewChild } from '@angular/core';

import { browserLanguage, capitalizeFirstLetter, convertToInt, poLocaleDefault } from '../../../utils/util';
import { PoCheckboxGroupOption } from '../../po-field/po-checkbox-group/interfaces/po-checkbox-group-option.interface';
import { PoPopoverComponent } from '../../po-popover/po-popover.component';

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
export class PoTableColumnManagerComponent implements OnInit, OnChanges, OnDestroy {

  private _maxColumns: number = PoTableColumnManagerMaxColumnsDefault;

  columnsOptions: Array<PoCheckboxGroupOption> = [];
  literals = {
    ...poTableColumnManagerLiteralsDefault[poLocaleDefault],
    ...poTableColumnManagerLiteralsDefault[browserLanguage()]
  };
  visibleColumns: Array<string> = [];

  private defaultColumns: Array<PoTableColumn> = [];
  private resizeListener: () => void;

  @Input('p-columns') columns: Array<PoTableColumn> = [];

  @Input('p-max-columns') set maxColumns(value: number) {
    this._maxColumns = convertToInt(value, PoTableColumnManagerMaxColumnsDefault);
  }

  get maxColumns() {
    return this._maxColumns;
  }

  @Input('p-target') target: ElementRef;

  @Output('p-visible-columns-change') visibleColumnsChange = new EventEmitter<Array<PoTableColumn>>();

  @ViewChild(PoPopoverComponent) popover: PoPopoverComponent;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.updateColumnsOptions(this.columns);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { columns, maxColumns, target } = changes;

    if (target && target.firstChange) {
      this.initializeListeners();
    }

    if (columns) {
      this.onChangeColumns(columns);
    }

    if (maxColumns) {
      this.updateColumnsOptions(this.columns);
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  onChangeVisibleColumns(checkedColumns: Array<string>) {
    this.disableColumnsOptions(this.columnsOptions);

    const visibleTableColumns = this.getVisibleTableColumns(checkedColumns);

    this.visibleColumnsChange.emit(visibleTableColumns);
  }

  restore() {
    this.updateColumnsOptions(this.defaultColumns);
  }

  // desabilitará as colunas, que não estiverem selecionadas, após exeder o numero maximo de colunas.
  private disableColumnsOptions(columns: Array<PoCheckboxGroupOption> = []) {
    // necessario timeout para que seja possivel atualizar os columnsOptions apos a mudança do model
    setTimeout(() => {
      this.columnsOptions = columns.map(column => ({
        ...column,
        disabled: this.isDisableColumn(column.value)
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
      if (column.visible !== false && visibleColumns.length < this.maxColumns && column.type !== 'detail') {

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

  private initializeListeners() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      if (this.popover) {
        this.popover.close();
      }
    });

  }

  private isDisableColumn(property: string): boolean {
    return this.visibleColumns.length >= this.maxColumns ? !this.visibleColumns.includes(property) : false;
  }

  private mapTableColumnsToCheckboxOptions(columns: Array<PoTableColumn> = []) {
    const columnsOptions = [];

    columns.forEach(column => {
      if (column.type !== 'detail') {
        columnsOptions.push({
          value: column.property,
          label: this.getColumnTitleLabel(column),
          disabled: this.isDisableColumn(column.property)
        });
      }

    });

    return columnsOptions;
  }

  private onChangeColumns(columns: SimpleChange) {
    const { firstChange, currentValue = [], previousValue = [] } = columns;

    // atualizara o defaultColumns, quando for a primeira vez ou quando o defaultColumns for diferente do currentValue
    if (firstChange || (this.defaultColumns.length !== currentValue.length)) {
      this.defaultColumns = currentValue;
    }

    // verifica se o valor anterior é diferente do atual para atualizar as columnsOptions apenas quando for necessario
    if (previousValue.length !== currentValue.length) {
      this.updateColumnsOptions(currentValue);
    }
  }

  private removeListeners() {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private updateColumnsOptions(columns: Array<PoTableColumn>) {
    this.visibleColumns = this.getVisibleColumns(columns);
    this.columnsOptions = this.mapTableColumnsToCheckboxOptions(columns);

    this.onChangeVisibleColumns(this.visibleColumns);
  }

}
