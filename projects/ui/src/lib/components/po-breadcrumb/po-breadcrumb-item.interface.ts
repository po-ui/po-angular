/**
 * @usedBy
 *
 * PoBreadcrumb, PoBreadcrumbComponent, PoBreadcrumbBaseComponent,
 * PoPageDefaultComponent, PoPageDetailComponent, PoPageEditComponent, PoPageListComponent
 *
 * @description
 *
 * Interface que define cada item do componente **po-breadcrumb**.
 */
export interface PoBreadcrumbItem {
  /**
   * Ação executada ao clicar no item.
   *
   * > A função atribuída a esta propriedade receberá o _label_ do item como parâmetro para execução.
   */
  action?: Function;

  /** Rótulo do item. */
  label: string;

  /**
   * Url do item.
   *
   * > Caso o item também contenha uma *action* definida, a preferência de execução será do *link*.
   *
   * > Para o correto funcionamento, é necessário que haja uma rota referenciando seu valor.
   * **[Veja um exemplo de como criar rotas aqui](/guides/getting-started)**.
   *
   * > Esta propriedade é necessária para que a propriedade `p-favorite-service` consiga favoritar ou desfavoritar.
   */
  link?: string;
}
