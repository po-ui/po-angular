/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 *
 * Estrutura dos valores que serão disparados quando houver uma mudança em um campo ou no formulário.
 */
export interface PoDynamicFormFieldChanged {
  /** Valor da propriedade do campo. */
  property: string;

  /** Novo valor do campo. */
  value: any;
}
