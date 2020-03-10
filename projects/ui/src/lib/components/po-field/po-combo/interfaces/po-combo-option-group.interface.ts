import { PoComboOption } from './po-combo-option.interface';

/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface dos agrupamentos da coleção que será exibida no dropdown do `po-combo`.
 */
export interface PoComboOptionGroup {
  /** Título para cada grupo de opções. */
  label: string;

  /** Lista de itens a serem exibidos. */
  options: Array<PoComboOption>;
}
