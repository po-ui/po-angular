/**
 * @usedBy PoFilterChipComponent
 *
 * @description
 *
 * Interface que define o objeto emitido pelo evento `p-selected-change`.
 */
export interface PoFilterChipSelectedChange {
  /** Rótulo de texto do *chip*. */
  label: string;

  /** Estado de seleção do *chip* (`true` para selecionado, `false` para desmarcado). */
  selected: boolean;
}
