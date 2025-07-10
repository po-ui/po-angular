/**
 * @usedBy PoSearchComponent
 *
 * @description
 *
 * Interface que define o resumo de localização do filtro `p-filter-locate`.
 */
export interface PoSearchLocateSummary {
  /** Índice atual da ocorrência localizada. */
  currentIndex: number;

  /** Total de ocorrências encontradas. */
  total: number;
}
