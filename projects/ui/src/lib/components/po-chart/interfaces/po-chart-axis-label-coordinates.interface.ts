/**
 * @docsPrivate
 *
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto com as coordenadas dos textos dos eixos(axis).
 */
export interface PoChartAxisLabelCoordinates {
  /** Define o texto do eixo correspondente. */
  label: string;

  /** Coordenada horizontal. */
  xCoordinate: number;

  /** Coordenada vertical. */
  yCoordinate: number;
}
