import { PoDynamicFormField, PoTableColumnLabel } from '@po-ui/ng-components';

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

  /**
   * @optional
   *
   * @description
   *
   * Controla se a coluna será considerada como "ordenável". Caso seja definido um valor falso, a coluna não será usada para
   * ordenação.
   *
   * @default `true`
   */
  sortable?: boolean;

  /**
   * Lista de objetos do tipo `PoTableColumnLabel` que representa as labels disponíveis na coluna do tipo `label`.
   *
   * Exemplo de utilização
   *
   * ```
   * {
   *   property: 'uf',
   *   label: 'Estados',
   *   type: 'label',
   *   labels: [
   *     { value: 'SC', label: 'SANTA CATARINA', color: 'color-02' },
   *     { value: 'SP', label: 'SAO PAULO', color: 'color-10' }
   *   ],
   * }
   * ```
   */
  labels?: Array<PoTableColumnLabel>;
}
