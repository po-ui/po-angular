import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { Input } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';
import { requiredFailed } from '../validators';

/**
 * @description
 *
 * O componente `po-rich-text` é um editor de textos enriquecidos.
 *
 * Para edição de texto simples sem formatação recomenda-se o uso do componente [**po-textarea**](/documentation/po-textarea).
 */
export abstract class PoRichTextBaseComponent implements ControlValueAccessor, Validator {

  private _height?: number;
  private _placeholder: string;
  private _readonly: boolean;
  private _required: boolean;

  invalid: boolean = false;
  onChangeModel: any = null;
  value: string;

  // tslint:disable-next-line
  private onTouched: any = null;
  private validatorChange: any;

  /**
   * @description
   *
   * Mensagem que será apresentada quando a propriedade required estiver habilitada e o campo for limpo após algo ser digitado.
   */
  @Input('p-error-message') errorMessage?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da área de edição de texto.
   *
   * > Altura mínima do componente é `94` e a altura máxima é `262`.
   */
  @Input('p-height') set height(height: number) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Texto de apoio do campo.
   */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Rótulo do campo.
   */
  @Input('p-label') label?: string;

  /** Nome e identificador do campo. */
  @Input('name') name: string;

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
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   *
   * @default ''
   */
  @Input('p-placeholder') set placeholder(value: string) {
    this._placeholder = value || '';
  }

  get placeholder() {
    return this._placeholder;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente leitura.
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
  @Input('p-required') set required(value: boolean) {
    this._required = convertToBoolean(value);

    this.validateModel(this.value);
  }

  get required() {
    return this._required;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangeModel = func;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any; } {
    if (requiredFailed(this.required, false, abstractControl.value)) {
      return { required: {
        valid: false,
      }};
    }
  }

  writeValue(value: string): void {
    this.value = value;
  }

  // Executa a função onChange
  protected updateModel(value: any) {
    // Quando o rich-text não possui um formulário, então esta função não é registrada
    if (this.onChangeModel) {
      this.onChangeModel(value);
    }
  }

  protected validateModel(value: any) {
    if (this.validatorChange) {
      this.validatorChange(value);
    }
  }

}
