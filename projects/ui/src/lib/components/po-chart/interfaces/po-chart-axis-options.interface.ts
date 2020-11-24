/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Interface* que define os eixos do grid.
 */
export interface PoChartAxisOptions {
  /**
   * Número de linhas exibidas no eixo X dos gráficos do tipo `Line` e `Column`.
   * Para gráficos do tipo `Bar` define-se as linhas do eixo Y.
   *
   * - Valor padrão: '5';
   * - Valor mínimo permitido: '2';
   * - Máximo Máximo permitido: '10';
   */
  axisXGridLines?: number;

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
