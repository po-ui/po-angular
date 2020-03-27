/**
 * @description
 *
 * Classe responsável por adaptar dados de APIs que não seguem
 * o padrão de [API do PO UI](https://po-ui.io/guides/api).
 *
 * Essa classe deve ser estendida por uma classe que implemente cada um de seus métodos, adaptando os parâmetros de
 * acordo com a API do *backend* existente que se deseja comunicar.
 */

export abstract class PoDataTransform {
  protected data: any;

  /**
   * Retorna o nome da propriedade responsável por informar a data da última sincronização.
   *
   * @returns {string} Nome do campo que contém a data da última sincronização.
   */
  abstract getDateFieldName(): string;

  /**
   * Retorna o nome da propriedade responsável por informar a lista de registros vindos da API.
   *
   * @returns {string} Nome da propriedade que contém a lista de registros.
   */
  abstract getItemsFieldName(): string;

  /**
   * Retorna o nome da propriedade responsável por informar o número da página de registros que a API
   * recebe como parâmetro.
   *
   * @returns {string} Nome da propriedade responsável por informar o número da página de registros.
   */
  abstract getPageParamName(): string;

  /**
   * Retorna o nome da propriedade responsável pela quantidade de registros que serão exibidos por página
   * que a API recebe como parâmetro.
   *
   * @returns {string} Nome da propriedade responsável pela quantidade de registros por página.
   */
  abstract getPageSizeParamName(): string;

  /**
   * Retorna um valor `boolean`, responsável por informar se há uma nova página de registros disponível.
   *
   * @returns {boolean} Informa se existe próxima página de registros.
   */
  abstract hasNext(): boolean;

  /**
   * @docsPrivate
   *
   * Método responsável por receber e armazenar os dados retornados pela API para manipulação na classe `PoDataTransform`.
   *
   * @param {any} data Dados retornados pela API.
   */
  transform(data: any): void {
    this.data = data;
  }
}
