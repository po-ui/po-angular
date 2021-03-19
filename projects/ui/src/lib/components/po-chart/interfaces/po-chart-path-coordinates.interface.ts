/**
 * @docsPrivate
 *
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto com as coordenadas das linhas do gráfico (chart-path).
 */
export interface PoChartPathCoordinates {
  /** A cor da série. */
  color?: string;

  /** As coordenadas da série. */
  coordinates?: string;

  /** Valor da série. */
  data?: number;

  /** Indica se é elemento ao qual o cursor está selecionado. */
  isActive?: boolean;

  /** A série para a qual correspondem as coordenadas. */
  label?: string;

  /** O texto de exibição no tooltip. */
  tooltipLabel?: string;
}
