import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  Renderer2,
  ViewChild
} from '@angular/core';

import { capitalizeFirstLetter, convertToInt } from '../../../utils/util';
import { PoCheckboxGroupOption } from '../../po-field/po-checkbox-group/interfaces/po-checkbox-group-option.interface';
import { PoPopoverComponent } from '../../po-popover/po-popover.component';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
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

  literals;
  columnsOptions: Array<PoCheckboxGroupOption> = [];
  visibleColumns: Array<string> = [];

  private defaultColumns: Array<PoTableColumn> = [];
  private lastEmittedValue: Array<string>;
  private lastValueCheckedColumns: Array<string>;
  private selectedColumns: Array<string>;
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

  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  @ViewChild(PoPopoverComponent) popover: PoPopoverComponent;

  constructor(private renderer: Renderer2, languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poTableColumnManagerLiteralsDefault[poLocaleDefault],
      ...poTableColumnManagerLiteralsDefault[language]
    };
  }

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
    // controla quando a alteração das colunas deve ser emitida para o dev
    this.updatesControlValues(checkedColumns);

    this.disableColumnsOptions(this.columnsOptions);

    const visibleTableColumns = this.getVisibleTableColumns(checkedColumns);

    this.visibleColumnsChange.emit(visibleTableColumns);
  }

  emitVisibleColumns() {
    if (this.isUpdate(this.selectedColumns, this.lastEmittedValue)) {
      this.lastEmittedValue = [...this.selectedColumns];
      this.changeVisibleColumns.emit(this.selectedColumns);
    } else if (this.isFirstTime(this.selectedColumns, this.lastEmittedValue, this.lastValueCheckedColumns)) {
      this.lastEmittedValue = [...this.selectedColumns];
      this.changeVisibleColumns.emit(this.selectedColumns);
    }
  }

  restore() {
    this.updateColumnsOptions(this.defaultColumns);
  }

  private updatesControlValues(checkedColumns: Array<string>) {
    if (!this.lastValueCheckedColumns && checkedColumns) {
      this.lastValueCheckedColumns = checkedColumns;
    } else {
      if (this.lastValueCheckedColumns && checkedColumns && this.lastValueCheckedColumns !== checkedColumns) {
        this.selectedColumns = checkedColumns;
      }
    }
  }

  private isUpdate(selectedColumns: Array<string>, lastEmittedValue: Array<string>): boolean {
    return selectedColumns && lastEmittedValue && !this.columnsAreEquals(lastEmittedValue, selectedColumns);
  }

  private isFirstTime(
    selectedColumns: Array<string>,
    lastEmittedValue: Array<string>,
    lastValueCheckedColumns: Array<string>
  ): boolean {
    return (
      selectedColumns &&
      lastValueCheckedColumns &&
      !lastEmittedValue &&
      !this.columnsAreEquals(lastValueCheckedColumns, selectedColumns)
    );
  }

  private columnsAreEquals(oldValue: Array<string>, newValue: Array<string>): boolean {
    if (oldValue && newValue) {
      const oldSortedValue = oldValue.slice().sort();
      return (
        newValue.length === oldSortedValue.length &&
        newValue
          .slice()
          .sort()
          .every((value, index) => value === oldSortedValue[index])
      );
    }
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
    if (firstChange || this.defaultColumns.length !== currentValue.length) {
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
