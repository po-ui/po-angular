import { PoItemListOption } from './po-item-list-option.interface';

export interface PoItemListOptionGroup {
  /** Rótulo da ação. */
  label: string;

  /** Array de PoItemListOption */
  options: Array<PoItemListOption>;
}
