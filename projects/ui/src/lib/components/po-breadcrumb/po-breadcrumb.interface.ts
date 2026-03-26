import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

/**
 * @usedBy
 *
 * PoPageDefaultComponent, PoPageDetailComponent, PoPageEditComponent, PoPageListComponent, PoPageDynamicSearchBaseComponent
 *
 * @description
 *
 * Interface que define o `po-breadcrumb`.
 *
 * > O breadcrumb é compatível apenas com o header `primary` do `po-page-default`.
 * Quando `p-page-header-type` for `secondary` ou `tertiary`, o breadcrumb não será exibido.
 */
export interface PoBreadcrumb {
  /**
   * @optional
   *
   * @description
   *
   * Permite definir uma URL para favoritar ou desfavoritar.
   *
   * > Para maiores informações verificar a propriedade `p-favorite-service` do componente `po-breadcrumb`.
   *
   */
  favorite?: string;

  /**
   * @description
   *
   * Lista de itens do _breadcrumb_.
   *
   * **Exemplo:**
   * ```
   * { label: 'Po Portal', link: 'portal' }
   * ```
   */
  items: Array<PoBreadcrumbItem>;

  /**
   * @optional
   *
   * @description
   *
   * Objeto que possibilita o envio de parâmetros adicionais à requisição.
   */
  params?: object;
}
