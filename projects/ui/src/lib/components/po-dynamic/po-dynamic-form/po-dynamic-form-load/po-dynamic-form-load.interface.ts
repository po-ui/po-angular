import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormResponse } from '../po-dynamic-form-response.interface';

/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 * <a id="po-dynamic-form-load"></a>
 *
 * Estrutura de retorno no carregamento do formulário.
 *
 * @docsExtends PoDynamicFormResponse
 */
export interface PoDynamicFormLoad extends PoDynamicFormResponse {
  /**
   * Lista com as novas definições dos campos.
   *
   * > Não é necessário colocar todas as propriedades e campos, apenas as que precisam ser alteradas ou adicionadas.
   */
  fields?: Array<PoDynamicFormField>;
}
