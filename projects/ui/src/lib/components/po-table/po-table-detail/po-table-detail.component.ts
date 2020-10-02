import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { capitalizeFirstLetter, isTypeof } from '../../../utils/util';

import { PoTableDetail } from './po-table-detail.interface';
import { PoTableDetailColumn } from './po-table-detail-column.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por apresentar o detalhe de cada linha da tabela.
 */
@Component({
  selector: 'po-table-detail',
  templateUrl: './po-table-detail.component.html'
})
export class PoTableDetailComponent {
  private _detail: PoTableDetail;

  /**
   * Configuração da linha de detalhes.
   */
  @Input('p-detail') set detail(value: PoTableDetail) {
    this._detail = this.returnPoTableDetailObject(value);
  }

  get detail() {
    return this._detail;
  }

  /**
   * Lista de itens do _detail_ da tabela.
   */
  @Input('p-items') items: Array<any>;

  /**
   * Define se a tabela possui a opção de `selectable` habilitada.
   */
  @Input('p-selectable') isSelectable?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Ação executada ao selecionar ou desmarcar a seleção de uma linha de detalhe do `po-table`.
   */
  @Output('p-select-row') selectRow: EventEmitter<any> = new EventEmitter<any>();

  constructor(private decimalPipe: DecimalPipe) {}

  get detailColumns(): Array<PoTableDetailColumn> {
    return this.detail?.columns || [];
  }

  get typeHeaderInline(): boolean {
    return (this.detail && !this.detail['typeHeader']) || this.detail['typeHeader'] === 'inline';
  }

  get typeHeaderTop(): boolean {
    return this.detail && this.detail['typeHeader'] === 'top';
  }

  formatNumberDetail(value: any, format: string) {
    if (!format) {
      return value;
    }

    return this.decimalPipe.transform(value, format);
  }

  getColumnTitleLabel(detail: PoTableDetailColumn) {
    return detail.label || capitalizeFirstLetter(detail.property);
  }

  onSelectRow(item) {
    item.$selected = !item.$selected;
    this.selectRow.emit(item);
  }

  private returnPoTableDetailObject(value: any) {
    if (value && isTypeof(value, 'object')) {
      if (value.columns) {
        value.columns.forEach(column => (column.property = column.property || column.column));
      }

      if (Array.isArray(value)) {
        return { columns: value };
      }

      if (value.columns) {
        return value;
      }
    }
  }
}
