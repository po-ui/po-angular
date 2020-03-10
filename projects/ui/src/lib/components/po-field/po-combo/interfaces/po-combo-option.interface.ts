/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface que define as opções que serão exibidas na lista do `po-combo`.
 */
export interface PoComboOption {
  /**
   * @optional
   *
   * @description
   *
   * Descrição exibida nas opções da lista.
   *
   * > Caso não seja definida será assumido o valor definido na propriedade `value`.
   */
  label?: string;

  /** Valor do objeto que será atribuído ao *model*. */
  value: string | number;
}
