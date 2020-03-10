import { PoBreadcrumb } from '../po-breadcrumb/po-breadcrumb.interface';

/**
 * @usedBy PoPageComponent
 *
 * @description
 *
 * Interface para o atributo `filter` do componente `po-page`.
 */
export interface PoPage {
  /** Objeto com propriedades do breadcrumb. */
  breadcrumb?: PoBreadcrumb;

  /** Título da página. */
  title?: string;
}
