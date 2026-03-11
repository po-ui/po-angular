/**
 * Interface para definir um preset de intervalo de datas no calendário.
 *
 * Cada preset possui um rótulo identificador e uma função que calcula
 * dinamicamente o intervalo de datas com base na data atual.
 */
export interface PoCalendarRangePreset {
  /** Identificador/rótulo de exibição do preset. */
  label: string;

  /** Função que calcula dinamicamente o intervalo de datas relativo à data informada. */
  dateRange: (today: Date) => { start: Date; end: Date };
}
