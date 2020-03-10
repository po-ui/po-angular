import { PoTableColumn } from './po-table-column.interface';
import { PoTableColumnSortType } from '../enums/po-table-column-sort-type.enum';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para ordenação das colunas do componente table.
 */
export interface PoTableColumnSort {
  /** Coluna pela qual a tabela está ordenada. */
  column?: PoTableColumn;

  /** Tipo da ordenação. */
  type: PoTableColumnSortType;
}
