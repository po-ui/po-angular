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

  /** Aplica foco no campo quando o componente for iniciado. */
  focus?: boolean;
}
