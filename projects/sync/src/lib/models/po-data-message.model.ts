import { PoDataTransform } from './po-data-transform.model';

/**
 * @docsPrivate
 *
 * @description
 *
 * Classe responsável por implementar a classe `PoDataTransform` com os campos referentes ao padrão de
 * [API do PO UI](https://po-ui.io/guides/api).
 */
export class PoDataMessage extends PoDataTransform {
  /**
   * Retorna a propriedade `po_sync_date`, responsável por informar a data da última sincronização no guia de
   * [API do PO UI](https://po-ui.io/guides/api).
   *
   * @returns {string} Nome do campo que contém a data da última sincronização.
   */
  getDateFieldName(): string {
    return 'po_sync_date';
  }

  /**
   * Retorna a propriedade `items`, responsável por informar a lista de registros vindos da API no guia de
   * [API do PO UI](https://po-ui.io/guides/api).
   *
   * @returns {string} Nome da propriedade que contém a lista de registros.
   */
  getItemsFieldName(): string {
    return 'items';
  }

  /**
   * Retorna a propriedade `page`, responsável por informar o número da página de registros que a API retorna no guia de
   * [API do PO UI](https://po-ui.io/guides/api).
   *
   * @returns {string} Nome da propriedade responsável por informar o número da página de registros.
   */
  getPageParamName(): string {
    return 'page';
  }

  /**
   * Retorna a propriedade `pageSize`, responsável pela quantidade de registros que serão exibidos por página no guia de
   * [API do PO UI](https://po-ui.io/guides/api).
   *
   * @returns {string} Nome do parâmetro responsável pela quantidade de registros por página.
   */
  getPageSizeParamName(): string {
    return 'pageSize';
  }

  /**
   * Retorna um valor `boolean`, de acordo com a propriedade `hasNext` que é responsável por informar se há uma nova
   * página de registros disponível no guia de [API do PO UI](https://po-ui.io/guides/api).
   *
   * @returns {boolean} Informa se tem próxima página de registros.
   */
  hasNext(): boolean {
    return this.data.hasNext;
  }
}
