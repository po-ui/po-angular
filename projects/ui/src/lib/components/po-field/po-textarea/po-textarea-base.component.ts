import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, convertToInt } from '../../../utils/util';
import { maxlengpoailed, minlengpoailed, requiredFailed } from '../validators';
import { InputBoolean } from '../../../decorators';

/**
 * @description
 *
 * Este é um componente de entrada de dados que possibilita o preechimento com múltiplas linhas.
 * É recomendado para observações, detalhamentos e outras situações onde o usuário deva preencher com um texto.
 *
 * Importante:
 *
 * - A propriedade `name` é obrigatória para que o formulário e o `model` funcionem corretamente. Do contrário, ocorrerá um erro de
 * _Angular_, onde será necessário informar o atributo `name` ou o atributo `[ngModelOptions]="{standalone: true}"`, por exemplo:
 *
 * ```
 * <po-textarea
 *   [(ngModel)]="pessoa.nome"
 *   [ngModelOptions]="{standalone: true}">
 * </po-textarea>
 * ```
 */
@Directive()
export abstract class PoTextareaBaseComponent implements ControlValueAccessor, Validator {
  private _disabled: boolean = false;
  private _maxlength: number;
  private _minlength: number;
  private _readonly: boolean = false;
  private _required: boolean = false;
  private _rows: number = 3;

  private modelLastUpdate: any;
  private onChangePropagate: any = null;
  private validatorChange: any;
  // tslint:disable-next-line
  protected onTouched: any = null;

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

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  /** Placeholder, mensagem que aparecerá enquanto o campo não estiver preenchido. */
  @Input('p-placeholder') placeholder?: string = '';

  /** Nome e Id do componente. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = convertToBoolean(disabled);
  }

  get disabled(): boolean {
    return this._disabled;
  }

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
   *
   * Indica que o campo será somente leitura.
   *
   * @default `false`
   */
  @Input('p-readonly') set readonly(readonly: boolean) {
    this._readonly = convertToBoolean(readonly);
  }

  get readonly(): boolean {
    return this._readonly;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será obrigatório.
   *
   * > Esta propriedade é desconsiderada quando o _input_ está desabilitado `(p-disabled)`.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel();
  }

  get required(): boolean {
    return this._required;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica a quantidade mínima de caracteres que o campo aceita.
   */
  @Input('p-minlength') set minlength(minlength: number) {
    this._minlength = convertToInt(minlength);
    this.validateModel();
  }

  get minlength(): number {
    return this._minlength;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica a quantidade máxima de caracteres que o campo aceita.
   */
  @Input('p-maxlength') set maxlength(maxlength: number) {
    this._maxlength = convertToInt(maxlength);
    this.validateModel();
  }

  get maxlength(): number {
    return this._maxlength;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica a quantidade de linhas que serão exibidas.
   *
   * @default `3`
   */
  @Input('p-rows') set rows(value: number) {
    this._rows = isNaN(parseInt(<any>value, 10)) || value < 3 ? 3 : parseInt(<any>value, 10);
  }
  get rows(): number {
    return this._rows;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao entrar do campo.
   */
  @Output('p-enter') enter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor e deixar o campo.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do model.
   */
  @Output('p-change-model') changeModel: EventEmitter<any> = new EventEmitter<any>();

  callOnChange(value: any) {
    // Quando o input não possui um formulário, então esta função não é registrada
    if (this.onChangePropagate) {
      this.onChangePropagate(value);
    }

    this.controlChangeModelEmitter(value);
  }

  controlChangeModelEmitter(value: any) {
    if (this.modelLastUpdate !== value) {
      this.changeModel.emit(value);
      this.modelLastUpdate = value;
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // Funções `registerOnChange`, `registerOnTouched` e `registerOnValidatorChange` implementadas referentes ao ControlValueAccessor
  // usadas para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangePropagate = func;
  }

  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  registerOnValidatorChange(func: any): void {
    this.validatorChange = func;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }

    if (minlengpoailed(this.minlength, abstractControl.value)) {
      return {
        minlength: {
          valid: false
        }
      };
    }

    if (maxlengpoailed(this.maxlength, abstractControl.value)) {
      return {
        maxlength: {
          valid: false
        }
      };
    }
  }

  // Função implementada do ControlValueAccessor
  writeValue(value: any) {
    this.writeValueModel(value);
  }

  protected validateModel() {
    if (this.validatorChange) {
      this.validatorChange();
    }
  }

  abstract writeValueModel(value: any): void;
}
