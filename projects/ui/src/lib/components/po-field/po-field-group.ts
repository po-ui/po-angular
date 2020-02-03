import { Input, QueryList, ElementRef } from '@angular/core';

import { PoFieldValidate } from './po-field-validate';
import { PoCheckboxGroupOption } from './po-checkbox-group/interfaces/po-checkbox-group-option.interface';
import { convertToInt } from '../../utils/util';

const poGroupColumnsDefaultLength = 6;
const poGroupColumnsTotalLength = 12;

export abstract class PoFieldGroup<T> extends PoFieldValidate<T> {

  _options: Array<PoCheckboxGroupOption>;
  _columns: number;

  mdColumns: any;

  /**
   * @optional
   *
   * @description
   * Lista de opções que serão exibidas
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface PoCheckboxGroupOption
   */
  @Input('p-options') set options(value: Array<PoCheckboxGroupOption>) {
    this._options = Array.isArray(value) ? value : [];
    this.removeDuplicatedOptions();
    // this.setCheckboxGroupOptionsView(this.options); CHECKBOXGROUP
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Possibilita definir a quantidade de colunas para exibição dos itens do *checkbox*.
   * - É possível exibir as opções entre `1` e `4` colunas.
   * - Para resolução `sm` a colunagem invariavelmente passa para `1` coluna.
   * - Quando se trata de resolução `md` e o valor estabelecido para colunas for superior a `2`,
   * o *grid system* será composto por `2` colunas.
   * - Para evitar a quebra de linha, prefira a utilização de `1` coluna para opções com textos grandes.
   *
   * @default `2`
   *
   */
  @Input('p-columns') set columns(value: number) {
    const columns = convertToInt(value, poGroupColumnsDefaultLength);

    this._columns = this.getGridSystemColumns(columns, 4);
    this.mdColumns = this.getGridSystemColumns(columns, 2);
  }

  get columns() {
    return this._columns;
  }

  abstract getGroupItems(): QueryList<ElementRef>;

  /** focuss */
  focus() {
    const groupItems = this.getGroupItems();

    if (groupItems && !this.disabled) {
      const groupItem = groupItems.find((_, index) => !this.options[index].disabled);

      if (groupItem) {
        groupItem.nativeElement.focus();
      }
    }
  }

  private removeDuplicatedOptions() {
    this.options.forEach((option, index) => {
      const duplicatedIndex = this.options.findIndex((optionFind: any) => optionFind.value === option.value) === index;
      if (!duplicatedIndex) {
        this.options.splice(this.options.indexOf(option), 1);
      }
    });
  }

  private getGridSystemColumns(columns: number, maxColumns: number): number {
    const gridSystemColumns = poGroupColumnsTotalLength / columns;

    return this.checkColumnsRange(columns, maxColumns) ? gridSystemColumns : poGroupColumnsDefaultLength;
  }

  private checkColumnsRange(columns, maxColumns): boolean {
    const minColumns = 1;

    return columns >= minColumns && columns <= maxColumns;
  }

}
