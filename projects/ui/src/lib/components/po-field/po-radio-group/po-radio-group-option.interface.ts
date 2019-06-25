/**
 * @usedBy PoRadioGroupComponent
 *
 * @description
 *
 * Interface para as ações do componente po-radio-group.
 */
export interface PoRadioGroupOption {
  /** Texto do radio. */
  label: string;

  /** Valor do radio. */
  value: string | number;

  /** Desabilita o radio. */
  disabled?: boolean;
}
