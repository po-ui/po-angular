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

  /** Indica se é elemento não está em foco. */
  isBlur?: boolean;

  /** Indica se o valor da série está mostrando fixado na tela. */
  isFixed?: boolean;
}
