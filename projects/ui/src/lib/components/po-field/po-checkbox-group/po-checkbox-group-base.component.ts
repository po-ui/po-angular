import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, convertToInt, uuid } from './../../../utils/util';
import { InputBoolean } from '../../../decorators';
import { requiredFailed } from '../validators';

import { PoCheckboxGroupOption } from './interfaces/po-checkbox-group-option.interface';
import { PoCheckboxGroupOptionView } from './interfaces/po-checkbox-group-option-view.interface';

const poCheckboxGroupColumnsDefaultLength: number = 6;
const poCheckboxGroupColumnsTotalLength: number = 12;

/**
 * @description
 *
 * O componente `po-checkbox-group` exibe uma lista de múltipla escolha onde o usuário pode marcar e desmarcar,
 * utilizando a tecla de espaço ou o clique do mouse, várias opções.
 *
 * > Para seleção única, utilize o [**Portinari Radio Group**](/documentation/po-radio-group).
 *
 * Por padrão, o po-checkbox-group retorna um array com os valores dos itens selecionados para o model.
 *
 * ```
 * favorites = ['PO', 'Angular'];
 * ```
 *
 * Na maioria das situações, o array com os objetos setados já atende as necessidades mas, caso o desenvolvedor
 * tenha necessidade de usar um valor indeterminado (`null`), ou seja, nem marcado (`true`) e nem desmarcado (`false`),
 * deve setar a propriedade `p-indeterminate` como `true`.
 *
 * Nesse caso, o po-checkbox-group vai retornar um objeto com todas as opções disponíveis e seus valores.
 *
 * ```
 * favorites = {
 *  PO: true,
 *  Angular: true,
 *  VueJS: false,
 *  React: null // indeterminado
 * };
 * ```
 */
@Directive()
export class PoCheckboxGroupBaseComponent implements ControlValueAccessor, Validator {
  checkboxGroupOptionsView: Array<PoCheckboxGroupOptionView>;
  checkedOptions: any = {};
  checkedOptionsList: any = [];
  mdColumns: number = poCheckboxGroupColumnsDefaultLength;
  propagateChange: any;
  validatorChange: any;

  private _columns: number = poCheckboxGroupColumnsDefaultLength;
  private _disabled?: boolean = false;
  private _indeterminate?: boolean = false;
  private _options?: Array<PoCheckboxGroupOption>;
  private _required?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /** Nome dos checkboxes */
  @Input('name') name: string;

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
    const columns = convertToInt(value, poCheckboxGroupColumnsDefaultLength);

    this._columns = this.getGridSystemColumns(columns, 4);
    this.mdColumns = this.getGridSystemColumns(columns, 2);
  }

  get columns() {
    return this._columns;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita todos os itens do checkbox.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);

    this.validateModel(this.checkIndeterminate());
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /** Texto de apoio do campo */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Caso exista a necessidade de usar o valor indeterminado (`null`) dentro da lista de opções, é necessário setar
   * a propriedade `p-indeterminate` como `true`, por padrão essa propriedade vem desabilitada (`false`).
   *
   * Quando essa propriedade é setada como `true`, o *po-checkbox-group* passa a devolver um objeto completo para o
   * `ngModel`, diferente do array que contém apenas os valores selecionados.
   *
   * @default `false`
   */
  @Input('p-indeterminate') set indeterminate(indeterminate: boolean) {
    this._indeterminate = convertToBoolean(indeterminate);
  }

  get indeterminate() {
    return this._indeterminate;
  }

  /** Label do campo */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

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
    this.setCheckboxGroupOptionsView(this.options);
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel(this.checkIndeterminate());
  }

  get required() {
    return this._required;
  }

  // Função para atualizar o `ngModel` do componente, necessário quando não for utilizado dentro da tag form.
  @Output('ngModelChange') ngModelChange?: EventEmitter<any> = new EventEmitter<any>();

  /** Evento disparado ao alterar valor do campo */
  @Output('p-change') change?: EventEmitter<any> = new EventEmitter<any>();

  changeValue() {
    const value = this.checkIndeterminate();

    if (this.propagateChange) {
      this.propagateChange(value);
    } else {
      this.ngModelChange.emit(value);
    }

    this.change.emit(value);
  }

  checkIndeterminate() {
    return this.indeterminate ? this.checkedOptions : this.checkedOptionsList;
  }

  checkOption(value: PoCheckboxGroupOption) {
    if (!this._disabled && !value.disabled) {
      this.checkOptionModel(value);
      this.changeValue();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  writeValue(optionsModel: any) {
    if (optionsModel && this.checkedOptions !== optionsModel) {
      this.generateCheckOptions(optionsModel);
    } else {
      this.checkedOptionsList = [];
      this.checkedOptions = {};
    }
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (
      (!this.indeterminate && requiredFailed(this.required, this.disabled, abstractControl.value)) ||
      this.isInvalidIndeterminate()
    ) {
      return {
        required: {
          valid: false
        }
      };
    }
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  private checkColumnsRange(columns, maxColumns): boolean {
    const minColumns = 1;

    return columns >= minColumns && columns <= maxColumns;
  }

  private checkOptionModel(optionChecked: PoCheckboxGroupOption) {
    this.checkedOptions[optionChecked.value] = !this.checkedOptions[optionChecked.value];

    if (!this.indeterminate && this.checkedOptionsList.includes(optionChecked.value)) {
      this.checkedOptionsList.splice(this.checkedOptionsList.indexOf(optionChecked.value), 1);
    } else if (!this.indeterminate) {
      this.checkedOptionsList.push(optionChecked.value);
    }
  }

  private generateCheckOptions(optionsModel: any) {
    this.checkedOptions = {};

    if (optionsModel instanceof Array) {
      this.checkedOptionsList = optionsModel;

      this.options.forEach((option: PoCheckboxGroupOption) => {
        this.checkedOptions[option.value] = optionsModel.includes(option.value);
      });
    } else {
      this.options.forEach((option: PoCheckboxGroupOption) => {
        optionsModel[option.value] = optionsModel[option.value] === undefined ? false : optionsModel[option.value];
        this.checkedOptions = optionsModel;
      });
    }
  }

  private getGridSystemColumns(columns: number, maxColumns: number): number {
    const gridSystemColumns = poCheckboxGroupColumnsTotalLength / columns;

    return this.checkColumnsRange(columns, maxColumns) ? gridSystemColumns : poCheckboxGroupColumnsDefaultLength;
  }

  private isInvalidIndeterminate() {
    if (this.indeterminate && this.required && this.checkedOptions) {
      return (<any>Object).values(this.checkedOptions).every(value => value === false);
    }
    return false;
  }

  private removeDuplicatedOptions() {
    this.options.forEach((option, index) => {
      const duplicatedIndex = this.options.findIndex((optionFind: any) => optionFind.value === option.value) === index;
      if (!duplicatedIndex) {
        this.options.splice(this.options.indexOf(option), 1);
      }
    });
  }

  private setCheckboxGroupOptionsView(optionsList: Array<PoCheckboxGroupOption>) {
    this.checkboxGroupOptionsView = optionsList.map(option => {
      return { ...option, id: uuid() };
    });
  }
}
