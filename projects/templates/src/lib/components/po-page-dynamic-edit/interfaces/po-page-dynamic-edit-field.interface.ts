import { PoDynamicFormField } from '@po-ui/ng-components';

/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Interface dos fields usados para compor o template `po-page-dynamic-edit`.
 */
export interface PoPageDynamicEditField extends PoDynamicFormField {
  /** Indica se o campo será duplicado caso seja executada a ação de duplicação. */
  duplicate?: boolean;
}
