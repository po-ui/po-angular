import { PoPage } from '../interfaces/po-page.interface';
import { PoPageAction } from '../interfaces/po-page-action.interface';

/**
 * @usedBy PoPageComponent
 *
 * @description
 *
 * Interface para o atributo `filter` do componente `po-page`.
 */
export interface PoPageDefault extends PoPage {
  /** Array de objetos que implementam a interface `PoPageAction`. */
  actions?: Array<PoPageAction>;
}
