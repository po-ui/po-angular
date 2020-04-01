import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 * <a id="po-dynamic-form-field-validation"></a>
 *
 * Estrutura de retorno da validação de um campo.
 */
export interface PoDynamicFormFieldValidation {
  /**
   * Novas definições das propriedades do campo.
   *
   * > Não é necessário colocar todas as propriedades, apenas as que foram alteradas.
   */
  field?: PoDynamicFormField;

  /** Coloca o foco no campo após a validação. */
  focus?: boolean;

  /** Novo valor do campo */
  value?: any;
}
