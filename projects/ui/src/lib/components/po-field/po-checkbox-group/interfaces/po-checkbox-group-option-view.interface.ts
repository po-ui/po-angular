import { PoCheckboxGroupOption } from './po-checkbox-group-option.interface';

/**
 * @docsPrivate
 *
 * @usedBy PoCheckboxGroupComponent
 *
 * @description
 *
 * Interface para as ações do componente po-checkbox-group utilizada no template.
 *
 */
export interface PoCheckboxGroupOptionView extends PoCheckboxGroupOption {
  // Identificador do item.
  id: string;
}
