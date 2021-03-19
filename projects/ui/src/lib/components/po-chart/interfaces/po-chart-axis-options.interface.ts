/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* que define os eixos do grid.
 */
export interface PoChartAxisOptions {
  /**
   * Define a quantidade de linhas exibidas no grid.
   * Para os gráficos dos tipos `Area`, `Line` e `Column`, as linhas modificadas serão as horizontais (eixo X).
   * Já para gráficos do tipo `Bar`, tratará as linhas verticais (eixo Y).
   *
   * A propriedade contém as seguintes diretrizes para seu correto funcionamento:
   * - Quantidade padrão de linhas: '5';
   * - Quantidade mínima permitida: '2';
   * - Quantidade máxima permitida: '10';
   */
  gridLines?: number;

  /**
   * Define o alcance de valor máximo exibido no eixo Y.
   * Caso não seja definido valor, o valor de alcance máximo exibido será o maior existente entre as séries.
   * Se por acaso o valor máximo das séries for superior ao definido aqui, esta propriedade será ignorada.
   *
   * > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
   */
  maxRange?: number;

  /**
   * Define o alcance mínimo exibido no eixo Y.
   * Caso não seja definido valor, o valor-base de alcance mínimo será o menor encontrado entre as séries.
   * Se houver valores negativos nas séries, o menor deles será a base mínima.
   * Se por acaso o valor mínimo das séries for inferior ao definido aqui, esta propriedade será ignorada.
   *
   * > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
   */
  minRange?: number;
}
