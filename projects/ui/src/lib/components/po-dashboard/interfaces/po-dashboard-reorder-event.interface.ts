import { PoDashboardCard } from './po-dashboard-card.interface';

/**
 * @usedBy PoDashboardComponent
 *
 * @description
 *
 * Interface emitida pelo evento `p-cards-reorder` do `po-dashboard`,
 * contendo os dados da operação de reordenação.
 */
export interface PoDashboardReorderEvent {
  /**
   * @description
   *
   * Nova lista de cards na ordem resultante após a operação de drag and drop.
   */
  cards: Array<PoDashboardCard>;

  /**
   * @description
   *
   * Índice anterior do card que foi movido.
   */
  previousIndex: number;

  /**
   * @description
   *
   * Novo índice do card após ser movido.
   */
  currentIndex: number;
}
