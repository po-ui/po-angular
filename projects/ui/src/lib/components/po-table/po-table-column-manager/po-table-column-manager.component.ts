import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
export class PoTableColumnManagerComponent implements OnChanges, OnDestroy {
  literals;
  columnsOptions: Array<PoCheckboxGroupOption> = [];
  visibleColumns: Array<string> = [];

  private _maxColumns: number = PoTableColumnManagerMaxColumnsDefault;
  private defaultColumns: Array<PoTableColumn> = [];
  private resizeListener: () => void;
  private restoreDefaultEvent: boolean;
  private lastEmittedValue: Array<string>;

  @Input('p-columns') columns: Array<PoTableColumn> = [];

  @Input('p-max-columns') set maxColumns(value: number) {
    this._maxColumns = convertToInt(value, PoTableColumnManagerMaxColumnsDefault);
  }

  get maxColumns() {
    return this._maxColumns;
  }

  @Input('p-target') target: ElementRef;

  @Input('p-last-visible-columns-selected') lastVisibleColumnsSelected: Array<PoTableColumn> = [];

  @Output('p-visible-columns-change') visibleColumnsChange = new EventEmitter<Array<PoTableColumn>>();

  // Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
  // O po-table envia como parâmetro um array de string com as colunas visíveis atualizadas. Por exemplo: ["idCard", "name", "hireStatus", "age"].
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  @ViewChild(PoPopoverComponent) popover: PoPopoverComponent;

  constructor(private renderer: Renderer2, languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poTableColumnManagerLiteralsDefault[poLocaleDefault],
      ...poTableColumnManagerLiteralsDefault[language]
    };
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
      this.updateValues(this.columns);
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  // aqui chegam os eventos do checkbox e do close do popover que também é disparado no resize
  checkChanges(event: Array<string> = [], emit: boolean = false) {
    this.verifyToEmitChange(event);

    if (emit) {
      // controla emissões para o dev
      this.verifyToEmitVisibleColumns();
    }
  }

  private verifyToEmitChange(event: Array<string>) {
    const newColumns = [...event];

    if (this.allowsChangeVisibleColumns()) {
      this.emitChangesToSelectedColumns(newColumns);
    }
  }

  private emitChangesToSelectedColumns(newColumns: Array<string>) {
    this.visibleColumns = [...newColumns];
    const visibleTableColumns = this.getVisibleTableColumns(this.visibleColumns);

    // emite alteração nas colunas selecionadas, porém não emite para o dev.
    this.visibleColumnsChange.emit(visibleTableColumns);
  }

  private allowsChangeVisibleColumns(): boolean {
    const visibleTableColumns = this.getVisibleTableColumns(this.visibleColumns);

    return JSON.stringify(visibleTableColumns) !== JSON.stringify(this.columns);
  }

  private verifyToEmitVisibleColumns() {
    if (this.restoreDefaultEvent) {
      // veio do restore default
      this.verifyRestoreValues();
    } else {
      // foi disparado no close popover;
      this.verifyOnClose();
    }
  }

  private verifyRestoreValues() {
    const defaultColumns = [...this.defaultColumns];
    const defaultVisibleColumns = this.getVisibleColumns(defaultColumns);

    if (this.allowsChangeSelectedColumns(defaultVisibleColumns)) {
      this.emitChangeOnRestore(defaultVisibleColumns);
    }

    this.restoreDefaultEvent = false;
  }

  private emitChangeOnRestore(defaultVisibleColumns: Array<string>) {
    this.visibleColumns = [...defaultVisibleColumns];
    const visibleTableColumns = this.getVisibleTableColumns(this.visibleColumns);

    this.visibleColumnsChange.emit(visibleTableColumns);
  }

  private allowsChangeSelectedColumns(defaultVisibleColumns: Array<string>) {
    const visibleColumns = this.getVisibleColumns(this.columns);

    return !this.isEqualArrays(defaultVisibleColumns, visibleColumns);
  }

  private verifyOnClose() {
    if (this.allowsEmission()) {
      this.emitVisibleColumns();
    }
  }

  private emitVisibleColumns() {
    this.lastEmittedValue = [...this.visibleColumns];
    this.changeVisibleColumns.emit(this.visibleColumns);
  }

  private allowsEmission(): boolean {
    const updatedVisibleColumns = this.visibleColumns ? [...this.visibleColumns] : [];
    const lastEmittedValue = this.lastEmittedValue ? [...this.lastEmittedValue] : [];
    const lastVisibleColumnsSelected = this.lastVisibleColumnsSelected ? [...this.lastVisibleColumnsSelected] : [];
    const lastVisibleColumns = this.getVisibleColumns(lastVisibleColumnsSelected);

    return (
      this.isUpdate(updatedVisibleColumns, lastEmittedValue) ||
      this.isFirstTime(updatedVisibleColumns, lastVisibleColumns)
    );
  }

  private isFirstTime(updatedVisibleColumns: Array<string>, lastVisibleColumns: Array<string>): boolean {
    return !this.lastEmittedValue && !this.isEqualArrays(updatedVisibleColumns, lastVisibleColumns);
  }

  private isUpdate(updatedVisibleColumns: Array<string>, lastEmittedValue: Array<string>): boolean {
    return this.lastEmittedValue && !this.isEqualArrays(updatedVisibleColumns, lastEmittedValue);
  }

  private isEqualArrays(first: Array<string>, second: Array<string>): boolean {
    const one = first ? [...first] : [];
    const two = second ? [...second] : [];
    const firstSort = one.slice().sort();
    const secondSort = two.slice().sort();
    const firstString = JSON.stringify(firstSort);
    const secondString = JSON.stringify(secondSort);

    return firstString === secondString;
  }

  restore() {
    this.restoreDefaultEvent = true;
    const defaultColumns = this.getVisibleColumns(this.defaultColumns);

    this.checkChanges(defaultColumns, this.restoreDefaultEvent);
  }

  // desabilitará as colunas, que não estiverem selecionadas, após exeder o numero maximo de colunas.
  private disableColumnsOptions(columns: Array<PoCheckboxGroupOption> = []) {
    return columns.map(column => ({
      ...column,
      disabled: this.isDisableColumn(column.value)
    }));
  }

  private getColumnTitleLabel(column: PoTableColumn) {
    return column.label || capitalizeFirstLetter(column.property);
  }

  /** Retorna um Array de column.property das colunas que são visiveis. */
  private getVisibleColumns(columns: Array<PoTableColumn>): Array<string> {
    let visibleColumns = [];

    columns.forEach(column => {
      if (this.isVisibleColumn(column, visibleColumns)) {
        visibleColumns = [...visibleColumns, column.property];
      }
    });

    return visibleColumns;
  }

  private isVisibleColumn(column: PoTableColumn, visibleColumns: Array<string>): boolean {
    return column.visible !== false && visibleColumns.length < this.maxColumns && column.type !== 'detail';
  }

  /** Retorna um Array PoTableColumn a partir das colunas visiveis no gerenciador de colunas. */
  private getVisibleTableColumns(visibleColumns: Array<string>): Array<PoTableColumn> {
    const columns = this.columns ? [...this.columns] : [];

    return columns.map(column => ({
      ...column,
      visible: visibleColumns.includes(column.property) || column.type === 'detail'
    }));
  }

  private initializeListeners() {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      if (this.popover && !this.popover.isHidden) {
        this.popover.close();
      }
    });
  }

  private isDisableColumn(property: string): boolean {
    return this.visibleColumns.length >= this.maxColumns ? !this.visibleColumns.includes(property) : false;
  }

  private mapTableColumnsToCheckboxOptions(columns: Array<PoTableColumn> = []) {
    const tableColumns = [...columns];
    const columnsOptions = [];

    tableColumns.forEach(column => {
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
    const { currentValue = [], previousValue = [] } = columns;

    // atualizara o defaultColumns, quando for a primeira vez ou quando o defaultColumns for diferente do currentValue
    if (!this.lastVisibleColumnsSelected && JSON.stringify(this.defaultColumns) !== JSON.stringify(currentValue)) {
      this.defaultColumns = [...currentValue];
    }

    // verifica se o valor anterior é diferente do atual para atualizar as columnsOptions apenas quando for necessario
    if (JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
      this.updateValues(currentValue);
    }
  }

  private updateValues(currentValue: Array<PoTableColumn>) {
    const visibleColumns = this.getVisibleColumns(currentValue);
    this.visibleColumns = [...visibleColumns];

    const columnsOptions = this.mapTableColumnsToCheckboxOptions(currentValue);
    this.columnsOptions = this.disableColumnsOptions(columnsOptions);

    this.checkChanges(visibleColumns, false);
  }

  private removeListeners() {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }
}
