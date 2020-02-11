import { Observable } from 'rxjs';

import { PoLookupResponseApi } from './po-lookup-response-api.interface';

/**
 * @usedBy PoLookupComponent
 *
 * @description
 *
 * Define o tipo de busca utilizado no po-lookup.
 */
export interface PoLookupFilter {

  /**
   * Método responsável por enviar um filtro para o serviço e receber os dados.
   *
   * Os parâmetros page e pageSize seguem o guia de implementação das APIs TOTVS, são utilizados para controlar a busca dos dados em cada
   * requisição do botão 'Carregar mais resultados'.
   *
   * Este método deve retornar um *Observable* com a resposta da API no formato da interface `PoLookupResponseApi`.
   *
   * @param {any} filter Utilizado pelo serviço para filtrar os dados.
   * @param {number} page Controla a paginação dos dados e recebe valor automaticamente a cada clique no botão 'Carregar mais resultados'.
   * @param {number} pageSize Quantidade de itens retornados cada vez que o serviço é chamado, por padrão é 10.
   * @param {any} filterParams Valor informado através da propriedade `p-filter-params`.
   */
  getFilteredData(filter: any, page: number, pageSize?: number, filterParams?: any): Observable<PoLookupResponseApi>;

  /**
   * Método responsável por enviar um valor que será buscado no serviço.
   *
   * @param {string} value Valor único a ser buscado na fonte de dados.
   * @param {any} filterParams Valor informado através da propriedade `p-filter-params`.
   */
  getObjectByValue(value: string, filterParams?: any): Observable<any>;

}
