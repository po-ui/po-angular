import { PoDynamicViewField } from '@po-ui/ng-components';

/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Interface dos fields usados para compor o template `po-page-dynamic-detail`.
 */

export interface PoPageDynamicDetailField extends PoDynamicViewField {
  /** Indica se o campo será duplicado caso seja executada a ação de duplicação. */
  duplicate?: boolean;
}
