/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface para definição dos literais usadas no `po-chart`.
 */
export interface PoChartLiterals {
  /**
   * @optional
   *
   * @description
   *
   * Texto exibido para a ação de download de dados em formato CSV.
   */
  downloadCSV?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto do botão para exportar o gráfico em CSV.
   */
  exportCSV?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto do botão para exportar o gráfico como imagem JPG.
   */
  exportJPG?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto do botão para exportar o gráfico como imagem PNG.
   */
  exportPNG?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto da primeira coluna da tabela quando o gráfico é do tipo `Gauge`.
   */
  value?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto dos títulos das colunas `Gauge` e não possui label.
   */
  item?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto da primeira coluna da tabela em todos os gráficos com exceção do `Bar` e `Gauge`.
   */
  serie?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto da primeira coluna da tabela no gráfico do tipo `Bar`.
   */
  category?: string;
}
