/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto da série `PoChartType.Gauge`.
 */
export interface PoChartGaugeSerie {
  color?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o texto que será exibido na área interna e centralizado ao gráfico.
   *
   * > Caso o conteúdo ultrapasse o tamanho disponível, será gerado automaticamente reticências e será possível visualizar a mensagem
   * através de um *tooltip* ao passar o *mouse* sobre o conteúdo.
   */
  description?: string;

  /**
   * @description
   *
   * Define o valor que será exibido no gráfico, sendo possível atribuir entre 0 e 100.
   *
   * > **Importante:**
   * - Valores inferiores a 0 serão convertidos para 0;
   * - Valores superiores a 100 serão convertidos para 100.
   */
  value: number;
}
