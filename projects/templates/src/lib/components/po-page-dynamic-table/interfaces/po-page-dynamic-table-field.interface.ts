import { PoDynamicFormField } from '@po-ui/ng-components';

/**
 * @docsExtends PoDynamicFormField
 *
 */
export interface PoPageDynamicTableField extends PoDynamicFormField {
  /** Indica se o campo será duplicado caso seja executada a ação de duplicação. */
  duplicate?: boolean;

  /** Indica se o campo será usado para busca avançada. */
  filter?: boolean;

  /** Tamanho da coluna em pixels ou porcetagem. */
  width?: number | string;

  /**
   * Permite o campo aparecer no gerenciador de colunas, mesmo que esteja utilizando `visible: false`,
   * possibilitando ativar a exibição na tabela.
   *
   * > Quando for `false`, será desconsiderado.
   */
  allowColumnsManager?: boolean;
}
