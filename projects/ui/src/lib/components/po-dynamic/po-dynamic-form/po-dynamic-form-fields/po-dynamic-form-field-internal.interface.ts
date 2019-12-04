import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Interface utilizada para os *fields* tratados internamente.
 */
export interface PoDynamicFormFieldInternal extends PoDynamicFormField {

  // classes que são repassadas ao camponente.
  componentClass?: string;

  // camponente a ser utilizado.
  control?: string;

  /**
   * Aplica foco no campo quando o componente for iniciado.
   *
   * > Os seguintes componentes ainda não contemplam esta propriedade:
   *  - `po-checkbox-group`
   *  - `po-combo`
   *  - `po-radio-group`
   *  - `po-select`
   *  - `po-switch`
   */
  focus?: boolean;

}
