import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 * <a id="po-dynamic-form-validation"></a>
 *
 * Estrutura de retorno da validação do formulário.
 */
export interface PoDynamicFormValidation {

  /**
   * Lista com as novas definições dos campos.
   *
   * > Não é necessário colocar todas as propriedades e campos, apenas as que foram alteradas.
   */
  fields?: Array<PoDynamicFormField>;

  /** Nome da campo que receberá o foco.
   *
   * Exemplo:
   *
   * ```
   * focus: 'name'
   * ```
   */
  focus?: string;

  /** Objeto contendo os novos valores.
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
