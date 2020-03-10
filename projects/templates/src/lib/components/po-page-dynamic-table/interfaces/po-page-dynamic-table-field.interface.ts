import { PoDynamicFormField } from '@portinari/portinari-ui';

/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface dos fields usados para compor o template `po-page-dynamic-table`.
 */
export interface PoPageDynamicTableField extends PoDynamicFormField {
  /** Indica se o campo será duplicado caso seja executada a ação de duplicação. */
  duplicate?: boolean;

  /** Indica se o campo será usado para busca avançada. */
  filter?: boolean;

  /** Tamanho da coluna em pixels ou porcetagem. */
  width?: number | string;
}
