/**
 * @docsPrivate
 *
 * @usedBy PoGaugeComponent
 *
 * @description
 *
 * Interface que define o objeto com as coordenadas do gauge.
 */
export interface PoGaugeCoordinates {
  /** A cor do alcance. Aceita hexadecimais, string com nome da cor, RGB ou então uma das classes de cor do PO. */
  color?: string;

  /** Definição de coordenadas. */
  coordinates: string;

  /** O raio do circulo. Utilizado para posicionar o ponteiro no centro do gauge. */
  radius?: number;

  /** O grau de angulação do ponteiro. */
  pointerDegrees?: number;
}
