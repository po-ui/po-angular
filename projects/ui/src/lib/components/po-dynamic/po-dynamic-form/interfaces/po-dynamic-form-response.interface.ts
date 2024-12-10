import { PoDynamicFormField } from './po-dynamic-form-field.interface';

export interface PoDynamicFormResponse {
  fields?: Array<PoDynamicFormField>;

  /**
   * Nome do campo que receberá o foco.
   *
   * Exemplo:
   *
   * ```
   * focus: 'name'
   * ```
   */
  focus?: string;

  /**
   * Objeto contendo os novos valores.
   *
   * Exemplo:
   *
   * ```
   * {
   *   name: 'new name',
   *   age: 10
   * }
   * ```
   *
   * > Não é necessário colocar os valores de todos os campos, apenas os que foram alterados.
   */
  value?: any;
}
