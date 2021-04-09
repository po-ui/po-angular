/**
 *
 * @description
 *
 * Interface do objeto enviado como parâmetro da função `getItems`.
 */
export interface PoTableFilteredItemsParams {
  /**
   * Conteúdo utilizado para filtrar a lista de items.
   */
  filter?: string;

  /**
   * Controla a paginação dos dados e recebe um valor automaticamente a cada clique no botão 'Carregar mais resultados'.
   */
  page?: number;

  /**
   * Quantidade de itens retornados cada vez que o serviço é chamado, por padrão é 10.
   */
  pageSize?: number;

  /**
   * Coluna que está sendo ordenada na tabela.
   *
   * - Coluna decrescente será informada da seguinte forma: `-<colunaOrdenada>`, por exemplo `-name`.
   * - Coluna ascendente será informada da seguinte forma: `<colunaOrdenada>, por exemplo `name`.
   */
  order?: string;
}
