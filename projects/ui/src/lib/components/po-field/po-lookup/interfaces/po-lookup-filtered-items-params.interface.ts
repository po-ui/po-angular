/**
 * @usedBy PoLookupComponent
 *
 * @description
 *
 * Interface do objeto enviado como parâmetro na função `getFilteredItems`.
 */
export interface PoLookupFilteredItemsParams {
  /**
   * Conteúdo utilizado para filtrar a lista de itens.
   */
  filter?: string;

  /**
   * Controla a paginação dos dados e recebe valor automaticamente a cada clique no botão 'Carregar mais resultados'.
   */
  page?: number;

  /**
   * Quantidade de itens retornados cada vez que o serviço é chamado, por padrão é 10.
   */
  pageSize?: number;

  /**
   * Valor informado através da propriedade `p-filter-params`.
   */
  filterParams?: any;

  /**
   * Coluna que está sendo ordenada na tabela.
   *
   * - Coluna decrescente será informada da seguinte forma: `-<colunaOrdenada>`, por exemplo `-name`.
   * - Coluna ascendente será informada da seguinte forma: `<colunaOrdenada>`, por exemplo `name`.
   */
  order?: string;

  /**
   *
   * Valores informados nos campos de busca avançada, que serão utilizados para filtrar a lista de itens.
   *
   */
  advancedFilters?: { [key: string]: any };
}
