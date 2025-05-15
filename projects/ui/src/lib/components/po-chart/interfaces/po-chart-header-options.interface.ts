/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* para configuração das ações disponíveis no cabeçalho.
 */
export interface PoChartHeaderOptions {
  /**
   * @optional
   *
   * @description
   *
   * Define se o botão responsável por expandir o gráfico deve ser ocultado.
   *
   * @default `false`
   */
  hideExpand?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define se o botão responsável por exibir os detalhes do gráfico em formato de tabela deve ser ocultado.
   *
   * @default `false`
   */
  hideTableDetails?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define se a opção de exportação do gráfico em formato CSV deve ser ocultada.
   *
   * @default `false`
   */
  hideExportCsv?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define se a opção de exportação do gráfico nos formatos JPG e PNG deve ser ocultada.
   *
   * @default `false`
   */
  hideExportImage?: boolean;
}
