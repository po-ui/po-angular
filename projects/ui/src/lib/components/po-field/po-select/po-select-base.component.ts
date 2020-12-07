import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { ChangeDetectorRef, ElementRef, EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';
import { InputBoolean } from '../../../decorators';
import { requiredFailed } from '../validators';

import { PoSelectOption } from './po-select-option.interface';

/**
 * @description
 *
 * O componente po-select exibe uma lista de valores e permite que o usuário selecione um desses valores.
 * Os valores listados podem ser fixos ou dinâmicos de acordo com a necessidade do desenvolvedor, dando mais flexibilidade ao componente.
 * O po-select não permite que o usuário informe um valor diferente dos valores listados, isso garante a consistência da informação.
 * O po-select não permite que sejam passados valores duplicados, undefined e null para as opções, excluindo-os da lista.
 *
 * > Ao passar um valor para o _model_ que não está na lista de opções, o mesmo será definido como `undefined`.
 *
 * Também existe a possibilidade de utilizar um _template_ para a exibição dos itens da lista,
 * veja mais em **[p-select-option-template](/documentation/po-select-option-template)**.
 */
@Directive()
export abstract class PoSelectBaseComponent implements ControlValueAccessor, Validator {
  private _disabled?: boolean = false;
  private _options: Array<PoSelectOption>;
  private _readonly: boolean = false;
  private _required?: boolean = false;

  private onValidatorChange;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   * > Caso mais de um elemento seja configurado com essa propriedade,
   * o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /** Adiciona uma label no componente. */
  @Input('p-label') label?: string;

  /** Nome do componente. */
  @Input('name') name: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /** Mensagem que aparecerá enquanto nenhuma opção estiver selecionada. */
  @Input('p-placeholder') placeholder?: string;

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
   * Nesta propriedade deve ser definido uma coleção de objetos que implementam a interface `PoSelectOption`.
   *
   * Caso esta lista estiver vazia, o model será `undefined`.
   *
   * > Essa propriedade é imutável, ou seja, sempre que quiser atualizar a lista de opções disponíveis
   * atualize a referência do objeto:
   *
   * ```
   * // atualiza a referência do objeto garantindo a atualização do template
   * this.options = [...this.options, { value: 'x', label: 'Nova opção' }];
   *
   * // evite, pois não atualiza a referência do objeto podendo gerar atrasos na atualização do template
   * this.options.push({ value: 'x', label: 'Nova opção' });
   * ```
   */
  @Input('p-options') set options(options: Array<PoSelectOption>) {
    this._options = options;
    removeDuplicatedOptions(this._options);
    removeUndefinedAndNullOptions(this._options);
    this.onUpdateOptions();
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informada uma função que será disparada quando houver alterações no ngModel.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: string | boolean) {
    this._disabled = convertToBoolean(disabled);

    this.validateModel();
  }
  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente para leitura.
   *
   * @default `false`
   */
  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = convertToBoolean(value);
  }

  get readonly() {
    return this._readonly;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required')
  set required(required: string | boolean) {
    this._required = convertToBoolean(required);

    this.validateModel();
  }
  get required() {
    return this._required;
  }

  changeDetector: ChangeDetectorRef;
  onModelChange: any;
  onModelTouched: any;
  readyToValidation: boolean = false;

  protected clickoutListener: () => void;

  constructor(public element: ElementRef, changeDetector: ChangeDetectorRef) {
    this.element = element;
    this.changeDetector = changeDetector;
  }

  callModelChange(value: any) {
    // Caso o componente estiver dentro de um form, terá acesso ao método onModelChange.
    return this.onModelChange ? this.onModelChange(value) : this.ngModelChange.emit(value);
  }

  onChange(value) {
    this.change.emit(value);
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this._required, this._disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }

    return null;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.changeDetector.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  registerOnValidatorChange(fn: any) {
    this.onValidatorChange = fn;
  }

  private validateModel() {
    if (this.onValidatorChange) {
      this.onValidatorChange();
    }
  }

  abstract onUpdateOptions(): void;

  abstract updateModel(selectOption: PoSelectOption): void;

  abstract writeValue(value: any): void;
}
