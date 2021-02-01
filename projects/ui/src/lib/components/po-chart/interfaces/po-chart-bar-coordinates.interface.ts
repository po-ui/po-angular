/**
 * @docsPrivate
 *
 * @usedBy PoChartComponent
 *
 * @description
 *
 * Interface que define o objeto com as coordenadas das colunas para os gráfico dos tipos barra e coluna.
 */
export interface PoChartBarCoordinates {
  /** Categoria do eixo Y na qual o item da série está presente. */
  category: string;

  /** A cor da série. */
  color?: string;

  /** A série para a qual correspondem as coordenadas. */
  label: string;

  /** O texto de exibição no tooltip. */
  tooltipLabel: string;

  /** Valor da série. */
  data: number;

  /** Coordenadas da coluna. */
  coordinates: string;
}
