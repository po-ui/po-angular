import { PoDynamicFormField } from '../../../po-dynamic/po-dynamic-form/interfaces/po-dynamic-form-field.interface';

/**
 * @docsExtends PoDynamicFormField
 *
 * @usedBy PoLookupComponent
 *
 * @ignoreExtendedDescription
 *
 * @description
 *
 * Interface para definição das propriedades dos campos de entrada que serão criados dinamicamente na busca avançada.
 */
export interface PoLookupAdvancedFilter extends PoDynamicFormField {
  /**
   * @optional
   *
   * @description
   *
   * Define um valor inicial para um filtro de busca avançada.
   *
   * O valor será atribuído ao campo correspondente à propriedade `property` sempre que a janela de busca avançada for aberta.
   */
  initValue?: any;
}
