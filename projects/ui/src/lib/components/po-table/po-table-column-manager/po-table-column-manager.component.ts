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
import { PoPageSlideComponent } from '../../po-page';

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

type Direction = 'up' | 'down';

@Component({
  selector: 'po-table-column-manager',
  templateUrl: './po-table-column-manager.component.html'
})
export class PoTableColumnManagerComponent implements OnChanges, OnDestroy {
  @ViewChild(PoPopoverComponent) popover: PoPopoverComponent;
  @ViewChild('pageSlideColumnsManager') pageSlideColumnsManager: PoPageSlideComponent;

  @Input('p-columns') columns: Array<PoTableColumn> = [];

  @Input('p-target') target: ElementRef;

  @Input('p-columns-default') colunsDefault: Array<PoTableColumn>;

  @Input('p-last-visible-columns-selected') lastVisibleColumnsSelected: Array<PoTableColumn> = [];

  @Output('p-visible-columns-change') visibleColumnsChange = new EventEmitter<Array<PoTableColumn>>();

  // Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
  // O po-table envia como parâmetro um array de string com as colunas visíveis atualizadas. Por exemplo: ["idCard", "name", "hireStatus", "age"].
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  @Output('p-initial-columns') initialColumns = new EventEmitter<Array<String>>();

  literals;
  columnsOptions: Array<PoCheckboxGroupOption> = [];
  visibleColumns: Array<string> = [];
  columnUpdate;

  private _maxColumns: number = PoTableColumnManagerMaxColumnsDefault;
  private defaultColumns: Array<PoTableColumn> = [];
  private resizeListener: () => void;
  private restoreDefaultEvent: boolean;
  private lastEmittedValue: Array<string>;
  private minColumns: number = 1;

  @Input('p-max-columns') set maxColumns(value: number) {
    this._maxColumns = convertToInt(value, PoTableColumnManagerMaxColumnsDefault);
  }

  get maxColumns() {
    return this._maxColumns;
  }

  constructor(private renderer: Renderer2, languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poTableColumnManagerLiteralsDefault[poLocaleDefault],
      ...poTableColumnManagerLiteralsDefault[language]
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const { columns, maxColumns, target, lastVisibleColumnsSelected } = changes;

    if (target && target.firstChange) {
      this.initializeListeners();
    }

    if (columns) {
      this.onChangeColumns(columns);
    }

    if (maxColumns) {
      this.updateValues(this.columns);
    }

    if (lastVisibleColumnsSelected?.currentValue) {
      this.pageSlideColumnsManager.open();
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

  restore() {
    this.restoreDefaultEvent = true;
    const defaultColumns = this.getVisibleColumns(this.defaultColumns);
    this.initialColumns.emit(this.getVisibleColumns(this.colunsDefault));
    this.checkChanges(defaultColumns, this.restoreDefaultEvent);
  }

  changePosition({ option, direction }) {
    const indexColumn = this.columns.findIndex(el => el.property === option.value);
    const newColumn = [...this.columns];

    this.changePositionColumn(newColumn, indexColumn, direction);
    this.columns = newColumn;
    this.visibleColumnsChange.emit(this.columns);
  }

  private changePositionColumn(array: Array<PoTableColumn>, index: number, direction: Direction) {
    if (direction === 'up') {
      array.splice(index, 0, array.splice(index - 1, 1)[0]);
    }

    if (direction === 'down') {
      array.splice(index, 0, array.splice(index + 1, 1)[0]);
    }
  }

  private verifyToEmitChange(event: Array<string>) {
    const newColumns = [...event];
    if (newColumns.length >= 1 && this.allowsChangeVisibleColumns()) {
      this.emitChangesToSelectedColumns(newColumns);
    }
    // Desabilita ultimo checkbox ativo
    if (newColumns.length === 1) {
      const columnsOptions = this.mapTableColumnsToCheckboxOptions(this.columnUpdate);
      this.columnsOptions = this.disabledLastColumn(columnsOptions);
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

    return this.stringify(visibleTableColumns) !== this.stringify(this.columns);
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
      this.visibleColumnsChange.emit(this.defaultColumns);
    }

    this.restoreDefaultEvent = false;
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
    const firstSort = one.slice();
    const secondSort = two.slice();
    const firstString = JSON.stringify(firstSort);
    const secondString = JSON.stringify(secondSort);

    return firstString === secondString;
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
          disabled: this.isDisableColumn(column.property),
          visible: column.visible
        });
      }
    });

    return columnsOptions;
  }

  private disabledLastColumn(columns: Array<any>) {
    return columns.map(column => ({
      ...column,
      disabled: column.type !== 'detail' && column.visible ? true : false
    }));
  }

  private onChangeColumns(columns: SimpleChange) {
    const { currentValue = [], previousValue = [] } = columns;
    this.columnUpdate = columns.currentValue;

    // atualizara o defaultColumns, quando for a primeira vez ou quando o defaultColumns for diferente do currentValue
    if (!this.lastVisibleColumnsSelected && this.stringify(this.defaultColumns) !== this.stringify(currentValue)) {
      this.defaultColumns = [...currentValue];
    }

    // verifica se o valor anterior é diferente do atual para atualizar as columnsOptions apenas quando for necessario
    if (this.stringify(previousValue) !== this.stringify(currentValue)) {
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

  private stringify(columns: Array<PoTableColumn>) {
    // não faz o stringify da propriedade icon e searchService, pois pode conter objeto complexo e disparar um erro.
    return JSON.stringify(columns, (key, value) => {
      if (key !== 'icon' && key !== 'searchService') {
        return value;
      }
    });
  }
}
