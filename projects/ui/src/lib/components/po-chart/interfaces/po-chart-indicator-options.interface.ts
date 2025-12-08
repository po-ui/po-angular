/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface para configurações dos indicadores do gráfico `radar`.
 */
export interface PoChartIndicatorOptions {
  /**
   * @optional
   *
   * @description
   *
   * Cor do texto do indicator.
   * Recomendamos avaliar o contraste da cor definida para garantir melhor acessibilidade.
   *
   * > Nome da cor, hexadecimal ou RGB.
   */
  color?: string;

  /**
   * @optional
   *
   * @description
   *
   * Nome do indicator.
   */
  name?: string;

  /**
   * @optional
   *
   * @description
   *
   * Valor máximo do indicator.
   *
   * A propriedade `max` não impede que a série contenha valores superiores ao máximo definido.
   * Caso isso ocorra, os valores poderão extrapolar os limites do gráfico.
   */
  max?: number;

  /**
   * @optional
   *
   * @description
   *
   * Valor mínimo do indicator, com valor padrão de 0.
   *
   * A propriedade `min` não impede que a série contenha valores inferiores ao mínimo definido.
   * Caso isso ocorra, os valores serão apresentados ao centro do gráfico.
   */
  min?: number;
}
