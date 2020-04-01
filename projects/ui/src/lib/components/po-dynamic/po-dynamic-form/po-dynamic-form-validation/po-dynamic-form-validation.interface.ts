import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormResponse } from '../po-dynamic-form-response.interface';

/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 * <a id="po-dynamic-form-validation"></a>
 *
 * Estrutura de retorno da validação do formulário.
 *
 * @docsExtends PoDynamicFormResponse
 */
export interface PoDynamicFormValidation extends PoDynamicFormResponse {
  /**
   * Lista com as novas definições dos campos.
   *
   * > Não é necessário colocar todas as propriedades e campos, apenas as que foram alteradas.
   */
  fields?: Array<PoDynamicFormField>;
}
