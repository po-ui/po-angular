import { PoComboOption } from './po-combo-option.interface';
import { PoComboOptionGroup } from './po-combo-option-group.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Interface que extende as propriedades existentes nas interfaces `PoComboOption` e `PoComboOptionGroup`.
 */
export interface PoComboGroup extends Partial<PoComboOption>, Partial<PoComboOptionGroup> {}
