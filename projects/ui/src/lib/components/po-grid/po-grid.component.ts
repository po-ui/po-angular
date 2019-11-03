import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';

import { PoGridRowActions } from './po-grid-row-actions.interface';

/**
 * @description
 *
 * Componente grid.
 *
 * Ações / atalhos:
 *
 * - ARROW-UP: Navega para celula superior / Na ultima linha adiciona uma linha em branco no grid;
 * - ARROW-DOWN: Navega para celula inferior;
 * - ARROW-RIGHT: Navega para celula direita;
 * - ARROW-LEFT: Navega para celula esquerda;
 * - TAB: Navega para próxima celula;
 * - SHIFT+TAB: Navega para celula anterior;
 * - CTRL+DEL: Remove linha;
 * - DEL/BACKSPACE: Limpa celula;
 * - ENTER: Edita linha com valor atual/Confirma edição da celula;
 * - DOUBLE-CLICK: Edita linha com valor atual;
 * - ESC: Cancela edição da celula / Cancela inserção de linhas em branco;
 * - A..Z/0..9: Inicia edição com valor em branco.
 *
 * @example
 *
 * <example name="po-grid-basic" title="Portinari Grid Basic">
 *  <file name="sample-po-grid-basic/sample-po-grid-basic.component.html"> </file>
 *  <file name="sample-po-grid-basic/sample-po-grid-basic.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-grid',
  templateUrl: './po-grid.component.html'
})
export class PoGridComponent implements OnDestroy {

  lastCell: string = '0-0';
  lastRow: number = 0;
  lastColumn: number = 0;
  currencyCell: string = '0-0';
  currencyRow: number = 0;
  currencyColumn: number = 0;
  currencyObj: any;

  logger = false;

  width = '100%';
  widporeeze = 0;
  widthActions = 0;

  private resizeListener: () => void;
  private timeoutResize;

  @ViewChild('table', { static: true }) tableElement: ElementRef;
  @ViewChild('wrapper', { static: true }) tableWrapper: ElementRef;

  private _columns = [];

  /**
   * @description
   *
   * Ações disparadas quando uma linha do grid é manipulada.
   */
  @Input('p-row-actions') rowActions: PoGridRowActions = {};

  /**
   * Colunas exibidas no grid.
   */
  @Input('p-columns') set columns(value: Array<any>) {
    this._columns = [...value];

    this._columns.forEach(column => {
      column.label = column.label || column.property;

      if (column.freeze === true) {
        column.cssWidth = `${column.width || 100}px`;
      } else {
        column.cssWidth = column.width ? `${column.width}px` : '100%';
      }
    });
  }
  get columns(): Array<any> {
    return this._columns.filter(column => column.freeze !== true && column.action !== true);
  }

  /**
   * Lista com os dados que serão exibidos no grid.
   */
  @Input('p-data') data: Array<any> = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elRef: ElementRef,
    renderer: Renderer2) {

    this.debounceResize();

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);

    this.timeoutResize = setTimeout(() => {
      const widthTableWrapper = this.tableWrapper.nativeElement.offsetWidth;
      this.width = `${widthTableWrapper - (this.widporeeze + 8) - this.widthActions}px`;
    }, 100);
  }

  get freezeColumns() {
    const freezeColumns = this._columns.filter(column => column.freeze === true);

    this.widporeeze = freezeColumns.reduce((prev, current) => prev + (current.width || 100), 0);

    return freezeColumns;
  }

  get actionColumns() {
    const actionsColumns = this._columns.filter(column => column.action === true);

    this.widthActions = actionsColumns.length > 0 ? 56 : 0;

    return actionsColumns;
  }

  cancelRow(event: any, row: any) {
    const el = event.path.find(element => element.id);

    if (!el) {
      return;
    }

    const [x] = (el.id).split('-');

    if (this.isEmptyRow(x)) {
      if (!this.removeRow(event, row)) {
        return;
      }

      this.currencyObj = Object.assign({}, this.data[this.currencyRow - 1]);
    } else {
      this.data[+x - 1] = Object.assign({}, this.currencyObj);
      setTimeout(() => this.selectCell(this.currencyRow, this.currencyColumn));
    }
  }

  removeRow(event: any, row: any): boolean {

    if (this.rowActions.beforeRemove && !this.rowActions.beforeRemove(Object.assign({}, row))) {
      return false;
    }

    const index = this.data.indexOf(row);

    this.data.splice(index, 1);

    this.changeDetectorRef.detectChanges();

    if ((this.data.length === 0) || (index === this.data.length)) {
      this.selectCell(this.currencyRow - 1, this.currencyColumn);
    } else {
      this.selectCell(this.currencyRow, this.currencyColumn);
    }

    return true;
  }

  tableKeydown(event: any, direction: string) {
    let [row, col] = event.target.id.split('-');
    row = +row;
    col = +col;
    let prow = +row;
    let pcol = +col;

    // event.preventDefault();
    // event.stopPropagation();

    // debugger;
    if (direction === 'down') {
      if (row <= this.data.length) {
        prow++;
      }

      if (row === this.data.length) {
        if (row === 0 || !this.isEmptyRow(row)) {
          if (this.saveRow(row)) {
            if (!this.insertRow()) {
              return;
            }
          } else {
            return;
          }
        } else {
          prow--;
        }
      }
    } else if ((direction === 'up') && (row > 0)) {
      prow--;
    } else if ((direction === 'left') && (col > 0)) {
      pcol--;
    } else if ((direction === 'right') && (col < this._columns.length - 1)) {
      pcol++;
    } else if (direction === 'next') {
      if (col < this._columns.length - 1) {
        pcol++;
        event.preventDefault();
      } else if (row < this.data.length) {
        pcol = 0;
        prow++;
        event.preventDefault();
      }
    } else if (direction === 'prior') {
      if (col > 0) {
        pcol--;
        event.preventDefault();
      } else if (row > 0) {
        pcol = this._columns.length - 1;
        prow--;
        event.preventDefault();
      }
    }

    if (this.currencyCell === `${prow}-${pcol}`) {
      // console.log('vazou');
      return;
    }

    // debugger;
    if (prow !== this.currencyRow && row > 0 && this.data.length >= row) {
      if (!this.isEmptyRow(row)) {
        if (!this.saveRow(row)) {
          return;
        }
      } else {
        if (!this.removeRow(event, row)) {
          return;
        }
      }
    }

    if (this.currencyRow !== prow) {
      this.currencyObj = Object.assign({}, this.data[prow - 1]);
      // console.log('mudou de linha');
    }

    this.lastCell = event.target.id;
    this.lastRow = row;
    this.lastColumn = col;

    this.selectCell(prow, pcol);
  }

  tableClick(event: any) {
    const el = event.path.find(element => element.id);

    if (!el) {
      this.selectCell(this.currencyRow, this.currencyColumn);
      return;
    }

    if (this.currencyCell === el.id) {
      return;
    }

    const [row, col] = (el.id).split('-');
    const prow = +row;
    const pcol = +col;

    if (prow !== this.currencyRow) {
      if (this.currencyRow > 0) {
        if (!this.isEmptyRow(this.currencyRow)) {
          if (!this.saveRow(this.currencyRow)) {
            this.selectCell(this.currencyRow, this.currencyColumn);
            return;
          }
        } else {
          if (!this.removeRow(event, row)) {
            return;
          }
        }
      }

      this.currencyObj = Object.assign({}, this.data[prow - 1]);
      // console.log('>>>>>>> ', prow - 1);
    }

    this.lastCell = this.currencyCell;
    this.lastRow = this.currencyRow;
    this.lastColumn = this.currencyColumn;

    this.currencyCell = el.id;
    this.currencyRow = prow;
    this.currencyColumn = pcol;
  }

  saveRow(row: number): boolean {
    // console.log(this.data[row - 1]);

    const obj = this.data[row - 1];

    if (!Object.keys(obj).some(prop => obj[prop] !== this.currencyObj[prop])) {
      // console.log('tudo igual');
      return true;
    }

    if (this.rowActions.beforeSave && !this.rowActions.beforeSave(obj, this.currencyObj)) {
      return false;
    }

    const requireds = [];

    this.columns.forEach(column => {
      if (column.required === true && !obj[column.property]) {
        requireds.push(column.property);
      }
    });

    return requireds.length === 0;
  }

  insertRow() {
    const obj = {};

    if (this.rowActions.beforeInsert && !this.rowActions.beforeInsert(obj)) {
      return false;
    }

    // this.currencyObj = Object.assign({}, obj);

    this.data.push(obj);
    this.changeDetectorRef.detectChanges();

    return true;
  }

  isEmptyRow(row: number) {
    const obj = this.data[row - 1];

    if (!obj) { // title
      return false;
    }

    const filled = Object.keys(obj).some(property => obj[property]);

    return !filled;
  }

  selectCell(row: number, col: number) {
    const nextCell = this.elRef.nativeElement.querySelector(`[id='${row}-${col}']`);

    if (nextCell) {
      this.currencyCell = `${row}-${col}`;
      this.currencyRow = row;
      this.currencyColumn = col;
      nextCell.focus();
    }
  }
}
