import { PoDynamicFormField } from '@po-ui/ng-components';

/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Interface dos fields usados para compor o template `po-page-dynamic-edit`.
 * Herda as definições da interface
 * [PoDynamicFormField](https://po-ui.io/documentation/po-dynamic-form).
 */
export interface PoPageDynamicEditField extends PoDynamicFormField {
  /** Indica se o campo será duplicado caso seja executada a ação de duplicação. */
  duplicate?: boolean;
}
