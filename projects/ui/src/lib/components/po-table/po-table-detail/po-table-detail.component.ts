import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { capitalizeFirstLetter, getDefaultSize, isTypeof, validateSize } from '../../../utils/util';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { PoTableDetailColumn } from './po-table-detail-column.interface';
import { PoTableDetail } from './po-table-detail.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente responsável por apresentar o detalhe de cada linha da tabela.
 */
@Component({
  selector: 'po-table-detail',
  templateUrl: './po-table-detail.component.html',
  standalone: false
})
export class PoTableDetailComponent {
  private _componentsSize?: string = undefined;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no table:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-components-size') set componentsSize(value: string) {
    this._componentsSize = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * Lista de itens do _detail_ da tabela.
   */
  @Input('p-items') items: Array<any>;

  /**
   * Linha do registro pai correspondente ao item de detalhe selecionado. Utilizado para gerenciar o estado de seleção do elemento pai,
   * permitindo que o mesmo seja atualizado para refletir a seleção de todos os filhos ou estado indeterminado.
   */
  @Input('p-parent-row') parentRow: PoTableDetail;

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

  constructor(
    protected poThemeService: PoThemeService,
    private decimalPipe: DecimalPipe
  ) {}

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

  getDetailData(item: any, detail: PoTableDetailColumn) {
    const arrayProperty = detail.property.split('.');
    if (arrayProperty.length > 1) {
      const nestedProperties = arrayProperty;
      let value: any = item;
      for (const property of nestedProperties) {
        value = value[property] || value[property] === 0 ? value[property] : '';
      }
      return value;
    } else {
      return item[detail.property];
    }
  }

  onSelectRow(item) {
    item.$selected = !item.$selected;
    this.selectRow.emit({ item: item, parentRow: this.parentRow });
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
