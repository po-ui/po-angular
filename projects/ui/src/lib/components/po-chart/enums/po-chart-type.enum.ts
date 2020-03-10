/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Enum* `PoChartType` para especificação dos tipos de gráficos.
 */
export enum PoChartType {
  /**
   * Exibe os dados em formato de rosca, dividindo em partes proporcionais.
   */
  Donut = 'donut',

  /**
   * O gráfico de *gauge* fornece como opção uma melhor relação de intensidade de dados que nos gráficos de pizza padrão ou rosca, uma vez
   * que o centro em branco pode ser usado para exibir dados adicionais relacionados.
   */
  Gauge = 'gauge',

  /**
   * Exibe os dados em formato circular, dividindo proporcionalmente em fatias.
   */
  Pie = 'pie'
}
