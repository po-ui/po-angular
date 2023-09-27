import { Input, Directive } from '@angular/core';

import { PoBreadcrumbItem } from './po-breadcrumb-item.interface';

/**
 * @description
 *
 * Este componente gera uma estrutura de navegação que apresenta ao usuário a localização
 * da URL atual, exibindo as antecessoras conforme é realizado a navegação na aplicação.
 *
 * Quando não houver espaçamento suficiente para exibi-lás, o componente se encarrega também
 * de agrupar as URLs antecessoras, gerando assim um ícone que permite a visualização em cascata.
 *
 * Caso um endereço seja especificado na propriedade `p-favorite-service`, o componente permite ao usuário
 * favoritar a URL.
 *
 * Havendo necessidade de incluir parâmetros na requisição do serviço,
 * o componente dispõe da propriedade `p-params-service` que recebe um objeto contendo as informações.
 */
@Directive()
export class PoBreadcrumbBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Permite definir uma URL no componente `po-breadcrumb` para favoritar ou desfavoritar.
   * > Para utilizar esta propriedade, o último `PoBreadcrumbItem` da lista de items da propriedade `p-items` deve ter um link informado.
   *
   * > A API deve estar preparada para retornar um objeto no formato `{ isFavorite: boolean }`.
   *
   * Ao iniciar, o `po-breadcrumb` faz um GET na URL definida na propriedade `p-favorite-service` e deve retornar a propriedade
   * `{ isFavorite: boolean }` do último `PoBreadcrumbItem` definido na lista de itens da propriedade `p-items`.
   *
   * Ao clicar em favoritar ou desfavoritar o `po-breadcrumb` faz um POST com o link e a propriedade `{ isFavorite: boolean }`
   * definidos no último item da propriedade `p-items`.
   *
   * > Caso algum parâmetro seja definido na propriedade `p-params-service`, o mesmo será enviado para a API e retornará
   * após fazer um GET ou POST.
   *
   * Exemplo de URL contendo o serviço de favoritar ou desfavoritar:
   *
   * ```
   * https://po-ui.io/sample/api/favorite
   * ```
   *
   * Ao fazer o GET o `po-breadcrumb` concatena o link com a URL de serviço. Exemplo:
   *
   * ```
   * GET http://<domain>/api/favorite?url=/example
   * ```
   *
   * ```
   * GET http://po.com.br/sample/api/favorite?url=/example
   * ```
   *
   * ```
   * POST
   * payload: { isFavorite: true, url: '/example' }
   * ```
   *
   * Caso possua parâmetros definidos na propriedade `p-params-service`:
   *
   * ```
   * POST
   * payload: { isFavorite: true, url: "/example", params: "{ id: 14, user: 'dev.po' }" }
   * ```
   *
   * Exemplos de retorno:
   *
   * ```
   * { isFavorite: true, url: "/example" }
   * ```
   *
   * ```
   * { isFavorite: false, url: "/example" }
   * ```
   *
   * ```
   * { isFavorite: false, url: "/example", params: "{ id: 14, user: 'dev.po' }" }
   * ```
   */
  @Input('p-favorite-service') favoriteService?: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto que possibilita o envio de parâmetros adicionais à requisição.
   */
  @Input('p-params-service') paramsService?: object;

  itemsView: Array<PoBreadcrumbItem> = [];
  itemsViewPopup: Array<any> = [];

  protected clickoutListener: () => void;
  protected resizeListener: () => void;

  private _items: Array<PoBreadcrumbItem> = [];

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
  @Input('p-items') set items(items: Array<PoBreadcrumbItem>) {
    this._items = items;
    this.itemsView = [].concat(items);
    if (this.itemsView.length >= 4) {
      this.transformToArrayPopup(items);
    }
  }

  get items() {
    return this._items;
  }

  private transformToArrayPopup(items: Array<PoBreadcrumbItem>) {
    const itemsCopy = items.map(obj => ({ ...obj }));
    itemsCopy.shift();
    itemsCopy.splice(-2, 1);
    itemsCopy.pop();
    this.itemsViewPopup = this.transformArrayToActionPopUp(itemsCopy);
  }

  private transformArrayToActionPopUp(items: Array<PoBreadcrumbItem>) {
    return items.map(obj => {
      if (obj.hasOwnProperty('link')) {
        obj['url'] = obj.link;
        delete obj.link;
        if (obj.hasOwnProperty('action')) {
          delete obj.action;
        }
      }
      return obj;
    });
  }
}
