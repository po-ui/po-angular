/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Enum* `PoChartType` para especificação dos tipos de gráficos.
 */
export enum PoChartType {
  /**
   * Tipo de gráfico que exibe os dados de modo quantitativo, utilizando linhas contínuas demarcadas por pontos para cada valor de série definido.
   * Similar ao gráfico de linha, diferencia-se pela área localizada abaixo da linha das séries, que é preenchida com cores para um destaque explícita da evolução e mudança dos dados.
   */
  Area = 'area',

  /**
   * Exibe os dados em formato de rosca, dividindo em partes proporcionais.
   */
  Donut = 'donut',

  /**
   * @deprecated 6.x.x
   *
   * @description
   *
   * **Deprecated 6.x.x**
   *
   * O gráfico de *gauge* fornece como opção uma melhor relação de intensidade de dados que nos gráficos de pizza padrão ou rosca, uma vez
   * que o centro em branco pode ser usado para exibir dados adicionais relacionados.
   *
   * > Componente depreciado, por favor utilizar componente [po-gauge](/documentation/po-gauge).
   */
  Gauge = 'gauge',

  /**
   * Exibe os dados em formato circular, dividindo proporcionalmente em fatias.
   */
  Pie = 'pie',

  /**
   * Gráfico que mostra os dados de modo linear e contínuo. É útil, por exemplo, para fazer comparações de tendência durante determinado período.
   * Pode ser utilizado em conjunto com gráficos dos tipos `column` e `area`, definindo-se o tipo através da propriedade `PoChartSerie.type`.
   */
  Line = 'line',

  /**
   * Gráfico que exibe os dados em forma de barras verticais e sua extensão varia de acordo com seus valores. É comumente usado como comparativo entre diversas séries.
   * As séries são exibidas lado-a-lado, com um pequeno espaço entre elas.
   */
  Column = 'column',

  /**
   * Gráfico que exibe os dados em forma de barras horizontais e sua extensão varia de acordo com seus valores. É comumente usado como comparativo de séries e categorias.
   */
  Bar = 'bar'
}
