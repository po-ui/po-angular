/**
 * @docsPrivate
 *
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto com as coordenadas dos pontos das linhas do gráfico do tipo linha.
 */
export interface PoChartPointsCoordinates {
  /** Categoria do eixo Y na qual o item da série está presente. */
  category: string;

  /** A série para a qual correspondem as coordenadas. */
  label: string;

  /** O texto de exibição no tooltip. */
  tooltipLabel: string;

  /** Valor da série. */
  data: number;

  /** Coordenada horizontal. */
  xCoordinate: number;

  /** Coordenada vertical. */
  yCoordinate: number;
}
